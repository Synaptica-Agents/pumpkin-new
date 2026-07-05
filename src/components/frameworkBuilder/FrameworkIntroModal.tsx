import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DrillButton } from "@/components/ui/drill-button";
import { Star, Award, ListTree } from "lucide-react";

interface RubricLabel {
  key: string;
  label: string;
  max: number;
}

interface FrameworkIntroModalProps {
  open: boolean;
  onClose: () => void;
  rubricLabels: RubricLabel[];
  structureGuide?: string[];
}

const FrameworkIntroModal: React.FC<FrameworkIntroModalProps> = ({
  open,
  onClose,
  rubricLabels,
  structureGuide,
}) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListTree className="h-5 w-5 text-primary" /> So funktioniert der Frameworks-Drill
          </DialogTitle>
        </DialogHeader>

        {/* Structure guide */}
        {structureGuide && structureGuide.length > 0 && (
          <section className="mt-2">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              So läuft der Drill — wie im echten Interview
            </h3>
            <ol className="space-y-1 text-sm text-foreground">
              {structureGuide.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-primary">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              Der KI-Interviewer beantwortet Rückfragen nur, wenn es dazu Informationen gibt —
              sonst sagt er dir das offen. Genau wie ein echter Interviewer.
            </p>
          </section>
        )}

        {/* Priority mechanic */}
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Priorisierung
          </h3>
          <p className="flex items-start gap-2 text-sm text-foreground">
            <Star className="mt-0.5 h-4 w-4 shrink-0 fill-primary text-primary" />
            <span>
              Markiere mit dem Stern neben dem Titel bis zu 2 Hauptäste als{" "}
              <strong>Top-Priorität</strong>. Der Stern signalisiert, welche Hebel du im Interview
              zuerst vertiefen würdest – das fließt direkt in die Bewertung ein.
            </span>
          </p>
        </section>

        {/* Rubric */}
        {rubricLabels.length > 0 && (
          <section>
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Award className="h-3.5 w-3.5" /> Bewertungskriterien (100 Pkt total)
            </h3>
            <div className="flex flex-wrap gap-2">
              {rubricLabels.map(({ key, label, max }) => (
                <div
                  key={key}
                  className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-xs"
                >
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="text-muted-foreground">({max} Pkt)</span>
                </div>
              ))}
            </div>
          </section>
        )}

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

export default FrameworkIntroModal;
