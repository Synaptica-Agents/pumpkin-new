import React, { useState } from "react";
import { MathOp } from "@/types/marketSizing";
import { MATH_OPS } from "@/lib/marketSizingHelpers";

interface OpChipProps {
  /** Operation linking this box to its previous sibling (undefined = not set). */
  op?: MathOp;
  /** When provided the chip is editable; otherwise it's a read-only symbol. */
  onChange?: (op: MathOp) => void;
  /** Accent text-colour class for the selected op (e.g. branch colour). */
  accent?: string;
  disabled?: boolean;
}

/**
 * Compact operation control that sits between two sibling boxes.
 *  - Read-only: just the chosen symbol.
 *  - Editable, collapsed: the chosen symbol as a button — click to expand.
 *  - Editable, expanded: all four operations stacked; picking one collapses
 *    back to it. Starts expanded while no operation is chosen yet.
 */
const OpChip: React.FC<OpChipProps> = ({ op, onChange, accent = "text-primary", disabled }) => {
  const editable = onChange != null;
  const [expanded, setExpanded] = useState(op == null);

  if (!editable) {
    return (
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background text-sm font-bold shadow-sm ${accent}`}
        title="Rechenoperation zum vorherigen Ast"
      >
        {op ?? "·"}
      </span>
    );
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        disabled={disabled}
        title="Operation ändern"
        className={`flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-sm font-bold shadow-sm transition-colors hover:bg-muted disabled:opacity-40 ${accent}`}
      >
        {op}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex flex-col overflow-hidden rounded-md border bg-background shadow-sm ${
        op == null ? "border-destructive/60" : "border-border"
      }`}
      title="Rechenoperation zum vorherigen Ast (Pflicht)"
    >
      {MATH_OPS.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => {
            onChange(o);
            setExpanded(false);
          }}
          disabled={disabled}
          className={`h-7 w-7 text-sm leading-none transition-colors disabled:opacity-40 ${
            op === o ? `bg-muted font-bold ${accent}` : "text-muted-foreground hover:bg-muted/60"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
};

export default OpChip;
