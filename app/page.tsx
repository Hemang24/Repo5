"use client";

import { useState, useCallback } from "react";
import type {
  Criterion,
  DecisionOption,
  DevilArgument,
  FollowUpQuestion,
  SynthesisReport,
  WeightedResult,
  WizardStep,
  AnalysisResponse,
  AnalysisOptionRaw,
} from "@/lib/types";
import { calculateWeightedScores } from "@/lib/utils";
import StepIndicator from "@/components/StepIndicator";
import Step1Question from "@/components/Step1Question";
import Step2Criteria from "@/components/Step2Criteria";
import Step3Options from "@/components/Step3Options";
import Step4DevilsAdvocate from "@/components/Step4DevilsAdvocate";
import Step5FollowUp from "@/components/Step5FollowUp";
import Step6Report from "@/components/Step6Report";

export default function Home() {
  const [step, setStep] = useState<WizardStep>(1);

  // Core data
  const [question, setQuestion] = useState("");
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [options, setOptions] = useState<DecisionOption[]>([]);
  const [devilArgs, setDevilArgs] = useState<DevilArgument[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [report, setReport] = useState<SynthesisReport | null>(null);
  const [results, setResults] = useState<WeightedResult[]>([]);

  // Loading states
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingDevil, setLoadingDevil] = useState(false);
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);
  const [loadingSynthesize, setLoadingSynthesize] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 → Step 2: generate criteria + options
  const handleQuestionSubmit = useCallback(async (q: string) => {
    setQuestion(q);
    setLoadingAnalysis(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data: AnalysisResponse = await res.json();

      const fullCriteria: Criterion[] = data.criteria.map((c) => ({
        ...c,
        weight: c.suggestedWeight,
      }));

      const fullOptions: DecisionOption[] = data.options.map((o: AnalysisOptionRaw) => ({
        id: o.id,
        name: o.name,
        description: o.description,
        scores: o.initialRatings,
      }));

      setCriteria(fullCriteria);
      setOptions(fullOptions);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoadingAnalysis(false);
    }
  }, []);

  // Step 2 → Step 3
  const handleCriteriaNext = useCallback(() => {
    setStep(3);
  }, []);

  // Step 3 → Step 4: compute results + generate devil's advocate
  const handleOptionsNext = useCallback(async () => {
    const computed = calculateWeightedScores(criteria, options);
    setResults(computed);
    const winner = computed[0];

    setLoadingDevil(true);
    setStep(4);
    setError(null);
    try {
      const res = await fetch("/api/devils-advocate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          winnerOption: { id: winner.optionId, name: winner.optionName },
          winnerScore: winner.totalScore,
          allOptions: options.map((o) => ({ id: o.id, name: o.name })),
          criteria: criteria.map((c) => ({ id: c.id, name: c.name, weight: c.weight })),
        }),
      });
      if (!res.ok) throw new Error("Devil's advocate generation failed");
      const data = await res.json();

      const args: DevilArgument[] = (data.arguments ?? []).map(
        (a: { id: string; title: string; argument: string }) => ({
          ...a,
          userReaction: null,
          userComment: "",
        })
      );
      setDevilArgs(args);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoadingDevil(false);
    }
  }, [criteria, options, question]);

  // React to devil's advocate argument
  const handleDevilReact = useCallback(
    (id: string, reaction: DevilArgument["userReaction"], comment: string) => {
      setDevilArgs((prev) =>
        prev.map((a) => (a.id === id ? { ...a, userReaction: reaction, userComment: comment } : a))
      );
    },
    []
  );

  // Step 4 → Step 5: generate follow-up questions
  const handleDevilNext = useCallback(async () => {
    setLoadingFollowUp(true);
    setStep(5);
    setError(null);
    try {
      const winner = results[0];
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          winnerOption: winner?.optionName,
          criteria: criteria.map((c) => ({ id: c.id, name: c.name, weight: c.weight })),
          devilArguments: devilArgs.map((a) => ({ id: a.id, title: a.title })),
          reactions: devilArgs.map((a) => a.userReaction),
        }),
      });
      if (!res.ok) throw new Error("Follow-up generation failed");
      const data = await res.json();

      const fqs: FollowUpQuestion[] = (data.questions ?? []).map(
        (q: { id: string; question: string; context: string }) => ({
          ...q,
          answer: "",
        })
      );
      setFollowUpQuestions(fqs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoadingFollowUp(false);
    }
  }, [results, question, criteria, devilArgs]);

  // Step 5 → Step 6: synthesize report
  const handleFollowUpNext = useCallback(async () => {
    setLoadingSynthesize(true);
    setError(null);
    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          results,
          criteria: criteria.map((c) => ({ id: c.id, name: c.name, weight: c.weight })),
          devilArguments: devilArgs.map((a) => ({ id: a.id, title: a.title, argument: a.argument })),
          reactions: devilArgs.map((a) => a.userReaction),
          followUpQA: followUpQuestions.map((q) => ({
            question: q.question,
            answer: q.answer,
          })),
        }),
      });
      if (!res.ok) throw new Error("Synthesis failed");
      const data: SynthesisReport = await res.json();
      setReport(data);
      setStep(6);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoadingSynthesize(false);
    }
  }, [question, results, criteria, devilArgs, followUpQuestions]);

  // Restart
  const handleRestart = useCallback(() => {
    setStep(1);
    setQuestion("");
    setCriteria([]);
    setOptions([]);
    setDevilArgs([]);
    setFollowUpQuestions([]);
    setReport(null);
    setResults([]);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#020817]">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="font-semibold text-white text-sm">DecideAI</span>
          </div>
          {step > 1 && (
            <button
              onClick={handleRestart}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Start over
            </button>
          )}
        </div>
      </nav>

      {/* Step indicator — show for steps 2-6 */}
      {step > 1 && (
        <div className="relative z-10 border-b border-slate-900/60">
          <StepIndicator current={step} />
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10">
        {step === 1 && (
          <Step1Question onSubmit={handleQuestionSubmit} loading={loadingAnalysis} />
        )}

        {step === 2 && criteria.length > 0 && (
          <Step2Criteria
            criteria={criteria}
            onChange={setCriteria}
            onNext={handleCriteriaNext}
            question={question}
          />
        )}

        {step === 3 && (
          <Step3Options
            criteria={criteria}
            options={options}
            onChange={setOptions}
            onNext={handleOptionsNext}
          />
        )}

        {step === 4 && (
          <Step4DevilsAdvocate
            winnerName={results[0]?.optionName ?? ""}
            winnerScore={results[0]?.totalScore ?? 0}
            arguments={devilArgs}
            loading={loadingDevil}
            onReact={handleDevilReact}
            onNext={handleDevilNext}
          />
        )}

        {step === 5 && (
          <Step5FollowUp
            questions={followUpQuestions}
            loading={loadingFollowUp}
            onChange={setFollowUpQuestions}
            onNext={handleFollowUpNext}
            generating={loadingSynthesize}
          />
        )}

        {step === 6 && report && results.length > 0 && (
          <Step6Report
            question={question}
            criteria={criteria}
            options={options}
            results={results}
            report={report}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
