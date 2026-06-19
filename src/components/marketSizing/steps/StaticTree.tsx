import React from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { BoxInput, MathOp } from "@/types/marketSizing";
import { NodeColor } from "@/components/frameworkBuilder/nodeColors";
import {
  ChildrenConnector,
  ChildColumn,
} from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import { formatBoxValue, isLeafComplete, DEFAULT_BOX_KIND } from "@/lib/marketSizingHelpers";
import ZoomableTree from "@/components/frameworkBuilder/ZoomableTree";
import StaticNodeCard from "./StaticNodeCard";

interface StaticTreeProps {
  nodes: FrameworkNode[];
  boxInputs: Record<string, BoxInput>;
  operations: Record<string, MathOp>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** When false, never show the red "!" indicator (e.g. read-only recap). */
  showIncomplete?: boolean;
}

interface BranchProps {
  node: FrameworkNode;
  color: NodeColor;
  boxInputs: Record<string, BoxInput>;
  operations: Record<string, MathOp>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showIncomplete: boolean;
}

const Branch: React.FC<BranchProps> = ({
  node,
  color,
  boxInputs,
  operations,
  selectedId,
  onSelect,
  showIncomplete,
}) => {
  const isParent = node.children.length > 0;
  const input = boxInputs[node.id];
  return (
    <div className="flex shrink-0 flex-col items-center">
      <StaticNodeCard
        node={node}
        color={color}
        isParent={isParent}
        kind={isParent ? undefined : input?.kind ?? DEFAULT_BOX_KIND}
        selected={selectedId === node.id}
        incomplete={!isParent && showIncomplete && !isLeafComplete(input)}
        valueBadge={isParent ? "" : formatBoxValue(input?.value ?? "")}
        onSelect={() => onSelect(node.id)}
      />
      {isParent && (
        <ChildrenConnector
          childCount={node.children.length}
          op={node.children.length >= 2 ? operations[node.id] : undefined}
          accent={color.accent}
        >
          {node.children.map((child) => (
            <ChildColumn key={child.id}>
              <Branch
                node={child}
                color={color}
                boxInputs={boxInputs}
                operations={operations}
                selectedId={selectedId}
                onSelect={onSelect}
                showIncomplete={showIncomplete}
              />
            </ChildColumn>
          ))}
        </ChildrenConnector>
      )}
    </div>
  );
};

/** Read-only, selectable issue tree used in Step 3 (edit assumptions) and
 *  Step 4 (recap). Only leaf boxes are selectable; parents are "Rechnung". */
const StaticTree: React.FC<StaticTreeProps> = ({
  nodes,
  boxInputs,
  operations,
  selectedId,
  onSelect,
  showIncomplete = true,
}) => (
  <ZoomableTree
    nodes={nodes}
    renderBranch={(node, color) => (
      <Branch
        node={node}
        color={color}
        boxInputs={boxInputs}
        operations={operations}
        selectedId={selectedId}
        onSelect={onSelect}
        showIncomplete={showIncomplete}
      />
    )}
  />
);

export default StaticTree;
