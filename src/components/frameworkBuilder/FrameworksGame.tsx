import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TextDrillCase } from "@/types/textDrill";
import { FrameworkNode } from "@/types/frameworkBuilder";
import {
  createEmptyNode,
  serializeFramework,
  isFrameworkValid,
  updateNodeInTree,
  removeNodeFromTree,
} from "@/lib/frameworkSerializer";
import FrameworkNodeCard from "@/components/frameworkBuilder/FrameworkNodeCard";
import { NodeColor } from "@/components/frameworkBuilder/nodeColors";
import {
  ChildrenConnector,
  ChildColumn,
} from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import ZoomableTree from "@/components/frameworkBuilder/ZoomableTree";
import { DrillButton } from "@/components/ui/drill-button";
import { X, Send, Info, Plus } from "lucide-react";

const MAX_TOP_LEVEL = 6;
const MAX_CHILDREN = 4;
const MAX_DEPTH = 4;
const MAX_PRIORITIES = 2;

interface FrameworksGameProps {
  currentCase: TextDrillCase | null;
  onSubmit: (answerText: string) => void;
  onEnd: () => void;
  isEvaluating: boolean;
  onOpenIntro?: () => void;
}

interface TreeBranchProps {
  node: FrameworkNode;
  color: NodeColor;
  depth: number;
  disabled: boolean;
  lastAddedId: string | null;
  canSetPriority: boolean;
  onTogglePriority: (nodeId: string) => void;
  onUpdate: (id: string, updated: FrameworkNode) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

/** Same tree building as the Market-Sizing structure step — just without
 *  the pairwise math operations. Top-level nodes carry the priority star. */
const TreeBranch: React.FC<TreeBranchProps> = ({
  node,
  color,
  depth,
  disabled,
  lastAddedId,
  canSetPriority,
  onTogglePriority,
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
          showPriorityToggle={depth === 1}
          canSetPriority={canSetPriority}
          onTogglePriority={() => onTogglePriority(node.id)}
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
          {node.children.map((child) => (
            <ChildColumn key={child.id}>
              <TreeBranch
                node={child}
                color={color}
                depth={depth + 1}
                disabled={disabled}
                lastAddedId={lastAddedId}
                canSetPriority={canSetPriority}
                onTogglePriority={onTogglePriority}
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

const FrameworksGame: React.FC<FrameworksGameProps> = ({
  currentCase,
  onSubmit,
  onEnd,
  isEvaluating,
  onOpenIntro,
}) => {
  const [nodes, setNodes] = useState<FrameworkNode[]>([createEmptyNode()]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (currentCase) {
      setNodes([createEmptyNode()]);
      setLastAddedId(null);
    }
  }, [currentCase?.id]);

  const priorityCount = useMemo(() => nodes.filter((n) => n.isPriority).length, [nodes]);

  const updateNode = useCallback((nodeId: string, updated: FrameworkNode) => {
    setNodes((prev) => updateNodeInTree(prev, nodeId, () => updated));
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes((prev) => {
      const result = removeNodeFromTree(prev, nodeId);
      return result.length === 0 ? [createEmptyNode()] : result;
    });
  }, []);

  const addNode = useCallback(() => {
    const n = createEmptyNode();
    setNodes((prev) => (prev.length >= MAX_TOP_LEVEL ? prev : [...prev, n]));
    setLastAddedId(n.id);
  }, []);

  const addChildNode = useCallback((parentId: string) => {
    const child = createEmptyNode();
    setNodes((prev) =>
      updateNodeInTree(prev, parentId, (parent) =>
        parent.children.length >= MAX_CHILDREN
          ? parent
          : { ...parent, children: [...parent.children, child] }
      )
    );
    setLastAddedId(child.id);
  }, []);

  // Priority stars live on top-level nodes only (max 2).
  const togglePriority = useCallback((nodeId: string) => {
    setNodes((prev) => {
      const target = prev.find((n) => n.id === nodeId);
      if (!target) return prev;
      if (!target.isPriority && prev.filter((n) => n.isPriority).length >= MAX_PRIORITIES) {
        return prev;
      }
      return prev.map((n) => (n.id === nodeId ? { ...n, isPriority: !n.isPriority } : n));
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isFrameworkValid({ nodes })) return;
    onSubmit(serializeFramework({ nodes }));
  }, [nodes, onSubmit]);

  if (!currentCase) return null;

  const canSubmit = isFrameworkValid({ nodes }) && !isEvaluating;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full items-center gap-3">
        <div className="flex-1">
          <span className="text-xs text-muted-foreground">Nimm dir die Zeit, die du brauchst.</span>
        </div>
        {onOpenIntro && (
          <button
            type="button"
            onClick={onOpenIntro}
            title="So funktioniert's"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Info className="h-4 w-4" />
          </button>
        )}
        <DrillButton
          variant="inactive"
          size="sm"
          onClick={onEnd}
          className="border border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
        >
          <X className="h-4 w-4 mr-1" /> Beenden
        </DrillButton>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-lg font-medium text-foreground leading-relaxed">{currentCase.prompt}</p>
        {currentCase.context_info && (
          <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{currentCase.context_info}</span>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Dein Framework</h2>
        <p className="text-xs text-muted-foreground">
          Bau deine Struktur als Boxen auf — meist ein paar Hauptäste, darunter feinere
          Unteräste. Klick auf einen Ast, um reinzuzoomen und ihn zu bearbeiten. Markiere
          mit dem Stern bis zu {MAX_PRIORITIES} Hauptäste als Top-Priorität.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <ZoomableTree
          nodes={nodes}
          renderBranch={(node, color) => (
            <TreeBranch
              node={node}
              color={color}
              depth={1}
              disabled={isEvaluating}
              lastAddedId={lastAddedId}
              canSetPriority={priorityCount < MAX_PRIORITIES}
              onTogglePriority={togglePriority}
              onUpdate={updateNode}
              onRemove={removeNode}
              onAddChild={addChildNode}
            />
          )}
          headerAddon={
            nodes.length < MAX_TOP_LEVEL ? (
              <button
                type="button"
                onClick={addNode}
                disabled={isEvaluating}
                className="flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-3 py-2 text-xs text-muted-foreground/60 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
                <span>Hauptast hinzufügen</span>
              </button>
            ) : undefined
          }
        />
      </div>

      <div className="flex justify-center pt-2">
        <DrillButton
          variant="active"
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="gap-2 px-8"
        >
          {isEvaluating ? (
            <>
              <span className="animate-spin">&#9203;</span> KI bewertet...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Abgeben &amp; Bewerten
            </>
          )}
        </DrillButton>
      </div>
    </div>
  );
};

export default FrameworksGame;
