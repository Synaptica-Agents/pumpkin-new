import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Reads the user email from URL query params (?email=...).
 * Used when the app is embedded in the Learningsuite iframe.
 */
export const useUserEmail = (): string | null => {
  const [searchParams] = useSearchParams();
  return useMemo(() => searchParams.get("email"), [searchParams]);
};
