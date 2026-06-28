import React, { useState } from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import {
  formatGermanNumber,
  parseGermanNumber,
  formatBoxValue,
  formatComputedBadge,
  getAllNodes,
  findNodeById,
} from "@/lib/marketSizingHelpers";
import {
  Target,
  ShieldCheck,
  HelpCircle,
  StickyNote,
  MousePointerClick,
} from "lucide-react";
import {
  BoxInput,
  MathOp,
  MarketSizingUnderstanding,
  SanityCheckStructured,
} from "@/types/marketSizing";
import StaticTree from "./StaticTree";
import RollupSummary from "./RollupSummary";

interface ResultStepProps {
  understanding: MarketSizingUnderstanding;
  nodes: FrameworkNode[];
  boxInputs: Record<string, BoxInput>;
  operations: Record<string, MathOp>;
  /** Computed value per node id (parents derived). */
  values: Record<string, number | null>;
  /** Combined value of all Oberäste. */
  total: number | null;
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
  nodes,
  boxInputs,
  operations,
  values,
  total,
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

  const allNodes = getAllNodes(nodes);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = allNodes.find((n) => n.id === selectedId) ?? null;
  const selectedNode = selectedId ? findNodeById(nodes, selectedId) : null;
  const isParentSel = !!selectedNode && selectedNode.children.length > 0;
  const selectedInput = selectedId ? boxInputs[selectedId] : undefined;
  const selectedComputed = selectedId ? values[selectedId] : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">4. Ergebnis</h2>
        <p className="text-xs text-muted-foreground">
          Deine Struktur ist hochgerechnet — im letzten Schritt werden nur noch die Oberäste verrechnet. Prüf das Ergebnis, pass es bei Bedarf an und mach den Sanity Check.
        </p>
      </div>

      {allNodes.length > 0 && (
        <RollupSummary
          nodes={nodes}
          values={values}
          total={total}
          operations={operations}
          unit={unit || unitHint}
        />
      )}

      {/* Final estimate input */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
          <Target className="h-3.5 w-3.5 text-primary" /> Finale Schätzung
        </label>
        <p className="mb-2 text-[11px] text-muted-foreground">
          Aus deiner Struktur berechnet und hier eingetragen — du kannst den Wert anpassen (z.B. runden).
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

        <div>
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

        {/* Structure — static, clickable */}
        {allNodes.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Struktur — Box anklicken für Details
            </p>
            <StaticTree
              nodes={nodes}
              boxInputs={boxInputs}
              operations={operations}
              values={values}
              selectableParents
              selectedId={selectedId}
              onSelect={setSelectedId}
              showIncomplete={false}
            />

            {/* Selected box detail */}
            <div className="mt-2 rounded-lg border border-border bg-background/60 p-3">
              {selected ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {selected.labelChain}
                    </span>
                    {(() => {
                      const badge = isParentSel
                        ? formatComputedBadge(selectedComputed)
                        : formatBoxValue(selectedInput?.value ?? "");
                      return badge ? (
                        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                          {badge}
                        </span>
                      ) : null;
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isParentSel
                      ? "Rechnung (aus Unterästen)"
                      : selectedInput?.assumption?.trim() || "(keine Annahme)"}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 text-center text-xs text-muted-foreground">
                  <MousePointerClick className="h-4 w-4 text-muted-foreground/60" />
                  Box anklicken, um Annahme und Zahl zu sehen.
                </div>
              )}
            </div>
          </div>
        )}

        {filledClarifications.length === 0 && allNodes.length === 0 && (
          <p className="text-[11px] italic text-muted-foreground">
            Keine Eingaben aus den vorherigen Schritten.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultStep;
