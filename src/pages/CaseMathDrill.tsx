import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import { useUserEmail } from "@/hooks/useUserEmail";
import { saveDrillSession, saveDrillAttempts } from "@/lib/sessionTracker";
import { ArrowLeft } from "lucide-react";
import { IconCaseMath } from "@/components/drillIcons";
import CaseMathConfig from "@/components/caseMath/CaseMathConfig";
import CaseMathGame from "@/components/caseMath/CaseMathGame";
import CaseMathDebrief from "@/components/caseMath/CaseMathDebrief";
import { DifficultyLevel } from "@/components/DifficultySelector";
import { SprintDuration } from "@/types/drill";
import { CaseMathTask, CaseMathCategory, CaseMathResult, CaseMathStats, CaseMathPhase } from "@/types/caseMath";
import { generateCaseMathTask, resetCaseMathGenerator, checkCaseMathAnswer } from "@/lib/caseMathGenerator";
import { useTestMode, withTestPrefix } from "@/lib/testMode";

const CaseMathDrill = () => {
  const userEmail = useUserEmail();
  const testMode = useTestMode();
  const [duration, setDuration] = useState<SprintDuration>(300);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [selectedCategories, setSelectedCategories] = useState<CaseMathCategory[]>(["profitability", "investment", "breakeven"]);
  const [phase, setPhase] = useState<CaseMathPhase>("config");
  const [currentTask, setCurrentTask] = useState<CaseMathTask | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [flashState, setFlashState] = useState<"none" | "correct" | "incorrect">("none");
  const [results, setResults] = useState<CaseMathResult[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const taskStartTime = useRef<number>(0);
  const flashTimeout = useRef<NodeJS.Timeout | null>(null);

  const buildLink = (rawPath: string) => {
    const path = withTestPrefix(testMode, rawPath);
    return userEmail ? `${path}?email=${encodeURIComponent(userEmail)}` : path;
  };

  const generateNewTask = useCallback(() => {
    const task = generateCaseMathTask(selectedCategories, difficulty);
    setCurrentTask(task);
    taskStartTime.current = Date.now();
  }, [selectedCategories, difficulty]);

  const handleStart = useCallback(() => {
    resetCaseMathGenerator();
    setPhase("sprint");
    setTimeRemaining(duration);
    setResults([]);
    setCorrectCount(0);
    setFlashState("none");
    generateNewTask();
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("debrief");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, generateNewTask]);

  const handleEndEarly = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    setPhase("debrief");
  }, []);

  const handleSubmit = useCallback((userAnswer: string) => {
    if (!currentTask || phase !== "sprint") return;
    const timeSpent = Date.now() - taskStartTime.current;
    const isCorrect = checkCaseMathAnswer(userAnswer, currentTask.answer, currentTask.tolerance || 0);
    const result: CaseMathResult = { task: currentTask, userAnswer, isCorrect, timeSpent };
    setResults(prev => [...prev, result]);
    if (isCorrect) setCorrectCount(prev => prev + 1);
    setFlashState(isCorrect ? "correct" : "incorrect");
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => {
      setFlashState("none");
      generateNewTask();
    }, 200);
  }, [currentTask, phase, generateNewTask]);

  const sprintStartTime = useRef<number>(0);
  const prevPhaseRef = useRef<CaseMathPhase>("config");
  useEffect(() => {
    if (phase === "sprint") sprintStartTime.current = Date.now();
    if (phase === "debrief" && prevPhaseRef.current === "sprint" && userEmail && results.length > 0) {
      const actualSeconds = Math.round((Date.now() - sprintStartTime.current) / 1000);
      const acc = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
      const diffMap: Record<number, string> = { 1: "easy", 2: "medium", 3: "hard" };
      const diffLabel = diffMap[difficulty] || "medium";
      saveDrillSession({
        userEmail, drillType: "case_math", correctCount, totalCount: results.length,
        accuracyPercent: acc, durationSeconds: actualSeconds,
      }).then((sessionId) => {
        saveDrillAttempts({
          userEmail, drillType: "case_math", sessionId,
          attempts: results.map((r) => ({
            taskType: r.task.category, isCorrect: r.isCorrect, responseTimeMs: r.timeSpent, difficulty: diffLabel,
          })),
        });
      });
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  const handleRestart = useCallback(() => {
    setPhase("config");
    setCurrentTask(null);
    setResults([]);
    setCorrectCount(0);
    setTimeRemaining(0);
    setFlashState("none");
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, []);

  const stats: CaseMathStats = {
    totalAttempted: results.length,
    correctCount,
    accuracyPercent: results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0,
    tasksPerMinute: results.length > 0 ? (results.length / (duration / 60)) : 0,
    durationSeconds: duration,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {phase === "config" ? (
        <NavHeader showStats={false} />
      ) : phase === "sprint" ? (
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="font-logo text-logo text-foreground">pumpkin.</span>
          <button
            onClick={handleEndEarly}
            className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
          >
            Beenden ✕
          </button>
        </header>
      ) : null}

      {phase === "config" && (
        <main className="mx-auto w-full max-w-[640px] px-4 pb-6">
          {/* Slim drill label */}
          <div className="flex items-center gap-2 pt-3 pb-3">
            <IconCaseMath size={22} />
            <span className="text-sm font-semibold tracking-tight text-foreground">Case Math</span>
          </div>

          <CaseMathConfig
            duration={duration} onDurationChange={setDuration}
            difficulty={difficulty} onDifficultyChange={setDifficulty}
            selectedCategories={selectedCategories} onCategoriesChange={setSelectedCategories}
            onStart={handleStart}
          />
        </main>
      )}

      {phase === "sprint" && (
        <main className="flex flex-1 flex-col items-center px-4 py-4">
          <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
            <CaseMathGame
              task={currentTask} timeRemaining={timeRemaining} totalDuration={duration}
              difficulty={difficulty} correctCount={correctCount} totalAttempted={results.length}
              flashState={flashState} onSubmit={handleSubmit} onEnd={handleEndEarly}
            />
          </div>
        </main>
      )}

      {phase === "debrief" && (
        <>
          <NavHeader showStats={false} />
          <main className="flex flex-1 flex-col items-center px-4 py-4">
            <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
              <CaseMathDebrief stats={stats} results={results} onRestart={handleRestart} />
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default CaseMathDrill;
