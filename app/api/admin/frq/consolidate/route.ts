import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dualGradingId,
      finalScore,
      consolidatedFeedback,
      actionPoints,
      adminNotes,
      reviewedBy,
    } = body;

    if (!dualGradingId || finalScore === undefined || !consolidatedFeedback || !actionPoints || !reviewedBy) {
      return NextResponse.json(
        {
          error: "Missing required fields: dualGradingId, finalScore, consolidatedFeedback, actionPoints, reviewedBy",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(actionPoints) || actionPoints.length !== 3) {
      return NextResponse.json(
        { error: "actionPoints must be an array of exactly 3 strings" },
        { status: 400 }
      );
    }

    if (finalScore < 0 || finalScore > 9) {
      return NextResponse.json(
        { error: "finalScore must be between 0 and 9" },
        { status: 400 }
      );
    }

    const dataService = await getDataService();

    // Get the dual grading result
    const dualGrading = await dataService.getDualGradingResult(dualGradingId);
    if (!dualGrading) {
      return NextResponse.json(
        { error: "Dual grading result not found" },
        { status: 404 }
      );
    }

    // Update with admin consolidation
    const updated = await dataService.updateDualGradingResult(dualGradingId, {
      adminConsolidation: {
        finalScore,
        consolidatedFeedback,
        actionPoints,
        adminNotes: adminNotes || undefined,
        reviewedBy,
        reviewedAt: new Date(),
      },
    });

    // Update submission status to "graded"
    await dataService.updateFRQSubmission(dualGrading.submissionId, {
      status: "graded",
    });

    // Update assignment status
    await dataService.updateFRQAssignment(dualGrading.assignmentId, {
      status: "graded",
    });

    return NextResponse.json({
      success: true,
      message: "Consolidation completed successfully",
      result: {
        id: updated.id,
        finalScore: updated.adminConsolidation?.finalScore,
        status: "ready_for_delivery",
      },
    });
  } catch (error) {
    console.error("Error consolidating feedback:", error);
    return NextResponse.json(
      {
        error: "Failed to consolidate feedback",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get consolidation data (for loading the consolidation page)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dualGradingId = searchParams.get("id");

    if (!dualGradingId) {
      return NextResponse.json(
        { error: "Missing query parameter: id" },
        { status: 400 }
      );
    }

    const dataService = await getDataService();
    const dualGrading = await dataService.getDualGradingResult(dualGradingId);

    if (!dualGrading) {
      return NextResponse.json(
        { error: "Dual grading result not found" },
        { status: 404 }
      );
    }

    // Get related data
    const submission = await dataService.getFRQSubmission(dualGrading.submissionId);
    const assignment = await dataService.getFRQAssignment(dualGrading.assignmentId);
    const student = await dataService.getUserById(dualGrading.studentId);

    return NextResponse.json({
      success: true,
      data: {
        dualGrading,
        submission,
        assignment,
        student,
      },
    });
  } catch (error) {
    console.error("Error fetching consolidation data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch consolidation data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
