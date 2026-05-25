"use client";
import { useState } from "react";
import { ChevronRight, Info, RotateCcw, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Criterion } from "@/lib/types";

interface Props {
  criteria: Criterion[];
  onChange: (criteria: Criterion[]) => void;
  onNext: () => void;
  question: string;
}

export default function Step2Criteria({ criteria, onChange, onNext, question }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const updateWeight = (id: string, weight: number) => {
    onChange(criteria.map((c) => (c.id === id ? { ...c, weight } : c)));
  };

  const resetWeight = (id: string, suggested: number) => {
    updateWeight(id, suggested);
  };

  const removeCriterion = (id: string) => {
    onChange(criteria.filter((c) => c.id !== id));
  };

  const addCustom = () => {
    const id = `custom_${Date.now()}`;
    onChange([
      ...criteria,
      {
        id,
        name: "Custom Criterion",
        description: "Add a description for this criterion",
        emoji: "⭐",
        weight: 5,
        suggestedWeight: 5,
      },
    ]);
  };

  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-slide-up">
      <div className="mb-8">
        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">
          Step 2 of 6
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">What matters most to you?</h2>
        <p className="text-slate-400">
          AI generated these criteria for:{" "}
          <em className="text-slate-300">&ldquo;{question}&rdquo;</em>
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Adjust each weight (0 = doesn&apos;t matter, 10 = critical)
        </p>
      </div>

      {/* Weight summary */}
      <div className="glass-card rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-sm text-slate-300">
            Total weight: <strong className="text-white">{totalWeight}</strong>
          </span>
        </div>
        <span className="text-xs text-slate-500">{criteria.length} criteria</span>
      </div>

      <div className="space-y-3 mb-8">
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className={cn(
              "glass-card rounded-xl p-5 transition-all duration-200",
              hoveredId === criterion.id && "border-indigo-500/30 glow-indigo"
            )}
            onMouseEnter={() => setHoveredId(criterion.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{criterion.emoji}</span>
                <div>
                  <h3 className="font-semibold text-white text-base">{criterion.name}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{criterion.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {criterion.weight !== criterion.suggestedWeight && (
                  <button
                    onClick={() => resetWeight(criterion.id, criterion.suggestedWeight)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                    title="Reset to suggested"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => removeCriterion(criterion.id)}
                  className="p-1.5 rounded-lg text-slate-700 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={criterion.weight}
                onChange={(e) => updateWeight(criterion.id, Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    "text-2xl font-bold w-8 text-right tabular-nums",
                    criterion.weight >= 7
                      ? "text-emerald-400"
                      : criterion.weight >= 4
                      ? "text-amber-400"
                      : "text-slate-500"
                  )}
                >
                  {criterion.weight}
                </span>
                <span className="text-slate-600 text-sm">/10</span>
              </div>
            </div>

            {criterion.weight !== criterion.suggestedWeight && (
              <div className="mt-2 flex items-center gap-1.5">
                <Info className="w-3 h-3 text-slate-600" />
                <span className="text-xs text-slate-600">
                  AI suggested: {criterion.suggestedWeight}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={addCustom}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Custom Criterion
        </button>
        <button
          onClick={onNext}
          disabled={criteria.length < 2}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200",
            criteria.length >= 2
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          )}
        >
          Rate My Options
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
