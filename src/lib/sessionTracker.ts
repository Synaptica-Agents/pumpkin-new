import { supabase } from "@/integrations/supabase/client";

/**
 * Save a drill session result to the database.
 * Returns the session ID for linking attempts.
 */
export const saveDrillSession = async (params: {
  userEmail: string;
  drillType: "mental_math" | "case_math" | "market_sizing";
  correctCount: number;
  totalCount: number;
  accuracyPercent: number;
  durationSeconds: number;
}): Promise<string | null> => {
  const { data, error } = await supabase
    .from("drill_sessions")
    .insert({
      user_email: params.userEmail,
      drill_type: params.drillType,
      correct_count: params.correctCount,
      total_count: params.totalCount,
      accuracy_percent: params.accuracyPercent,
      duration_seconds: params.durationSeconds,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error saving drill session:", error.message);
    return null;
  }

  return data?.id ?? null;
};

/**
 * Save individual drill attempts for a session.
 */
export const saveDrillAttempts = async (params: {
  userEmail: string;
  drillType: "mental_math" | "case_math" | "market_sizing";
  sessionId: string | null;
  attempts: Array<{
    taskType: string;
    isCorrect: boolean;
    responseTimeMs: number;
    difficulty?: string;
  }>;
}): Promise<void> => {
  if (params.attempts.length === 0) return;

  const rows = params.attempts.map((a) => ({
    user_email: params.userEmail,
    drill_type: params.drillType,
    task_type: a.taskType,
    is_correct: a.isCorrect,
    response_time_ms: a.responseTimeMs,
    session_id: params.sessionId,
    difficulty: a.difficulty || "medium",
  }));

  const { error } = await supabase.from("drill_attempts").insert(rows);

  if (error) {
    console.error("Error saving drill attempts:", error.message);
  }
};

export interface DrillSessionRow {
  id: string;
  drill_type: string;
  correct_count: number;
  total_count: number;
  accuracy_percent: number;
  duration_seconds: number;
  created_at: string;
}

/**
 * Fetch all drill sessions for a given user email.
 */
export const fetchDrillSessions = async (
  userEmail: string,
  since?: Date
): Promise<DrillSessionRow[]> => {
  let query = supabase
    .from("drill_sessions")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: true });

  if (since) {
    query = query.gte("created_at", since.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching drill sessions:", error.message);
    return [];
  }

  return (data ?? []) as DrillSessionRow[];
};

export interface DrillAttemptRow {
  id: string;
  drill_type: string;
  task_type: string;
  is_correct: boolean;
  response_time_ms: number;
  session_id: string | null;
  created_at: string;
  difficulty?: string;
}

/**
 * Fetch all drill attempts for a given user email.
 */
export const fetchDrillAttempts = async (
  userEmail: string,
  since?: Date
): Promise<DrillAttemptRow[]> => {
  let query = supabase
    .from("drill_attempts")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: true });

  if (since) {
    query = query.gte("created_at", since.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching drill attempts:", error.message);
    return [];
  }

  return (data ?? []) as DrillAttemptRow[];
};
