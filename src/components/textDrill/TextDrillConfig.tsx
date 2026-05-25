import React from "react";
import { SprintDuration } from "@/types/drill";
import { DrillConfig } from "@/types/textDrill";
import { ArrowRight, Info } from "lucide-react";
import ConfigRow from "@/components/drillConfig/ConfigRow";
import OptionTile from "@/components/drillConfig/OptionTile";
import Chip from "@/components/drillConfig/Chip";
import Divider from "@/components/drillConfig/Divider";

interface TextDrillConfigProps {
  config: DrillConfig;
  duration: SprintDuration;
  onDurationChange: (d: SprintDuration) => void;
  difficulty: "easy" | "medium" | "hard";
  onDifficultyChange: (d: "easy" | "medium" | "hard") => void;
  category: string;
  onCategoryChange: (c: string) => void;
  onStart: () => void;
}

const durationOptions: { value: SprintDuration; label: string; desc: string }[] = [
  { value: 120, label: "2 Min", desc: "Schneller Sprint" },
  { value: 300, label: "5 Min", desc: "Standard" },
  { value: 600, label: "10 Min", desc: "Marathon" },
];

const TextDrillConfig: React.FC<TextDrillConfigProps> = ({
  config,
  duration,
  onDurationChange,
  difficulty,
  onDifficultyChange,
  category,
  onCategoryChange,
  onStart,
}) => {
  const isSprint = config.sprintMode !== false;

  const durationLabel = durationOptions.find((o) => o.value === duration)?.label ?? "";
  const difficultyLabel = config.difficultyOptions.find((d) => d.value === difficulty)?.label ?? "";
  const categoryLabel =
    category === "all"
      ? "ALLE"
      : (config.categories.find((c) => c.value === category)?.label ?? "").toUpperCase();

  const summary = isSprint
    ? `${durationLabel.toUpperCase()} · ${difficultyLabel.toUpperCase()} · ${categoryLabel}`
    : `${difficultyLabel.toUpperCase()} · ${categoryLabel}`;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d10] p-8">
      {isSprint && (
        <>
          <ConfigRow label="Sprint-Dauer" caption="Wie lange möchtest du trainieren?">
            <div className="flex flex-wrap gap-2.5">
              {durationOptions.map(({ value, label, desc }) => (
                <OptionTile
                  key={value}
                  selected={duration === value}
                  onClick={() => onDurationChange(value)}
                  big={label}
                  small={desc}
                  width={150}
                />
              ))}
            </div>
          </ConfigRow>
          <Divider />
        </>
      )}

      <ConfigRow label="Schwierigkeit" caption="Welches Niveau fordert dich heute?">
        <div className="flex flex-wrap gap-2.5">
          {config.difficultyOptions.map(({ value, label, desc }) => (
            <OptionTile
              key={value}
              selected={difficulty === value}
              onClick={() => onDifficultyChange(value)}
              big={label}
              small={desc}
              width={190}
            />
          ))}
        </div>
      </ConfigRow>
      <Divider />

      <ConfigRow label={config.categoryLabel} caption="Ein Thema wählen oder alle Kategorien.">
        <div className="flex flex-wrap gap-2">
          <Chip selected={category === "all"} onClick={() => onCategoryChange("all")}>
            Alle
          </Chip>
          {config.categories.map(({ value, label }) => (
            <Chip
              key={value}
              selected={category === value}
              onClick={() => onCategoryChange(value)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </ConfigRow>
      <Divider />

      {/* Hint */}
      <div className="mt-4 flex items-start gap-3 rounded-[10px] border border-white/[0.06] bg-[#101013] px-4 py-3.5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="text-[13px] leading-[1.5] text-foreground/70">{config.hintText}</div>
      </div>

      {/* Footer */}
      <div className="mt-7 flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground/60">
          {summary}
        </div>
        <button
          onClick={onStart}
          className="flex items-center gap-2 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {config.startButtonText} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default TextDrillConfig;
