import React from "react";
import { DrillButton } from "@/components/ui/drill-button";
import { SprintResult, SprintStats } from "@/types/drill";
import { Trophy, Target, Zap, Check, X, Lightbulb, RotateCcw } from "lucide-react";

interface SprintDebriefProps {
  stats: SprintStats;
  results: SprintResult[];
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
  return num.toLocaleString('de-DE', { maximumFractionDigits: 2 });
};

// Parse markdown-style bold text to React elements
const parseStepText = (text: string): React.ReactNode => {
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

const SprintDebrief: React.FC<SprintDebriefProps> = ({ stats, results, onRestart }) => {
  const getDurationLabel = (seconds: number): string => {
    if (seconds === 120) return "2 Minuten";
    if (seconds === 300) return "5 Minuten";
    if (seconds === 600) return "10 Minuten";
    return `${Math.floor(seconds / 60)} Minuten`;
  };

  const getPerformanceEmoji = (): string => {
    if (stats.accuracyPercent >= 90 && stats.tasksPerMinute >= 5) return "🏆";
    if (stats.accuracyPercent >= 80) return "🎯";
    if (stats.accuracyPercent >= 60) return "💪";
    return "📈";
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl">{getPerformanceEmoji()}</span>
        <h2 className="mt-2 text-2xl font-bold text-foreground">Sprint beendet!</h2>
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
              <div className="flex items-center gap-3 px-4 py-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    result.isCorrect ? "bg-success" : "bg-destructive"
                  }`}
                >
                  {result.isCorrect ? (
                    <Check className="h-4 w-4 text-success-foreground" />
                  ) : (
                    <X className="h-4 w-4 text-destructive-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-mono text-sm font-medium text-foreground">
                    {result.task.question}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">
                      Deine Antwort: <span className={result.isCorrect ? "text-success" : "text-destructive"}>{result.userAnswer}</span>
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

                <span className="text-xs text-muted-foreground font-mono">
                  {(result.timeSpent / 1000).toFixed(1)}s
                </span>
              </div>

              {/* Shortcut Tip */}
              <div className="bg-card/50 px-4 py-2 border-t border-border/30">
                <div className="space-y-1">
                  {result.task.shortcut.steps.map((step, stepIndex) => (
                    <p key={stepIndex} className="text-xs text-muted-foreground">
                      {parseStepText(step)}
                    </p>
                  ))}
                </div>
              </div>
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

export default SprintDebrief;
