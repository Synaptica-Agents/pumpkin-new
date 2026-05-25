import { describe, it, expect } from "vitest";
import { normalizeTaskString } from "@/lib/normalizeTaskString";

describe("normalizeTaskString", () => {
  it("attaches k suffix without space", () => {
    expect(normalizeTaskString("90 k x 10")).toBe("90k x 10");
    expect(normalizeTaskString("900 K x 10")).toBe("900k x 10");
  });

  it("attaches Mio/Mrd suffix without space", () => {
    expect(normalizeTaskString("9 Mio x 10")).toBe("9Mio x 10");
    expect(normalizeTaskString("2 Mrd x 5")).toBe("2Mrd x 5");
  });

  it("formats plain integers >= 1000 with dots", () => {
    expect(normalizeTaskString("9000 x 10")).toBe("9.000 x 10");
    expect(normalizeTaskString("50000000 x 20")).toBe("50.000.000 x 20");
  });

  it("fixes incorrect dot placement", () => {
    expect(normalizeTaskString("9000.000 x 10")).toBe("9.000.000 x 10");
  });

  it("converts decimal point to comma before Mio/Mrd", () => {
    expect(normalizeTaskString("0.5Mio x 10")).toBe("0,5Mio x 10");
    expect(normalizeTaskString("1.5 Mrd x 2")).toBe("1,5Mrd x 2");
  });

  it("normalizes multiplication sign spacing", () => {
    expect(normalizeTaskString("90k x20")).toBe("90k x 20");
    expect(normalizeTaskString("90k×20")).toBe("90k x 20");
    expect(normalizeTaskString("90k  x  20")).toBe("90k x 20");
  });

  it("handles combined rules", () => {
    expect(normalizeTaskString("9000 K  x100")).toBe("9.000k x 100");
  });
});
