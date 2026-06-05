/** Per-branch colour scheme. All classes are full static strings so Tailwind's
 *  JIT picks them up. Shared between the editable tree (Schritt 2) and the
 *  static tree (Schritt 3) so a branch keeps the same colour across steps. */
export interface NodeColor {
  border: string;
  ring: string;
  shadow: string;
  shadowHover: string;
  tint: string;
  accent: string;
}

export const NODE_COLORS: NodeColor[] = [
  { border: "border-primary/30", ring: "ring-primary/30", shadow: "shadow-primary/20", shadowHover: "hover:shadow-primary/40", tint: "from-primary/15", accent: "text-primary" },
  { border: "border-blue-500/30", ring: "ring-blue-500/30", shadow: "shadow-blue-500/20", shadowHover: "hover:shadow-blue-500/40", tint: "from-blue-500/15", accent: "text-blue-500" },
  { border: "border-emerald-500/30", ring: "ring-emerald-500/30", shadow: "shadow-emerald-500/20", shadowHover: "hover:shadow-emerald-500/40", tint: "from-emerald-500/15", accent: "text-emerald-500" },
  { border: "border-violet-500/30", ring: "ring-violet-500/30", shadow: "shadow-violet-500/20", shadowHover: "hover:shadow-violet-500/40", tint: "from-violet-500/15", accent: "text-violet-500" },
  { border: "border-rose-500/30", ring: "ring-rose-500/30", shadow: "shadow-rose-500/20", shadowHover: "hover:shadow-rose-500/40", tint: "from-rose-500/15", accent: "text-rose-500" },
  { border: "border-cyan-500/30", ring: "ring-cyan-500/30", shadow: "shadow-cyan-500/20", shadowHover: "hover:shadow-cyan-500/40", tint: "from-cyan-500/15", accent: "text-cyan-500" },
];
