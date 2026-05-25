import React from "react";
import { DrillButton } from "@/components/ui/drill-button";
import { CaseMathResult, CaseMathStats } from "@/types/caseMath";
import { Trophy, Target, Zap, Check, X, Lightbulb, RotateCcw } from "lucide-react";

interface CaseMathDebriefProps {
  stats: CaseMathStats;
  results: CaseMathResult[];
  onRestart: () => void;
}

const formatNumberDE = (num: number): string => {
  if (num >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    return val % 1 === 0 ? `${val} Mrd` : `${val.toFixed(1).replace('.', ',')} Mrd`;
  }
  if (num >= 1_000_000) {
    const val = num / 1_000_000;
    return val % 1 === 0 ? `${val} Mio` : `${val.toFixed(1).replace('.', ',')} Mio`;
  }
  if (Math.abs(num) < 1000 && !Number.isInteger(num)) {
    return num.toLocaleString('de-DE', { maximumFractionDigits: 2 });
  }
  return num.toLocaleString('de-DE');
};

// Parse markdown-style bold text to React elements
const parseHighlights = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={index} className="font-bold text-primary">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
};

const categoryLabels: Record<string, string> = {
  profitability: "Profitabilität",
  investment: "Investment",
  breakeven: "Break-even",
};

const CaseMathDebrief: React.FC<CaseMathDebriefProps> = ({ stats, results, onRestart }) => {
  const getDurationLabel = (seconds: number): string => {
    if (seconds === 120) return "2 Minuten";
    if (seconds === 300) return "5 Minuten";
    if (seconds === 600) return "10 Minuten";
    return `${Math.floor(seconds / 60)} Minuten`;
  };

  const getPerformanceEmoji = (): string => {
    if (stats.accuracyPercent >= 90 && stats.tasksPerMinute >= 3) return "🏆";
    if (stats.accuracyPercent >= 80) return "🎯";
    if (stats.accuracyPercent >= 60) return "💪";
    return "📈";
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl">{getPerformanceEmoji()}</span>
        <h2 className="mt-2 text-2xl font-bold text-foreground">Case Math Sprint beendet!</h2>
        <p className="text-muted-foreground">{getDurationLabel(stats.durationSeconds)} Sprint</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-4">
          <Target className="mb-2 h-6 w-6 text-primary" />
          <span className="text-3xl font-bold text-foreground">{stats.totalAttempted}</span>
          <span className="text-xs text-muted-foreground">Aufgaben</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-4">
          <Trophy className="mb-2 h-6 w-6 text-success" />
          <span className="text-3xl font-bold text-success">{stats.accuracyPercent}%</span>
          <span className="text-xs text-muted-foreground">Genauigkeit</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border bg-card/50 p-4">
          <Zap className="mb-2 h-6 w-6 text-primary" />
          <span className="text-3xl font-bold text-foreground">{stats.tasksPerMinute.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">pro Minute</span>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
        <div className="bg-muted/50 px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Detaillierte Auswertung
          </h3>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className={`border-b border-border/50 last:border-b-0 ${
                result.isCorrect ? "bg-success/5" : "bg-destructive/5"
              }`}
            >
              {/* Task Row */}
              <div className="flex items-start gap-3 px-4 py-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                    result.isCorrect ? "bg-success" : "bg-destructive"
                  }`}
                >
                  {result.isCorrect ? (
                    <Check className="h-4 w-4 text-success-foreground" />
                  ) : (
                    <X className="h-4 w-4 text-destructive-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs rounded bg-muted px-2 py-0.5 text-muted-foreground">
                      {categoryLabels[result.task.category]}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {parseHighlights(result.task.question)}
                  </p>
                  <div className="flex items-center gap-2 text-xs mt-2">
                    <span className="text-muted-foreground">
                      Deine Antwort: <span className={result.isCorrect ? "text-success font-medium" : "text-destructive font-medium"}>{result.userAnswer}</span>
                    </span>
                    {!result.isCorrect && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          Richtig: <span className="text-foreground font-medium">{formatNumberDE(result.task.answer)}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <span className="text-xs text-muted-foreground font-mono shrink-0">
                  {(result.timeSpent / 1000).toFixed(1)}s
                </span>
              </div>

              {/* Explanation from template or shortcut */}
              {(result.explanation || result.task.shortcut.name || result.task.shortcut.formula || result.task.shortcut.tip) && (
                <div className="bg-card/50 px-4 py-3 border-t border-border/30">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      {result.explanation && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium text-primary">Lösung:</span> {result.explanation}
                        </p>
                      )}
                      {result.task.shortcut.name && (
                        <p className="text-xs font-semibold text-primary mb-1">
                          {result.task.shortcut.name}
                        </p>
                      )}
                      {result.task.shortcut.formula && (
                        <p className="text-xs text-muted-foreground mb-1">
                          <span className="font-medium">Formel:</span> {result.task.shortcut.formula}
                        </p>
                      )}
                      {result.task.shortcut.tip && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Tip:</span> {result.task.shortcut.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex justify-center pt-2">
        <DrillButton variant="active" size="lg" onClick={onRestart} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Neuer Sprint
        </DrillButton>
      </div>
    </div>
  );
};

export default CaseMathDebrief;
