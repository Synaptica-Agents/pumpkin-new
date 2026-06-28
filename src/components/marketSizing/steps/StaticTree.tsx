import React from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { BoxInput, MathOp } from "@/types/marketSizing";
import { NodeColor } from "@/components/frameworkBuilder/nodeColors";
import {
  ChildrenConnector,
  ChildColumn,
} from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import {
  formatBoxValue,
  formatComputedBadge,
  isLeafComplete,
  DEFAULT_BOX_KIND,
} from "@/lib/marketSizingHelpers";
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
  /** Computed value per node id (parents derived). Enables parent value badges. */
  values?: Record<string, number | null>;
  /** Allow selecting parent boxes (to inspect their Rechnung). */
  selectableParents?: boolean;
}

interface BranchProps {
  node: FrameworkNode;
  color: NodeColor;
  boxInputs: Record<string, BoxInput>;
  operations: Record<string, MathOp>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showIncomplete: boolean;
  values?: Record<string, number | null>;
  selectableParents: boolean;
}

const Branch: React.FC<BranchProps> = ({
  node,
  color,
  boxInputs,
  operations,
  selectedId,
  onSelect,
  showIncomplete,
  values,
  selectableParents,
}) => {
  const isParent = node.children.length > 0;
  const input = boxInputs[node.id];
  return (
    <div className="flex shrink-0 flex-row items-center">
      <StaticNodeCard
        node={node}
        color={color}
        isParent={isParent}
        selectable={isParent ? selectableParents : true}
        kind={isParent ? undefined : input?.kind ?? DEFAULT_BOX_KIND}
        selected={selectedId === node.id}
        incomplete={!isParent && showIncomplete && !isLeafComplete(input)}
        valueBadge={
          isParent ? formatComputedBadge(values?.[node.id]) : formatBoxValue(input?.value ?? "")
        }
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
                values={values}
                selectableParents={selectableParents}
              />
            </ChildColumn>
          ))}
        </ChildrenConnector>
      )}
    </div>
  );
};

/** Read-only, selectable issue tree used in Step 3 (edit assumptions) and
 *  Step 4 (recap). Leaf boxes are always selectable; parent boxes are derived
 *  "Rechnungen" and selectable when `selectableParents` is set (to inspect the
 *  computed value). */
const StaticTree: React.FC<StaticTreeProps> = ({
  nodes,
  boxInputs,
  operations,
  selectedId,
  onSelect,
  showIncomplete = true,
  values,
  selectableParents = false,
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
        values={values}
        selectableParents={selectableParents}
      />
    )}
  />
);

export default StaticTree;
