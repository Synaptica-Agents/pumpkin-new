import React, { useState } from "react";
import { DrillButton } from "@/components/ui/drill-button";
import { MarketSizingCategory } from "@/types/marketSizing";
import { Boxes, TrendingUp, Ruler, Shuffle } from "lucide-react";

interface MarketSizingConfigProps {
  onStart: (category: MarketSizingCategory) => void;
}

const CATEGORIES: Array<{
  value: MarketSizingCategory;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "all",
    label: "Gemischt",
    description: "Alle Fragetypen bunt gemischt.",
    icon: <Shuffle className="h-5 w-5" />,
  },
  {
    value: "mengen",
    label: "Mengen & Bestände",
    description: "Wie viele … gibt es / werden gebraucht?",
    icon: <Boxes className="h-5 w-5" />,
  },
  {
    value: "maerkte",
    label: "Märkte & Umsätze",
    description: "Wie viel Umsatz / wie viel pro Jahr?",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    value: "physik",
    label: "Physik & Geometrie",
    description: "Wie schwer / wie groß / wie viel passt rein?",
    icon: <Ruler className="h-5 w-5" />,
  },
];

const MarketSizingConfig: React.FC<MarketSizingConfigProps> = ({ onStart }) => {
  const [category, setCategory] = useState<MarketSizingCategory>("all");

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Category choice */}
      <div>
        <h3 className="mb-3 text-center text-sm font-semibold text-foreground">
          Welche Art von Fragen möchtest du üben?
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const selected = category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  selected
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <span className={selected ? "text-primary" : "text-muted-foreground"}>
                  {cat.icon}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span
                    className={`text-sm font-semibold ${
                      selected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span className="text-xs leading-snug text-muted-foreground">
                    {cat.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start */}
      <div className="flex justify-center pt-2">
        <DrillButton
          variant="active"
          size="lg"
          onClick={() => onStart(category)}
          className="px-12 py-5 text-xl"
        >
          Start Market Sizing →
        </DrillButton>
      </div>
    </div>
  );
};

export default MarketSizingConfig;
