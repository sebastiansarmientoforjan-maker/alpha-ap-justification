import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, topic, score, manuallyTriggered } = body;

    // Validate required fields
    if (!studentId || !topic || score === undefined || score === null) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, topic, score" },
        { status: 400 }
      );
    }

    // Validate score range
    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Score must be between 0 and 100" },
        { status: 400 }
      );
    }

    const dataService = await getDataService();

    // Create the quiz
    const quiz = await dataService.createQuiz({
      studentId,
      topic,
      score,
      manuallyTriggered: manuallyTriggered || false,
    });

    return NextResponse.json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
