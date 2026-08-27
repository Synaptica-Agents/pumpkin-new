import { supabase } from "@/integrations/supabase/client";
import { TextDrillCase } from "@/types/textDrill";
import type { FixedCaseRef } from "@/lib/testMode";
import {
  SolvedCounts,
  appendLocalSolved,
  countsFromIds,
  pickLeastSolved,
  readLocalSolved,
} from "@/lib/solvedCases";

// Pools live in memory per module instance.
const pools: Record<string, TextDrillCase[]> = {};

// Löse-Zähler je Tabelle: DB-Historie des Nutzers (user_email) plus die
// Abgaben dieser Session. Eine gelöste Aufgabe kommt erst wieder, wenn alle
// anderen des aktiven Pools gleich oft gelöst wurden.
const solvedCounts: Record<string, SolvedCounts> = {};
// Kontext hinter dem Zähler (für Inkremente nach Abgabe + anonymen Fallback).
const historyScope: Record<string, { userEmail: string | null; drillType: string }> = {};

export interface CaseHistoryRef {
  userEmail: string | null;
  drillType: string;
}

const loadSolvedCounts = async (
  tableName: string,
  scope: { userEmail: string | null; drillType: string }
): Promise<SolvedCounts> => {
  if (!scope.userEmail) return countsFromIds(readLocalSolved(tableName));
  const { data, error } = await supabase
    .from("text_drill_submissions" as any)
    .select("case_id")
    .eq("user_email", scope.userEmail)
    .eq("drill_type", scope.drillType)
    .limit(10000);
  if (error) {
    console.error("Error loading solved history:", error.message);
    return countsFromIds(readLocalSolved(tableName));
  }
  return countsFromIds((data ?? []).map((d: any) => d.case_id as string));
};

/** Abgabe lokal mitzählen, damit der nächste Zug den Case sofort meidet. */
const noteSolved = (drillType: string, caseId: string): void => {
  for (const [table, scope] of Object.entries(historyScope)) {
    if (scope.drillType !== drillType) continue;
    const m = solvedCounts[table] ?? (solvedCounts[table] = new Map());
    m.set(caseId, (m.get(caseId) ?? 0) + 1);
    if (!scope.userEmail) appendLocalSolved(table, caseId);
  }
};

export const fetchTextDrillCases = async (
  tableName: string,
  difficulty: "easy" | "medium" | "hard",
  categoryField?: string,
  categoryValues?: string[],
  fixedCase?: FixedCaseRef,
  history?: CaseHistoryRef
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
  let mapped: TextDrillCase[] = (data ?? []).map((d: any) => ({
    id: d.id,
    difficulty: d.difficulty,
    prompt: d.prompt,
    category: d[categoryField || "category"] || "",
    context_info: d.context_info || d.interpretation_hints || null,
    reference_solution: d.reference_solution || d.reference_answer || d.reference_ideas || null,
    reference_tree: d.reference_tree || null,
    clarifying_qa: d.clarifying_qa || null,
    interviewer_notes: d.interviewer_notes || null,
    title: d.title || null,
    exhibits: d.exhibits || null,
    additional_info: d.additional_info || null,
    questions: d.questions || null,
  }));

  // Test-Modus (/test): Pool auf den fest verdrahteten Demo-Case reduzieren.
  if (fixedCase) {
    const only = mapped.filter(
      (c) => c.id === fixedCase.caseId || c.prompt.includes(fixedCase.promptContains)
    );
    if (only.length > 0) {
      mapped = only;
    } else {
      console.warn(`[testMode] Fixer Case nicht im ${tableName}-Pool gefunden — voller Pool bleibt aktiv.`);
    }
  }

  pools[tableName] = mapped;

  // Löse-Historie des Nutzers laden — steuert, welche Cases zuerst drankommen.
  historyScope[tableName] = history ?? { userEmail: null, drillType: "" };
  solvedCounts[tableName] = await loadSolvedCounts(tableName, historyScope[tableName]);
};

export const getNextTextDrillCase = (tableName: string): TextDrillCase | null => {
  // "Am seltensten gelöst zuerst": bereits gelöste Cases kommen erst wieder,
  // wenn alle anderen des aktiven Pools gleich oft gelöst wurden.
  return pickLeastSolved(pools[tableName] || [], solvedCounts[tableName] ?? new Map());
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

  // Unabhängig vom Insert-Erfolg lokal zählen: bearbeitet ist bearbeitet.
  noteSolved(params.drillType, params.caseId);

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
