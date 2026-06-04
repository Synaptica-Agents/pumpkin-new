import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { useUserEmail } from "@/hooks/useUserEmail";
import { saveDrillSession, saveDrillAttempts } from "@/lib/sessionTracker";
import { ArrowLeft } from "lucide-react";
import { IconMarketSizing } from "@/components/drillIcons";
import MarketSizingConfig from "@/components/marketSizing/MarketSizingConfig";
import MarketSizingGame from "@/components/marketSizing/MarketSizingGame";
import MarketSizingIntroModal from "@/components/marketSizing/MarketSizingIntroModal";
import MarketSizingResultView from "@/components/marketSizing/MarketSizingResult";
import MarketSizingDebrief from "@/components/marketSizing/MarketSizingDebrief";
import { MarketSizingCase, MarketSizingResult, MarketSizingPhase, MarketSizingEvaluation } from "@/types/marketSizing";
import {
  fetchMarketSizingCases, getNextMarketSizingCase, resetMarketSizingSession,
  submitMarketSizingAnswer, saveMarketSizingEvaluation,
} from "@/lib/marketSizingFetcher";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MarketSizingDrill: React.FC = () => {
  const userEmail = useUserEmail();
  const [phase, setPhase] = useState<MarketSizingPhase>("config");
  const [currentCase, setCurrentCase] = useState<MarketSizingCase | null>(null);
  const [results, setResults] = useState<MarketSizingResult[]>([]);
  const [currentResult, setCurrentResult] = useState<MarketSizingResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const INTRO_STORAGE_KEY = "marketSizingDrill.intro.seen";

  const taskStartTime = useRef<number>(0);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionStartTime = useRef<number>(0);

  const buildLink = (path: string) =>
    userEmail ? `${path}?email=${encodeURIComponent(userEmail)}` : path;

  const loadNextCase = useCallback(() => {
    const next = getNextMarketSizingCase();
    setCurrentCase(next);
    taskStartTime.current = Date.now();
    setPhase("answering");
  }, []);

  const handleStart = useCallback(async () => {
    await fetchMarketSizingCases();
    resetMarketSizingSession();
    sessionIdRef.current = crypto.randomUUID();
    setResults([]);
    setCurrentResult(null);
    sessionStartTime.current = Date.now();

    try {
      if (!localStorage.getItem(INTRO_STORAGE_KEY)) {
        setIntroOpen(true);
        localStorage.setItem(INTRO_STORAGE_KEY, "1");
      }
    } catch {
      // localStorage may be unavailable
    }

    loadNextCase();
  }, [loadNextCase]);

  const handleEnd = useCallback(() => {
    setPhase("debrief");
  }, []);

  const handleSubmit = useCallback(async (
    answerText: string, estimateValue: number | null, estimateUnit: string
  ) => {
    if (!currentCase) return;
    setIsEvaluating(true);
    setPhase("evaluating");

    const timeSpentSec = Math.round((Date.now() - taskStartTime.current) / 1000);

    // Save submission
    const submissionId = await submitMarketSizingAnswer({
      caseId: currentCase.id,
      sessionId: sessionIdRef.current,
      userEmail: userEmail || "anonymous",
      answerText,
      finalEstimateValue: estimateValue,
      finalEstimateUnit: estimateUnit,
      timeSpentSec,
    });

    // Call AI evaluation
    let evaluation: MarketSizingEvaluation | null = null;
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-market-sizing", {
        body: {
          case_prompt: currentCase.prompt,
          unit_hint: currentCase.unit_hint,
          allowed_methods: currentCase.allowed_methods,
          expected_min: currentCase.expected_order_of_magnitude_min,
          expected_max: currentCase.expected_order_of_magnitude_max,
          answer_text: answerText,
          final_estimate_value: estimateValue,
          final_estimate_unit: estimateUnit,
          reference_structure: currentCase.reference_structure,
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
      } else {
        evaluation = data as MarketSizingEvaluation;
      }
    } catch (err: any) {
      console.error("Evaluation error:", err);
      toast.error("KI-Bewertung fehlgeschlagen. Ergebnis wird ohne Score angezeigt.");
    }

    // Save evaluation if we have one
    if (evaluation && submissionId) {
      await saveMarketSizingEvaluation({
        submissionId,
        totalScore: evaluation.total_score,
        scoresJson: evaluation.scores,
        feedbackJson: {
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
          red_flags: evaluation.red_flags,
          one_line_summary: evaluation.one_line_summary,
        },
        flagged: evaluation.flagged,
      });
    }

    const result: MarketSizingResult = {
      case: currentCase,
      answerText,
      finalEstimateValue: estimateValue,
      finalEstimateUnit: estimateUnit,
      timeSpentSec,
      evaluation,
      submissionId: submissionId ?? undefined,
    };

    setResults((prev) => [...prev, result]);
    setCurrentResult(result);
    setIsEvaluating(false);
    setPhase("result");
  }, [currentCase, userEmail]);

  const handleNext = useCallback(() => {
    loadNextCase();
  }, [loadNextCase]);

  const handleFinish = useCallback(() => {
    setPhase("debrief");
  }, []);

  // Save session on debrief
  const prevPhaseRef = useRef<MarketSizingPhase>("config");
  useEffect(() => {
    if (phase === "debrief" && prevPhaseRef.current !== "debrief" && userEmail && results.length > 0) {
      const actualSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
      const avgScore = results.filter(r => r.evaluation).length > 0
        ? Math.round(results.filter(r => r.evaluation).reduce((s, r) => s + (r.evaluation?.total_score ?? 0), 0) / results.filter(r => r.evaluation).length)
        : 0;

      saveDrillSession({
        userEmail,
        drillType: "market_sizing",
        correctCount: results.filter(r => (r.evaluation?.total_score ?? 0) >= 60).length,
        totalCount: results.length,
        accuracyPercent: avgScore,
        durationSeconds: actualSeconds,
      }).then((sessionId) => {
        saveDrillAttempts({
          userEmail,
          drillType: "market_sizing",
          sessionId,
          attempts: results.map((r) => ({
            taskType: "market_sizing",
            isCorrect: (r.evaluation?.total_score ?? 0) >= 60,
            responseTimeMs: r.timeSpentSec * 1000,
            difficulty: "medium" as const,
          })),
        });
      });
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  const handleRestart = useCallback(() => {
    setPhase("config");
    setCurrentCase(null);
    setResults([]);
    setCurrentResult(null);
  }, []);

  const debriefSeconds =
    results.length > 0 && sessionStartTime.current > 0
      ? Math.round((Date.now() - sessionStartTime.current) / 1000)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketSizingIntroModal open={introOpen} onClose={() => setIntroOpen(false)} />
      {(phase === "config" || phase === "debrief") && <NavHeader showStats={false} />}
      {(phase === "answering" || phase === "evaluating" || phase === "result") && (
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="font-logo text-logo text-foreground">pumpkin.</span>
        </header>
      )}

      {phase === "config" && (
        <>
          <section className="flex flex-col items-center px-4 pt-8 pb-4">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.08] bg-[#16161a]">
              <IconMarketSizing size={40} />
            </div>
            <h1 className="mb-2 text-center text-h2 text-foreground">Market Sizing Drill</h1>
            <p className="max-w-md text-center text-body text-secondary-foreground">
              Schätze Marktgrößen mit Struktur, Annahmen & Plausibilität. KI-gestützte Bewertung.
            </p>
            <Link to={buildLink("/")} className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Zurück zum Dashboard
            </Link>
          </section>
          <main className="flex flex-1 flex-col items-center px-4 pb-12">
            <div className="w-full max-w-drill rounded-2xl border border-border bg-card p-card-padding">
              <MarketSizingConfig onStart={handleStart} />
            </div>
          </main>
        </>
      )}

      {(phase === "answering" || phase === "evaluating") && (
        <main className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="w-full max-w-drill rounded-2xl border border-border bg-card p-card-padding">
            <MarketSizingGame
              currentCase={currentCase}
              onSubmit={handleSubmit}
              onEnd={handleEnd}
              isEvaluating={isEvaluating}
              onOpenIntro={() => setIntroOpen(true)}
            />
          </div>
        </main>
      )}

      {phase === "result" && currentResult && (
        <main className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="w-full max-w-drill rounded-2xl border border-border bg-card p-card-padding">
            <MarketSizingResultView
              result={currentResult}
              onNext={handleNext}
              onFinish={handleFinish}
            />
          </div>
        </main>
      )}

      {phase === "debrief" && (
        <>
          <section className="flex flex-col items-center px-4 pt-8 pb-4">
            <Link to={buildLink("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Zurück zum Dashboard
            </Link>
          </section>
          <main className="flex flex-1 flex-col items-center px-4 pb-12">
            <div className="w-full max-w-drill rounded-2xl border border-border bg-card p-card-padding">
              <MarketSizingDebrief
                results={results}
                elapsedSeconds={debriefSeconds}
                onRestart={handleRestart}
              />
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default MarketSizingDrill;
