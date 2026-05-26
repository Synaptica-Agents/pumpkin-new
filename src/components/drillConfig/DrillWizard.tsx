import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface WizardStep {
  label: string;
  caption?: string;
  content: React.ReactNode;
  canAdvance?: boolean;
}

interface DrillWizardProps {
  steps: WizardStep[];
  onComplete: () => void;
  startLabel?: string;
}

const DrillWizard: React.FC<DrillWizardProps> = ({
  steps,
  onComplete,
  startLabel = "Drill starten",
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const canAdvance = step.canAdvance ?? true;

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLast) {
      onComplete();
    } else {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }
  };

  const handleBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d10] p-6 md:p-8">
      {/* Step header */}
      <div key={stepIndex} className="mb-6 animate-in fade-in slide-in-from-right-2 duration-200">
        <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70">
          Schritt {stepIndex + 1} von {steps.length}
        </div>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
          {step.label}
        </h2>
        {step.caption && (
          <p className="mt-1 text-sm text-muted-foreground">{step.caption}</p>
        )}
      </div>

      {/* Step content */}
      <div key={`content-${stepIndex}`} className="animate-in fade-in duration-200">
        {step.content}
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="flex items-center gap-1.5 rounded-[10px] border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:border-white/20 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Zurück
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === stepIndex
                  ? "w-6 bg-primary"
                  : i < stepIndex
                  ? "w-2 bg-primary/60"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance}
          className="flex items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
        >
          {isLast ? startLabel : "Weiter"} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DrillWizard;
