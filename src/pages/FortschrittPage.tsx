import React, { useEffect, useState } from "react";
import NavHeader from "@/components/NavHeader";
import { useUserEmail } from "@/hooks/useUserEmail";
import {
  fetchDrillSessions,
  DrillSessionRow,
} from "@/lib/sessionTracker";
import {
  IconMentalMath,
  IconCaseMath,
  IconCreativity,
  IconMarketSizing,
  IconFrameworks,
  IconDiagramme,
} from "@/components/drillIcons";
import { TrendingUp, Hash, Award } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

type DrillKey = "mental_math" | "case_math" | "creativity" | "market_sizing" | "frameworks" | "charts";

const DRILL_META: Record<DrillKey, { label: string; icon: React.FC<{ size?: number }>; scoreSuffix: string }> = {
  mental_math: { label: "Mental Math", icon: IconMentalMath, scoreSuffix: "%" },
  case_math: { label: "Case Math", icon: IconCaseMath, scoreSuffix: "%" },
  creativity: { label: "Creativity", icon: IconCreativity, scoreSuffix: "/100" },
  market_sizing: { label: "Market Sizing", icon: IconMarketSizing, scoreSuffix: "/100" },
  frameworks: { label: "Frameworks", icon: IconFrameworks, scoreSuffix: "/100" },
  charts: { label: "Diagramme", icon: IconDiagramme, scoreSuffix: "/100" },
};

const DRILL_ORDER: DrillKey[] = ["mental_math", "case_math", "creativity", "market_sizing", "frameworks", "charts"];

const fmtScore = (drill: DrillKey, n: number): string => {
  const rounded = Math.round(n);
  return `${rounded}${DRILL_META[drill].scoreSuffix}`;
};

const fmtMinutes = (seconds: number): string => {
  const m = Math.max(1, Math.round(seconds / 60));
  return `${m} Min`;
};

const timeAgo = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "Gerade eben";
  if (m < 60) return `vor ${m} Min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `vor ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Gestern";
  if (d < 7) return `vor ${d} Tagen`;
  const w = Math.floor(d / 7);
  if (w < 4) return `vor ${w} Wochen`;
  return new Date(iso).toLocaleDateString("de-DE");
};

interface StatsAgg {
  avg: number;
  count: number;
  last: number | null;
}

const aggregate = (sessions: DrillSessionRow[], drill: DrillKey): StatsAgg => {
  const relevant = sessions.filter((s) => s.drill_type === drill);
  if (relevant.length === 0) return { avg: 0, count: 0, last: null };
  const sum = relevant.reduce((acc, s) => acc + (s.accuracy_percent ?? 0), 0);
  const sorted = [...relevant].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  return {
    avg: sum / relevant.length,
    count: relevant.length,
    last: sorted[0]?.accuracy_percent ?? null,
  };
};

/** Ein Punkt pro Session, chronologisch — die Sparkline zeigt den Score-Verlauf. */
const toHistory = (sessions: DrillSessionRow[]) =>
  sessions.map((s) => ({
    score: Math.round(s.accuracy_percent ?? 0),
    date: new Date(s.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
  }));

const StatsCard: React.FC<{ drill: DrillKey; agg: StatsAgg; history: DrillSessionRow[] }> = ({
  drill,
  agg,
  history,
}) => {
  const meta = DRILL_META[drill];
  const Icon = meta.icon;
  const hasData = agg.count > 0;
  const points = toHistory(history);
  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-[#0d0d10] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={28} />
        <span className="text-sm font-semibold text-foreground">{meta.label}</span>
      </div>
      {hasData ? (
        <>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-primary">{fmtScore(drill, agg.avg)}</span>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Ø Score</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" /> {agg.count} {agg.count === 1 ? "Sprint" : "Sprints"}
            </div>
            {agg.last !== null && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Letzter: {fmtScore(drill, agg.last)}
              </div>
            )}
          </div>
          {points.length >= 2 && (
            <div className="mt-3 h-16" aria-label={`Score-Verlauf ${meta.label}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={points} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
                  <defs>
                    <linearGradient id={`spark-${drill}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {/* Fester 0–100-Bereich: Verläufe sind zwischen den Drills vergleichbar */}
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    cursor={{ stroke: "hsl(var(--primary))", strokeOpacity: 0.35 }}
                    content={({ active, payload }) =>
                      active && payload && payload.length ? (
                        <div className="rounded-md border border-border bg-[#16161a] px-2 py-1 text-[11px] text-foreground shadow-md">
                          {payload[0].payload.date} · {fmtScore(drill, payload[0].payload.score)}
                        </div>
                      ) : null
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill={`url(#spark-${drill})`}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-muted-foreground/70">Noch keine Sprints.</p>
      )}
    </div>
  );
};

const FortschrittPage: React.FC = () => {
  const userEmail = useUserEmail();
  const [sessions, setSessions] = useState<DrillSessionRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!userEmail) {
        setSessions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const rows = await fetchDrillSessions(userEmail);
      if (!cancelled) {
        setSessions(rows);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userEmail]);

  const lastEight = [...sessions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavHeader showStats={false} />
      <main className="mx-auto w-full max-w-[760px] flex-1 px-4 py-4">
        <header className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Mein Fortschritt</h1>
          {userEmail ? (
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          ) : (
            <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
              Kein Login erkannt. Dein Fortschritt wird nur gespeichert, wenn du den Drill über LearningSuite öffnest.
            </div>
          )}
        </header>

        {/* Stats cards */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DRILL_ORDER.map((drill) => (
            <StatsCard
              key={drill}
              drill={drill}
              agg={aggregate(sessions, drill)}
              history={sessions.filter((s) => s.drill_type === drill)}
            />
          ))}
        </section>

        {/* Recent sessions */}
        <section className="mt-6">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Award className="h-4 w-4 text-primary" /> Letzte Sessions
          </h2>
          {loading ? (
            <p className="text-xs text-muted-foreground">Lade …</p>
          ) : lastEight.length === 0 ? (
            <p className="text-xs text-muted-foreground">Noch keine Sprints absolviert.</p>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {lastEight.map((s, i) => {
                const drill = (s.drill_type as DrillKey);
                const meta = DRILL_META[drill];
                const Icon = meta?.icon;
                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-3 px-4 py-2.5 ${
                      i < lastEight.length - 1 ? "border-b border-border/40" : ""
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {Icon ? <Icon size={18} /> : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{meta?.label ?? s.drill_type}</div>
                      <div className="text-[11px] text-muted-foreground">{fmtMinutes(s.duration_seconds)} · {timeAgo(s.created_at)}</div>
                    </div>
                    <div className="text-sm font-semibold text-foreground shrink-0">
                      {fmtScore(drill, s.accuracy_percent)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default FortschrittPage;
