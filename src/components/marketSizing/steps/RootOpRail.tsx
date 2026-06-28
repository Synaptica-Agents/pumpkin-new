import React from "react";
import { MathOp } from "@/types/marketSizing";
import { MATH_OPS } from "@/lib/marketSizingHelpers";

interface RootOpRailProps {
  /** Currently chosen operation that combines the Oberäste (undefined = none). */
  op?: MathOp;
  /** When provided, the rail is an editable segmented switch; otherwise read-only. */
  onChange?: (op: MathOp) => void;
  disabled?: boolean;
}

/**
 * Vertical operation control rendered to the left of the top-level branch stack
 * (via ZoomableTree's `leftRail`). It captures the single math operation that
 * combines the colour-coded Oberäste into the final number — the top-level
 * counterpart of the per-parent operation inside ChildrenConnector.
 */
const RootOpRail: React.FC<RootOpRailProps> = ({ op, onChange, disabled }) => {
  const editable = onChange != null;
  return (
    <div
      className="flex flex-col items-center gap-1"
      title="Rechenoperation zwischen den Oberästen (Pflicht)"
    >
      <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        Oberäste
      </span>
      {editable ? (
        <div
          className={`inline-flex flex-col overflow-hidden rounded-md border bg-background shadow-sm ${
            op == null ? "border-destructive/60" : "border-border"
          }`}
        >
          {MATH_OPS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              disabled={disabled}
              className={`h-7 w-9 text-sm leading-none transition-colors disabled:opacity-40 ${
                op === o
                  ? "bg-muted font-bold text-primary"
                  : "text-muted-foreground hover:bg-muted/60"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <span className="flex h-8 w-9 items-center justify-center rounded-md border border-border bg-background text-base font-bold text-primary shadow-sm">
          {op ?? "?"}
        </span>
      )}
      <span className="text-[9px] text-muted-foreground/70">verrechnen</span>
    </div>
  );
};

export default RootOpRail;
