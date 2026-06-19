import React from "react";
import { FrameworkNode } from "@/types/frameworkBuilder";
import { NodeColor } from "@/components/frameworkBuilder/nodeColors";
import { BoxKind } from "@/types/marketSizing";
import { boxKindLabel } from "@/lib/marketSizingHelpers";

interface StaticNodeCardProps {
  node: FrameworkNode;
  color: NodeColor;
  selected: boolean;
  /** True while the leaf has no number/justification yet (shows the red "!"). */
  incomplete: boolean;
  /** Compact value to show next to the title, e.g. "10 Mio" (empty = none). */
  valueBadge?: string;
  /** Leaf type badge (Annahme/Fakt/Rechnung). Omitted for parent boxes. */
  kind?: BoxKind;
  /** Parent boxes are derived ("Rechnung") and not selectable. */
  isParent?: boolean;
  onSelect: () => void;
}

const kindBadgeClass = (kind: BoxKind): string =>
  kind === "fakt"
    ? "bg-emerald-500/15 text-emerald-600"
    : kind === "rechnung"
    ? "bg-amber-500/15 text-amber-600"
    : "bg-blue-500/15 text-blue-600"; // annahme

/**
 * Read-only counterpart of FrameworkNodeCard used in Step 3 & recap. Leaf boxes
 * are clickable to select; parent boxes are rendered as derived "Rechnung" and
 * are not selectable.
 */
const StaticNodeCard: React.FC<StaticNodeCardProps> = ({
  node,
  color,
  selected,
  incomplete,
  valueBadge,
  kind,
  isParent = false,
  onSelect,
}) => {
  const title = node.title.trim() || "(ohne Titel)";

  const Tag: React.ElementType = isParent ? "div" : "button";

  return (
    <Tag
      {...(isParent ? {} : { type: "button", onClick: onSelect })}
      className={`relative min-w-[150px] max-w-[210px] rounded-xl border ${color.border} bg-card text-left ring-1 ${color.ring} shadow-lg ${color.shadow} transition-all duration-200 ${
        isParent ? "cursor-default opacity-90" : `${color.shadowHover} cursor-pointer`
      } ${selected ? "ring-2 ring-offset-1 ring-offset-background" : ""}`}
    >
      {/* Coloured glow header */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-xl bg-gradient-to-b ${color.tint} to-transparent`}
      />

      {/* Completion indicator (leaves only) */}
      {incomplete && (
        <span
          className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground shadow-sm"
          title="Zahl/Begründung fehlt noch"
        >
          !
        </span>
      )}

      <div className="relative flex flex-col gap-1 px-3 py-2.5">
        <div className="flex items-start gap-2">
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
        <div>
          {isParent ? (
            <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Rechnung (aus Unterästen)
            </span>
          ) : kind ? (
            <span
              className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${kindBadgeClass(
                kind
              )}`}
            >
              {boxKindLabel(kind)}
            </span>
          ) : null}
        </div>
      </div>
    </Tag>
  );
};

export default StaticNodeCard;
