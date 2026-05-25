import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Criterion, DecisionOption, WeightedResult } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateWeightedScores(
  criteria: Criterion[],
  options: DecisionOption[]
): WeightedResult[] {
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return options
    .map((option) => {
      const breakdown = criteria.map((criterion) => {
        const raw = option.scores[criterion.id] ?? 0;
        const weighted = totalWeight > 0 ? (raw * criterion.weight) / totalWeight : 0;
        return {
          criterionId: criterion.id,
          criterionName: criterion.name,
          raw,
          weighted,
        };
      });

      const totalScore = breakdown.reduce((sum, b) => sum + b.weighted, 0);
      const maxPossible = 10;
      const percentage = (totalScore / maxPossible) * 100;

      return {
        optionId: option.id,
        optionName: option.name,
        totalScore: Math.round(totalScore * 100) / 100,
        maxPossible,
        percentage: Math.round(percentage),
        breakdown,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

export function getScoreColor(score: number): string {
  if (score >= 7.5) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-rose-400";
}

export function getScoreBg(score: number): string {
  if (score >= 7.5) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 5) return "bg-amber-500/20 border-amber-500/30";
  return "bg-rose-500/20 border-rose-500/30";
}

export const OPTION_COLORS = [
  { stroke: "#6366f1", fill: "rgba(99,102,241,0.15)" },
  { stroke: "#8b5cf6", fill: "rgba(139,92,246,0.15)" },
  { stroke: "#10b981", fill: "rgba(16,185,129,0.15)" },
  { stroke: "#f59e0b", fill: "rgba(245,158,11,0.15)" },
  { stroke: "#ec4899", fill: "rgba(236,72,153,0.15)" },
];
