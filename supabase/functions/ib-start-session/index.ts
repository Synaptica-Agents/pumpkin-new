import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  mapRatingToDifficulty,
  IB_TOPICS,
  TOOL_INTRO,
  SESSION_MAX_SECONDS,
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
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: TTS_MODEL,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0 },
      }),
    },
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${t}`);
  }
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENROUTER_API_KEY || !ELEVENLABS_API_KEY || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const body = await req.json();
    const { user_email, user_rating, topics, company } = body as {
      user_email: string;
      user_rating: number;
      topics: string[];
      company?: string | null;
    };

    if (!user_email || typeof user_rating !== "number" || !Array.isArray(topics) || topics.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: user_email, user_rating, topics[]" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const invalidTopics = topics.filter((t) => !IB_TOPICS.includes(t as typeof IB_TOPICS[number]));
    if (invalidTopics.length > 0) {
      return new Response(
        JSON.stringify({ error: `Invalid topics: ${invalidTopics.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { starting_difficulty, max_difficulty } = mapRatingToDifficulty(user_rating);

    // Build archetype queue: 2-3 archetypes per selected topic, round-robin interleaved
    const { data: archetypeRows, error: archErr } = await supabase
      .from("ib_questions")
      .select("archetype, topic")
      .in("topic", topics)
      .eq("active", true);

    if (archErr) throw new Error(`DB query failed: ${archErr.message}`);

    const perTopic: Record<string, string[]> = {};
    for (const row of archetypeRows ?? []) {
      const t = row.topic as string;
      const a = row.archetype as string;
      if (!perTopic[t]) perTopic[t] = [];
      if (!perTopic[t].includes(a)) perTopic[t].push(a);
    }

    // Round-robin: take up to 3 archetypes per topic, interleave across topics
    const queue: string[] = [];
    const maxPerTopic = 3;
    for (let i = 0; i < maxPerTopic; i++) {
      for (const t of topics) {
        const pool = perTopic[t] ?? [];
        if (pool[i]) queue.push(pool[i]);
      }
    }

    if (queue.length === 0) {
      return new Response(
        JSON.stringify({ error: "No questions available for the selected topics. Please contact admin." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Find the first question for queue[0] / wiedergabe / starting_difficulty
    const { data: firstQ } = await supabase
      .from("ib_questions")
      .select("id, prompt, archetype, topic, question_type, difficulty_level")
      .eq("archetype", queue[0])
      .eq("question_type", "wiedergabe")
      .eq("difficulty_level", starting_difficulty)
      .eq("active", true)
      .maybeSingle();

    // INSERT session
    const { data: session, error: sessErr } = await supabase
      .from("ib_sessions")
      .insert({
        user_email,
        user_rating,
        starting_difficulty,
        current_difficulty: starting_difficulty,
        max_difficulty,
        topics,
        company: company || null,
        archetype_queue: queue,
        current_archetype: queue[0],
        current_stage: "wiedergabe",
      })
      .select()
      .single();

    if (sessErr || !session) throw new Error(`Session insert failed: ${sessErr?.message}`);

    const sessionId = session.id as string;

    // Claude intro call
    const topicsPretty = topics.join(", ");
    const introSystemPrompt = `Du bist ein Investmentbanking-Interviewer. Formuliere eine kurze, warme Begruessung (2-3 Saetze, Deutsch, Fliesstext, kein Markdown), die:
1. den Kandidaten begruesst und den Rahmen setzt (30-Minuten Mock-Interview)
2. die gewaehlten Themen (${topicsPretty}) beilaeufig erwaehnt
3. mit der ersten Einstiegsfrage abschliesst

${company ? `Der Kandidat bewirbt sich bei: ${company}. Binde das naturlich mit ein.` : ""}

ERSTE FRAGE, die du stellen sollst:
${firstQ ? firstQ.prompt : "Erzaehl mir etwas ueber dich und warum du dich fuer Investment Banking interessierst."}`;

    const introResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4.6",
        temperature: 0.4,
        messages: [
          { role: "system", content: introSystemPrompt },
          { role: "user", content: "Generiere jetzt die Intro-Nachricht." },
        ],
        tools: [TOOL_INTRO],
        tool_choice: { type: "function", function: { name: "submit_intro" } },
      }),
    });

    if (!introResp.ok) {
      const t = await introResp.text();
      throw new Error(`AI intro call failed: ${introResp.status} ${t}`);
    }

    const introData = await introResp.json();
    const introToolCall = introData.choices?.[0]?.message?.tool_calls?.[0];
    if (!introToolCall) throw new Error("AI returned no intro tool call");

    const introArgs = typeof introToolCall.function.arguments === "string"
      ? JSON.parse(introToolCall.function.arguments)
      : introToolCall.function.arguments;
    const introText = introArgs.intro_text as string;

    // TTS on intro
    const ttsAudio = await synthesizeTTS(introText, ELEVENLABS_API_KEY);

    // Insert intro turn (turn_index 0, role-like: bot-only, no user input)
    const { data: turn, error: turnErr } = await supabase
      .from("ib_turns")
      .insert({
        session_id: sessionId,
        turn_index: 0,
        question_id: firstQ?.id ?? null,
        archetype: queue[0],
        archetype_stage: "wiedergabe",
        difficulty_level: starting_difficulty,
        bot_response: introText,
        judge_verdict: "n/a",
      })
      .select()
      .single();

    if (turnErr || !turn) throw new Error(`Turn insert failed: ${turnErr?.message}`);

    const audioPath = await uploadAudio(supabase, sessionId, turn.id as string, ttsAudio);
    await supabase
      .from("ib_turns")
      .update({ bot_audio_storage_path: audioPath })
      .eq("id", turn.id);

    const signedUrl = await getSignedUrl(supabase, audioPath);

    const sessionState = {
      session_id: sessionId,
      current_archetype: queue[0],
      current_stage: "wiedergabe" as const,
      current_difficulty: starting_difficulty,
      max_difficulty,
      turn_index: 0,
      time_remaining_sec: SESSION_MAX_SECONDS,
      started_at: session.started_at as string,
    };

    return new Response(
      JSON.stringify({
        session_id: sessionId,
        intro_text: introText,
        intro_audio_url: signedUrl,
        session_state: sessionState,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ib-start-session error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
