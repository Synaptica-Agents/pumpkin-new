import React from "react";

interface ConfigRowProps {
  label: string;
  caption?: string;
  children: React.ReactNode;
}

/**
 * Two-column row used inside a drill-config panel: a 200px left
 * column carries the label + small caption, the right column is
 * the actual picker (OptionTiles, Chips, custom input, …).
 */
const ConfigRow: React.FC<ConfigRowProps> = ({ label, caption, children }) => (
  <div className="grid grid-cols-[200px_1fr] items-start gap-8 py-[18px]">
    <div>
      <div className="text-sm font-medium text-foreground">{label}</div>
      {caption && (
        <div className="mt-1 text-xs leading-[1.4] text-muted-foreground">{caption}</div>
      )}
    </div>
    <div>{children}</div>
  </div>
);

export default ConfigRow;
