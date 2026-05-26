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
    <header className="flex h-[52px] w-full items-center justify-between border-b border-border px-4">
      <Link
        to={backLink}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Zurück
      </Link>
      <span className="font-logo text-[28px] leading-none text-foreground">pumpkin.</span>
      <span className="w-16" />
    </header>
  );
};

export default NavHeader;
