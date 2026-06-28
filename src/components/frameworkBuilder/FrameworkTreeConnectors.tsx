import React, { useLayoutEffect, useRef } from "react";

/**
 * Horizontal connector from a parent node (left) to its children (stacked on
 * the right):
 *  - a short horizontal stem out of the parent,
 *  - a vertical spine spanning from the first to the last child center,
 *  - per-child horizontal stems (via <ChildColumn>),
 *  - the per-gap math operations sit on the spine between siblings, supplied by
 *    the caller as <OpRow> items interleaved with the <ChildColumn>s.
 *
 * The spine is re-measured on every layout and whenever the content resizes
 * (e.g. an <OpChip> expands), so it stays aligned when boxes move or text wraps.
 */
export const ChildrenConnector: React.FC<{
  children: React.ReactNode;
  childCount: number;
}> = ({ children, childCount }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    if (!container || !bar) return;

    const measure = () => {
      const childColumns = container.querySelectorAll<HTMLElement>("[data-child-col]");
      if (childColumns.length < 2) return;
      const first = childColumns[0];
      const last = childColumns[childColumns.length - 1];
      const containerRect = container.getBoundingClientRect();
      const firstRect = first.getBoundingClientRect();
      const lastRect = last.getBoundingClientRect();
      const firstCenter = firstRect.top + firstRect.height / 2 - containerRect.top;
      const lastCenter = lastRect.top + lastRect.height / 2 - containerRect.top;
      bar.style.top = `${firstCenter}px`;
      bar.style.height = `${lastCenter - firstCenter}px`;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  });

  return (
    <div className="flex flex-row items-center">
      <div className="h-px w-3 bg-border" />
      <div ref={containerRef} className="relative flex flex-col gap-1">
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
 * <ChildrenConnector> can measure its center for the vertical spine.
 */
export const ChildColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-child-col className="flex flex-row items-center">
    <div className="h-px w-3 bg-border" />
    {children}
  </div>
);

/**
 * Row that holds a single operation control in the gap between two sibling
 * boxes, sitting on the spine (left edge). Stays out of the spine measurement
 * because it carries no `data-child-col`.
 */
export const OpRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative z-10 flex self-start">{children}</div>
);
