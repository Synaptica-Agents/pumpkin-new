import { describe, it, expect } from "vitest";
import { checkAnswer, generateTask, resetTaskHistory } from "@/lib/taskGenerator";

// 33%/66%-Aufgaben: die ⅓/⅔-Approximation ist die Hauptantwort,
// die exakte Prozentrechnung steht in altAnswers — beides muss zählen.
describe("checkAnswer mit altAnswers (33%/66%-Drittel-Aufgaben)", () => {
  const approx = 60_000_000; // ⅓ von 180 Mio
  const exact = 59_400_000; // 33% von 180 Mio

  it("akzeptiert die Approximation (60 Mio)", () => {
    expect(checkAnswer(60_000_000, approx, false, undefined, [exact])).toBe(true);
  });

  it("akzeptiert die exakte Antwort (59,4 Mio)", () => {
    expect(checkAnswer(59_400_000, approx, false, undefined, [exact])).toBe(true);
  });

  it("akzeptiert die exakte Antwort auch als String-Eingabe", () => {
    expect(checkAnswer("59400000", approx, false, undefined, [exact])).toBe(true);
  });

  it("lehnt andere Werte weiterhin ab", () => {
    expect(checkAnswer(59_000_000, approx, false, undefined, [exact])).toBe(false);
    expect(checkAnswer(61_000_000, approx, false, undefined, [exact])).toBe(false);
  });

  it("verhält sich ohne altAnswers wie bisher", () => {
    expect(checkAnswer(60_000_000, approx)).toBe(true);
    expect(checkAnswer(59_400_000, approx)).toBe(false);
  });

  it("66%: ⅔ (120 Mio) und exakt (118,8 Mio) sind beide richtig", () => {
    const approx66 = 120_000_000;
    const exact66 = 118_800_000;
    expect(checkAnswer(120_000_000, approx66, false, undefined, [exact66])).toBe(true);
    expect(checkAnswer(118_800_000, approx66, false, undefined, [exact66])).toBe(true);
    expect(checkAnswer(119_500_000, approx66, false, undefined, [exact66])).toBe(false);
  });

  it("k-Basis: 33% von 90k — 30k (⅓) und 29,7k (exakt) zählen beide", () => {
    expect(checkAnswer(30_000, 30_000, false, undefined, [29_700])).toBe(true);
    expect(checkAnswer(29_700, 30_000, false, undefined, [29_700])).toBe(true);
  });

  it("generierte 33%/66%-Aufgaben tragen die exakte Antwort als altAnswer", () => {
    let found = 0;
    for (let i = 0; i < 3000 && found < 5; i++) {
      if (i % 200 === 0) resetTaskHistory();
      const task = generateTask("percentage", 2);
      const m = task.question.match(/^(33|66)% von/);
      if (!m) continue;
      found++;
      expect(task.altAnswers, task.question).toBeDefined();
      const exact = task.altAnswers![0];
      // Beide Wege werden akzeptiert, wie im UI aufgerufen (mit task.altAnswers):
      expect(checkAnswer(task.answer, task.answer, false, task.tolerance, task.altAnswers)).toBe(true);
      expect(checkAnswer(exact, task.answer, false, task.tolerance, task.altAnswers)).toBe(true);
      // Und die exakte Antwort ist wirklich pct/100 × Basis (≠ Approximation):
      expect(Math.abs(exact - task.answer)).toBeGreaterThan(0);
    }
    expect(found).toBeGreaterThan(0);
  });
});
