import React from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { NodeColor } from "@/components/frameworkBuilder/nodeColors";

interface StaticNodeCardProps {
  node: FrameworkNode;
  color: NodeColor;
  selected: boolean;
  /** True while the box has no assumption + number yet (shows the red "!"). */
  incomplete: boolean;
  /** Compact value to show next to the title, e.g. "10 Mio" (empty = none). */
  valueBadge?: string;
  onSelect: () => void;
}

/**
 * Read-only counterpart of FrameworkNodeCard used in Step 3: same visual
 * container, but the title is plain text, the card is clickable to select it,
 * and it shows a completion indicator + an optional value badge.
 */
const StaticNodeCard: React.FC<StaticNodeCardProps> = ({
  node,
  color,
  selected,
  incomplete,
  valueBadge,
  onSelect,
}) => {
  const title = node.title.trim() || "(ohne Titel)";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative min-w-[150px] max-w-[210px] rounded-xl border ${color.border} bg-card text-left ring-1 ${color.ring} shadow-lg ${color.shadow} ${color.shadowHover} transition-all duration-200 ${
        selected ? "ring-2 ring-offset-1 ring-offset-background" : ""
      }`}
    >
      {/* Coloured glow header */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-xl bg-gradient-to-b ${color.tint} to-transparent`}
      />

      {/* Completion indicator */}
      {incomplete && (
        <span
          className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground shadow-sm"
          title="Annahme & Zahl fehlen noch"
        >
          !
        </span>
      )}

      <div className="relative flex items-start gap-2 px-3 py-2.5">
        <span className="flex-1 break-words text-sm font-semibold leading-snug text-foreground">
          {title}
        </span>
        {valueBadge && (
          <span
            className={`shrink-0 whitespace-nowrap rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold ${color.accent}`}
          >
            {valueBadge}
          </span>
        )}
      </div>
    </button>
  );
};

export default StaticNodeCard;
