import React from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { NodeColor } from "@/components/frameworkBuilder/nodeColors";
import {
  ChildrenConnector,
  ChildColumn,
} from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import ZoomableTree from "@/components/frameworkBuilder/ZoomableTree";
import { Star } from "lucide-react";

interface FrameworkTreeViewerProps {
  nodes: FrameworkNode[];
}

const NodeView: React.FC<{
  node: FrameworkNode;
  color: NodeColor;
  showPriorityStar?: boolean;
}> = ({ node, color, showPriorityStar }) => {
  const bullets = (node.bulletPoints ?? []).filter((bp) => bp.text.trim());
  return (
    <div
      className={`relative min-w-[150px] max-w-[210px] rounded-xl border ${color.border} bg-card ring-1 ${color.ring} shadow-lg ${color.shadow}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-xl bg-gradient-to-b ${color.tint} to-transparent`}
      />
      <div className="relative flex items-start gap-1.5 px-3 py-2.5">
        {showPriorityStar && node.isPriority && (
          <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
        )}
        <p className="break-words text-sm font-semibold leading-snug text-foreground">
          {node.title || "–"}
        </p>
      </div>
      {bullets.length > 0 && (
        <ul className="relative space-y-0.5 px-3 pb-2.5">
          {bullets.map((bp) => (
            <li
              key={bp.id}
              className="flex items-start gap-1.5 text-xs leading-snug text-muted-foreground"
            >
              <span className="shrink-0 pt-0.5 text-[10px] text-muted-foreground/40">•</span>
              <span className="break-words">{bp.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Branch: React.FC<{ node: FrameworkNode; color: NodeColor; depth: number }> = ({
  node,
  color,
  depth,
}) => (
  <div className="flex shrink-0 flex-row items-center">
    <NodeView node={node} color={color} showPriorityStar={depth === 1} />
    {node.children.length > 0 && (
      <ChildrenConnector childCount={node.children.length}>
        {node.children.map((child) => (
          <ChildColumn key={child.id}>
            <Branch node={child} color={color} depth={depth + 1} />
          </ChildColumn>
        ))}
      </ChildrenConnector>
    )}
  </div>
);

/** Read-only rendering of a FrameworkNode[] (e.g. the reference solution) in
 *  the same horizontal tree look as the builder — scaled to fit, zoomable. */
const FrameworkTreeViewer: React.FC<FrameworkTreeViewerProps> = ({ nodes }) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <ZoomableTree
        nodes={nodes}
        renderBranch={(node, color) => <Branch node={node} color={color} depth={1} />}
      />
    </div>
  );
};

export default FrameworkTreeViewer;
