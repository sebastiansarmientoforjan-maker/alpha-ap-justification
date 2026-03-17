import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Missing submissionId" },
        { status: 400 }
      );
    }

    const dataService = await getDataService();

    // Get submission
    const submission = await dataService.getFRQSubmission(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Update submission with feedback delivery timestamp
    await dataService.updateFRQSubmission(submissionId, {
      feedbackDeliveredAt: new Date(),
    });

    // Update assignment status to feedback_delivered
    await dataService.updateFRQAssignment(submission.assignmentId, {
      status: "feedback_delivered",
    });

    return NextResponse.json({
      success: true,
      message: "Feedback delivered successfully",
    });
  } catch (error) {
    console.error("Error delivering feedback:", error);
    return NextResponse.json(
      { error: "Failed to deliver feedback" },
      { status: 500 }
    );
  }
}
