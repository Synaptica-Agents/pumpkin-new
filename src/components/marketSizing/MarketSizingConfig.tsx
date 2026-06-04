import React from "react";
import { DrillButton } from "@/components/ui/drill-button";

interface MarketSizingConfigProps {
  onStart: () => void;
}

const MarketSizingConfig: React.FC<MarketSizingConfigProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Hint */}
      <div className="mx-auto max-w-md rounded-lg border border-border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
        🧠 Market Sizing = Struktur + Annahmen + Plausibilität. Die KI bewertet deine Antwort nach fester Rubrik.
      </div>

      {/* Start */}
      <div className="flex justify-center pt-4">
        <DrillButton variant="active" size="lg" onClick={onStart} className="px-12 py-5 text-xl">
          Start Market Sizing →
        </DrillButton>
      </div>
    </div>
  );
};

export default MarketSizingConfig;
