import React from "react";
import { Mic, Loader2 } from "lucide-react";
import { useAudioRecording } from "@/hooks/useAudioRecording";

interface AudioRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscript, disabled = false }) => {
  const { state, elapsed, start, stop } = useAudioRecording({ onTranscript });

  if (state === "transcribing") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Wird transkribiert…
      </div>
    );
  }

  if (state === "recording") {
    return (
      <button
        type="button"
        onClick={stop}
        className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </span>
        {formatTime(elapsed)} — Stoppen
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={disabled}
      title="Antwort per Mikrofon diktieren (wird transkribiert)"
      className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Mic className="h-3.5 w-3.5" />
      Diktieren
    </button>
  );
};

export default AudioRecorder;
