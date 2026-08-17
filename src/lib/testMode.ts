import { useLocation } from "react-router-dom";
import { MarketSizingCategory } from "@/types/marketSizing";

/**
 * /test-Bereich: sieht exakt aus wie die normale Seite, aber in den Drills
 * Frameworks, Market Sizing und Creativity ist genau EIN Demo-Case fest
 * verdrahtet (für Video-Walkthroughs). Schwierigkeit/Kategorie sind dort auf
 * die Werte des Cases fixiert — alle anderen Optionen bleiben sichtbar,
 * Klicks darauf ändern aber nichts.
 *
 * Case-Erkennung über die Prod-Case-ID, mit eindeutigem Prompt-Fragment als
 * Fallback (falls Cases irgendwann neu eingespielt werden und IDs wechseln).
 */

export interface FixedCaseRef {
  caseId: string;
  promptContains: string;
}

export const TEST_LOCKS = {
  frameworks: {
    // "PumpHouse" Fitnessstudio-Kette (profitability, medium)
    caseId: "d804fc58-7741-4c03-9fc6-54f780e55ef2",
    promptContains: "PumpHouse",
    difficulty: "medium" as const,
    categories: ["profitability"],
  },
  marketSizing: {
    // "Wie viel Umsatz macht eine durchschnittliche Zara-Filiale?" (maerkte, medium)
    caseId: "81245d7e-5e62-452b-abcf-349c97b4bd2f",
    promptContains: "Zara-Filiale",
    category: "maerkte" as MarketSizingCategory,
  },
  creativity: {
    // "Deutsche Buchhandelskette nach Italien" (market_entry, medium)
    caseId: "11b19180-920a-458a-8591-c16b81e53f29",
    promptContains: "Buchhandelskette",
    difficulty: "medium" as const,
    categories: ["market_entry"],
  },
};

export const isTestPath = (pathname: string): boolean =>
  pathname === "/test" || pathname.startsWith("/test/");

/** Sind wir im /test-Bereich? (rein URL-basiert, kein globaler State) */
export const useTestMode = (): boolean => isTestPath(useLocation().pathname);

/**
 * Interne Links so präfixen, dass man im /test-Bereich bleibt.
 * /fortschritt bleibt bewusst global (eine gemeinsame Fortschrittsseite).
 */
export const withTestPrefix = (testMode: boolean, path: string): string => {
  if (!testMode || path.startsWith("/fortschritt")) return path;
  return path === "/" ? "/test" : `/test${path}`;
};
