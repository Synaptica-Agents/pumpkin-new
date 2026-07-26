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
import { TextDrillCase, TextDrillResult, TextDrillPhase, TextDrillEvaluation, DrillConfig, ClarifyingQA } from "@/types/textDrill";
import {
  fetchTextDrillCases, getNextTextDrillCase,
  submitTextDrillAnswer, saveTextDrillEvaluation,
} from "@/lib/textDrillFetcher";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const drillConfig: DrillConfig = {
  drillType: "creativity",
  title: "Creativity",
  subtitle: "Simple Business-Fragen, strukturiert gebrainstormt — Kreativität und Business Sense zeigen.",
  icon: "Lightbulb",
  tableName: "creativity_cases",
  categoryField: "category",
  categoryLabel: "Kategorie",
  categories: [
    { value: "market_entry", label: "Expansion & Markteintritt" },
    { value: "risks_opportunities", label: "Risiken & Chancen" },
    { value: "financial", label: "Umsatz & Profitabilität" },
  ],
  difficultyOptions: [
    { value: "medium", label: "Mittel", desc: "Eine kurze, sehr simple Frage" },
    { value: "hard", label: "Schwer", desc: "Etwas breiter — mehr Ideen & Struktur gefragt" },
  ],
  hintText: "Gruppiere deine Ideen in 2–4 Kategorien mit Stichpunkten. Breite schlägt Tiefe, eine überraschende Idee schlägt fünf generische — und rechnen musst du hier nichts. Unklare Begriffe? Frag den Interviewer einfach kurz, bevor du antwortest.",
  startButtonText: "Start Creativity →",
  clarifyQuestions: {
    mode: "creativity",
    max: 3,
    title: "Verständnisfragen an den Interviewer",
    hint: "Begriff unklar (z.B. Take-Rate, Gen Z) oder Frage mehrdeutig? Frag kurz nach — wie im echten Interview. Lösungsideen gibt es hier keine, und Fragen kosten dich keine Punkte.",
    placeholder: "z.B. Was genau ist mit Take-Rate gemeint?",
    interviewerContext:
      "BEGRIFFSERKLÄRUNGEN SIND ERLAUBT: Du darfst allgemeine Business-Begriffe aus der Aufgabe (z.B. Take-Rate, Gen Z, EBIT-Marge, D2C) auf Nachfrage kurz und neutral erklären und die Aufgabe umformulieren oder wiederholen. Liefere aber niemals Lösungsideen, Beispiel-Antworten oder Kategorien-Vorschläge — das ist Aufgabe des Kandidaten.",
  },
  rubricLabels: [
    { key: "structure", label: "Struktur", max: 40 },
    { key: "content", label: "Inhalt", max: 50 },
    { key: "creativity", label: "Kreativität", max: 10 },
  ],
  placeholder: "Kategorie A:\n- Idee 1\n- Idee 2\n\nKategorie B:\n- Idee 1\n- Idee 2",
  structureGuide: [
    "Kurz sortieren: Was wird wirklich gefragt?",
    "2–4 Kategorien bilden (z.B. kurzfristig/langfristig, intern/extern, Umsatz/Kosten)",
    "Je Kategorie 2–3 Ideen als Stichpunkte — mindestens eine unkonventionelle",
    "Optional: kurz sagen, welche Idee du zuerst testen würdest",
  ],
  sprintMode: false,
  timeReferenceMinutes: 3,
};

const CreativityDrill: React.FC = () => {
  const userEmail = useUserEmail();
  const [duration, setDuration] = useState<SprintDuration>(300);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [phase, setPhase] = useState<TextDrillPhase>("config");
  const [currentCase, setCurrentCase] = useState<TextDrillCase | null>(null);
  const [results, setResults] = useState<TextDrillResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TextDrillResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const taskStartTime = useRef<number>(0);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionStartTime = useRef<number>(0);

  const buildLink = (path: string) =>
    userEmail ? `${path}?email=${encodeURIComponent(userEmail)}` : path;

  const loadNextCase = useCallback(() => {
    const next = getNextTextDrillCase(drillConfig.tableName);
    setCurrentCase(next);
    taskStartTime.current = Date.now();
    setPhase("answering");
  }, []);

  const handleStart = useCallback(async () => {
    await fetchTextDrillCases(drillConfig.tableName, difficulty, drillConfig.categoryField, categories);
    // NOTE: seenIds are NOT reset between sessions — sessionStorage carries
    // dedup across the whole tab session.
    sessionIdRef.current = crypto.randomUUID();
    setResults([]);
    setCurrentResult(null);
    sessionStartTime.current = Date.now();
    loadNextCase();
  }, [difficulty, categories, loadNextCase]);

  const handleEnd = useCallback(() => {
    setPhase("debrief");
  }, []);

  const handleSubmit = useCallback(async (answerText: string, askedQA: ClarifyingQA[]) => {
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
          reference_solution: currentCase.reference_solution,
          asked_qa: askedQA.length > 0 ? askedQA : undefined,
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
              <IconCreativity size={40} />
            </div>
            <h1 className="mb-2 text-center text-h2 text-foreground">Creativity Drill</h1>
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
          <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
            <TextDrillGame
              config={drillConfig}
              currentCase={currentCase}
              timeRemaining={0}
              totalDuration={0}
              onSubmit={handleSubmit}
              onEnd={handleEnd}
              isEvaluating={isEvaluating}
            />
          </div>
        </main>
      )}

      {phase === "result" && currentResult && (
        <main className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
            <TextDrillResultView
              config={drillConfig}
              result={currentResult}
              onNext={handleNext}
              onFinish={handleFinish}
              hasTimeLeft={false}
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
            <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
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

export default CreativityDrill;
