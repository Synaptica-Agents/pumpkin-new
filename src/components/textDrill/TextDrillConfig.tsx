import React from "react";
import { SprintDuration } from "@/types/drill";
import { DrillConfig } from "@/types/textDrill";
import { Info } from "lucide-react";
import OptionTile from "@/components/drillConfig/OptionTile";
import Chip from "@/components/drillConfig/Chip";
import DrillWizard, { WizardStep } from "@/components/drillConfig/DrillWizard";

interface TextDrillConfigProps {
  config: DrillConfig;
  duration: SprintDuration;
  onDurationChange: (d: SprintDuration) => void;
  difficulty: "easy" | "medium" | "hard";
  onDifficultyChange: (d: "easy" | "medium" | "hard") => void;
  categories: string[];
  onCategoriesChange: (c: string[]) => void;
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
  categories,
  onCategoriesChange,
  onStart,
}) => {
  const isSprint = config.sprintMode !== false;
  const allValues = config.categories.map((c) => c.value);
  const allSelected = categories.includes("all") || categories.length === allValues.length;

  const handleAllToggle = () => {
    onCategoriesChange(["all"]);
  };

  const handleCategoryToggle = (value: string) => {
    // If "all" was active, switch to explicit list with just this value
    if (categories.includes("all")) {
      onCategoriesChange([value]);
      return;
    }
    if (categories.includes(value)) {
      if (categories.length > 1) {
        onCategoriesChange(categories.filter((c) => c !== value));
      }
    } else {
      onCategoriesChange([...categories, value]);
    }
  };

  const steps: WizardStep[] = [];

  if (isSprint) {
    steps.push({
      label: "Sprint-Dauer",
      caption: "Wie lange möchtest du trainieren?",
      content: (
        <div className="flex flex-col gap-3">
          {durationOptions.map(({ value, label, desc }) => (
            <OptionTile
              key={value}
              variant="wizard"
              selected={duration === value}
              onClick={() => onDurationChange(value)}
              big={label}
              small={desc}
            />
          ))}
        </div>
      ),
    });
  }

  steps.push({
    label: "Schwierigkeit",
    caption: "Welches Niveau fordert dich heute?",
    content: (
      <div className="flex flex-col gap-3">
        {config.difficultyOptions.map(({ value, label, desc }) => (
          <OptionTile
            key={value}
            variant="wizard"
            selected={difficulty === value}
            onClick={() => onDifficultyChange(value)}
            big={label}
            small={desc}
          />
        ))}
      </div>
    ),
  });

  steps.push({
    label: config.categoryLabel,
    caption: "Mehrfachauswahl möglich.",
    canAdvance: categories.length > 0,
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Chip selected={allSelected} onClick={handleAllToggle}>
            Alle
          </Chip>
          {config.categories.map(({ value, label }) => (
            <Chip
              key={value}
              selected={!allSelected && categories.includes(value)}
              onClick={() => handleCategoryToggle(value)}
            >
              {label}
            </Chip>
          ))}
        </div>
        <div className="flex items-start gap-3 rounded-[10px] border border-white/[0.06] bg-[#101013] px-4 py-3.5">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <div className="text-[13px] leading-[1.5] text-foreground/70">{config.hintText}</div>
        </div>
      </div>
    ),
  });

  return <DrillWizard steps={steps} onComplete={onStart} startLabel={config.startButtonText} />;
};

export default TextDrillConfig;
