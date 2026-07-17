import { FrameworkNode } from "@/types/frameworkBuilder";
import { ChartExhibit, ChartQuestion } from "@/types/charts";

/** Eine Rückfrage des Kandidaten samt Interviewer-Antwort. */
export interface ClarifyingQA {
  q: string;
  a: string;
}

export interface TextDrillCase {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  category?: string;
  context_info?: string | null;
  reference_solution?: string | null;
  reference_tree?: FrameworkNode[] | null; // only for frameworks drill: graphical sample solution
  clarifying_qa?: ClarifyingQA[] | null; // frameworks: Fakten, die nur auf Rückfrage preisgegeben werden
  interviewer_notes?: string | null; // frameworks: interner Bewertungs-/Interviewer-Maßstab
  title?: string | null; // charts: Exhibit-Titel (z.B. "Eurotech – Exhibit 2")
  exhibits?: ChartExhibit[] | null; // charts: 1–2 Exhibits (Tabelle/Diagramm)
  additional_info?: string[] | null; // charts: "Additional Info"-Bullets neben dem Exhibit
  questions?: ChartQuestion[] | null; // charts: 1–2 Fragen mit Musterlösung
}

export interface TextDrillEvaluation {
  total_score: number;
  scores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  red_flags?: string[];
  flagged: boolean;
  one_line_summary: string;
}

export interface TextDrillResult {
  case: TextDrillCase;
  answerText: string;
  timeSpentSec: number;
  evaluation: TextDrillEvaluation | null;
  submissionId?: string;
}

export type TextDrillPhase = "config" | "answering" | "evaluating" | "result" | "debrief";

export interface DrillConfig {
  drillType: string;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name
  tableName: string;
  categoryField: string; // which field to use for filtering (category, chart_type, industry)
  categoryLabel: string; // UI label for category filter
  categories: { value: string; label: string }[];
  difficultyOptions: { value: "easy" | "medium" | "hard"; label: string; desc: string }[];
  hintText: string;
  startButtonText: string;
  rubricLabels: { key: string; label: string; max: number }[];
  placeholder: string; // textarea placeholder
  structureGuide?: string[]; // step-by-step guide shown above textarea
  sprintMode?: boolean; // true (default) = timed sprint with multiple cases. false = single case, quality focus, time tracked silently
  timeReferenceMinutes?: number; // for non-sprint mode: suggested time per case (shown in feedback)
}
