"use client";
import { useState } from "react";
import { ChevronRight, Trophy, Info } from "lucide-react";
import { cn, calculateWeightedScores, OPTION_COLORS } from "@/lib/utils";
import type { Criterion, DecisionOption } from "@/lib/types";

interface Props {
  criteria: Criterion[];
  options: DecisionOption[];
  onChange: (options: DecisionOption[]) => void;
  onNext: () => void;
}

export default function Step3Options({ criteria, options, onChange, onNext }: Props) {
  const [activeOption, setActiveOption] = useState(options[0]?.id ?? "");

  const updateScore = (optionId: string, criterionId: string, score: number) => {
    onChange(
      options.map((o) =>
        o.id === optionId ? { ...o, scores: { ...o.scores, [criterionId]: score } } : o
      )
    );
  };

  const results = calculateWeightedScores(criteria, options);
  const leaderId = results[0]?.optionId;

  const getOptionIndex = (id: string) => options.findIndex((o) => o.id === id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-slide-up">
      <div className="mb-6">
        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">
          Step 3 of 6
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Rate each option</h2>
        <p className="text-slate-400">
          Score each option on every criterion (0 = terrible, 10 = perfect). AI pre-filled initial
          estimates — adjust to match your knowledge.
        </p>
      </div>

      {/* Live scores */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-medium">
          Live Weighted Scores
        </div>
        <div className="space-y-2">
          {results.map((r, i) => {
            const colorIdx = getOptionIndex(r.optionId);
            const color = OPTION_COLORS[colorIdx % OPTION_COLORS.length];
            return (
              <div key={r.optionId} className="flex items-center gap-3">
                {i === 0 && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
                {i > 0 && <div className="w-4 h-4 shrink-0" />}
                <span className="text-sm text-slate-300 w-40 truncate font-medium">
                  {r.optionName}
                </span>
                <div className="flex-1 bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${r.percentage}%`,
                      background: color.stroke,
                      boxShadow: `0 0 8px ${color.stroke}80`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-14 text-right tabular-nums">
                  {r.totalScore.toFixed(1)}/10
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Option tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {options.map((opt, i) => {
          const color = OPTION_COLORS[i % OPTION_COLORS.length];
          const isLeader = opt.id === leaderId;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveOption(opt.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap shrink-0",
                activeOption === opt.id
                  ? "border-opacity-60 text-white"
                  : "border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 bg-slate-900/50"
              )}
              style={
                activeOption === opt.id
                  ? {
                      background: `${color.fill}`,
                      borderColor: color.stroke,
                      boxShadow: `0 0 20px ${color.stroke}30`,
                    }
                  : {}
              }
            >
              {isLeader && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
              {opt.name}
            </button>
          );
        })}
      </div>

      {/* Active option scoring */}
      {options
        .filter((o) => o.id === activeOption)
        .map((option) => {
          const optIdx = getOptionIndex(option.id);
          const color = OPTION_COLORS[optIdx % OPTION_COLORS.length];
          return (
            <div
              key={option.id}
              className="glass-card rounded-2xl p-6 mb-6"
              style={{ borderColor: `${color.stroke}30` }}
            >
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">{option.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{option.description}</p>
              </div>

              <div className="space-y-5">
                {criteria.map((criterion) => {
                  const score = option.scores[criterion.id] ?? 5;
                  return (
                    <div key={criterion.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{criterion.emoji}</span>
                          <span className="text-sm font-medium text-slate-200">
                            {criterion.name}
                          </span>
                          <span className="text-xs text-slate-600 hidden sm:block">
                            (weight: {criterion.weight})
                          </span>
                        </div>
                        <span
                          className="text-xl font-bold tabular-nums"
                          style={{ color: color.stroke }}
                        >
                          {score}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={score}
                        onChange={(e) =>
                          updateScore(option.id, criterion.id, Number(e.target.value))
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-700">Poor fit</span>
                        <span className="text-xs text-slate-700">Perfect fit</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      <div className="flex items-center gap-3 mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-sm text-amber-200/80">
          Current leader:{" "}
          <strong className="text-amber-300">
            {results[0]?.optionName ?? "none"} ({results[0]?.totalScore.toFixed(1)}/10)
          </strong>
          . The next step will challenge this choice.
        </p>
      </div>

      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
      >
        Challenge the Winner
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
