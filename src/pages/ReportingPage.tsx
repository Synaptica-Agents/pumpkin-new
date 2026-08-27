import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Hash, Clock, CalendarDays } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * /reporting — Admin-Übersicht über die Nutzung aller Drills.
 * Bewusst nirgends verlinkt; liest drill_sessions direkt (anon-Key, RLS: read-all).
 */

type DrillKey = "mental_math" | "case_math" | "creativity" | "market_sizing" | "frameworks" | "charts";

const DRILL_ORDER: DrillKey[] = ["mental_math", "case_math", "creativity", "market_sizing", "frameworks", "charts"];

// Kategoriale Palette (dark), Reihenfolge = DRILL_ORDER; validiert gegen Surface #0d0d10
// (CVD-adjacent ΔE ≥ 8.4, Normal ΔE ≥ 19.3, Kontrast ≥ 3:1 — Farbe folgt dem Drill, nie der Position).
const DRILL_COLOR: Record<DrillKey, string> = {
  mental_math: "#3987e5",
  case_math: "#d95926",
  creativity: "#199e70",
  market_sizing: "#c98500",
  frameworks: "#d55181",
  charts: "#008300",
};

const DRILL_LABEL: Record<DrillKey, string> = {
  mental_math: "Mental Math",
  case_math: "Case Math",
  creativity: "Creativity",
  market_sizing: "Market Sizing",
  frameworks: "Frameworks",
  charts: "Diagramme",
};

interface SessionRow {
  user_email: string;
  drill_type: string;
  created_at: string;
  duration_seconds: number;
}

/** Platzhalter- und Doku-Beispiel-Emails aus der Statistik halten. */
const isJunkEmail = (e: string): boolean => {
  const x = (e ?? "").trim().toLowerCase();
  return !x.includes("@") || x.includes("{") || x.startsWith("deine@email.com");
};

const dayKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const dayLabel = (d: Date): string =>
  d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });

/** Montag der ISO-Woche eines Datums (lokale Zeit). */
const mondayOf = (d: Date): Date => {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  return t;
};

const isoWeekNo = (d: Date): number => {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  const week1 = new Date(t.getFullYear(), 0, 4);
  return 1 + Math.round(((t.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

interface DailyPoint {
  label: string;
  users: number;
  sessions: number;
}

interface WeeklyPoint {
  label: string;
  range: string;
  total: number;
  mental_math: number;
  case_math: number;
  creativity: number;
  market_sizing: number;
  frameworks: number;
  charts: number;
}

const StatTile: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="flex flex-col gap-1 rounded-2xl border border-white/[0.06] bg-[#0d0d10] p-4">
    <div className="flex items-center gap-1.5 text-muted-foreground">{icon}
      <span className="text-[11px] uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-2xl font-bold text-foreground">{value}</span>
  </div>
);

const ChartCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-white/[0.06] bg-[#0d0d10] p-4">
    <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    <p className="mb-3 text-[11px] text-muted-foreground">{subtitle}</p>
    {children}
  </section>
);

const TooltipBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-md border border-border bg-[#16161a] px-2.5 py-1.5 text-[11px] leading-relaxed text-foreground shadow-md">
    {children}
  </div>
);

const ReportingPage: React.FC = () => {
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("drill_sessions")
        .select("user_email,drill_type,created_at,duration_seconds")
        .order("created_at", { ascending: true })
        .limit(10000);
      if (error) console.error("Reporting-Query fehlgeschlagen:", error.message);
      if (!cancelled) {
        setRows(((data ?? []) as unknown as SessionRow[]).filter((r) => !isJunkEmail(r.user_email)));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const users = new Set(rows.map((r) => r.user_email.toLowerCase()));
    const weekAgo = Date.now() - 7 * 86400000;
    const active7d = new Set(
      rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).map((r) => r.user_email.toLowerCase())
    );
    const totalSec = rows.reduce((s, r) => s + (r.duration_seconds ?? 0), 0);
    const perDrill = Object.fromEntries(DRILL_ORDER.map((d) => [d, 0])) as Record<DrillKey, number>;
    rows.forEach((r) => {
      if (r.drill_type in perDrill) perDrill[r.drill_type as DrillKey] += 1;
    });
    return {
      totalUsers: users.size,
      totalSessions: rows.length,
      active7d: active7d.size,
      totalHours: totalSec / 3600,
      perDrill,
    };
  }, [rows]);

  const daily = useMemo<DailyPoint[]>(() => {
    if (rows.length === 0) return [];
    const byDay = new Map<string, { users: Set<string>; sessions: number }>();
    rows.forEach((r) => {
      const k = dayKey(new Date(r.created_at));
      const e = byDay.get(k) ?? { users: new Set<string>(), sessions: 0 };
      e.users.add(r.user_email.toLowerCase());
      e.sessions += 1;
      byDay.set(k, e);
    });
    // Lückenlose Tagesachse vom ersten Eintrag bis heute (Tage ohne Nutzung = 0)
    const out: DailyPoint[] = [];
    const cursor = new Date(rows[0].created_at);
    cursor.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    while (cursor.getTime() <= today.getTime()) {
      const e = byDay.get(dayKey(cursor));
      out.push({ label: dayLabel(cursor), users: e?.users.size ?? 0, sessions: e?.sessions ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    return out;
  }, [rows]);

  const weekly = useMemo<WeeklyPoint[]>(() => {
    if (rows.length === 0) return [];
    const byWeek = new Map<string, WeeklyPoint>();
    const weekOf = (d: Date): WeeklyPoint => {
      const mon = mondayOf(d);
      const k = dayKey(mon);
      let e = byWeek.get(k);
      if (!e) {
        const sun = new Date(mon);
        sun.setDate(sun.getDate() + 6);
        e = {
          label: `KW ${isoWeekNo(mon)}`,
          range: `${dayLabel(mon)}–${dayLabel(sun)}`,
          total: 0,
          mental_math: 0, case_math: 0, creativity: 0, market_sizing: 0, frameworks: 0, charts: 0,
        };
        byWeek.set(k, e);
      }
      return e;
    };
    // Lückenlose Wochenachse
    const cursor = mondayOf(new Date(rows[0].created_at));
    const lastMonday = mondayOf(new Date());
    while (cursor.getTime() <= lastMonday.getTime()) {
      weekOf(cursor);
      cursor.setDate(cursor.getDate() + 7);
    }
    rows.forEach((r) => {
      const e = weekOf(new Date(r.created_at));
      if (r.drill_type in DRILL_LABEL) {
        e[r.drill_type as DrillKey] += 1;
        e.total += 1;
      }
    });
    return Array.from(byWeek.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [rows]);

  const fmtHours = (h: number): string =>
    h >= 10 ? `${Math.round(h)} h` : `${Math.round(h * 10) / 10} h`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-[52px] items-center justify-between border-b border-border px-4">
        <span className="w-24" />
        <span className="font-logo text-[28px] leading-none text-foreground">pumpkin.</span>
        <span className="w-24 text-right text-xs text-muted-foreground">Reporting</span>
      </header>

      <main className="mx-auto w-full max-w-[900px] flex-1 px-4 py-5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Nutzungs-Reporting</h1>
        <p className="mb-4 text-xs text-muted-foreground">
          Alle Drills · Stand {new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
        </p>

        {loading ? (
          <p className="text-xs text-muted-foreground">Lade …</p>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Gesamtwerte */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile icon={<Users className="h-3.5 w-3.5" />} value={String(stats.totalUsers)} label="Nutzer gesamt" />
              <StatTile icon={<Hash className="h-3.5 w-3.5" />} value={String(stats.totalSessions)} label="Sessions gesamt" />
              <StatTile icon={<CalendarDays className="h-3.5 w-3.5" />} value={String(stats.active7d)} label="Aktive · 7 Tage" />
              <StatTile icon={<Clock className="h-3.5 w-3.5" />} value={fmtHours(stats.totalHours)} label="Trainingszeit" />
            </section>

            {/* Gesamtwerte je Drill */}
            <section className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl border border-white/[0.06] bg-[#0d0d10] p-4 sm:grid-cols-3">
              {DRILL_ORDER.map((d) => (
                <div key={d} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: DRILL_COLOR[d] }} />
                  <span className="flex-1 truncate text-xs text-muted-foreground">{DRILL_LABEL[d]}</span>
                  <span className="text-sm font-semibold text-foreground">{stats.perDrill[d]}</span>
                </div>
              ))}
            </section>

            {/* Nutzung über Zeit (täglich) */}
            <ChartCard title="Aktive Nutzer pro Tag" subtitle="Verschiedene Nutzer mit mindestens einer Session an dem Tag">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={daily} margin={{ top: 4, right: 4, bottom: 0, left: -26 }}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="label" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={28} />
                    <YAxis allowDecimals={false} tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      content={({ active, payload }) =>
                        active && payload && payload.length ? (
                          <TooltipBox>
                            <div className="font-medium">{payload[0].payload.label}</div>
                            <div>{payload[0].payload.users} Nutzer · {payload[0].payload.sessions} Sessions</div>
                          </TooltipBox>
                        ) : null
                      }
                    />
                    <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={26} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Drills pro Woche */}
            <ChartCard title="Sessions pro Woche nach Drill" subtitle="Gestapelt · Kalenderwochen von Montag bis Sonntag">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly} margin={{ top: 4, right: 4, bottom: 0, left: -26 }}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="label" tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: "#8a8a93", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      content={({ active, payload }) =>
                        active && payload && payload.length ? (
                          <TooltipBox>
                            <div className="mb-0.5 font-medium">{payload[0].payload.label} ({payload[0].payload.range})</div>
                            {DRILL_ORDER.filter((d) => payload[0].payload[d] > 0).map((d) => (
                              <div key={d} className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: DRILL_COLOR[d] }} />
                                {DRILL_LABEL[d]}: {payload[0].payload[d]}
                              </div>
                            ))}
                            <div className="mt-0.5 border-t border-border pt-0.5">Gesamt: {payload[0].payload.total}</div>
                          </TooltipBox>
                        ) : null
                      }
                    />
                    {DRILL_ORDER.map((d) => (
                      /* stroke in Surface-Farbe = 2px-Lücke zwischen Stack-Segmenten */
                      <Bar key={d} dataKey={d} stackId="w" fill={DRILL_COLOR[d]} stroke="#0d0d10" strokeWidth={1} maxBarSize={44} isAnimationActive={false} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Legende: Farbe trägt die Identität, Text bleibt in Textfarbe */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {DRILL_ORDER.map((d) => (
                  <span key={d} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: DRILL_COLOR[d] }} />
                    {DRILL_LABEL[d]}
                  </span>
                ))}
              </div>
            </ChartCard>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportingPage;
