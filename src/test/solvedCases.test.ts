import { describe, it, expect, beforeEach } from "vitest";
import {
  appendLocalSolved,
  clearLocalSolved,
  countsFromIds,
  leastSolvedCandidates,
  pickLeastSolved,
  readLocalSolved,
  SolvedCounts,
} from "@/lib/solvedCases";

const pool = [{ id: "a" }, { id: "b" }, { id: "c" }];

describe("countsFromIds", () => {
  it("zählt Duplikate als Mehrfach-Lösungen", () => {
    const m = countsFromIds(["a", "b", "a", "a"]);
    expect(m.get("a")).toBe(3);
    expect(m.get("b")).toBe(1);
    expect(m.get("c")).toBeUndefined();
  });
});

describe("pickLeastSolved — gelöste Aufgaben kommen erst wieder, wenn alle anderen dran waren", () => {
  it("leerer Pool → null", () => {
    expect(pickLeastSolved([], new Map())).toBeNull();
  });

  it("wählt nie eine gelöste Aufgabe, solange ungelöste existieren", () => {
    const counts = countsFromIds(["a"]);
    for (let i = 0; i < 50; i++) {
      const picked = pickLeastSolved(pool, counts)!;
      expect(["b", "c"]).toContain(picked.id);
    }
  });

  it("wenn alle gleich oft gelöst sind, ist wieder alles verfügbar", () => {
    const counts = countsFromIds(["a", "b", "c"]);
    expect(leastSolvedCandidates(pool, counts).map((c) => c.id)).toEqual(["a", "b", "c"]);
  });

  it("Runden-Eigenschaft: jede Aufgabe genau 1x pro Runde, über mehrere Runden", () => {
    const counts: SolvedCounts = new Map();
    const solvedOrder: string[] = [];
    for (let i = 0; i < 9; i++) {
      const picked = pickLeastSolved(pool, counts)!;
      solvedOrder.push(picked.id);
      counts.set(picked.id, (counts.get(picked.id) ?? 0) + 1);
    }
    // Nach 9 Zügen über 3 Aufgaben: jede exakt 3x gelöst
    expect(counts.get("a")).toBe(3);
    expect(counts.get("b")).toBe(3);
    expect(counts.get("c")).toBe(3);
    // In jeder 3er-Runde kommt jede Aufgabe genau einmal vor
    for (let r = 0; r < 3; r++) {
      expect(new Set(solvedOrder.slice(r * 3, r * 3 + 3)).size).toBe(3);
    }
  });

  it("respektiert injizierten Zufall (deterministisch)", () => {
    const counts = countsFromIds(["b"]);
    expect(pickLeastSolved(pool, counts, () => 0)!.id).toBe("a");
    expect(pickLeastSolved(pool, counts, () => 0.99)!.id).toBe("c");
  });

  it("Historie aus anderen Kategorien zählt weiter (Teil-Pool)", () => {
    // Nutzer hat a (andere Kategorie) 5x gelöst; aktueller Pool enthält nur b, c
    const counts = countsFromIds(["a", "a", "a", "a", "a", "b"]);
    const sub = [{ id: "b" }, { id: "c" }];
    for (let i = 0; i < 20; i++) {
      expect(pickLeastSolved(sub, counts)!.id).toBe("c");
    }
  });
});

describe("sessionStorage-Fallback für anonyme Nutzer", () => {
  beforeEach(() => clearLocalSolved("test_scope"));

  it("liest leere Liste ohne Eintrag", () => {
    expect(readLocalSolved("test_scope")).toEqual([]);
  });

  it("append + read mit Duplikaten", () => {
    appendLocalSolved("test_scope", "x");
    appendLocalSolved("test_scope", "y");
    appendLocalSolved("test_scope", "x");
    expect(readLocalSolved("test_scope")).toEqual(["x", "y", "x"]);
    expect(countsFromIds(readLocalSolved("test_scope")).get("x")).toBe(2);
  });
});
