/**
 * Week Progress Types
 * Tracks student attempts on Week 1-4 practice problems
 */

export interface ProblemAttempt {
  id: string;
  studentId: string;
  problemId: string;
  weekNumber: number;
  attemptNumber: number;

  // CERC Response
  cercResponse: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };

  // Session data
  sessionData: {
    startTime: number;
    endTime: number;
    timeSpentSeconds: number;

    phases: {
      understand: { completed: boolean; timestamp?: number };
      solve: { completed: boolean; timestamp?: number };
      justify: { completed: boolean; timestamp?: number };
      selfCheck: {
        completed: boolean;
        timestamp?: number;
        hintsViewed: number[]; // [1, 2, 3]
        solutionViewed: boolean;
        revised: boolean;
      };
      reflection: {
        completed: boolean;
        timestamp?: number;
        learnings: string[];
        customNote?: string;
      };
    };
  };

  // Results
  xpEarned: number;
  xpBreakdown: {
    base: number;
    bonuses: { name: string; amount: number }[];
    total: number;
  };

  // Metadata
  createdAt: Date;
}

export interface StudentWeekSummary {
  studentId: string;
  weekNumber: number;

  // Overall stats
  problemsAttempted: number;
  problemsCompleted: number;
  totalAttempts: number;
  totalXP: number;
  averageTimePerProblem: number; // in seconds

  // Attempt history
  attempts: ProblemAttempt[];

  // Latest reasoning stage (evolves over time)
  currentReasoningStage: "empirical" | "generic" | "formal";

  // Metadata
  firstAttemptAt?: Date;
  lastAttemptAt?: Date;
}

export interface StudentOverviewForAdmin {
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: "calculus-ab" | "calculus-bc" | "statistics";

  // Overall progress
  totalXP: number;
  currentReasoningStage: "empirical" | "generic" | "formal";
  badges: string[];

  // Week-by-week summary
  weekSummaries: {
    [weekNumber: number]: {
      problemsCompleted: number;
      totalProblems: number;
      totalAttempts: number;
      xpEarned: number;
      lastActivity?: Date;
    };
  };

  // Recent activity (last 10 attempts across all weeks)
  recentAttempts: Array<{
    attemptId: string;
    problemId: string;
    weekNumber: number;
    problemTitle: string;
    xpEarned: number;
    timestamp: Date;
  }>;

  // Red flags
  flags: Array<{
    type: "inactive" | "struggling" | "no_progress";
    message: string;
    weekNumber?: number;
  }>;

  // Metadata
  enrolledAt: Date;
  lastActiveAt?: Date;
}
