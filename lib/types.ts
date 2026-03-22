/**
 * Core TypeScript types for AP Justification Training
 */

export interface Problem {
  id: string;
  weekNumber: number;
  statement: string;
  errorCategory: "CONDITION_BYPASS" | "LOCAL_ONLY_ARGUMENT" | "CER_BREAKDOWN";
  trapDescription?: string; // Admin only
  cercSkeleton: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  sentenceFrame?: string | null;
  difficulty?: "basic" | "intermediate" | "advanced";
  expectedMinutes: number; // Expected completion time for XP calculation
}

export interface CERCResponse {
  claim: string;
  evidence: string;
  reasoning: string;
  conditions: string;
  problemId?: string;
  timestamp?: string;
}

export interface StudentProgress {
  attemptNumber: number;
  lastResponse?: Partial<CERCResponse>;
  xpEarned: number;
  reasoningStage: "empirical" | "generic" | "formal";
}

export interface EvaluationFeedback {
  overallScore: number;
  breakdown: {
    claim: {
      score: number;
      feedback: string;
      missingElements: string[];
    };
    evidence: {
      score: number;
      feedback: string;
      missingElements: string[];
    };
    reasoning: {
      score: number;
      feedback: string;
      missingElements: string[];
    };
    conditions: {
      score: number;
      feedback: string;
      missingElements: string[];
    };
  };
  hintLevel: 1 | 2 | 3;
  socraticQuestion: string;
  approved: boolean;
  xpAwarded: number;
  reasoningStageUpdate?: "empirical" | "generic" | "formal" | null;
  badgesUnlocked?: string[];
  timestamp?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpValue: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  course: "calculus" | "statistics";
  reasoningStage: "empirical" | "generic" | "formal";
  totalXP: number;
  badges: string[];
  weekProgress: {
    [weekNumber: number]: {
      problemsCompleted: number;
      xpEarned: number;
      attemptsMade: number;
    };
  };
}
