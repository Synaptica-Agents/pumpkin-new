import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { difficulty, industry, avoid_topics } = await req.json();

    const diffLabels: Record<string, string> = {
      medium: "normal – kurzes, klares Business-Problem in 1-2 Sätzen. Keine Zahlen, kein langer Kontext. Beispiel: 'Eine Restaurantkette sucht nach Wegen, auf Restaurant-Level den täglichen Umsatz zu steigern.'",
      hard: "schwer – detailliertes Szenario mit konkreten Zahlen, Marktdaten und Kontext. 3-4 Sätze mit Hintergrundinformationen.",
    };

    const industryLabels: Record<string, string> = {
      tech: "Technologie / Digitalisierung",
      retail: "Einzelhandel / E-Commerce",
      healthcare: "Gesundheitswesen / Pharma",
      mobility: "Mobilität / Transport",
      finance: "Finanzdienstleistungen / Banking",
      sustainability: "Nachhaltigkeit / Energie / Umwelt",
    };

    const prompt = `Du bist ein Consulting-Interview-Trainer. Generiere ein kreatives Business-Problem für eine Case-Interview-Übung.

Schwierigkeit: ${diffLabels[difficulty] || difficulty}
Branche: ${industryLabels[industry] || industry || "beliebig"}

Antworte NUR mit validem JSON (kein Markdown, keine Erklärung):
{
  "prompt": "${difficulty === "hard" ? "2-4 Sätze: Business-Szenario mit konkretem Problem, konkreten Zahlen und Fakten." : "1-2 kurze Sätze: Simples Business-Problem, das eine kreative Lösung erfordert. KEINE Zahlen, KEIN langer Kontext."}",
  "context_info": "${difficulty === "hard" ? "1-2 Sätze: Zusätzlicher Kontext mit Zahlen (Marktgröße, Umsatz, Wettbewerber)." : "null"}"
}

Wichtig:
- Alles auf Deutsch
- Realistische, aktuelle Szenarien (keine Science-Fiction)
- Das Problem muss offen genug sein für verschiedene Lösungsansätze
${difficulty === "hard" ? "- Sei spezifisch: nenne Firmennamen/-typen, Zahlen, Regionen" : "- Halte es kurz und simpel – maximal 2 Sätze, keine Zahlen"}${
      Array.isArray(avoid_topics) && avoid_topics.length > 0
        ? `\n\nVERMEIDE folgende bereits gestellte Themen (wähle ein komplett anderes Szenario):\n${avoid_topics.map((t: string) => `- ${t.slice(0, 80)}`).join("\n")}`
        : ""
    }`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI generation failed" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content?.trim() || "";

    // Parse JSON from AI response (strip markdown fences if present)
    const jsonStr = content.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
    let parsed: { prompt: string; context_info: string };
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI JSON:", content);
      return new Response(
        JSON.stringify({ error: "AI returned invalid JSON" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!parsed.prompt) {
      return new Response(
        JSON.stringify({ error: "AI response missing prompt field" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        id: crypto.randomUUID(),
        difficulty: difficulty || "medium",
        prompt: parsed.prompt,
        category: industry || "general",
        context_info: parsed.context_info || null,
        reference_solution: null,
        chart_data: null,
        chart_title: null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-creativity-case error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
