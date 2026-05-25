import { forwardRef, useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { cn } from "@/lib/utils";

/**
 * Hover-activated reveal card. Shows `base` content by default and wipes an
 * `overlay` over it via a GSAP circle clip-path when the user hovers.
 *
 * Based on the "animated-profile-card" 21st.dev reference, stripped of the
 * next-themes dependency (this app is dark-only) and the profile-specific
 * IdentityCardBody (callers supply any ReactNode).
 *
 * Pass `disabled` for tiles that should not reveal on hover (e.g. locked
 * coming-soon cards).
 */
export interface RevealCardContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  base: React.ReactNode;
  overlay: React.ReactNode;
  /** CSS color applied as `--accent-color` CSS var on the container. */
  accent?: string;
  /** Foreground color used against the accent background. */
  textOnAccent?: string;
  /** Muted-foreground color used against the accent background. */
  mutedOnAccent?: string;
  /** When true, the card skips the hover reveal animation entirely. */
  disabled?: boolean;
}

export const RevealCardContainer = forwardRef<
  HTMLDivElement,
  RevealCardContainerProps
>(
  (
    {
      base,
      overlay,
      accent = "hsl(var(--primary))",
      textOnAccent = "hsl(var(--primary-foreground))",
      mutedOnAccent = "rgba(0, 0, 0, 0.6)",
      disabled = false,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const holderRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const assignRef = useCallback(
      (el: HTMLDivElement | null) => {
        holderRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      },
      [ref]
    );

    const startClip = "circle(20px at 28px 28px)";
    const expandClip = "circle(160% at 28px 28px)";

    useGSAP(
      () => {
        gsap.set(overlayRef.current, { clipPath: startClip });
      },
      { scope: holderRef }
    );

    const reveal = () => {
      if (disabled) return;
      gsap.to(overlayRef.current, {
        clipPath: expandClip,
        duration: 0.8,
        ease: "expo.inOut",
      });
    };

    const conceal = () => {
      if (disabled) return;
      gsap.to(overlayRef.current, {
        clipPath: startClip,
        duration: 1,
        ease: "expo.out(1, 1)",
      });
    };

    return (
      <div
        ref={assignRef}
        onMouseEnter={reveal}
        onMouseLeave={conceal}
        style={
          {
            ...style,
            "--accent-color": accent,
            "--on-accent-foreground": textOnAccent,
            "--on-accent-muted-foreground": mutedOnAccent,
            borderColor: disabled ? "hsl(var(--border))" : "var(--accent-color)",
          } as React.CSSProperties
        }
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-3xl border-2",
          disabled && "pointer-events-none-wrapper",
          className
        )}
        {...rest}
      >
        <div className="flex-1">{base}</div>
        {!disabled && (
          <div
            ref={overlayRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {overlay}
          </div>
        )}
      </div>
    );
  }
);
RevealCardContainer.displayName = "RevealCardContainer";
