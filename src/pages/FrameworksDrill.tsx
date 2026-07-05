import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { useUserEmail } from "@/hooks/useUserEmail";
import { saveDrillSession, saveDrillAttempts } from "@/lib/sessionTracker";
import { ArrowLeft } from "lucide-react";
import { IconFrameworks } from "@/components/drillIcons";
import TextDrillConfig from "@/components/textDrill/TextDrillConfig";
import FrameworksGame from "@/components/frameworkBuilder/FrameworksGame";
import FrameworkIntroModal from "@/components/frameworkBuilder/FrameworkIntroModal";
import TextDrillResultView from "@/components/textDrill/TextDrillResult";
import TextDrillDebrief from "@/components/textDrill/TextDrillDebrief";
import { SprintDuration } from "@/types/drill";
import { TextDrillCase, TextDrillResult, TextDrillPhase, TextDrillEvaluation, DrillConfig, ClarifyingQA } from "@/types/textDrill";
import { serializeFramework } from "@/lib/frameworkSerializer";
import {
  fetchTextDrillCases, getNextTextDrillCase,
  submitTextDrillAnswer, saveTextDrillEvaluation,
} from "@/lib/textDrillFetcher";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const drillConfig: DrillConfig = {
  drillType: "frameworks",
  title: "Frameworks",
  subtitle: "Wähle das passende Framework und baue eine strukturierte Analyse.",
  icon: "ListTree",
  tableName: "framework_cases",
  categoryField: "category",
  categoryLabel: "Kategorie",
  categories: [
    { value: "profitability", label: "Profitability" },
    { value: "market_entry", label: "Market Entry" },
    { value: "growth", label: "Growth" },
    { value: "ma", label: "M&A" },
    { value: "pricing", label: "Pricing" },
    { value: "operations", label: "Operations" },
  ],
  difficultyOptions: [
    { value: "medium", label: "Mittel", desc: "Klares Szenario, solide Struktur gefragt" },
    { value: "hard", label: "Schwer", desc: "Mehrstufig, Trade-offs, mehr Tiefe" },
  ],
  hintText: "Wie im echten Interview: Erst den Case verstehen und Rückfragen stellen, dann die Struktur bauen — nur mit deinen Notizen. Die KI bewertet fair nach fester Rubrik.",
  startButtonText: "Case starten →",
  rubricLabels: [
    { key: "framework_choice", label: "Framework-Wahl", max: 25 },
    { key: "structure_mece", label: "Struktur & MECE", max: 30 },
    { key: "completeness", label: "Vollständigkeit", max: 25 },
    { key: "prioritization", label: "Priorisierung", max: 20 },
  ],
  placeholder: "",
  structureGuide: [
    "Case lesen und dir Notizen machen — der Case-Text ist beim Strukturieren ausgeblendet",
    "Rückfragen an den KI-Interviewer stellen (max. 5) — die Infos sind bewusst begrenzt",
    "2–4 Hauptäste anlegen (MECE), Unteräste für die Tiefe — Klick auf einen Ast zoomt rein",
    "Bis zu 2 Hauptäste mit dem Stern als Top-Priorität markieren",
  ],
  sprintMode: false,
  timeReferenceMinutes: 5,
};

const FrameworksDrill: React.FC = () => {
  const userEmail = useUserEmail();
  const [duration, setDuration] = useState<SprintDuration>(300);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [phase, setPhase] = useState<TextDrillPhase>("config");
  const [currentCase, setCurrentCase] = useState<TextDrillCase | null>(null);
  const [results, setResults] = useState<TextDrillResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TextDrillResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const INTRO_STORAGE_KEY = "frameworksDrill.intro.seen";

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
  }, [difficulty, categories, loadNextCase]);

  const handleEnd = useCallback(() => {
    setPhase("debrief");
  }, []);

  const handleSubmit = useCallback(async (answerText: string, askedQA: ClarifyingQA[]) => {
    if (!currentCase) return;
    setIsEvaluating(true);
    setPhase("evaluating");

    const timeSpentSec = Math.round((Date.now() - taskStartTime.current) / 1000);

    // Rückfragen mit in die gespeicherte Antwort aufnehmen (Nachvollziehbarkeit).
    const storedAnswer =
      askedQA.length > 0
        ? `${answerText}\n\n[Rückfragen im Interview]\n${askedQA.map((p) => `F: ${p.q}\nA: ${p.a}`).join("\n")}`
        : answerText;

    const submissionId = await submitTextDrillAnswer({
      drillType: drillConfig.drillType,
      caseId: currentCase.id,
      sessionId: sessionIdRef.current,
      userEmail: userEmail || "anonymous",
      answerText: storedAnswer,
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
          framework_guidance: currentCase.reference_tree?.length
            ? serializeFramework({ nodes: currentCase.reference_tree })
            : null,
          interviewer_notes: currentCase.interviewer_notes ?? null,
          asked_qa: askedQA,
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
        drillType: "frameworks",
        correctCount: results.filter(r => (r.evaluation?.total_score ?? 0) >= 60).length,
        totalCount: results.length,
        accuracyPercent: avgScore,
        durationSeconds: actualSeconds,
      }).then((sessionId) => {
        saveDrillAttempts({
          userEmail,
          drillType: "frameworks",
          sessionId,
          attempts: results.map((r) => ({
            taskType: "frameworks",
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
      <FrameworkIntroModal
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        rubricLabels={drillConfig.rubricLabels}
        structureGuide={drillConfig.structureGuide}
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
              <IconFrameworks size={40} />
            </div>
            <h1 className="mb-2 text-center text-h2 text-foreground">Frameworks Drill</h1>
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
            <FrameworksGame
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

export default FrameworksDrill;
