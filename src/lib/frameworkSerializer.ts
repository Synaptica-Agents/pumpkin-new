import { FrameworkNode, FrameworkBulletPoint, FrameworkBuilderState } from "@/types/frameworkBuilder";

export function createEmptyBullet(): FrameworkBulletPoint {
  return { id: crypto.randomUUID(), text: "" };
}

export function createEmptyNode(): FrameworkNode {
  return {
    id: crypto.randomUUID(),
    title: "",
    bulletPoints: [createEmptyBullet()],
    children: [],
    isPriority: false,
  };
}

export function updateNodeInTree(
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

export function removeNodeFromTree(nodes: FrameworkNode[], targetId: string): FrameworkNode[] {
  return nodes
    .filter((n) => n.id !== targetId)
    .map((n) =>
      n.children.length > 0 ? { ...n, children: removeNodeFromTree(n.children, targetId) } : n
    );
}

function serializeNode(node: FrameworkNode, path: string, depth: number): string {
  const indent = "  ".repeat(depth);
  const label = depth === 0 ? "Ast" : "Unterast";
  const nodeTitle = node.title.trim() || "(kein Titel)";
  const priorityMark = depth === 0 && node.isPriority ? "⭐ " : "";
  let result = `${indent}[${label} ${path}] ${priorityMark}${nodeTitle}\n`;

  const bullets = node.bulletPoints.filter((bp) => bp.text.trim());
  bullets.forEach((bp) => {
    result += `${indent}  - ${bp.text.trim()}\n`;
  });

  node.children.forEach((child, j) => {
    result += serializeNode(child, `${path}.${j + 1}`, depth + 1);
  });

  return result;
}

export function serializeFramework(state: FrameworkBuilderState): string {
  let result = "";

  state.nodes.forEach((node, i) => {
    result += serializeNode(node, String(i + 1), 0);
    result += "\n";
  });

  return result.trim();
}

export function isFrameworkValid(state: FrameworkBuilderState): boolean {
  return state.nodes.some((n) => n.title.trim().length > 0);
}
