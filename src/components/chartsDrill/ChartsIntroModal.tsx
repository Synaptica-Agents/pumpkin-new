import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DrillButton } from "@/components/ui/drill-button";
import { Award, BarChart3 } from "lucide-react";

interface RubricLabel {
  key: string;
  label: string;
  max: number;
}

interface ChartsIntroModalProps {
  open: boolean;
  onClose: () => void;
  rubricLabels: RubricLabel[];
}

const STEPS = [
  "Exhibit ansehen — Tabelle oder Diagramm wie im echten Case-Interview, inklusive Zusatzinfos.",
  "Interpretation schreiben: Hauptaussage + 2–3 Key Insights mit Zahlen — und dazu mögliche Ursachen auffälliger Trends sowie dein 'So what' fürs Business. Alle vier Punkte fließen in die Bewertung ein.",
  "Danach erscheinen 1–2 konkrete Fragen — rechnen, kurz antworten, abgeben.",
  "Die KI bewertet beides zusammen und zeigt dir die Lösung mit Rechenweg.",
];

const ChartsIntroModal: React.FC<ChartsIntroModalProps> = ({ open, onClose, rubricLabels }) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> So funktioniert der Diagramme-Drill
          </DialogTitle>
        </DialogHeader>

        <section className="mt-2">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            So läuft der Drill — wie im echten Interview
          </h3>
          <ol className="space-y-1 text-sm text-foreground">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-semibold text-primary">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-muted-foreground">
            Wichtig: Die Fragen sind erst nach deiner Interpretation sichtbar — genau wie ein
            Interviewer erst fragt "Was siehst du?", bevor er nachhakt.
          </p>
        </section>

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
          Runden ist ausdrücklich erlaubt — im Interview zählt der Rechenweg, nicht die dritte Nachkommastelle.
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

export default ChartsIntroModal;
