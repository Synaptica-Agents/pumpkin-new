import React from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { BoxInput } from "@/types/marketSizing";
import { NodeColor, NODE_COLORS } from "@/components/frameworkBuilder/nodeColors";
import {
  ChildrenConnector,
  ChildColumn,
} from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import { formatBoxValue } from "@/lib/marketSizingHelpers";
import StaticNodeCard from "./StaticNodeCard";

export const isBoxComplete = (input?: BoxInput) =>
  !!input && input.assumption.trim().length > 0 && input.value.trim().length > 0;

interface StaticTreeProps {
  nodes: FrameworkNode[];
  boxInputs: Record<string, BoxInput>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** When false, never show the red "!" indicator (e.g. read-only recap). */
  showIncomplete?: boolean;
}

interface BranchProps {
  node: FrameworkNode;
  color: NodeColor;
  boxInputs: Record<string, BoxInput>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showIncomplete: boolean;
}

const Branch: React.FC<BranchProps> = ({
  node,
  color,
  boxInputs,
  selectedId,
  onSelect,
  showIncomplete,
}) => {
  const input = boxInputs[node.id];
  return (
    <div className="flex shrink-0 flex-col items-center">
      <StaticNodeCard
        node={node}
        color={color}
        selected={selectedId === node.id}
        incomplete={showIncomplete && !isBoxComplete(input)}
        valueBadge={formatBoxValue(input?.value ?? "")}
        onSelect={() => onSelect(node.id)}
      />
      {node.children.length > 0 && (
        <ChildrenConnector childCount={node.children.length}>
          {node.children.map((child) => (
            <ChildColumn key={child.id}>
              <Branch
                node={child}
                color={color}
                boxInputs={boxInputs}
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
 *  Step 4 (recap). Same visuals as the editable tree, but no editing. */
const StaticTree: React.FC<StaticTreeProps> = ({
  nodes,
  boxInputs,
  selectedId,
  onSelect,
  showIncomplete = true,
}) => (
  <div className="overflow-x-auto pb-2">
    <div className="flex w-max min-w-full items-start justify-center gap-x-4 gap-y-6 px-1">
      {nodes.map((node, i) => (
        <Branch
          key={node.id}
          node={node}
          color={NODE_COLORS[i % NODE_COLORS.length]}
          boxInputs={boxInputs}
          selectedId={selectedId}
          onSelect={onSelect}
          showIncomplete={showIncomplete}
        />
      ))}
    </div>
  </div>
);

export default StaticTree;
