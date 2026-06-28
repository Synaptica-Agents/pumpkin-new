import { describe, it, expect } from "vitest";
import { FrameworkNode } from "../types/frameworkBuilder";
import { BoxInput, MathOp } from "../types/marketSizing";
import { computeRollup, getNodesNeedingOp } from "../lib/marketSizingHelpers";

// Minimal node/box builders for the tests.
const n = (id: string, title: string, children: FrameworkNode[] = []): FrameworkNode => ({
  id,
  title,
  bulletPoints: [],
  children,
});
const bi = (value: string): BoxInput => ({ assumption: "", value, kind: "annahme" });

// New model: operations[node.id] = op linking node to its PREVIOUS sibling.
describe("computeRollup (pairwise operations)", () => {
  it("multiplies two leaves under one Oberast (single top branch => total is that branch)", () => {
    const nodes = [n("p", "Markt", [n("a", "Haushalte"), n("b", "Pro Haushalt")])];
    const ops: Record<string, MathOp> = { b: "×" }; // b linked to a via ×
    const inputs = { a: bi("40 Mio"), b: bi("2") };
    const { values, total } = computeRollup(nodes, ops, inputs);
    expect(values.p).toBe(80_000_000);
    expect(total).toBe(80_000_000);
  });

  it("combines two top-level branches pairwise", () => {
    const nodes = [n("A", "Stadt"), n("B", "Land")];
    const ops: Record<string, MathOp> = { B: "+" }; // B linked to A via +
    const inputs = { A: bi("30"), B: bi("50") };
    const { total } = computeRollup(nodes, ops, inputs);
    expect(total).toBe(80);
  });

  it("mixes operations across three top branches (A × B + C)", () => {
    const nodes = [n("A", "a"), n("B", "b"), n("C", "c")];
    const ops: Record<string, MathOp> = { B: "×", C: "+" };
    const { total } = computeRollup(nodes, ops, { A: bi("4"), B: bi("5"), C: bi("7") });
    expect(total).toBe(27); // (4 × 5) + 7
  });

  it("folds subtraction left-to-right (order matters)", () => {
    const nodes = [n("p", "x", [n("a", ""), n("b", ""), n("c", "")])];
    const ops: Record<string, MathOp> = { b: "−", c: "−" };
    const { values } = computeRollup(nodes, ops, { a: bi("100"), b: bi("30"), c: bi("20") });
    expect(values.p).toBe(50); // 100 - 30 - 20
  });

  it("folds division left-to-right", () => {
    const nodes = [n("p", "x", [n("a", ""), n("b", "")])];
    const ops: Record<string, MathOp> = { b: "÷" };
    const { values } = computeRollup(nodes, ops, { a: bi("100"), b: bi("4") });
    expect(values.p).toBe(25);
  });

  it("rolls up nested parents pairwise", () => {
    // Markt = (Erwachsene × Anteil) × Ausgaben
    const nodes = [
      n("root", "Markt", [
        n("bev", "Bevölkerung", [n("erw", "Erwachsene"), n("anteil", "Anteil")]),
        n("ausg", "Ausgaben"),
      ]),
    ];
    const ops: Record<string, MathOp> = { ausg: "×", anteil: "×" };
    const inputs = { erw: bi("70 Mio"), anteil: bi("50 %"), ausg: bi("100") };
    const { values, total } = computeRollup(nodes, ops, inputs);
    expect(values.bev).toBe(35_000_000); // 70M × 0.5
    expect(values.root).toBe(3_500_000_000); // 35M × 100
    expect(total).toBe(3_500_000_000);
  });

  it("is null when a leaf is missing/unparseable", () => {
    const nodes = [n("p", "x", [n("a", ""), n("b", "")])];
    const ops: Record<string, MathOp> = { b: "×" };
    const { values, total } = computeRollup(nodes, ops, { a: bi("40") /* b missing */ });
    expect(values.p).toBeNull();
    expect(total).toBeNull();
  });

  it("is null when a pairwise operation is unset", () => {
    const nodes = [n("A", "Stadt"), n("B", "Land")];
    const { total } = computeRollup(nodes, {}, { A: bi("30"), B: bi("50") });
    expect(total).toBeNull();
  });
});

describe("getNodesNeedingOp", () => {
  it("returns every non-first sibling at every level", () => {
    const nodes = [
      n("A", "a", [n("a1", ""), n("a2", ""), n("a3", "")]),
      n("B", "b"),
    ];
    const need = getNodesNeedingOp(nodes).map((x) => x.id).sort();
    // B (2nd top branch), a2 + a3 (2nd/3rd children) — NOT A, a1
    expect(need).toEqual(["B", "a2", "a3"]);
  });
});
