import { describe, it, expect } from "vitest";
import { FrameworkNode } from "../types/frameworkBuilder";
import { BoxInput, MathOp } from "../types/marketSizing";
import { computeRollup, ROOT_OP_KEY } from "../lib/marketSizingHelpers";

// Minimal node/box builders for the tests.
const n = (id: string, title: string, children: FrameworkNode[] = []): FrameworkNode => ({
  id,
  title,
  bulletPoints: [],
  children,
});
const bi = (value: string): BoxInput => ({ assumption: "", value, kind: "annahme" });

describe("computeRollup", () => {
  it("multiplies two leaves under one Oberast (single top branch => total is that branch)", () => {
    const nodes = [n("p", "Markt", [n("a", "Haushalte"), n("b", "Pro Haushalt")])];
    const ops: Record<string, MathOp> = { p: "×" };
    const inputs = { a: bi("40 Mio"), b: bi("2") };
    const { values, total } = computeRollup(nodes, ops, inputs);
    expect(values.a).toBe(40_000_000);
    expect(values.b).toBe(2);
    expect(values.p).toBe(80_000_000);
    expect(total).toBe(80_000_000); // one Oberast => total == its value
  });

  it("combines two top-level branches with the root operation", () => {
    const nodes = [n("A", "Stadt"), n("B", "Land")];
    const ops: Record<string, MathOp> = { [ROOT_OP_KEY]: "+" };
    const inputs = { A: bi("30"), B: bi("50") };
    const { total } = computeRollup(nodes, ops, inputs);
    expect(total).toBe(80);
  });

  it("folds subtraction left-to-right (order matters)", () => {
    const nodes = [n("p", "x", [n("a", ""), n("b", ""), n("c", "")])];
    const ops: Record<string, MathOp> = { p: "−" };
    const { values } = computeRollup(nodes, ops, { a: bi("100"), b: bi("30"), c: bi("20") });
    expect(values.p).toBe(50); // 100 - 30 - 20
  });

  it("folds division left-to-right", () => {
    const nodes = [n("p", "x", [n("a", ""), n("b", "")])];
    const ops: Record<string, MathOp> = { p: "÷" };
    const { values } = computeRollup(nodes, ops, { a: bi("100"), b: bi("4") });
    expect(values.p).toBe(25);
  });

  it("rolls up nested parents (Oberast with a sub-parent)", () => {
    // Markt = Bevölkerung(=Erw × Anteil) × Ausgaben
    const nodes = [
      n("root", "Markt", [
        n("bev", "Bevölkerung", [n("erw", "Erwachsene"), n("anteil", "Anteil")]),
        n("ausg", "Ausgaben"),
      ]),
    ];
    const ops: Record<string, MathOp> = { root: "×", bev: "×" };
    const inputs = { erw: bi("70 Mio"), anteil: bi("50 %"), ausg: bi("100") };
    const { values, total } = computeRollup(nodes, ops, inputs);
    expect(values.bev).toBe(35_000_000); // 70M × 0.5
    expect(values.root).toBe(3_500_000_000); // 35M × 100
    expect(total).toBe(3_500_000_000);
  });

  it("is null when a leaf is missing/unparseable", () => {
    const nodes = [n("p", "x", [n("a", ""), n("b", "")])];
    const ops: Record<string, MathOp> = { p: "×" };
    const { values, total } = computeRollup(nodes, ops, { a: bi("40") /* b missing */ });
    expect(values.p).toBeNull();
    expect(total).toBeNull();
  });

  it("is null when the root operation is unset for 2+ branches", () => {
    const nodes = [n("A", "Stadt"), n("B", "Land")];
    const { total } = computeRollup(nodes, {}, { A: bi("30"), B: bi("50") });
    expect(total).toBeNull();
  });
});
