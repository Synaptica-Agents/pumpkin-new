import React from "react";
import { DrillButton } from "@/components/ui/drill-button";

export type DifficultyLevel = 1 | 2 | 3;

interface DifficultySelectorProps {
  selectedLevel: DifficultyLevel;
  onLevelChange: (level: DifficultyLevel) => void;
}

const difficultyLevels: { level: DifficultyLevel; label: string; description: string }[] = [
  {
    level: 1,
    label: "Einfach",
    description: "Sofort im Kopf lösbar"
  },
  {
    level: 2,
    label: "Mittel",
    description: "Mit Shortcut lösbar"
  },
  {
    level: 3,
    label: "Schwer",
    description: "Stift & Papier nötig"
  },
];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedLevel,
  onLevelChange,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-muted-foreground">Wähle dein Start-Level:</p>
      <div className="flex flex-wrap justify-center gap-3">
        {difficultyLevels.map(({ level, label, description }) => (
          <button
            key={level}
            onClick={() => onLevelChange(level)}
            className={`flex flex-col items-center rounded-xl border-2 px-6 py-4 transition-all ${
              selectedLevel === level
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <span className="text-lg font-bold">{label}</span>
            <span className="mt-1 text-xs opacity-80">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
