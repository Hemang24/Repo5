"use client";
import { ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FollowUpQuestion } from "@/lib/types";

interface Props {
  questions: FollowUpQuestion[];
  loading: boolean;
  onChange: (questions: FollowUpQuestion[]) => void;
  onNext: () => void;
  generating: boolean;
}

export default function Step5FollowUp({ questions, loading, onChange, onNext, generating }: Props) {
  const updateAnswer = (id: string, answer: string) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, answer } : q)));
  };

  const answered = questions.filter((q) => q.answer.trim().length > 0).length;
  const canProceed = answered >= Math.ceil(questions.length * 0.6);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-slide-up">
      <div className="mb-8">
        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">
          Step 5 of 6
        </div>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-6 h-6 text-violet-400" />
          <h2 className="text-3xl font-bold text-white">Deepen the picture</h2>
        </div>
        <p className="text-slate-400">
          These questions were generated based on your specific decision, the weights you set, and
          how you reacted to the counter-arguments. Answer in your own words.
        </p>
      </div>

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-1/2 mb-4" />
              <div className="h-20 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5 mb-8">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={cn(
                "glass-card rounded-xl p-6 transition-all duration-200",
                q.answer.trim() && "border-indigo-500/20"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-violet-400 text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <p className="text-white font-medium leading-relaxed">{q.question}</p>
                  <p className="text-xs text-slate-500 mt-1 italic">{q.context}</p>
                </div>
              </div>
              <textarea
                value={q.answer}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                placeholder="Your thoughts..."
                rows={3}
                className="w-full bg-slate-950/60 border border-slate-700/40 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all leading-relaxed"
              />
              {q.answer.trim() && (
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-emerald-500/60">✓ answered</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
        <span>
          {answered}/{questions.length} answered
        </span>
        <span className="text-xs">
          {canProceed ? "Ready to generate your report" : `Answer ${Math.ceil(questions.length * 0.6) - answered} more to continue`}
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed || generating}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200",
          canProceed && !generating
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        )}
      >
        {generating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Building your personalized report...
          </>
        ) : (
          <>
            Generate My Report
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
