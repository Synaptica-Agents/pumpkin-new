import React, { useCallback } from "react";
import {
  MarketSizingClarification,
  MarketSizingUnderstanding,
} from "@/types/marketSizing";
import { HelpCircle, Plus, X } from "lucide-react";

interface UnderstandingStepProps {
  understanding: MarketSizingUnderstanding;
  onChange: (next: MarketSizingUnderstanding) => void;
  disabled: boolean;
}

const MAX_CLARIFICATIONS = 3;

const newId = () => Math.random().toString(36).slice(2, 10);

const UnderstandingStep: React.FC<UnderstandingStepProps> = ({
  understanding,
  onChange,
  disabled,
}) => {
  const updateClarification = useCallback(
    (id: string, patch: Partial<MarketSizingClarification>) => {
      onChange({
        ...understanding,
        clarifications: understanding.clarifications.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      });
    },
    [understanding, onChange]
  );

  const addClarification = useCallback(() => {
    if (understanding.clarifications.length >= MAX_CLARIFICATIONS) return;
    onChange({
      ...understanding,
      clarifications: [
        ...understanding.clarifications,
        { id: newId(), question: "", answer: "" },
      ],
    });
  }, [understanding, onChange]);

  const removeClarification = useCallback(
    (id: string) => {
      onChange({
        ...understanding,
        clarifications: understanding.clarifications.filter((c) => c.id !== id),
      });
    },
    [understanding, onChange]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          1. Verständnis
        </h2>
        <p className="text-xs text-muted-foreground">
          Stell vor dem Start sicher, dass du den Scope verstehst und kläre offene Annahmen.
        </p>
      </div>

      {/* Clarifications */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <HelpCircle className="h-3.5 w-3.5 text-primary" /> Klärungsfragen <span className="font-normal text-muted-foreground">(optional, max {MAX_CLARIFICATIONS})</span>
          </label>
          {understanding.clarifications.length < MAX_CLARIFICATIONS && (
            <button
              type="button"
              onClick={addClarification}
              disabled={disabled}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:opacity-30"
            >
              <Plus className="h-3 w-3" /> Frage hinzufügen
            </button>
          )}
        </div>

        {understanding.clarifications.length === 0 ? (
          <p className="text-[11px] italic text-muted-foreground/70">
            Wenn der Case Interpretationsspielraum hat (z.B. &quot;Welche Stühle?&quot;, &quot;Was bedeutet Betreten?&quot;), notiere deine Annahmen.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {understanding.clarifications.map((c, i) => (
              <div
                key={c.id}
                className="rounded-lg border border-border/70 bg-muted/20 p-2.5"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-1 text-[10px] font-bold text-muted-foreground">
                    {i + 1}.
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={c.question}
                      onChange={(e) =>
                        updateClarification(c.id, { question: e.target.value })
                      }
                      placeholder="Frage, z.B. 'Welche Stühle zählen mit?'"
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={disabled}
                    />
                    <input
                      type="text"
                      value={c.answer}
                      onChange={(e) =>
                        updateClarification(c.id, { answer: e.target.value })
                      }
                      placeholder="Deine Annahme, z.B. 'Esszimmer- + Bürostühle'"
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={disabled}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeClarification(c.id)}
                    disabled={disabled}
                    className="text-muted-foreground/50 transition-colors hover:text-destructive disabled:opacity-30"
                    title="Frage entfernen"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnderstandingStep;
