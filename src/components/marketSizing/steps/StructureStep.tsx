import React, { useCallback } from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { MathOp } from "@/types/marketSizing";
import { createEmptyNode, updateNodeInTree, removeNodeFromTree } from "@/lib/frameworkSerializer";
import FrameworkNodeCard from "@/components/frameworkBuilder/FrameworkNodeCard";
import { NodeColor } from "@/components/frameworkBuilder/nodeColors";
import {
  ChildrenConnector,
  ChildColumn,
  OpRow,
} from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import ZoomableTree from "@/components/frameworkBuilder/ZoomableTree";
import OpChip from "./OpChip";
import { Plus } from "lucide-react";

const MAX_TOP_LEVEL = 6;
const MAX_CHILDREN = 4;
const MAX_DEPTH = 4;

interface StructureStepProps {
  nodes: FrameworkNode[];
  onChange: (nodes: FrameworkNode[]) => void;
  operations: Record<string, MathOp>;
  onOperationsChange: (operations: Record<string, MathOp>) => void;
  lastAddedId: string | null;
  onLastAddedIdChange: (id: string | null) => void;
  disabled: boolean;
}

interface TreeBranchProps {
  node: FrameworkNode;
  color: NodeColor;
  depth: number;
  disabled: boolean;
  lastAddedId: string | null;
  operations: Record<string, MathOp>;
  onSetOp: (nodeId: string, op: MathOp) => void;
  onUpdate: (id: string, updated: FrameworkNode) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

const TreeBranch: React.FC<TreeBranchProps> = ({
  node,
  color,
  depth,
  disabled,
  lastAddedId,
  operations,
  onSetOp,
  onUpdate,
  onRemove,
  onAddChild,
}) => {
  const canAddChild = node.children.length < MAX_CHILDREN && depth < MAX_DEPTH;
  const hasChildren = node.children.length > 0;

  return (
    <div className="flex shrink-0 flex-row items-center">
      <div className="flex flex-col items-center">
        <FrameworkNodeCard
          node={node}
          color={color}
          onUpdate={(updated) => onUpdate(node.id, updated)}
          onRemove={() => onRemove(node.id)}
          disabled={disabled}
          autoFocusTitle={node.id === lastAddedId}
          collapsible={false}
          collapsed={false}
          childCount={node.children.length}
          onToggleCollapse={() => {}}
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
      </div>
      {hasChildren && (
        <ChildrenConnector childCount={node.children.length}>
          {node.children.map((child, i) => (
            <React.Fragment key={child.id}>
              {i > 0 && (
                <OpRow>
                  <OpChip
                    op={operations[child.id]}
                    onChange={disabled ? undefined : (o) => onSetOp(child.id, o)}
                    accent={color.accent}
                    disabled={disabled}
                  />
                </OpRow>
              )}
              <ChildColumn>
                <TreeBranch
                  node={child}
                  color={color}
                  depth={depth + 1}
                  disabled={disabled}
                  lastAddedId={lastAddedId}
                  operations={operations}
                  onSetOp={onSetOp}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                  onAddChild={onAddChild}
                />
              </ChildColumn>
            </React.Fragment>
          ))}
        </ChildrenConnector>
      )}
    </div>
  );
};

const StructureStep: React.FC<StructureStepProps> = ({
  nodes,
  onChange,
  operations,
  onOperationsChange,
  lastAddedId,
  onLastAddedIdChange,
  disabled,
}) => {
  const setOp = useCallback(
    (nodeId: string, op: MathOp) => {
      onOperationsChange({ ...operations, [nodeId]: op });
    },
    [operations, onOperationsChange]
  );

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
        <h2 className="text-sm font-semibold text-foreground">2. Deine Struktur</h2>
        <p className="text-xs text-muted-foreground">
          Bau deine Struktur als Boxen auf — meist ein paar Oberbereiche, darunter feinere Unteräste. Hier nur die Bereiche, noch keine Zahlen — die kommen im nächsten Schritt. Zwischen je zwei benachbarten Boxen wählst du eine Rechenoperation (×, +, −, ÷) — Symbol anklicken zum Ändern.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <ZoomableTree
          nodes={nodes}
          renderBranch={(node, color, i) => (
            <TreeBranch
              node={node}
              color={color}
              depth={1}
              disabled={disabled}
              lastAddedId={lastAddedId}
              operations={operations}
              onSetOp={setOp}
              onUpdate={updateNode}
              onRemove={removeNode}
              onAddChild={addChildNode}
            />
          )}
          renderTopOp={(linkId) => (
            <OpChip
              op={operations[linkId]}
              onChange={disabled ? undefined : (o) => setOp(linkId, o)}
              accent="text-foreground"
              disabled={disabled}
            />
          )}
          headerAddon={
            nodes.length < MAX_TOP_LEVEL ? (
              <button
                type="button"
                onClick={addNode}
                disabled={disabled}
                className="flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-3 py-2 text-xs text-muted-foreground/60 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
                <span>Oberast hinzufügen</span>
              </button>
            ) : undefined
          }
        />
      </div>
    </div>
  );
};

export default StructureStep;
