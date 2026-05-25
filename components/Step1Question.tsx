"use client";
import { useState } from "react";
import { Sparkles, ChevronRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  "Should I leave my job to start my own company?",
  "Should I move to a new city for this opportunity?",
  "Which of these job offers should I accept?",
  "Should I go back to school or continue working?",
  "Should I rent or buy a home right now?",
];

interface Props {
  onSubmit: (question: string) => void;
  loading: boolean;
}

export default function Step1Question({ onSubmit, loading }: Props) {
  const [question, setQuestion] = useState("");

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-slide-up">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-indigo-300 font-medium">AI-Powered Decision Analysis</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          <span className="text-white">Make decisions with </span>
          <span className="gradient-text">clarity</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
          Frame your decision, weight what matters, and get a personalized analysis — including a
          devil&apos;s advocate that challenges your instincts.
        </p>
      </div>

      {/* Input card */}
      <div className="glass-card rounded-2xl p-8 border-glow-animate mb-8">
        <label className="block text-slate-200 font-semibold text-lg mb-3">
          What decision are you trying to make?
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Be specific — the more context you give, the more precise your analysis will be..."
          rows={4}
          className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-base leading-relaxed"
        />
        <div className="flex items-center justify-between mt-2 mb-6">
          <span className="text-xs text-slate-600">{question.length}/500</span>
          <span className="text-xs text-slate-600">
            {question.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        <button
          onClick={() => question.trim() && onSubmit(question.trim())}
          disabled={!question.trim() || loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200",
            question.trim() && !loading
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          )}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating your analysis...
            </>
          ) : (
            <>
              Analyze My Decision
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Examples */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-slate-500 font-medium">Examples to get you started</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuestion(ex)}
              className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/30 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
