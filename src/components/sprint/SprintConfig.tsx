import React from "react";
import { TaskType, SprintDuration } from "@/types/drill";
import { DifficultyLevel } from "@/components/DifficultySelector";
import { Pencil } from "lucide-react";
import OptionTile from "@/components/drillConfig/OptionTile";
import Chip from "@/components/drillConfig/Chip";
import DrillWizard, { WizardStep } from "@/components/drillConfig/DrillWizard";

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

  const steps: WizardStep[] = [
    {
      label: "Sprint-Dauer",
      caption: "Wie lange möchtest du trainieren?",
      content: (
        <div className="flex flex-col gap-3">
          {durationOptions.map(({ value, label, description }) => (
            <OptionTile
              key={value}
              variant="wizard"
              selected={duration === value}
              onClick={() => onDurationChange(value)}
              big={label}
              small={description}
            />
          ))}
        </div>
      ),
    },
    {
      label: "Schwierigkeit",
      caption: "Welches Niveau fordert dich heute?",
      content: (
        <div className="flex flex-col gap-3">
          {difficultyLevels.map(({ level, label, description }) => (
            <OptionTile
              key={level}
              variant="wizard"
              selected={difficulty === level}
              onClick={() => onDifficultyChange(level)}
              big={label}
              small={description}
            />
          ))}
        </div>
      ),
    },
    {
      label: "Aufgabentypen",
      caption: "Mehrfachauswahl möglich.",
      canAdvance: selectedTypes.length > 0,
      content: (
        <div className="flex flex-col gap-4">
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
          <div className="flex items-start gap-3 rounded-[10px] border border-white/[0.06] bg-[#101013] px-4 py-3.5">
            <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="text-[13px] leading-[1.5]">
              <span className="text-foreground/70">Nutze Stift &amp; Papier — kein Taschenrechner.</span>{" "}
              <span className="text-foreground/45">So übst du unter realen Interview-Bedingungen.</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return <DrillWizard steps={steps} onComplete={onStart} startLabel="Drill starten" />;
};

export default SprintConfig;
