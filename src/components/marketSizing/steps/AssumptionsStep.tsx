import React, { useState } from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { BoxInput, BoxKind, MathOp } from "@/types/marketSizing";
import {
  getLeaves,
  formatGermanNumber,
  parseGermanNumber,
  isLeafComplete,
  DEFAULT_BOX_KIND,
} from "@/lib/marketSizingHelpers";
import StaticTree from "./StaticTree";
import { MousePointerClick } from "lucide-react";

interface AssumptionsStepProps {
  nodes: FrameworkNode[];
  boxInputs: Record<string, BoxInput>;
  operations: Record<string, MathOp>;
  onChange: (boxInputs: Record<string, BoxInput>) => void;
  disabled: boolean;
}

const KIND_OPTIONS: { value: BoxKind; label: string; hint: string }[] = [
  { value: "annahme", label: "Annahme", hint: "geschätzt — kurz begründen" },
  { value: "fakt", label: "Fakt", hint: "bekannt — nur die Zahl" },
  { value: "rechnung", label: "Rechnung", hint: "z.B. „80 Mio / 4“" },
];

const AssumptionsStep: React.FC<AssumptionsStepProps> = ({
  nodes,
  boxInputs,
  operations,
  onChange,
  disabled,
}) => {
  const leaves = getLeaves(nodes);
  const [selectedId, setSelectedId] = useState<string | null>(leaves[0]?.id ?? null);

  // Selection may only target leaves; ignore clicks on parent boxes.
  const handleSelect = (id: string) => {
    if (leaves.some((l) => l.id === id)) setSelectedId(id);
  };

  const selected = leaves.find((n) => n.id === selectedId) ?? null;
  const selectedInput = selectedId ? boxInputs[selectedId] : undefined;
  const kind: BoxKind = selectedInput?.kind ?? DEFAULT_BOX_KIND;

  const update = (patch: Partial<BoxInput>) => {
    if (!selectedId) return;
    const prev = boxInputs[selectedId] ?? { assumption: "", value: "", kind: DEFAULT_BOX_KIND };
    onChange({ ...boxInputs, [selectedId]: { ...prev, ...patch } });
  };

  const parsedValue = parseGermanNumber(selectedInput?.value ?? "");
  const openCount = leaves.filter((n) => !isLeafComplete(boxInputs[n.id])).length;

  const showText = kind !== "fakt";
  const textLabel = kind === "rechnung" ? "Rechnung" : "Annahme";
  const textPlaceholder =
    kind === "rechnung"
      ? "z.B. 80 Mio / 4 = 20 Mio Haushalte"
      : "z.B. ca. 80 Mio Einwohner in DE (Statistisches Bundesamt)";

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-foreground">3. Annahmen &amp; Zahlen</h2>
        <p className="text-xs text-muted-foreground">
          Trag die Zahlen nur auf den <span className="font-medium">untersten Boxen</span> ein —
          Eltern-Boxen ergeben sich als Rechnung aus ihren Unterästen. Wähl pro Box einen Typ:
          Annahme (begründen), Fakt (nur Zahl) oder Rechnung. Boxen mit{" "}
          <span className="font-medium text-destructive">!</span> fehlen noch.
        </p>
      </div>

      {leaves.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Keine Box gefunden. Geh zurück zu Schritt 2 und vergib mindestens einen Titel.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Static tree — full width */}
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <StaticTree
              nodes={nodes}
              boxInputs={boxInputs}
              operations={operations}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>

          {/* Editor panel */}
          <div className="rounded-xl border border-border bg-card p-4">
            {selected ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Ausgewählte Box
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {selected.labelChain}
                    </p>
                  </div>
                  <p className="shrink-0 text-[11px] text-muted-foreground">
                    {openCount === 0
                      ? "Alle Boxen ausgefüllt ✓"
                      : `Noch ${openCount} Box${openCount === 1 ? "" : "en"} offen`}
                  </p>
                </div>

                {/* Type switcher */}
                <div className="flex flex-wrap items-center gap-2">
                  {KIND_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update({ kind: opt.value })}
                      disabled={disabled}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition-colors disabled:opacity-40 ${
                        kind === opt.value
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                      title={opt.hint}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <span className="text-[10px] text-muted-foreground">
                    {KIND_OPTIONS.find((o) => o.value === kind)?.hint}
                  </span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  {showText && (
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                        {textLabel}
                      </label>
                      <textarea
                        value={selectedInput?.assumption ?? ""}
                        onChange={(e) => update({ assumption: e.target.value })}
                        placeholder={textPlaceholder}
                        rows={2}
                        className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={disabled}
                      />
                    </div>
                  )}
                  <div className={showText ? "sm:w-48 sm:shrink-0" : "sm:w-64"}>
                    <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                      {kind === "rechnung" ? "Ergebnis (Zahl)" : "Zahl"}
                    </label>
                    <input
                      type="text"
                      value={selectedInput?.value ?? ""}
                      onChange={(e) => update({ value: e.target.value })}
                      placeholder="z.B. 80 Mio, 20 %, 1/3"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={disabled}
                    />
                    {parsedValue != null && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Verstanden als:{" "}
                        <span className="font-medium text-foreground">
                          {formatGermanNumber(parsedValue)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-6 text-center text-sm text-muted-foreground">
                <MousePointerClick className="h-5 w-5 text-muted-foreground/60" />
                Wähle oben eine unterste Box, um Typ, Annahme und Zahl einzutragen.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssumptionsStep;
