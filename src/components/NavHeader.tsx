import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useUserEmail } from "@/hooks/useUserEmail";

interface NavHeaderProps {
  showStats?: boolean;
}

const NavHeader: React.FC<NavHeaderProps> = () => {
  const userEmail = useUserEmail();
  const location = useLocation();
  const onProgressPage = location.pathname === "/fortschritt";

  const withEmail = (path: string) =>
    userEmail ? `${path}?email=${encodeURIComponent(userEmail)}` : path;

  return (
    <header className="flex h-[52px] w-full items-center justify-between border-b border-border px-4">
      <Link
        to={withEmail("/")}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Zurück
      </Link>
      <span className="font-logo text-[28px] leading-none text-foreground">pumpkin.</span>
      <div className="flex w-16 justify-end">
        {userEmail && !onProgressPage && (
          <Link
            to={withEmail("/fortschritt")}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Fortschritt"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Fortschritt</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default NavHeader;
