import React, { useCallback } from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { createEmptyNode } from "@/lib/frameworkSerializer";
import FrameworkNodeCard from "@/components/frameworkBuilder/FrameworkNodeCard";
import { ChildrenConnector, ChildColumn } from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import { Plus } from "lucide-react";

const MAX_TOP_LEVEL = 6;
const MAX_CHILDREN = 4;
const MAX_DEPTH = 3;

const NODE_COLORS = [
  "border-t-primary",
  "border-t-blue-500",
  "border-t-emerald-500",
  "border-t-violet-500",
  "border-t-rose-500",
  "border-t-cyan-500",
];

function updateNodeInTree(
  nodes: FrameworkNode[],
  targetId: string,
  updater: (n: FrameworkNode) => FrameworkNode
): FrameworkNode[] {
  return nodes.map((n) => {
    if (n.id === targetId) return updater(n);
    if (n.children.length > 0) {
      return { ...n, children: updateNodeInTree(n.children, targetId, updater) };
    }
    return n;
  });
}

function removeNodeFromTree(nodes: FrameworkNode[], targetId: string): FrameworkNode[] {
  return nodes
    .filter((n) => n.id !== targetId)
    .map((n) =>
      n.children.length > 0 ? { ...n, children: removeNodeFromTree(n.children, targetId) } : n
    );
}

interface StructureStepProps {
  nodes: FrameworkNode[];
  onChange: (nodes: FrameworkNode[]) => void;
  lastAddedId: string | null;
  onLastAddedIdChange: (id: string | null) => void;
  disabled: boolean;
}

interface TreeBranchProps {
  node: FrameworkNode;
  colorClass: string;
  depth: number;
  disabled: boolean;
  lastAddedId: string | null;
  onUpdate: (id: string, updated: FrameworkNode) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

const TreeBranch: React.FC<TreeBranchProps> = ({
  node,
  colorClass,
  depth,
  disabled,
  lastAddedId,
  onUpdate,
  onRemove,
  onAddChild,
}) => {
  const canAddChild = node.children.length < MAX_CHILDREN && depth < MAX_DEPTH;

  return (
    <div className="flex flex-col items-center">
      <FrameworkNodeCard
        node={node}
        colorClass={colorClass}
        onUpdate={(updated) => onUpdate(node.id, updated)}
        onRemove={() => onRemove(node.id)}
        disabled={disabled}
        autoFocusTitle={node.id === lastAddedId}
      />
      {canAddChild && (
        <button
          type="button"
          onClick={() => onAddChild(node.id)}
          disabled={disabled}
          className="mt-2 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-muted-foreground/60 transition-colors hover:bg-muted hover:text-primary disabled:opacity-30"
        >
          <Plus className="h-3 w-3" /> Unterast
        </button>
      )}
      {node.children.length > 0 && (
        <ChildrenConnector childCount={node.children.length}>
          {node.children.map((child) => (
            <ChildColumn key={child.id}>
              <TreeBranch
                node={child}
                colorClass={colorClass}
                depth={depth + 1}
                disabled={disabled}
                lastAddedId={lastAddedId}
                onUpdate={onUpdate}
                onRemove={onRemove}
                onAddChild={onAddChild}
              />
            </ChildColumn>
          ))}
        </ChildrenConnector>
      )}
    </div>
  );
};

const StructureStep: React.FC<StructureStepProps> = ({
  nodes,
  onChange,
  lastAddedId,
  onLastAddedIdChange,
  disabled,
}) => {
  const updateNode = useCallback(
    (nodeId: string, updated: FrameworkNode) => {
      onChange(updateNodeInTree(nodes, nodeId, () => updated));
    },
    [nodes, onChange]
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      const result = removeNodeFromTree(nodes, nodeId);
      onChange(result.length === 0 ? [createEmptyNode()] : result);
    },
    [nodes, onChange]
  );

  const addNode = useCallback(() => {
    if (nodes.length >= MAX_TOP_LEVEL) return;
    const n = createEmptyNode();
    onChange([...nodes, n]);
    onLastAddedIdChange(n.id);
  }, [nodes, onChange, onLastAddedIdChange]);

  const addChildNode = useCallback(
    (parentId: string) => {
      const child = createEmptyNode();
      const next = updateNodeInTree(nodes, parentId, (parent) => {
        if (parent.children.length >= MAX_CHILDREN) return parent;
        return { ...parent, children: [...parent.children, child] };
      });
      onChange(next);
      onLastAddedIdChange(child.id);
    },
    [nodes, onChange, onLastAddedIdChange]
  );

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">1. Deine Struktur</h2>
        <p className="text-xs text-muted-foreground">
          Teile den Markt in 2–4 MECE-Äste auf. Unteräste für Detailierung. Zahlen kommen im nächsten Schritt.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <div className="flex flex-wrap items-start justify-center gap-x-4 gap-y-6">
          {nodes.map((node, i) => (
            <TreeBranch
              key={node.id}
              node={node}
              colorClass={NODE_COLORS[i % NODE_COLORS.length]}
              depth={1}
              disabled={disabled}
              lastAddedId={lastAddedId}
              onUpdate={updateNode}
              onRemove={removeNode}
              onAddChild={addChildNode}
            />
          ))}
          {nodes.length < MAX_TOP_LEVEL && (
            <button
              type="button"
              onClick={addNode}
              disabled={disabled}
              className="flex h-[80px] min-w-[80px] flex-col items-center justify-center gap-1 self-start rounded-lg border-2 border-dashed border-border text-muted-foreground/50 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-30"
            >
              <Plus className="h-5 w-5" />
              <span className="text-[10px]">Ast</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StructureStep;
