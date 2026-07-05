import { supabase } from "@/integrations/supabase/client";
import { TextDrillCase } from "@/types/textDrill";

// Pools live in memory per module instance.
const pools: Record<string, TextDrillCase[]> = {};

// seenIds persist across sprints in the SAME browser session (sessionStorage).
// Goal: a user playing multiple Creativity sprints in one sitting never sees the
// same case twice — until they have actually seen every case in the active pool,
// at which point we drop only the pool-specific ids and let them cycle.
const SEEN_KEY = (tableName: string) => `pumpkin_seenIds_${tableName}`;

const getSeenIds = (tableName: string): string[] => {
  if (typeof window === "undefined" || !window.sessionStorage) return [];
  try {
    const raw = sessionStorage.getItem(SEEN_KEY(tableName));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const setSeenIds = (tableName: string, ids: string[]): void => {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    sessionStorage.setItem(SEEN_KEY(tableName), JSON.stringify(ids));
  } catch {
    /* sessionStorage full or unavailable — silently ignore */
  }
};

export const fetchTextDrillCases = async (
  tableName: string,
  difficulty: "easy" | "medium" | "hard",
  categoryField?: string,
  categoryValues?: string[]
): Promise<void> => {
  let query = supabase
    .from(tableName as any)
    .select("*")
    .eq("active", true)
    .eq("difficulty", difficulty);

  if (categoryField && categoryValues && categoryValues.length > 0 && !categoryValues.includes("all")) {
    query = query.in(categoryField, categoryValues);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    pools[tableName] = [];
    return;
  }
  pools[tableName] = (data ?? []).map((d: any) => ({
    id: d.id,
    difficulty: d.difficulty,
    prompt: d.prompt,
    category: d[categoryField || "category"] || "",
    context_info: d.context_info || d.interpretation_hints || null,
    reference_solution: d.reference_solution || d.reference_answer || d.reference_ideas || null,
    reference_tree: d.reference_tree || null,
    clarifying_qa: d.clarifying_qa || null,
    interviewer_notes: d.interviewer_notes || null,
  }));
};

/**
 * Optional explicit reset (e.g. for a "starte komplett neu" button).
 * Not called between sprints anymore — sessionStorage carries dedup across sprints.
 */
export const resetTextDrillSession = (tableName: string) => {
  setSeenIds(tableName, []);
};

export const getNextTextDrillCase = (tableName: string): TextDrillCase | null => {
  const pool = pools[tableName] || [];
  if (pool.length === 0) return null;

  let seen = getSeenIds(tableName);
  let available = pool.filter((c) => !seen.includes(c.id));

  if (available.length === 0) {
    // Active pool fully seen this session — drop only the pool-specific ids
    // so other category combos keep their dedup memory.
    const poolIds = new Set(pool.map((c) => c.id));
    seen = seen.filter((id) => !poolIds.has(id));
    setSeenIds(tableName, seen);
    available = pool;
  }

  const picked = available[Math.floor(Math.random() * available.length)];
  setSeenIds(tableName, [...seen, picked.id]);
  return picked;
};

export const submitTextDrillAnswer = async (params: {
  drillType: string;
  caseId: string;
  sessionId: string;
  userEmail: string;
  answerText: string;
  timeSpentSec: number;
}): Promise<string | null> => {
  const { data, error } = await supabase
    .from("text_drill_submissions" as any)
    .insert({
      drill_type: params.drillType,
      case_id: params.caseId,
      session_id: params.sessionId,
      user_email: params.userEmail,
      answer_text: params.answerText,
      time_spent_sec: params.timeSpentSec,
    } as any)
    .select("id")
    .single();

  if (error) {
    console.error("Error submitting answer:", error.message);
    return null;
  }
  return (data as any)?.id ?? null;
};

export const saveTextDrillEvaluation = async (params: {
  submissionId: string;
  totalScore: number;
  scoresJson: any;
  feedbackJson: any;
  flagged: boolean;
}): Promise<void> => {
  const { error } = await supabase
    .from("text_drill_evaluations" as any)
    .insert({
      submission_id: params.submissionId,
      total_score: params.totalScore,
      scores_json: params.scoresJson,
      feedback_json: params.feedbackJson,
      flagged: params.flagged,
    } as any);

  if (error) {
    console.error("Error saving evaluation:", error.message);
  }
};
