import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DrillButton } from "@/components/ui/drill-button";
import { Award, Globe, Calculator } from "lucide-react";

interface MarketSizingIntroModalProps {
  open: boolean;
  onClose: () => void;
}

const RUBRIC = [
  { label: "Struktur & MECE", pts: 35 },
  { label: "Annahmen", pts: 25 },
  { label: "Math. Konsistenz", pts: 20 },
  { label: "Plausibilität / Sanity Check", pts: 20 },
];

const STEPS = [
  "Struktur aufbauen: 2-4 MECE-Äste, die den Markt in rechenbare Teile zerlegen.",
  "Annahmen nennen: Pro Annahme kurz begründen, warum sie plausibel ist.",
  "Schritt-für-Schritt rechnen: Zahl × Zahl × Zahl, Einheiten mitführen.",
  "Ergebnis + Sanity Check: Finale Schätzung und eine schnelle Plausibilitätsprüfung.",
];

const MarketSizingIntroModal: React.FC<MarketSizingIntroModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> So funktioniert der Market-Sizing-Drill
          </DialogTitle>
        </DialogHeader>

        <section>
          <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Calculator className="h-3.5 w-3.5" /> Ablauf
          </h3>
          <ol className="space-y-1 text-sm text-foreground">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold text-primary">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Award className="h-3.5 w-3.5" /> Bewertungskriterien (100 Pkt total)
          </h3>
          <div className="flex flex-wrap gap-2">
            {RUBRIC.map(({ label, pts }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-xs"
              >
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-muted-foreground">({pts} Pkt)</span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-muted-foreground">
          Die KI bewertet interview-realistisch – nicht an der idealen Consulting-Master-Lösung.
        </p>

        <div className="flex justify-end pt-2">
          <DrillButton variant="active" onClick={onClose}>
            Los geht's →
          </DrillButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarketSizingIntroModal;
