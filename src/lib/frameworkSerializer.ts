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
