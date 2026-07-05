import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RubricItem {
  key: string;
  label: string;
  max: number;
  description: string;
}

const RUBRICS: Record<string, RubricItem[]> = {
  frameworks: [
    { key: "framework_choice", label: "Framework-Wahl", max: 25, description: "Passendes Framework zum Szenario? Erkennbar aus Struktur?" },
    { key: "structure_mece", label: "Struktur & MECE", max: 30, description: "MECE-Äste ohne Überschneidung? Logische Ebenen? Saubere Hierarchie?" },
    { key: "completeness", label: "Vollständigkeit", max: 25, description: "Alle zentralen Hebel abgedeckt? Wichtige Aspekte nicht vergessen?" },
    { key: "prioritization", label: "Priorisierung", max: 20, description: "Top-Priority markiert (Stern)? Tiefere Analyse der Kern-Hebel?" },
  ],
  charts: [
    { key: "data_reading", label: "Daten-Ablesung", max: 25, description: "Daten korrekt abgelesen? Werte richtig interpretiert?" },
    { key: "trend_analysis", label: "Trend-Analyse", max: 25, description: "Trends und Muster erkannt? Veränderungen identifiziert?" },
    { key: "business_implications", label: "Business-Implikationen", max: 25, description: "Business-relevante Schlussfolgerungen gezogen?" },
    { key: "depth_of_analysis", label: "Analysetiefe", max: 15, description: "Tiefe der Analyse? Vergleiche, Ursachen, Zusammenhänge?" },
    { key: "communication", label: "Kommunikation", max: 10, description: "Klar und strukturiert kommuniziert?" },
  ],
  creativity: [
    { key: "structure", label: "Struktur", max: 40, description: "Erkennbare Gruppierung der Antwort — Kategorie-Header ODER thematisch geclusterte Bullet-Bloecke zählen beide voll. Strikt MECE ist NICHT nötig, Überschneidungen sind OK. Sehr großzügig bewerten." },
    { key: "content", label: "Inhalt", max: 50, description: "Relevante, zur Frage passende Punkte. Stichpunkte ohne Erklärung reichen voll aus. Oberflächlichkeit ist OK. Sehr großzügig bewerten — kein Anspruch auf Vollständigkeit." },
    { key: "creativity", label: "Kreativität", max: 10, description: "Mindestens 1-2 nicht-offensichtliche Ideen. Reines Standard-Set verdient 4-6, frische Ideen 8-10." },
  ],
};

function buildSystemPrompt(drillType: string, difficulty: string): string {
  const rubric = RUBRICS[drillType];
  if (!rubric) throw new Error(`Unknown drill type: ${drillType}`);

  const rubricText = rubric
    .map((r, i) => `${String.fromCharCode(65 + i)}) ${r.label} (0-${r.max}): ${r.description}`)
    .join("\n");

  const drillLabel =
    drillType === "frameworks" ? "Framework-Analyse" :
    drillType === "charts" ? "Diagramm-Interpretation" :
    "Kreativitätsübung";

  const scoringAnchors =
    drillType === "frameworks" ? `
HINWEIS ZUM ANTWORT-FORMAT:
Die Antwort kommt als hierarchischer Issue Tree:
- "[Ast N] Titel" = Hauptäste (top-level). Prefix "⭐" = vom User als Top-Priorität markiert.
- "  - Punkt" = Unterpunkte je Ast
- "  [Unterast N.M] Titel" = Unteräste (children)
- "    - Punkt" = Unterpunkte der Unteräste
Der Kandidat konnte vor dem Strukturieren Rückfragen an den Interviewer stellen (wie im echten Interview). Falls unten RÜCKFRAGEN mitgegeben sind, zeigen sie, welche Informationen der Kandidat hatte.

GRUNDKALIBRIERUNG — ZUERST LESEN, GILT ÜBER ALLEM:
Du bewertest eine spontane Interview-Struktur WOHLWOLLEND, wie ein freundlicher Interviewer. Casebook-Prinzip: "There are many possible alternatives to this framework" — es gibt viele gleichwertige Sichtweisen auf denselben Case; jede in sich logische, zum Case passende Alternative verdient die volle Punktzahl.
- WICHTIGSTES KRITERIUM IST MECE: Die Äste sollen sich nicht stark überschneiden und den Case sinnvoll aufteilen. Substanzielle Abzüge gibt es NUR für starke Überschneidungen, unlogische Aufteilung oder fehlenden Case-Bezug.
- KÜRZE IST KEIN MANGEL: Wenige, kurze Stichpunkte, die das Relevante treffen, sind vollwertig — ein simples, sauberes Framework ist ein gutes Framework. Es gibt KEINE Mindestanzahl an Unterpunkten oder Ebenen, und "mehr Tiefe/Ausführlichkeit" ist NIEMALS ein Grund für substanziellen Abzug.
- Der Kandidat hat die Beispiel-Lösung NIE gesehen. Übereinstimmung mit ihr (auch wörtlich) belegt Kompetenz — es gibt keinen "Kopier"-Tatbestand, Ähnlichkeit ist nie ein Mangel und gehört nicht ins Feedback. Gleiches gilt für Begriffe aus Case-Text/Briefing: Übernahme ist korrektes Arbeiten am Case.

KALIBRIER-ANKER — HALTE DIESE GESAMTWERTE EIN. Das Unterscheidungsmerkmal zwischen den Stufen ist die ABDECKUNG der Kern-Hebel, NIE die Ausführlichkeit der Formulierung:
- Antwort deckt praktisch ALLE Kern-Hebel des Cases ab (vgl. Beispiel-Lösung/Interviewer-Hinweise) und ist MECE — egal wie knapp formuliert, egal wie angeordnet: 92-100. NIEMALS unter 90.
- Gute Struktur: deckt die meisten Kern-Hebel ab, weitgehend MECE: 75-90.
- Solide mittlere Antwort: passende, kaum überschneidende Äste, aber nur ein TEIL der Kern-Hebel abgedeckt (typisch: 3 passende Äste, ein bis zwei wichtige Dimensionen des Cases fehlen ganz): 60-70. NICHT darunter, solange die Aufteilung zum Case passt.
- Dünn, aber erkennbar am Case (nur 2 Äste oder Mehrheit der Kern-Hebel fehlt): 45-60.
- Wirr, leer oder klar am Case vorbei: unter 40.
Gezielte, kluge Rückfragen sprechen für den Kandidaten — im Zweifel aufrunden. Fehlende Rückfragen NIEMALS bestrafen.

SCORING-ANKER je Dimension (konsistent mit den Gesamtwerten oben anwenden):

Framework-Wahl (max 25) — Default SEHR HOCH:
- 23-25: Ansatz passt zum Case, Äste adressieren die Frage sinnvoll (Standard-Fall; kein Lehrbuch-Name nötig).
- 18-22: Passt überwiegend, einzelne Äste laufen am Thema vorbei.
- 12-17: Generischer Ansatz, trifft den Kern nur teilweise.
- 0-11: Passt überwiegend nicht / kein erkennbarer Ansatz.

Struktur & MECE (max 30) — das wichtigste Kriterium, HIER wird differenziert:
- 27-30: Äste klar getrennt, keine nennenswerten Überschneidungen, logische Aufteilung (Kürze ist egal).
- 22-26: Weitgehend MECE, kleine Überschneidungen oder Unschärfen.
- 15-21: Erkennbare Struktur, aber deutliche Überschneidungen ODER ein Ast vermischt mehrere Ebenen.
- 8-14: Starke Überschneidungen, Aufteilung wenig logisch.
- 0-7: Keine erkennbare Struktur.

Vollständigkeit (max 25) — großzügig; Kürze ist KEINE Unvollständigkeit, stichwortartig genügt:
- 22-25: Alle oder fast alle zentralen Hebel des Cases sind adressiert (auch nur als kurzes Stichwort).
- 17-21: Die meisten Kern-Hebel da, einer fehlt.
- 12-16: Etwa die Hälfte der Kern-Hebel — typisch für eine knappe mittlere Antwort.
- 0-11: Überwiegend Randthemen, Kern klar verfehlt.

Priorisierung (max 20) — großzügig:
- 17-20: Top-Priorität markiert (⭐) ODER erkennbarer Fokus — und er passt zum Case.
- 13-16: Leichte Gewichtung erkennbar, nicht ganz stimmig.
- 10-12: Keine Priorisierung, gleichmäßige Analyse (Standard — nicht bestrafen).
- 0-9: Fokus klar auf Nebensächlichem oder wirr.` :
    drillType === "charts" ? `
SCORING-ANKER (für Konsistenz – wende diese IMMER gleich an):
- Daten-Ablesung: Zahlen korrekt gelesen und benannt = 20-25. Größtenteils korrekt = 12-19. Falsche/fehlende Werte = 0-11.
- Trend-Analyse: Trends erkannt und quantifiziert = 20-25. Trends erkannt ohne Quantifizierung = 12-19. Trends nicht erkannt = 0-11.
- Business-Implikationen: Konkrete Handlungsempfehlungen = 20-25. Allgemeine Schlussfolgerungen = 12-19. Keine Implikationen = 0-11.
- Analysetiefe: Vergleiche, Ursachen, Zusammenhänge = 12-15. Grundlegende Analyse = 6-11. Nur Beschreibung = 0-5.
- Kommunikation: Klar und prägnant = 8-10. Verständlich = 4-7. Unstrukturiert = 0-3.` : `
SCORING-ANKER — SEHR GROSSZÜGIG ANWENDEN. Stichpunkte ohne Erklärungen sind voll OK, oberflächliche Antworten verdienen trotzdem hohe Punkte solange sie zur Frage passen. Du bewertest KEINE Consulting-Master-Lösung, sondern eine spontane Stichpunkt-Antwort im Interview-Format.

Struktur (max 40) — Default ist HOCH:
- 32-40: Erkennbare Gruppierung. Reicht: 2+ Kategorie-Header ODER thematisch geclusterte Bullet-Blöcke ODER nummerierte Listen mit klarer Themen-Trennung.
- 22-31: Lockere Liste mit leicht erkennbarer thematischer Sortierung.
- 10-21: Reine ungeordnete Stichpunkt-Aufzählung.
- 0-9:   Nur 1 Punkt oder gar keine Struktur.

Inhalt (max 50) — Default ist HOCH:
- 42-50: 3+ relevante Punkte, die die Frage adressieren. Stichpunkte OHNE Erklärung reichen voll. Tiefe NICHT erforderlich.
- 30-41: 2-3 relevante Punkte (manche generisch ist OK).
- 15-29: 1 klar relevanter Punkt, Rest unklar oder off-topic.
- 0-14:  Antwort beantwortet die Frage nicht.

Kreativität (max 10):
- 8-10: Mindestens 1-2 nicht-offensichtliche, frische Ideen.
- 5-7:  Solide aber durchgehend erwartbar.
- 2-4:  Sehr generisch.
- 0-1:  Nichtssagend.

WICHTIG: Bei einer Antwort mit 3-4 thematisch gruppierten Bullet-Points zur Frage solltest du standardmäßig 80-90 Punkte vergeben. Ziehe nur dann ab, wenn die Antwort die Frage offensichtlich nicht beantwortet, völlig wirr ist, oder absolut zentrale Hebel komplett fehlen.`;

  const difficultyGuidance =
    drillType === "frameworks" ? (
      difficulty === "hard"
        ? "Schwierigkeit: SCHWER. Es gilt DIESELBE großzügige Skala wie oben — Muster-nah bleibt 92+, eine solide mittlere Antwort bleibt 60-70. Du darfst etwas mehr Breite erwarten, aber bestrafe Kürze nicht; entscheidend bleibt die MECE-Aufteilung."
        : "Schwierigkeit: MITTEL. Wende die großzügige Skala oben direkt an: Muster-nah = 92+, gute Struktur = 75-90, solide mittlere Antwort = 60-70. Kürze und Einfachheit nicht bestrafen."
    ) : drillType === "creativity" ? (
      difficulty === "medium" ? "Schwierigkeit: NORMAL. SEHR großzügig. Stichpunkte alleine sind voll ausreichend, Erklärungen NICHT erforderlich. 80-90 Punkte ist der Default für eine Antwort mit 3-4 relevanten, thematisch gruppierten Bullets. Nur drunter ziehen wenn Antwort offensichtlich off-topic ist oder zentrale Punkte komplett fehlen." :
      "Schwierigkeit: SCHWER. Großzügig. Stichpunkte und kurze Sätze sind weiter ausreichend, aber 3-5 relevante Punkte gehören rein. 70-85 Punkte für eine strukturierte Stichpunkt-Antwort ist normal."
    ) : (
      difficulty === "easy" ? "Schwierigkeit: EINFACH. Sei großzügig – ein grundlegend richtiger Ansatz verdient 60+ Punkte. Erwarte keine Tiefe." :
      difficulty === "medium" ? "Schwierigkeit: MITTEL. Erwarte solide Struktur und mehrere Aspekte. 50+ Punkte bei erkennbar gutem Ansatz." :
      "Schwierigkeit: SCHWER. Erwarte Tiefe, Nuancen und Priorisierung. Aber auch hier: 40+ Punkte bei erkennbarem, strukturiertem Ansatz."
    );

  const realismNote =
    drillType === "frameworks"
      ? `
INTERVIEW-REALISMUS:
Der User hat eine feste Bearbeitungszeit. Bewerte an realistischen Interview-Erwartungen, NICHT an einer idealen Consulting-Master-Lösung.
- 100% = klar strukturiert, MECE, passendes Framework, Priorisierung erkennbar. KEIN Anspruch auf Vollständigkeit einer 2-wöchigen Consulting-Analyse.
- Wenn unten eine BEISPIEL-LÖSUNG mitgegeben wurde, nutze sie als Referenz für *Tiefe und Breite*, die man erwarten darf. User muss sie NICHT wörtlich treffen – gleichwertige alternative Strukturen verdienen genauso die volle Punktzahl.
- Ziehe NICHT Punkte ab für fehlende Aspekte, die über das Interview-Format hinausgehen würden.`
      : "";

  return `Du bist ein fairer, konsistenter Bewertungsassistent für ${drillLabel}-Übungen im Consulting-Interview-Training.

WICHTIGE REGELN:
- Bewerte NUR nach der folgenden Rubrik und den Scoring-Ankern.
- Erfinde KEINE Fakten. Nutze KEINE externen Zahlen oder Studien.
- Prüfe nur: Logik, Struktur, Qualität der Argumentation, interne Konsistenz.
- Sei FAIR und KONSISTENT: Gleiche Qualität = gleiche Punkte, immer.
- Wenn du unsicher bist ob die Qualität ausreicht, setze flagged=true.

RUBRIK (0-100 Punkte):
${rubricText}
${scoringAnchors}

${difficultyGuidance}
${realismNote}

FEEDBACK-REGELN:
- Jede Stärke muss konkret benennen, WAS gut war (z.B. "Gute MECE-Struktur mit 4 klar abgegrenzten Ästen").
- Jedes Improvement muss konkret und UMSETZBAR sein. NICHT: "Struktur verbessern". SONDERN: "Füge einen Ast für externe Faktoren (Markt, Wettbewerb) hinzu."
- Gib maximal 2-3 Improvements – fokussiere auf die wichtigsten.
- one_line_summary: Ein Satz der dem User hilft, den nächsten Versuch besser zu machen.`;
}

function buildToolSchema(drillType: string) {
  const rubric = RUBRICS[drillType];
  if (!rubric) throw new Error(`Unknown drill type: ${drillType}`);

  const scoreProperties: Record<string, any> = {};
  const requiredScores: string[] = [];
  for (const r of rubric) {
    scoreProperties[r.key] = {
      type: "number",
      description: `0-${r.max}`,
    };
    requiredScores.push(r.key);
  }

  return {
    type: "function",
    function: {
      name: "submit_evaluation",
      description: "Submit the structured evaluation of the drill answer",
      parameters: {
        type: "object",
        properties: {
          total_score: {
            type: "number",
            description: "Total score 0-100",
          },
          scores: {
            type: "object",
            properties: scoreProperties,
            required: requiredScores,
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
            description: "True if evaluation is uncertain about quality",
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
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");

    const body = await req.json();
    const {
      drill_type,
      case_prompt,
      answer_text,
      difficulty,
      context_info,
      reference_solution,
      framework_guidance,
      interviewer_notes,
      asked_qa,
    } = body;

    if (!drill_type || !case_prompt || !answer_text) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: drill_type, case_prompt, answer_text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!RUBRICS[drill_type]) {
      return new Response(
        JSON.stringify({ error: `Unknown drill_type: ${drill_type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = buildSystemPrompt(drill_type, difficulty || "medium");

    const contextBlock = context_info
      ? `\nKONTEXT / HINWEISE:\n${context_info}`
      : "";

    const referenceText = framework_guidance || reference_solution;
    const referenceBlock = referenceText
      ? `\nBEISPIEL-LÖSUNG (nur EINE von vielen möglichen Strukturen – Referenz für Tiefe und Breite, der User muss sie NICHT treffen):\n${referenceText}`
      : "";

    const notesBlock = interviewer_notes
      ? `\nINTERVIEWER-HINWEISE (interner Bewertungsmaßstab: welche Hebel in diesem Case wirklich zählen):\n${interviewer_notes}`
      : "";

    const askedQaBlock =
      Array.isArray(asked_qa) && asked_qa.length > 0
        ? `\nRÜCKFRAGEN DES KANDIDATEN AN DEN INTERVIEWER (vor dem Strukturieren gestellt):\n${asked_qa
            .map((p: { q?: string; a?: string }) => `- Frage: ${p?.q ?? ""}\n  Antwort: ${p?.a ?? ""}`)
            .join("\n")}`
        : "";

    const userPrompt = `AUFGABE: ${case_prompt}${contextBlock}${notesBlock}${referenceBlock}${askedQaBlock}

ANTWORT DES USERS:
${answer_text}

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
          tools: [buildToolSchema(drill_type)],
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
    console.error("evaluate-drill error:", e);
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
