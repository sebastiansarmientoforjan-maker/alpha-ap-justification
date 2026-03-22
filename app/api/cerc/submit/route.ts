import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";
import { CERCResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, weekNumber, problemId, claim, evidence, reasoning, conditions, expectedMinutes, timeSpentSeconds } = body;

    // Validate required fields
    if (!studentId || !weekNumber || !problemId || !claim || !evidence || !reasoning || !conditions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create CERC response
    const cercResponse: CERCResponse = {
      problemId,
      claim,
      evidence,
      reasoning,
      conditions,
      timestamp: new Date(),
    };

    // Save to data service
    const dataService = await getDataService();
    await dataService.saveCERCResponse(studentId, weekNumber, cercResponse);

    // Calculate XP based on time spent
    let xpAwarded = 0;

    if (timeSpentSeconds && expectedMinutes) {
      const timeSpentMinutes = Math.round(timeSpentSeconds / 60);

      // Penalization: < 30 seconds = guessing (0 XP)
      if (timeSpentSeconds < 30) {
        xpAwarded = 0;
      }
      // Penalization: > 3x expected time = too slow (1 XP minimum)
      else if (timeSpentMinutes > expectedMinutes * 3) {
        xpAwarded = 1;
      }
      // Normal case: 1 XP per minute, capped at expectedMinutes
      else {
        xpAwarded = Math.min(expectedMinutes, Math.max(1, timeSpentMinutes));
      }
    } else {
      // Fallback if time tracking fails
      xpAwarded = 1;
    }

    // Award XP
    await dataService.addXP(studentId, weekNumber, xpAwarded);

    return NextResponse.json({
      success: true,
      message: "CERC response saved successfully",
      xpAwarded,
      timeSpentSeconds,
    });
  } catch (error) {
    console.error("Error saving CERC response:", error);
    return NextResponse.json(
      { error: "Failed to save CERC response" },
      { status: 500 }
    );
  }
}
