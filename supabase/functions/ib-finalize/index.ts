import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { TOOL_FINAL_FEEDBACK, TOPIC_RESOURCES } from "../_shared/ibPrompts.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!OPENROUTER_API_KEY || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const body = await req.json();
    const { session_id } = body as { session_id: string };
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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

    const { data: turns } = await supabase
      .from("ib_turns")
      .select("*")
      .eq("session_id", session_id)
      .order("turn_index", { ascending: true });

    const allTurns = turns ?? [];

    // Mark session ended if not already
    if (!session.ended_at) {
      await supabase
        .from("ib_sessions")
        .update({ ended_at: new Date().toISOString(), end_reason: session.end_reason ?? "user_ended" })
        .eq("id", session_id);
    }

    // Aggregate passed / failed topics
    const topics = session.topics as string[];
    const passed: string[] = [];
    const failed: string[] = [];

    for (const topic of topics) {
      // Did we reach verstaendnis stage with a correct verdict on any archetype in this topic?
      // Need to look up archetype->topic mapping from ib_questions
      const topicTurns = allTurns.filter(
        (t) => t.archetype && t.archetype_stage === "verstaendnis" && t.judge_verdict === "correct",
      );

      if (topicTurns.length > 0) {
        // Check if any of these archetypes belong to this topic
        const archetypes = [...new Set(topicTurns.map((t) => t.archetype as string))];
        const { data: qs } = await supabase
          .from("ib_questions")
          .select("archetype, topic")
          .in("archetype", archetypes)
          .eq("topic", topic)
          .limit(1);

        if (qs && qs.length > 0) {
          passed.push(topic);
          continue;
        }
      }
      failed.push(topic);
    }

    // Build LLM context
    const turnSummary = allTurns
      .map((t) => {
        const parts: string[] = [];
        parts.push(`Turn ${t.turn_index} [${t.archetype ?? "?"} / ${t.archetype_stage ?? "?"}]`);
        if (t.user_transcript) parts.push(`  User: ${t.user_transcript}`);
        if (t.bot_response) parts.push(`  Bot: ${t.bot_response}`);
        if (t.judge_verdict && t.judge_verdict !== "n/a") {
          parts.push(`  Verdict: ${t.judge_verdict}${t.judge_rationale ? ` — ${t.judge_rationale}` : ""}`);
        }
        return parts.join("\n");
      })
      .join("\n\n");

    const resourceLookupText = topics
      .map((t) => {
        const r = TOPIC_RESOURCES[t] ?? [];
        if (r.length === 0) return `- ${t}: (keine Ressourcen hinterlegt)`;
        return `- ${t}:\n` + r.map((x) => `  * ${x.label} (${x.url})`).join("\n");
      })
      .join("\n");

    const systemPrompt = `Du bewertest ein 30-Minuten-IB-Mock-Interview. Gib ein faires, strukturiertes Feedback mit drei Saeulen-Ratings (1-5 Sterne):

1) INHALT: Fachliche Korrektheit der Antworten (basierend auf Judge-Verdicts: correct=5, meist correct/unvollstaendig=4, gemischt=3, ueberwiegend unvollstaendig=2, ueberwiegend falsch=1).

2) STRUKTUR: Logik der Antworten (Pyramid-Prinzip, strukturierte Argumentation, MECE-Denken — erkennbar aus den User-Transkripten).

3) DELIVERY: Souveraenitaet und Rhetorik — bewerte Transkript-Qualitaet (Fluessigkeit, Satzbau, Fuellwoerter wie "aehm"), nicht Audio.

Gib MAX 3 konkrete Staerken und MAX 3 UMSETZBARE Verbesserungsvorschlaege (nicht "sei besser", sondern z.B. "Ueb die 3-Statement-Verkettung am Beispiel einer Abschreibung").

Waehle bis zu 3 passende Ressourcen aus den folgenden, passend zu den schwaechsten Themen:

${resourceLookupText}

PASSED TOPICS: ${passed.join(", ") || "keine"}
FAILED TOPICS: ${failed.join(", ") || "keine"}`;

    const userPrompt = `SESSION-TRANSKRIPT:\n\n${turnSummary || "(keine Turns aufgezeichnet)"}`;

    const aiResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4.6",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [TOOL_FINAL_FEEDBACK],
        tool_choice: { type: "function", function: { name: "submit_final_feedback" } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      throw new Error(`AI call failed: ${aiResp.status} ${t}`);
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI returned no tool call");

    const feedback = typeof toolCall.function.arguments === "string"
      ? JSON.parse(toolCall.function.arguments)
      : toolCall.function.arguments;

    const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

    const finalFeedback = {
      content_score: clamp(feedback.content_score),
      structure_score: clamp(feedback.structure_score),
      delivery_score: clamp(feedback.delivery_score),
      rationale: feedback.rationale as string,
      strengths: (feedback.strengths as string[]) ?? [],
      improvements: (feedback.improvements as string[]) ?? [],
      resource_links: (feedback.resource_links as Array<{ topic: string; label: string; url: string }>) ?? [],
      passed_topics: passed,
      failed_topics: failed,
    };

    // Persist to session
    await supabase
      .from("ib_sessions")
      .update({
        final_content_score: finalFeedback.content_score,
        final_structure_score: finalFeedback.structure_score,
        final_delivery_score: finalFeedback.delivery_score,
        passed_topics: passed,
        failed_topics: failed,
        final_feedback: {
          rationale: finalFeedback.rationale,
          strengths: finalFeedback.strengths,
          improvements: finalFeedback.improvements,
          resource_links: finalFeedback.resource_links,
        },
      })
      .eq("id", session_id);

    // Load past sessions for progress chart
    const { data: pastSessions } = await supabase
      .from("ib_sessions")
      .select("started_at, final_content_score, final_structure_score, final_delivery_score")
      .eq("user_email", session.user_email)
      .not("final_content_score", "is", null)
      .order("started_at", { ascending: false })
      .limit(10);

    const pastSummary = (pastSessions ?? []).map((s) => {
      const c = s.final_content_score as number | null;
      const st = s.final_structure_score as number | null;
      const d = s.final_delivery_score as number | null;
      const avg = [c, st, d].filter((x): x is number => x !== null).reduce((a, b) => a + b, 0) /
        Math.max(1, [c, st, d].filter((x) => x !== null).length);
      return {
        started_at: s.started_at as string,
        avg_score: Math.round(avg * 10) / 10,
      };
    });

    return new Response(
      JSON.stringify({
        feedback: finalFeedback,
        past_sessions_summary: pastSummary.reverse(), // chronological for chart
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ib-finalize error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
