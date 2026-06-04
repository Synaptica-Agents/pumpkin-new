import React from "react";
import { MarketSizingLeaf } from "@/lib/marketSizingHelpers";
import { Lightbulb } from "lucide-react";

interface AssumptionsStepProps {
  leaves: MarketSizingLeaf[];
  assumptions: Record<string, string>;
  onChange: (assumptions: Record<string, string>) => void;
  disabled: boolean;
}

const AssumptionsStep: React.FC<AssumptionsStepProps> = ({
  leaves,
  assumptions,
  onChange,
  disabled,
}) => {
  const update = (id: string, value: string) => {
    onChange({ ...assumptions, [id]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">2. Annahmen &amp; Begründung</h2>
        <p className="text-xs text-muted-foreground">
          Schreib pro Ast in einem Satz, woher du deine Zahl ableitest. Hilft dir, deine Logik zu schärfen (optional).
        </p>
      </div>

      {leaves.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Kein Ast mit Titel gefunden. Geh zurück zu Schritt 1 und vergib mindestens einen Titel.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {leaves.map((l) => (
            <div
              key={l.id}
              className="rounded-xl border border-border bg-card p-3"
            >
              <label className="mb-1.5 flex items-start gap-2 text-xs font-medium text-foreground">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="leading-snug">{l.labelChain}</span>
              </label>
              <textarea
                value={assumptions[l.id] ?? ""}
                onChange={(e) => update(l.id, e.target.value)}
                placeholder="z.B. ca. 83 Mio Einwohner in DE (Statistisches Bundesamt)"
                rows={1}
                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssumptionsStep;
