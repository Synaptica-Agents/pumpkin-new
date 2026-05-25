import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  buildTurnSystemPrompt,
  computeDifficultyAtElapsed,
  nextStage,
  SESSION_MAX_SECONDS,
  TOOL_JUDGE_AND_RESPOND,
  TOOL_TRANSITION,
  type QuestionRow,
  type QuestionType,
  type TurnHistoryEntry,
} from "../_shared/ibPrompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VOICE_ID = "GoXyzBapJk3AoCJoMQl9";
const TTS_MODEL = "eleven_multilingual_v2";

async function synthesizeTTS(text: string, apiKey: string): Promise<Uint8Array> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: TTS_MODEL,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0 },
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  return new Uint8Array(await res.arrayBuffer());
}

async function uploadAudio(
  supabase: ReturnType<typeof createClient>,
  sessionId: string,
  turnId: string,
  audio: Uint8Array,
): Promise<string> {
  const path = `sessions/${sessionId}/${turnId}.mp3`;
  const { error } = await supabase.storage
    .from("ib-bot-audio")
    .upload(path, audio, { contentType: "audio/mpeg", upsert: true });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return path;
}

async function getSignedUrl(
  supabase: ReturnType<typeof createClient>,
  path: string,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("ib-bot-audio")
    .createSignedUrl(path, 3600);
  if (error) {
    console.error("Signed URL error:", error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}

async function pickQuestion(
  supabase: ReturnType<typeof createClient>,
  archetype: string,
  stage: QuestionType,
  difficulty: number,
  company: string | null,
  excludeIds: string[],
): Promise<QuestionRow | null> {
  // Exact match first
  let query = supabase
    .from("ib_questions")
    .select("id, prompt, optimal_answer, key_points, archetype, question_type, difficulty_level, topic")
    .eq("archetype", archetype)
    .eq("question_type", stage)
    .eq("difficulty_level", difficulty)
    .eq("active", true);

  if (excludeIds.length > 0) query = query.not("id", "in", `(${excludeIds.join(",")})`);
  if (company) query = query.or(`company.is.null,company.eq.${company}`);

  const { data } = await query.limit(1);
  if (data && data.length > 0) return data[0] as QuestionRow;

  // Fallback: try neighbouring difficulty
  for (const delta of [-1, 1, -2, 2]) {
    const d = difficulty + delta;
    if (d < 1 || d > 5) continue;
    let q2 = supabase
      .from("ib_questions")
      .select("id, prompt, optimal_answer, key_points, archetype, question_type, difficulty_level, topic")
      .eq("archetype", archetype)
      .eq("question_type", stage)
      .eq("difficulty_level", d)
      .eq("active", true);
    if (excludeIds.length > 0) q2 = q2.not("id", "in", `(${excludeIds.join(",")})`);
    const { data: d2 } = await q2.limit(1);
    if (d2 && d2.length > 0) return d2[0] as QuestionRow;
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!OPENROUTER_API_KEY || !ELEVENLABS_API_KEY || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const startMs = Date.now();
    const body = await req.json();
    const { session_id, user_transcript, input_mode } = body as {
      session_id: string;
      user_transcript: string;
      input_mode: "text" | "audio";
    };

    if (!session_id || !user_transcript || !input_mode) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: session_id, user_transcript, input_mode" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Load session
    const { data: session, error: sessErr } = await supabase
      .from("ib_sessions")
      .select("*")
      .eq("id", session_id)
      .single();

    if (sessErr || !session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (session.ended_at) {
      return new Response(
        JSON.stringify({ error: "Session already ended", session_ended_reason: session.end_reason }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Time check
    const startedAt = new Date(session.started_at as string).getTime();
    const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
    const timeRemaining = Math.max(0, SESSION_MAX_SECONDS - elapsedSec);

    if (elapsedSec >= SESSION_MAX_SECONDS) {
      // End session
      await supabase
        .from("ib_sessions")
        .update({ ended_at: new Date().toISOString(), end_reason: "time_limit" })
        .eq("id", session_id);

      return new Response(
        JSON.stringify({
          bot_response_text: "Die Zeit ist um. Ich fasse jetzt dein Feedback zusammen.",
          bot_audio_url: null,
          session_state: {
            session_id,
            current_archetype: session.current_archetype,
            current_stage: session.current_stage,
            current_difficulty: session.current_difficulty,
            max_difficulty: session.max_difficulty,
            turn_index: -1,
            time_remaining_sec: 0,
            started_at: session.started_at,
          },
          session_ended_reason: "time_limit",
          judge_verdict: "n/a",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Compute effective difficulty (time-based bump)
    const effectiveDifficulty = computeDifficultyAtElapsed(
      session.starting_difficulty as number,
      session.max_difficulty as number,
      elapsedSec,
    );

    // Load turn history (last 6 turns incl. last bot turn which holds the active question)
    const { data: turnsDesc } = await supabase
      .from("ib_turns")
      .select("*")
      .eq("session_id", session_id)
      .order("turn_index", { ascending: false })
      .limit(6);

    const turns = (turnsDesc ?? []).reverse();
    const lastBotTurn = [...turns].reverse().find((t) => t.bot_response && t.question_id);
    const nextTurnIndex = turns.length > 0 ? (turns[turns.length - 1].turn_index as number) + 1 : 1;

    // Active question = question_id from last bot turn
    let activeQuestion: QuestionRow | null = null;
    if (lastBotTurn?.question_id) {
      const { data: q } = await supabase
        .from("ib_questions")
        .select("id, prompt, optimal_answer, key_points, archetype, question_type, difficulty_level, topic")
        .eq("id", lastBotTurn.question_id)
        .single();
      if (q) activeQuestion = q as QuestionRow;
    }

    // Load already-used question IDs to avoid repeats
    const usedQuestionIds = turns
      .map((t) => t.question_id)
      .filter((id): id is string => !!id);

    // Determine candidate next question based on current session state
    const currentArchetype = session.current_archetype as string;
    const currentStage = session.current_stage as QuestionType;

    const nextCandidate = await pickQuestion(
      supabase,
      currentArchetype,
      currentStage,
      effectiveDifficulty,
      session.company as string | null,
      usedQuestionIds,
    );

    // Build prompt
    const turnHistory: TurnHistoryEntry[] = turns.map((t) => ({
      turn_index: t.turn_index as number,
      user_transcript: t.user_transcript as string | null,
      bot_response: t.bot_response as string | null,
      judge_verdict: t.judge_verdict as string | null,
      archetype: t.archetype as string | null,
      stage: t.archetype_stage as string | null,
    }));

    const systemPrompt = buildTurnSystemPrompt({
      archetype: currentArchetype,
      stage: currentStage,
      difficulty: effectiveDifficulty,
      topics: session.topics as string[],
      company: session.company as string | null,
      turn_history: turnHistory,
      active_question: activeQuestion,
      next_question: nextCandidate,
      is_first_turn: false,
    });

    // Claude call
    const aiResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4.6",
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Benutzer-Antwort auf die aktuelle Frage: "${user_transcript}"` },
        ],
        tools: [TOOL_JUDGE_AND_RESPOND, TOOL_TRANSITION],
        tool_choice: "required",
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      throw new Error(`AI call failed: ${aiResp.status} ${t}`);
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI returned no tool call");

    const toolName = toolCall.function.name as string;
    const toolArgs = typeof toolCall.function.arguments === "string"
      ? JSON.parse(toolCall.function.arguments)
      : toolCall.function.arguments;

    let botResponse: string;
    let verdict: string;
    let missingPoints: string[] = [];
    let judgeRationale: string;
    let questionIdUsed: string | null = null;
    let nextArchetype = currentArchetype;
    let nextSessionStage: QuestionType = currentStage;
    let movedToNextArchetype = false;

    if (toolName === "transition_to_new_archetype") {
      verdict = toolArgs.judge_verdict;
      botResponse = toolArgs.bot_response;
      judgeRationale = toolArgs.judge_rationale ?? "stage passed";
      questionIdUsed = toolArgs.next_question_id_used ?? null;

      // Pop next archetype from queue
      const queue = (session.archetype_queue as string[]) ?? [];
      const currentIdx = queue.indexOf(currentArchetype);
      const next = currentIdx >= 0 && currentIdx + 1 < queue.length
        ? queue[currentIdx + 1]
        : currentArchetype; // fallback: repeat current at higher SL

      nextArchetype = next;
      nextSessionStage = "wiedergabe";
      movedToNextArchetype = true;
    } else {
      verdict = toolArgs.verdict;
      botResponse = toolArgs.bot_response;
      missingPoints = toolArgs.missing_points ?? [];
      judgeRationale = toolArgs.judge_rationale ?? "";
      questionIdUsed = toolArgs.next_question_id_used ?? null;

      const advance = toolArgs.advance_to_stage as string;
      if (advance === "same") {
        nextSessionStage = currentStage;
      } else if (advance === "anwendung" || advance === "verstaendnis") {
        nextSessionStage = advance;
      } else {
        const n = nextStage(currentStage);
        nextSessionStage = n === "next_archetype" ? "verstaendnis" : n;
      }
    }

    // TTS
    const ttsAudio = await synthesizeTTS(botResponse, ELEVENLABS_API_KEY);

    // Insert turn
    const { data: turn, error: turnErr } = await supabase
      .from("ib_turns")
      .insert({
        session_id,
        turn_index: nextTurnIndex,
        question_id: questionIdUsed,
        archetype: currentArchetype,
        archetype_stage: currentStage,
        difficulty_level: effectiveDifficulty,
        user_input_mode: input_mode,
        user_transcript,
        bot_response: botResponse,
        judge_verdict: verdict,
        judge_rationale: judgeRationale,
        judge_missing_points: missingPoints,
        moved_to_next_archetype: movedToNextArchetype,
        bot_generation_time_ms: Date.now() - startMs,
      })
      .select()
      .single();

    if (turnErr || !turn) throw new Error(`Turn insert failed: ${turnErr?.message}`);

    const audioPath = await uploadAudio(supabase, session_id, turn.id as string, ttsAudio);
    await supabase.from("ib_turns").update({ bot_audio_storage_path: audioPath }).eq("id", turn.id);
    const signedUrl = await getSignedUrl(supabase, audioPath);

    // Update session state
    await supabase
      .from("ib_sessions")
      .update({
        current_archetype: nextArchetype,
        current_stage: nextSessionStage,
        current_difficulty: effectiveDifficulty,
      })
      .eq("id", session_id);

    return new Response(
      JSON.stringify({
        bot_response_text: botResponse,
        bot_audio_url: signedUrl,
        session_state: {
          session_id,
          current_archetype: nextArchetype,
          current_stage: nextSessionStage,
          current_difficulty: effectiveDifficulty,
          max_difficulty: session.max_difficulty,
          turn_index: nextTurnIndex,
          time_remaining_sec: timeRemaining,
          started_at: session.started_at,
        },
        judge_verdict: verdict,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ib-turn error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
