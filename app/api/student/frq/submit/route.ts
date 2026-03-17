import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assignmentId, fileUrl, selfEvaluation } = body;

    // Validate input
    if (!assignmentId || !fileUrl || !selfEvaluation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (selfEvaluation.score < 0 || selfEvaluation.score > 9) {
      return NextResponse.json(
        { error: "Self-evaluation score must be between 0 and 9" },
        { status: 400 }
      );
    }

    const dataService = getDataService();

    // Get the assignment to get studentId
    const assignment = await dataService.getFRQAssignmentById(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Create submission
    const submission = await dataService.createFRQSubmission({
      assignmentId,
      studentId: assignment.studentId,
      fileUrl,
      selfEvaluation: {
        score: selfEvaluation.score,
        notes: selfEvaluation.notes || "",
      },
      submittedAt: new Date(),
      mathGraderOutput: null,
      mathGraderScore: null,
      actionPoints: null,
      feedbackDeliveredAt: null,
    });

    // Update assignment status to submitted
    await dataService.updateFRQAssignment(assignmentId, {
      status: "submitted",
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Error submitting FRQ:", error);
    return NextResponse.json(
      { error: "Failed to submit FRQ" },
      { status: 500 }
    );
  }
}
