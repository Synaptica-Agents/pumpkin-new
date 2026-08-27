/**
 * Nutzer-persistente Löse-Historie für Case-Pools.
 *
 * Regel: Eine bereits gelöste Aufgabe kommt erst wieder dran, wenn alle
 * anderen Aufgaben des aktiven Pools gleich oft gelöst wurden
 * ("am seltensten gelöst zuerst" — ergibt saubere Runden durch den Pool).
 *
 * Die Zählung kommt für erkannte Nutzer (?email=) aus den Submissions-
 * Tabellen der DB und gilt damit über Sessions und Geräte hinweg. Anonyme
 * Nutzer bekommen einen sessionStorage-Fallback (gilt für den Tab).
 */

export type SolvedCounts = Map<string, number>;

/** Zähler aus einer ID-Liste (Duplikate = Mehrfach-Lösungen). */
export const countsFromIds = (ids: string[]): SolvedCounts => {
  const m: SolvedCounts = new Map();
  for (const id of ids) m.set(id, (m.get(id) ?? 0) + 1);
  return m;
};

/** Alle Kandidaten mit minimalem Löse-Zähler (für Fetcher mit Zusatzkriterien). */
export const leastSolvedCandidates = <T extends { id: string }>(
  pool: T[],
  counts: SolvedCounts
): T[] => {
  if (pool.length === 0) return [];
  const countOf = (c: T): number => counts.get(c.id) ?? 0;
  const min = Math.min(...pool.map(countOf));
  return pool.filter((c) => countOf(c) === min);
};

/** Zufällige Wahl unter den am seltensten gelösten Kandidaten. */
export const pickLeastSolved = <T extends { id: string }>(
  pool: T[],
  counts: SolvedCounts,
  rand: () => number = Math.random
): T | null => {
  const candidates = leastSolvedCandidates(pool, counts);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(rand() * candidates.length)];
};

// --- sessionStorage-Fallback für anonyme Nutzer (Liste MIT Duplikaten) ---

const KEY = (scope: string) => `pumpkin_solvedIds_${scope}`;

export const readLocalSolved = (scope: string): string[] => {
  if (typeof window === "undefined" || !window.sessionStorage) return [];
  try {
    const raw = sessionStorage.getItem(KEY(scope));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export const appendLocalSolved = (scope: string, caseId: string): void => {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    sessionStorage.setItem(KEY(scope), JSON.stringify([...readLocalSolved(scope), caseId]));
  } catch {
    /* sessionStorage voll oder nicht verfügbar — dann eben ohne Fallback */
  }
};

export const clearLocalSolved = (scope: string): void => {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    sessionStorage.removeItem(KEY(scope));
  } catch {
    /* ignorieren */
  }
};
