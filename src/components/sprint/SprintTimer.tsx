import React from "react";
import { Timer } from "lucide-react";

interface SprintTimerProps {
  timeRemaining: number; // in seconds
  totalDuration: number; // in seconds
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const SprintTimer: React.FC<SprintTimerProps> = ({ timeRemaining, totalDuration }) => {
  const progress = (timeRemaining / totalDuration) * 100;
  const isLow = timeRemaining <= 30;
  const isCritical = timeRemaining <= 10;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Timer Display */}
      <div
        className={`flex items-center gap-2 rounded-full px-6 py-2 font-mono text-2xl font-bold transition-colors ${
          isCritical
            ? "bg-destructive/20 text-destructive animate-pulse"
            : isLow
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        }`}
      >
        <Timer className="h-5 w-5" />
        <span>{formatTime(timeRemaining)}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical
              ? "bg-destructive"
              : isLow
              ? "bg-destructive/70"
              : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default SprintTimer;
