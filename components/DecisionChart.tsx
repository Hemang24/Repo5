"use client";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import type { Criterion, DecisionOption, WeightedResult } from "@/lib/types";
import { OPTION_COLORS } from "@/lib/utils";

interface Props {
  criteria: Criterion[];
  options: DecisionOption[];
  results: WeightedResult[];
}

export default function DecisionChart({ criteria, options, results }: Props) {
  // Radar data: each criterion is a spoke
  const radarData = criteria.map((c) => {
    const point: Record<string, string | number> = { criterion: c.name };
    options.forEach((o) => {
      point[o.name] = o.scores[c.id] ?? 0;
    });
    return point;
  });

  // Bar data: final weighted scores
  const barData = results.map((r, i) => ({
    name: r.optionName,
    score: r.totalScore,
    percentage: r.percentage,
    color: OPTION_COLORS[i % OPTION_COLORS.length].stroke,
  }));

  const CustomTooltipRadar = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string }[] }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300">{p.name}:</span>
            <span className="text-white font-bold">{p.value}/10</span>
          </div>
        ))}
      </div>
    );
  };

  const CustomTooltipBar = ({ active, payload }: { active?: boolean; payload?: { payload: { name: string; score: number; percentage: number } }[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs">
        <div className="font-semibold text-white mb-1">{d.name}</div>
        <div className="text-slate-300">
          Weighted Score: <strong className="text-white">{d.score.toFixed(2)}/10</strong>
        </div>
        <div className="text-slate-400">{d.percentage}% of maximum</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Radar Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-1">
          Option Profiles
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          How each option performs across every criterion
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="rgba(99,102,241,0.15)" />
            <PolarAngleAxis
              dataKey="criterion"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: "#475569", fontSize: 10 }}
              tickCount={6}
            />
            {options.map((opt, i) => {
              const color = OPTION_COLORS[i % OPTION_COLORS.length];
              return (
                <Radar
                  key={opt.id}
                  name={opt.name}
                  dataKey={opt.name}
                  stroke={color.stroke}
                  fill={color.fill}
                  strokeWidth={2}
                />
              );
            })}
            <Tooltip content={<CustomTooltipRadar />} />
            <Legend
              wrapperStyle={{ paddingTop: "12px", fontSize: "12px", color: "#94a3b8" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-1">
          Weighted Final Scores
        </h3>
        <p className="text-xs text-slate-500 mb-4">Overall score accounting for your weights</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 10]}
              tick={{ fill: "#475569", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltipBar />} />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {barData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  style={{ filter: `drop-shadow(0 0 8px ${entry.color}60)` }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
