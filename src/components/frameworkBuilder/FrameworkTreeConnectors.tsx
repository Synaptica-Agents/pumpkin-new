import React, { useLayoutEffect, useRef } from "react";

/**
 * Renders the connector lines from a parent node down to its children:
 *  - one vertical stem down from the parent,
 *  - a horizontal bar spanning from the first to the last child center,
 *  - per-child vertical stems (via <ChildColumn>).
 *
 * The container queries children marked with `data-child-col` and measures
 * their rects on every layout to keep the bar aligned when text wraps.
 */
export const ChildrenConnector: React.FC<{
  children: React.ReactNode;
  childCount: number;
}> = ({ children, childCount }) => {
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
    const firstCenter = firstRect.left + firstRect.width / 2 - containerRect.left;
    const lastCenter = lastRect.left + lastRect.width / 2 - containerRect.left;

    barRef.current.style.left = `${firstCenter}px`;
    barRef.current.style.width = `${lastCenter - firstCenter}px`;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="h-5 w-px bg-border" />
      <div ref={containerRef} className="relative flex gap-3 pt-5">
        {childCount > 1 && (
          <div
            ref={barRef}
            className="absolute top-0 h-px bg-border"
            style={{ left: 0, width: 0 }}
          />
        )}
        {children}
      </div>
    </div>
  );
};

/**
 * Child column with a short vertical stem above it. Marked so
 * <ChildrenConnector> can measure its center for the horizontal bar.
 */
export const ChildColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-child-col className="flex flex-col items-center">
    <div className="h-5 w-px bg-border" />
    {children}
  </div>
);
