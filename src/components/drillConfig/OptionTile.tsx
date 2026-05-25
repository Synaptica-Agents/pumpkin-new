import React from "react";

interface OptionTileProps {
  selected: boolean;
  onClick: () => void;
  big: React.ReactNode;
  small?: React.ReactNode;
  /** Pixel width of the tile — matches Variant A sizing (≈150 for narrow, 170 wider). */
  width?: number;
  disabled?: boolean;
}

/**
 * Config-screen option tile with a prominent top line (e.g. "5 Min",
 * "Einfach") and a muted caption underneath. Selected state draws
 * the pumpkin border + inset ring.
 */
const OptionTile: React.FC<OptionTileProps> = ({
  selected,
  onClick,
  big,
  small,
  width = 150,
  disabled,
}) => (
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

export default OptionTile;
