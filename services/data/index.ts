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
  Badge,
  ReasoningStage,
  DualGradingResult,
} from "@/lib/types";
import {
  ProblemAttempt,
  StudentWeekSummary,
  StudentOverviewForAdmin,
} from "@/lib/types/week-progress";

/**
 * Unified data service interface
 * All data operations go through this layer
 * Implementation is swapped via DATA_ADAPTER env variable
 */
export interface DataService {
  // User operations
  getUser(userId: string): Promise<User | null>;
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  updateUser(userId: string, data: Partial<User>): Promise<void>;

  // Problem operations
  getProblem(problemId: string): Promise<Problem | null>;
  getProblemsByWeek(weekNumber: number): Promise<Problem[]>;
  getWeekProblems(weekNumber: number): Promise<Problem[]>;
  createProblem(problem: Omit<Problem, "id" | "createdAt">): Promise<Problem>;

  // Admin-only: get full problem with trap details
  getProblemWithAdminData(problemId: string): Promise<Problem | null>;

  // Student problem progress
  getStudentProblemProgress(studentId: string, problemId: string): Promise<{
    attemptNumber: number;
    lastResponse?: Partial<CERCResponse>;
    xpEarned: number;
    reasoningStage: "empirical" | "generic" | "formal";
  }>;

  // Progress operations (legacy)
  getWeekProgress(userId: string, weekNumber: number): Promise<WeekProgress | null>;
  getAllProgress(userId: string): Promise<WeekProgress[]>;
  getProgressByUser(userId: string): Promise<WeekProgress[]>;
  saveCERCResponse(userId: string, weekNumber: number, response: CERCResponse): Promise<void>;
  updateReasoningStage(userId: string, weekNumber: number, stage: ReasoningStage): Promise<void>;
  addXP(userId: string, weekNumber: number, amount: number): Promise<void>;
  addBadge(userId: string, weekNumber: number, badgeId: string): Promise<void>;
  saveExitTicket(userId: string, weekNumber: number, response: string): Promise<void>;

  // Week Problem Attempts (New - for admin tracking)
  saveProblemAttempt(attempt: Omit<ProblemAttempt, "id" | "createdAt">): Promise<ProblemAttempt>;
  getProblemAttempts(studentId: string, problemId: string): Promise<ProblemAttempt[]>;
  getStudentWeekAttempts(studentId: string, weekNumber: number): Promise<ProblemAttempt[]>;
  getStudentAllAttempts(studentId: string): Promise<ProblemAttempt[]>;
  getStudentWeekSummary(studentId: string, weekNumber: number): Promise<StudentWeekSummary>;
  getStudentOverview(studentId: string): Promise<StudentOverviewForAdmin>;
  getAllStudentOverviews(): Promise<StudentOverviewForAdmin[]>;

  // Feedback operations
  getFeedback(userId: string, problemId: string): Promise<Feedback | null>;
  saveFeedbackMessage(userId: string, problemId: string, role: "ai" | "student", content: string): Promise<void>;
  updateFeedbackHintLevel(userId: string, problemId: string, level: 1 | 2 | 3): Promise<void>;
  incrementRevisionCount(userId: string, problemId: string): Promise<void>;

  // Admin dashboard operations
  getAllStudents(): Promise<User[]>;
  getStudentProgressSummary(userId: string): Promise<StudentProgressSummary | null>;
  getAllStudentProgressSummaries(): Promise<StudentProgressSummary[]>;

  // Quiz operations
  createQuiz(quiz: Omit<Quiz, "id" | "completedAt" | "frqAssigned">): Promise<Quiz>;
  getQuiz(quizId: string): Promise<Quiz | null>;
  getUserQuizzes(studentId: string): Promise<Quiz[]>;
  getAllQuizzes(): Promise<Quiz[]>;

  // FRQ Assignment operations
  createFRQAssignment(assignment: Omit<FRQAssignment, "id" | "assignedAt" | "status">): Promise<FRQAssignment>;
  getFRQAssignment(assignmentId: string): Promise<FRQAssignment | null>;
  getFRQAssignmentById(assignmentId: string): Promise<FRQAssignment | null>;
  getUserFRQAssignments(studentId: string): Promise<FRQAssignment[]>;
  getFRQAssignmentsByStudent(studentId: string, status?: FRQAssignment["status"]): Promise<FRQAssignment[]>;
  getAllFRQAssignments(): Promise<FRQAssignment[]>;
  updateFRQAssignmentStatus(assignmentId: string, status: FRQAssignment["status"]): Promise<void>;
  updateFRQAssignment(assignmentId: string, data: Partial<FRQAssignment>): Promise<void>;

  // FRQ Submission operations
  createFRQSubmission(submission: Omit<FRQSubmission, "id">): Promise<FRQSubmission>;
  updateFRQSubmission(submissionId: string, data: Partial<FRQSubmission>): Promise<void>;
  getFRQSubmission(submissionId: string): Promise<FRQSubmission | null>;
  getSubmissionByAssignment(assignmentId: string): Promise<FRQSubmission | null>;
  getFRQSubmissionsByAssignment(assignmentId: string): Promise<FRQSubmission[]>;
  getUserFRQSubmissions(studentId: string): Promise<FRQSubmission[]>;

  // Dual Grading operations
  createDualGradingResult(result: Omit<DualGradingResult, "id" | "createdAt">): Promise<DualGradingResult>;
  getDualGradingResult(id: string): Promise<DualGradingResult | null>;
  getDualGradingBySubmission(submissionId: string): Promise<DualGradingResult | null>;
  updateDualGradingResult(id: string, data: Partial<DualGradingResult>): Promise<DualGradingResult>;
  getAllPendingConsolidations(): Promise<DualGradingResult[]>;
}

// Factory function to get the appropriate adapter
export async function getDataService(): Promise<DataService> {
  const adapter = process.env.DATA_ADAPTER || "mock";

  if (adapter === "mock") {
    const { MockAdapter } = await import("./mock.adapter");
    return new MockAdapter();
  } else if (adapter === "firebase") {
    const { FirebaseAdapter } = await import("./firebase.adapter");
    return new FirebaseAdapter();
  } else if (adapter === "timeback") {
    const { TimeBackAdapter } = await import("./timeback.adapter");
    return new TimeBackAdapter();
  }

  throw new Error(`Unknown data adapter: ${adapter}`);
}
