import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { TextDrillCase, ClarifyingQA } from "@/types/textDrill";
import { FrameworkNode } from "@/types/frameworkBuilder";
import {
  createEmptyNode,
  serializeFramework,
  isFrameworkValid,
  updateNodeInTree,
  removeNodeFromTree,
} from "@/lib/frameworkSerializer";
import FrameworkNodeCard from "@/components/frameworkBuilder/FrameworkNodeCard";
import { NodeColor } from "@/components/frameworkBuilder/nodeColors";
import {
  ChildrenConnector,
  ChildColumn,
} from "@/components/frameworkBuilder/FrameworkTreeConnectors";
import ZoomableTree from "@/components/frameworkBuilder/ZoomableTree";
import StepperHeader from "@/components/marketSizing/steps/StepperHeader";
import { DrillButton } from "@/components/ui/drill-button";
import { AudioRecorder } from "@/components/ui/AudioRecorder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  X,
  Send,
  Info,
  Plus,
  ArrowLeft,
  ArrowRight,
  MessageCircleQuestion,
  StickyNote,
  Loader2,
} from "lucide-react";

const MAX_TOP_LEVEL = 6;
const MAX_CHILDREN = 4;
const MAX_DEPTH = 4;
const MAX_PRIORITIES = 2;
const MAX_QUESTIONS = 5;

const FRAMEWORK_STEPS = ["Case & Rückfragen", "Struktur"] as const;

interface FrameworksGameProps {
  currentCase: TextDrillCase | null;
  onSubmit: (answerText: string, askedQA: ClarifyingQA[]) => void;
  onEnd: () => void;
  isEvaluating: boolean;
  onOpenIntro?: () => void;
}

/* ── Baum (wie Market-Sizing-Strukturschritt, ohne Rechenoperationen) ── */

interface TreeBranchProps {
  node: FrameworkNode;
  color: NodeColor;
  depth: number;
  disabled: boolean;
  lastAddedId: string | null;
  canSetPriority: boolean;
  onTogglePriority: (nodeId: string) => void;
  onUpdate: (id: string, updated: FrameworkNode) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

const TreeBranch: React.FC<TreeBranchProps> = ({
  node,
  color,
  depth,
  disabled,
  lastAddedId,
  canSetPriority,
  onTogglePriority,
  onUpdate,
  onRemove,
  onAddChild,
}) => {
  const canAddChild = node.children.length < MAX_CHILDREN && depth < MAX_DEPTH;
  const hasChildren = node.children.length > 0;

  return (
    <div className="flex shrink-0 flex-row items-center">
      <div className="flex flex-col items-center">
        <FrameworkNodeCard
          node={node}
          color={color}
          onUpdate={(updated) => onUpdate(node.id, updated)}
          onRemove={() => onRemove(node.id)}
          disabled={disabled}
          autoFocusTitle={node.id === lastAddedId}
          showPriorityToggle={depth === 1}
          canSetPriority={canSetPriority}
          onTogglePriority={() => onTogglePriority(node.id)}
          collapsible={false}
          collapsed={false}
          childCount={node.children.length}
          onToggleCollapse={() => {}}
          editableBullets
        />
        {canAddChild && (
          <button
            type="button"
            onClick={() => onAddChild(node.id)}
            disabled={disabled}
            className="mt-2 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-muted-foreground/60 transition-colors hover:bg-muted hover:text-primary disabled:opacity-30"
          >
            <Plus className="h-3 w-3" /> Unterast
          </button>
        )}
      </div>
      {hasChildren && (
        <ChildrenConnector childCount={node.children.length}>
          {node.children.map((child) => (
            <ChildColumn key={child.id}>
              <TreeBranch
                node={child}
                color={color}
                depth={depth + 1}
                disabled={disabled}
                lastAddedId={lastAddedId}
                canSetPriority={canSetPriority}
                onTogglePriority={onTogglePriority}
                onUpdate={onUpdate}
                onRemove={onRemove}
                onAddChild={onAddChild}
              />
            </ChildColumn>
          ))}
        </ChildrenConnector>
      )}
    </div>
  );
};

/* ── Hauptkomponente ── */

const FrameworksGame: React.FC<FrameworksGameProps> = ({
  currentCase,
  onSubmit,
  onEnd,
  isEvaluating,
  onOpenIntro,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState("");
  const [qaHistory, setQaHistory] = useState<ClarifyingQA[]>([]);
  const [qaInput, setQaInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [nodes, setNodes] = useState<FrameworkNode[]>([createEmptyNode()]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [notesHintOpen, setNotesHintOpen] = useState(false);
  const qaEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentCase) {
      setCurrentStep(0);
      setNotes("");
      setQaHistory([]);
      setQaInput("");
      setNodes([createEmptyNode()]);
      setLastAddedId(null);
      setNotesHintOpen(true);
    }
  }, [currentCase?.id]);

  // Neue Antworten im Q&A-Verlauf ins Sichtfeld scrollen.
  useEffect(() => {
    qaEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [qaHistory, isAsking]);

  const priorityCount = useMemo(() => nodes.filter((n) => n.isPriority).length, [nodes]);
  const questionsLeft = MAX_QUESTIONS - qaHistory.length;

  const askQuestion = useCallback(async () => {
    const question = qaInput.trim();
    if (!question || !currentCase || isAsking || qaHistory.length >= MAX_QUESTIONS) return;
    setIsAsking(true);
    try {
      const { data, error } = await supabase.functions.invoke("frameworks-interviewer", {
        body: {
          case_prompt: currentCase.prompt,
          question,
          clarifying_qa: currentCase.clarifying_qa ?? null,
          context_info: currentCase.context_info ?? null,
          interviewer_notes: currentCase.interviewer_notes ?? null,
          history: qaHistory,
        },
      });
      if (error) throw error;
      const answer: string =
        data?.answer ||
        data?.error ||
        "Dazu liegen mir keine Informationen vor — das ist für deine Struktur aber nicht entscheidend.";
      setQaHistory((prev) => [...prev, { q: question, a: answer }]);
      setQaInput("");
    } catch (err) {
      console.error("Interviewer error:", err);
      setQaHistory((prev) => [
        ...prev,
        {
          q: question,
          a: "Entschuldige, die Antwort ist gerade fehlgeschlagen. Stell die Frage gern noch einmal.",
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }, [qaInput, currentCase, isAsking, qaHistory]);

  /* ── Baum-Handler ── */

  const updateNode = useCallback((nodeId: string, updated: FrameworkNode) => {
    setNodes((prev) => updateNodeInTree(prev, nodeId, () => updated));
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes((prev) => {
      const result = removeNodeFromTree(prev, nodeId);
      return result.length === 0 ? [createEmptyNode()] : result;
    });
  }, []);

  const addNode = useCallback(() => {
    const n = createEmptyNode();
    setNodes((prev) => (prev.length >= MAX_TOP_LEVEL ? prev : [...prev, n]));
    setLastAddedId(n.id);
  }, []);

  const addChildNode = useCallback((parentId: string) => {
    const child = createEmptyNode();
    setNodes((prev) =>
      updateNodeInTree(prev, parentId, (parent) =>
        parent.children.length >= MAX_CHILDREN
          ? parent
          : { ...parent, children: [...parent.children, child] }
      )
    );
    setLastAddedId(child.id);
  }, []);

  const togglePriority = useCallback((nodeId: string) => {
    setNodes((prev) => {
      const target = prev.find((n) => n.id === nodeId);
      if (!target) return prev;
      if (!target.isPriority && prev.filter((n) => n.isPriority).length >= MAX_PRIORITIES) {
        return prev;
      }
      return prev.map((n) => (n.id === nodeId ? { ...n, isPriority: !n.isPriority } : n));
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isFrameworkValid({ nodes })) return;
    onSubmit(serializeFramework({ nodes }), qaHistory);
  }, [nodes, qaHistory, onSubmit]);

  if (!currentCase) return null;

  const canSubmit = isFrameworkValid({ nodes }) && !isEvaluating;

  return (
    <div className="flex flex-col gap-5">
      {/* Kopfzeile */}
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

      <StepperHeader
        currentStep={currentStep}
        onJumpTo={setCurrentStep}
        labels={FRAMEWORK_STEPS}
      />

      {/* Notizen-Hinweis als Popup beim Case-Start */}
      <Dialog open={notesHintOpen} onOpenChange={setNotesHintOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" /> Mach dir Notizen!
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-foreground">
            Im nächsten Schritt ist der Case-Text <strong>ausgeblendet</strong> — du baust
            deine Struktur nur mit deinen Notizen, wie im echten Interview. Notiere dir
            Klient, Ziel und die wichtigsten Fakten aus deinen Rückfragen.
          </p>
          <div className="flex justify-end pt-2">
            <DrillButton variant="active" onClick={() => setNotesHintOpen(false)}>
              Verstanden
            </DrillButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Schritt 1: Case-Vorstellung + Rückfragen ── */}
      {currentStep === 0 && (
        <>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {currentCase.prompt}
            </p>
          </div>

          {/* Rückfragen an den Interviewer */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MessageCircleQuestion className="h-4 w-4 text-primary" />
                Rückfragen an den Interviewer
              </h2>
              <span className="text-xs text-muted-foreground">
                {questionsLeft > 0
                  ? `Noch ${questionsLeft} Frage${questionsLeft !== 1 ? "n" : ""}`
                  : "Fragen-Limit erreicht"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Wie im echten Interview: Die Informationen sind begrenzt — zu manchen Fragen gibt
              es schlicht keine Daten. 1-2 gezielte Fragen reichen oft.
            </p>

            {(qaHistory.length > 0 || isAsking) && (
              <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-muted/20 p-4">
                {qaHistory.map((qa, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="self-end rounded-xl rounded-br-sm bg-primary/15 px-3 py-2 text-sm text-foreground max-w-[85%]">
                      {qa.q}
                    </div>
                    <div className="self-start rounded-xl rounded-bl-sm border border-border bg-card px-3 py-2 text-sm text-foreground max-w-[85%]">
                      {qa.a}
                    </div>
                  </div>
                ))}
                {isAsking && (
                  <div className="flex items-center gap-2 self-start rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Interviewer überlegt...
                  </div>
                )}
                <div ref={qaEndRef} />
              </div>
            )}

            <div className="flex items-start gap-2">
              <textarea
                value={qaInput}
                onChange={(e) => setQaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askQuestion();
                  }
                }}
                placeholder={
                  questionsLeft > 0
                    ? "z.B. Was ist das Ziel des Klienten?"
                    : "Du hast dein Fragen-Limit erreicht."
                }
                rows={1}
                disabled={isAsking || questionsLeft <= 0 || isEvaluating}
                className="min-h-[42px] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none disabled:opacity-50"
              />
              <DrillButton
                variant="active"
                size="default"
                onClick={askQuestion}
                disabled={!qaInput.trim() || isAsking || questionsLeft <= 0 || isEvaluating}
                className="h-[42px] gap-1.5 px-4"
              >
                {isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Fragen
              </DrillButton>
            </div>
            <div className="flex justify-end">
              <AudioRecorder
                onTranscript={(text) =>
                  setQaInput((prev) => (prev ? prev.trimEnd() + " " + text : text))
                }
                disabled={isAsking || questionsLeft <= 0 || isEvaluating}
              />
            </div>
          </div>

          {/* Notizen */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <StickyNote className="h-4 w-4 text-primary" />
                Deine Notizen
              </h2>
              <AudioRecorder
                onTranscript={(text) =>
                  setNotes((prev) => (prev ? prev.trimEnd() + "\n" + text : text))
                }
                disabled={isEvaluating}
              />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={"Klient: ...\nZiel: ...\nWichtige Fakten aus den Rückfragen: ..."}
              rows={5}
              disabled={isEvaluating}
              className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none"
            />
          </div>
        </>
      )}

      {/* ── Schritt 2: Struktur (nur mit Notizen) ── */}
      {currentStep === 1 && (
        <>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <StickyNote className="h-3.5 w-3.5 text-primary" /> Deine Notizen
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  Der Case-Text ist ausgeblendet — wie im echten Interview.
                </span>
                <AudioRecorder
                  onTranscript={(text) =>
                    setNotes((prev) => (prev ? prev.trimEnd() + "\n" + text : text))
                  }
                  disabled={isEvaluating}
                />
              </div>
            </div>
            {notes.trim() ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={Math.min(8, Math.max(2, notes.split("\n").length))}
                disabled={isEvaluating}
                className="w-full resize-y rounded-lg border border-transparent bg-transparent px-1 py-1 text-sm leading-relaxed text-foreground focus:border-border focus:outline-none"
              />
            ) : (
              <p className="px-1 py-1 text-sm italic text-muted-foreground/60">
                Keine Notizen gemacht — du kannst im Schritt zurück nochmal nachlesen und
                notieren.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Dein Framework</h2>
            <p className="text-xs text-muted-foreground">
              Bau deine Struktur als Boxen auf — jede Box hat einen Titel und darunter
              Stichpunkte; für feinere Aufteilung hängst du Unteräste an. Klick auf einen Ast,
              um reinzuzoomen und ihn zu bearbeiten. Markiere mit dem Stern bis zu{" "}
              {MAX_PRIORITIES} Hauptäste als Top-Priorität.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <ZoomableTree
              nodes={nodes}
              renderBranch={(node, color) => (
                <TreeBranch
                  node={node}
                  color={color}
                  depth={1}
                  disabled={isEvaluating}
                  lastAddedId={lastAddedId}
                  canSetPriority={priorityCount < MAX_PRIORITIES}
                  onTogglePriority={togglePriority}
                  onUpdate={updateNode}
                  onRemove={removeNode}
                  onAddChild={addChildNode}
                />
              )}
              headerAddon={
                nodes.length < MAX_TOP_LEVEL ? (
                  <button
                    type="button"
                    onClick={addNode}
                    disabled={isEvaluating}
                    className="flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border px-3 py-2 text-xs text-muted-foreground/60 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Hauptast hinzufügen</span>
                  </button>
                ) : undefined
              }
            />
          </div>
        </>
      )}

      {/* Navigation / Abgabe */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <DrillButton
          variant="inactive"
          size="default"
          onClick={() => setCurrentStep(0)}
          disabled={currentStep === 0 || isEvaluating}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </DrillButton>

        {currentStep === 0 ? (
          <div className="flex items-center gap-3">
            {!notes.trim() && (
              <span className="text-xs text-muted-foreground/70">
                Tipp: Ohne Notizen wird der nächste Schritt schwer.
              </span>
            )}
            <DrillButton
              variant="active"
              size="default"
              onClick={() => setCurrentStep(1)}
              disabled={isEvaluating || isAsking}
              className="gap-2"
            >
              Struktur bauen <ArrowRight className="h-4 w-4" />
            </DrillButton>
          </div>
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

export default FrameworksGame;
