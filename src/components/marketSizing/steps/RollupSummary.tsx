import React from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { MathOp } from "@/types/marketSizing";
import { formatComputedBadge } from "@/lib/marketSizingHelpers";
import { Sigma } from "lucide-react";

interface RollupSummaryProps {
  /** Top-level branches (Oberäste). */
  nodes: FrameworkNode[];
  /** Computed value per node id. */
  values: Record<string, number | null>;
  /** Combined value of all Oberäste. */
  total: number | null;
  /** Pairwise operations: operations[branch.id] links a branch to the previous. */
  operations: Record<string, MathOp>;
  /** Unit appended to the total, e.g. "Haushalte". */
  unit?: string;
}

/**
 * Compact readout of the final combination: each Oberast with its rolled-up
 * value, joined by the pairwise top-level operations, equalling the total.
 * Makes the "im letzten Schritt nur noch die Oberäste verrechnen" idea
 * explicit — all the sub-math is already done in the boxes.
 */
const RollupSummary: React.FC<RollupSummaryProps> = ({
  nodes,
  values,
  total,
  operations,
  unit,
}) => {
  if (nodes.length === 0) return null;
  const totalReady = total != null && isFinite(total);

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
        <Sigma className="h-3.5 w-3.5 text-primary" /> Hochgerechnet aus deiner Struktur
      </p>
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {nodes.map((n, i) => {
          const v = formatComputedBadge(values[n.id]);
          return (
            <React.Fragment key={n.id}>
              {i > 0 && (
                <span className="font-bold text-muted-foreground">{operations[n.id] ?? "·"}</span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1">
                <span className="max-w-[140px] truncate font-medium text-foreground">
                  {n.title.trim() || `Ast ${i + 1}`}
                </span>
                <span className="font-semibold text-primary">{v || "—"}</span>
              </span>
            </React.Fragment>
          );
        })}
        <span className="font-bold text-muted-foreground">=</span>
        <span className="rounded-md bg-primary/15 px-2 py-1 font-bold text-primary">
          {totalReady ? `${formatComputedBadge(total)}${unit ? " " + unit : ""}` : "noch unvollständig"}
        </span>
      </div>
    </div>
  );
};

export default RollupSummary;
