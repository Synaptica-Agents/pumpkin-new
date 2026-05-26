import { CaseMathTask, CaseMathCategory } from "@/types/caseMath";

/**
 * Procedural generator for Case Math drill tasks.
 * Generates unlimited unique business-scenario math problems
 * with guaranteed correct answers.
 *
 * Generic per-category formulas live in `caseMathFormulas.ts` and are
 * looked up by the UI at display time, not produced per-template.
 */

let taskCounter = 40000;
const sessionHistory = new Set<string>();

const choice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const fmt = (n: number): string => {
  if (Math.abs(n) >= 1_000_000_000) {
    const v = n / 1_000_000_000;
    return `${v % 1 === 0 ? v : v.toFixed(1).replace(".", ",")} Mrd`;
  }
  if (Math.abs(n) >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v : v.toFixed(1).replace(".", ",")} Mio`;
  }
  if (Math.abs(n) >= 10_000) {
    const v = n / 1_000;
    return `${v % 1 === 0 ? v : v.toFixed(1).replace(".", ",")}k`;
  }
  return n.toLocaleString("de-DE");
};

const fmtEur = (n: number): string => `${fmt(n)} €`;
const fmtPct = (n: number): string => `${n}%`;

/**
 * Pre-rounds a number to the precision fmt() will display it at:
 * - >= 1 Mio: 100k granularity (since fmt prints 1 decimal in Mio range)
 * - >= 10k:    100  granularity
 * - else:      integer
 * Use this BEFORE fmtEur() when the answer is derived from the displayed value,
 * so users computing from the visible numbers get the same result the drill expects.
 */
const displayRound = (n: number): number => {
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return sign * Math.round(abs / 100_000) * 100_000;
  if (abs >= 10_000) return sign * Math.round(abs / 100) * 100;
  return Math.round(n);
};

// ============================================
// INDUSTRIES & CONTEXTS
// ============================================
const industries = [
  "Onlineshop", "SaaS-Unternehmen", "Restaurant-Kette", "Fitness-Studio",
  "Logistikunternehmen", "Beratungsfirma", "E-Commerce-Unternehmen",
  "Pharma-Unternehmen", "Einzelhändler", "Automobilzulieferer",
  "Telekommunikationsanbieter", "Versicherungsunternehmen", "Medienunternehmen",
  "Lebensmittelhersteller", "Modehändler", "Reiseveranstalter",
  "Immobilienunternehmen", "Start-up", "Maschinenbauer", "Energieversorger",
];

// ============================================
// PROFITABILITY TEMPLATES
// ============================================

type TemplateGen = (diff: number) => { question: string; answer: number; tolerance: number };

const profitabilityTemplates: TemplateGen[] = [
  // Template 1: Revenue - Cost mit Einheiten (Easy=1-Step, Medium=Marge, Hard=Multi-Step)
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const rev = choice([2, 5, 8, 10]) * 1_000_000;
      const cost = choice([1, 2, 3, 4, 6]) * 1_000_000;
      const safeCost = Math.min(cost, rev - 500_000);
      const answer = rev - safeCost;
      return {
        question: `Ein ${ind} hat einen Umsatz von **${fmtEur(rev)}** und Gesamtkosten von **${fmtEur(safeCost)}**. Wie hoch ist der Gewinn?`,
        answer, tolerance: 0,
      };
    }
    if (diff === 2) {
      const rev = choice([3, 5, 8, 12, 15]) * 1_000_000;
      const margin = choice([10, 15, 20, 25, 30]);
      const answer = rev * margin / 100;
      return {
        question: `Ein ${ind} macht **${fmtEur(rev)} Umsatz** bei einer Gewinnmarge von **${fmtPct(margin)}**. Wie hoch ist der Gewinn?`,
        answer, tolerance: answer * 0.005,
      };
    }
    const rev = choice([8, 12, 18, 25]) * 1_000_000;
    const varPct = choice([40, 45, 50, 55, 60]);
    const fix = choice([1, 2, 3]) * 1_000_000;
    const taxPct = choice([25, 30]);
    const grossProfit = rev * (1 - varPct / 100);
    const ebit = grossProfit - fix;
    const answer = ebit * (1 - taxPct / 100);
    return {
      question: `Ein ${ind}: Umsatz **${fmtEur(rev)}**, variable Kosten **${fmtPct(varPct)}** vom Umsatz, Fixkosten **${fmtEur(fix)}**, Steuersatz **${fmtPct(taxPct)}**. Wie hoch ist der Nettogewinn?`,
      answer, tolerance: Math.abs(answer) * 0.02,
    };
  },

  // Template 2: Multi-Segment (Medium: 2 Bereiche, Hard: 3 Bereiche + Overhead)
  (diff) => {
    if (diff === 1) {
      const profitA = choice([200, 500, 800]) * 1_000;
      const profitB = choice([100, 300, 500]) * 1_000;
      const answer = profitA + profitB;
      const ind = choice(industries);
      return {
        question: `Ein ${ind} hat zwei Geschäftsbereiche. Bereich A macht **${fmtEur(profitA)} Gewinn**, Bereich B **${fmtEur(profitB)}**. Wie hoch ist der Gesamtgewinn?`,
        answer, tolerance: 0,
      };
    }
    const segments = diff === 2 ? 2 : 3;
    const names = ["A", "B", "C"];
    let total = 0;
    const parts: string[] = [];
    for (let i = 0; i < segments; i++) {
      const rev = choice([2, 4, 5, 8, 10]) * 1_000_000;
      const margin = diff === 2 ? choice([10, 15, 20, 25]) : choice([10, 15, 20, 25, -5]);
      const segProfit = rev * margin / 100;
      total += segProfit;
      parts.push(`${names[i]}: Umsatz **${fmtEur(rev)}**, Marge **${fmtPct(margin)}**`);
    }
    if (diff === 3) {
      const overhead = choice([500_000, 1_000_000, 1_500_000]);
      total -= overhead;
      parts.push(`Overhead: **${fmtEur(overhead)}**`);
    }
    return {
      question: `Ein Unternehmen hat **${segments} Bereiche**: ${parts.join(". ")}. Wie hoch ist der Gesamtgewinn?`,
      answer: total, tolerance: Math.abs(total) * 0.01,
    };
  },

  // Template 3: Kunden × Preis − Kosten (Medium/Hard)
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const customers = choice([100, 200, 500, 1000]);
      const price = choice([50, 100, 200]);
      const answer = customers * price;
      return {
        question: `Ein ${ind} hat **${fmt(customers)} Kunden**, die je **${fmtEur(price)}/Jahr** zahlen. Wie hoch ist der Jahresumsatz?`,
        answer, tolerance: 0,
      };
    }
    const customers = diff === 2 ? choice([500, 1_000, 2_000]) : choice([2_500, 5_000, 8_000]);
    const price = diff === 2 ? choice([100, 200, 500]) : choice([120, 250, 480]);
    const costPct = diff === 2 ? choice([60, 70, 75]) : choice([55, 65, 72]);
    const revenue = customers * price;
    const answer = revenue * (1 - costPct / 100);
    return {
      question: `Ein ${ind}: **${fmt(customers)} Kunden** × **${fmtEur(price)}/Jahr**, Gesamtkosten **${fmtPct(costPct)}** vom Umsatz. Wie hoch ist der Gewinn?`,
      answer, tolerance: Math.abs(answer) * 0.01,
    };
  },

  // Template 4: Gesamtkosten — Fix + Variable
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const fix = choice([200_000, 500_000, 800_000, 1_000_000]);
      const varCost = choice([100_000, 300_000, 500_000, 1_500_000]);
      const answer = fix + varCost;
      return {
        question: `Ein ${ind} hat Fixkosten von **${fmtEur(fix)}** und variable Kosten von **${fmtEur(varCost)}**. Wie hoch sind die Gesamtkosten?`,
        answer, tolerance: 0,
      };
    }
    if (diff === 2) {
      const rev = choice([2, 5, 8, 10]) * 1_000_000;
      const varPct = choice([30, 40, 50, 60]);
      const fix = choice([500_000, 1_000_000, 2_000_000]);
      const answer = rev * varPct / 100 + fix;
      return {
        question: `Ein ${ind} mit Umsatz **${fmtEur(rev)}**: variable Kosten **${fmtPct(varPct)}** vom Umsatz, Fixkosten **${fmtEur(fix)}**. Wie hoch sind die Gesamtkosten?`,
        answer, tolerance: answer * 0.005,
      };
    }
    const rev = choice([5, 8, 10, 20]) * 1_000_000;
    const varPct = choice([35, 40, 45, 50]);
    const vertriebPct = choice([5, 8, 10]);
    const fix = choice([500_000, 1_000_000]);
    const verwaltung = choice([200_000, 300_000, 500_000]);
    const answer = rev * (varPct + vertriebPct) / 100 + fix + verwaltung;
    return {
      question: `Ein ${ind}: Umsatz **${fmtEur(rev)}**, variable Kosten **${fmtPct(varPct)}**, Vertriebskosten **${fmtPct(vertriebPct)}** vom Umsatz, Fixkosten **${fmtEur(fix)}**, Verwaltung **${fmtEur(verwaltung)}**. Gesamtkosten?`,
      answer, tolerance: answer * 0.01,
    };
  },

  // Template 5: Gesamtkosten — Stückkosten-basiert
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const units = choice([1_000, 2_000, 5_000, 10_000]);
      const costPerUnit = choice([20, 50, 80, 100, 200]);
      const answer = units * costPerUnit;
      return {
        question: `Ein ${ind} produziert **${fmt(units)} Einheiten** zu je **${fmtEur(costPerUnit)}/Stück**. Wie hoch sind die Produktionskosten?`,
        answer, tolerance: 0,
      };
    }
    if (diff === 2) {
      const units = choice([2_000, 5_000, 8_000, 10_000]);
      const varPerUnit = choice([30, 50, 80, 120]);
      const fix = choice([200_000, 500_000, 1_000_000]);
      const answer = units * varPerUnit + fix;
      return {
        question: `Ein ${ind}: **${fmt(units)} Einheiten** × **${fmtEur(varPerUnit)} variable Stückkosten** + Fixkosten **${fmtEur(fix)}**. Gesamtkosten?`,
        answer, tolerance: answer * 0.005,
      };
    }
    const units = choice([5_000, 10_000, 20_000]);
    const material = choice([15, 20, 25, 40]);
    const labor = choice([10, 20, 25, 30]);
    const fix = choice([500_000, 1_000_000]);
    const overheadPct = choice([10, 15, 20]);
    const varTotal = units * (material + labor);
    const answer = varTotal * (1 + overheadPct / 100) + fix;
    return {
      question: `Ein ${ind}: **${fmt(units)} Einheiten**, Material **${fmtEur(material)}/Stück**, Arbeit **${fmtEur(labor)}/Stück**, Fixkosten **${fmtEur(fix)}**, Gemeinkostenzuschlag **${fmtPct(overheadPct)}** auf variable Kosten. Gesamtkosten?`,
      answer, tolerance: answer * 0.02,
    };
  },

  // Template 6: Gesamtkosten — Personalkosten
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const employees = choice([10, 20, 50, 100]);
      const salary = choice([40_000, 50_000, 60_000, 80_000]);
      const answer = employees * salary;
      return {
        question: `Ein ${ind} hat **${employees} Mitarbeiter** mit einem Durchschnittsgehalt von **${fmtEur(salary)}/Jahr**. Wie hoch sind die jährlichen Personalkosten?`,
        answer, tolerance: 0,
      };
    }
    if (diff === 2) {
      const employees = choice([15, 20, 30, 50]);
      const salary = choice([50_000, 60_000, 80_000]);
      const sozialPct = choice([20, 25, 30]);
      const office = choice([100_000, 200_000, 500_000]);
      const answer = employees * salary * (1 + sozialPct / 100) + office;
      return {
        question: `Ein ${ind}: **${employees} Mitarbeiter** × **${fmtEur(salary)}/Jahr**, Sozialabgaben **${fmtPct(sozialPct)}** der Gehälter, Bürokosten **${fmtEur(office)}**. Gesamte Personalkosten?`,
        answer, tolerance: answer * 0.01,
      };
    }
    const empA = choice([20, 30, 50]);
    const salaryA = choice([60_000, 80_000]);
    const empB = choice([10, 15, 25]);
    const salaryB = choice([40_000, 50_000, 70_000]);
    const nebenkostenPct = choice([20, 25, 30]);
    const office = choice([200_000, 300_000, 500_000]);
    const baseCost = empA * salaryA + empB * salaryB;
    const answer = baseCost * (1 + nebenkostenPct / 100) + office;
    return {
      question: `Ein ${ind}: Abteilung A **${empA} Mitarbeiter** × **${fmtEur(salaryA)}**, Abteilung B **${empB} Mitarbeiter** × **${fmtEur(salaryB)}**. Lohnnebenkosten **${fmtPct(nebenkostenPct)}** aller Gehälter, Bürokosten **${fmtEur(office)}**. Gesamte Personalkosten?`,
      answer, tolerance: answer * 0.02,
    };
  },

  // Template 7: Zeitraum-Profit (Umsatz − Kosten, viele Varianten)
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const period = choice(["Monat", "Quartal"]);
      const rev = choice([200_000, 500_000, 800_000, 1_000_000, 1_500_000, 2_000_000]);
      const cost = choice([100_000, 200_000, 300_000, 400_000, 600_000, 800_000]);
      const safeCost = Math.min(cost, rev - 50_000);
      const answer = rev - safeCost;
      return {
        question: `Ein ${ind} hat einen ${period}sumsatz von **${fmtEur(rev)}** und ${period}skosten von **${fmtEur(safeCost)}**. Wie hoch ist der ${period}sgewinn?`,
        answer, tolerance: 0,
      };
    }
    if (diff === 2) {
      const rev = choice([1, 2, 5]) * 1_000_000;
      const material = choice([200_000, 300_000, 500_000]);
      const personal = choice([200_000, 400_000, 600_000]);
      const miete = choice([50_000, 100_000, 200_000]);
      const totalCost = material + personal + miete;
      const safeRev = Math.max(rev, totalCost + 100_000);
      const answer = safeRev - totalCost;
      return {
        question: `Ein ${ind}: Umsatz **${fmtEur(safeRev)}**, Material **${fmtEur(material)}**, Personal **${fmtEur(personal)}**, Miete **${fmtEur(miete)}**. Wie hoch ist der Gewinn?`,
        answer, tolerance: answer * 0.005,
      };
    }
    const revA = choice([2, 3, 5]) * 1_000_000;
    const revB = choice([1, 2, 3]) * 1_000_000;
    const material = choice([500_000, 800_000, 1_000_000]);
    const personal = choice([500_000, 1_000_000, 1_500_000]);
    const miete = choice([100_000, 200_000, 300_000]);
    const marketing = choice([200_000, 500_000, 800_000]);
    const totalRev = revA + revB;
    const totalCost = material + personal + miete + marketing;
    const safeTotalRev = Math.max(totalRev, totalCost + 200_000);
    const answer = safeTotalRev - totalCost;
    return {
      question: `Ein ${ind}: Produktumsatz **${fmtEur(revA)}**, Serviceumsatz **${fmtEur(revB)}**. Kosten: Material **${fmtEur(material)}**, Personal **${fmtEur(personal)}**, Miete **${fmtEur(miete)}**, Marketing **${fmtEur(marketing)}**. Gesamtgewinn?`,
      answer, tolerance: answer * 0.01,
    };
  },

  // Template 8: Gewinn pro Stück
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const profitPerUnit = choice([5, 10, 20, 25, 50]);
      const quantity = choice([1_000, 2_000, 5_000, 10_000]);
      const answer = profitPerUnit * quantity;
      return {
        question: `Ein ${ind} verkauft **${fmt(quantity)} Einheiten** mit einem Gewinn von **${fmtEur(profitPerUnit)}/Stück**. Wie hoch ist der Gesamtgewinn?`,
        answer, tolerance: 0,
      };
    }
    if (diff === 2) {
      const price = choice([80, 100, 150, 200, 250]);
      const unitCost = choice([30, 50, 60, 80, 100]);
      const safeUnitCost = Math.min(unitCost, price - 10);
      const quantity = choice([2_000, 5_000, 10_000, 20_000]);
      const answer = (price - safeUnitCost) * quantity;
      return {
        question: `Ein ${ind}: Verkaufspreis **${fmtEur(price)}/Stück**, Herstellungskosten **${fmtEur(safeUnitCost)}/Stück**, Absatz **${fmt(quantity)} Stück**. Gesamtgewinn?`,
        answer, tolerance: answer * 0.005,
      };
    }
    const price = choice([100, 150, 200, 300]);
    const varCost = choice([40, 60, 80, 120]);
    const safeVarCost = Math.min(varCost, price - 20);
    const quantity = choice([5_000, 10_000, 20_000]);
    const fixedCosts = choice([200_000, 500_000, 1_000_000]);
    const contribution = (price - safeVarCost) * quantity;
    const safeFixed = Math.min(fixedCosts, contribution - 100_000);
    const answer = contribution - safeFixed;
    return {
      question: `Ein ${ind}: Verkaufspreis **${fmtEur(price)}**, variable Stückkosten **${fmtEur(safeVarCost)}**, Absatz **${fmt(quantity)} Stück**, Fixkosten **${fmtEur(safeFixed)}**. Gesamtgewinn?`,
      answer, tolerance: answer * 0.01,
    };
  },

  // Template 9: Direkte Profit Margin (%)
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const rev = choice([1, 2, 5, 10]) * 1_000_000;
      const margin = choice([10, 15, 20, 25, 30, 40, 50]);
      const profit = displayRound(rev * margin / 100);
      const actualMargin = (profit / rev) * 100;
      return {
        question: `Ein ${ind}: Umsatz **${fmtEur(rev)}**, Gewinn **${fmtEur(profit)}**. Wie hoch ist die Gewinnmarge in %?`,
        answer: Math.round(actualMargin * 10) / 10, tolerance: 0.5,
      };
    }
    if (diff === 2) {
      const rev = choice([2, 4, 5, 8, 10]) * 1_000_000;
      const margin = choice([10, 15, 20, 25, 30]);
      const costs = displayRound(rev * (1 - margin / 100));
      const actualMargin = ((rev - costs) / rev) * 100;
      return {
        question: `Ein ${ind}: Umsatz **${fmtEur(rev)}**, Gesamtkosten **${fmtEur(costs)}**. Wie hoch ist die Gewinnmarge in %?`,
        answer: Math.round(actualMargin * 10) / 10, tolerance: 0.5,
      };
    }
    const rev = choice([5, 10, 15, 20]) * 1_000_000;
    const varPct = choice([40, 45, 50, 55, 60]);
    const fix = choice([1, 2, 3]) * 1_000_000;
    const ebit = rev * (1 - varPct / 100) - fix;
    if (ebit <= 0) return profitabilityTemplates[8](diff);
    const answer = (ebit / rev) * 100;
    return {
      question: `Ein ${ind}: Umsatz **${fmtEur(rev)}**, variable Kosten **${fmtPct(varPct)}** vom Umsatz, Fixkosten **${fmtEur(fix)}**. Wie hoch ist die operative Marge (EBIT-Marge) in %?`,
      answer, tolerance: 1,
    };
  },

  // Template 10: Kostenseitige Marge
  (diff) => {
    const ind = choice(industries);
    if (diff === 1) {
      const costPct = choice([60, 65, 70, 75, 80, 85]);
      const rev = choice([2, 5, 10]) * 1_000_000;
      const answer = 100 - costPct;
      return {
        question: `Ein ${ind} mit Umsatz **${fmtEur(rev)}**: die Gesamtkosten betragen **${fmtPct(costPct)}** vom Umsatz. Wie hoch ist die Gewinnmarge in %?`,
        answer, tolerance: 0,
      };
    }
    if (diff === 2) {
      const rev = choice([5, 8, 10]) * 1_000_000;
      const margin = choice([10, 15, 20, 25]);
      const totalCosts = displayRound(rev * (1 - margin / 100));
      const material = displayRound(totalCosts * 0.5);
      const personal = displayRound(totalCosts * 0.35);
      const other = totalCosts - material - personal;
      const actualTotal = material + personal + other;
      const actualMargin = ((rev - actualTotal) / rev) * 100;
      return {
        question: `Ein ${ind}: Umsatz **${fmtEur(rev)}**. Kosten: Material **${fmtEur(material)}**, Personal **${fmtEur(personal)}**, Sonstiges **${fmtEur(other)}**. Gewinnmarge in %?`,
        answer: Math.round(actualMargin * 10) / 10, tolerance: 0.5,
      };
    }
    const revOld = choice([5, 8, 10]) * 1_000_000;
    const marginOld = choice([15, 20, 25]);
    const costsOld = revOld * (1 - marginOld / 100);
    const delta = choice([-5, -3, 2, 3, 5]);
    const marginNew = marginOld + delta;
    const growthPct = choice([10, 15, 20]);
    const revNew = revOld * (1 + growthPct / 100);
    const costsNew = revNew * (1 - marginNew / 100);
    return {
      question: `Ein ${ind}: Vorjahr Umsatz **${fmtEur(revOld)}**, Kosten **${fmtEur(costsOld)}**. Dieses Jahr Umsatz **${fmtEur(revNew)}**, Kosten **${fmtEur(costsNew)}**. Um wie viele Prozentpunkte hat sich die Marge verändert?`,
      answer: delta, tolerance: 0.5,
    };
  },
];

// ============================================
// INVESTMENT / ROI TEMPLATES
// ============================================

const investmentTemplates: TemplateGen[] = [
  // Template 1: Klassischer ROI (verschiedene Szenarien)
  (diff) => {
    const scenarios = [
      { ctx: "neue Maschine", invest: "Investition" },
      { ctx: "Marketing-Kampagne", invest: "Kampagnenkosten" },
      { ctx: "IT-System", invest: "Projektkosten" },
      { ctx: "Filiale", invest: "Eröffnungskosten" },
    ];
    const scenario = choice(scenarios);
    const invest = diff === 1 ? choice([100_000, 200_000, 500_000])
      : diff === 2 ? choice([300_000, 500_000, 1_000_000])
      : choice([750_000, 1_500_000, 2_500_000]);
    const profitPa = diff === 1 ? choice([50_000, 100_000, 200_000])
      : diff === 2 ? choice([80_000, 150_000, 250_000])
      : choice([120_000, 200_000, 350_000]);
    const years = diff === 1 ? 1 : diff === 2 ? choice([2, 3]) : choice([3, 5]);
    const totalProfit = profitPa * years;
    const answer = (totalProfit / invest) * 100;
    return {
      question: `Eine ${scenario.ctx}: ${scenario.invest} **${fmtEur(invest)}**, jährlicher Zusatzgewinn **${fmtEur(profitPa)}**${years > 1 ? ` über **${years} Jahre**` : ""}. Wie hoch ist der ROI in %?`,
      answer, tolerance: 0.5,
    };
  },

  // Template 2: Personalaufbau ROI
  (diff) => {
    const hires = diff === 1 ? choice([5, 10]) : diff === 2 ? choice([10, 15, 20]) : choice([20, 30, 50]);
    const costPerHire = diff === 1 ? choice([50_000, 100_000]) : diff === 2 ? choice([60_000, 80_000]) : choice([75_000, 90_000]);
    const revPerHire = diff === 1 ? choice([100_000, 200_000]) : diff === 2 ? choice([120_000, 150_000]) : choice([130_000, 180_000]);
    const totalCost = hires * costPerHire;
    const totalRev = hires * revPerHire;
    const answer = ((totalRev - totalCost) / totalCost) * 100;
    return {
      question: `Ein Unternehmen stellt **${hires} neue Mitarbeiter** ein. Kosten pro Mitarbeiter: **${fmtEur(costPerHire)}/Jahr**, Umsatzbeitrag pro Mitarbeiter: **${fmtEur(revPerHire)}/Jahr**. Wie hoch ist der ROI in %?`,
      answer, tolerance: 1,
    };
  },

  // Template 3: Technologie-Investition (Effizienzgewinn)
  (diff) => {
    const invest = diff === 1 ? choice([200_000, 500_000]) : diff === 2 ? choice([500_000, 1_000_000]) : choice([1_000_000, 2_000_000]);
    const savingsPerYear = diff === 1 ? choice([100_000, 250_000]) : diff === 2 ? choice([150_000, 300_000]) : choice([200_000, 400_000]);
    const years = diff === 1 ? 1 : diff === 2 ? choice([2, 3]) : choice([3, 5]);
    const maintCostPa = diff === 3 ? choice([50_000, 80_000]) : 0;
    const netSavings = (savingsPerYear - maintCostPa) * years;
    const answer = (netSavings / invest) * 100;
    const maintText = maintCostPa > 0 ? `, laufende Kosten **${fmtEur(maintCostPa)}/Jahr**` : "";
    return {
      question: `Investition in Automatisierung: **${fmtEur(invest)}**. Jährliche Einsparung: **${fmtEur(savingsPerYear)}**${maintText}. ROI nach **${years} ${years === 1 ? "Jahr" : "Jahren"}** in %?`,
      answer, tolerance: 1,
    };
  },

  // Template 4: Standort-Expansion
  (diff) => {
    const setupCost = diff === 1 ? choice([500_000, 1_000_000]) : diff === 2 ? choice([1_000_000, 2_000_000]) : choice([2_000_000, 5_000_000]);
    const additionalRevPa = diff === 1 ? choice([500_000, 1_000_000]) : diff === 2 ? choice([800_000, 1_500_000]) : choice([1_500_000, 3_000_000]);
    const marginPct = diff === 1 ? choice([20, 25, 50]) : diff === 2 ? choice([15, 20, 25]) : choice([12, 18, 22]);
    const profitPa = additionalRevPa * marginPct / 100;
    const years = diff === 1 ? 1 : diff === 2 ? choice([2, 3]) : choice([3, 5]);
    const answer = (profitPa * years / setupCost) * 100;
    return {
      question: `Expansion in neuen Markt: Setup-Kosten **${fmtEur(setupCost)}**, erwarteter Zusatzumsatz **${fmtEur(additionalRevPa)}/Jahr** bei **${fmtPct(marginPct)} Marge**. ROI nach **${years} ${years === 1 ? "Jahr" : "Jahren"}**?`,
      answer, tolerance: 1,
    };
  },

  // Template 5: Kosten pro Kunde (CAC)
  (diff) => {
    const budget = diff === 1 ? choice([100_000, 200_000, 500_000])
      : diff === 2 ? choice([300_000, 500_000, 800_000])
      : choice([500_000, 1_000_000]);
    const customers = diff === 1 ? choice([500, 1_000, 2_000])
      : diff === 2 ? choice([1_000, 2_500, 5_000])
      : choice([2_000, 4_000, 8_000]);
    const answer = budget / customers;
    return {
      question: `Marketing-Budget: **${fmtEur(budget)}**. Damit wurden **${fmt(customers)} Neukunden** gewonnen. Wie hoch sind die Akquisitionskosten pro Kunde (CAC)?`,
      answer, tolerance: answer * 0.01,
    };
  },
];

// ============================================
// BREAK-EVEN TEMPLATES (Investment-Break-even!)
// ============================================

const breakevenTemplates: TemplateGen[] = [
  // Template 1: Einfacher Investment-Break-even (Invest ÷ jährl. Rückfluss)
  (diff) => {
    const years = diff === 1 ? choice([2, 3, 4, 5]) : diff === 2 ? choice([3, 4, 5, 6]) : choice([4, 5, 6, 8]);
    const cashflowPa = diff === 1 ? choice([100_000, 200_000, 250_000, 500_000])
      : diff === 2 ? choice([150_000, 250_000, 400_000])
      : choice([200_000, 350_000, 500_000]);
    const invest = years * cashflowPa;
    const scenarios = [
      { what: "neue Produktionslinie", cashName: "Jährliche Einsparung" },
      { what: "neue Software-Plattform", cashName: "Jährliche Kosteneinsparung" },
      { what: "neues Lager", cashName: "Jährlicher Zusatzgewinn" },
      { what: "Maschinen-Upgrade", cashName: "Jährliche Effizienzgewinne" },
    ];
    const s = choice(scenarios);
    return {
      question: `Investition in ${s.what}: **${fmtEur(invest)}**. ${s.cashName}: **${fmtEur(cashflowPa)}**. Nach wie vielen Jahren ist die Investition amortisiert?`,
      answer: years, tolerance: 0,
    };
  },

  // Template 2: Marketing-Investition Break-even (Invest ÷ Gewinn pro Kunde × Kunden)
  (diff) => {
    if (diff === 1) {
      const campaignCost = choice([50_000, 100_000, 200_000]);
      const profitPerCustomer = choice([50, 100, 200]);
      const answer = campaignCost / profitPerCustomer;
      return {
        question: `Marketing-Kampagne kostet **${fmtEur(campaignCost)}**. Gewinn pro Neukunde: **${fmtEur(profitPerCustomer)}**. Ab wie vielen Neukunden ist die Kampagne im Plus?`,
        answer, tolerance: 0,
      };
    }
    const campaignCost = diff === 2 ? choice([100_000, 200_000]) : choice([250_000, 500_000]);
    const revenuePerCustomer = diff === 2 ? choice([200, 500, 1_000]) : choice([300, 600, 1_200]);
    const costPct = diff === 2 ? choice([50, 60]) : choice([55, 65, 70]);
    const profitPerCustomer = revenuePerCustomer * (1 - costPct / 100);
    const rawBE = campaignCost / profitPerCustomer;
    const answer = Math.ceil(rawBE);
    const runningCost = diff === 3 ? choice([20_000, 50_000]) : 0;
    const runningText = runningCost > 0 ? `, laufende Kosten **${fmtEur(runningCost)}/Jahr**` : "";
    const effectiveInvest = campaignCost + runningCost;
    const effectiveBE = diff === 3 ? Math.ceil(effectiveInvest / profitPerCustomer) : answer;
    return {
      question: `Marketing-Kampagne: **${fmtEur(campaignCost)}**${runningText}. Umsatz pro Neukunde: **${fmtEur(revenuePerCustomer)}**, Kosten pro Kunde: **${fmtPct(costPct)}** vom Umsatz. Ab wie vielen Kunden Break-even?`,
      answer: effectiveBE, tolerance: 1,
    };
  },

  // Template 3: Expansion Break-even (Invest + lfd. Kosten vs. Zusatzgewinn)
  (diff) => {
    const profitPa = diff === 1 ? choice([200_000, 500_000, 1_000_000])
      : diff === 2 ? choice([300_000, 500_000, 800_000])
      : choice([400_000, 600_000, 1_000_000]);
    const years = diff === 1 ? choice([2, 3, 4]) : diff === 2 ? choice([3, 4, 5]) : choice([4, 5, 6]);
    const runningCostPa = diff === 3 ? choice([100_000, 200_000]) : 0;
    const invest = (profitPa - runningCostPa) * years;
    const scenarios = [
      "neue Filiale", "Expansion nach Frankreich", "zweiten Produktionsstandort", "Online-Kanal",
    ];
    const runningText = runningCostPa > 0 ? ` Laufende Kosten: **${fmtEur(runningCostPa)}/Jahr**.` : "";
    return {
      question: `Investition in ${choice(scenarios)}: **${fmtEur(invest)}**.${runningText} Erwarteter Zusatzgewinn: **${fmtEur(profitPa)}/Jahr**. Nach wie vielen Jahren Break-even?`,
      answer: years, tolerance: 0,
    };
  },

  // Template 4: Abo-Modell Break-even (Invest ÷ monatl. Beitrag)
  (diff) => {
    const monthlyNet = diff === 1 ? choice([5_000, 10_000, 20_000])
      : diff === 2 ? choice([8_000, 15_000, 25_000])
      : choice([12_000, 18_000, 30_000]);
    const months = diff === 1 ? choice([6, 10, 12]) : diff === 2 ? choice([8, 12, 15]) : choice([10, 14, 18]);
    const invest = monthlyNet * months;
    if (diff === 1) {
      return {
        question: `Launch einer Abo-Plattform: Startkosten **${fmtEur(invest)}**. Monatlicher Nettogewinn: **${fmtEur(monthlyNet)}**. Nach wie vielen Monaten Break-even?`,
        answer: months, tolerance: 0,
      };
    }
    const monthlyRev = diff === 2 ? choice([20_000, 50_000]) : choice([30_000, 60_000, 100_000]);
    const monthlyCost = monthlyRev - monthlyNet;
    const runningInvest = diff === 3 ? choice([50_000, 100_000]) : 0;
    const totalInvest = invest + runningInvest;
    const effectiveMonths = Math.ceil(totalInvest / monthlyNet);
    const runningText = runningInvest > 0 ? `, laufende Einmalkosten **${fmtEur(runningInvest)}**` : "";
    return {
      question: `Abo-Plattform: Startkosten **${fmtEur(invest)}**${runningText}. Monatlicher Umsatz: **${fmtEur(monthlyRev)}**, monatliche Kosten: **${fmtEur(monthlyCost)}**. Nach wie vielen Monaten Break-even?`,
      answer: effectiveMonths, tolerance: 1,
    };
  },
];

// ============================================
// GENERATOR
// ============================================

const templateMap: Record<CaseMathCategory, TemplateGen[]> = {
  profitability: profitabilityTemplates,
  investment: investmentTemplates,
  breakeven: breakevenTemplates,
};

export const generateCaseMathTask = (
  categories: CaseMathCategory[],
  difficulty: number
): CaseMathTask => {
  const category = choice(categories);
  const templates = templateMap[category];
  const template = choice(templates);

  let result: ReturnType<TemplateGen>;
  let attempts = 0;
  do {
    result = template(difficulty);
    attempts++;
  } while (sessionHistory.has(result.question) && attempts < 10);

  sessionHistory.add(result.question);
  if (sessionHistory.size > 200) {
    const arr = Array.from(sessionHistory);
    sessionHistory.clear();
    arr.slice(-100).forEach(q => sessionHistory.add(q));
  }

  return {
    id: ++taskCounter,
    category,
    question: result.question,
    highlightedQuestion: result.question,
    answer: Math.round(result.answer * 100) / 100,
    tolerance: result.tolerance,
    difficulty,
  };
};

export const resetCaseMathGenerator = () => {
  sessionHistory.clear();
};

/**
 * Check if user answer matches the correct answer (with tolerance and suffix parsing).
 */
export const checkCaseMathAnswer = (
  userInput: string,
  correctAnswer: number,
  tolerance: number
): boolean => {
  const cleaned = userInput
    .trim()
    .replace(/[€%\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  let value: number;
  const mrdMatch = cleaned.match(/^(-?[\d.]+)\s*(?:mrd)$/i);
  const mioMatch = cleaned.match(/^(-?[\d.]+)\s*(?:mio)$/i);
  const kMatch = cleaned.match(/^(-?[\d.]+)\s*k$/i);

  if (mrdMatch) value = parseFloat(mrdMatch[1]) * 1_000_000_000;
  else if (mioMatch) value = parseFloat(mioMatch[1]) * 1_000_000;
  else if (kMatch) value = parseFloat(kMatch[1]) * 1_000;
  else value = parseFloat(cleaned);

  if (isNaN(value)) return false;

  if (tolerance > 0) {
    return Math.abs(value - correctAnswer) <= tolerance;
  }

  return Math.abs(value - correctAnswer) < 0.01;
};
