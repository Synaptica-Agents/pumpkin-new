import React, { useLayoutEffect, useRef } from "react";
import { MathOp } from "@/types/marketSizing";

const MATH_OPS: MathOp[] = ["×", "+", "−", "÷"];

/**
 * Horizontal connector from a parent node (left) to its children (stacked on
 * the right):
 *  - a short horizontal stem out of the parent,
 *  - the optional math-operation control,
 *  - a vertical bar spanning from the first to the last child center,
 *  - per-child horizontal stems (via <ChildColumn>).
 *
 * The container queries children marked with `data-child-col` and measures
 * their rects on every layout to keep the bar aligned when text wraps.
 *
 * When the parent has 2+ children it can show the math operation that combines
 * them — editable (segmented switch, `onOpChange`) or read-only (static badge).
 */
export const ChildrenConnector: React.FC<{
  children: React.ReactNode;
  childCount: number;
  /** Chosen operation between the children (undefined = not yet picked). */
  op?: MathOp;
  /** When provided, the operation is editable via a segmented switch. */
  onOpChange?: (op: MathOp) => void;
  /** Accent text colour class (e.g. branch colour) for the active op. */
  accent?: string;
}> = ({ children, childCount, op, onOpChange, accent = "text-primary" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !barRef.current || childCount <= 1) return;

    const container = containerRef.current;
    const childColumns = container.querySelectorAll<HTMLElement>("[data-child-col]");
    if (childColumns.length < 2) return;

    const first = childColumns[0];
    const last = childColumns[childColumns.length - 1];
    const containerRect = container.getBoundingClientRect();

    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();
    const firstCenter = firstRect.top + firstRect.height / 2 - containerRect.top;
    const lastCenter = lastRect.top + lastRect.height / 2 - containerRect.top;

    barRef.current.style.top = `${firstCenter}px`;
    barRef.current.style.height = `${lastCenter - firstCenter}px`;
  });

  const showOp = childCount > 1 && (onOpChange != null || op != null);

  return (
    <div className="flex flex-row items-center">
      <div className="h-px w-3 bg-border" />
      {showOp &&
        (onOpChange ? (
          <div
            className={`z-10 mx-1 inline-flex items-center overflow-hidden rounded-md border bg-background shadow-sm ${
              op == null ? "border-destructive/50" : "border-border"
            }`}
            title="Rechenoperation zwischen den Ästen (Pflicht)"
          >
            {MATH_OPS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => onOpChange(o)}
                className={`h-6 w-7 text-sm leading-none transition-colors ${
                  op === o
                    ? `bg-muted font-bold ${accent}`
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        ) : (
          <span
            className={`z-10 mx-1 flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background text-sm font-bold shadow-sm ${accent}`}
            title="Rechenoperation zwischen den Ästen"
          >
            {op}
          </span>
        ))}
      {showOp && <div className="h-px w-3 bg-border" />}
      <div ref={containerRef} className="relative flex flex-col gap-3">
        {childCount > 1 && (
          <div
            ref={barRef}
            className="absolute left-0 w-px bg-border"
            style={{ top: 0, height: 0 }}
          />
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * Child row with a short horizontal stem to its left. Marked so
 * <ChildrenConnector> can measure its center for the vertical bar.
 */
export const ChildColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-child-col className="flex flex-row items-center">
    <div className="h-px w-3 bg-border" />
    {children}
  </div>
);
