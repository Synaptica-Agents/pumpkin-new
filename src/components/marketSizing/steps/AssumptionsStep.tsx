import React, { useState } from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { BoxInput } from "@/types/marketSizing";
import {
  getAllNodes,
  formatGermanNumber,
  parseGermanNumber,
} from "@/lib/marketSizingHelpers";
import StaticTree, { isBoxComplete } from "./StaticTree";
import { MousePointerClick } from "lucide-react";

interface AssumptionsStepProps {
  nodes: FrameworkNode[];
  boxInputs: Record<string, BoxInput>;
  onChange: (boxInputs: Record<string, BoxInput>) => void;
  disabled: boolean;
}

const AssumptionsStep: React.FC<AssumptionsStepProps> = ({
  nodes,
  boxInputs,
  onChange,
  disabled,
}) => {
  const allNodes = getAllNodes(nodes);
  const [selectedId, setSelectedId] = useState<string | null>(
    allNodes[0]?.id ?? null
  );

  const selected = allNodes.find((n) => n.id === selectedId) ?? null;
  const selectedInput = selectedId ? boxInputs[selectedId] : undefined;

  const update = (patch: Partial<BoxInput>) => {
    if (!selectedId) return;
    const prev = boxInputs[selectedId] ?? { assumption: "", value: "" };
    onChange({ ...boxInputs, [selectedId]: { ...prev, ...patch } });
  };

  const parsedValue = parseGermanNumber(selectedInput?.value ?? "");
  const openCount = allNodes.filter((n) => !isBoxComplete(boxInputs[n.id])).length;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">3. Annahmen &amp; Zahlen</h2>
        <p className="text-xs text-muted-foreground">
          Klick jede Box an und trag unten deine Annahme und die dazugehörige Zahl ein
          (z.B. „80 Mio" oder „20 %"). Boxen mit{" "}
          <span className="font-medium text-destructive">!</span> fehlen noch.
        </p>
      </div>

      {allNodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Keine Box gefunden. Geh zurück zu Schritt 2 und vergib mindestens einen Titel.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Static tree — full width */}
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <StaticTree
              nodes={nodes}
              boxInputs={boxInputs}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Editor panel — below, horizontal */}
          <div className="rounded-xl border border-border bg-card p-4">
            {selected ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Ausgewählte Box
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {selected.labelChain}
                    </p>
                  </div>
                  <p className="shrink-0 text-[11px] text-muted-foreground">
                    {openCount === 0
                      ? "Alle Boxen ausgefüllt ✓"
                      : `Noch ${openCount} Box${openCount === 1 ? "" : "en"} offen`}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                      Annahme
                    </label>
                    <textarea
                      value={selectedInput?.assumption ?? ""}
                      onChange={(e) => update({ assumption: e.target.value })}
                      placeholder="z.B. ca. 80 Mio Einwohner in DE (Statistisches Bundesamt)"
                      rows={2}
                      className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={disabled}
                    />
                  </div>
                  <div className="sm:w-48 sm:shrink-0">
                    <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                      Zahl
                    </label>
                    <input
                      type="text"
                      value={selectedInput?.value ?? ""}
                      onChange={(e) => update({ value: e.target.value })}
                      placeholder="z.B. 80 Mio, 20 %, 1/3"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={disabled}
                    />
                    {parsedValue != null && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Verstanden als:{" "}
                        <span className="font-medium text-foreground">
                          {formatGermanNumber(parsedValue)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-6 text-center text-sm text-muted-foreground">
                <MousePointerClick className="h-5 w-5 text-muted-foreground/60" />
                Wähle oben eine Box, um Annahme und Zahl einzutragen.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssumptionsStep;
