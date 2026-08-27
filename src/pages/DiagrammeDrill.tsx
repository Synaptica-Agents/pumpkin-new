import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { useUserEmail } from "@/hooks/useUserEmail";
import { saveDrillSession, saveDrillAttempts } from "@/lib/sessionTracker";
import { ArrowLeft } from "lucide-react";
import { IconDiagramme } from "@/components/drillIcons";
import TextDrillConfig from "@/components/textDrill/TextDrillConfig";
import ChartsGame from "@/components/chartsDrill/ChartsGame";
import ChartsIntroModal from "@/components/chartsDrill/ChartsIntroModal";
import ChartsAnswerReview from "@/components/chartsDrill/ChartsAnswerReview";
import TextDrillResultView from "@/components/textDrill/TextDrillResult";
import TextDrillDebrief from "@/components/textDrill/TextDrillDebrief";
import { SprintDuration } from "@/types/drill";
import { TextDrillCase, TextDrillResult, TextDrillPhase, TextDrillEvaluation, DrillConfig } from "@/types/textDrill";
import {
  serializeChartsAnswer, exhibitsToText,
  buildChartsCasePrompt, buildChartsReferenceSolution,
} from "@/lib/chartsSerializer";
import {
  fetchTextDrillCases, getNextTextDrillCase,
  submitTextDrillAnswer, saveTextDrillEvaluation,
} from "@/lib/textDrillFetcher";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTestMode, withTestPrefix } from "@/lib/testMode";

const drillConfig: DrillConfig = {
  drillType: "charts",
  title: "Diagramme",
  subtitle: "Interpretiere Exhibits wie im Case-Interview: erst die Insights, dann die Fragen.",
  icon: "BarChart3",
  tableName: "chart_cases",
  categoryField: "chart_type",
  categoryLabel: "Exhibit-Typ",
  categories: [
    { value: "table", label: "Tabellen" },
    { value: "bars", label: "Balkendiagramme" },
    { value: "trend", label: "Zeitreihen & Trends" },
    { value: "share", label: "Anteile & Struktur" },
    { value: "combo", label: "Kombiniert (2 Exhibits)" },
  ],
  difficultyOptions: [
    { value: "easy", label: "Einsteiger", desc: "Werte ablesen, einfache Prozente & Deltas, 1 Frage" },
    { value: "hard", label: "Fortgeschritten", desc: "Mehrstufige Rechnungen, Zusatzinfos kombinieren, 2 Fragen" },
  ],
  hintText: "Wie im echten Interview: Erst sagst du, was das Exhibit zeigt — Hauptaussage, Key Insights mit Zahlen, mögliche Ursachen auffälliger Trends und dein 'So what' fürs Business. Erst danach kommen die konkreten Fragen. Runden ist erlaubt — der Rechenweg zählt.",
  startButtonText: "Exhibit starten →",
  rubricLabels: [
    { key: "data_reading", label: "Daten-Ablesung", max: 25 },
    { key: "trend_analysis", label: "Trend-Analyse", max: 25 },
    { key: "business_implications", label: "Business-Implikationen", max: 25 },
    { key: "depth_of_analysis", label: "Analysetiefe", max: 15 },
    { key: "communication", label: "Kommunikation", max: 10 },
  ],
  placeholder: "Hauptaussage: ...\n\nKey Insights (mit Zahlen):\n- ...\n- ...\n\nMögliche Ursachen: ...\n\nSo what fürs Business: ...",
  sprintMode: false,
  timeReferenceMinutes: 5,
};

const INTRO_STORAGE_KEY = "diagrammeDrill.intro.seen";

const DiagrammeDrill: React.FC = () => {
  const userEmail = useUserEmail();
  const testMode = useTestMode();
  const [duration, setDuration] = useState<SprintDuration>(300);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [phase, setPhase] = useState<TextDrillPhase>("config");
  const [currentCase, setCurrentCase] = useState<TextDrillCase | null>(null);
  const [results, setResults] = useState<TextDrillResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TextDrillResult | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);

  const taskStartTime = useRef<number>(0);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionStartTime = useRef<number>(0);

  const buildLink = (rawPath: string) => {
    const path = withTestPrefix(testMode, rawPath);
    return userEmail ? `${path}?email=${encodeURIComponent(userEmail)}` : path;
  };

  const loadNextCase = useCallback(() => {
    const next = getNextTextDrillCase(drillConfig.tableName);
    setCurrentCase(next);
    taskStartTime.current = Date.now();
    setPhase("answering");
  }, []);

  const handleStart = useCallback(async () => {
    await fetchTextDrillCases(drillConfig.tableName, difficulty, drillConfig.categoryField, categories, undefined, { userEmail, drillType: drillConfig.drillType });
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
      // localStorage may be unavailable (private mode) — silently skip
    }

    loadNextCase();
  }, [difficulty, categories, loadNextCase, userEmail]);

  const handleEnd = useCallback(() => {
    setPhase("debrief");
  }, []);

  const handleSubmit = useCallback(async (payload: { interpretation: string; answers: string[] }) => {
    if (!currentCase) return;
    setIsEvaluating(true);
    setPhase("evaluating");

    const timeSpentSec = Math.round((Date.now() - taskStartTime.current) / 1000);
    const answerText = serializeChartsAnswer(payload.interpretation, currentCase.questions ?? [], payload.answers);

    const submissionId = await submitTextDrillAnswer({
      drillType: drillConfig.drillType,
      caseId: currentCase.id,
      sessionId: sessionIdRef.current,
      userEmail: userEmail || "anonymous",
      answerText,
      timeSpentSec,
    });

    let evaluation: TextDrillEvaluation | null = null;
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-drill", {
        body: {
          drill_type: drillConfig.drillType,
          case_prompt: buildChartsCasePrompt(currentCase),
          answer_text: answerText,
          difficulty,
          context_info: exhibitsToText(currentCase),
          reference_solution: buildChartsReferenceSolution(currentCase),
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
      } else {
        evaluation = data as TextDrillEvaluation;
      }
    } catch (err: any) {
      console.error("Evaluation error:", err);
      toast.error("KI-Bewertung fehlgeschlagen. Ergebnis wird ohne Score angezeigt.");
    }

    if (evaluation && submissionId) {
      await saveTextDrillEvaluation({
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

    const result: TextDrillResult = {
      case: currentCase,
      answerText,
      timeSpentSec,
      evaluation,
      submissionId: submissionId ?? undefined,
    };

    setResults((prev) => [...prev, result]);
    setCurrentResult(result);
    setCurrentAnswers(payload.answers);
    setIsEvaluating(false);
    setPhase("result");
  }, [currentCase, userEmail, difficulty]);

  const handleNext = useCallback(() => {
    loadNextCase();
  }, [loadNextCase]);

  const handleFinish = useCallback(() => {
    setPhase("debrief");
  }, []);

  // Save session on debrief
  const prevPhaseRef = useRef<TextDrillPhase>("config");
  useEffect(() => {
    if (phase === "debrief" && prevPhaseRef.current !== "debrief" && userEmail && results.length > 0) {
      const actualSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
      const avgScore = results.filter(r => r.evaluation).length > 0
        ? Math.round(results.filter(r => r.evaluation).reduce((s, r) => s + (r.evaluation?.total_score ?? 0), 0) / results.filter(r => r.evaluation).length)
        : 0;

      saveDrillSession({
        userEmail,
        drillType: "charts",
        correctCount: results.filter(r => (r.evaluation?.total_score ?? 0) >= 60).length,
        totalCount: results.length,
        accuracyPercent: avgScore,
        durationSeconds: actualSeconds,
      }).then((sessionId) => {
        saveDrillAttempts({
          userEmail,
          drillType: "charts",
          sessionId,
          attempts: results.map((r) => ({
            taskType: "charts",
            isCorrect: (r.evaluation?.total_score ?? 0) >= 60,
            responseTimeMs: r.timeSpentSec * 1000,
            difficulty,
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
    setCurrentAnswers([]);
  }, []);

  const debriefSeconds =
    results.length > 0 && sessionStartTime.current > 0
      ? Math.round((Date.now() - sessionStartTime.current) / 1000)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ChartsIntroModal
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        rubricLabels={drillConfig.rubricLabels}
      />
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
              <IconDiagramme size={40} />
            </div>
            <h1 className="mb-2 text-center text-h2 text-foreground">Diagramme Drill</h1>
            <p className="max-w-md text-center text-body text-secondary-foreground">
              {drillConfig.subtitle} KI-gestützte Bewertung.
            </p>
            <Link to={buildLink("/")} className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Zurück zum Dashboard
            </Link>
          </section>
          <main className="mx-auto w-full max-w-[640px] px-4 pb-12">
            <TextDrillConfig
              config={drillConfig}
              duration={duration} onDurationChange={setDuration}
              difficulty={difficulty} onDifficultyChange={setDifficulty}
              categories={categories} onCategoriesChange={setCategories}
              onStart={handleStart}
            />
          </main>
        </>
      )}

      {(phase === "answering" || phase === "evaluating") && (
        <main className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="w-full max-w-drill rounded-2xl border border-border bg-card p-card-padding">
            <ChartsGame
              config={drillConfig}
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
            <TextDrillResultView
              config={drillConfig}
              result={currentResult}
              onNext={handleNext}
              onFinish={handleFinish}
              hasTimeLeft={false}
            >
              <ChartsAnswerReview
                questions={currentResult.case.questions ?? []}
                answers={currentAnswers}
              />
            </TextDrillResultView>
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
              <TextDrillDebrief
                config={drillConfig}
                results={results}
                durationSeconds={debriefSeconds}
                onRestart={handleRestart}
              />
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default DiagrammeDrill;
