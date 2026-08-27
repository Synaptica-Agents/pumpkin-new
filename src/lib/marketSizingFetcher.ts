import { supabase } from "@/integrations/supabase/client";
import { MarketSizingCase, MarketSizingCategory } from "@/types/marketSizing";
import type { FixedCaseRef } from "@/lib/testMode";
import {
  SolvedCounts,
  appendLocalSolved,
  countsFromIds,
  leastSolvedCandidates,
  readLocalSolved,
} from "@/lib/solvedCases";

const LOCAL_SCOPE = "market_sizing_cases";

let casesPool: MarketSizingCase[] = [];
let seenIndustries: string[] = [];
// Löse-Zähler: DB-Historie des Nutzers plus Abgaben dieser Session.
let solvedCounts: SolvedCounts = new Map();
let scopeEmail: string | null = null;

const loadSolvedCounts = async (userEmail: string | null): Promise<SolvedCounts> => {
  if (!userEmail) return countsFromIds(readLocalSolved(LOCAL_SCOPE));
  const { data, error } = await supabase
    .from("market_sizing_submissions" as any)
    .select("case_id")
    .eq("user_email", userEmail)
    .limit(10000);
  if (error) {
    console.error("Error loading solved history:", error.message);
    return countsFromIds(readLocalSolved(LOCAL_SCOPE));
  }
  return countsFromIds((data ?? []).map((d: any) => d.case_id as string));
};

export const fetchMarketSizingCases = async (
  category: MarketSizingCategory = "all",
  fixedCase?: FixedCaseRef,
  history?: { userEmail: string | null }
): Promise<void> => {
  const query = supabase
    .from("market_sizing_cases" as any)
    .select("*")
    .eq("active", true);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching market sizing cases:", error.message);
    casesPool = [];
    return;
  }
  let cases = (data ?? []) as unknown as MarketSizingCase[];
  if (category !== "all") {
    const filtered = cases.filter((c) => c.question_type === category);
    // Fallback: never leave the pool empty if a category is unexpectedly unset.
    if (filtered.length > 0) cases = filtered;
  }

  // Test-Modus (/test): Pool auf den fest verdrahteten Demo-Case reduzieren.
  if (fixedCase) {
    const only = cases.filter(
      (c) => c.id === fixedCase.caseId || c.prompt.includes(fixedCase.promptContains)
    );
    if (only.length > 0) {
      cases = only;
    } else {
      console.warn("[testMode] Fixer Market-Sizing-Case nicht gefunden — voller Pool bleibt aktiv.");
    }
  }

  casesPool = cases;

  // Löse-Historie des Nutzers laden — steuert, welche Cases zuerst drankommen.
  scopeEmail = history?.userEmail ?? null;
  solvedCounts = await loadSolvedCounts(scopeEmail);
};

export const resetMarketSizingSession = () => {
  seenIndustries = [];
};

export const getNextMarketSizingCase = (): MarketSizingCase | null => {
  // "Am seltensten gelöst zuerst": bereits gelöste Cases kommen erst wieder,
  // wenn alle anderen des aktiven Pools gleich oft gelöst wurden.
  const candidates = leastSolvedCandidates(casesPool, solvedCounts);
  if (candidates.length === 0) return null;

  // Innerhalb der Kandidaten: bevorzugt eine Branche, die in dieser Session
  // noch nicht dran war (Abwechslung).
  const recentIndustries = seenIndustries.slice(-10);
  const freshIndustry = candidates.filter(
    (c) => !recentIndustries.includes(c.industry_tag)
  );
  const pool = freshIndustry.length > 0 ? freshIndustry : candidates;

  const picked = pool[Math.floor(Math.random() * pool.length)];
  seenIndustries.push(picked.industry_tag);
  return picked;
};

export const submitMarketSizingAnswer = async (params: {
  caseId: string;
  sessionId: string;
  userEmail: string;
  answerText: string;
  finalEstimateValue: number | null;
  finalEstimateUnit: string;
  timeSpentSec: number;
}): Promise<string | null> => {
  const { data, error } = await supabase
    .from("market_sizing_submissions" as any)
    .insert({
      case_id: params.caseId,
      session_id: params.sessionId,
      user_email: params.userEmail,
      answer_text: params.answerText,
      final_estimate_value: params.finalEstimateValue,
      final_estimate_unit: params.finalEstimateUnit,
      time_spent_sec: params.timeSpentSec,
    } as any)
    .select("id")
    .single();

  // Unabhängig vom Insert-Erfolg lokal zählen: bearbeitet ist bearbeitet.
  solvedCounts.set(params.caseId, (solvedCounts.get(params.caseId) ?? 0) + 1);
  if (!scopeEmail) appendLocalSolved(LOCAL_SCOPE, params.caseId);

  if (error) {
    console.error("Error submitting market sizing answer:", error.message);
    return null;
  }
  return (data as any)?.id ?? null;
};

export const saveMarketSizingEvaluation = async (params: {
  submissionId: string;
  totalScore: number;
  scoresJson: any;
  feedbackJson: any;
  flagged: boolean;
}): Promise<void> => {
  const { error } = await supabase
    .from("market_sizing_evaluations" as any)
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
