import React, { useState, useRef, useEffect, useCallback } from "react";
import { TextDrillCase, DrillConfig } from "@/types/textDrill";
import SprintTimer from "@/components/sprint/SprintTimer";
import { DrillButton } from "@/components/ui/drill-button";
import { AudioRecorder } from "@/components/ui/AudioRecorder";
import { X, Send, Info, ChevronDown, ChevronUp, Award } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface TextDrillGameProps {
  config: DrillConfig;
  currentCase: TextDrillCase | null;
  timeRemaining: number;
  totalDuration: number;
  onSubmit: (answerText: string) => void;
  onEnd: () => void;
  isEvaluating: boolean;
}

const CHART_COLORS = [
  "#ff9900", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6",
  "#f97316", "#06b6d4", "#ec4899", "#84cc16", "#6366f1",
];

const ChartRenderer: React.FC<{ chartData: any; chartType: string; chartTitle?: string | null }> = ({
  chartData, chartType, chartTitle,
}) => {
  if (!chartData || !chartData.labels || !chartData.datasets) return null;

  const labels: string[] = chartData.labels;
  const datasets: { label: string; data: number[]; color?: string }[] = chartData.datasets;

  if (chartType === "pie") {
    // For pie chart, use the first dataset
    const ds = datasets[0];
    if (!ds) return null;
    const pieData = labels.map((label, i) => ({
      name: label,
      value: ds.data[i] ?? 0,
    }));

    return (
      <div className="flex flex-col items-center gap-2">
        {chartTitle && <h4 className="text-sm font-semibold text-foreground">{chartTitle}</h4>}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={datasets[0].color || CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "scatter") {
    // Format convention: labels[] = point names, datasets[0].data[] = x values, datasets[1].data[] = y values
    if (datasets.length < 2) return null;
    const xDs = datasets[0];
    const yDs = datasets[1];
    const scatterData = labels.map((label, i) => ({
      name: label,
      x: xDs.data[i] ?? 0,
      y: yDs.data[i] ?? 0,
    }));

    return (
      <div className="flex flex-col items-center gap-2">
        {chartTitle && <h4 className="text-sm font-semibold text-foreground">{chartTitle}</h4>}
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              dataKey="x"
              name={xDs.label}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: xDs.label, position: "insideBottom", offset: -8, fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yDs.label}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: yDs.label, angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const p = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border bg-card p-2 text-xs">
                    <div className="font-medium text-foreground">{p.name}</div>
                    <div className="text-muted-foreground">{xDs.label}: {p.x}</div>
                    <div className="text-muted-foreground">{yDs.label}: {p.y}</div>
                  </div>
                );
              }}
            />
            <Scatter data={scatterData} fill={xDs.color || CHART_COLORS[0]} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "waterfall") {
    // Format convention: first and last values are absolute totals, middle are signed deltas.
    // Rendering: invisible `base` bar stacked with visible `delta` bar.
    const ds = datasets[0];
    if (!ds) return null;
    const values = ds.data;
    const n = values.length;
    let running = 0;
    const waterfallData = values.map((v, i) => {
      const isTotal = i === 0 || i === n - 1;
      if (isTotal) {
        running = v;
        return { name: labels[i] ?? `#${i + 1}`, base: 0, delta: v, color: "#3b82f6" };
      }
      if (v >= 0) {
        const base = running;
        running += v;
        return { name: labels[i] ?? `#${i + 1}`, base, delta: v, color: "#10b981" };
      }
      const base = running + v;
      running += v;
      return { name: labels[i] ?? `#${i + 1}`, base, delta: -v, color: "#ef4444" };
    });

    return (
      <div className="flex flex-col items-center gap-2">
        {chartTitle && <h4 className="text-sm font-semibold text-foreground">{chartTitle}</h4>}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={waterfallData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const deltaItem = payload.find((p: any) => p.dataKey === "delta");
                const entry = deltaItem?.payload as { delta: number; color: string } | undefined;
                if (!entry) return null;
                return (
                  <div className="rounded-lg border border-border bg-card p-2 text-xs">
                    <div className="font-medium text-foreground">{label}</div>
                    <div style={{ color: entry.color }}>{entry.delta}</div>
                  </div>
                );
              }}
            />
            <Bar dataKey="base" stackId="a" fill="transparent" />
            <Bar dataKey="delta" stackId="a" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // For bar and line charts, transform data into recharts format
  const rechartsData = labels.map((label, i) => {
    const point: Record<string, any> = { name: label };
    datasets.forEach((ds) => {
      point[ds.label] = ds.data[i] ?? 0;
    });
    return point;
  });

  if (chartType === "line") {
    return (
      <div className="flex flex-col items-center gap-2">
        {chartTitle && <h4 className="text-sm font-semibold text-foreground">{chartTitle}</h4>}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rechartsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend />
            {datasets.map((ds, i) => (
              <Line
                key={ds.label}
                type="monotone"
                dataKey={ds.label}
                stroke={ds.color || CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Default: bar chart (also handles stacked_bar, waterfall as bar)
  return (
    <div className="flex flex-col items-center gap-2">
      {chartTitle && <h4 className="text-sm font-semibold text-foreground">{chartTitle}</h4>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rechartsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend />
          {datasets.map((ds, i) => (
            <Bar
              key={ds.label}
              dataKey={ds.label}
              fill={ds.color || CHART_COLORS[i % CHART_COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TextDrillGame: React.FC<TextDrillGameProps> = ({
  config, currentCase, timeRemaining, totalDuration, onSubmit, onEnd, isEvaluating,
}) => {
  const [answerText, setAnswerText] = useState("");
  const [rubrikOpen, setRubrikOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSeenRubrik = useRef(false);

  // Collapse rubric after first case
  useEffect(() => {
    if (currentCase && hasSeenRubrik.current) {
      setRubrikOpen(false);
    }
    if (currentCase) hasSeenRubrik.current = true;
  }, [currentCase?.id]);

  useEffect(() => {
    if (currentCase) {
      setAnswerText("");
      textareaRef.current?.focus();
    }
  }, [currentCase?.id]);

  const handleSubmit = () => {
    if (!answerText.trim()) return;
    onSubmit(answerText);
  };

  if (!currentCase) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* Timer + End */}
      <div className="flex w-full items-center gap-4">
        <div className="flex-1">
          {config.sprintMode !== false ? (
            <SprintTimer timeRemaining={timeRemaining} totalDuration={totalDuration} />
          ) : (
            <span className="text-xs text-muted-foreground">Nimm dir die Zeit, die du brauchst.</span>
          )}
        </div>
        <DrillButton
          variant="inactive"
          size="sm"
          onClick={onEnd}
          className="text-muted-foreground hover:text-destructive hover:border-destructive"
        >
          <X className="h-4 w-4 mr-1" /> Beenden
        </DrillButton>
      </div>

      {/* Case Prompt */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-lg font-medium text-foreground leading-relaxed">
          {currentCase.prompt}
        </p>
        {currentCase.context_info && (
          <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{currentCase.context_info}</span>
          </div>
        )}
      </div>

      {/* Chart (only for charts drill) */}
      {currentCase.chart_data && (
        <div className="rounded-xl border border-border bg-card p-4">
          <ChartRenderer
            chartData={currentCase.chart_data}
            chartType={currentCase.category || "bar"}
            chartTitle={currentCase.chart_title}
          />
        </div>
      )}

      {/* Rubric & Structure Guide */}
      {config.rubricLabels.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <button
            onClick={() => setRubrikOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Bewertungskriterien
            </span>
            {rubrikOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {rubrikOpen && (
            <div className="border-t border-border px-4 pb-4 pt-3">
              <div className="flex flex-wrap gap-3">
                {config.rubricLabels.map(({ key, label, max }) => (
                  <div key={key} className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-xs">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-muted-foreground">({max} Pkt)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {config.structureGuide && config.structureGuide.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">So strukturierst du deine Antwort:</p>
          <ol className="space-y-1">
            {config.structureGuide.map((step, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground/70">{i + 1}.</span>{" "}{step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Answer Textarea */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Deine Antwort
          </label>
          <AudioRecorder
            onTranscript={(text) =>
              setAnswerText((prev) => (prev ? prev.trimEnd() + "\n" + text : text))
            }
            disabled={isEvaluating}
          />
        </div>
        <textarea
          ref={textareaRef}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder={config.placeholder}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[200px] resize-y"
          disabled={isEvaluating}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-center pt-2">
        <DrillButton
          variant="active"
          size="lg"
          onClick={handleSubmit}
          disabled={!answerText.trim() || isEvaluating}
          className="gap-2 px-8"
        >
          {isEvaluating ? (
            <>
              <span className="animate-spin">&#9203;</span> KI bewertet...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Abgeben & Bewerten
            </>
          )}
        </DrillButton>
      </div>
    </div>
  );
};

export default TextDrillGame;
