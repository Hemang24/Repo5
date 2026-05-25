"use client";
import { ChevronRight, Flame, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DevilArgument } from "@/lib/types";

interface Props {
  winnerName: string;
  winnerScore: number;
  arguments: DevilArgument[];
  loading: boolean;
  onReact: (id: string, reaction: DevilArgument["userReaction"], comment: string) => void;
  onNext: () => void;
}

export default function Step4DevilsAdvocate({
  winnerName,
  winnerScore,
  arguments: args,
  loading,
  onReact,
  onNext,
}: Props) {
  const allReacted = args.length > 0 && args.every((a) => a.userReaction !== null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-slide-up">
      <div className="mb-8">
        <div className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">
          Step 4 of 6
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-6 h-6 text-rose-400" />
          <h2 className="text-3xl font-bold text-white">Devil&apos;s Advocate</h2>
        </div>
        <p className="text-slate-400 mb-4">
          Your analysis points to{" "}
          <strong className="text-white">&ldquo;{winnerName}&rdquo;</strong> ({winnerScore}/10
          weighted score). Before you commit, let&apos;s pressure-test that.
        </p>
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-200/80">
          Here are the strongest arguments <strong>against</strong> your leading choice. React to
          each — it shapes your personalized follow-up questions.
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-800 rounded w-full mb-2" />
              <div className="h-3 bg-slate-800 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {args.map((arg, i) => (
            <div
              key={arg.id}
              className={cn(
                "glass-card rounded-xl p-6 transition-all duration-300",
                arg.userReaction === "agree" && "border-rose-500/30 bg-rose-500/5",
                arg.userReaction === "disagree" && "border-emerald-500/30 bg-emerald-500/5",
                arg.userReaction === "neutral" && "border-slate-600/30"
              )}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-rose-400 text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{arg.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{arg.argument}</p>
                </div>
              </div>

              {/* Reaction buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onReact(arg.id, "agree", arg.userComment)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                    arg.userReaction === "agree"
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                      : "border-slate-700 text-slate-400 hover:border-rose-500/30 hover:text-rose-300 hover:bg-rose-500/10"
                  )}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Fair point
                </button>
                <button
                  onClick={() => onReact(arg.id, "disagree", arg.userComment)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                    arg.userReaction === "disagree"
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "border-slate-700 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/10"
                  )}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Disagree
                </button>
                <button
                  onClick={() => onReact(arg.id, "neutral", arg.userComment)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                    arg.userReaction === "neutral"
                      ? "bg-slate-600/30 border-slate-500/40 text-slate-300"
                      : "border-slate-700 text-slate-500 hover:border-slate-500/30 hover:text-slate-300"
                  )}
                >
                  <Minus className="w-3.5 h-3.5" />
                  Unsure
                </button>
              </div>

              {/* Comment box — shows after reaction */}
              {arg.userReaction !== null && (
                <div className="mt-3">
                  <textarea
                    value={arg.userComment}
                    onChange={(e) => onReact(arg.id, arg.userReaction, e.target.value)}
                    placeholder={
                      arg.userReaction === "agree"
                        ? "Why does this concern you? (optional)"
                        : "What's your counter-argument? (optional)"
                    }
                    rows={2}
                    className="w-full bg-slate-950/60 border border-slate-700/40 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500/40 transition-all"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!allReacted}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200",
          allReacted
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        )}
      >
        {!allReacted ? `React to all arguments (${args.filter((a) => a.userReaction !== null).length}/${args.length})` : "Answer Follow-Up Questions"}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
