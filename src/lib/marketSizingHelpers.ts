import { FrameworkNode } from "@/types/frameworkBuilder";
import {
  MarketSizingMethod,
  MarketSizingUnderstanding,
  SanityCheckStructured,
} from "@/types/marketSizing";

const METHOD_LABELS: Record<MarketSizingMethod, string> = {
  top_down: "Top-Down",
  bottom_up: "Bottom-Up",
  mixed: "Mixed (Top-Down + Bottom-Up)",
};

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

export interface ProductResult {
  /** Running product of all entered leaf numbers. 1 when no valid inputs. */
  value: number;
  /** Number of leaves that successfully parsed. */
  parsedCount: number;
  /** Total leaf count. */
  totalCount: number;
}

/**
 * Compute the product of all parsed leaf numbers. Unparsed or empty leaves
 * are skipped (not treated as 0, which would zero out the product).
 */
export function computeProduct(
  leaves: MarketSizingLeaf[],
  numbers: Record<string, string>
): ProductResult {
  let product = 1;
  let parsed = 0;
  for (const l of leaves) {
    const n = parseGermanNumber(numbers[l.id] ?? "");
    if (n != null) {
      product *= n;
      parsed++;
    }
  }
  return { value: parsed > 0 ? product : 0, parsedCount: parsed, totalCount: leaves.length };
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
  treeText: string;
  leaves: MarketSizingLeaf[];
  assumptions: Record<string, string>;
  finalEstimateInput: string;
  finalEstimateUnit: string;
  sanityCheck: SanityCheckStructured;
}): SerializedMarketSizing {
  const {
    understanding,
    treeText,
    leaves,
    assumptions,
    finalEstimateInput,
    finalEstimateUnit,
    sanityCheck,
  } = args;

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

  // METHODE section
  if (understanding.method) {
    out += `METHODE: ${METHOD_LABELS[understanding.method]}`;
    if (understanding.methodReason.trim()) {
      out += `\nBegründung: ${understanding.methodReason.trim()}`;
    }
    out += `\n\n`;
  }

  out += `STRUKTUR:\n${treeText}`;

  const assumptionLines = leaves
    .map((l) => {
      const a = (assumptions[l.id] ?? "").trim();
      return a ? `- [${l.path}] ${l.labelChain}: ${a}` : null;
    })
    .filter(Boolean);
  if (assumptionLines.length > 0) {
    out += `\n\nANNAHMEN:\n${assumptionLines.join("\n")}`;
  }

  // Final estimate: solely from user input (no calculation step in flow)
  const finalParsed = parseGermanNumber(finalEstimateInput);
  const finalValue = finalParsed;
  const finalDisplay = finalParsed != null ? finalEstimateInput.trim() : "—";

  out += `\n\nFINALE SCHÄTZUNG: ${finalDisplay}${finalEstimateUnit ? " " + finalEstimateUnit : ""}`;

  // SANITY CHECK section (structured)
  const sanityLines: string[] = [];
  if (sanityCheck.magnitudeCheck.trim()) {
    sanityLines.push(`Größenordnung: ${sanityCheck.magnitudeCheck.trim()}`);
  }
  const ref = sanityCheck.comparisonRef.trim();
  const refVal = sanityCheck.comparisonValue.trim();
  if (ref || refVal) {
    const parts: string[] = [];
    if (refVal) {
      const parsed = parseGermanNumber(refVal);
      parts.push(parsed != null ? `${formatGermanNumber(parsed)} (${refVal})` : refVal);
    }
    if (ref) parts.push(`Quelle: ${ref}`);
    sanityLines.push(`Vergleich: ${parts.join(" — ")}`);
  }
  if (sanityCheck.reasoning.trim()) {
    sanityLines.push(`Begründung: ${sanityCheck.reasoning.trim()}`);
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
