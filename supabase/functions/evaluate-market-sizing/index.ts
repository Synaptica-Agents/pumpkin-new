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
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");

    const body = await req.json();
    const {
      case_prompt,
      unit_hint,
      allowed_methods,
      expected_min,
      expected_max,
      answer_text,
      final_estimate_value,
      final_estimate_unit,
      reference_structure,
    } = body;

    const rangeInfo =
      expected_min != null && expected_max != null
        ? `Erwartete Größenordnung: ${expected_min} bis ${expected_max} (${final_estimate_unit}).`
        : "Keine erwartete Größenordnung vorhanden. Bewerte Plausibilität nur qualitativ und setze flagged=true wenn unsicher.";

    const referenceBlock = reference_structure
      ? `\nBEISPIEL-LÖSUNGSWEG (Referenz für Tiefe/Breite – User muss nicht wörtlich treffen):\n${reference_structure}`
      : "";

    const difficultyGuidance =
      "Realistisch: 6-10 Min Bearbeitung. Ziel: klare MECE-Struktur mit 2-3 Segmenten, plausible und begründete Annahmen, Sanity Check. Solider Ansatz verdient 75-85 Punkte. 90+ nur bei sauberer MECE-Struktur UND korrekter Größenordnung UND vollständigem strukturierten Sanity Check.";

    const systemPrompt = `Du bist ein fairer, konsistenter Bewertungsassistent für Market-Sizing-Übungen im Consulting-Interview-Training.

WICHTIGE REGELN:
- Bewerte NUR nach der folgenden Rubrik und den Scoring-Ankern.
- Behaupte NICHT, die "wahre" Marktgröße zu kennen. Erfinde KEINE Fakten.
- Nutze KEINE externen Zahlen oder Studien.
- Prüfe nur: Logik, Struktur, Einheiten, interne Konsistenz und Größenordnung (wenn Range gegeben).
- Sei FAIR und KONSISTENT: Gleiche Qualität = gleiche Punkte, immer.
- Wenn du unsicher bist ob die Größenordnung stimmt, setze flagged=true.

HINWEIS ZUM ANTWORT-FORMAT:
Die Antwort kommt in strukturiertem Format mit folgenden Sektionen (manche optional):
- "VERSTÄNDNIS:" (optional) = Klärungsfragen die der User selbst gestellt und beantwortet hat. Werte das positiv für Annahmenqualität (B), wenn sinnvoll.
- "METHODE:" = Methodenwahl (Top-Down / Bottom-Up / Mixed) + Begründung. Prüfe ob die Methode in der Struktur konsistent durchgezogen wurde (Dimension A).
- "STRUKTUR:" = Hierarchischer Issue Tree
  - "[Ast N] Titel" = Hauptschritte der Rechnung
  - "  [Unterast N.M] Titel" = Detailschritte (bis dritte Ebene möglich)
  - "  - Punkt" = Annahmen / Zwischenergebnisse
- "ANNAHMEN:" (optional) = Begründungen pro Leaf, mit Pfad-Verweisen [N.M]
- "FINALE SCHÄTZUNG:" = Endwert mit Einheit (User rechnet auf Papier — keine RECHNUNG-Sektion mehr im Antwort-Format)
- "SANITY CHECK:" (optional) = Strukturierter Plausibilitäts-Check mit drei Unterfeldern:
  - "Größenordnung:" = qualitativer Magnitude-Check
  - "Vergleich:" = optionaler Vergleichswert mit Quelle
  - "Begründung:" = Plausibilitäts-Argumentation
  Werte STARK auf Dimension D: ein vollständig ausgefüllter strukturierter Sanity Check (alle drei Felder) verdient die Top-Stufe; nur Größenordnung ohne Vergleich/Begründung mittlere Stufe.
Bewerte jeden Bereich nach der Rubrik.

RUBRIK (0-100 Punkte):
A) Struktur & MECE (0-35): Klare Methode (top-down/bottom-up/mixed)? Logisch und MECE? Nachvollziehbare Schritte?
B) Annahmenqualität (0-25): Explizit genannt? Plausibel? Keine falschen Datenquellen behauptet?
C) Mathematische Konsistenz (0-20): Rechenlogik korrekt? Einheiten konsistent? Keine widersprüchlichen Zwischenergebnisse?
D) Plausibilität / Sanity Check (0-20): Größenordnung sinnvoll? Mindestens ein Sanity Check? Vergleiche/Anker genutzt?

SCORING-ANKER (5 Stufen pro Dimension – wende IMMER gleich an):

Struktur & MECE (max 35):
- 31-35: 4+ klare Rechenschritte, saubere MECE, nachvollziehbarer Top-down/Bottom-up.
- 25-30: 3-4 Schritte, grundsätzlich MECE, kleine Logik-Lücken.
- 18-24: 2-3 Schritte, erkennbare Struktur, aber Überschneidungen.
- 10-17: Wenige Schritte, Struktur flach oder unvollständig.
- 0-9: Keine erkennbare Methode, nur eine Annahme.

Annahmenqualität (max 25):
- 22-25: Alle Annahmen explizit UND plausibel UND begründet.
- 18-21: Annahmen explizit und meist plausibel, kleine Lücken in Begründung.
- 13-17: Annahmen meist explizit, teils unplausibel oder unbegründet.
- 7-12: Annahmen implizit oder mehrere unplausibel.
- 0-6: Annahmen fehlen oder klar falsch.

Mathematische Konsistenz (max 20):
HINWEIS: Der User rechnet auf Papier — die Rechnung ist NICHT in der Antwort enthalten. Bewerte stattdessen, ob die Annahmen + finale Schätzung mathematisch zusammenpassen (Größenordnung, Plausibilität der impliziten Multiplikation).
- 18-20: Annahmen und Schätzung passen exakt zusammen (Größenordnung passt zur erwarteten Multiplikation der genannten Werte). Einheiten konsistent.
- 14-17: Schätzung passt grob zu den Annahmen, Faktor 2-3 Abweichung möglich.
- 10-13: Schätzung weicht erkennbar von den Annahmen ab (Faktor 5-10), aber Logik noch nachvollziehbar.
- 5-9: Schätzung passt nicht zu den Annahmen (Faktor >10 daneben) oder Einheiten widersprüchlich.
- 0-4: Schätzung steht in keinem nachvollziehbaren Zusammenhang zu den Annahmen.

Plausibilität / Sanity Check (max 20):
- 18-20: Ergebnis innerhalb Faktor 3 der erwarteten Größenordnung UND expliziter Sanity Check/Vergleich.
- 14-17: Richtige Größenordnung (Faktor 3) OHNE Sanity Check, oder Sanity Check mit leichter Abweichung.
- 10-13: Ergebnis innerhalb Faktor 10, kein Sanity Check.
- 5-9: Größenordnung schief (Faktor 10-100 daneben).
- 0-4: Ergebnis offensichtlich falsche Größenordnung.

${difficultyGuidance}

INTERVIEW-REALISMUS:
Der User hat eine feste Bearbeitungszeit. Bewerte an realistischen Interview-Erwartungen, NICHT an einer idealen Consulting-Master-Lösung.
- 100% = klar strukturiert, MECE, plausible Annahmen, richtige Größenordnung, Sanity Check. KEINE Perfektion oder echte Datenquellen verlangt.
- Wenn unten ein BEISPIEL-LÖSUNGSWEG mitgegeben wurde, nutze ihn als Referenz für *Tiefe und Breite*. User muss NICHT wörtlich treffen – gleichwertige alternative Methoden (top-down vs. bottom-up) verdienen die volle Punktzahl, wenn sauber ausgeführt.

FEEDBACK-REGELN:
- Jede Stärke muss konkret benennen, WAS gut war.
- Jedes Improvement muss konkret und UMSETZBAR sein. NICHT: "Annahmen verbessern". SONDERN: "Nenne die Quelle deiner Bevölkerungsannahme und begründe den gewählten Prozentsatz."
- Gib maximal 2-3 Improvements – fokussiere auf die wichtigsten.
- one_line_summary: Ein Satz der dem User hilft, den nächsten Versuch besser zu machen.`;

    const userPrompt = `AUFGABE: ${case_prompt}
Einheit: ${unit_hint || "nicht angegeben"}
Erlaubte Methoden: ${allowed_methods}
${rangeInfo}${referenceBlock}

ANTWORT DES USERS:
${answer_text}

FINALE SCHÄTZUNG: ${final_estimate_value} ${final_estimate_unit}

Bewerte diese Antwort strikt nach der Rubrik.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-sonnet-4.6",
          temperature: 0,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_evaluation",
                description:
                  "Submit the structured evaluation of the market sizing answer",
                parameters: {
                  type: "object",
                  properties: {
                    total_score: {
                      type: "number",
                      description: "Total score 0-100",
                    },
                    scores: {
                      type: "object",
                      properties: {
                        structure_mece: {
                          type: "number",
                          description: "0-35",
                        },
                        assumptions: { type: "number", description: "0-25" },
                        math_consistency: {
                          type: "number",
                          description: "0-20",
                        },
                        plausibility_sanity: {
                          type: "number",
                          description: "0-20",
                        },
                      },
                      required: [
                        "structure_mece",
                        "assumptions",
                        "math_consistency",
                        "plausibility_sanity",
                      ],
                      additionalProperties: false,
                    },
                    strengths: {
                      type: "array",
                      items: { type: "string" },
                      description: "Max 3 strengths",
                    },
                    improvements: {
                      type: "array",
                      items: { type: "string" },
                      description: "Max 3 improvements",
                    },
                    red_flags: {
                      type: "array",
                      items: { type: "string" },
                      description: "Optional red flags",
                    },
                    flagged: {
                      type: "boolean",
                      description:
                        "True if evaluation is uncertain about plausibility",
                    },
                    one_line_summary: {
                      type: "string",
                      description: "One sentence summary of the evaluation",
                    },
                  },
                  required: [
                    "total_score",
                    "scores",
                    "strengths",
                    "improvements",
                    "flagged",
                    "one_line_summary",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "submit_evaluation" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Bitte versuche es gleich noch mal.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI credits aufgebraucht. Bitte Credits aufladen.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI evaluation failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      console.error("No tool call in AI response:", JSON.stringify(aiResult));
      return new Response(
        JSON.stringify({ error: "AI did not return structured evaluation" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let evaluation;
    try {
      evaluation =
        typeof toolCall.function.arguments === "string"
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
    } catch {
      console.error("Failed to parse tool call arguments:", toolCall.function.arguments);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI evaluation" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-market-sizing error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
