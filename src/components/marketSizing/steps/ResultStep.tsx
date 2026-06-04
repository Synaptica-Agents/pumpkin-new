import React from "react";
import {
  formatGermanNumber,
  parseGermanNumber,
  MarketSizingLeaf,
} from "@/lib/marketSizingHelpers";
import {
  Target,
  ShieldCheck,
  Scale,
  ListTree,
  HelpCircle,
  Compass,
  StickyNote,
} from "lucide-react";
import {
  MarketSizingUnderstanding,
  SanityCheckStructured,
  MarketSizingMethod,
} from "@/types/marketSizing";

interface ResultStepProps {
  understanding: MarketSizingUnderstanding;
  treeText: string;
  leaves: MarketSizingLeaf[];
  assumptions: Record<string, string>;
  finalEstimate: string;
  onFinalEstimateChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  sanityCheck: SanityCheckStructured;
  onSanityCheckChange: (value: SanityCheckStructured) => void;
  disabled: boolean;
  unitHint?: string;
}

const METHOD_LABELS: Record<MarketSizingMethod, string> = {
  top_down: "Top-Down",
  bottom_up: "Bottom-Up",
  mixed: "Mixed",
};

const ResultStep: React.FC<ResultStepProps> = ({
  understanding,
  treeText,
  leaves,
  assumptions,
  finalEstimate,
  onFinalEstimateChange,
  unit,
  onUnitChange,
  sanityCheck,
  onSanityCheckChange,
  disabled,
  unitHint,
}) => {
  const parsedFinal = parseGermanNumber(finalEstimate);
  const parsedComparison = parseGermanNumber(sanityCheck.comparisonValue);

  const update = (patch: Partial<SanityCheckStructured>) =>
    onSanityCheckChange({ ...sanityCheck, ...patch });

  const filledClarifications = understanding.clarifications.filter(
    (c) => c.question.trim() || c.answer.trim()
  );
  const filledAssumptions = leaves
    .map((l) => ({ leaf: l, text: (assumptions[l.id] ?? "").trim() }))
    .filter((x) => x.text.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">4. Ergebnis</h2>
        <p className="text-xs text-muted-foreground">
          Hier siehst du nochmal alle deine Annahmen — rechne auf Papier und trag dann deine finale Schätzung ein.
        </p>
      </div>

      {/* Recap — read-only */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold text-foreground">
          <StickyNote className="h-3.5 w-3.5 text-primary" /> Recap deiner Eingaben
        </h3>

        {/* Method */}
        {understanding.method && (
          <div className="mb-3">
            <p className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Compass className="h-3 w-3" /> Methode
            </p>
            <p className="text-xs text-foreground">
              <span className="font-medium">{METHOD_LABELS[understanding.method]}</span>
              {understanding.methodReason.trim() && (
                <span className="text-muted-foreground"> — {understanding.methodReason.trim()}</span>
              )}
            </p>
          </div>
        )}

        {/* Clarifications */}
        {filledClarifications.length > 0 && (
          <div className="mb-3">
            <p className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <HelpCircle className="h-3 w-3" /> Klärungen
            </p>
            <ul className="space-y-0.5 text-xs text-foreground">
              {filledClarifications.map((c) => (
                <li key={c.id}>
                  <span className="font-medium">{c.question.trim() || "(ohne Frage)"}</span>
                  <span className="text-muted-foreground"> → {c.answer.trim() || "(keine Annahme)"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tree */}
        {treeText.trim() && (
          <div className="mb-3">
            <p className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <ListTree className="h-3 w-3" /> Struktur
            </p>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-border/60 bg-background/60 p-2 text-[11px] leading-relaxed text-foreground">
              {treeText}
            </pre>
          </div>
        )}

        {/* Assumptions */}
        {filledAssumptions.length > 0 && (
          <div>
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Annahmen pro Ast
            </p>
            <ul className="space-y-0.5 text-xs text-foreground">
              {filledAssumptions.map(({ leaf, text }) => (
                <li key={leaf.id}>
                  <span className="font-medium text-primary">[{leaf.path}]</span>{" "}
                  <span className="font-medium">{leaf.labelChain}:</span>{" "}
                  <span className="text-muted-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filledClarifications.length === 0 &&
          filledAssumptions.length === 0 &&
          !understanding.method && (
            <p className="text-[11px] italic text-muted-foreground">
              Keine Eingaben aus den vorherigen Schritten.
            </p>
          )}
      </div>

      {/* Final estimate input */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
          <Target className="h-3.5 w-3.5 text-primary" /> Finale Schätzung
        </label>
        <p className="mb-2 text-[11px] text-muted-foreground">
          Rechne auf Papier mit deinen Annahmen und trag das Ergebnis hier ein.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={finalEstimate}
            onChange={(e) => onFinalEstimateChange(e.target.value)}
            placeholder="z.B. 75 Mio oder 75.000.000"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={disabled}
          />
          <input
            type="text"
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            placeholder="Einheit"
            className="w-36 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={disabled}
          />
        </div>
        {parsedFinal != null && (
          <p className="mt-2 text-xs text-muted-foreground">
            Verstanden als:{" "}
            <span className="font-medium text-foreground">
              {formatGermanNumber(parsedFinal)}
            </span>
            {unit ? ` ${unit}` : unitHint ? ` ${unitHint}` : ""}
          </p>
        )}
      </div>

      {/* Structured Sanity Check */}
      <div className="rounded-xl border border-border bg-card p-4">
        <label className="mb-3 flex items-center gap-2 text-xs font-semibold text-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-success" /> Sanity Check
        </label>

        <div className="mb-3">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Größenordnung-Check
          </label>
          <textarea
            value={sanityCheck.magnitudeCheck}
            onChange={(e) => update({ magnitudeCheck: e.target.value })}
            placeholder="z.B. 'Liegt im Bereich 50-100M, was plausibel ist da Deutschland 80M Einwohner hat.'"
            rows={2}
            className="w-full resize-y rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={disabled}
          />
        </div>

        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Scale className="h-3 w-3" /> Vergleichswert (optional)
            </label>
            <input
              type="text"
              value={sanityCheck.comparisonRef}
              onChange={(e) => update({ comparisonRef: e.target.value })}
              placeholder="z.B. Statistisches Bundesamt oder eigene Erfahrung"
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={disabled}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
              Zahl
            </label>
            <input
              type="text"
              value={sanityCheck.comparisonValue}
              onChange={(e) => update({ comparisonValue: e.target.value })}
              placeholder="z.B. 83 Mio"
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={disabled}
            />
          </div>
        </div>
        {parsedComparison != null && (
          <p className="-mt-2 mb-3 text-[10px] text-muted-foreground">
            Verstanden als:{" "}
            <span className="font-medium text-foreground">
              {formatGermanNumber(parsedComparison)}
            </span>
          </p>
        )}

        <div>
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
            Plausibilitäts-Begründung (1-2 Sätze)
          </label>
          <textarea
            value={sanityCheck.reasoning}
            onChange={(e) => update({ reasoning: e.target.value })}
            placeholder="Warum ist deine Schätzung plausibel? Welche Verzerrungen könnten drinstecken?"
            rows={2}
            className="w-full resize-y rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultStep;
