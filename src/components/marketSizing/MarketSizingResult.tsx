import React from "react";
import { MarketSizingResult as MSResult } from "@/types/marketSizing";
import { DrillButton } from "@/components/ui/drill-button";
import { ArrowRight, CheckCircle, AlertTriangle, Star, TrendingUp, BookOpen } from "lucide-react";

interface MarketSizingResultProps {
  result: MSResult;
  onNext: () => void;
  onFinish: () => void;
}

const ScoreBar: React.FC<{ label: string; score: number; max: number }> = ({ label, score, max }) => {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 75 ? "bg-success" : pct >= 50 ? "bg-primary" : "bg-destructive";
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 text-right text-xs font-semibold text-foreground">{score}/{max}</span>
    </div>
  );
};

const MarketSizingResultView: React.FC<MarketSizingResultProps> = ({
  result, onNext, onFinish,
}) => {
  const eval_ = result.evaluation;
  if (!eval_) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="text-muted-foreground">Bewertung konnte nicht geladen werden.</p>
        <div className="flex gap-3">
          <DrillButton variant="inactive" onClick={onFinish}>
            Session beenden
          </DrillButton>
          <DrillButton variant="active" onClick={onNext}>
            Neuer Case →
          </DrillButton>
        </div>
      </div>
    );
  }

  const scoreColor = eval_.total_score >= 75 ? "text-success" : eval_.total_score >= 50 ? "text-primary" : "text-destructive";

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Overall Score */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl font-bold">{eval_.total_score >= 80 ? "🎯" : eval_.total_score >= 60 ? "💪" : "📈"}</span>
        <span className={`text-4xl font-bold ${scoreColor}`}>{eval_.total_score}/100</span>
        <p className="text-sm text-muted-foreground text-center max-w-md">{eval_.one_line_summary}</p>
        {eval_.flagged && (
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
            <AlertTriangle className="h-3 w-3" /> Plausibilität unsicher
          </div>
        )}
      </div>

      {/* Score Breakdown */}
      <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" /> Bewertung nach Rubrik
        </h3>
        <ScoreBar label="Struktur & MECE" score={eval_.scores.structure_mece} max={35} />
        <ScoreBar label="Annahmen" score={eval_.scores.assumptions} max={25} />
        <ScoreBar label="Math. Konsistenz" score={eval_.scores.math_consistency} max={20} />
        <ScoreBar label="Plausibilität" score={eval_.scores.plausibility_sanity} max={20} />
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eval_.strengths.length > 0 && (
          <div className="rounded-xl border border-success/20 bg-success/5 p-4">
            <h4 className="text-sm font-semibold text-success flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4" /> Stärken
            </h4>
            <ul className="space-y-1">
              {eval_.strengths.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground">• {s}</li>
              ))}
            </ul>
          </div>
        )}
        {eval_.improvements.length > 0 && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4" /> Verbesserungen
            </h4>
            <ul className="space-y-1">
              {eval_.improvements.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground">• {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Red Flags */}
      {eval_.red_flags && eval_.red_flags.length > 0 && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <h4 className="text-sm font-semibold text-destructive flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4" /> Red Flags
          </h4>
          <ul className="space-y-1">
            {eval_.red_flags.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reference Structure */}
      {result.case.reference_structure && (
        <details className="rounded-xl border border-border p-4">
          <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Beispiel-Lösungsweg anzeigen
          </summary>
          <p className="mt-3 text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
            {result.case.reference_structure}
          </p>
        </details>
      )}

      {/* Next / Finish */}
      <div className="flex justify-center gap-4 pt-2">
        <DrillButton variant="inactive" size="lg" onClick={onFinish} className="gap-2">
          Session beenden
        </DrillButton>
        <DrillButton variant="active" size="lg" onClick={onNext} className="gap-2">
          Neuer Case <ArrowRight className="h-4 w-4" />
        </DrillButton>
      </div>
    </div>
  );
};

export default MarketSizingResultView;
