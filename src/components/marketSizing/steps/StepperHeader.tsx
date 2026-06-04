import React from "react";
import { Check } from "lucide-react";

export const STEP_LABELS = ["Verständnis", "Struktur", "Annahmen", "Ergebnis"] as const;

interface StepperHeaderProps {
  currentStep: number; // 0..3
  onJumpTo?: (step: number) => void;
}

const StepperHeader: React.FC<StepperHeaderProps> = ({ currentStep, onJumpTo }) => {
  return (
    <div className="flex items-center gap-0 rounded-xl border border-border bg-muted/30 p-2">
      {STEP_LABELS.map((label, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        const clickable = !!onJumpTo && i <= currentStep;
        return (
          <React.Fragment key={label}>
            <button
              type="button"
              onClick={clickable ? () => onJumpTo!(i) : undefined}
              disabled={!clickable}
              className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : isDone
                  ? "text-foreground hover:bg-muted/60"
                  : "text-muted-foreground/60"
              } ${clickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-success text-success-foreground"
                    : "border border-muted-foreground/30 bg-background text-muted-foreground/50"
                }`}
              >
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="truncate">{label}</span>
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div className="mx-1 h-px w-4 bg-border" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepperHeader;
