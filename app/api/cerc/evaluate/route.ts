/**
 * CERC Evaluation API
 * Uses Claude (via Bedrock) to evaluate student CERC responses with Socratic feedback
 */

import { NextRequest, NextResponse } from "next/server";
import { BedrockClaudeClient } from "@/lib/claude/bedrock-client";
import { getDataService } from "@/services/data";

const claudeClient = new BedrockClaudeClient();

const CERC_EVALUATION_SYSTEM_PROMPT = `You are an AP Calculus/Statistics justification evaluator using the CERC framework.

CERC Framework:
- C (Claim): The conclusion to be proven
- E (Evidence): Mathematical data supporting the claim
- R (Reasoning): The theorem/principle connecting evidence to claim
- C (Conditions): EXPLICIT verification that ALL theorem hypotheses are satisfied

Your role: Provide Socratic feedback that guides students to discover their own errors, NOT to tell them the answer directly.

Feedback Levels (based on attempt number):
- Level 1 (Attempt 1): Location hint - "Check your [section]" - point to WHERE the error is
- Level 2 (Attempt 2): Element hint - "You verified X, but what about Y?" - be more specific
- Level 3 (Attempt 3): Direct correction - "You need to verify that..." - give explicit guidance

Scoring Guidelines:
- Each CERC section: 0-100
  - 90-100: Excellent - Complete and rigorous
  - 70-89: Good - Correct but missing minor details
  - 50-69: Partial - Has right idea but incomplete
  - 0-49: Needs work - Missing key elements
- Overall: average of 4 sections
- Approved if overall >= 80 AND conditions >= 70 (conditions are CRITICAL)

Error Categories to Flag:
- CONDITION_BYPASS: Student didn't verify theorem hypotheses at all
- LOCAL_ONLY_ARGUMENT: Student checked one condition but missed others
- CER_BREAKDOWN: Student stated theorem but didn't connect evidence to claim

XP Awards:
- Excellent (90-100): 150 XP base
- Good (80-89): 100 XP base
- Partial (70-79): 50 XP base
- Bonus +50 XP if conditions >= 90 (caught the trap!)
- Bonus +25 XP if first attempt success

CRITICAL: Output ONLY valid JSON. No markdown, no code blocks, no explanations outside JSON.

Output format:
{
  "overallScore": number,
  "breakdown": {
    "claim": { "score": number, "feedback": string, "missingElements": string[] },
    "evidence": { "score": number, "feedback": string, "missingElements": string[] },
    "reasoning": { "score": number, "feedback": string, "missingElements": string[] },
    "conditions": { "score": number, "feedback": string, "missingElements": string[] }
  },
  "hintLevel": 1 | 2 | 3,
  "socraticQuestion": string,
  "approved": boolean,
  "xpAwarded": number,
  "reasoningStageUpdate": "empirical" | "generic" | "formal" | null
}`;

interface EvaluationRequest {
  problemId: string;
  studentId: string;
  cercResponse: {
    claim: string;
    evidence: string;
    reasoning: string;
    conditions: string;
  };
  attemptNumber: number;
  problemStatement: string;
  errorCategory: string;
  reasoningStage: "empirical" | "generic" | "formal";
}

export async function POST(req: NextRequest) {
  try {
    const body: EvaluationRequest = await req.json();

    // Fetch the full problem with admin data (cercSkeleton) server-side
    const dataService = await getDataService();
    const problem = await dataService.getProblemWithAdminData(body.problemId);

    if (!problem || !problem.cercSkeleton) {
      return NextResponse.json(
        { error: "Problem not found or missing CERC skeleton" },
        { status: 404 }
      );
    }

    // Build evaluation prompt
    const userPrompt = `Evaluate this student's CERC response.

PROBLEM:
${body.problemStatement}

ERROR CATEGORY: ${body.errorCategory}
STUDENT'S REASONING STAGE: ${body.reasoningStage}
ATTEMPT NUMBER: ${body.attemptNumber}

CORRECT CERC SKELETON (for reference - NEVER show this to student):
Claim: ${problem.cercSkeleton.claim}
Evidence: ${problem.cercSkeleton.evidence}
Reasoning: ${problem.cercSkeleton.reasoning}
Conditions: ${problem.cercSkeleton.conditions}

STUDENT'S RESPONSE:
Claim: ${body.cercResponse.claim}
Evidence: ${body.cercResponse.evidence}
Reasoning: ${body.cercResponse.reasoning}
Conditions: ${body.cercResponse.conditions}

Evaluate each section, provide Socratic feedback at Level ${body.attemptNumber}, and output JSON only.`;

    console.log("🤖 Calling Claude to evaluate CERC response...");
    console.log(`Attempt ${body.attemptNumber}/3 for student ${body.studentId}`);

    // Call Claude via Bedrock
    const message = await claudeClient.createMessage({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      temperature: 0.3, // Lower for more consistent evaluation
      system: CERC_EVALUATION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Parse response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response format from Claude");
    }

    let evaluation;
    try {
      // Try to parse JSON directly
      evaluation = JSON.parse(content.text);
    } catch (parseError) {
      // Try to extract JSON if wrapped
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("Claude response:", content.text);
        throw new Error("No valid JSON in Claude response");
      }
      evaluation = JSON.parse(jsonMatch[0]);
    }

    console.log("✅ CERC evaluation complete");
    console.log(`Overall score: ${evaluation.overallScore}`);
    console.log(`Approved: ${evaluation.approved}`);
    console.log(`XP awarded: ${evaluation.xpAwarded}`);

    // Store evaluation in database (mock for now)
    // await dataService.storeCERCEvaluation(body.studentId, body.problemId, evaluation);

    // Check for badge unlocks
    const badgesUnlocked: string[] = [];

    // 🔍 "The Skeptic" - Caught the error-forcing trap
    if (body.errorCategory === "CONDITION_BYPASS" &&
        evaluation.breakdown.conditions.score >= 90) {
      badgesUnlocked.push("the-skeptic");
    }

    // 🏛️ "The Architect" - Perfect on first try
    if (evaluation.overallScore === 100 && body.attemptNumber === 1) {
      badgesUnlocked.push("the-architect");
    }

    return NextResponse.json({
      ...evaluation,
      badgesUnlocked,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Error evaluating CERC:", error);
    return NextResponse.json(
      {
        error: "Failed to evaluate CERC response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
