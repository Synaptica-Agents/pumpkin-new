// scripts/generate-ib-questions.ts
//
// One-shot generator that uses Claude via OpenRouter to produce ~100 IB interview
// questions and writes them as SQL INSERT statements to
// supabase/migrations/20260425000001_ib_bot_seed.sql
//
// Usage:
//   OPENROUTER_API_KEY=... npx tsx scripts/generate-ib-questions.ts
//
// Idempotent: running twice overwrites the seed file. After running, `supabase
// db push` applies the seed.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("OPENROUTER_API_KEY env var required");
  process.exit(1);
}

type Stage = "wiedergabe" | "anwendung" | "verstaendnis";

interface Spec {
  topic: string;
  archetype: string;
  stage: Stage;
  difficulty: number;
}

const MATRIX: Record<string, string[]> = {
  m_and_a: ["accretion_dilution", "synergy_valuation", "premium_analysis"],
  accounting: ["three_statement_link", "working_capital", "dcf_fcf_bridge"],
  valuation: ["wacc_calc", "comps_selection", "exit_multiple"],
  dcf: ["terminal_value", "growth_rate", "beta_unlevering"],
  lbo: ["returns_analysis", "capital_structure", "exit_scenarios"],
  markets: ["news_rationale", "rates_impact", "sector_pitch"],
};

const STAGES: Stage[] = ["wiedergabe", "anwendung", "verstaendnis"];

function buildSpecs(): Spec[] {
  const specs: Spec[] = [];
  for (const [topic, archetypes] of Object.entries(MATRIX)) {
    for (const archetype of archetypes) {
      for (const stage of STAGES) {
        // 2 difficulty levels per (topic, archetype, stage) — center of range
        for (const difficulty of [2, 4]) {
          specs.push({ topic, archetype, stage, difficulty });
        }
      }
    }
  }
  return specs;
}

interface GeneratedQuestion {
  prompt: string;
  optimal_answer: string;
  key_points: string[];
}

const GENERATE_TOOL = {
  type: "function" as const,
  function: {
    name: "submit_question",
    description: "Submit an IB interview question with optimal answer and key points",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The German interview question — one clear sentence, realistic IB tone",
        },
        optimal_answer: {
          type: "string",
          description:
            "The reference answer (3-6 sentences in German, covers the expected depth for this stage/difficulty)",
        },
        key_points: {
          type: "array",
          items: { type: "string" },
          description: "2-5 must-have points that a correct answer must mention (in German, keywords)",
        },
      },
      required: ["prompt", "optimal_answer", "key_points"],
      additionalProperties: false,
    },
  },
};

function systemPrompt(spec: Spec): string {
  const stageDescriptions: Record<Stage, string> = {
    wiedergabe: "REPRODUZIERT Wissen (Definition, Formel, Schema). User soll wiedergeben was er gelernt hat.",
    anwendung: "WENDET Wissen auf Szenario an (z.B. Zahlenbeispiel, Case). User muss rechnen oder anwenden.",
    verstaendnis: "TESTET TIEFES VERSTANDNIS (Warum?, Trade-offs, Edge-Cases, Annahmen-Hinterfragung).",
  };

  const difficultyNote = spec.difficulty <= 2
    ? "EINFACH: Standard-Frage, wie sie in jedem IB-Prep-Buch vorkommt."
    : "SCHWIERIG: Nuancierte Frage mit Trade-off oder Edge-Case, wie sie ein strenger MD stellen wuerde.";

  return `Du erzeugst Interview-Fragen fuer ein deutschsprachiges Investmentbanking-Mock-Interview-Training.

FRAGE-SPEZIFIKATION:
- Thema: ${spec.topic}
- Archetyp: ${spec.archetype}
- Stage: ${spec.stage} — ${stageDescriptions[spec.stage]}
- Schwierigkeit: ${spec.difficulty}/5. ${difficultyNote}

ANFORDERUNGEN:
- Frage ist prazise, eindeutig, realistisch fuer ein IB-Interview.
- Optimale Antwort ist fachlich korrekt und komplett (aber kompakt, 3-6 Saetze).
- Kernpunkte sind die 2-5 Kernbegriffe/Konzepte die eine korrekte Antwort enthalten muss.
- Alles auf Deutsch.
- KEIN Meta-Kommentar ("Hier ist deine Frage..."), nur die Frage direkt.`;
}

async function generateOne(spec: Spec): Promise<GeneratedQuestion | null> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4.6",
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt(spec) },
        { role: "user", content: "Generiere jetzt eine Frage nach der Spezifikation." },
      ],
      tools: [GENERATE_TOOL],
      tool_choice: { type: "function", function: { name: "submit_question" } },
    }),
  });

  if (!res.ok) {
    console.error(`FAIL ${spec.topic}/${spec.archetype}/${spec.stage}/SL${spec.difficulty}: ${res.status}`);
    return null;
  }

  const data = await res.json();
  const tc = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!tc) return null;

  try {
    return typeof tc.function.arguments === "string"
      ? JSON.parse(tc.function.arguments)
      : tc.function.arguments;
  } catch {
    return null;
  }
}

function sqlEscape(s: string): string {
  return s.replace(/'/g, "''");
}

function sqlArray(items: string[]): string {
  return `ARRAY[${items.map((x) => `'${sqlEscape(x)}'`).join(", ")}]::text[]`;
}

function toInsert(spec: Spec, q: GeneratedQuestion): string {
  return `INSERT INTO public.ib_questions (topic, archetype, question_type, difficulty_level, prompt, optimal_answer, key_points)
VALUES (
  '${spec.topic}',
  '${spec.archetype}',
  '${spec.stage}',
  ${spec.difficulty},
  '${sqlEscape(q.prompt)}',
  '${sqlEscape(q.optimal_answer)}',
  ${sqlArray(q.key_points)}
);`;
}

async function main() {
  const specs = buildSpecs();
  console.log(`Generating ${specs.length} questions...`);

  const inserts: string[] = [
    "-- Auto-generated by scripts/generate-ib-questions.ts",
    "-- Do not edit manually — re-run the script to regenerate.",
    "",
  ];

  let done = 0;
  let failed = 0;

  for (const spec of specs) {
    const q = await generateOne(spec);
    if (q) {
      inserts.push(toInsert(spec, q));
      done++;
    } else {
      failed++;
    }
    if ((done + failed) % 10 === 0) {
      console.log(`  ${done + failed}/${specs.length} — ${done} ok, ${failed} failed`);
    }
    // Gentle rate-limit
    await new Promise((r) => setTimeout(r, 300));
  }

  const outPath = "supabase/migrations/20260425000001_ib_bot_seed.sql";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, inserts.join("\n"));
  console.log(`\nDone. ${done} questions written to ${outPath}. ${failed} failed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
