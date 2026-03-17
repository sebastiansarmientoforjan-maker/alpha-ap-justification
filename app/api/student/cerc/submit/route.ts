import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";
import { week1Config } from "@/data/week-1-content";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekNumber, problemId, cercResponse } = body;

    if (!weekNumber || !problemId || !cercResponse) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For now, only Week 1 is implemented
    if (weekNumber !== 1) {
      return NextResponse.json(
        { error: "Week not implemented yet" },
        { status: 400 }
      );
    }

    const config = week1Config;
    const problem = config.problems.find((p) => p.id === problemId);

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    // Generate Socratic feedback using Claude
    const feedback = await generateSocraticFeedback(
      cercResponse,
      problem
    );

    // Save CERC response to database
    // TODO: Get student ID from auth
    const studentId = "ananya-001";
    const dataService = await getDataService();

    await dataService.saveCERCResponse(studentId, weekNumber, {
      ...cercResponse,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      feedback,
      message: "CERC response submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting CERC:", error);
    return NextResponse.json(
      {
        error: "Failed to submit CERC response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function generateSocraticFeedback(
  cercResponse: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  },
  problem: any
): Promise<string> {
  const prompt = `You are a Socratic mathematics tutor specializing in AP Calculus justification skills. Your role is to provide interrogative feedback that guides students to discover their own errors.

**Problem Context:**
${problem.statement}

**Correct CERC Response (for your reference only - do NOT reveal this to the student):**
- Claim: ${problem.correctCERCResponse.claim}
- Evidence: ${problem.correctCERCResponse.evidence}
- Reasoning: ${problem.correctCERCResponse.reasoning}
- Conditions: ${problem.correctCERCResponse.conditions}

**The Trap:** ${problem.trap}

**Student's Response:**
- Claim: ${cercResponse.claim}
- Evidence: ${cercResponse.evidence}
- Reasoning: ${cercResponse.reasoning}
- Conditions: ${cercResponse.conditions}

**Your Task:**
Analyze the student's CERC response and provide Socratic feedback following these principles:

1. **Interrogative, not evaluative**: Ask questions that reveal the flaw, don't tell them directly
2. **Specific, not generic**: Point to the exact location of the issue
3. **Constructive**: Guide toward the correct reasoning path
4. **Adaptive**: Adjust based on how close they are

**Feedback Levels:**
- If they got the MAIN point correct (theorem doesn't apply): Praise specificity, suggest minor improvements
- If they verified conditions but missed the trap: Ask about a specific condition
- If they skipped conditions entirely: Ask "What conditions must be verified before applying [theorem name]?"
- If they incorrectly applied the theorem: Ask "Can you verify [specific condition]? What happens at x = [critical point]?"

**Format your response as HTML** for better readability:
- Use <p> tags for paragraphs
- Use <strong> for emphasis
- Use <ul> and <li> for lists
- Keep it concise (3-5 paragraphs max)

Generate feedback now:`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929-v1:0",
    max_tokens: 1024,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text;
}
