import React, { useRef, useEffect, useLayoutEffect } from "react";
import { FrameworkNode, FrameworkBulletPoint } from "@/types/frameworkBuilder";
import { createEmptyBullet } from "@/lib/frameworkSerializer";
import { X, Plus, Star } from "lucide-react";

interface FrameworkNodeCardProps {
  node: FrameworkNode;
  colorClass: string;
  onUpdate: (updated: FrameworkNode) => void;
  onRemove: () => void;
  disabled: boolean;
  autoFocusTitle?: boolean;
  /** If true, shows the star toggle for priority marking (top-level nodes only). */
  showPriorityToggle?: boolean;
  /** If false, star toggle is visually present but cannot be set (max stars reached elsewhere). */
  canSetPriority?: boolean;
  onTogglePriority?: () => void;
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
  colorClass,
  onUpdate,
  onRemove,
  disabled,
  autoFocusTitle,
  showPriorityToggle = false,
  canSetPriority = true,
  onTogglePriority,
}) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bulletRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());

  useEffect(() => {
    if (autoFocusTitle) {
      titleRef.current?.focus();
    }
  }, [autoFocusTitle]);

  // Resize title whenever its value changes
  useLayoutEffect(() => {
    autoResize(titleRef.current);
  }, [node.title]);

  // Resize each bullet whenever its value changes
  useLayoutEffect(() => {
    node.bulletPoints.forEach((bp) => {
      autoResize(bulletRefs.current.get(bp.id) ?? null);
    });
  }, [node.bulletPoints]);

  const updateTitle = (title: string) => {
    onUpdate({ ...node, title });
  };

  const updateBullet = (bulletId: string, text: string) => {
    onUpdate({
      ...node,
      bulletPoints: node.bulletPoints.map((bp) =>
        bp.id === bulletId ? { ...bp, text } : bp
      ),
    });
  };

  const addBullet = (afterId?: string) => {
    const newBullet = createEmptyBullet();
    let newBullets: FrameworkBulletPoint[];

    if (afterId) {
      const idx = node.bulletPoints.findIndex((bp) => bp.id === afterId);
      newBullets = [...node.bulletPoints];
      newBullets.splice(idx + 1, 0, newBullet);
    } else {
      newBullets = [...node.bulletPoints, newBullet];
    }

    onUpdate({ ...node, bulletPoints: newBullets });
    requestAnimationFrame(() => {
      bulletRefs.current.get(newBullet.id)?.focus();
    });
  };

  const removeBullet = (bulletId: string) => {
    if (node.bulletPoints.length <= 1) return;

    const idx = node.bulletPoints.findIndex((bp) => bp.id === bulletId);
    const newBullets = node.bulletPoints.filter((bp) => bp.id !== bulletId);
    onUpdate({ ...node, bulletPoints: newBullets });

    requestAnimationFrame(() => {
      if (idx > 0) {
        bulletRefs.current.get(newBullets[idx - 1].id)?.focus();
      } else if (newBullets.length > 0) {
        bulletRefs.current.get(newBullets[0].id)?.focus();
      } else {
        titleRef.current?.focus();
      }
    });
  };

  const handleBulletKeyDown = (e: React.KeyboardEvent, bullet: FrameworkBulletPoint) => {
    if (disabled) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addBullet(bullet.id);
    }
    if (e.key === "Backspace" && bullet.text === "" && node.bulletPoints.length > 1) {
      e.preventDefault();
      removeBullet(bullet.id);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const first = node.bulletPoints[0];
      if (first) bulletRefs.current.get(first.id)?.focus();
    }
  };

  return (
    <div
      className={`relative min-w-[140px] max-w-[200px] rounded-lg border border-border bg-card ${colorClass} border-t-[3px] transition-all duration-200 animate-in fade-in`}
    >
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
      <div className="flex items-start gap-1.5 px-3 pt-2.5 pb-1">
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

      {/* Bullets */}
      <div className="px-3 pb-2">
        <div className="space-y-0.5">
          {node.bulletPoints.map((bullet) => (
            <div key={bullet.id} className="flex items-start gap-1.5">
              <span className="shrink-0 pt-1 text-muted-foreground/40 text-[10px]">•</span>
              <textarea
                ref={(el) => {
                  if (el) {
                    bulletRefs.current.set(bullet.id, el);
                    autoResize(el);
                  } else {
                    bulletRefs.current.delete(bullet.id);
                  }
                }}
                value={bullet.text}
                onChange={(e) => {
                  updateBullet(bullet.id, e.target.value);
                  autoResize(e.currentTarget);
                }}
                onKeyDown={(e) => handleBulletKeyDown(e, bullet)}
                placeholder="..."
                rows={1}
                className="flex-1 min-w-0 resize-none overflow-hidden break-words bg-transparent py-0.5 text-xs leading-snug text-foreground placeholder:text-muted-foreground/25 focus:outline-none"
                disabled={disabled}
              />
              {node.bulletPoints.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBullet(bullet.id)}
                  disabled={disabled}
                  className="shrink-0 rounded p-0.5 pt-1 text-muted-foreground/20 transition-colors hover:text-destructive disabled:opacity-0"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addBullet()}
          disabled={disabled}
          className="mt-0.5 flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] text-muted-foreground/50 transition-colors hover:text-primary disabled:opacity-30"
        >
          <Plus className="h-2.5 w-2.5" /> Punkt
        </button>
      </div>
    </div>
  );
};

export default FrameworkNodeCard;
