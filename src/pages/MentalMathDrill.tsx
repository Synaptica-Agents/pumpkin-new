import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavHeader from "@/components/NavHeader";
import SprintConfig from "@/components/sprint/SprintConfig";
import SprintGame from "@/components/sprint/SprintGame";
import SprintDebrief from "@/components/sprint/SprintDebrief";
import { DifficultyLevel } from "@/components/DifficultySelector";
import { Task, TaskType, SprintDuration, SprintResult, SprintStats, GamePhase } from "@/types/drill";
import { generateTask, checkAnswer, resetTaskHistory } from "@/lib/taskGenerator";
import { useUserEmail } from "@/hooks/useUserEmail";
import { saveDrillSession, saveDrillAttempts } from "@/lib/sessionTracker";
import { ArrowLeft } from "lucide-react";
import { IconMentalMath } from "@/components/drillIcons";

const DIFFICULTY_MAP: Record<DifficultyLevel, "easy" | "medium" | "hard"> = {
  1: "easy",
  2: "medium",
  3: "hard",
};

const Index = () => {
  const userEmail = useUserEmail();
  const [duration, setDuration] = useState<SprintDuration>(300);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>(["multiplication", "percentage", "division", "zeros"]);
  const [phase, setPhase] = useState<GamePhase>("config");
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [flashState, setFlashState] = useState<"none" | "correct" | "incorrect">("none");
  const [results, setResults] = useState<SprintResult[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const taskStartTime = useRef<number>(0);
  const flashTimeout = useRef<NodeJS.Timeout | null>(null);

  const buildLink = (path: string) =>
    userEmail ? `${path}?email=${encodeURIComponent(userEmail)}` : path;

  const generateNewTask = useCallback(() => {
    // Pick a random type from selected types (filter out "all")
    const types = selectedTypes.filter(t => t !== "all");
    const type = types.length > 0
      ? types[Math.floor(Math.random() * types.length)]
      : "multiplication";
    const task = generateTask(type, difficulty);
    setCurrentTask(task);
    taskStartTime.current = Date.now();
  }, [selectedTypes, difficulty]);

  const handleStart = useCallback(() => {
    resetTaskHistory();
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
    const isPercentageResult = currentTask.type === "percentage" || currentTask.type === "growth";
    const isCorrect = checkAnswer(userAnswer, currentTask.answer, isPercentageResult, currentTask.tolerance);
    const result: SprintResult = { task: currentTask, userAnswer, isCorrect, timeSpent };
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
  const prevPhaseRef = useRef<GamePhase>("config");
  useEffect(() => {
    if (phase === "sprint") sprintStartTime.current = Date.now();
    if (phase === "debrief" && prevPhaseRef.current === "sprint" && userEmail && results.length > 0) {
      const actualSeconds = Math.round((Date.now() - sprintStartTime.current) / 1000);
      const acc = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
      const diffLabel = DIFFICULTY_MAP[difficulty];
      saveDrillSession({
        userEmail, drillType: "mental_math", correctCount, totalCount: results.length,
        accuracyPercent: acc, durationSeconds: actualSeconds,
      }).then((sessionId) => {
        saveDrillAttempts({
          userEmail, drillType: "mental_math", sessionId,
          attempts: results.map((r) => ({
            taskType: r.task.type, isCorrect: r.isCorrect, responseTimeMs: r.timeSpent, difficulty: diffLabel,
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

  const stats: SprintStats = {
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
        /* Minimal header during sprint */
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
            <IconMentalMath size={22} />
            <span className="text-sm font-semibold tracking-tight text-foreground">Mental Math</span>
          </div>

          <SprintConfig
            duration={duration} onDurationChange={setDuration}
            difficulty={difficulty} onDifficultyChange={setDifficulty}
            selectedTypes={selectedTypes} onTypesChange={setSelectedTypes}
            onStart={handleStart}
          />
        </main>
      )}

      {phase === "sprint" && (
        <main className="flex flex-1 flex-col items-center px-4 py-4">
          <div className="w-full max-w-[760px] rounded-2xl border border-border bg-card p-6">
            <SprintGame
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
              <SprintDebrief stats={stats} results={results} onRestart={handleRestart} />
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
