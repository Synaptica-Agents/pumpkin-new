import React from "react";
import { Link } from "react-router-dom";
import { Lock, Clock, CheckCircle, ArrowRight, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RevealCardContainer } from "@/components/ui/animated-reveal-card";

export type ModuleStatus = "active" | "beta" | "coming_soon";

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: ModuleStatus;
  href?: string;
  emailParam?: string | null;
  stats?: { avgTime: string; accuracy: string; solved: string };
  drillType?: string;
}

/** Inner content used as the default (base) card face. */
const ModuleCardBase: React.FC<
  Pick<ModuleCardProps, "title" | "description" | "icon" | "status" | "stats">
> = ({ title, description, icon, status, stats }) => {
  const isActive = status === "active" || status === "beta";
  const isComingSoon = status === "coming_soon";

  return (
    <div
      className={`relative flex h-full flex-col items-center justify-center gap-section-gap rounded-[inherit] p-card-padding text-center ${
        !isActive ? "opacity-50 grayscale" : ""
      }`}
    >
      {status === "beta" && (
        <Badge className="absolute right-4 top-4 border-primary/30 bg-primary/15 text-xs text-primary">
          Beta
        </Badge>
      )}
      {isComingSoon && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Lock className="h-8 w-8 text-muted-foreground/50" />
        </div>
      )}
      {icon && (
        <div className="flex h-32 w-32 items-center justify-center rounded-[16px] border border-white/[0.05] bg-[#16161a]">
          {icon}
        </div>
      )}
      <h3 className={`text-h3 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {title}
      </h3>
      <p className="text-body text-secondary-foreground">{description}</p>
      {isActive && stats && (
        <div className="flex w-full items-center justify-center gap-4 rounded-xl border border-border bg-secondary px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-label">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-secondary-foreground">Ø {stats.avgTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-label">
            <CheckCircle className="h-3.5 w-3.5 text-success" />
            <span className="text-secondary-foreground">{stats.accuracy}</span>
          </div>
          <div className="flex items-center gap-1.5 text-label">
            <Target className="h-3.5 w-3.5 text-primary" />
            <span className="text-secondary-foreground">{stats.solved}</span>
          </div>
        </div>
      )}
      {isComingSoon && (
        <Badge variant="secondary" className="text-xs">
          Coming Soon
        </Badge>
      )}
    </div>
  );
};

/** Amber-accented overlay face shown on hover. Same content + prominent CTA. */
const ModuleCardOverlay: React.FC<
  Pick<ModuleCardProps, "title" | "description" | "icon" | "stats">
> = ({ title, description, icon, stats }) => (
  <div
    className="relative flex h-full flex-col items-center justify-center gap-section-gap rounded-[inherit] p-card-padding text-center"
    style={{ backgroundColor: "var(--accent-color)" }}
  >
    {icon && (
      <div
        className="flex h-32 w-32 items-center justify-center rounded-[16px] border"
        style={{
          backgroundColor: "rgba(0,0,0,0.15)",
          borderColor: "rgba(0,0,0,0.2)",
        }}
      >
        {icon}
      </div>
    )}
    <h3
      className="text-h3"
      style={{ color: "var(--on-accent-foreground)" }}
    >
      {title}
    </h3>
    <p
      className="text-body"
      style={{ color: "var(--on-accent-foreground)", opacity: 0.85 }}
    >
      {description}
    </p>
    {stats && (
      <div
        className="flex w-full items-center justify-center gap-4 rounded-xl px-4 py-2.5"
        style={{
          backgroundColor: "rgba(0,0,0,0.08)",
          color: "var(--on-accent-muted-foreground)",
        }}
      >
        <div className="flex items-center gap-1.5 text-label">
          <Clock className="h-3.5 w-3.5" />
          <span>Ø {stats.avgTime}</span>
        </div>
        <div className="flex items-center gap-1.5 text-label">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>{stats.accuracy}</span>
        </div>
        <div className="flex items-center gap-1.5 text-label">
          <Target className="h-3.5 w-3.5" />
          <span>{stats.solved}</span>
        </div>
      </div>
    )}
    <div
      className="mt-auto flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-md"
      style={{
        backgroundColor: "hsl(var(--foreground))",
        color: "hsl(var(--background))",
      }}
    >
      <span>Jetzt starten</span>
      <ArrowRight className="h-4 w-4" />
    </div>
  </div>
);

const ModuleCard: React.FC<ModuleCardProps> = ({
  title, description, icon, status, href, emailParam, stats,
}) => {
  const isActive = status === "active" || status === "beta";

  const card = (
    <RevealCardContainer
      disabled={!isActive}
      className={`min-h-[22rem] transition-transform duration-300 ${
        isActive
          ? "shadow-active hover:-translate-y-1 cursor-pointer bg-gradient-to-b from-accent to-card"
          : "cursor-not-allowed bg-card/50"
      }`}
      base={<ModuleCardBase title={title} description={description} icon={icon} status={status} stats={stats} />}
      overlay={<ModuleCardOverlay title={title} description={description} icon={icon} stats={stats} />}
    />
  );

  if (isActive && href) {
    const linkTo = emailParam ? `${href}?email=${encodeURIComponent(emailParam)}` : href;
    return <Link to={linkTo} className="block">{card}</Link>;
  }
  return card;
};

export default ModuleCard;
