import React, { useState, useEffect } from "react";
import SprintTimer from "@/components/sprint/SprintTimer";
import SprintInput from "@/components/sprint/SprintInput";
import { CaseMathTask } from "@/types/caseMath";
import { DifficultyLevel } from "@/components/DifficultySelector";
import { DrillButton } from "@/components/ui/drill-button";
import { X, Calculator } from "lucide-react";
import { FORMULAS_BY_CATEGORY, CATEGORY_LABELS } from "@/lib/caseMathFormulas";

interface CaseMathGameProps {
  task: CaseMathTask | null;
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

// Parse markdown-style bold text to React elements
const parseHighlights = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={index} className="font-bold text-primary">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
};

const CaseMathGame: React.FC<CaseMathGameProps> = ({
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
  const [showFormula, setShowFormula] = useState(false);

  // Reset formula visibility on new task
  useEffect(() => {
    setShowFormula(false);
  }, [task?.id]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Timer with End Button */}
      <div className="flex w-full items-center gap-4">
        <div className="flex-1">
          <SprintTimer timeRemaining={timeRemaining} totalDuration={totalDuration} />
        </div>
        <DrillButton
          variant="inactive"
          size="sm"
          onClick={onEnd}
          className="border border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
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

      {/* Task Display - Word Problem with highlighted numbers */}
      {task && (
        <div className="w-full py-6">
          <p className="text-center text-lg leading-relaxed text-foreground md:text-xl">
            {parseHighlights(task.question)}
          </p>

          {/* Formula Toggle — generic per-category formula sheet */}
          <div className="mt-4 flex flex-col items-center gap-2">
            {!showFormula ? (
              <button
                onClick={() => setShowFormula(true)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Calculator className="h-3.5 w-3.5" />
                Formeln anzeigen
              </button>
            ) : (
              <div className="flex flex-col gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                <div className="text-[11px] font-mono uppercase tracking-wider text-primary/70">
                  Formeln · {CATEGORY_LABELS[task.category]}
                </div>
                {FORMULAS_BY_CATEGORY[task.category].map((f, i) => (
                  <div key={i} className="font-mono text-[13px]">{f}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <SprintInput onSubmit={onSubmit} flashState={flashState} />
    </div>
  );
};

export default CaseMathGame;
