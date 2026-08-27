import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const STORAGE_KEY = "pumpkin_user_email";

/** Verwirft nicht aufgelöste Template-Platzhalter (z.B. "{{email}}") und
 *  offensichtlich kaputte Werte, damit kein Datenmüll getrackt wird. */
const isRealEmail = (v: string | null): v is string =>
  !!v && v.includes("@") && !v.includes("{") && !v.includes("}");

/**
 * Returns the user email. Priority:
 *   1. ?email=... query param (refreshed on every render)
 *   2. sessionStorage fallback — set on first URL-param hit, persists for the tab
 *
 * The LearningSuite iframe loads with `?email={{email}}`. From there the user
 * navigates between routes (`/`, `/mental-math-drill`, `/fortschritt`, …) and
 * every Link in the app appends the email back into the URL — but if the user
 * reloads inside the iframe on a sub-route, the URL has no email anymore.
 * sessionStorage covers that case so the user stays "logged in" for the tab.
 */
export const useUserEmail = (): string | null => {
  const [searchParams] = useSearchParams();

  const fromUrl = useMemo(() => {
    const raw = searchParams.get("email");
    return isRealEmail(raw) ? raw : null;
  }, [searchParams]);

  const [stored, setStored] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const s = window.sessionStorage.getItem(STORAGE_KEY);
      return isRealEmail(s) ? s : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (fromUrl && fromUrl !== stored) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
      } catch {
        /* sessionStorage unavailable — keep going with state only */
      }
      setStored(fromUrl);
    }
  }, [fromUrl, stored]);

  return fromUrl || stored;
};
