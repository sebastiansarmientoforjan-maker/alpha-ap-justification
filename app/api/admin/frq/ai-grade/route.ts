import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";
import { gradeWithClaudeVision, imageToBase64 } from "@/services/ai/claude-grader";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, imageBase64 } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Missing submissionId" },
        { status: 400 }
      );
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing imageBase64 - please provide the image as base64 string" },
        { status: 400 }
      );
    }

    const dataService = await getDataService();

    // Get submission to get assignment info
    const submission = await dataService.getFRQSubmission(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Get assignment to get problem statement and type
    const assignment = await dataService.getFRQAssignmentById(submission.assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Grade with Claude Vision
    const gradingResult = await gradeWithClaudeVision(
      imageBase64,
      assignment.problemStatement,
      assignment.type,
      assignment.topic
    );

    // Format output for MathGrader-style display
    const mathGraderOutput = formatClaudeOutputAsMathGrader(gradingResult);

    return NextResponse.json({
      success: true,
      score: gradingResult.score,
      output: mathGraderOutput,
      actionPoints: gradingResult.suggestedActionPoints,
      cerc: gradingResult.cerc,
      reasoningStage: gradingResult.reasoningStage,
    });
  } catch (error) {
    console.error("Error grading with Claude Vision:", error);
    return NextResponse.json(
      {
        error: "Failed to grade with AI",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

function formatClaudeOutputAsMathGrader(result: any): string {
  return `CERC ANALYSIS (${result.score}/9 total):

CLAIM (${result.cerc.claim.score}/3):
${result.cerc.claim.feedback}

EVIDENCE (${result.cerc.evidence.score}/3):
${result.cerc.evidence.feedback}

REASONING (${result.cerc.reasoning.score}/2):
${result.cerc.reasoning.feedback}

CONDITIONS (${result.cerc.conditions.score}/1):
${result.cerc.conditions.feedback}

REASONING STAGE: ${result.reasoningStage.toUpperCase()}

MISSING ELEMENTS:
${result.missingElements.map((el: string) => `- ${el}`).join('\n')}

OVERALL FEEDBACK:
${result.overallFeedback}`;
}
