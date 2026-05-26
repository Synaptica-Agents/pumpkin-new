import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { useUserEmail } from "@/hooks/useUserEmail";
import { saveDrillSession, saveDrillAttempts } from "@/lib/sessionTracker";
import { ArrowLeft } from "lucide-react";
import { IconCreativity } from "@/components/drillIcons";
import TextDrillConfig from "@/components/textDrill/TextDrillConfig";
import TextDrillGame from "@/components/textDrill/TextDrillGame";
import TextDrillResultView from "@/components/textDrill/TextDrillResult";
import TextDrillDebrief from "@/components/textDrill/TextDrillDebrief";
import { SprintDuration } from "@/types/drill";
import { TextDrillCase, TextDrillResult, TextDrillPhase, TextDrillEvaluation, DrillConfig } from "@/types/textDrill";
import {
  fetchTextDrillCases, getNextTextDrillCase,
  submitTextDrillAnswer, saveTextDrillEvaluation,
} from "@/lib/textDrillFetcher";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const drillConfig: DrillConfig = {
  drillType: "creativity",
  title: "Creativity",
  subtitle: "Strukturiere kreative Antworten auf typische Consulting-Fragen.",
  icon: "Lightbulb",
  tableName: "creativity_cases",
  categoryField: "category",
  categoryLabel: "Kategorie",
  categories: [
    { value: "market_entry", label: "Market Entry" },
    { value: "risks_opportunities", label: "Risiken & Opportunities" },
    { value: "financial", label: "Financial" },
  ],
  difficultyOptions: [
    { value: "medium", label: "Normal", desc: "Kurze Frage, knappe Antwort" },
    { value: "hard", label: "Schwer", desc: "Mehr Kontext, mehr Substanz" },
  ],
  hintText: "Teile deine Antwort in MECE-Kategorien auf und liste Stichpunkte je Kategorie. Korrektheit > Vollständigkeit, eine kreative Idee zählt mehr als Generisches.",
  startButtonText: "Start Creativity \u2192",
  rubricLabels: [
    { key: "structure", label: "Struktur", max: 40 },
    { key: "content", label: "Inhalt", max: 50 },
    { key: "creativity", label: "Kreativität", max: 10 },
  ],
  placeholder: "Kategorie A:\n- Punkt 1\n- Punkt 2\n\nKategorie B:\n- Punkt 1\n- Punkt 2",
};

const CreativityDrill: React.FC = () => {
  const userEmail = useUserEmail();
  const [duration, setDuration] = useState<SprintDuration>(300);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [phase, setPhase] = useState<TextDrillPhase>("config");
  const [currentCase, setCurrentCase] = useState<TextDrillCase | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [results, setResults] = useState<TextDrillResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TextDrillResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const taskStartTime = useRef<number>(0);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sprintStartTime = useRef<number>(0);

  const buildLink = (path: string) =>
    userEmail ? `${path}?email=${encodeURIComponent(userEmail)}` : path;

  const loadNextCase = useCallback(async () => {
    setIsGenerating(true);
    const next = getNextTextDrillCase(drillConfig.tableName);
    setCurrentCase(next);
    taskStartTime.current = Date.now();
    setIsGenerating(false);
    setPhase("answering");
  }, []);

  const handleStart = useCallback(async () => {
    await fetchTextDrillCases(drillConfig.tableName, difficulty, drillConfig.categoryField, categories);
    // NOTE: seenIds are NOT reset between sprints — sessionStorage carries
    // dedup across the whole tab session.
    sessionIdRef.current = crypto.randomUUID();
    setResults([]);
    setCurrentResult(null);
    setTimeRemaining(duration);
    sprintStartTime.current = Date.now();
    loadNextCase();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, difficulty, categories, loadNextCase]);

  const handleEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("debrief");
  }, []);

  useEffect(() => {
    if (timeRemaining === 0 && phase === "answering" && results.length > 0) {
      setPhase("debrief");
    }
  }, [timeRemaining, phase]);

  const handleSubmit = useCallback(async (answerText: string) => {
    if (!currentCase) return;
    setIsEvaluating(true);
    setPhase("evaluating");

    const timeSpentSec = Math.round((Date.now() - taskStartTime.current) / 1000);

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
          case_prompt: currentCase.prompt,
          answer_text: answerText,
          difficulty,
          context_info: currentCase.context_info,
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
    setIsEvaluating(false);
    setPhase("result");
  }, [currentCase, userEmail, difficulty]);

  const handleNext = useCallback(() => {
    if (timeRemaining <= 0) {
      setPhase("debrief");
    } else {
      loadNextCase();
    }
  }, [timeRemaining, loadNextCase]);

  const handleFinish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("debrief");
  }, []);

  // Save session on debrief
  const prevPhaseRef = useRef<TextDrillPhase>("config");
  useEffect(() => {
    if (phase === "debrief" && prevPhaseRef.current !== "debrief" && userEmail && results.length > 0) {
      const actualSeconds = Math.round((Date.now() - sprintStartTime.current) / 1000);
      const avgScore = results.filter(r => r.evaluation).length > 0
        ? Math.round(results.filter(r => r.evaluation).reduce((s, r) => s + (r.evaluation?.total_score ?? 0), 0) / results.filter(r => r.evaluation).length)
        : 0;

      saveDrillSession({
        userEmail,
        drillType: "creativity",
        correctCount: results.filter(r => (r.evaluation?.total_score ?? 0) >= 60).length,
        totalCount: results.length,
        accuracyPercent: avgScore,
        durationSeconds: actualSeconds,
      }).then((sessionId) => {
        saveDrillAttempts({
          userEmail,
          drillType: "creativity",
          sessionId,
          attempts: results.map((r) => ({
            taskType: "creativity",
            isCorrect: (r.evaluation?.total_score ?? 0) >= 60,
            responseTimeMs: r.timeSpentSec * 1000,
            difficulty,
          })),
        });
      });
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleRestart = useCallback(() => {
    setPhase("config");
    setCurrentCase(null);
    setResults([]);
    setCurrentResult(null);
    setTimeRemaining(0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {(phase === "config" || phase === "debrief") && <NavHeader showStats={false} />}
      {(phase === "answering" || phase === "evaluating" || phase === "result") && (
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="font-logo text-logo text-foreground">pumpkin.</span>
        </header>
      )}

      {phase === "config" && (
        <main className="mx-auto w-full max-w-[640px] px-4 pb-6">
          {/* Slim drill label */}
          <div className="flex items-center gap-2 pt-3 pb-3">
            <IconCreativity size={22} />
            <span className="text-sm font-semibold tracking-tight text-foreground">{drillConfig.title}</span>
          </div>

          <TextDrillConfig
            config={drillConfig}
            duration={duration} onDurationChange={setDuration}
            difficulty={difficulty} onDifficultyChange={setDifficulty}
            categories={categories} onCategoriesChange={setCategories}
            onStart={handleStart}
          />
        </main>
      )}

      {(phase === "answering" || phase === "evaluating") && (
        <main className="flex flex-1 flex-col items-center px-4 py-4">
          <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <p className="text-sm text-muted-foreground">KI generiert eine neue Aufgabe...</p>
              </div>
            ) : (
              <TextDrillGame
                config={drillConfig}
                currentCase={currentCase}
                timeRemaining={timeRemaining}
                totalDuration={duration}
                onSubmit={handleSubmit}
                onEnd={handleEnd}
                isEvaluating={isEvaluating}
              />
            )}
          </div>
        </main>
      )}

      {phase === "result" && currentResult && (
        <main className="flex flex-1 flex-col items-center px-4 py-4">
          <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
            <TextDrillResultView
              config={drillConfig}
              result={currentResult}
              onNext={handleNext}
              onFinish={handleFinish}
              hasTimeLeft={timeRemaining > 0}
            />
          </div>
        </main>
      )}

      {phase === "debrief" && (
        <main className="flex flex-1 flex-col items-center px-4 py-4">
          <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
            <TextDrillDebrief
              config={drillConfig}
              results={results}
              durationSeconds={duration}
              onRestart={handleRestart}
            />
          </div>
        </main>
      )}
    </div>
  );
};

export default CreativityDrill;
