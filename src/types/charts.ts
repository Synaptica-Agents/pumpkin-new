/**
 * Typen für den Diagramme-Drill (drillType "charts").
 * Ein Case zeigt 1–2 Exhibits (Tabelle oder Diagramm) im Case-Interview-Stil,
 * dazu optional "Additional Info"-Bullets und 1–2 Fragen mit Musterlösung.
 */

export interface ExhibitTableRow {
  label: string;
  /** Zellwerte in Spaltenreihenfolge (ohne Label-Spalte). Strings erlaubt für z.B. "0,5" mit Einheit. */
  values: (number | string)[];
  /** 'bold' = hervorgehobene Zeile, 'total' = Summenzeile (Rahmen oben + fett) */
  style?: "bold" | "total";
  /** Einrückungsebene für Hierarchien (0 = top-level) */
  indent?: 0 | 1 | 2;
}

export interface ExhibitTableSpec {
  type: "table";
  title: string;
  /** z.B. "Alle Zahlen in Mio. €" — klein über der Tabelle */
  unit_note?: string | null;
  /** Spaltenköpfe OHNE die führende Label-Spalte */
  columns: string[];
  rows: ExhibitTableRow[];
  footnote?: string | null;
}

export interface ExhibitDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface ExhibitChartSpec {
  type: "bar" | "stacked_bar" | "line" | "pie";
  title: string;
  /** Einheit für Achse/Labels, z.B. "Mio. €", "%" */
  unit?: string | null;
  labels: string[];
  datasets: ExhibitDataset[];
  footnote?: string | null;
}

export type ChartExhibit = ExhibitTableSpec | ExhibitChartSpec;

export interface ChartQuestion {
  /** Fragetext, z.B. "Wie hoch ist die operative Marge der Polish Company?" */
  text: string;
  /** Kurze korrekte Antwort, z.B. "27 % (23 von 85 Mio. €)" */
  solution: string;
  /** Rechenweg / Begründung für die Result-Ansicht */
  calc?: string | null;
}
