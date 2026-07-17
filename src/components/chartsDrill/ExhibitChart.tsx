import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ExhibitChartSpec } from "@/types/charts";

/**
 * Case-Exhibit-Diagramm im Casebook-Stil auf hellem Slide.
 * Wertelabels sind immer sichtbar (wie in echten Case-Exhibits — die Kandidaten
 * müssen exakte Zahlen ablesen können), Zahlen de-DE formatiert.
 * Palette validiert (dataviz-Skill, Surface #FDFDFC): feste Slot-Reihenfolge.
 */

const SLIDE_SURFACE = "#FDFDFC";
const INK = "#1A1A18";
const INK_SECONDARY = "#52514E";
const INK_MUTED = "#898781";
const GRID = "#E1E0D9";
const BASELINE = "#C3C2B7";

const PALETTE = ["#eda100", "#2a78d6", "#e34948", "#1baf7a", "#4a3aa7"];
/** Textfarbe für Labels AUF dem jeweiligen Palettenslot (gestapelte Segmente, Pie). */
const ON_PALETTE = [INK, "#ffffff", "#ffffff", INK, "#ffffff"];

const fmt = (v: number): string => v.toLocaleString("de-DE");

const seriesColor = (i: number, explicit?: string) => explicit || PALETTE[i % PALETTE.length];

const lightTooltip = (unit?: string | null) => ({
  contentStyle: {
    backgroundColor: "#ffffff",
    border: `1px solid ${GRID}`,
    borderRadius: "8px",
    color: INK,
    fontSize: 12,
  },
  formatter: (value: number) => [`${fmt(value)}${unit ? ` ${unit}` : ""}`, undefined] as any,
});

/** Segment-Label für gestapelte Balken — versteckt sich bei zu kleinen Segmenten. */
const makeSegmentLabel = (ink: string) => {
  const SegmentLabel: React.FC<any> = ({ x, y, width, height, value }) => {
    if (height == null || height < 15 || value == null) return null;
    return (
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        textAnchor="middle"
        fontSize={10.5}
        fontWeight={600}
        fill={ink}
      >
        {fmt(value)}
      </text>
    );
  };
  return SegmentLabel;
};

const TitleRow: React.FC<{ title: string; unit?: string | null }> = ({ title, unit }) => (
  <div className="flex items-end justify-between gap-3">
    <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#52514E]">{title}</h4>
    {unit && <span className="shrink-0 text-[11px] italic text-[#898781]">in {unit}</span>}
  </div>
);

const ExhibitChart: React.FC<{ spec: ExhibitChartSpec }> = ({ spec }) => {
  const { labels, datasets, unit } = spec;
  const manyTicks = labels.length > 8;

  const xAxisProps = {
    dataKey: "name",
    tickLine: false,
    axisLine: { stroke: BASELINE },
    tick: { fill: INK_SECONDARY, fontSize: manyTicks ? 10.5 : 12 },
    interval: 0 as const,
  };
  const yAxisProps = {
    tickLine: false,
    axisLine: false as const,
    tick: { fill: INK_MUTED, fontSize: 11 },
    tickFormatter: fmt,
    width: 44,
  };

  let body: React.ReactNode = null;

  if (spec.type === "pie") {
    const ds = datasets[0];
    if (!ds) return null;
    const total = ds.data.reduce((s, v) => s + v, 0);
    const pieData = labels.map((label, i) => ({ name: label, value: ds.data[i] ?? 0 }));
    body = (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="78%"
            paddingAngle={1}
            stroke={SLIDE_SURFACE}
            strokeWidth={2}
            labelLine={{ stroke: BASELINE }}
            label={({ name, value }) =>
              `${name}: ${fmt(value as number)} (${total > 0 ? Math.round(((value as number) / total) * 100) : 0}%)`
            }
            fontSize={11}
            fill={INK_SECONDARY}
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={seriesColor(i)} />
            ))}
          </Pie>
          <Tooltip {...lightTooltip(unit)} />
        </PieChart>
      </ResponsiveContainer>
    );
  } else {
    const rechartsData = labels.map((label, i) => {
      const point: Record<string, any> = { name: label };
      datasets.forEach((ds) => {
        point[ds.label] = ds.data[i] ?? 0;
      });
      return point;
    });

    if (spec.type === "line") {
      const showPointLabels = labels.length * datasets.length <= 16;
      body = (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={rechartsData} margin={{ top: 18, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...lightTooltip(unit)} />
            {datasets.length >= 2 && (
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: INK_SECONDARY }} />
            )}
            {datasets.map((ds, i) => (
              <Line
                key={ds.label}
                type="monotone"
                dataKey={ds.label}
                stroke={seriesColor(i, ds.color)}
                strokeWidth={2}
                dot={{ r: 3.5, strokeWidth: 0, fill: seriesColor(i, ds.color) }}
                activeDot={{ r: 5 }}
              >
                {showPointLabels && (
                  <LabelList
                    dataKey={ds.label}
                    position="top"
                    offset={8}
                    formatter={fmt}
                    style={{ fill: INK, fontSize: 11, fontWeight: 600 }}
                  />
                )}
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (spec.type === "stacked_bar") {
      body = (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={rechartsData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...lightTooltip(unit)} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: INK_SECONDARY }} />
            {datasets.map((ds, i) => (
              <Bar
                key={ds.label}
                dataKey={ds.label}
                stackId="s"
                fill={seriesColor(i, ds.color)}
                stroke={SLIDE_SURFACE}
                strokeWidth={2}
                maxBarSize={64}
                radius={i === datasets.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
              >
                <LabelList content={makeSegmentLabel(ds.color ? "#ffffff" : ON_PALETTE[i % ON_PALETTE.length])} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      // bar (einzeln oder gruppiert)
      body = (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={rechartsData} margin={{ top: 18, right: 16, bottom: 0, left: 0 }} barCategoryGap="24%">
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip {...lightTooltip(unit)} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            {datasets.length >= 2 && (
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: INK_SECONDARY }} />
            )}
            {datasets.map((ds, i) => (
              <Bar key={ds.label} dataKey={ds.label} fill={seriesColor(i, ds.color)} maxBarSize={44} radius={[3, 3, 0, 0]}>
                <LabelList
                  dataKey={ds.label}
                  position="top"
                  formatter={fmt}
                  style={{ fill: INK, fontSize: 11, fontWeight: 600 }}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <TitleRow title={spec.title} unit={unit} />
      {body}
      {spec.footnote && (
        <p className="text-[11px] italic leading-snug text-[#898781]">{spec.footnote}</p>
      )}
    </div>
  );
};

export default ExhibitChart;
