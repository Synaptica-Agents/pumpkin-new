import { supabase } from "@/integrations/supabase/client";
import { TextDrillCase } from "@/types/textDrill";

// Each drill type gets its own pool
const pools: Record<string, TextDrillCase[]> = {};
const seenIds: Record<string, string[]> = {};

export const fetchTextDrillCases = async (
  tableName: string,
  difficulty: "easy" | "medium" | "hard",
  categoryField?: string,
  categoryValue?: string
): Promise<void> => {
  let query = supabase
    .from(tableName as any)
    .select("*")
    .eq("active", true)
    .eq("difficulty", difficulty);

  if (categoryField && categoryValue && categoryValue !== "all") {
    query = query.eq(categoryField, categoryValue);
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
    chart_data: d.chart_data || null,
    chart_title: d.chart_title || null,
  }));
};

export const resetTextDrillSession = (tableName: string) => {
  seenIds[tableName] = [];
};

export const getNextTextDrillCase = (tableName: string): TextDrillCase | null => {
  const pool = pools[tableName] || [];
  if (pool.length === 0) return null;

  const seen = seenIds[tableName] || [];
  let excludeCount = Math.min(20, pool.length - 1);
  let lastSeen = seen.slice(-excludeCount);
  let available = pool.filter((c) => !lastSeen.includes(c.id));

  if (available.length === 0) {
    excludeCount = Math.min(5, pool.length - 1);
    lastSeen = seen.slice(-excludeCount);
    available = pool.filter((c) => !lastSeen.includes(c.id));
  }
  if (available.length === 0) available = pool;

  const picked = available[Math.floor(Math.random() * available.length)];
  if (!seenIds[tableName]) seenIds[tableName] = [];
  seenIds[tableName].push(picked.id);
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
