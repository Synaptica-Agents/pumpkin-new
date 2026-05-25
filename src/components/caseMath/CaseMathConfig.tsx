import React from "react";
import { CaseMathCategory } from "@/types/caseMath";
import { SprintDuration } from "@/types/drill";
import { DifficultyLevel } from "@/components/DifficultySelector";
import { ArrowRight, Pencil } from "lucide-react";
import ConfigRow from "@/components/drillConfig/ConfigRow";
import OptionTile from "@/components/drillConfig/OptionTile";
import Chip from "@/components/drillConfig/Chip";
import Divider from "@/components/drillConfig/Divider";

interface CaseMathConfigProps {
  duration: SprintDuration;
  onDurationChange: (duration: SprintDuration) => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (level: DifficultyLevel) => void;
  selectedCategories: CaseMathCategory[];
  onCategoriesChange: (categories: CaseMathCategory[]) => void;
  onStart: () => void;
}

const durationOptions: { value: SprintDuration; label: string; description: string }[] = [
  { value: 120, label: "2 Min", description: "Schneller Sprint" },
  { value: 300, label: "5 Min", description: "Standard" },
  { value: 600, label: "10 Min", description: "Marathon" },
];

const difficultyLevels: { level: DifficultyLevel; label: string; description: string }[] = [
  { level: 1, label: "Einfach", description: "1-Schritt, runde Zahlen" },
  { level: 2, label: "Mittel", description: "2-Schritt, k/Mio Notation" },
  { level: 3, label: "Schwer", description: "Multi-Step, Ablenkungen" },
];

const categoryOptions: { category: CaseMathCategory; label: string }[] = [
  { category: "profitability", label: "Profitabilität" },
  { category: "investment", label: "Investment (ROI)" },
  { category: "breakeven", label: "Break-even" },
];

const CaseMathConfig: React.FC<CaseMathConfigProps> = ({
  duration,
  onDurationChange,
  difficulty,
  onDifficultyChange,
  selectedCategories,
  onCategoriesChange,
  onStart,
}) => {
  const handleCategoryToggle = (category: CaseMathCategory) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        onCategoriesChange(selectedCategories.filter((c) => c !== category));
      }
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const selectAllCategories = () => {
    onCategoriesChange(categoryOptions.map((c) => c.category));
  };

  const allSelected = selectedCategories.length === categoryOptions.length;

  const durationLabel = durationOptions.find((o) => o.value === duration)?.label ?? "";
  const difficultyLabel = difficultyLevels.find((d) => d.level === difficulty)?.label ?? "";
  const catCount = selectedCategories.length;
  const summary = `${durationLabel.toUpperCase()} · ${difficultyLabel.toUpperCase()} · ${catCount} ${catCount === 1 ? "KATEGORIE" : "KATEGORIEN"}`;

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
              width={190}
            />
          ))}
        </div>
      </ConfigRow>
      <Divider />

      <ConfigRow label="Kategorien" caption="Mehrfachauswahl möglich.">
        <div className="flex flex-wrap gap-2">
          <Chip selected={allSelected} onClick={selectAllCategories}>
            Alle
          </Chip>
          {categoryOptions.map(({ category, label }) => (
            <Chip
              key={category}
              selected={!allSelected && selectedCategories.includes(category)}
              onClick={() => handleCategoryToggle(category)}
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

export default CaseMathConfig;
