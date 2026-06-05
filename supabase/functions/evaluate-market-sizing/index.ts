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
      "BENOTUNGS-PHILOSOPHIE (sehr wichtig, gilt für ALLE Dimensionen): Bewerte GROSSZÜGIG und ermutigend, NICHT streng. " +
      "Sobald in einem Bereich überhaupt akzeptabler Inhalt steht und halbwegs Sinn ergibt (auch wenn einzelne Dinge falsch sind), gib MINDESTENS ~50% der Punkte. " +
      "Eine nachvollziehbar hergeleitete, begründete Antwort, die NICHT perfekt ist und deren Ergebnis ruhig weit von ideal liegen darf, verdient ~80%. " +
      "Volle bzw. fast volle Punktzahl gibt es, wenn es gut strukturiert und begründet ist und KEINE Red Flags hat — es muss NICHT perfekt, exakt oder vollständig sein. " +
      "Niedrige Punkte nur bei wirklich leeren, unsinnigen oder klar widersprüchlichen Antworten.";

    const systemPrompt = `Du bist ein fairer, konsistenter Bewertungsassistent für Market-Sizing-Übungen im Consulting-Interview-Training.

WICHTIGE REGELN:
- Bewerte NUR nach der folgenden Rubrik und den Scoring-Ankern.
- Behaupte NICHT, die "wahre" Marktgröße zu kennen. Erfinde KEINE Fakten.
- Nutze KEINE externen Zahlen oder Studien.
- Prüfe nur: Logik, Struktur, Einheiten, interne Konsistenz und Größenordnung (wenn Range gegeben).
- Sei FAIR und KONSISTENT: Gleiche Qualität = gleiche Punkte, immer.
- Wenn du unsicher bist ob die Größenordnung stimmt, setze flagged=true.

HINWEIS ZUM ANTWORT-FORMAT — jede Sektion gehört zu einer Bewertungs-Dimension:
Die Antwort kommt in strukturiertem Format mit folgenden Sektionen (manche optional):
- "VERSTÄNDNIS:" (optional, Schritt 1) = Klärungsfragen, die der User selbst gestellt und beantwortet hat. Zählt positiv für A (Struktur), wenn sinnvoll.
- "STRUKTUR:" (Schritt 2) = Hierarchischer Issue Tree der gewählten Bereiche/Boxen → Dimension A (Struktur).
  - "[Ast N] Titel" = Oberbereiche, "  [Unterast N.M] Titel" = Unteräste (bis zu 4 Ebenen).
- "ANNAHMEN (pro Box: Zahl — Begründung):" (Schritt 3) = pro Box eine Zahl + Begründung, mit Pfad [N.M] → Dimension B (Annahmen & Zahlen). Prüfe, ob die Boxen Zahlen UND eine nachvollziehbare Begründung haben.
- "FINALE SCHÄTZUNG:" (Schritt 4) = Endwert mit Einheit → fließt in C (Plausibilität) und D (Rechnung).
- "SANITY CHECK:" (optional, Schritt 4) = "Größenordnung:" = qualitativer Check, warum das Ergebnis plausibel ist → Dimension C (Plausibilität).
Berücksichtige WIRKLICH alle vorhandenen Sektionen; ignoriere keine Eingabe.

RUBRIK (0-100 Punkte):
A) Struktur (0-30): Sinnvoll in Bereiche/Boxen aufgeteilt, nachvollziehbar? (Muss NICHT perfekt MECE sein.)
B) Annahmen & Zahlen (0-30): Haben die Boxen Zahlen UND nachvollziehbare Begründungen? Plausibel?
C) Plausibilität / Sanity Check (0-25): Ist das Endergebnis von der Größenordnung sinnvoll und begründet/logisch?
D) Endresultat & Rechnung (0-15): Passt der Endwert grob zur Kombination der Box-Zahlen? RUNDEN IST OK — Rechenweg nachvollziehbar + Ergebnis sinnvoll zählt, nicht exakte Arithmetik.

SCORING-ANKER (5 Stufen pro Dimension – wende IMMER GROSSZÜGIG und gleich an):

A) Struktur (max 30):
- 27-30: Klar nachvollziehbar in sinnvolle Bereiche aufgeteilt, keine groben Widersprüche. Muss NICHT perfekt sein.
- 21-26: Erkennbare, nachvollziehbare Struktur mit kleineren Lücken/Überschneidungen.
- 15-20: Ein paar Boxen mit Inhalt, der halbwegs Sinn ergibt (auch wenn teils unpassend) → schon mind. die Hälfte.
- 8-14: Nur sehr dünne oder kaum zusammenhängende Struktur.
- 0-7: Leer oder völlig unsinnig.

B) Annahmen & Zahlen (max 30):
- 27-30: Zu (fast) allen Boxen Zahl + nachvollziehbare Begründung; insgesamt stimmig (keine groben Fehler nötig zu vermeiden).
- 21-26: Die meisten Boxen mit Zahl + Begründung, überwiegend nachvollziehbar.
- 15-20: Überall etwas eingetragen, halbwegs sinnvoll — auch wenn einzelne Zahlen fragwürdig oder falsch sind → schon mind. die Hälfte.
- 8-14: Nur wenige Boxen ausgefüllt oder kaum begründet.
- 0-7: Zahlen/Begründungen fehlen oder völlig unsinnig.

C) Plausibilität / Sanity Check (max 25):
- 22-25: Endergebnis in plausibler Größenordnung UND nachvollziehbar begründet (Sanity-Check oder schlüssige Logik).
- 17-21: Größenordnung grob plausibel ODER guter Sanity-Check; kleinere Abweichung ok.
- 12-16: Ergebnis grob im Bereich (auch ~Faktor 10), Plausibilitäts-Gedanke erkennbar → schon mind. die Hälfte.
- 6-11: Größenordnung deutlich daneben, aber ein Ansatz/Gedanke erkennbar.
- 0-5: Völlig unrealistisch und kein Plausibilitäts-Gedanke.

D) Endresultat & Rechnung (max 15):
HINWEIS: RUNDEN ist ausdrücklich erwünscht. Es geht NICHT um exakte Arithmetik, sondern darum, ob der Endwert grob zur Kombination der Box-Zahlen passt und Sinn ergibt.
- 13-15: Endwert passt grob zu den Box-Zahlen (Rundung ok), Einheiten stimmig, Ergebnis sinnvoll.
- 10-12: Ergebnis passt ungefähr (Faktor 2-3), kleine Unstimmigkeiten.
- 6-9: Rechenweg erkennbar, Ergebnis weicht spürbar ab (Faktor 5-10) → noch ~die Hälfte.
- 3-5: Ergebnis passt kaum zu den Zahlen.
- 0-2: Kein nachvollziehbarer Zusammenhang.

${difficultyGuidance}

INTERVIEW-REALISMUS:
Der User hat eine feste Bearbeitungszeit. Bewerte MILDE und an realistischen Interview-Erwartungen, NICHT an einer idealen Consulting-Master-Lösung.
- Volle/fast volle Punktzahl = gut strukturiert und begründet, keine Red Flags. KEINE Perfektion, Exaktheit, Vollständigkeit oder echte Datenquellen verlangt.
- Im Zweifel zugunsten des Users runden — lieber zu großzügig als zu streng.
- Wenn unten ein BEISPIEL-LÖSUNGSWEG mitgegeben wurde, nutze ihn nur als grobe Referenz für *Tiefe und Breite*. User muss NICHT wörtlich treffen – gleichwertige oder einfachere Lösungswege verdienen die volle Punktzahl.

FEEDBACK-REGELN:
- Jede Stärke muss konkret benennen, WAS gut war.
- Jedes Improvement muss konkret und UMSETZBAR sein. NICHT: "Annahmen verbessern". SONDERN: "Nenne die Quelle deiner Bevölkerungsannahme und begründe den gewählten Prozentsatz."
- Gib maximal 2-3 Improvements – fokussiere auf die wichtigsten.
- one_line_summary: Ein Satz der dem User hilft, den nächsten Versuch besser zu machen.`;

    const userPrompt = `AUFGABE: ${case_prompt}
Einheit: ${unit_hint || "nicht angegeben"}
${rangeInfo}${referenceBlock}

ANTWORT DES USERS:
${answer_text}

FINALE SCHÄTZUNG: ${final_estimate_value} ${final_estimate_unit}

Bewerte diese Antwort großzügig nach der Rubrik und der Benotungs-Philosophie.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-opus-4.8",
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
                          description: "Struktur (Schritt 2), 0-30",
                        },
                        assumptions: {
                          type: "number",
                          description: "Annahmen & Zahlen (Schritt 3), 0-30",
                        },
                        math_consistency: {
                          type: "number",
                          description: "Endresultat & Rechnung, 0-15",
                        },
                        plausibility_sanity: {
                          type: "number",
                          description: "Plausibilität / Sanity Check, 0-25",
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
