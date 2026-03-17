import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, mathGraderOutput, mathGraderScore, actionPoints } = body;

    // Validate input
    if (!submissionId || !mathGraderOutput || mathGraderScore === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (mathGraderScore < 0 || mathGraderScore > 9) {
      return NextResponse.json(
        { error: "MathGrader score must be between 0 and 9" },
        { status: 400 }
      );
    }

    if (!actionPoints || actionPoints.length < 3) {
      return NextResponse.json(
        { error: "Must provide at least 3 action points" },
        { status: 400 }
      );
    }

    const dataService = await getDataService();

    // Get submission to get assignmentId
    const submission = await dataService.getFRQSubmission(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Update submission with MathGrader data
    await dataService.updateFRQSubmission(submissionId, {
      mathGraderOutput,
      mathGraderScore,
      actionPoints,
    });

    // Update assignment status to graded
    await dataService.updateFRQAssignment(submission.assignmentId, {
      status: "graded",
    });

    return NextResponse.json({
      success: true,
      message: "FRQ graded successfully",
    });
  } catch (error) {
    console.error("Error grading FRQ:", error);
    return NextResponse.json(
      { error: "Failed to grade FRQ" },
      { status: 500 }
    );
  }
}
