import React from "react";
import { TaskType, SprintDuration } from "@/types/drill";
import { DifficultyLevel } from "@/components/DifficultySelector";
import { ArrowRight, Pencil } from "lucide-react";
import ConfigRow from "@/components/drillConfig/ConfigRow";
import OptionTile from "@/components/drillConfig/OptionTile";
import Chip from "@/components/drillConfig/Chip";
import Divider from "@/components/drillConfig/Divider";

interface SprintConfigProps {
  duration: SprintDuration;
  onDurationChange: (duration: SprintDuration) => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (level: DifficultyLevel) => void;
  selectedTypes: TaskType[];
  onTypesChange: (types: TaskType[]) => void;
  onStart: () => void;
}

const durationOptions: { value: SprintDuration; label: string; description: string }[] = [
  { value: 120, label: "2 Min", description: "Schneller Sprint" },
  { value: 300, label: "5 Min", description: "Standard" },
  { value: 600, label: "10 Min", description: "Marathon" },
];

const difficultyLevels: { level: DifficultyLevel; label: string; description: string }[] = [
  { level: 1, label: "Einfach", description: "Sofort im Kopf" },
  { level: 2, label: "Mittel", description: "Mit Shortcut lösbar" },
  { level: 3, label: "Schwer", description: "Stift & Papier" },
];

const taskTypeOptions: { type: TaskType; label: string }[] = [
  { type: "multiplication", label: "Multiplikation" },
  { type: "percentage", label: "Prozentrechnung" },
  { type: "division", label: "Division" },
  { type: "zeros", label: "Nullen-Management" },
];

const SprintConfig: React.FC<SprintConfigProps> = ({
  duration,
  onDurationChange,
  difficulty,
  onDifficultyChange,
  selectedTypes,
  onTypesChange,
  onStart,
}) => {
  const handleTypeToggle = (type: TaskType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        onTypesChange(selectedTypes.filter((t) => t !== type));
      }
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const selectAllTypes = () => {
    onTypesChange(taskTypeOptions.map((t) => t.type));
  };

  const allSelected = selectedTypes.length === taskTypeOptions.length;

  const durationLabel = durationOptions.find((o) => o.value === duration)?.label ?? "";
  const difficultyLabel = difficultyLevels.find((d) => d.level === difficulty)?.label ?? "";
  const typeCount = selectedTypes.length;
  const summary = `${durationLabel.toUpperCase().replace(" ", " ")} · ${difficultyLabel.toUpperCase()} · ${typeCount} ${typeCount === 1 ? "TYP" : "TYPEN"}`;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d10] p-8">
      <ConfigRow label="Sprint-Dauer" caption="Wie lange möchtest du trainieren?">
        <div className="flex flex-wrap gap-2.5">
          {durationOptions.map(({ value, label, description }) => (
            <OptionTile
              key={value}
              selected={duration === value}
              onClick={() => onDurationChange(value)}
              big={label}
              small={description}
              width={150}
            />
          ))}
        </div>
      </ConfigRow>
      <Divider />

      <ConfigRow label="Schwierigkeit" caption="Welches Niveau fordert dich heute?">
        <div className="flex flex-wrap gap-2.5">
          {difficultyLevels.map(({ level, label, description }) => (
            <OptionTile
              key={level}
              selected={difficulty === level}
              onClick={() => onDifficultyChange(level)}
              big={label}
              small={description}
              width={170}
            />
          ))}
        </div>
      </ConfigRow>
      <Divider />

      <ConfigRow label="Aufgabentypen" caption="Mehrfachauswahl möglich.">
        <div className="flex flex-wrap gap-2">
          <Chip selected={allSelected} onClick={selectAllTypes}>
            Alle
          </Chip>
          {taskTypeOptions.map(({ type, label }) => (
            <Chip
              key={type}
              selected={!allSelected && selectedTypes.includes(type)}
              onClick={() => handleTypeToggle(type)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </ConfigRow>
      <Divider />

      {/* Hint */}
      <div className="mt-4 flex items-start gap-3 rounded-[10px] border border-white/[0.06] bg-[#101013] px-4 py-3.5">
        <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <div className="text-[13px] leading-[1.5]">
          <span className="text-foreground/70">Nutze Stift &amp; Papier — kein Taschenrechner.</span>{" "}
          <span className="text-foreground/45">So übst du unter realen Interview-Bedingungen.</span>
        </div>
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
          Drill starten <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SprintConfig;
