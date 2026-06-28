import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { NodeColor, NODE_COLORS } from "@/components/frameworkBuilder/nodeColors";
import { ArrowLeft, ZoomIn } from "lucide-react";

interface ZoomableTreeProps {
  /** Top-level branches ("Oberäste"). */
  nodes: FrameworkNode[];
  /** Render one full branch subtree (editable or selectable). */
  renderBranch: (node: FrameworkNode, color: NodeColor, index: number) => React.ReactNode;
  /** Optional control shown below the overview (e.g. "+ Ast"). */
  headerAddon?: React.ReactNode;
  /** Render the operation linking top-level branch `linkNodeId` to the previous
   *  one (overview mode only). Called for every Oberast after the first. */
  renderTopOp?: (linkNodeId: string) => React.ReactNode;
  /** Colour for a top-level branch by index. Defaults to the shared palette. */
  colorFor?: (index: number) => NodeColor;
}

const defaultColorFor = (i: number) => NODE_COLORS[i % NODE_COLORS.length];

/**
 * Shared shell for the Market-Sizing issue tree (Schritt 2 & 3).
 *
 * - **Overview:** the whole tree is always fully visible — it scales down via
 *   CSS transform to fit the container width (no horizontal scrolling). Each
 *   top-level branch is clickable to zoom in.
 * - **Zoom:** only the selected branch is shown at full, interactive size, with
 *   a "back to overview" button and colour chips to switch branches.
 */
const ZoomableTree: React.FC<ZoomableTreeProps> = ({
  nodes,
  renderBranch,
  headerAddon,
  renderTopOp,
  colorFor = defaultColorFor,
}) => {
  const [zoomedId, setZoomedId] = useState<string | null>(null);

  // Drop the zoom target if the branch disappears (e.g. removed).
  useEffect(() => {
    if (zoomedId && !nodes.some((n) => n.id === zoomedId)) setZoomedId(null);
  }, [nodes, zoomedId]);

  const zoomedIndex = nodes.findIndex((n) => n.id === zoomedId);
  const zoomedNode = zoomedIndex >= 0 ? nodes[zoomedIndex] : null;

  if (zoomedNode) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomedId(null)}
            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Übersicht
          </button>
          <div className="flex flex-wrap items-center gap-1">
            {nodes.map((n, i) => {
              const c = colorFor(i);
              const active = n.id === zoomedId;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setZoomedId(n.id)}
                  className={`max-w-[140px] truncate rounded-md border px-2 py-1 text-[11px] transition-colors ${c.border} ${
                    active
                      ? `bg-muted font-semibold ${c.accent}`
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  title={n.title.trim() || "(ohne Titel)"}
                >
                  {n.title.trim() || `Ast ${i + 1}`}
                </button>
              );
            })}
          </div>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex w-max min-w-full items-start justify-start px-1 pt-3">
            {renderBranch(zoomedNode, colorFor(zoomedIndex), zoomedIndex)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ScaledOverview>
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            {i > 0 && renderTopOp && (
              <div className="relative z-10 flex self-start pl-12">{renderTopOp(node.id)}</div>
            )}
            <OverviewBranch onZoom={() => setZoomedId(node.id)}>
              {renderBranch(node, colorFor(i), i)}
            </OverviewBranch>
          </React.Fragment>
        ))}
      </ScaledOverview>
      {headerAddon && <div className="flex justify-center">{headerAddon}</div>}
    </div>
  );
};

/**
 * Scales its content down (never up) so the natural width always fits the
 * container — the whole tree stays inside the field, no horizontal scrolling.
 * Reserves the scaled height and horizontally centres the result.
 */
const ScaledOverview: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [offsetX, setOffsetX] = useState(0);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    const containerWidth = container.clientWidth;
    const contentWidth = content.scrollWidth;
    const next = contentWidth > 0 ? Math.min(1, containerWidth / contentWidth) : 1;
    setScale(next);
    setHeight(content.scrollHeight * next);
    setOffsetX(Math.max(0, (containerWidth - contentWidth * next) / 2));
  }, []);

  useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(content);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div style={{ height }}>
        <div
          ref={contentRef}
          style={{
            transform: `translateX(${offsetX}px) scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="flex w-max flex-col items-start gap-6 px-1 pt-3"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * One branch in the overview: content is non-interactive and a transparent
 * overlay captures the click to zoom in.
 */
const OverviewBranch: React.FC<{ children: React.ReactNode; onZoom: () => void }> = ({
  children,
  onZoom,
}) => (
  <div className="group relative shrink-0">
    <div className="pointer-events-none">{children}</div>
    <button
      type="button"
      onClick={onZoom}
      className="absolute inset-0 z-20 flex items-start justify-center rounded-xl ring-primary/40 transition-all hover:bg-primary/[0.03] hover:ring-2"
      title="Reinzoomen & bearbeiten"
    >
      <span className="mt-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <ZoomIn className="h-3 w-3" /> Bearbeiten
      </span>
    </button>
  </div>
);

export default ZoomableTree;
