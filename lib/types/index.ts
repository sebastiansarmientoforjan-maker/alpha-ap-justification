// User Types
export type UserRole = "student" | "admin";

export type Course = "calculus-ab" | "calculus-bc" | "statistics" | "precalculus";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  course: Course | null;
  createdAt: Date;
}

// Reasoning Stage Types
export type ReasoningStage = "empirical" | "generic" | "formal";

// CERC Framework Types
export interface CERCResponse {
  claim: string;
  evidence: string;
  reasoning: string;
  conditions: string;
  timestamp: Date;
}

// Problem Types
export type ErrorCategory = "CONDITION_BYPASS" | "LOCAL_ONLY_ARGUMENT" | "CER_BREAKDOWN";

export interface Problem {
  id: string;
  weekNumber: number;
  statement: string;
  errorCategory: ErrorCategory;
  trapDescription: string; // admin only
  cercSkeleton: string; // admin only
  sentenceFrame: string | null;
  createdAt: Date;
}

// Progress Types
export interface WeekProgress {
  weekNumber: number;
  cercResponses: CERCResponse[];
  reasoningStage: ReasoningStage;
  xpEarned: number;
  badges: string[];
  exitTicket: ExitTicket | null;
  completedAt: Date | null;
}

export interface ExitTicket {
  response: string;
  timestamp: Date;
}

// Feedback Types
export type FeedbackRole = "ai" | "student";
export type HintLevel = 1 | 2 | 3;

export interface FeedbackMessage {
  role: FeedbackRole;
  content: string;
  timestamp: Date;
}

export interface Feedback {
  userId: string;
  problemId: string;
  dialogue: FeedbackMessage[];
  hintLevel: HintLevel;
  revisionCount: number;
}

// XP and Badge Types
export interface XPEvent {
  amount: number;
  reason: string;
  timestamp: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date | null;
}

// Admin Dashboard Types
export interface StudentProgressSummary {
  userId: string;
  userName: string;
  course: Course | null;
  currentWeek: number;
  completedWeeks: number[];
  totalXP: number;
  badges: string[];
  currentReasoningStage: ReasoningStage;
  weeklyProgress: WeekProgress[];

  // FRQ Workflow data
  recentQuizzes: Quiz[];
  pendingFRQs: FRQAssignment[];
  completedFRQs: FRQAssignment[];
}

// Quiz and FRQ Types
export interface Quiz {
  id: string;
  studentId: string;
  topic: string; // "Derivatives", "Integrals", etc.
  score: number; // 0-100
  completedAt: Date;
  frqAssigned: boolean; // If FRQ has been assigned
  manuallyTriggered: boolean;
}

export type FRQType = "general" | "topic";
export type FRQStatus = "pending" | "submitted" | "graded" | "feedback_delivered";
export type ScaffoldingLevel = "full" | "structural" | "minimal" | "none";

// Course content scaffolding for FRQs
export interface CERCScaffolding {
  level: ScaffoldingLevel;
  sentenceFrames?: string[]; // e.g., "The function is continuous because..."
  theoremHints?: string[];   // e.g., "Recall MVT from Week 2"
}

// Links to relevant course content
export interface ContentLink {
  weekNumber: number;
  section: string;
  concept: string;  // e.g., "Mean Value Theorem hypothesis verification"
}

export interface FRQAssignment {
  id: string;
  studentId: string;
  quizId: string;
  type: FRQType; // General (always) or Topic (if <80%)
  topic: string; // Topic from quiz
  problemStatement: string;
  assignedAt: Date;
  dueDate: Date;
  status: FRQStatus;

  // NEW: Course content integration
  weekReference?: number;  // Week 1-4 that student should study
  cercScaffolding?: CERCScaffolding;
  contentLinks?: ContentLink[];

  // NEW: Prerequisites blocking
  blocked?: boolean; // If true, student can't access until prerequisites met
  blockedReason?: string; // User-friendly message explaining why blocked
  prerequisiteCheck?: {
    weekNumber: number;
    problemsCompleted: number;
    problemsRequired: number;
  };
}

export interface FRQSubmission {
  id: string;
  assignmentId: string;
  studentId: string;

  // Student work
  fileUrl: string; // S3/Firebase Storage URL of PDF/photo
  selfEvaluation: {
    score: number; // 0-9 (CB rubric)
    notes: string;
  };
  submittedAt: Date;

  // MathGrader.AI (legacy - now part of DualGradingResult)
  mathGraderOutput: string | null;
  mathGraderScore: number | null;

  // Sebastian feedback (legacy - now part of DualGradingResult)
  actionPoints: string[] | null; // 3 action points
  feedbackDeliveredAt: Date | null;
}

// CERC Analysis from Claude Vision
export interface CERCAnalysis {
  claim: { score: number; feedback: string };
  evidence: { score: number; feedback: string };
  reasoning: { score: number; feedback: string };
  conditions: { score: number; feedback: string };
  totalScore: number; // 0-9
}

// Dual Grading System Types
export interface DualGradingResult {
  id: string;
  submissionId: string;
  assignmentId: string;
  studentId: string;

  // Grader 1: Claude Vision (automatic)
  grader1: {
    name: "Claude Vision";
    output: string;
    score: number; // 0-9
    cerc: CERCAnalysis;
    reasoningStage?: ReasoningStage;
    actionPoints: string[]; // Auto-generated action points
    timestamp: Date;
  };

  // Grader 2: MathGrader.AI or Manual (optional)
  grader2?: {
    name: "MathGrader.AI" | "Manual Review";
    output: string;
    score: number;
    timestamp: Date;
  };

  // Admin Consolidation
  adminConsolidation?: {
    finalScore: number; // 0-9
    consolidatedFeedback: string;
    actionPoints: string[]; // Final 3 action points
    adminNotes?: string;
    reviewedBy: string; // Admin user ID
    reviewedAt: Date;
  };

  createdAt: Date;
}
