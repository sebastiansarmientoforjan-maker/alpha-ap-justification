/**
 * Mock Data Adapter
 *
 * Local development adapter with hardcoded data.
 * Implements the full DataService interface for offline development.
 * No external dependencies - all data stored in memory.
 */

import {
  User,
  Problem,
  WeekProgress,
  Feedback,
  StudentProgressSummary,
  Quiz,
  FRQAssignment,
  FRQSubmission,
  CERCResponse,
  ReasoningStage,
  DualGradingResult,
} from "@/lib/types";
import {
  ProblemAttempt,
  StudentWeekSummary,
  StudentOverviewForAdmin,
} from "@/lib/types/week-progress";
import { week1Problems } from "@/data/week-1-content";
import { DataService } from "./index";

// Mock Users
const mockUsers: User[] = [
  {
    id: "ananya-001",
    email: "ananya.k@alphahigh.edu",
    name: "Ananya Kakarlapudi",
    role: "student",
    course: "calculus-bc",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "elle-001",
    email: "elle.l@alphahigh.edu",
    name: "Elle Liemandt",
    role: "student",
    course: "calculus-bc",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "sloka-001",
    email: "sloka.v@alphahigh.edu",
    name: "Sloka Vudumu",
    role: "student",
    course: "calculus-ab",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "alex-001",
    email: "alex.m@alphahigh.edu",
    name: "Alex Mathew",
    role: "student",
    course: "calculus-bc",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "emily-001",
    email: "emily.s@alphahigh.edu",
    name: "Emily Smith",
    role: "student",
    course: "precalculus",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "maddie-001",
    email: "maddie.p@alphahigh.edu",
    name: "Maddie Price",
    role: "student",
    course: "calculus-ab",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "sloane-001",
    email: "sloane.p@alphahigh.edu",
    name: "Sloane Price",
    role: "student",
    course: "calculus-ab",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "sebastian-admin",
    email: "sebastian@alphahigh.edu",
    name: "Sebastian",
    role: "admin",
    course: null,
    createdAt: new Date("2025-01-01"),
  },
  // Test student (phantom from TimeBack)
  {
    id: "1a69ff43-1036-4507-bf21-0ac45ab93666",
    email: "test.20._test_@alpha.school",
    name: "Test 20 _test_",
    role: "student",
    course: "calculus-ab",
    createdAt: new Date("2025-01-10"),
  },
];

// Mock Problems - Map from week-1-content.ts to Problem structure
const mockProblems: Problem[] = [
  // Week 1 problems from content file
  ...week1Problems.map((problem) => ({
    id: problem.id,
    weekNumber: 1,
    statement: problem.statement,
    errorCategory: problem.errorCategory,
    trapDescription: problem.trap,
    cercSkeleton: problem.correctCERCResponse,
    sentenceFrame: problem.sentenceFrames.claim, // Use first sentence frame as representative
    createdAt: new Date("2025-02-01"),
  })),

  // Week 2-4 problems (keeping existing for now)
  {
    id: "prob-w2-001",
    weekNumber: 2,
    statement: "Let $h(x) = x^3 - 6x^2 + 9x + 1$ on $[0, 4]$. Use the Extreme Value Theorem to justify that $h$ has an absolute maximum on this interval.",
    errorCategory: "CONDITION_BYPASS",
    trapDescription: "Students must explicitly verify that h is continuous on [0,4], not just assume it.",
    cercSkeleton: {
      claim: "By the Extreme Value Theorem, h(x) has an absolute maximum on [0, 4].",
      evidence: "h(x) = x³ - 6x² + 9x + 1 is a polynomial function.",
      reasoning: "The EVT states that if a function is continuous on a closed interval [a, b], then it attains both an absolute maximum and minimum on that interval.",
      conditions: "Polynomial functions are continuous everywhere. Therefore, h is continuous on [0, 4], satisfying the EVT hypothesis.",
    },
    sentenceFrame: null,
    createdAt: new Date("2025-02-08"),
  },
  {
    id: "prob-w3-001",
    weekNumber: 3,
    statement: "A function $f$ is twice differentiable on $\\mathbb{R}$. You are given that $f''(x) > 0$ for all $x$ in $(a, b)$. Prove that $f$ is concave up on $(a, b)$ and explain what this means for the tangent lines to the graph of $f$.",
    errorCategory: "LOCAL_ONLY_ARGUMENT",
    trapDescription: "Students must construct a global argument about the behavior across the entire interval, not just at isolated points.",
    cercSkeleton: {
      claim: "f is concave up on (a, b), meaning the graph of f lies above all of its tangent lines on this interval.",
      evidence: "f''(x) > 0 for all x in (a, b).",
      reasoning: "If f''(x) > 0 on an interval, then f' is strictly increasing on that interval. A function with an increasing derivative is concave up.",
      conditions: "f is twice differentiable on ℝ, so f'' exists and is defined on (a, b). The condition f''(x) > 0 holds for every x in (a, b), not just isolated points.",
    },
    sentenceFrame: null,
    createdAt: new Date("2025-02-15"),
  },
  {
    id: "prob-w4-001",
    weekNumber: 4,
    statement: "Let $f(x) = \\begin{cases} x^2 \\sin(1/x) & \\text{if } x \\neq 0 \\\\ 0 & \\text{if } x = 0 \\end{cases}$. Determine whether $f$ is differentiable at $x = 0$. If so, find $f'(0)$ and justify whether $f'$ is continuous at $x = 0$.",
    errorCategory: "CONDITION_BYPASS",
    trapDescription: "This is a multi-part AP-style question requiring differentiability check via limit definition, then continuity of the derivative.",
    cercSkeleton: {
      claim: "f is differentiable at x = 0 with f'(0) = 0, but f' is not continuous at x = 0.",
      evidence: "Using the limit definition: f'(0) = lim(h→0) [f(h) - f(0)]/h = lim(h→0) [h² sin(1/h)]/h = lim(h→0) h sin(1/h) = 0 by squeeze theorem. However, for x ≠ 0, f'(x) = 2x sin(1/x) - cos(1/x), and lim(x→0) f'(x) does not exist because cos(1/x) oscillates.",
      reasoning: "Differentiability requires the limit definition to exist. Continuity of f' requires lim(x→0) f'(x) = f'(0).",
      conditions: "f'(0) exists and equals 0. However, lim(x→0) f'(x) does not exist, so f' is not continuous at x = 0.",
    },
    sentenceFrame: null,
    createdAt: new Date("2025-02-22"),
  },
];

// Mock Progress Data
const mockProgressData: Record<string, WeekProgress[]> = {
  "ananya-001": [
    {
      weekNumber: 1,
      cercResponses: [
        {
          problemId: "w1-mvt-001",
          claim: "The MVT does not apply here.",
          evidence: "The function has a discontinuity at x=0.",
          reasoning: "MVT requires continuity on [a,b].",
          conditions: "f(x) is not continuous on [-1,1] because it's undefined at x=0.",
          timestamp: new Date("2025-02-03T10:30:00"),
        },
      ],
      reasoningStage: "generic",
      xpEarned: 150,
      badges: ["skeptic"],
      exitTicket: {
        response: "I learned that I need to always check the hypotheses of a theorem before applying it. The MVT trap was eye-opening.",
        timestamp: new Date("2025-02-03T11:00:00"),
      },
    },
  ],
  "elle-001": [
    {
      weekNumber: 1,
      cercResponses: [],
      reasoningStage: "empirical",
      xpEarned: 0,
      badges: [],
      exitTicket: null,
    },
  ],
  // Test student (phantom) - Week 1 completed
  "1a69ff43-1036-4507-bf21-0ac45ab93666": [
    {
      weekNumber: 1,
      cercResponses: [
        {
          problemId: "w1-mvt-001",
          claim: "The MVT cannot be applied to f(x)=1/x² on [-1,1].",
          evidence: "The function is undefined at x=0, creating a discontinuity.",
          reasoning: "The Mean Value Theorem requires the function to be continuous on the closed interval [a,b].",
          conditions: "f(x)=1/x² is not continuous on [-1,1] because lim(x→0) f(x) = ∞. The continuity condition is violated.",
          timestamp: new Date("2025-02-01T14:20:00"),
        },
        {
          problemId: "w1-ivt-002",
          claim: "The IVT does not guarantee a solution exists.",
          evidence: "Although f(-1)=-1 and f(1)=1, the function has a jump discontinuity.",
          reasoning: "The Intermediate Value Theorem only applies to continuous functions on [a,b].",
          conditions: "The piecewise function is not continuous at x=0, violating the IVT hypothesis.",
          timestamp: new Date("2025-02-01T14:45:00"),
        },
        {
          problemId: "w1-chain-003",
          claim: "The composition g(f(x)) is not differentiable at x=0.",
          evidence: "f(x) has a cusp at x=0 where f'(0) does not exist.",
          reasoning: "By the Chain Rule, (g∘f)'(x) = g'(f(x))·f'(x). If f'(x) is undefined, the composition is not differentiable.",
          conditions: "f(x)=|x| is not differentiable at x=0, so the Chain Rule cannot be applied there.",
          timestamp: new Date("2025-02-01T15:10:00"),
        },
      ],
      reasoningStage: "generic",
      xpEarned: 135,
      badges: ["skeptic"],
      exitTicket: {
        response: "I now understand that checking theorem conditions is not optional - it's the foundation of rigorous mathematical reasoning.",
        timestamp: new Date("2025-02-01T15:30:00"),
      },
    },
  ],
};

// Mock Feedback
const mockFeedback: Record<string, Record<string, Feedback>> = {
  "ananya-001": {
    "w1-mvt-001": {
      dialogue: [
        {
          role: "student",
          content: "I think MVT applies because we can compute the slope between the endpoints.",
          timestamp: new Date("2025-02-03T10:15:00"),
        },
        {
          role: "ai",
          content: "Good start. Before applying MVT, what conditions must the function satisfy on the interval [-1, 1]?",
          timestamp: new Date("2025-02-03T10:16:00"),
        },
        {
          role: "student",
          content: "It needs to be continuous on [-1,1] and differentiable on (-1,1). Wait... is f(x)=1/x² continuous at x=0?",
          timestamp: new Date("2025-02-03T10:20:00"),
        },
        {
          role: "ai",
          content: "Excellent observation! What happens to f(x) as x approaches 0?",
          timestamp: new Date("2025-02-03T10:21:00"),
        },
      ],
      hintLevel: 2,
      revisionCount: 1,
    },
  },
};

// Mock Quizzes
const mockQuizzes: Quiz[] = [
  {
    id: "quiz-001",
    studentId: "ananya-001",
    topic: "Derivatives",
    score: 85,
    completedAt: new Date("2025-02-15T10:30:00"),
    frqAssigned: true,
    manuallyTriggered: true,
  },
  {
    id: "quiz-002",
    studentId: "elle-001",
    topic: "Integrals",
    score: 92,
    completedAt: new Date("2025-02-16T14:00:00"),
    frqAssigned: true,
    manuallyTriggered: true,
  },
  {
    id: "quiz-003",
    studentId: "emily-001",
    topic: "Limits",
    score: 72,
    completedAt: new Date("2025-02-17T09:15:00"),
    frqAssigned: true,
    manuallyTriggered: true,
  },
  {
    id: "quiz-004",
    studentId: "alex-001",
    topic: "Chain Rule",
    score: 88,
    completedAt: new Date("2025-02-18T11:00:00"),
    frqAssigned: false,
    manuallyTriggered: true,
  },
];

// Mock FRQ Assignments
// NOTE: 1 FRQ per quiz
// - Score >= 80%: General FRQ (broad argumentation)
// - Score < 80%: Topic FRQ (specific to quiz topic)
const mockFRQAssignments: FRQAssignment[] = [
  {
    id: "frq-assign-001",
    studentId: "ananya-001",
    quizId: "quiz-001", // Score 85% >= 80%
    type: "general",
    topic: "Derivatives",
    problemStatement: "Explain the relationship between differentiability and continuity. Provide a rigorous proof using the CERC framework.",
    assignedAt: new Date("2025-02-15T10:35:00"),
    dueDate: new Date("2025-02-22T23:59:00"),
    status: "submitted",
  },
  {
    id: "frq-assign-004",
    studentId: "ananya-001",
    quizId: "quiz-004", // New quiz, score >= 80%
    type: "general",
    topic: "Chain Rule & Related Rates",
    problemStatement: "A ladder 10 feet long is leaning against a wall. If the bottom of the ladder slides away from the wall at a rate of 2 ft/s, at what rate is the top of the ladder sliding down the wall when the bottom is 6 feet from the wall? Justify your approach using the CERC framework, explicitly stating all assumptions and verifying that they hold.",
    assignedAt: new Date("2026-03-08T09:00:00"),
    dueDate: new Date("2026-03-15T23:59:00"),
    status: "pending",
    // NEW: Content integration
    weekReference: 2,
    cercScaffolding: {
      level: "structural", // Ananya is in generic stage
      theoremHints: [
        "Set up the equation relating all variables",
        "Differentiate both sides with respect to time (implicit differentiation)",
        "Plug in known values and solve for the unknown rate",
      ],
    },
    contentLinks: [
      {
        weekNumber: 2,
        section: "Chain Rule Application",
        concept: "Implicit differentiation with respect to time",
      },
      {
        weekNumber: 3,
        section: "Communication Precision",
        concept: "Stating assumptions and defining variables clearly",
      },
    ],
  },
  {
    id: "frq-assign-002",
    studentId: "elle-001",
    quizId: "quiz-002", // Score 92% >= 80%
    type: "general",
    topic: "Integrals",
    problemStatement: "Use the Fundamental Theorem of Calculus to evaluate a definite integral. Justify each step with proper notation and theorem verification.",
    assignedAt: new Date("2025-02-16T14:05:00"),
    dueDate: new Date("2025-02-23T23:59:00"),
    status: "graded",
  },
  {
    id: "frq-assign-003",
    studentId: "emily-001",
    quizId: "quiz-003", // Score 72% < 80%
    type: "topic",
    topic: "Limits",
    problemStatement: "Analyze a problem involving Limits. Apply the relevant theorem and explicitly verify all conditions (hypotheses) before drawing your conclusion. Use the CERC framework to structure your argument.",
    assignedAt: new Date("2025-02-17T09:20:00"),
    dueDate: new Date("2025-02-24T23:59:00"),
    status: "pending",
    // NEW: Content integration - Emily needs full scaffolding (empirical stage)
    weekReference: 1,
    cercScaffolding: {
      level: "full",
      sentenceFrames: [
        "**Claim**: [State your conclusion clearly]",
        "**Evidence**: [Show the relevant calculations and data]",
        "**Reasoning**: [Explain which theorem or principle connects your evidence to your claim]",
        "**Conditions**: [Verify explicitly that all theorem hypotheses are satisfied]",
      ],
      theoremHints: [
        "Check if direct substitution works",
        "Identify indeterminate forms",
        "Apply appropriate technique (factoring, L'Hôpital, etc.)",
      ],
    },
    contentLinks: [
      {
        weekNumber: 3,
        section: "Global Argumentation",
        concept: "Applying CERC framework to any problem",
      },
    ],
    // BLOCKED: Emily hasn't completed training problems
    blocked: true,
    blockedReason: "🔒 Complete 2 more training problems in Week 1 to unlock FRQ assignments",
    prerequisiteCheck: {
      weekNumber: 1,
      problemsCompleted: 0,
      problemsRequired: 2,
    },
  },
];

// Mock FRQ Submissions
const mockFRQSubmissions: FRQSubmission[] = [
  {
    id: "frq-sub-001",
    assignmentId: "frq-assign-001",
    studentId: "ananya-001",
    fileUrl: "/mock-uploads/ananya-frq-001.pdf",
    selfEvaluation: {
      score: 7,
      notes: "I think I covered all the conditions but I'm not sure if my explanation of the contrapositive was clear enough.",
    },
    submittedAt: new Date("2025-02-18T16:30:00"),
    mathGraderOutput: null,
    mathGraderScore: null,
    actionPoints: null,
    feedbackDeliveredAt: null,
  },
  {
    id: "frq-sub-002",
    assignmentId: "frq-assign-002",
    studentId: "elle-001",
    fileUrl: "/mock-uploads/elle-frq-002.pdf",
    selfEvaluation: {
      score: 8,
      notes: "I felt confident about my use of FTC Part 1 and verified continuity throughout the interval. Could have been more explicit with notation.",
    },
    submittedAt: new Date("2025-02-19T14:22:00"),
    mathGraderOutput: "Strong application of FTC Part 1. Continuity condition was verified correctly on [a,b]. The antiderivative F(x) was computed accurately with proper notation. Evaluation at boundaries shows clear understanding of the theorem's conclusion.\n\nMinor improvement: Could be more explicit when stating 'since f is continuous on [a,b], an antiderivative F exists' - this is the key hypothesis.\n\nOverall: Solid justification structure, clear reasoning chain from conditions to conclusion.",
    mathGraderScore: 8,
    actionPoints: [
      "Explicitly state theorem hypotheses before applying them (e.g., 'f is continuous on [a,b], therefore...')",
      "Strong work on antiderivative computation - maintain this precision in future problems",
      "Consider adding a brief conclusion sentence that ties back to the original question",
    ],
    feedbackDeliveredAt: null,
  },
];

export class MockAdapter implements DataService {
  // In-memory storage
  private users: User[] = [...mockUsers];
  private problems: Problem[] = [...mockProblems];
  private progressData: Record<string, WeekProgress[]> = JSON.parse(JSON.stringify(mockProgressData));
  private feedbackData: Record<string, Record<string, Feedback>> = JSON.parse(JSON.stringify(mockFeedback));
  private quizzes: Quiz[] = JSON.parse(JSON.stringify(mockQuizzes));
  private frqAssignments: FRQAssignment[] = JSON.parse(JSON.stringify(mockFRQAssignments));
  private frqSubmissions: FRQSubmission[] = JSON.parse(JSON.stringify(mockFRQSubmissions));
  private dualGradingResults: DualGradingResult[] = [];

  // New: Problem attempts storage
  private problemAttempts: ProblemAttempt[] = [
    // Test student (phantom) - Week 1 attempts
    {
      id: "attempt-phantom-001",
      studentId: "1a69ff43-1036-4507-bf21-0ac45ab93666",
      problemId: "w1-mvt-001",
      weekNumber: 1,
      attemptNumber: 1,
      cercResponse: {
        claim: "The MVT cannot be applied to f(x)=1/x² on [-1,1].",
        evidence: "The function is undefined at x=0, creating a discontinuity.",
        reasoning: "The Mean Value Theorem requires the function to be continuous on the closed interval [a,b].",
        conditions: "f(x)=1/x² is not continuous on [-1,1] because lim(x→0) f(x) = ∞. The continuity condition is violated.",
      },
      xpEarned: 50,
      hintsUsed: 1,
      completed: true,
      timeSpent: 1200, // 20 minutes
      createdAt: new Date("2025-02-01T14:20:00"),
    },
    {
      id: "attempt-phantom-002",
      studentId: "1a69ff43-1036-4507-bf21-0ac45ab93666",
      problemId: "w1-ivt-002",
      weekNumber: 1,
      attemptNumber: 1,
      cercResponse: {
        claim: "The IVT does not guarantee a solution exists.",
        evidence: "Although f(-1)=-1 and f(1)=1, the function has a jump discontinuity.",
        reasoning: "The Intermediate Value Theorem only applies to continuous functions on [a,b].",
        conditions: "The piecewise function is not continuous at x=0, violating the IVT hypothesis.",
      },
      xpEarned: 50,
      hintsUsed: 0,
      completed: true,
      timeSpent: 900, // 15 minutes
      createdAt: new Date("2025-02-01T14:45:00"),
    },
    {
      id: "attempt-phantom-003",
      studentId: "1a69ff43-1036-4507-bf21-0ac45ab93666",
      problemId: "w1-chain-003",
      weekNumber: 1,
      attemptNumber: 1,
      cercResponse: {
        claim: "The composition g(f(x)) is not differentiable at x=0.",
        evidence: "f(x) has a cusp at x=0 where f'(0) does not exist.",
        reasoning: "By the Chain Rule, (g∘f)'(x) = g'(f(x))·f'(x). If f'(x) is undefined, the composition is not differentiable.",
        conditions: "f(x)=|x| is not differentiable at x=0, so the Chain Rule cannot be applied there.",
      },
      xpEarned: 35,
      hintsUsed: 2,
      completed: true,
      timeSpent: 1050, // 17.5 minutes
      createdAt: new Date("2025-02-01T15:10:00"),
    },
  ];

  // Simulate async delay
  private async delay(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // User methods
  async getUser(userId: string): Promise<User | null> {
    await this.delay();
    return this.users.find(u => u.id === userId) || null;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.getUser(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.delay();
    return this.users.find(u => u.email === email) || null;
  }

  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    await this.delay();
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    await this.delay();
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...data };
    }
  }

  // Problem methods
  async getProblem(problemId: string): Promise<Problem | null> {
    await this.delay();
    const problem = this.problems.find(p => p.id === problemId);
    if (!problem) return null;

    // Return problem without admin-only fields
    const { trapDescription, cercSkeleton, ...publicProblem } = problem;
    return publicProblem as Problem;
  }

  async getProblemsByWeek(weekNumber: number): Promise<Problem[]> {
    await this.delay();
    return this.problems
      .filter(p => p.weekNumber === weekNumber)
      .map(({ trapDescription, cercSkeleton, ...publicProblem }) => publicProblem as Problem);
  }

  async getWeekProblems(weekNumber: number): Promise<Problem[]> {
    return this.getProblemsByWeek(weekNumber);
  }

  async createProblem(problem: Omit<Problem, "id" | "createdAt">): Promise<Problem> {
    await this.delay();
    const newProblem: Problem = {
      ...problem,
      id: `prob-${Date.now()}`,
      createdAt: new Date(),
    };
    this.problems.push(newProblem);
    return newProblem;
  }

  async getProblemWithAdminData(problemId: string): Promise<Problem | null> {
    await this.delay();
    return this.problems.find(p => p.id === problemId) || null;
  }

  async getStudentProblemProgress(studentId: string, problemId: string): Promise<{
    attemptNumber: number;
    lastResponse?: Partial<CERCResponse>;
    xpEarned: number;
    reasoningStage: "empirical" | "generic" | "formal";
  }> {
    await this.delay();

    // Get the problem to determine its week number
    const problem = this.problems.find(p => p.id === problemId);
    if (!problem) {
      return {
        attemptNumber: 1,
        xpEarned: 0,
        reasoningStage: "empirical",
      };
    }

    // Get student's progress for that week
    const userProgress = this.progressData[studentId] || [];
    const weekProgress = userProgress.find(p => p.weekNumber === problem.weekNumber);

    if (!weekProgress) {
      return {
        attemptNumber: 1,
        xpEarned: 0,
        reasoningStage: "empirical",
      };
    }

    // Find CERC responses for this specific problem
    const problemResponses = weekProgress.cercResponses.filter(r => r.problemId === problemId);
    const lastResponse = problemResponses.length > 0 ? problemResponses[problemResponses.length - 1] : undefined;

    return {
      attemptNumber: problemResponses.length + 1,
      lastResponse,
      xpEarned: weekProgress.xpEarned,
      reasoningStage: weekProgress.reasoningStage,
    };
  }

  // Progress methods
  async getWeekProgress(userId: string, weekNumber: number): Promise<WeekProgress | null> {
    await this.delay();
    const userProgress = this.progressData[userId] || [];
    return userProgress.find(p => p.weekNumber === weekNumber) || null;
  }

  async getAllProgress(userId: string): Promise<WeekProgress[]> {
    await this.delay();
    return this.progressData[userId] || [];
  }

  async getProgressByUser(userId: string): Promise<WeekProgress[]> {
    return this.getAllProgress(userId);
  }

  async saveCERCResponse(userId: string, weekNumber: number, response: CERCResponse): Promise<void> {
    await this.delay();
    if (!this.progressData[userId]) {
      this.progressData[userId] = [];
    }

    let weekProgress = this.progressData[userId].find(p => p.weekNumber === weekNumber);
    if (!weekProgress) {
      weekProgress = {
        weekNumber,
        cercResponses: [],
        reasoningStage: "empirical",
        xpEarned: 0,
        badges: [],
        exitTicket: null,
      };
      this.progressData[userId].push(weekProgress);
    }

    weekProgress.cercResponses.push(response);
  }

  async updateReasoningStage(userId: string, weekNumber: number, stage: ReasoningStage): Promise<void> {
    await this.delay();
    if (!this.progressData[userId]) {
      this.progressData[userId] = [];
    }

    let weekProgress = this.progressData[userId].find(p => p.weekNumber === weekNumber);
    if (!weekProgress) {
      weekProgress = {
        weekNumber,
        cercResponses: [],
        reasoningStage: stage,
        xpEarned: 0,
        badges: [],
        exitTicket: null,
      };
      this.progressData[userId].push(weekProgress);
    } else {
      weekProgress.reasoningStage = stage;
    }
  }

  async addXP(userId: string, weekNumber: number, amount: number): Promise<void> {
    await this.delay();
    if (!this.progressData[userId]) {
      this.progressData[userId] = [];
    }

    let weekProgress = this.progressData[userId].find(p => p.weekNumber === weekNumber);
    if (!weekProgress) {
      weekProgress = {
        weekNumber,
        cercResponses: [],
        reasoningStage: "empirical",
        xpEarned: amount,
        badges: [],
        exitTicket: null,
      };
      this.progressData[userId].push(weekProgress);
    } else {
      weekProgress.xpEarned += amount;
    }
  }

  async addBadge(userId: string, weekNumber: number, badgeId: string): Promise<void> {
    await this.delay();
    if (!this.progressData[userId]) {
      this.progressData[userId] = [];
    }

    let weekProgress = this.progressData[userId].find(p => p.weekNumber === weekNumber);
    if (!weekProgress) {
      weekProgress = {
        weekNumber,
        cercResponses: [],
        reasoningStage: "empirical",
        xpEarned: 0,
        badges: [badgeId],
        exitTicket: null,
      };
      this.progressData[userId].push(weekProgress);
    } else {
      if (!weekProgress.badges.includes(badgeId)) {
        weekProgress.badges.push(badgeId);
      }
    }
  }

  async saveExitTicket(userId: string, weekNumber: number, response: string): Promise<void> {
    await this.delay();
    if (!this.progressData[userId]) {
      this.progressData[userId] = [];
    }

    let weekProgress = this.progressData[userId].find(p => p.weekNumber === weekNumber);
    if (!weekProgress) {
      weekProgress = {
        weekNumber,
        cercResponses: [],
        reasoningStage: "empirical",
        xpEarned: 0,
        badges: [],
        exitTicket: {
          response,
          timestamp: new Date(),
        },
      };
      this.progressData[userId].push(weekProgress);
    } else {
      weekProgress.exitTicket = {
        response,
        timestamp: new Date(),
      };
    }
  }

  // Feedback methods
  async getFeedback(userId: string, problemId: string): Promise<Feedback | null> {
    await this.delay();
    return this.feedbackData[userId]?.[problemId] || null;
  }

  async saveFeedbackMessage(userId: string, problemId: string, role: "ai" | "student", content: string): Promise<void> {
    await this.delay();
    if (!this.feedbackData[userId]) {
      this.feedbackData[userId] = {};
    }
    if (!this.feedbackData[userId][problemId]) {
      this.feedbackData[userId][problemId] = {
        dialogue: [],
        hintLevel: 1,
        revisionCount: 0,
      };
    }

    this.feedbackData[userId][problemId].dialogue.push({
      role,
      content,
      timestamp: new Date(),
    });
  }

  async updateFeedbackHintLevel(userId: string, problemId: string, level: 1 | 2 | 3): Promise<void> {
    await this.delay();
    if (!this.feedbackData[userId]) {
      this.feedbackData[userId] = {};
    }
    if (!this.feedbackData[userId][problemId]) {
      this.feedbackData[userId][problemId] = {
        dialogue: [],
        hintLevel: level,
        revisionCount: 0,
      };
    } else {
      this.feedbackData[userId][problemId].hintLevel = level;
    }
  }

  async incrementRevisionCount(userId: string, problemId: string): Promise<void> {
    await this.delay();
    if (!this.feedbackData[userId]) {
      this.feedbackData[userId] = {};
    }
    if (!this.feedbackData[userId][problemId]) {
      this.feedbackData[userId][problemId] = {
        dialogue: [],
        hintLevel: 1,
        revisionCount: 1,
      };
    } else {
      this.feedbackData[userId][problemId].revisionCount += 1;
    }
  }

  // Admin methods
  async getAllStudents(): Promise<User[]> {
    await this.delay();
    return this.users.filter(u => u.role === "student");
  }

  async getStudentProgressSummary(userId: string): Promise<StudentProgressSummary | null> {
    await this.delay();
    const user = this.users.find(u => u.id === userId);
    if (!user || user.role !== "student") return null;

    const progress = this.progressData[userId] || [];
    const totalXP = progress.reduce((sum, p) => sum + p.xpEarned, 0);
    const allBadges = progress.flatMap(p => p.badges);
    const currentStage = progress[progress.length - 1]?.reasoningStage || "empirical";

    // Get quizzes and FRQ assignments
    const allQuizzes = this.quizzes.filter(q => q.studentId === userId);
    const recentQuizzes = allQuizzes
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 5); // Last 5 quizzes

    const allFRQs = this.frqAssignments.filter(a => a.studentId === userId);
    const pendingFRQs = allFRQs.filter(a => a.status === "pending" || a.status === "submitted");
    const completedFRQs = allFRQs.filter(a => a.status === "graded" || a.status === "feedback_delivered");

    return {
      userId: user.id,
      userName: user.name,
      course: user.course,
      currentWeek: progress.length > 0 ? Math.max(...progress.map(p => p.weekNumber)) : 1,
      completedWeeks: progress.map(p => p.weekNumber),
      totalXP,
      badges: allBadges,
      currentReasoningStage: currentStage,
      weeklyProgress: progress,
      recentQuizzes,
      pendingFRQs,
      completedFRQs,
    };
  }

  async getAllStudentProgressSummaries(): Promise<StudentProgressSummary[]> {
    await this.delay();
    const students = this.users.filter(u => u.role === "student");
    const summaries: StudentProgressSummary[] = [];

    for (const student of students) {
      const summary = await this.getStudentProgressSummary(student.id);
      if (summary) summaries.push(summary);
    }

    return summaries;
  }

  // Quiz methods
  async createQuiz(quiz: Omit<Quiz, "id" | "completedAt" | "frqAssigned">): Promise<Quiz> {
    await this.delay();
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`,
      completedAt: new Date(),
      frqAssigned: false,
    };
    this.quizzes.push(newQuiz);
    return newQuiz;
  }

  async getQuiz(quizId: string): Promise<Quiz | null> {
    await this.delay();
    return this.quizzes.find(q => q.id === quizId) || null;
  }

  async getUserQuizzes(studentId: string): Promise<Quiz[]> {
    await this.delay();
    return this.quizzes.filter(q => q.studentId === studentId);
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    await this.delay();
    return this.quizzes;
  }

  // FRQ Assignment methods
  async createFRQAssignment(assignment: Omit<FRQAssignment, "id" | "assignedAt" | "status">): Promise<FRQAssignment> {
    await this.delay();
    const newAssignment: FRQAssignment = {
      ...assignment,
      id: `frq-assign-${Date.now()}`,
      assignedAt: new Date(),
      status: "pending",
    };
    this.frqAssignments.push(newAssignment);

    // Mark quiz as FRQ assigned
    const quizIndex = this.quizzes.findIndex(q => q.id === assignment.quizId);
    if (quizIndex !== -1) {
      this.quizzes[quizIndex].frqAssigned = true;
    }

    return newAssignment;
  }

  async getFRQAssignment(assignmentId: string): Promise<FRQAssignment | null> {
    await this.delay();
    return this.frqAssignments.find(a => a.id === assignmentId) || null;
  }

  async getFRQAssignmentById(assignmentId: string): Promise<FRQAssignment | null> {
    return this.getFRQAssignment(assignmentId);
  }

  async getUserFRQAssignments(studentId: string): Promise<FRQAssignment[]> {
    await this.delay();
    return this.frqAssignments.filter(a => a.studentId === studentId);
  }

  async getFRQAssignmentsByStudent(studentId: string, status?: FRQAssignment["status"]): Promise<FRQAssignment[]> {
    await this.delay();
    const assignments = this.frqAssignments.filter(a => a.studentId === studentId);
    if (status) {
      return assignments.filter(a => a.status === status);
    }
    return assignments;
  }

  async getAllFRQAssignments(): Promise<FRQAssignment[]> {
    await this.delay();
    return this.frqAssignments;
  }

  async updateFRQAssignmentStatus(assignmentId: string, status: FRQAssignment["status"]): Promise<void> {
    await this.delay();
    const index = this.frqAssignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      this.frqAssignments[index].status = status;
    }
  }

  async updateFRQAssignment(assignmentId: string, data: Partial<FRQAssignment>): Promise<void> {
    await this.delay();
    const index = this.frqAssignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      this.frqAssignments[index] = { ...this.frqAssignments[index], ...data };
    }
  }

  // FRQ Submission methods
  async createFRQSubmission(submission: Omit<FRQSubmission, "id">): Promise<FRQSubmission> {
    await this.delay();
    const newSubmission: FRQSubmission = {
      ...submission,
      id: `frq-sub-${Date.now()}`,
    };
    this.frqSubmissions.push(newSubmission);

    // Update assignment status to submitted if not already set
    if (!submission.submittedAt) {
      await this.updateFRQAssignmentStatus(submission.assignmentId, "submitted");
    }

    return newSubmission;
  }

  async updateFRQSubmission(submissionId: string, data: Partial<FRQSubmission>): Promise<void> {
    await this.delay();
    const index = this.frqSubmissions.findIndex(s => s.id === submissionId);
    if (index !== -1) {
      this.frqSubmissions[index] = { ...this.frqSubmissions[index], ...data };

      // Update assignment status based on feedback delivery
      if (data.feedbackDeliveredAt) {
        const submission = this.frqSubmissions[index];
        await this.updateFRQAssignmentStatus(submission.assignmentId, "feedback_delivered");
      }
    }
  }

  async getFRQSubmission(submissionId: string): Promise<FRQSubmission | null> {
    await this.delay();
    return this.frqSubmissions.find(s => s.id === submissionId) || null;
  }

  async getSubmissionByAssignment(assignmentId: string): Promise<FRQSubmission | null> {
    await this.delay();
    return this.frqSubmissions.find(s => s.assignmentId === assignmentId) || null;
  }

  async getFRQSubmissionsByAssignment(assignmentId: string): Promise<FRQSubmission[]> {
    await this.delay();
    return this.frqSubmissions.filter(s => s.assignmentId === assignmentId);
  }

  async getUserFRQSubmissions(studentId: string): Promise<FRQSubmission[]> {
    await this.delay();
    return this.frqSubmissions.filter(s => s.studentId === studentId);
  }

  // Dual Grading methods
  async createDualGradingResult(result: Omit<DualGradingResult, "id" | "createdAt">): Promise<DualGradingResult> {
    await this.delay();
    const newResult: DualGradingResult = {
      ...result,
      id: `dual-grade-${Date.now()}`,
      createdAt: new Date(),
    };
    this.dualGradingResults.push(newResult);
    return newResult;
  }

  async getDualGradingResult(id: string): Promise<DualGradingResult | null> {
    await this.delay();
    return this.dualGradingResults.find(r => r.id === id) || null;
  }

  async getDualGradingBySubmission(submissionId: string): Promise<DualGradingResult | null> {
    await this.delay();
    return this.dualGradingResults.find(r => r.submissionId === submissionId) || null;
  }

  async updateDualGradingResult(id: string, data: Partial<DualGradingResult>): Promise<DualGradingResult> {
    await this.delay();
    const index = this.dualGradingResults.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Dual grading result not found: ${id}`);
    }
    this.dualGradingResults[index] = { ...this.dualGradingResults[index], ...data };
    return this.dualGradingResults[index];
  }

  async getAllPendingConsolidations(): Promise<DualGradingResult[]> {
    await this.delay();
    // Return all dual grading results that don't have adminConsolidation yet
    return this.dualGradingResults.filter(r => !r.adminConsolidation);
  }

  // ============================================
  // Week Problem Attempts (New)
  // ============================================

  async saveProblemAttempt(attempt: Omit<ProblemAttempt, "id" | "createdAt">): Promise<ProblemAttempt> {
    await this.delay();

    // Get current attempt number for this student+problem
    const existingAttempts = this.problemAttempts.filter(
      a => a.studentId === attempt.studentId && a.problemId === attempt.problemId
    );
    const attemptNumber = existingAttempts.length + 1;

    const newAttempt: ProblemAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attemptNumber,
      createdAt: new Date(),
    };

    this.problemAttempts.push(newAttempt);

    console.log(`[MockAdapter] Saved problem attempt: Student ${attempt.studentId}, Problem ${attempt.problemId}, Attempt #${attemptNumber}`);

    return newAttempt;
  }

  async getProblemAttempts(studentId: string, problemId: string): Promise<ProblemAttempt[]> {
    await this.delay();
    return this.problemAttempts
      .filter(a => a.studentId === studentId && a.problemId === problemId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getStudentWeekAttempts(studentId: string, weekNumber: number): Promise<ProblemAttempt[]> {
    await this.delay();
    return this.problemAttempts
      .filter(a => a.studentId === studentId && a.weekNumber === weekNumber)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Most recent first
  }

  async getStudentAllAttempts(studentId: string): Promise<ProblemAttempt[]> {
    await this.delay();
    return this.problemAttempts
      .filter(a => a.studentId === studentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Most recent first
  }

  async getStudentWeekSummary(studentId: string, weekNumber: number): Promise<StudentWeekSummary> {
    await this.delay();

    const attempts = await this.getStudentWeekAttempts(studentId, weekNumber);

    // Calculate unique problems attempted
    const uniqueProblems = new Set(attempts.map(a => a.problemId));
    const problemsAttempted = uniqueProblems.size;

    // Calculate problems completed (at least one attempt per problem)
    const problemsCompleted = uniqueProblems.size; // If attempted, consider it "completed"

    // Total stats
    const totalAttempts = attempts.length;
    const totalXP = attempts.reduce((sum, a) => sum + a.xpEarned, 0);

    // Average time
    const totalTime = attempts.reduce((sum, a) => sum + a.sessionData.timeSpentSeconds, 0);
    const averageTimePerProblem = totalAttempts > 0 ? totalTime / totalAttempts : 0;

    // Latest reasoning stage (from most recent attempt)
    const latestAttempt = attempts[0];
    const currentReasoningStage = latestAttempt
      ? this.inferReasoningStage(latestAttempt)
      : "empirical";

    // Timestamps
    const firstAttemptAt = attempts.length > 0 ? attempts[attempts.length - 1].createdAt : undefined;
    const lastAttemptAt = attempts.length > 0 ? attempts[0].createdAt : undefined;

    return {
      studentId,
      weekNumber,
      problemsAttempted,
      problemsCompleted,
      totalAttempts,
      totalXP,
      averageTimePerProblem,
      attempts,
      currentReasoningStage,
      firstAttemptAt,
      lastAttemptAt,
    };
  }

  async getStudentOverview(studentId: string): Promise<StudentOverviewForAdmin> {
    await this.delay();

    const user = this.users.find(u => u.id === studentId);
    if (!user || user.role !== "student") {
      throw new Error(`Student not found: ${studentId}`);
    }

    const allAttempts = await this.getStudentAllAttempts(studentId);

    // Calculate total XP
    const totalXP = allAttempts.reduce((sum, a) => sum + a.xpEarned, 0);

    // Current reasoning stage (from most recent attempt)
    const latestAttempt = allAttempts[0];
    const currentReasoningStage = latestAttempt
      ? this.inferReasoningStage(latestAttempt)
      : "empirical";

    // Week-by-week summaries
    const weekSummaries: Record<number, any> = {};
    for (let week = 1; week <= 4; week++) {
      const weekAttempts = allAttempts.filter(a => a.weekNumber === week);
      const uniqueProblems = new Set(weekAttempts.map(a => a.problemId));
      const weekProblems = week1Problems.filter(p => p.course === user.course || p.course === "calculus-ab");
      const totalProblemsForWeek = weekProblems.length; // This should be dynamic per week

      weekSummaries[week] = {
        problemsCompleted: uniqueProblems.size,
        totalProblems: totalProblemsForWeek,
        totalAttempts: weekAttempts.length,
        xpEarned: weekAttempts.reduce((sum, a) => sum + a.xpEarned, 0),
        lastActivity: weekAttempts.length > 0 ? weekAttempts[0].createdAt : undefined,
      };
    }

    // Recent attempts (last 10)
    const recentAttempts = allAttempts.slice(0, 10).map(a => ({
      attemptId: a.id,
      problemId: a.problemId,
      weekNumber: a.weekNumber,
      problemTitle: this.getProblemTitle(a.problemId),
      xpEarned: a.xpEarned,
      timestamp: a.createdAt,
    }));

    // Flags
    const flags: Array<{ type: "inactive" | "struggling" | "no_progress"; message: string; weekNumber?: number }> = [];

    const lastActivity = allAttempts.length > 0 ? allAttempts[0].createdAt : user.createdAt;
    const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceActivity > 7) {
      flags.push({
        type: "inactive",
        message: `No activity in ${Math.floor(daysSinceActivity)} days`,
      });
    }

    // Check for struggles (multiple attempts with low XP)
    for (let week = 1; week <= 4; week++) {
      const weekAttempts = allAttempts.filter(a => a.weekNumber === week);
      if (weekAttempts.length > 0) {
        const avgXP = weekAttempts.reduce((sum, a) => sum + a.xpEarned, 0) / weekAttempts.length;
        if (avgXP < 30 && weekAttempts.length >= 3) {
          flags.push({
            type: "struggling",
            message: `Week ${week}: Low XP average (${avgXP.toFixed(0)}) across ${weekAttempts.length} attempts`,
            weekNumber: week,
          });
        }
      }
    }

    // Check for no progress
    if (allAttempts.length === 0) {
      flags.push({
        type: "no_progress",
        message: "No practice problems attempted yet",
      });
    }

    return {
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      course: user.course as any,
      totalXP,
      currentReasoningStage,
      badges: [], // TODO: implement badges
      weekSummaries,
      recentAttempts,
      flags,
      enrolledAt: user.createdAt,
      lastActiveAt: lastActivity,
    };
  }

  async getAllStudentOverviews(): Promise<StudentOverviewForAdmin[]> {
    await this.delay();

    const students = this.users.filter(u => u.role === "student");
    const overviews: StudentOverviewForAdmin[] = [];

    for (const student of students) {
      const overview = await this.getStudentOverview(student.id);
      overviews.push(overview);
    }

    // Sort by last activity (most recent first)
    return overviews.sort((a, b) => {
      const aTime = a.lastActiveAt?.getTime() || 0;
      const bTime = b.lastActiveAt?.getTime() || 0;
      return bTime - aTime;
    });
  }

  // Helper: Infer reasoning stage from attempt
  private inferReasoningStage(attempt: ProblemAttempt): "empirical" | "generic" | "formal" {
    const { cercResponse, sessionData } = attempt;

    // Check quality of CERC response
    const hasCompleteCERC = Object.values(cercResponse).every(v => v.trim().length > 20);
    const usedNoHints = sessionData.phases.selfCheck.hintsViewed.length === 0;
    const didNotViewSolution = !sessionData.phases.selfCheck.solutionViewed;
    const trapIdentified =
      cercResponse.claim.toLowerCase().includes("does not apply") ||
      cercResponse.claim.toLowerCase().includes("cannot be used");

    // Formal: Complete CERC, no hints, identified trap
    if (hasCompleteCERC && usedNoHints && didNotViewSolution && trapIdentified) {
      return "formal";
    }

    // Generic: Complete CERC with some hints
    if (hasCompleteCERC && sessionData.phases.selfCheck.hintsViewed.length <= 1) {
      return "generic";
    }

    // Empirical: Incomplete or heavily supported
    return "empirical";
  }

  // Helper: Get problem title
  private getProblemTitle(problemId: string): string {
    const problem = week1Problems.find(p => p.id === problemId);
    return problem ? problem.title : "Unknown Problem";
  }
}
