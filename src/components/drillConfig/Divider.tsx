import React from "react";

/**
 * Full-bleed horizontal divider used between ConfigRows inside a
 * padded panel (px-8 panel → -mx-8 to reach the edges).
 */
const Divider: React.FC = () => (
  <div className="-mx-8 h-px bg-white/5" />
);

export default Divider;
