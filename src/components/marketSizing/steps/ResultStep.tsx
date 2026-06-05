import React from "react";
import {
  formatGermanNumber,
  parseGermanNumber,
  formatBoxValue,
  MarketSizingLeaf,
} from "@/lib/marketSizingHelpers";
import {
  Target,
  ShieldCheck,
  ListTree,
  HelpCircle,
  StickyNote,
} from "lucide-react";
import {
  BoxInput,
  MarketSizingUnderstanding,
  SanityCheckStructured,
} from "@/types/marketSizing";

interface ResultStepProps {
  understanding: MarketSizingUnderstanding;
  treeText: string;
  boxes: MarketSizingLeaf[];
  boxInputs: Record<string, BoxInput>;
  finalEstimate: string;
  onFinalEstimateChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  sanityCheck: SanityCheckStructured;
  onSanityCheckChange: (value: SanityCheckStructured) => void;
  disabled: boolean;
  unitHint?: string;
}

const ResultStep: React.FC<ResultStepProps> = ({
  understanding,
  treeText,
  boxes,
  boxInputs,
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

  const update = (patch: Partial<SanityCheckStructured>) =>
    onSanityCheckChange({ ...sanityCheck, ...patch });

  const filledClarifications = understanding.clarifications.filter(
    (c) => c.question.trim() || c.answer.trim()
  );
  const filledAssumptions = boxes
    .map((b) => ({
      box: b,
      value: formatBoxValue(boxInputs[b.id]?.value ?? ""),
      text: (boxInputs[b.id]?.assumption ?? "").trim(),
    }))
    .filter((x) => x.value.length > 0 || x.text.length > 0);

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
              Annahmen &amp; Zahlen pro Box
            </p>
            <ul className="space-y-0.5 text-xs text-foreground">
              {filledAssumptions.map(({ box, value, text }) => (
                <li key={box.id}>
                  <span className="font-medium">{box.labelChain}:</span>{" "}
                  {value && <span className="font-semibold text-primary">{value}</span>}
                  {text && <span className="text-muted-foreground">{value ? " — " : ""}{text}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {filledClarifications.length === 0 &&
          filledAssumptions.length === 0 && (
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
      </div>
    </div>
  );
};

export default ResultStep;
