import React from "react";
import SprintTimer from "./SprintTimer";
import SprintInput from "./SprintInput";
import { Task } from "@/types/drill";
import { DifficultyLevel } from "@/components/DifficultySelector";
import { DrillButton } from "@/components/ui/drill-button";
import { X } from "lucide-react";

interface SprintGameProps {
  task: Task | null;
  timeRemaining: number;
  totalDuration: number;
  difficulty: DifficultyLevel;
  correctCount: number;
  totalAttempted: number;
  flashState: "none" | "correct" | "incorrect";
  onSubmit: (answer: string) => void;
  onEnd: () => void;
}

const levelNames: Record<DifficultyLevel, string> = {
  1: "Einfach",
  2: "Mittel",
  3: "Schwer",
};

const SprintGame: React.FC<SprintGameProps> = ({
  task,
  timeRemaining,
  totalDuration,
  difficulty,
  correctCount,
  totalAttempted,
  flashState,
  onSubmit,
  onEnd,
}) => {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Timer centered, End button right */}
      <div className="relative flex w-full items-center justify-center">
        <SprintTimer timeRemaining={timeRemaining} totalDuration={totalDuration} />
        <DrillButton
          variant="inactive"
          size="sm"
          onClick={onEnd}
          className="absolute right-0 text-muted-foreground hover:text-destructive hover:border-destructive"
        >
          <X className="h-4 w-4 mr-1" />
          Beenden
        </DrillButton>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 text-sm">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">
          Level: {levelNames[difficulty]}
        </span>
        <span className="text-muted-foreground">
          <span className="font-semibold text-success">{correctCount}</span>
          <span className="mx-1">/</span>
          <span>{totalAttempted}</span>
          {totalAttempted > 0 && (
            <span className="ml-1">
              ({Math.round((correctCount / totalAttempted) * 100)}%)
            </span>
          )}
        </span>
      </div>

      {/* Task Display */}
      {task && (
        <div className="w-full py-8">
          <p className="text-center font-mono text-4xl font-bold text-foreground md:text-5xl">
            {task.question}
          </p>
        </div>
      )}

      {/* Input */}
      <SprintInput onSubmit={onSubmit} flashState={flashState} />
    </div>
  );
};

export default SprintGame;
