import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUserEmail } from "@/hooks/useUserEmail";

interface NavHeaderProps {
  showStats?: boolean;
}

const NavHeader: React.FC<NavHeaderProps> = () => {
  const userEmail = useUserEmail();
  const backLink = userEmail ? `/?email=${encodeURIComponent(userEmail)}` : "/";

  return (
    <header className="flex w-full items-center justify-between border-b border-border px-4 py-2">
      <Link
        to={backLink}
        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Zurück
      </Link>
      <span className="font-logo text-base text-foreground">pumpkin.</span>
      <span className="w-12" />
    </header>
  );
};

export default NavHeader;
