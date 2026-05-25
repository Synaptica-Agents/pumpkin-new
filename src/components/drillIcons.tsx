import React from "react";

/**
 * Pumpkin drill glyphs adapted from the Variant A design handoff
 * (case-drills/project/icons.jsx). Each is a 48×48 SVG using the
 * pumpkin brand color #ff9900 as the primary accent plus white
 * opacity variants for supporting detail.
 */

const ICON_ORANGE = "#ff9900";
const ICON_DIM = "rgba(255,255,255,0.35)";
const ICON_LIGHT = "rgba(255,255,255,0.92)";

interface DrillIconProps {
  size?: number;
  orange?: string;
}

export const IconMentalMath: React.FC<DrillIconProps> = ({ size = 48, orange = ICON_ORANGE }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="6" width="36" height="36" rx="10" stroke={ICON_DIM} strokeWidth="1.2" />
    <text x="13" y="22" fontFamily="Geist Mono, monospace" fontSize="11" fontWeight="600" fill={ICON_LIGHT}>7×8</text>
    <text x="13" y="34" fontFamily="Geist Mono, monospace" fontSize="11" fontWeight="600" fill={ICON_LIGHT}>56</text>
    <path d="M34 14 L30 22 L34 22 L31 30" stroke={orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconCaseMath: React.FC<DrillIconProps> = ({ size = 48, orange = ICON_ORANGE }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="8" y="7" width="28" height="34" rx="3" stroke={ICON_LIGHT} strokeWidth="1.4" fill="none" />
    <line x1="12" y1="15" x2="32" y2="15" stroke={ICON_DIM} strokeWidth="1" />
    <line x1="12" y1="21" x2="28" y2="21" stroke={ICON_DIM} strokeWidth="1" />
    <line x1="12" y1="27" x2="30" y2="27" stroke={ICON_DIM} strokeWidth="1" />
    <line x1="12" y1="33" x2="24" y2="33" stroke={ICON_DIM} strokeWidth="1" />
    <rect x="26" y="30" width="10" height="10" rx="2" fill={orange} />
    <text x="28" y="38" fontFamily="Geist Mono, monospace" fontSize="7" fontWeight="700" fill="#0a0a0c">Σ</text>
  </svg>
);

export const IconFrameworks: React.FC<DrillIconProps> = ({ size = 48, orange = ICON_ORANGE }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 10 L24 17 M24 17 L14 24 M24 17 L34 24 M14 24 L14 34 M14 24 L10 34 M14 24 L18 34 M34 24 L34 34 M34 24 L30 34 M34 24 L38 34"
      stroke={ICON_DIM}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="10" r="3.5" fill={orange} />
    <circle cx="14" cy="24" r="2.5" fill={ICON_LIGHT} />
    <circle cx="34" cy="24" r="2.5" fill={ICON_LIGHT} />
    <circle cx="10" cy="36" r="1.8" fill={ICON_DIM} />
    <circle cx="14" cy="36" r="1.8" fill={ICON_DIM} />
    <circle cx="18" cy="36" r="1.8" fill={ICON_DIM} />
    <circle cx="30" cy="36" r="1.8" fill={ICON_DIM} />
    <circle cx="34" cy="36" r="1.8" fill={ICON_DIM} />
    <circle cx="38" cy="36" r="1.8" fill={ICON_DIM} />
  </svg>
);

export const IconMarketSizing: React.FC<DrillIconProps> = ({ size = 48, orange = ICON_ORANGE }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="7" y="10" width="34" height="5" rx="1" fill={ICON_LIGHT} opacity="0.85" />
    <rect x="11" y="18" width="26" height="5" rx="1" fill={ICON_DIM} />
    <rect x="15" y="26" width="18" height="5" rx="1" fill={ICON_DIM} />
    <rect x="19" y="34" width="10" height="5" rx="1" fill={orange} />
    <line x1="41" y1="12.5" x2="29" y2="36.5" stroke={orange} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
    <line x1="7" y1="12.5" x2="19" y2="36.5" stroke={orange} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
  </svg>
);

export const IconDiagramme: React.FC<DrillIconProps> = ({ size = 48, orange = ICON_ORANGE }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <line x1="8" y1="38" x2="40" y2="38" stroke={ICON_DIM} strokeWidth="1" />
    <line x1="8" y1="38" x2="8" y2="8" stroke={ICON_DIM} strokeWidth="1" />
    <rect x="12" y="28" width="5" height="10" fill={ICON_DIM} />
    <rect x="20" y="22" width="5" height="16" fill={ICON_DIM} />
    <rect x="28" y="18" width="5" height="20" fill={ICON_LIGHT} opacity="0.6" />
    <rect x="36" y="12" width="5" height="26" fill={orange} />
    <path d="M14 32 Q22 22, 30 18 T41 10" stroke={orange} strokeWidth="1.5" fill="none" opacity="0.9" />
    <circle cx="14" cy="32" r="1.8" fill={orange} />
    <circle cx="30" cy="18" r="1.8" fill={orange} />
  </svg>
);

export const IconCreativity: React.FC<DrillIconProps> = ({ size = 48, orange = ICON_ORANGE }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 7 L39 33 L9 33 Z" stroke={ICON_LIGHT} strokeWidth="1.4" fill="none" />
    <line x1="6" y1="20" x2="17" y2="20" stroke={ICON_LIGHT} strokeWidth="1.4" />
    <line x1="31" y1="20" x2="42" y2="34" stroke={orange} strokeWidth="1.4" />
    <line x1="31" y1="20" x2="42" y2="28" stroke={orange} strokeWidth="1.4" opacity="0.7" />
    <line x1="31" y1="20" x2="42" y2="22" stroke={orange} strokeWidth="1.4" opacity="0.4" />
    <circle cx="24" cy="24" r="2" fill={orange} />
  </svg>
);

export const DRILL_ICONS: Record<string, React.FC<DrillIconProps>> = {
  mental_math: IconMentalMath,
  case_math: IconCaseMath,
  frameworks: IconFrameworks,
  market_sizing: IconMarketSizing,
  charts: IconDiagramme,
  creativity: IconCreativity,
};
