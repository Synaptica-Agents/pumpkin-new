// Shared helpers for IB-Bot Edge Functions: prompt builder, tool schemas,
// rating-to-difficulty mapping. Imported by ib-start-session, ib-turn, ib-finalize.

export const IB_TOPICS = [
  "m_and_a",
  "accounting",
  "valuation",
  "dcf",
  "lbo",
  "markets",
] as const;

export type IBTopic = typeof IB_TOPICS[number];
export type QuestionType = "wiedergabe" | "anwendung" | "verstaendnis";
export type JudgeVerdict = "correct" | "unvollstaendig" | "falsch" | "n/a";
export type AdvanceStage = "same" | "anwendung" | "verstaendnis" | "next_archetype";
export type EndReason = "time_limit" | "user_ended" | "abandoned";

export const SESSION_MAX_SECONDS = 30 * 60;
export const SL_BUMP_AT_SECONDS_FIRST = 10 * 60;
export const SL_BUMP_AT_SECONDS_SECOND = 15 * 60;

export interface RatingMapping {
  starting_difficulty: number;
  max_difficulty: number;
}

export function mapRatingToDifficulty(rating: number): RatingMapping {
  if (rating <= 8) return { starting_difficulty: 1, max_difficulty: 2 };
  if (rating <= 12) return { starting_difficulty: 2, max_difficulty: 3 };
  if (rating <= 20) return { starting_difficulty: 3, max_difficulty: 5 };
  return { starting_difficulty: 4, max_difficulty: 5 };
}

export function computeDifficultyAtElapsed(
  starting: number,
  max: number,
  elapsedSeconds: number,
): number {
  let d = starting;
  if (elapsedSeconds >= SL_BUMP_AT_SECONDS_FIRST && d < max) d++;
  if (elapsedSeconds >= SL_BUMP_AT_SECONDS_SECOND && d < max) d++;
  return d;
}

export function nextStage(current: QuestionType): QuestionType | "next_archetype" {
  if (current === "wiedergabe") return "anwendung";
  if (current === "anwendung") return "verstaendnis";
  return "next_archetype";
}

export interface TurnHistoryEntry {
  turn_index: number;
  user_transcript: string | null;
  bot_response: string | null;
  judge_verdict: string | null;
  archetype: string | null;
  stage: string | null;
}

export interface QuestionRow {
  id: string;
  prompt: string;
  optimal_answer: string;
  key_points: string[] | null;
  archetype: string;
  question_type: QuestionType;
  difficulty_level: number;
  topic: string;
}

export interface BuildTurnPromptInput {
  archetype: string;
  stage: QuestionType;
  difficulty: number;
  topics: string[];
  company: string | null;
  turn_history: TurnHistoryEntry[];
  active_question: QuestionRow | null;
  next_question: QuestionRow | null;
  is_first_turn: boolean;
}

export function buildTurnSystemPrompt(input: BuildTurnPromptInput): string {
  const historyText = input.turn_history.length === 0
    ? "(noch keine Turns)"
    : input.turn_history.map((t) => {
        const u = t.user_transcript ? `User: ${t.user_transcript}` : "";
        const b = t.bot_response ? `Bot: ${t.bot_response}` : "";
        const v = t.judge_verdict ? `[Verdict: ${t.judge_verdict}]` : "";
        return [u, b, v].filter(Boolean).join("\n");
      }).join("\n---\n");

  const activeQ = input.active_question
    ? `${input.active_question.prompt}\n\nOPTIMALE ANTWORT:\n${input.active_question.optimal_answer}\n\nKERNPUNKTE (muessen in User-Antwort sein):\n${(input.active_question.key_points ?? []).map(k => `- ${k}`).join("\n") || "(keine definiert — urteile nach Optimaler Antwort)"}`
    : "(noch keine aktive Frage — dies ist der erste Turn, stelle eine Einstiegsfrage)";

  const nextQ = input.next_question
    ? `${input.next_question.prompt}\n  Archetyp: ${input.next_question.archetype} / Stage: ${input.next_question.question_type} / SL: ${input.next_question.difficulty_level}`
    : "(keine weitere Frage vorbereitet — improvisiere basierend auf Archetyp)";

  return `Du bist ein erfahrener Interviewer bei einer Bulge-Bracket-Investmentbank und fuehrst ein 30-Minuten-Mock-Interview fuer eine Praktikums-Bewerbung. Du hast ZWEI Rollen pro Turn:

1) KRITISCHER RICHTER: Pruefe die letzte User-Antwort gegen die "Optimale Antwort" und die Kernpunkte unten. Verdicts:
   - correct: alle Kernpunkte abgedeckt, User darf in der Kette aufsteigen
   - unvollstaendig: Richtung stimmt, aber wichtige Punkte fehlen -> Nachfrage
   - falsch: faktisch falsch oder am Thema vorbei -> scharfe Korrektur-Rueckfrage
   - n/a: erster Turn oder User hat nichts substantielles gesagt
   Sei streng wie ein echter MD. Kein Mitleid, aber fair.

2) INTERVIEWER: Formuliere eine natuerliche Reaktion auf die Antwort und stelle die naechste Frage — alles in einem Fluss, nicht als separate Absaetze. Auf Deutsch, professionell-freundlich, knapp. KEINE Aufzaehlungen, KEIN Markdown, KEINE Zwischenueberschriften. Nur gesprochener Fliesstext, wie in einem echten Interview.

KONTEXT:
- Archetyp: ${input.archetype} (Stage: ${input.stage})
- Schwierigkeits-Level: ${input.difficulty}/5
- Gewaehlte Themen: ${input.topics.join(", ")}
- Zielunternehmen: ${input.company || "keines"}

BISHERIGE TURNS (juengster zuerst nicht, chronologisch):
${historyText}

AKTUELLE FRAGE (die du im vorherigen Turn gestellt hast — der User hat gerade darauf geantwortet):
${activeQ}

NAECHSTE VORBEREITETE FRAGE (nutze sie bei Stage-Advance oder transition):
${nextQ}

ENTSCHEIDUNGSLOGIK:
- Wenn Verdict "correct" UND aktuelle Stage ist "verstaendnis" -> tool "transition_to_new_archetype"
- Sonst -> tool "judge_and_respond" mit passendem advance_to_stage
  - correct + stage wiedergabe -> advance_to_stage "anwendung"
  - correct + stage anwendung -> advance_to_stage "verstaendnis"
  - unvollstaendig/falsch -> advance_to_stage "same" (Nachfrage auf gleicher Stage)
${input.is_first_turn ? "\nBESONDERHEIT: Dies ist der ERSTE Turn der Session. Verdict = \"n/a\". bot_response beginnt das Gespraech mit einer kurzen Begruessung und der ersten Einstiegsfrage (aus NAECHSTE VORBEREITETE FRAGE)." : ""}`;
}

export const TOOL_JUDGE_AND_RESPOND = {
  type: "function",
  function: {
    name: "judge_and_respond",
    description: "Standard tool: judge the user's last answer and generate the next bot utterance (either a follow-up on the same stage or advance to the next stage within the same archetype).",
    parameters: {
      type: "object",
      properties: {
        verdict: {
          type: "string",
          enum: ["correct", "unvollstaendig", "falsch", "n/a"],
          description: "Assessment of the user's last answer against the optimal answer",
        },
        missing_points: {
          type: "array",
          items: { type: "string" },
          description: "Key points the user missed (empty if correct)",
        },
        judge_rationale: {
          type: "string",
          description: "Short internal reason for the verdict (stored in DB, not shown to user)",
        },
        bot_response: {
          type: "string",
          description: "The complete German text the bot will say — natural flowing sentences, includes both reaction to the user's answer AND the next question. No bullet points, no markdown.",
        },
        advance_to_stage: {
          type: "string",
          enum: ["same", "anwendung", "verstaendnis"],
          description: "Which stage the next question should target. 'same' = stay on current stage (retry with follow-up), 'anwendung'/'verstaendnis' = advance in the chain.",
        },
        next_question_id_used: {
          type: ["string", "null"],
          description: "UUID of the next question from the prepared question, or null if no question was embedded",
        },
      },
      required: ["verdict", "missing_points", "judge_rationale", "bot_response", "advance_to_stage", "next_question_id_used"],
      additionalProperties: false,
    },
  },
};

export const TOOL_TRANSITION = {
  type: "function",
  function: {
    name: "transition_to_new_archetype",
    description: "Use this tool ONLY when the user has just passed the verstaendnis stage of the current archetype. Switches to a new archetype from the queue and starts it at the wiedergabe stage.",
    parameters: {
      type: "object",
      properties: {
        judge_verdict: {
          type: "string",
          enum: ["correct"],
          description: "Must be 'correct' — transitions only happen on a correct verstaendnis answer",
        },
        judge_rationale: {
          type: "string",
          description: "Short reason for verdict",
        },
        bot_response: {
          type: "string",
          description: "German text: brief confirmation + transition sentence + first question of the new archetype",
        },
        next_question_id_used: {
          type: ["string", "null"],
          description: "UUID of the first question of the new archetype",
        },
      },
      required: ["judge_verdict", "judge_rationale", "bot_response", "next_question_id_used"],
      additionalProperties: false,
    },
  },
};

export const TOOL_INTRO = {
  type: "function",
  function: {
    name: "submit_intro",
    description: "Generate the opening statement and first question of the interview.",
    parameters: {
      type: "object",
      properties: {
        intro_text: {
          type: "string",
          description: "German text: brief friendly greeting, mentions the selected topics, then leads into the first question. Flowing natural sentences, no bullets. 2-4 sentences.",
        },
        first_question_id: {
          type: ["string", "null"],
          description: "UUID of the first question, or null if improvising",
        },
      },
      required: ["intro_text", "first_question_id"],
      additionalProperties: false,
    },
  },
};

export const TOOL_FINAL_FEEDBACK = {
  type: "function",
  function: {
    name: "submit_final_feedback",
    description: "Produce the final 3-pillar rating and actionable feedback for the completed interview session.",
    parameters: {
      type: "object",
      properties: {
        content_score: { type: "number", description: "1-5 stars: fachliche Korrektheit" },
        structure_score: { type: "number", description: "1-5 stars: Logik/Pyramid-Prinzip" },
        delivery_score: { type: "number", description: "1-5 stars: Souveraenitaet und Rhetorik" },
        rationale: { type: "string", description: "1-2 sentence summary of overall performance" },
        strengths: { type: "array", items: { type: "string" }, description: "Max 3 concrete strengths" },
        improvements: { type: "array", items: { type: "string" }, description: "Max 3 concrete, actionable improvements" },
        resource_links: {
          type: "array",
          items: {
            type: "object",
            properties: {
              topic: { type: "string" },
              label: { type: "string" },
              url: { type: "string" },
            },
            required: ["topic", "label", "url"],
            additionalProperties: false,
          },
          description: "Up to 3 recommended resources based on weakest topics",
        },
      },
      required: ["content_score", "structure_score", "delivery_score", "rationale", "strengths", "improvements", "resource_links"],
      additionalProperties: false,
    },
  },
};

// Hardcoded resource lookup per topic (v1). Claude picks from this when giving feedback.
export const TOPIC_RESOURCES: Record<string, Array<{ label: string; url: string }>> = {
  m_and_a: [
    { label: "Rosenbaum & Pearl - Investment Banking (Kapitel M&A)", url: "https://www.wiley.com/en-us/Investment+Banking%3A+Valuation%2C+LBOs%2C+M%26A%2C+and+IPOs%2C+3rd+Edition-p-9781119706182" },
  ],
  accounting: [
    { label: "Wall Street Prep - 3-Statement Modeling", url: "https://www.wallstreetprep.com/" },
  ],
  valuation: [
    { label: "Damodaran Online - Valuation", url: "https://pages.stern.nyu.edu/~adamodar/" },
  ],
  dcf: [
    { label: "Damodaran - DCF Primer", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/lectures/valintro.html" },
  ],
  lbo: [
    { label: "Rosenbaum & Pearl - LBO Analysis", url: "https://www.wiley.com/en-us/Investment+Banking%3A+Valuation%2C+LBOs%2C+M%26A%2C+and+IPOs%2C+3rd+Edition-p-9781119706182" },
  ],
  markets: [
    { label: "Financial Times Markets", url: "https://www.ft.com/markets" },
  ],
};

export function getTopicResources(topic: string): Array<{ label: string; url: string }> {
  return TOPIC_RESOURCES[topic] ?? [];
}
