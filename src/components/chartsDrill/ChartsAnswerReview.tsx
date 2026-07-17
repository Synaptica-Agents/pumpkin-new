import React from "react";
import { ChartQuestion } from "@/types/charts";
import { CheckCircle2, Calculator } from "lucide-react";

/**
 * Result-Baustein: pro Frage die eigene Antwort neben der Musterlösung
 * (+ Rechenweg). Die Muster-Interpretation zeigt der Standard-Result-View
 * unter "Beispiel-Lösung anzeigen".
 */
interface ChartsAnswerReviewProps {
  questions: ChartQuestion[];
  answers: string[];
}

const ChartsAnswerReview: React.FC<ChartsAnswerReviewProps> = ({ questions, answers }) => {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <CheckCircle2 className="h-4 w-4 text-primary" /> Fragen im Detail
      </h3>
      {questions.map((q, i) => (
        <div key={i} className="rounded-lg border border-border bg-muted/20 p-3.5">
          <p className="mb-2.5 text-sm font-medium text-foreground">
            <span className="mr-2 text-primary">Frage {i + 1}:</span>
            {q.text}
          </p>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            <div className="rounded-lg bg-background/60 p-2.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Deine Antwort
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {(answers[i] ?? "").trim() || "—"}
              </p>
            </div>
            <div className="rounded-lg border border-success/20 bg-success/5 p-2.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-success">
                Lösung
              </p>
              <p className="text-sm leading-relaxed text-foreground">{q.solution}</p>
            </div>
          </div>
          {q.calc && (
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <Calculator className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{q.calc}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChartsAnswerReview;
