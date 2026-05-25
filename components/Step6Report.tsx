"use client";
import { Trophy, TrendingUp, AlertTriangle, Heart, RefreshCw, ChevronRight, Star } from "lucide-react";
import { cn, getScoreColor, getScoreBg } from "@/lib/utils";
import type { Criterion, DecisionOption, WeightedResult, SynthesisReport } from "@/lib/types";
import DecisionChart from "./DecisionChart";

interface Props {
  question: string;
  criteria: Criterion[];
  options: DecisionOption[];
  results: WeightedResult[];
  report: SynthesisReport;
  onRestart: () => void;
}

export default function Step6Report({
  question,
  criteria,
  options,
  results,
  report,
  onRestart,
}: Props) {
  const winner = results[0];
  const runnerUp = results[1];
  const margin = winner ? winner.totalScore - (runnerUp?.totalScore ?? 0) : 0;
  const isDecisive = margin >= 1.5;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
          <Star className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-300 font-medium">Your Personalized Report</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
          {report.title}
        </h1>
        <p className="text-slate-500 text-sm italic">&ldquo;{question}&rdquo;</p>
      </div>

      {/* Winner card */}
      <div className="relative mb-6 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20" />
        <div className="absolute inset-0 border border-indigo-500/30 rounded-2xl" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-amber-400/80 font-semibold uppercase tracking-widest">
                  Top Recommendation
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white">{winner?.optionName}</h2>
            </div>
            <div className="text-right shrink-0">
              <div className={cn("text-4xl font-bold tabular-nums", getScoreColor(winner?.totalScore ?? 0))}>
                {winner?.totalScore.toFixed(1)}
              </div>
              <div className="text-slate-500 text-sm">out of 10</div>
            </div>
          </div>

          {/* Confidence meter */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Analysis Confidence</span>
              <span className="text-white font-semibold">{report.confidenceScore}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                style={{ width: `${report.confidenceScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {report.confidenceScore >= 80
                ? "Strong signal — your data was consistent"
                : report.confidenceScore >= 60
                ? "Moderate confidence — some competing factors"
                : "Lower confidence — this is a genuinely close call"}
            </p>
          </div>

          {/* Score comparison */}
          <div className="flex gap-2 flex-wrap">
            {results.map((r, i) => (
              <div
                key={r.optionId}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-sm font-medium",
                  i === 0
                    ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                    : "bg-slate-800/60 border-slate-700 text-slate-400"
                )}
              >
                {r.optionName}: <strong>{r.totalScore.toFixed(1)}</strong>
              </div>
            ))}
          </div>

          {isDecisive && (
            <div className="mt-3 text-xs text-emerald-400/70">
              ✓ Clear winner by {margin.toFixed(1)} points
            </div>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="glass-card rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-white">Summary</h3>
        </div>
        <p className="text-slate-300 leading-relaxed">{report.executiveSummary}</p>
      </div>

      {/* Key insights */}
      <div className="glass-card rounded-2xl p-6 mb-4">
        <h3 className="font-semibold text-white mb-4">Key Insights</h3>
        <div className="space-y-3">
          {report.keyInsights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-indigo-400 text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="mb-4">
        <DecisionChart criteria={criteria} options={options} results={results} />
      </div>

      {/* Criterion breakdown */}
      <div className="glass-card rounded-2xl p-6 mb-4">
        <h3 className="font-semibold text-white mb-4">Score Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-2 pr-4 text-slate-500 font-medium">Criterion</th>
                <th className="text-center py-2 px-2 text-xs text-slate-600 font-medium">Weight</th>
                {results.map((r) => (
                  <th
                    key={r.optionId}
                    className="text-right py-2 pl-4 text-slate-400 font-medium text-xs"
                  >
                    {r.optionName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.id} className="border-b border-slate-900">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span>{c.emoji}</span>
                      <span className="text-slate-300">{c.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-2.5 px-2">
                    <span className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      {c.weight}
                    </span>
                  </td>
                  {results.map((r) => {
                    const b = r.breakdown.find((x) => x.criterionId === c.id);
                    const raw = b?.raw ?? 0;
                    return (
                      <td key={r.optionId} className="text-right py-2.5 pl-4">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded border",
                            getScoreBg(raw)
                          )}
                        >
                          {raw}/10
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t-2 border-indigo-500/20">
                <td className="pt-3 pr-4 font-semibold text-white text-sm" colSpan={2}>
                  Weighted Total
                </td>
                {results.map((r, i) => (
                  <td key={r.optionId} className="pt-3 pl-4 text-right">
                    <span
                      className={cn(
                        "font-bold text-base",
                        i === 0 ? "text-indigo-300" : "text-slate-400"
                      )}
                    >
                      {r.totalScore.toFixed(2)}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Reasoning */}
      <div className="glass-card rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <ChevronRight className="w-4 h-4 text-violet-400" />
          <h3 className="font-semibold text-white">Why This Recommendation</h3>
        </div>
        <p className="text-slate-300 leading-relaxed">{report.reasoning}</p>
      </div>

      {/* Alternative considerations */}
      {runnerUp && (
        <div className="glass-card rounded-2xl p-6 mb-4 border-amber-500/10">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white">
              When &ldquo;{runnerUp.optionName}&rdquo; Might Be Better
            </h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {report.alternativeConsiderations}
          </p>
        </div>
      )}

      {/* Personal note */}
      <div className="rounded-2xl p-6 mb-8 bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-rose-400" />
          <h3 className="font-semibold text-white">A Personal Note</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed italic">{report.personalNote}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 transition-all font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Analyze Another Decision
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600/80 to-violet-600/80 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold transition-all"
        >
          Save / Print Report
        </button>
      </div>
    </div>
  );
}
