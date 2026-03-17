import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";
import { gradeWithClaudeVision } from "@/services/ai/claude-grader";
import { DualGradingResult, CERCAnalysis } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, imageBase64, mathGraderOutput, mathGraderScore } = body;

    if (!submissionId || !imageBase64) {
      return NextResponse.json(
        { error: "Missing required fields: submissionId, imageBase64" },
        { status: 400 }
      );
    }

    const dataService = await getDataService();

    // Get submission and assignment details
    const submission = await dataService.getFRQSubmission(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const assignment = await dataService.getFRQAssignment(submission.assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Grade with Claude Vision
    const claudeResult = await gradeWithClaudeVision(
      imageBase64,
      assignment.problemStatement,
      assignment.type,
      assignment.topic
    );

    // Build CERC analysis
    const cercAnalysis: CERCAnalysis = {
      claim: claudeResult.cerc.claim,
      evidence: claudeResult.cerc.evidence,
      reasoning: claudeResult.cerc.reasoning,
      conditions: claudeResult.cerc.conditions,
      totalScore: claudeResult.score,
    };

    // Create dual grading result
    const dualGradingResult: Omit<DualGradingResult, "id" | "createdAt"> = {
      submissionId: submission.id,
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
      grader1: {
        name: "Claude Vision",
        output: claudeResult.overallFeedback,
        score: claudeResult.score,
        cerc: cercAnalysis,
        reasoningStage: claudeResult.reasoningStage,
        actionPoints: claudeResult.suggestedActionPoints,
        timestamp: new Date(),
      },
      grader2: mathGraderOutput
        ? {
            name: "MathGrader.AI",
            output: mathGraderOutput,
            score: mathGraderScore || 0,
            timestamp: new Date(),
          }
        : undefined,
    };

    // Save to database
    const savedResult = await dataService.createDualGradingResult(dualGradingResult);

    return NextResponse.json({
      success: true,
      message: "Dual grading completed",
      result: {
        id: savedResult.id,
        claudeScore: claudeResult.score,
        mathGraderScore: mathGraderScore || null,
        reasoningStage: claudeResult.reasoningStage,
        status: "awaiting_consolidation",
      },
      grading: {
        claude: {
          score: claudeResult.score,
          cerc: cercAnalysis,
          feedback: claudeResult.overallFeedback,
          actionPoints: claudeResult.suggestedActionPoints,
          missingElements: claudeResult.missingElements,
        },
        mathGrader: mathGraderOutput
          ? {
              score: mathGraderScore,
              output: mathGraderOutput,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error in dual grading:", error);
    return NextResponse.json(
      { error: "Failed to perform dual grading", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
