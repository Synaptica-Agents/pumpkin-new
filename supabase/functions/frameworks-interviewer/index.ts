import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface QAPair {
  q: string;
  a: string;
}

/**
 * Beantwortet Kandidaten-Rückfragen zum Framework-Case wie ein Interviewer
 * im Case-Interview (Casebook-Prinzip: "Provide this only if corresponding
 * questions are asked"). Antwortet NUR auf Basis der hinterlegten Fakten —
 * ist nichts hinterlegt, sagt der Interviewer das offen und signalisiert,
 * dass die Info für die Strukturierung nicht entscheidend ist.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");

    const body = await req.json();
    const {
      case_prompt,
      question,
      clarifying_qa,
      context_info,
      interviewer_notes,
      history,
    } = body as {
      case_prompt?: string;
      question?: string;
      clarifying_qa?: QAPair[] | null;
      context_info?: string | null;
      interviewer_notes?: string | null;
      history?: QAPair[] | null;
    };

    if (!case_prompt || !question || typeof question !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing required fields: case_prompt, question" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (question.length > 500) {
      return new Response(
        JSON.stringify({ error: "Frage zu lang (max. 500 Zeichen)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const qaFacts =
      Array.isArray(clarifying_qa) && clarifying_qa.length > 0
        ? clarifying_qa
            .map((p, i) => `${i + 1}. Frage: ${p.q}\n   Antwort: ${p.a}`)
            .join("\n")
        : null;

    const factBlock = [
      qaFacts ? `HINTERLEGTE FRAGEN & ANTWORTEN (nur bei passender Frage preisgeben):\n${qaFacts}` : null,
      context_info ? `WEITERE HINTERLEGTE FAKTEN:\n${context_info}` : null,
      interviewer_notes ? `INTERNE INTERVIEWER-HINWEISE (niemals wörtlich verraten, nur zur Orientierung):\n${interviewer_notes}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const systemPrompt = `Du bist ein Case-Interviewer bei einer Top-Unternehmensberatung. Der Kandidat hat gerade den Case gehört und darf Verständnis-/Rückfragen stellen, bevor er seine Struktur baut.

DER CASE (hat der Kandidat bereits gehört):
${case_prompt}

${factBlock || "Es sind keine zusätzlichen Fakten hinterlegt."}

SO ANTWORTEST DU — WIE IM ECHTEN INTERVIEW:
1. Passt die Frage zu einem hinterlegten Fakt (auch sinngemäß/teilweise), gib die hinterlegte Antwort natürlich und gesprächig wieder. Du darfst Fakten aus mehreren Einträgen kombinieren, wenn die Frage beides berührt.
2. Ist die Frage NICHT durch hinterlegte Fakten gedeckt, sag freundlich und knapp, dass dazu keine Informationen vorliegen — und ergänze sinngemäß, dass der Kandidat dafür gerne eine Annahme treffen kann oder dass das für die Strukturierung nicht entscheidend ist. ERFINDE NIEMALS neue Fakten, Zahlen oder Details.
3. Bittet der Kandidat, den Case zu wiederholen oder zusammenzufassen, wiederhole den Case-Text sinngemäß.
4. Fragt der Kandidat nach der Lösung, nach dem "richtigen Framework" oder was er tun soll, lenke freundlich zurück: Das ist seine Aufgabe — du gibst nur Informationen.
5. Bleib in der Interviewer-Rolle: professionell, wohlwollend, knapp. KEINE Bewertung der Frage, kein Coaching, keine Tipps zur Struktur.

FORM: Antworte auf Deutsch, 1-3 Sätze, ohne Aufzählungen, ohne Meta-Kommentare.`;

    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Bisherige Rückfragen als Gesprächsverlauf mitgeben (Konsistenz).
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h?.q && h?.a) {
          messages.push({ role: "user", content: h.q });
          messages.push({ role: "assistant", content: h.a });
        }
      }
    }
    messages.push({ role: "user", content: question });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-haiku-4.5",
        temperature: 0.2,
        max_tokens: 300,
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit erreicht. Bitte versuche es gleich noch mal." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("OpenRouter error:", response.status, errText);
      throw new Error(`OpenRouter request failed with status ${response.status}`);
    }

    const data = await response.json();
    const answer: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("Empty answer from model");

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("frameworks-interviewer error:", err);
    return new Response(
      JSON.stringify({ error: "Rückfrage konnte nicht beantwortet werden. Bitte versuche es erneut." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
