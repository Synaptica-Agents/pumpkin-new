import type { CaseMathCategory } from "@/types/caseMath";

export const FORMULAS_BY_CATEGORY: Record<CaseMathCategory, string[]> = {
  profitability: [
    "Gewinn = Umsatz − Kosten",
    "Marge = Gewinn ÷ Umsatz × 100",
    "Gewinn = Umsatz × Marge",
  ],
  investment: [
    "ROI = (Rückfluss − Investition) ÷ Investition × 100",
    "CAC = Marketing-Budget ÷ Neukunden",
  ],
  breakeven: [
    "Break-even (Zeit) = Investition ÷ Rückfluss pro Periode",
    "Break-even (Menge) = Fixkosten ÷ Deckungsbeitrag pro Stück",
  ],
};

export const CATEGORY_LABELS: Record<CaseMathCategory, string> = {
  profitability: "Profitabilität",
  investment: "Investment / ROI",
  breakeven: "Break-even",
};
