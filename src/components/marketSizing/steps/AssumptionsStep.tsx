import React, { useState } from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { BoxInput } from "@/types/marketSizing";
import { NodeColor, NODE_COLORS } from "@/components/frameworkBuilder/nodeColors";
import {
  ChildrenConnector,
  ChildColumn,
} from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import {
  getAllNodes,
  formatBoxValue,
  formatGermanNumber,
  parseGermanNumber,
} from "@/lib/marketSizingHelpers";
import StaticNodeCard from "./StaticNodeCard";
import { MousePointerClick } from "lucide-react";

interface AssumptionsStepProps {
  nodes: FrameworkNode[];
  boxInputs: Record<string, BoxInput>;
  onChange: (boxInputs: Record<string, BoxInput>) => void;
  disabled: boolean;
}

const isComplete = (input?: BoxInput) =>
  !!input && input.assumption.trim().length > 0 && input.value.trim().length > 0;

interface StaticTreeBranchProps {
  node: FrameworkNode;
  color: NodeColor;
  boxInputs: Record<string, BoxInput>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const StaticTreeBranch: React.FC<StaticTreeBranchProps> = ({
  node,
  color,
  boxInputs,
  selectedId,
  onSelect,
}) => {
  const input = boxInputs[node.id];
  return (
    <div className="flex shrink-0 flex-col items-center">
      <StaticNodeCard
        node={node}
        color={color}
        selected={selectedId === node.id}
        incomplete={!isComplete(input)}
        valueBadge={formatBoxValue(input?.value ?? "")}
        onSelect={() => onSelect(node.id)}
      />
      {node.children.length > 0 && (
        <ChildrenConnector childCount={node.children.length}>
          {node.children.map((child) => (
            <ChildColumn key={child.id}>
              <StaticTreeBranch
                node={child}
                color={color}
                boxInputs={boxInputs}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            </ChildColumn>
          ))}
        </ChildrenConnector>
      )}
    </div>
  );
};

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
  const openCount = allNodes.filter((n) => !isComplete(boxInputs[n.id])).length;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">3. Annahmen &amp; Zahlen</h2>
        <p className="text-xs text-muted-foreground">
          Klick jede Box an und trag rechts deine Annahme und die dazugehörige Zahl ein
          (z.B. „80 Mio" oder „20 %"). Boxen mit{" "}
          <span className="font-medium text-destructive">!</span> fehlen noch.
        </p>
      </div>

      {allNodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Keine Box gefunden. Geh zurück zu Schritt 2 und vergib mindestens einen Titel.
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Static tree */}
          <div className="min-w-0 flex-1 rounded-xl border border-border bg-muted/20 p-4">
            <div className="overflow-x-auto pb-2">
              <div className="flex w-max min-w-full items-start justify-center gap-x-4 gap-y-6 px-1">
                {nodes.map((node, i) => (
                  <StaticTreeBranch
                    key={node.id}
                    node={node}
                    color={NODE_COLORS[i % NODE_COLORS.length]}
                    boxInputs={boxInputs}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Editor panel */}
          <div className="rounded-xl border border-border bg-card p-4 lg:w-80 lg:shrink-0">
            {selected ? (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Ausgewählte Box
                  </p>
                  <p className="text-sm font-semibold leading-snug text-foreground">
                    {selected.labelChain}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                    Annahme
                  </label>
                  <textarea
                    value={selectedInput?.assumption ?? ""}
                    onChange={(e) => update({ assumption: e.target.value })}
                    placeholder="z.B. ca. 80 Mio Einwohner in DE (Statistisches Bundesamt)"
                    rows={3}
                    className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={disabled}
                  />
                </div>

                <div>
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

                <p className="text-[11px] text-muted-foreground">
                  {openCount === 0
                    ? "Alle Boxen ausgefüllt ✓"
                    : `Noch ${openCount} Box${openCount === 1 ? "" : "en"} ohne Annahme + Zahl.`}
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted-foreground">
                <MousePointerClick className="h-5 w-5 text-muted-foreground/60" />
                Wähle links eine Box, um Annahme und Zahl einzutragen.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssumptionsStep;
