import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MarketSizingCase,
  MarketSizingUnderstanding,
  SanityCheckStructured,
  BoxInput,
  MathOp,
} from "@/types/marketSizing";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { createEmptyNode, isFrameworkValid } from "@/lib/frameworkSerializer";
import {
  getLeaves,
  getNodesNeedingOp,
  isLeafComplete,
  serializeMarketSizing,
} from "@/lib/marketSizingHelpers";
import { DrillButton } from "@/components/ui/drill-button";
import { X, Send, Info, ArrowLeft, ArrowRight } from "lucide-react";
import StepperHeader, { STEP_LABELS } from "./steps/StepperHeader";
import UnderstandingStep from "./steps/UnderstandingStep";
import StructureStep from "./steps/StructureStep";
import AssumptionsStep from "./steps/AssumptionsStep";
import ResultStep from "./steps/ResultStep";

interface MarketSizingGameProps {
  currentCase: MarketSizingCase | null;
  onSubmit: (answerText: string, estimateValue: number | null, estimateUnit: string) => void;
  onEnd: () => void;
  isEvaluating: boolean;
  onOpenIntro?: () => void;
}

const emptyUnderstanding = (): MarketSizingUnderstanding => ({
  clarifications: [],
});

const emptySanityCheck = (): SanityCheckStructured => ({
  magnitudeCheck: "",
});

const MarketSizingGame: React.FC<MarketSizingGameProps> = ({
  currentCase,
  onSubmit,
  onEnd,
  isEvaluating,
  onOpenIntro,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [understanding, setUnderstanding] = useState<MarketSizingUnderstanding>(emptyUnderstanding());
  const [nodes, setNodes] = useState<FrameworkNode[]>([createEmptyNode()]);
  const [operations, setOperations] = useState<Record<string, MathOp>>({});
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [boxInputs, setBoxInputs] = useState<Record<string, BoxInput>>({});
  const [finalEstimate, setFinalEstimate] = useState("");
  const [estimateUnit, setEstimateUnit] = useState("");
  const [sanityCheck, setSanityCheck] = useState<SanityCheckStructured>(emptySanityCheck());

  useEffect(() => {
    if (currentCase) {
      setCurrentStep(0);
      setUnderstanding(emptyUnderstanding());
      setNodes([createEmptyNode()]);
      setOperations({});
      setLastAddedId(null);
      setBoxInputs({});
      setFinalEstimate("");
      setEstimateUnit(currentCase.unit_hint || "");
      setSanityCheck(emptySanityCheck());
    }
  }, [currentCase?.id]);

  const leaves = useMemo(() => getLeaves(nodes), [nodes]);
  const nodesNeedingOp = useMemo(() => getNodesNeedingOp(nodes), [nodes]);

  const canAdvanceFromUnderstanding = true;
  const canAdvanceFromStructure =
    isFrameworkValid({ nodes }) && nodesNeedingOp.every((n) => operations[n.id] != null);
  const canAdvanceFromAssumptions =
    leaves.length > 0 && leaves.every((n) => isLeafComplete(boxInputs[n.id]));
  const canSubmit = !isEvaluating && finalEstimate.trim().length > 0;

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    const serialized = serializeMarketSizing({
      understanding,
      nodes,
      operations,
      leaves,
      boxInputs,
      finalEstimateInput: finalEstimate,
      finalEstimateUnit: estimateUnit,
      sanityCheck,
    });
    onSubmit(
      serialized.answerText,
      serialized.finalEstimateValue,
      serialized.finalEstimateUnit
    );
  }, [
    canSubmit,
    understanding,
    nodes,
    operations,
    leaves,
    boxInputs,
    finalEstimate,
    estimateUnit,
    sanityCheck,
    onSubmit,
  ]);

  if (!currentCase) return null;

  const isLastStep = currentStep === STEP_LABELS.length - 1;

  const canAdvanceCurrentStep =
    currentStep === 0 ? canAdvanceFromUnderstanding :
    currentStep === 1 ? canAdvanceFromStructure :
    currentStep === 2 ? canAdvanceFromAssumptions :
    true;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full items-center gap-3">
        <div className="flex-1">
          <span className="text-xs text-muted-foreground">Nimm dir die Zeit, die du brauchst.</span>
        </div>
        {onOpenIntro && (
          <button
            type="button"
            onClick={onOpenIntro}
            title="So funktioniert's"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Info className="h-4 w-4" />
          </button>
        )}
        <DrillButton
          variant="inactive"
          size="sm"
          onClick={onEnd}
          className="border border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
        >
          <X className="h-4 w-4 mr-1" /> Beenden
        </DrillButton>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-lg font-medium text-foreground leading-relaxed">{currentCase.prompt}</p>
        {currentCase.unit_hint && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            <span>
              Zieleinheit:{" "}
              <span className="font-medium text-primary">{currentCase.unit_hint}</span>
            </span>
          </div>
        )}
      </div>

      <StepperHeader currentStep={currentStep} onJumpTo={setCurrentStep} />

      {currentStep === 0 && (
        <UnderstandingStep
          understanding={understanding}
          onChange={setUnderstanding}
          disabled={isEvaluating}
        />
      )}
      {currentStep === 1 && (
        <StructureStep
          nodes={nodes}
          onChange={setNodes}
          operations={operations}
          onOperationsChange={setOperations}
          lastAddedId={lastAddedId}
          onLastAddedIdChange={setLastAddedId}
          disabled={isEvaluating}
        />
      )}
      {currentStep === 2 && (
        <AssumptionsStep
          nodes={nodes}
          boxInputs={boxInputs}
          operations={operations}
          onChange={setBoxInputs}
          disabled={isEvaluating}
        />
      )}
      {currentStep === 3 && (
        <ResultStep
          understanding={understanding}
          nodes={nodes}
          boxInputs={boxInputs}
          operations={operations}
          finalEstimate={finalEstimate}
          onFinalEstimateChange={setFinalEstimate}
          unit={estimateUnit}
          onUnitChange={setEstimateUnit}
          sanityCheck={sanityCheck}
          onSanityCheckChange={setSanityCheck}
          disabled={isEvaluating}
          unitHint={currentCase.unit_hint || undefined}
        />
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <DrillButton
          variant="inactive"
          size="default"
          onClick={goBack}
          disabled={currentStep === 0 || isEvaluating}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </DrillButton>

        {!isLastStep ? (
          <DrillButton
            variant="active"
            size="default"
            onClick={goNext}
            disabled={!canAdvanceCurrentStep}
            className="gap-2"
          >
            Weiter <ArrowRight className="h-4 w-4" />
          </DrillButton>
        ) : (
          <DrillButton
            variant="active"
            size="default"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-2 px-6"
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
        )}
      </div>
    </div>
  );
};

export default MarketSizingGame;
