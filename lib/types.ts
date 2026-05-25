export interface Criterion {
  id: string;
  name: string;
  description: string;
  emoji: string;
  weight: number; // 0-10
  suggestedWeight: number;
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  scores: Record<string, number>; // criterionId -> 0-10
}

export interface WeightedResult {
  optionId: string;
  optionName: string;
  totalScore: number;
  maxPossible: number;
  percentage: number;
  breakdown: { criterionId: string; criterionName: string; raw: number; weighted: number }[];
}

export interface DevilArgument {
  id: string;
  title: string;
  argument: string;
  userReaction: "agree" | "disagree" | "neutral" | null;
  userComment: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  context: string;
  answer: string;
}

export interface AnalysisOptionRaw {
  id: string;
  name: string;
  description: string;
  initialRatings: Record<string, number>;
}

export interface AnalysisResponse {
  criteria: Omit<Criterion, "weight">[];
  options: AnalysisOptionRaw[];
}

export interface SynthesisReport {
  title: string;
  executiveSummary: string;
  keyInsights: string[];
  recommendation: string;
  reasoning: string;
  confidenceScore: number;
  alternativeConsiderations: string;
  personalNote: string;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
