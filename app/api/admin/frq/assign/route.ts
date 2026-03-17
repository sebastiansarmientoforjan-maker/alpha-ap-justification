import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";
import {
  generateCERCScaffolding,
  determineRelevantWeek,
  generateContentLinks,
} from "@/services/content/scaffolding-generator";

// FRQ Problem templates
const GENERAL_FRQ_TEMPLATES = [
  "Explain the relationship between differentiability and continuity. Provide a rigorous proof using the CERC framework.",
  "Use the Fundamental Theorem of Calculus to evaluate a definite integral. Justify each step with proper notation and theorem verification.",
  "Prove that a function has a limit at a point using the epsilon-delta definition. Verify all conditions explicitly.",
];

const getTopicFRQProblem = (topic: string): string => {
  return `Analyze a problem involving ${topic}. Apply the relevant theorem and explicitly verify all conditions (hypotheses) before drawing your conclusion. Use the CERC framework to structure your argument.`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId } = body;

    if (!quizId) {
      return NextResponse.json(
        { error: "Missing required field: quizId" },
        { status: 400 }
      );
    }

    const dataService = await getDataService();

    // Get the quiz
    const quiz = await dataService.getQuiz(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Check if already assigned
    if (quiz.frqAssigned) {
      return NextResponse.json(
        { error: "FRQ already assigned for this quiz" },
        { status: 400 }
      );
    }

    // Get student's current reasoning stage from progress
    const studentProgress = await dataService.getProgressByUser(quiz.studentId);
    const latestProgress = studentProgress.length > 0 ? studentProgress[studentProgress.length - 1] : null;
    const reasoningStage = latestProgress?.reasoningStage || "empirical";

    // Calculate due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // ALWAYS assign exactly 1 FRQ
    // Score >= 80%: General FRQ (broad argumentation)
    // Score < 80%: Topic-Specific FRQ (targets the quiz topic)
    const frqType: "general" | "topic" = quiz.score >= 80 ? "general" : "topic";
    const problemStatement = frqType === "general"
      ? GENERAL_FRQ_TEMPLATES[Math.floor(Math.random() * GENERAL_FRQ_TEMPLATES.length)]
      : getTopicFRQProblem(quiz.topic);

    // Generate content-aware scaffolding
    const cercScaffolding = generateCERCScaffolding(reasoningStage, quiz.topic);
    const weekReference = determineRelevantWeek(quiz.topic);
    const contentLinks = generateContentLinks(quiz.topic);

    const frqAssignment = await dataService.createFRQAssignment({
      studentId: quiz.studentId,
      quizId: quiz.id,
      type: frqType,
      topic: quiz.topic,
      problemStatement,
      dueDate,
      // NEW: Course content integration
      weekReference,
      cercScaffolding,
      contentLinks,
    });

    return NextResponse.json({
      success: true,
      message: "FRQ assigned successfully with content-aware scaffolding",
      assignment: {
        id: frqAssignment.id,
        type: frqAssignment.type,
        topic: frqAssignment.topic,
        dueDate: frqAssignment.dueDate,
        weekReference: frqAssignment.weekReference,
        scaffoldingLevel: frqAssignment.cercScaffolding?.level,
      },
      logic: {
        quizScore: quiz.score,
        frqType,
        reason: quiz.score >= 80
          ? `Score ${quiz.score}% ≥ 80% - assigned General FRQ (broad argumentation)`
          : `Score ${quiz.score}% < 80% - assigned Topic FRQ (${quiz.topic})`,
        scaffolding: {
          studentReasoningStage: reasoningStage,
          scaffoldingLevel: cercScaffolding.level,
          weekReference: `Student should study Week ${weekReference} content before attempting`,
          contentLinks: contentLinks.length,
        },
      },
    });
  } catch (error) {
    console.error("Error assigning FRQ:", error);
    return NextResponse.json(
      { error: "Failed to assign FRQ" },
      { status: 500 }
    );
  }
}
