import React, { useRef, useEffect, useLayoutEffect } from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { X, Star, ChevronDown, ChevronRight } from "lucide-react";
import { NodeColor } from "./nodeColors";

export type { NodeColor };

interface FrameworkNodeCardProps {
  node: FrameworkNode;
  color: NodeColor;
  onUpdate: (updated: FrameworkNode) => void;
  onRemove: () => void;
  disabled: boolean;
  autoFocusTitle?: boolean;
  /** If true, shows the star toggle for priority marking (top-level nodes only). */
  showPriorityToggle?: boolean;
  /** If false, star toggle is visually present but cannot be set (max stars reached elsewhere). */
  canSetPriority?: boolean;
  onTogglePriority?: () => void;
  /** If true, shows the collapse/expand chevron (node has children). */
  collapsible?: boolean;
  /** Whether the branch is currently collapsed. */
  collapsed?: boolean;
  /** Number of direct children (for the collapsed "+n" badge). */
  childCount?: number;
  onToggleCollapse?: () => void;
}

/**
 * Resize a textarea so its height matches its scrollHeight (auto-grow).
 */
function autoResize(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

const FrameworkNodeCard: React.FC<FrameworkNodeCardProps> = ({
  node,
  color,
  onUpdate,
  onRemove,
  disabled,
  autoFocusTitle,
  showPriorityToggle = false,
  canSetPriority = true,
  onTogglePriority,
  collapsible = false,
  collapsed = false,
  childCount = 0,
  onToggleCollapse,
}) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocusTitle) {
      titleRef.current?.focus();
    }
  }, [autoFocusTitle]);

  // Resize title whenever its value changes
  useLayoutEffect(() => {
    autoResize(titleRef.current);
  }, [node.title]);

  const updateTitle = (title: string) => {
    onUpdate({ ...node, title });
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    // Title is single-line: prevent newlines.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      titleRef.current?.blur();
    }
  };

  return (
    <div
      className={`relative min-w-[150px] max-w-[210px] rounded-xl border ${color.border} bg-card ring-1 ${color.ring} shadow-lg ${color.shadow} ${color.shadowHover} transition-all duration-200 animate-in fade-in`}
    >
      {/* Coloured glow header */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-xl bg-gradient-to-b ${color.tint} to-transparent`}
      />

      {/* Delete button */}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-card border border-border text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 disabled:opacity-0"
        title="Entfernen"
      >
        <X className="h-3 w-3" />
      </button>

      {/* Title */}
      <div className="relative flex items-start gap-1.5 px-3 py-2.5">
        {collapsible && (
          <button
            type="button"
            onClick={onToggleCollapse}
            disabled={disabled}
            title={collapsed ? "Ast aufklappen" : "Ast zuklappen"}
            className={`mt-0.5 flex shrink-0 items-center gap-0.5 transition-colors ${color.accent} hover:opacity-70 disabled:opacity-40`}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            {collapsed && childCount > 0 && (
              <span className="text-[10px] font-semibold leading-none">+{childCount}</span>
            )}
          </button>
        )}
        {showPriorityToggle && (
          <button
            type="button"
            onClick={onTogglePriority}
            disabled={disabled || (!node.isPriority && !canSetPriority)}
            title={
              node.isPriority
                ? "Top-Priorität entfernen"
                : canSetPriority
                ? "Als Top-Priorität markieren"
                : "Max. 2 Top-Prioritäten"
            }
            className={`mt-0.5 shrink-0 transition-colors ${
              node.isPriority
                ? "text-primary"
                : "text-muted-foreground/30 hover:text-primary/70"
            } disabled:cursor-not-allowed disabled:opacity-30`}
          >
            <Star className={`h-3.5 w-3.5 ${node.isPriority ? "fill-current" : ""}`} />
          </button>
        )}
        <textarea
          ref={titleRef}
          value={node.title}
          onChange={(e) => {
            updateTitle(e.target.value);
            autoResize(e.currentTarget);
          }}
          onKeyDown={handleTitleKeyDown}
          placeholder="Titel..."
          rows={1}
          className="w-full resize-none overflow-hidden break-words bg-transparent text-sm font-semibold leading-snug text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FrameworkNodeCard;
