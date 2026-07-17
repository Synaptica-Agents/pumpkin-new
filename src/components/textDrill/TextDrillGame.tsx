import React, { useState, useRef, useEffect, useCallback } from "react";
import { TextDrillCase, DrillConfig } from "@/types/textDrill";
import SprintTimer from "@/components/sprint/SprintTimer";
import { DrillButton } from "@/components/ui/drill-button";
import { AudioRecorder } from "@/components/ui/AudioRecorder";
import { X, Send, Info, ChevronDown, ChevronUp, Award } from "lucide-react";

interface TextDrillGameProps {
  config: DrillConfig;
  currentCase: TextDrillCase | null;
  timeRemaining: number;
  totalDuration: number;
  onSubmit: (answerText: string) => void;
  onEnd: () => void;
  isEvaluating: boolean;
}

const TextDrillGame: React.FC<TextDrillGameProps> = ({
  config, currentCase, timeRemaining, totalDuration, onSubmit, onEnd, isEvaluating,
}) => {
  const [answerText, setAnswerText] = useState("");
  const [rubrikOpen, setRubrikOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSeenRubrik = useRef(false);

  // Collapse rubric after first case
  useEffect(() => {
    if (currentCase && hasSeenRubrik.current) {
      setRubrikOpen(false);
    }
    if (currentCase) hasSeenRubrik.current = true;
  }, [currentCase?.id]);

  useEffect(() => {
    if (currentCase) {
      setAnswerText("");
      textareaRef.current?.focus();
    }
  }, [currentCase?.id]);

  const handleSubmit = () => {
    if (!answerText.trim()) return;
    onSubmit(answerText);
  };

  if (!currentCase) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* Timer + End */}
      <div className="flex w-full items-center gap-4">
        <div className="flex-1">
          {config.sprintMode !== false ? (
            <SprintTimer timeRemaining={timeRemaining} totalDuration={totalDuration} />
          ) : (
            <span className="text-xs text-muted-foreground">Nimm dir die Zeit, die du brauchst.</span>
          )}
        </div>
        <DrillButton
          variant="inactive"
          size="sm"
          onClick={onEnd}
          className="border border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
        >
          <X className="h-4 w-4 mr-1" /> Beenden
        </DrillButton>
      </div>

      {/* Case Prompt */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-lg font-medium text-foreground leading-relaxed">
          {currentCase.prompt}
        </p>
        {currentCase.context_info && (
          <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{currentCase.context_info}</span>
          </div>
        )}
      </div>

      {/* Rubric & Structure Guide */}
      {config.rubricLabels.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <button
            onClick={() => setRubrikOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Bewertungskriterien
            </span>
            {rubrikOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {rubrikOpen && (
            <div className="border-t border-border px-4 pb-4 pt-3">
              <div className="flex flex-wrap gap-3">
                {config.rubricLabels.map(({ key, label, max }) => (
                  <div key={key} className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-xs">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-muted-foreground">({max} Pkt)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {config.structureGuide && config.structureGuide.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">So strukturierst du deine Antwort:</p>
          <ol className="space-y-1">
            {config.structureGuide.map((step, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground/70">{i + 1}.</span>{" "}{step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Answer Textarea */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Deine Antwort
          </label>
          <AudioRecorder
            onTranscript={(text) =>
              setAnswerText((prev) => (prev ? prev.trimEnd() + "\n" + text : text))
            }
            disabled={isEvaluating}
          />
        </div>
        <textarea
          ref={textareaRef}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder={config.placeholder}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[200px] resize-y"
          disabled={isEvaluating}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-center pt-2">
        <DrillButton
          variant="active"
          size="lg"
          onClick={handleSubmit}
          disabled={!answerText.trim() || isEvaluating}
          className="gap-2 px-8"
        >
          {isEvaluating ? (
            <>
              <span className="animate-spin">&#9203;</span> KI bewertet...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Abgeben & Bewerten
            </>
          )}
        </DrillButton>
      </div>
    </div>
  );
};

export default TextDrillGame;
