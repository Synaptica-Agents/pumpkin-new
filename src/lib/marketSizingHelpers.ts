import { FrameworkNode } from "@/types/frameworkBuilder";
import {
  BoxInput,
  BoxKind,
  MathOp,
  MarketSizingUnderstanding,
  SanityCheckStructured,
} from "@/types/marketSizing";

export interface MarketSizingLeaf {
  /** Leaf node id, used as key for assumptions/numbers maps */
  id: string;
  /** Own title */
  title: string;
  /** Chain of ancestor titles + own title, joined for display — "Bevölkerung › Erwachsene" */
  labelChain: string;
  /** Path like "1", "1.2", "2.3.1" for evaluator output */
  path: string;
}

/**
 * Walk a FrameworkNode tree in depth-first order and return every leaf
 * (node with no children). The order matches the chronological order the
 * user sees in the tree.
 */
export function getLeaves(nodes: FrameworkNode[]): MarketSizingLeaf[] {
  const out: MarketSizingLeaf[] = [];
  const walk = (arr: FrameworkNode[], parentPath: string, parentTitles: string[]) => {
    arr.forEach((node, i) => {
      const idx = i + 1;
      const path = parentPath ? `${parentPath}.${idx}` : `${idx}`;
      const title = node.title.trim() || "(ohne Titel)";
      const chain = [...parentTitles, title];
      if (node.children.length === 0) {
        out.push({
          id: node.id,
          title,
          labelChain: chain.join(" › "),
          path,
        });
      } else {
        walk(node.children, path, chain);
      }
    });
  };
  walk(nodes, "", []);
  return out;
}

/**
 * Walk a FrameworkNode tree in depth-first order and return EVERY node
 * (parents and leaves), each with its display label chain and path.
 */
export function getAllNodes(nodes: FrameworkNode[]): MarketSizingLeaf[] {
  const out: MarketSizingLeaf[] = [];
  const walk = (arr: FrameworkNode[], parentPath: string, parentTitles: string[]) => {
    arr.forEach((node, i) => {
      const idx = i + 1;
      const path = parentPath ? `${parentPath}.${idx}` : `${idx}`;
      const title = node.title.trim() || "(ohne Titel)";
      const chain = [...parentTitles, title];
      out.push({ id: node.id, title, labelChain: chain.join(" › "), path });
      if (node.children.length > 0) walk(node.children, path, chain);
    });
  };
  walk(nodes, "", []);
  return out;
}

/**
 * Operations model: each entry in `operations` is keyed by a node id and holds
 * the math operation that links that node to its PREVIOUS sibling. The first
 * node in any sibling group — top-level Oberäste included — has no entry. So a
 * group of N boxes is joined by N−1 pairwise operations, evaluated left-to-right.
 *
 * Return every node that needs such an operation: every node that is not the
 * first in its sibling group (i.e. has a sibling before it), at every level.
 */
export function getNodesNeedingOp(nodes: FrameworkNode[]): FrameworkNode[] {
  const out: FrameworkNode[] = [];
  const walk = (siblings: FrameworkNode[]) => {
    siblings.forEach((node, i) => {
      if (i >= 1) out.push(node);
      if (node.children.length > 0) walk(node.children);
    });
  };
  walk(nodes);
  return out;
}

/** The selectable math operations, in display order. */
export const MATH_OPS: MathOp[] = ["×", "+", "−", "÷"];

/** Find a node anywhere in the tree by id (depth-first), or null. */
export function findNodeById(nodes: FrameworkNode[], id: string): FrameworkNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children.length > 0) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** Default kind for a freshly-touched leaf box. */
export const DEFAULT_BOX_KIND: BoxKind = "annahme";

/** German label for a box kind. */
export function boxKindLabel(kind: BoxKind): string {
  return kind === "fakt" ? "Fakt" : kind === "rechnung" ? "Rechnung" : "Annahme";
}

/**
 * Whether a leaf box is fully filled, depending on its kind:
 *  - annahme:  number + justification required
 *  - fakt:     number only
 *  - rechnung: number (result) + formula text required
 */
export function isLeafComplete(input?: BoxInput): boolean {
  if (!input) return false;
  const hasValue = input.value.trim().length > 0;
  const hasText = input.assumption.trim().length > 0;
  const kind = input.kind ?? DEFAULT_BOX_KIND;
  if (kind === "fakt") return hasValue;
  return hasValue && hasText; // annahme + rechnung both need text
}

/**
 * Build the market-sizing structure text including the math operation between
 * each parent's children and the kind of each leaf box. Unlike the generic
 * serializeFramework, this is aware of operations + box kinds.
 */
export function serializeMarketSizingTree(
  nodes: FrameworkNode[],
  operations: Record<string, MathOp>,
  boxInputs: Record<string, BoxInput>,
  values?: Record<string, number | null>
): string {
  const walk = (arr: FrameworkNode[], parentPath: string, depth: number): string => {
    let res = "";
    arr.forEach((node, i) => {
      const idx = i + 1;
      const path = parentPath ? `${parentPath}.${idx}` : `${idx}`;
      const indent = "  ".repeat(depth);
      const label = depth === 0 ? "Ast" : "Unterast";
      const title = node.title.trim() || "(kein Titel)";
      // Operation linking this box to its previous sibling (none for the first).
      const opPrefix = i >= 1 ? `${operations[node.id] ?? "(keine Operation)"} ` : "";
      res += `${indent}${opPrefix}[${label} ${path}] ${title}`;
      const computed = values?.[node.id];
      if (computed != null && isFinite(computed)) res += ` ⇒ ${formatGermanNumber(computed)}`;
      if (node.children.length === 0) {
        const kind = boxInputs[node.id]?.kind ?? DEFAULT_BOX_KIND;
        res += ` [${boxKindLabel(kind)}]`;
      }
      res += "\n";
      if (node.children.length > 0) res += walk(node.children, path, depth + 1);
    });
    return res;
  };
  return walk(nodes, "", 0).trimEnd();
}

/**
 * Parse German-style user input. Accepts:
 *   "83000000", "83.000.000", "0,75", "75%", "83 Mio", "1,5 Mrd", "2"
 * Returns null on unparseable input or empty string.
 */
export function parseGermanNumber(input: string): number | null {
  if (!input) return null;
  let text = input.trim().toLowerCase();
  if (!text) return null;

  // Percentages
  if (text.endsWith("%")) {
    const n = parseNumeric(text.slice(0, -1).trim());
    return n == null ? null : n / 100;
  }

  // Unit suffixes (longest first so "mrd" wins over "m")
  const suffixes: Array<[RegExp, number]> = [
    [/\s*(mrd|milliarden|bn|billions?)$/i, 1e9],
    [/\s*(mio|millionen|m|millions?)$/i, 1e6],
    [/\s*(tsd|tausend|k|thousand)$/i, 1e3],
  ];
  let multiplier = 1;
  for (const [re, mult] of suffixes) {
    if (re.test(text)) {
      multiplier = mult;
      text = text.replace(re, "").trim();
      break;
    }
  }

  const n = parseNumeric(text);
  return n == null ? null : n * multiplier;
}

function parseNumeric(text: string): number | null {
  if (!text) return null;
  let t = text;
  // If both "." and "," present, assume German: "." = thousands, "," = decimal
  if (t.includes(",") && t.includes(".")) {
    t = t.replace(/\./g, "").replace(",", ".");
  } else if (t.includes(",")) {
    // Only comma → decimal
    t = t.replace(",", ".");
  }
  // else only dots or neither → parseFloat handles ("." treated as decimal)
  const n = parseFloat(t);
  return isNaN(n) ? null : n;
}

/**
 * Format a number in German locale with reasonable precision.
 * 83000000 → "83.000.000", 74700000 → "74.700.000", 0.75 → "0,75".
 */
export function formatGermanNumber(n: number, maxFrac = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("de-DE", { maximumFractionDigits: maxFrac });
}

/**
 * Short form for big numbers: 74700000 → "~75 Mio", 1500000000 → "~1,5 Mrd".
 */
export function shortFormat(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return `~${formatGermanNumber(n / 1e9, 2)} Mrd`;
  if (abs >= 1e6) return `~${formatGermanNumber(n / 1e6, 1)} Mio`;
  if (abs >= 1e3) return `~${formatGermanNumber(n / 1e3, 0)} Tsd`;
  return formatGermanNumber(n, 2);
}

/**
 * Compact display for the per-box value badge in Step 3.
 * - Percentages stay as typed ("20%" → "20 %").
 * - Parseable numbers ≥ 10.000 are abbreviated ("10000000" → "10 Mio").
 * - Everything else (small numbers, fractions like "1/3") shows the raw text.
 */
export function formatBoxValue(raw: string): string {
  const text = (raw ?? "").trim();
  if (!text) return "";
  if (text.endsWith("%")) {
    const n = parseGermanNumber(text);
    return n != null ? `${formatGermanNumber(n * 100)} %` : text;
  }
  const n = parseGermanNumber(text);
  if (n != null && Math.abs(n) >= 10000) {
    return shortFormat(n).replace(/^~/, "");
  }
  return text;
}

/** Apply a single math operation to two operands. */
function applyOp(a: number, b: number, op: MathOp): number {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "÷":
      return b === 0 ? NaN : a / b;
    case "×":
    default:
      return a * b;
  }
}

/**
 * Combine a sibling group left-to-right using the pairwise operations: each
 * sibling after the first carries operations[sibling.id] linking it to the
 * running result. Returns null if any operand is missing or a required
 * operation is unset (order matters for − and ÷).
 */
function combineSiblings(
  siblings: FrameworkNode[],
  getVal: (n: FrameworkNode) => number | null,
  operations: Record<string, MathOp>
): number | null {
  if (siblings.length === 0) return null;
  let acc = getVal(siblings[0]);
  if (acc == null) return null;
  for (let i = 1; i < siblings.length; i++) {
    const v = getVal(siblings[i]);
    if (v == null) return null;
    const op = operations[siblings[i].id];
    if (op == null) return null;
    acc = applyOp(acc, v, op);
  }
  return acc;
}

export interface RollupResult {
  /** Computed value per node id: leaves = parsed input, parents = derived. */
  values: Record<string, number | null>;
  /** Final combined value of all top-level branches (the market size). */
  total: number | null;
}

/**
 * Roll the whole tree up into numbers. Leaf values come from the user's typed
 * box inputs; each parent is derived by combining its children pairwise; the
 * top-level branches are combined the same way. Any node is null when an input
 * below it is missing/unparseable or a required operation is still unset.
 */
export function computeRollup(
  nodes: FrameworkNode[],
  operations: Record<string, MathOp>,
  boxInputs: Record<string, BoxInput>
): RollupResult {
  const values: Record<string, number | null> = {};
  const visit = (node: FrameworkNode): number | null => {
    let v: number | null;
    if (node.children.length === 0) {
      v = parseGermanNumber(boxInputs[node.id]?.value ?? "");
    } else {
      node.children.forEach(visit); // populate every child value first (no short-circuit)
      v = combineSiblings(node.children, (c) => values[c.id], operations);
    }
    values[node.id] = v;
    return v;
  };
  nodes.forEach(visit);
  const total = combineSiblings(nodes, (n) => values[n.id], operations);
  return { values, total };
}

/** Format a computed (numeric) node value for a compact badge, "" when empty. */
export function formatComputedBadge(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "";
  if (Math.abs(n) >= 10000) return shortFormat(n).replace(/^~/, "");
  return formatGermanNumber(n);
}

export interface SerializedMarketSizing {
  /** The full combined answer text sent to the evaluator. */
  answerText: string;
  /** Parsed final estimate value (for storage). */
  finalEstimateValue: number | null;
  /** Final estimate unit (for storage + display). */
  finalEstimateUnit: string;
}

/**
 * Turn the structured Market-Sizing answer into the flat text format the
 * evaluator expects. Sections are omitted when empty (except STRUKTUR,
 * which is always present).
 */
export function serializeMarketSizing(args: {
  understanding: MarketSizingUnderstanding;
  nodes: FrameworkNode[];
  operations: Record<string, MathOp>;
  /** Leaf boxes only — parents are derived ("Rechnung") and carry no assumption. */
  leaves: MarketSizingLeaf[];
  boxInputs: Record<string, BoxInput>;
  finalEstimateInput: string;
  finalEstimateUnit: string;
  sanityCheck: SanityCheckStructured;
}): SerializedMarketSizing {
  const {
    understanding,
    nodes,
    operations,
    leaves,
    boxInputs,
    finalEstimateInput,
    finalEstimateUnit,
    sanityCheck,
  } = args;

  const { values, total } = computeRollup(nodes, operations, boxInputs);
  const treeText = serializeMarketSizingTree(nodes, operations, boxInputs, values);

  // VERSTÄNDNIS section (clarifications)
  let out = "";
  const clarLines = understanding.clarifications
    .map((c) => {
      const q = c.question.trim();
      const a = c.answer.trim();
      if (!q && !a) return null;
      return `- Frage: ${q || "(ohne Frage)"}\n  Annahme: ${a || "(keine Annahme)"}`;
    })
    .filter(Boolean);
  if (clarLines.length > 0) {
    out += `VERSTÄNDNIS:\n${clarLines.join("\n")}\n\n`;
  }

  out += `STRUKTUR:\n${treeText}`;

  const assumptionLines = leaves
    .map((b) => {
      const input = boxInputs[b.id];
      const value = (input?.value ?? "").trim();
      const text = (input?.assumption ?? "").trim();
      if (!value && !text) return null;
      const kind = input?.kind ?? DEFAULT_BOX_KIND;
      const valuePart = value ? `${value}` : "(keine Zahl)";
      let detail = "";
      if (kind === "fakt") detail = " (Fakt)";
      else if (kind === "rechnung") detail = text ? ` (Rechnung: ${text})` : " (Rechnung)";
      else detail = text ? ` — ${text}` : ""; // annahme
      return `- [${b.path}] ${b.labelChain}: ${valuePart}${detail}`;
    })
    .filter(Boolean);
  if (assumptionLines.length > 0) {
    out += `\n\nANNAHMEN & ZAHLEN (nur unterste Boxen; Eltern-Boxen sind Rechnungen aus ihren Kindern):\n${assumptionLines.join("\n")}`;
  }

  // Computed roll-up: parents derived from children, top branches combined.
  if (total != null && isFinite(total)) {
    out += `\n\nBERECHNETES ERGEBNIS (aus der Struktur hochgerechnet): ${formatGermanNumber(total)}${
      finalEstimateUnit ? " " + finalEstimateUnit : ""
    }`;
  }

  // Final estimate: the user's committed number (auto-filled from the roll-up).
  const finalParsed = parseGermanNumber(finalEstimateInput);
  const finalValue = finalParsed;
  const finalDisplay = finalParsed != null ? finalEstimateInput.trim() : "—";

  out += `\n\nFINALE SCHÄTZUNG: ${finalDisplay}${finalEstimateUnit ? " " + finalEstimateUnit : ""}`;

  // SANITY CHECK section (structured)
  const sanityLines: string[] = [];
  if (sanityCheck.magnitudeCheck.trim()) {
    sanityLines.push(`Größenordnung: ${sanityCheck.magnitudeCheck.trim()}`);
  }
  if (sanityLines.length > 0) {
    out += `\n\nSANITY CHECK:\n${sanityLines.join("\n")}`;
  }

  return {
    answerText: out,
    finalEstimateValue: finalValue,
    finalEstimateUnit: finalEstimateUnit.trim(),
  };
}
