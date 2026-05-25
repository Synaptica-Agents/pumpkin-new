import React from "react";

interface ChipProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * Pill-shaped selector for multi-select or single-select tag rows
 * (task types, categories, industries, …).
 */
const Chip: React.FC<ChipProps> = ({ selected, onClick, children, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
      selected
        ? "border border-primary bg-primary/[0.12] text-primary"
        : "border border-white/[0.12] bg-transparent text-foreground/75 hover:border-white/25"
    }`}
  >
    {children}
  </button>
);

export default Chip;
