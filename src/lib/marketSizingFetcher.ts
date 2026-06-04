import { supabase } from "@/integrations/supabase/client";
import { MarketSizingCase } from "@/types/marketSizing";

let casesPool: MarketSizingCase[] = [];
let seenIds: string[] = [];
let seenIndustries: string[] = [];

export const fetchMarketSizingCases = async (): Promise<void> => {
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
  casesPool = (data ?? []) as unknown as MarketSizingCase[];
};

export const resetMarketSizingSession = () => {
  seenIds = [];
  seenIndustries = [];
};

export const getNextMarketSizingCase = (): MarketSizingCase | null => {
  if (casesPool.length === 0) return null;

  // Exclude seen IDs with fallback
  let excludeCount = Math.min(20, casesPool.length - 1);
  let lastSeenIds = seenIds.slice(-excludeCount);
  let available = casesPool.filter((c) => !lastSeenIds.includes(c.id));

  if (available.length === 0) {
    excludeCount = Math.min(10, casesPool.length - 1);
    lastSeenIds = seenIds.slice(-excludeCount);
    available = casesPool.filter((c) => !lastSeenIds.includes(c.id));
  }
  if (available.length === 0) {
    excludeCount = Math.min(5, casesPool.length - 1);
    lastSeenIds = seenIds.slice(-excludeCount);
    available = casesPool.filter((c) => !lastSeenIds.includes(c.id));
  }
  if (available.length === 0) available = casesPool;

  // Prioritize unseen industries
  const recentIndustries = seenIndustries.slice(-10);
  const freshIndustry = available.filter(
    (c) => !recentIndustries.includes(c.industry_tag)
  );
  const pool = freshIndustry.length > 0 ? freshIndustry : available;

  const picked = pool[Math.floor(Math.random() * pool.length)];
  seenIds.push(picked.id);
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
