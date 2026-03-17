import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  User,
  Problem,
  WeekProgress,
  Feedback,
  StudentProgressSummary,
  Quiz,
  FRQSubmission,
  CERCResponse,
  ReasoningStage,
} from "@/lib/types";
import { DataService } from "./index";

export class FirebaseAdapter implements DataService {
  // Helper to convert Firestore Timestamp to Date
  private toDate(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  }

  async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      id: userDoc.id,
      role: data.role,
      name: data.name,
      email: data.email,
      course: data.course,
      createdAt: this.toDate(data.createdAt),
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const userDoc = snapshot.docs[0];
    const data = userDoc.data();
    return {
      id: userDoc.id,
      role: data.role,
      name: data.name,
      email: data.email,
      course: data.course,
      createdAt: this.toDate(data.createdAt),
    };
  }

  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const userRef = doc(collection(db, "users"));
    const newUser: User = {
      ...user,
      id: userRef.id,
      createdAt: new Date(),
    };

    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
    });

    return newUser;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    await updateDoc(doc(db, "users", userId), data as any);
  }

  async getProblem(problemId: string): Promise<Problem | null> {
    const problemDoc = await getDoc(doc(db, "problems", problemId));
    if (!problemDoc.exists()) return null;

    const data = problemDoc.data();
    return {
      id: problemDoc.id,
      weekNumber: data.weekNumber,
      statement: data.statement,
      errorCategory: data.errorCategory,
      trapDescription: data.trapDescription,
      cercSkeleton: data.cercSkeleton,
      sentenceFrame: data.sentenceFrame,
      createdAt: this.toDate(data.createdAt),
    };
  }

  async getProblemsByWeek(weekNumber: number): Promise<Problem[]> {
    const q = query(
      collection(db, "problems"),
      where("weekNumber", "==", weekNumber)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        weekNumber: data.weekNumber,
        statement: data.statement,
        errorCategory: data.errorCategory,
        trapDescription: data.trapDescription,
        cercSkeleton: data.cercSkeleton,
        sentenceFrame: data.sentenceFrame,
        createdAt: this.toDate(data.createdAt),
      };
    });
  }

  async createProblem(problem: Omit<Problem, "id" | "createdAt">): Promise<Problem> {
    const problemRef = doc(collection(db, "problems"));
    const newProblem: Problem = {
      ...problem,
      id: problemRef.id,
      createdAt: new Date(),
    };

    await setDoc(problemRef, {
      ...problem,
      createdAt: serverTimestamp(),
    });

    return newProblem;
  }

  async getProblemWithAdminData(problemId: string): Promise<Problem | null> {
    return this.getProblem(problemId);
  }

  async getWeekProgress(userId: string, weekNumber: number): Promise<WeekProgress | null> {
    const progressDoc = await getDoc(
      doc(db, "progress", userId, "weeks", weekNumber.toString())
    );

    if (!progressDoc.exists()) return null;

    const data = progressDoc.data();
    return {
      weekNumber: data.weekNumber,
      cercResponses: data.cercResponses?.map((r: any) => ({
        ...r,
        timestamp: this.toDate(r.timestamp),
      })) || [],
      reasoningStage: data.reasoningStage,
      xpEarned: data.xpEarned || 0,
      badges: data.badges || [],
      exitTicket: data.exitTicket ? {
        response: data.exitTicket.response,
        timestamp: this.toDate(data.exitTicket.timestamp),
      } : null,
      completedAt: data.completedAt ? this.toDate(data.completedAt) : null,
    };
  }

  async getAllProgress(userId: string): Promise<WeekProgress[]> {
    const snapshot = await getDocs(collection(db, "progress", userId, "weeks"));

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        weekNumber: data.weekNumber,
        cercResponses: data.cercResponses?.map((r: any) => ({
          ...r,
          timestamp: this.toDate(r.timestamp),
        })) || [],
        reasoningStage: data.reasoningStage,
        xpEarned: data.xpEarned || 0,
        badges: data.badges || [],
        exitTicket: data.exitTicket ? {
          response: data.exitTicket.response,
          timestamp: this.toDate(data.exitTicket.timestamp),
        } : null,
        completedAt: data.completedAt ? this.toDate(data.completedAt) : null,
      };
    });
  }

  async saveCERCResponse(userId: string, weekNumber: number, response: CERCResponse): Promise<void> {
    const weekRef = doc(db, "progress", userId, "weeks", weekNumber.toString());
    const weekDoc = await getDoc(weekRef);

    if (!weekDoc.exists()) {
      await setDoc(weekRef, {
        weekNumber,
        cercResponses: [{ ...response, timestamp: serverTimestamp() }],
        reasoningStage: "empirical",
        xpEarned: 0,
        badges: [],
      });
    } else {
      const data = weekDoc.data();
      const cercResponses = data.cercResponses || [];
      cercResponses.push({ ...response, timestamp: serverTimestamp() });
      await updateDoc(weekRef, { cercResponses });
    }
  }

  async updateReasoningStage(userId: string, weekNumber: number, stage: ReasoningStage): Promise<void> {
    const weekRef = doc(db, "progress", userId, "weeks", weekNumber.toString());
    await updateDoc(weekRef, { reasoningStage: stage });
  }

  async addXP(userId: string, weekNumber: number, amount: number): Promise<void> {
    const weekRef = doc(db, "progress", userId, "weeks", weekNumber.toString());
    const weekDoc = await getDoc(weekRef);

    if (weekDoc.exists()) {
      const currentXP = weekDoc.data().xpEarned || 0;
      await updateDoc(weekRef, { xpEarned: currentXP + amount });
    }
  }

  async addBadge(userId: string, weekNumber: number, badgeId: string): Promise<void> {
    const weekRef = doc(db, "progress", userId, "weeks", weekNumber.toString());
    const weekDoc = await getDoc(weekRef);

    if (weekDoc.exists()) {
      const badges = weekDoc.data().badges || [];
      if (!badges.includes(badgeId)) {
        badges.push(badgeId);
        await updateDoc(weekRef, { badges });
      }
    }
  }

  async saveExitTicket(userId: string, weekNumber: number, response: string): Promise<void> {
    const weekRef = doc(db, "progress", userId, "weeks", weekNumber.toString());
    await updateDoc(weekRef, {
      exitTicket: {
        response,
        timestamp: serverTimestamp(),
      },
    });
  }

  async getFeedback(userId: string, problemId: string): Promise<Feedback | null> {
    const feedbackDoc = await getDoc(doc(db, "feedback", `${userId}_${problemId}`));
    if (!feedbackDoc.exists()) return null;

    const data = feedbackDoc.data();
    return {
      userId: data.userId,
      problemId: data.problemId,
      dialogue: data.dialogue?.map((m: any) => ({
        ...m,
        timestamp: this.toDate(m.timestamp),
      })) || [],
      hintLevel: data.hintLevel || 1,
      revisionCount: data.revisionCount || 0,
    };
  }

  async saveFeedbackMessage(userId: string, problemId: string, role: "ai" | "student", content: string): Promise<void> {
    const feedbackRef = doc(db, "feedback", `${userId}_${problemId}`);
    const feedbackDoc = await getDoc(feedbackRef);

    const message = { role, content, timestamp: serverTimestamp() };

    if (!feedbackDoc.exists()) {
      await setDoc(feedbackRef, {
        userId,
        problemId,
        dialogue: [message],
        hintLevel: 1,
        revisionCount: 0,
      });
    } else {
      const data = feedbackDoc.data();
      const dialogue = data.dialogue || [];
      dialogue.push(message);
      await updateDoc(feedbackRef, { dialogue });
    }
  }

  async updateFeedbackHintLevel(userId: string, problemId: string, level: 1 | 2 | 3): Promise<void> {
    const feedbackRef = doc(db, "feedback", `${userId}_${problemId}`);
    await updateDoc(feedbackRef, { hintLevel: level });
  }

  async incrementRevisionCount(userId: string, problemId: string): Promise<void> {
    const feedbackRef = doc(db, "feedback", `${userId}_${problemId}`);
    const feedbackDoc = await getDoc(feedbackRef);

    if (feedbackDoc.exists()) {
      const currentCount = feedbackDoc.data().revisionCount || 0;
      await updateDoc(feedbackRef, { revisionCount: currentCount + 1 });
    }
  }

  async getAllStudents(): Promise<User[]> {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role,
        name: data.name,
        email: data.email,
        course: data.course,
        createdAt: this.toDate(data.createdAt),
      };
    });
  }

  async getStudentProgressSummary(userId: string): Promise<StudentProgressSummary | null> {
    const user = await this.getUser(userId);
    if (!user) return null;

    const weeklyProgress = await this.getAllProgress(userId);
    const totalXP = weeklyProgress.reduce((sum, week) => sum + week.xpEarned, 0);

    const allBadges = weeklyProgress.flatMap((week) => week.badges);
    const uniqueBadges = [...new Set(allBadges)];

    return {
      user,
      currentWeek: weeklyProgress.length,
      reasoningStage: weeklyProgress[weeklyProgress.length - 1]?.reasoningStage || "empirical",
      totalXP,
      badges: uniqueBadges.map((badgeId) => ({
        id: badgeId,
        name: badgeId,
        description: "",
        icon: "",
        earnedAt: new Date(),
      })),
      weeklyProgress,
    };
  }

  async getAllStudentProgressSummaries(): Promise<StudentProgressSummary[]> {
    const students = await this.getAllStudents();
    const summaries = await Promise.all(
      students.map((student) => this.getStudentProgressSummary(student.id))
    );
    return summaries.filter((s): s is StudentProgressSummary => s !== null);
  }

  async createQuiz(userId: string, manuallyTriggered: boolean): Promise<Quiz> {
    const quizRef = doc(collection(db, "quizzes"));
    const quiz: Quiz = {
      id: quizRef.id,
      userId,
      completedAt: new Date(),
      manuallyTriggered,
    };

    await setDoc(quizRef, {
      userId,
      completedAt: serverTimestamp(),
      manuallyTriggered,
    });

    return quiz;
  }

  async getQuiz(quizId: string): Promise<Quiz | null> {
    const quizDoc = await getDoc(doc(db, "quizzes", quizId));
    if (!quizDoc.exists()) return null;

    const data = quizDoc.data();
    return {
      id: quizDoc.id,
      userId: data.userId,
      completedAt: this.toDate(data.completedAt),
      manuallyTriggered: data.manuallyTriggered,
    };
  }

  async getUserQuizzes(userId: string): Promise<Quiz[]> {
    const q = query(
      collection(db, "quizzes"),
      where("userId", "==", userId),
      orderBy("completedAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        completedAt: this.toDate(data.completedAt),
        manuallyTriggered: data.manuallyTriggered,
      };
    });
  }

  async createFRQSubmission(submission: Omit<FRQSubmission, "id" | "submittedAt">): Promise<FRQSubmission> {
    const submissionRef = doc(collection(db, "frqSubmissions"));
    const newSubmission: FRQSubmission = {
      ...submission,
      id: submissionRef.id,
      submittedAt: new Date(),
    };

    await setDoc(submissionRef, {
      ...submission,
      submittedAt: serverTimestamp(),
    });

    return newSubmission;
  }

  async updateFRQSubmission(submissionId: string, data: Partial<FRQSubmission>): Promise<void> {
    await updateDoc(doc(db, "frqSubmissions", submissionId), data as any);
  }

  async getFRQSubmission(submissionId: string): Promise<FRQSubmission | null> {
    const submissionDoc = await getDoc(doc(db, "frqSubmissions", submissionId));
    if (!submissionDoc.exists()) return null;

    const data = submissionDoc.data();
    return {
      id: submissionDoc.id,
      userId: data.userId,
      quizId: data.quizId,
      problemStatement: data.problemStatement,
      studentResponse: data.studentResponse,
      rubricScore: data.rubricScore,
      mathGraderOutput: data.mathGraderOutput,
      actionPoints: data.actionPoints || [],
      submittedAt: this.toDate(data.submittedAt),
    };
  }

  async getUserFRQSubmissions(userId: string): Promise<FRQSubmission[]> {
    const q = query(
      collection(db, "frqSubmissions"),
      where("userId", "==", userId),
      orderBy("submittedAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        quizId: data.quizId,
        problemStatement: data.problemStatement,
        studentResponse: data.studentResponse,
        rubricScore: data.rubricScore,
        mathGraderOutput: data.mathGraderOutput,
        actionPoints: data.actionPoints || [],
        submittedAt: this.toDate(data.submittedAt),
      };
    });
  }
}
