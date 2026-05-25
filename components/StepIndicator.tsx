"use client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { num: 1, label: "Your Decision" },
  { num: 2, label: "What Matters" },
  { num: 3, label: "Rate Options" },
  { num: 4, label: "Devil's Advocate" },
  { num: 5, label: "Go Deeper" },
  { num: 6, label: "Your Report" },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const done = current > step.num;
            const active = current === step.num;
            return (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300",
                      done &&
                        "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30",
                      active &&
                        "bg-indigo-600/20 border-indigo-400 text-indigo-300 shadow-lg shadow-indigo-500/20 scale-110",
                      !done && !active && "bg-slate-900 border-slate-700 text-slate-500"
                    )}
                  >
                    {done ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block whitespace-nowrap transition-colors duration-300",
                      active && "text-indigo-300",
                      done && "text-slate-400",
                      !done && !active && "text-slate-600"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 transition-all duration-500",
                      current > step.num ? "bg-indigo-600" : "bg-slate-800"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
