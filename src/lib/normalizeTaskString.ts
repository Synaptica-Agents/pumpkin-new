/**
 * Normalizes a drill task string to a consistent format.
 *
 * Rules applied:
 * 1. Suffixes (k/K/Mio/Mrd) are attached directly to the number (no space).
 * 2. Plain integers ≥ 1000 get German thousand separators (dots).
 * 3. Decimal points before Mio/Mrd become commas (German style).
 * 4. Multiplication is always written as " x " with spaces.
 */
export function normalizeTaskString(task: string): string {
  let result = task.trim();

  // Step 4: Normalize multiplication sign first so we can work on each operand.
  // Replace × with x, then ensure " x " spacing.
  result = result.replace(/×/g, "x");
  // Normalize "x" surrounded by optional spaces to " x "
  result = result.replace(/\s*x\s*/gi, " x ");

  // Now process each "token" (operand) individually
  const parts = result.split(" x ");
  const normalized = parts.map((part) => normalizePart(part.trim()));
  return normalized.join(" x ");
}

function normalizePart(s: string): string {
  // Step 1: Attach suffixes directly to number, normalize K->k
  // Handle multiple spaces between number and suffix
  s = s.replace(/(\d)\s+(k|K)\b/g, (_, num) => `${num}k`);
  s = s.replace(/(\d)\s+(Mio)\b/g, "$1Mio");
  s = s.replace(/(\d)\s+(Mrd)\b/g, "$1Mrd");
  // Also normalize standalone K to k (when already attached)
  s = s.replace(/(\d)K\b/g, "$1k");

  // Step 3: Decimal point before Mio/Mrd -> comma
  s = s.replace(/(\d)\.(\d+)(Mio|Mrd)/g, "$1,$2$3");

  // Step 2: Fix thousand separators for plain integers (no suffix like k/Mio/Mrd)
  // First handle numbers that already have some dots but incorrect placement
  // e.g. "9000.000" should become "9.000.000"
  // We match sequences of digits and dots
  // and NOT containing a comma (decimals).
  s = s.replace(/\b(\d[\d.]*\d)(k|Mio|Mrd)?\b/g, (match, numPart, suffix) => {
    const raw = numPart.replace(/\./g, "");
    if (/^\d+$/.test(raw) && parseInt(raw, 10) >= 1000) {
      return formatThousands(raw) + (suffix || "");
    }
    return match;
  });

  // Also handle standalone 4+ digit numbers not caught above
  s = s.replace(/\b(\d{4,})(k|Mio|Mrd)?\b/g, (match, numPart, suffix) => {
    return formatThousands(numPart) + (suffix || "");
  });

  return s;
}

function formatThousands(numStr: string): string {
  const n = parseInt(numStr, 10);
  if (isNaN(n) || n < 1000) return numStr;
  // German thousands separator
  return n.toLocaleString("de-DE");
}
