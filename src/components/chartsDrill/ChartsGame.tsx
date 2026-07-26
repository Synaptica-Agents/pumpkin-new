import React, { useEffect, useRef, useState } from "react";
import { TextDrillCase, DrillConfig } from "@/types/textDrill";
import { DrillButton } from "@/components/ui/drill-button";
import { AudioRecorder } from "@/components/ui/AudioRecorder";
import ExhibitSlide from "./ExhibitSlide";
import { X, Send, Info, ChevronDown, ChevronUp, Award, ArrowRight, HelpCircle, Eye } from "lucide-react";

/**
 * Diagramme-Drill Spielfläche, zwei Schritte wie im echten Interview:
 * 1) Exhibit interpretieren ("Was siehst du?") — erst danach
 * 2) erscheinen die konkreten Fragen mit kurzen Antwortfeldern.
 */
interface ChartsGameProps {
  config: DrillConfig;
  currentCase: TextDrillCase | null;
  onSubmit: (payload: { interpretation: string; answers: string[] }) => void;
  onEnd: () => void;
  isEvaluating: boolean;
  onOpenIntro: () => void;
}

const ChartsGame: React.FC<ChartsGameProps> = ({
  config, currentCase, onSubmit, onEnd, isEvaluating, onOpenIntro,
}) => {
  const [step, setStep] = useState<"interpret" | "questions">("interpret");
  const [interpretation, setInterpretation] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [rubrikOpen, setRubrikOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSeenRubrik = useRef(false);

  const questions = currentCase?.questions ?? [];

  // Collapse rubric after first case
  useEffect(() => {
    if (currentCase && hasSeenRubrik.current) {
      setRubrikOpen(false);
    }
    if (currentCase) hasSeenRubrik.current = true;
  }, [currentCase?.id]);

  useEffect(() => {
    if (currentCase) {
      setStep("interpret");
      setInterpretation("");
      setAnswers(new Array(currentCase.questions?.length ?? 0).fill(""));
      textareaRef.current?.focus();
    }
  }, [currentCase?.id]);

  if (!currentCase) return null;

  const canAdvance = interpretation.trim().length > 0;
  const canSubmit = answers.length === questions.length && answers.every((a) => a.trim().length > 0);

  const handleSubmit = () => {
    if (!canSubmit || isEvaluating) return;
    onSubmit({ interpretation, answers });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Kopfzeile: Schritt-Anzeige + Beenden */}
      <div className="flex w-full items-center gap-3">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {step === "interpret" ? "Schritt 1/2 · Interpretation" : "Schritt 2/2 · Fragen"}
        </span>
        <span className="flex-1 text-xs text-muted-foreground">Nimm dir die Zeit, die du brauchst.</span>
        <button
          onClick={onOpenIntro}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Anleitung anzeigen"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <DrillButton
          variant="inactive"
          size="sm"
          onClick={onEnd}
          className="border border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
        >
          <X className="h-4 w-4 mr-1" /> Beenden
        </DrillButton>
      </div>

      {/* Kontext */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-[15px] font-medium leading-relaxed text-foreground">{currentCase.prompt}</p>
        {currentCase.context_info && (
          <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{currentCase.context_info}</span>
          </div>
        )}
      </div>

      {/* Exhibit-Slide */}
      {currentCase.exhibits && currentCase.exhibits.length > 0 && (
        <ExhibitSlide
          title={currentCase.title}
          exhibits={currentCase.exhibits}
          additionalInfo={currentCase.additional_info}
        />
      )}

      {/* Bewertungskriterien */}
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

      {step === "interpret" ? (
        <>
          {/* Schritt 1: Interpretation */}
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Das gehört in deine Interpretation — alle vier Punkte fließen in die Bewertung ein:
            </p>
            <ol className="space-y-1">
              {[
                "Hauptaussage: Was zeigt das Exhibit in einem Satz?",
                "2–3 Key Insights mit konkreten Zahlen (Deltas, %, Vergleiche)",
                "Mögliche Ursachen: Was könnte hinter auffälligen Trends stecken? (Hypothesen reichen)",
                "So what: Was bedeutet das fürs Geschäft des Klienten — oder was würdest du als Nächstes prüfen?",
              ].map((step_, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/70">{i + 1}.</span> {step_}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Was zeigt das Exhibit? Deine Interpretation &amp; Key Insights
              </label>
              <AudioRecorder
                onTranscript={(text) =>
                  setInterpretation((prev) => (prev ? prev.trimEnd() + "\n" + text : text))
                }
                disabled={isEvaluating}
              />
            </div>
            <textarea
              ref={textareaRef}
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              placeholder={config.placeholder}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[160px] resize-y"
              disabled={isEvaluating}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Stichpunkte reichen völlig. Danach kommen die Fragen — die Interpretation lässt sich nicht mehr ändern.
            </p>
          </div>

          <div className="flex justify-center pt-1">
            <DrillButton
              variant="active"
              size="lg"
              onClick={() => setStep("questions")}
              disabled={!canAdvance}
              className="gap-2 px-8"
            >
              Weiter zu den Fragen <ArrowRight className="h-4 w-4" />
            </DrillButton>
          </div>
        </>
      ) : (
        <>
          {/* Deine Interpretation (eingefroren) */}
          <details className="rounded-xl border border-border bg-muted/20">
            <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
              <Eye className="h-4 w-4" /> Deine Interpretation (abgeschickt)
            </summary>
            <p className="whitespace-pre-line border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              {interpretation}
            </p>
          </details>

          {/* Schritt 2: Fragen */}
          <div className="flex flex-col gap-4">
            {questions.map((q, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  <span className="mr-2 text-primary">Frage {i + 1}:</span>
                  {q.text}
                </label>
                <textarea
                  value={answers[i] ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => {
                      const next = [...prev];
                      next[i] = e.target.value;
                      return next;
                    })
                  }
                  rows={2}
                  placeholder="Kurze Antwort — Zahl mit Rechenweg oder 1–2 Sätze"
                  className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isEvaluating}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-1">
            <DrillButton
              variant="active"
              size="lg"
              onClick={handleSubmit}
              disabled={!canSubmit || isEvaluating}
              className="gap-2 px-8"
            >
              {isEvaluating ? (
                <>
                  <span className="animate-spin">&#9203;</span> KI bewertet...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Abgeben &amp; Bewerten
                </>
              )}
            </DrillButton>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartsGame;
