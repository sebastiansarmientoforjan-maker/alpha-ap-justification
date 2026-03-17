/**
 * FRQ Data Endpoint
 * Provides FRQ assignment data for PDF compilation
 */

import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";

export async function GET(
  req: NextRequest,
  { params }: { params: { frqId: string } }
) {
  try {
    const { frqId } = params;

    console.log(`[FRQ API] Fetching FRQ: ${frqId}`);

    const dataService = await getDataService();
    const frq = await dataService.getFRQAssignment(frqId);

    if (!frq) {
      return NextResponse.json(
        { error: "FRQ not found" },
        { status: 404 }
      );
    }

    // Get student info
    const student = await dataService.getUserById(frq.studentId);

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Return all data needed for PDF compilation
    return NextResponse.json({
      frqId: frq.id,
      studentId: frq.studentId,
      studentName: student.name,
      topic: frq.topic,
      type: frq.type,
      problemStatement: frq.problemStatement,
      status: frq.status,
      blocked: frq.blocked,
      blockedReason: frq.blockedReason,
      createdAt: frq.createdAt,
    });

  } catch (error) {
    console.error("[FRQ API] Error fetching FRQ:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
