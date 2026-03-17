import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";
import { CERCResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, weekNumber, problemId, claim, evidence, reasoning, conditions } = body;

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

    // Award XP for completing a CERC response
    await dataService.addXP(studentId, weekNumber, 50);

    return NextResponse.json({
      success: true,
      message: "CERC response saved successfully",
    });
  } catch (error) {
    console.error("Error saving CERC response:", error);
    return NextResponse.json(
      { error: "Failed to save CERC response" },
      { status: 500 }
    );
  }
}
