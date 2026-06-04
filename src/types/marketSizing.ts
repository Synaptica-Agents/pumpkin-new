export interface MarketSizingCase {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  industry_tag: string;
  region: string;
  prompt: string;
  target_metric: string;
  unit_hint: string | null;
  allowed_methods: string;
  reference_structure: string | null;
  expected_order_of_magnitude_min: number | null;
  expected_order_of_magnitude_max: number | null;
  key_assumptions_examples: string | null;
}

export interface MarketSizingEvaluation {
  total_score: number;
  scores: {
    structure_mece: number;
    assumptions: number;
    math_consistency: number;
    plausibility_sanity: number;
  };
  strengths: string[];
  improvements: string[];
  red_flags?: string[];
  flagged: boolean;
  one_line_summary: string;
}

export interface MarketSizingResult {
  case: MarketSizingCase;
  answerText: string;
  finalEstimateValue: number | null;
  finalEstimateUnit: string;
  timeSpentSec: number;
  evaluation: MarketSizingEvaluation | null;
  submissionId?: string;
}

export type MarketSizingPhase = "config" | "answering" | "evaluating" | "result" | "debrief";

// ============================================
// Step 1: Verständnis & Methode
// ============================================

export type MarketSizingMethod = "top_down" | "bottom_up" | "mixed";

export interface MarketSizingClarification {
  id: string;
  question: string;
  answer: string;
}

export interface MarketSizingUnderstanding {
  /** Optional clarifying questions the user posed and how they answered (max 3). */
  clarifications: MarketSizingClarification[];
  /** Required method choice. */
  method: MarketSizingMethod | null;
  /** Why this method was chosen (1-2 sentences). */
  methodReason: string;
}

// ============================================
// Step 5: Strukturierter Sanity Check
// ============================================

export interface SanityCheckStructured {
  /** Magnitude reasoning, e.g. "Liegt im Bereich 50-100M, was plausibel ist weil…" */
  magnitudeCheck: string;
  /** Optional reference label, e.g. "Statistisches Bundesamt: 83M Einwohner" */
  comparisonRef: string;
  /** Optional comparison value as raw user input ("83 Mio", "0,5 Mrd"). */
  comparisonValue: string;
  /** Plausibility reasoning (1-2 sentences). */
  reasoning: string;
}
