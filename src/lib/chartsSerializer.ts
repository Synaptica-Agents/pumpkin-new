import { ChartExhibit, ChartQuestion, ExhibitChartSpec, ExhibitTableSpec } from "@/types/charts";
import { TextDrillCase } from "@/types/textDrill";

/**
 * Serialisierung für den Diagramme-Drill:
 * - Exhibits als Klartext für den KI-Grader (damit er alle Zahlen prüfen kann)
 * - User-Antwort (Interpretation + Fragen) als ein answer_text
 * - Case-Prompt und Referenzlösung für evaluate-drill
 */

const tableToText = (t: ExhibitTableSpec): string => {
  const lines: string[] = [];
  lines.push(`TABELLE: ${t.title}${t.unit_note ? ` (${t.unit_note})` : ""}`);
  lines.push(["", ...t.columns].join(" | "));
  for (const row of t.rows) {
    const indent = "  ".repeat(row.indent ?? 0);
    lines.push([indent + row.label, ...row.values.map(String)].join(" | "));
  }
  if (t.footnote) lines.push(`Fußnote: ${t.footnote}`);
  return lines.join("\n");
};

const chartToText = (c: ExhibitChartSpec): string => {
  const typeLabel =
    c.type === "line" ? "LINIENDIAGRAMM" :
    c.type === "pie" ? "KREISDIAGRAMM" :
    c.type === "stacked_bar" ? "GESTAPELTES BALKENDIAGRAMM" :
    "BALKENDIAGRAMM";
  const lines: string[] = [];
  lines.push(`${typeLabel}: ${c.title}${c.unit ? ` (Einheit: ${c.unit})` : ""}`);
  lines.push(["", ...c.labels].join(" | "));
  for (const ds of c.datasets) {
    lines.push([ds.label, ...ds.data.map(String)].join(" | "));
  }
  if (c.footnote) lines.push(`Fußnote: ${c.footnote}`);
  return lines.join("\n");
};

export const exhibitToText = (e: ChartExhibit): string =>
  e.type === "table" ? tableToText(e) : chartToText(e);

/** Exhibits + Additional Info als Klartext — geht als context_info an den Grader. */
export const exhibitsToText = (c: TextDrillCase): string => {
  const parts: string[] = [];
  (c.exhibits ?? []).forEach((e, i) => {
    parts.push(`--- EXHIBIT ${i + 1} ---\n${exhibitToText(e)}`);
  });
  if (c.additional_info && c.additional_info.length > 0) {
    parts.push(`--- ZUSATZINFORMATIONEN ---\n${c.additional_info.map((b) => `- ${b}`).join("\n")}`);
  }
  return parts.join("\n\n");
};

/** User-Antwort (Schritt 1 + Schritt 2) als ein Text — für Grader und Submission-Speicherung. */
export const serializeChartsAnswer = (
  interpretation: string,
  questions: ChartQuestion[],
  answers: string[]
): string => {
  const parts: string[] = [`=== INTERPRETATION & KEY INSIGHTS ===\n${interpretation.trim()}`];
  questions.forEach((q, i) => {
    parts.push(`=== FRAGE ${i + 1}: ${q.text} ===\nANTWORT: ${(answers[i] ?? "").trim() || "(keine Antwort)"}`);
  });
  return parts.join("\n\n");
};

/** Aufgabenstellung für den Grader: Titel, Kontext und die gestellten Fragen. */
export const buildChartsCasePrompt = (c: TextDrillCase): string => {
  const parts: string[] = [];
  if (c.title) parts.push(c.title);
  parts.push(c.prompt);
  const qs = c.questions ?? [];
  if (qs.length > 0) {
    parts.push(
      "Der Kandidat sollte zuerst das Exhibit interpretieren (Zusammenfassung + Key Insights) und danach folgende Fragen beantworten:\n" +
        qs.map((q, i) => `Frage ${i + 1}: ${q.text}`).join("\n")
    );
  }
  return parts.join("\n\n");
};

/** Referenzlösung für den Grader: Muster-Interpretation + korrekte Antworten mit Rechenweg. */
export const buildChartsReferenceSolution = (c: TextDrillCase): string => {
  const parts: string[] = [];
  if (c.reference_solution) {
    parts.push(`MUSTER-INTERPRETATION:\n${c.reference_solution}`);
  }
  const qs = c.questions ?? [];
  if (qs.length > 0) {
    parts.push(
      "KORREKTE ANTWORTEN:\n" +
        qs
          .map((q, i) => `Frage ${i + 1}: ${q.solution}${q.calc ? ` — Rechenweg: ${q.calc}` : ""}`)
          .join("\n")
    );
  }
  return parts.join("\n\n");
};
