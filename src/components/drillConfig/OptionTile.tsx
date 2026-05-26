import React from "react";

interface OptionTileProps {
  selected: boolean;
  onClick: () => void;
  big: React.ReactNode;
  small?: React.ReactNode;
  /** Pixel width of the tile in compact variant. Ignored in wizard. */
  width?: number;
  disabled?: boolean;
  /** "compact" (default) keeps original behaviour. "wizard" = full-width, larger text. */
  variant?: "compact" | "wizard";
}

/**
 * Config-screen option tile with a prominent top line (e.g. "5 Min",
 * "Einfach") and a muted caption underneath.
 */
const OptionTile: React.FC<OptionTileProps> = ({
  selected,
  onClick,
  big,
  small,
  width = 150,
  disabled,
  variant = "compact",
}) => {
  if (variant === "wizard") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-[14px] px-6 py-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
          selected
            ? "border border-primary bg-primary/[0.12] shadow-[inset_0_0_0_1px_rgba(255,153,0,0.2)]"
            : "border border-white/[0.08] bg-[#101013] hover:border-white/15"
        }`}
      >
        <div className="flex flex-col">
          <span className={`text-2xl font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
            {big}
          </span>
          {small && (
            <span className="mt-1 text-sm text-muted-foreground">{small}</span>
          )}
        </div>
        {selected && (
          <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ width }}
      className={`flex flex-col items-start rounded-[10px] px-4 py-3.5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? "border border-primary bg-primary/[0.12] shadow-[inset_0_0_0_1px_rgba(255,153,0,0.2)]"
          : "border border-white/[0.08] bg-[#101013] hover:border-white/15"
      }`}
    >
      <span className={`text-base font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
        {big}
      </span>
      {small && (
        <span className="mt-0.5 text-[11px] text-muted-foreground">{small}</span>
      )}
    </button>
  );
};

export default OptionTile;
