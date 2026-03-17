import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface CERCAnalysis {
  claim: {
    score: number; // 0-3
    feedback: string;
  };
  evidence: {
    score: number; // 0-3
    feedback: string;
  };
  reasoning: {
    score: number; // 0-2
    feedback: string;
  };
  conditions: {
    score: number; // 0-1
    feedback: string;
  };
}

export interface ClaudeGradingResult {
  score: number; // 0-9 total
  cerc: CERCAnalysis;
  reasoningStage: "empirical" | "generic" | "formal";
  missingElements: string[];
  overallFeedback: string;
  suggestedActionPoints: string[];
}

export async function gradeWithClaudeVision(
  imageBase64: string,
  problemStatement: string,
  frqType: "general" | "topic",
  topic: string
): Promise<ClaudeGradingResult> {
  const prompt = buildGradingPrompt(problemStatement, frqType, topic);

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6", // Best for complex grading
    max_tokens: 4096,
    temperature: 0.3, // Lower for more consistent grading
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  });

  // Parse the response
  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  // Extract JSON from markdown code block if present
  let jsonText = content.text;
  const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }

  const result: ClaudeGradingResult = JSON.parse(jsonText);
  return result;
}

function buildGradingPrompt(
  problemStatement: string,
  frqType: "general" | "topic",
  topic: string
): string {
  const rubricDescription =
    frqType === "general"
      ? "This is a GENERAL FRQ focused on broad mathematical argumentation and justification skills across topics."
      : `This is a TOPIC-SPECIFIC FRQ focused on ${topic} for remediation.`;

  return `You are an expert AP Calculus/Statistics grader specializing in mathematical justification and reasoning analysis.

${rubricDescription}

PROBLEM STATEMENT:
${problemStatement}

GRADING FRAMEWORK: CERC (Claim, Evidence, Reasoning, Conditions)

RUBRIC (9 points total):
1. CLAIM (0-3 points):
   - 3: States conclusion clearly and precisely
   - 2: States conclusion with minor ambiguity
   - 1: States conclusion but lacks precision
   - 0: No clear claim or incorrect claim

2. EVIDENCE (0-3 points):
   - 3: Shows all relevant calculations with proper notation
   - 2: Shows most calculations, minor notation issues
   - 1: Shows some work but incomplete or unclear
   - 0: No supporting calculations or all incorrect

3. REASONING (0-2 points):
   - 2: Explicitly connects evidence to claim using correct theorem/principle
   - 1: Makes connection but not explicit or minor errors
   - 0: No logical connection or incorrect reasoning

4. CONDITIONS (0-1 point):
   - 1: Explicitly verifies all theorem hypotheses/conditions
   - 0: Does not verify conditions or verification is incorrect

REASONING STAGE TAXONOMY (Harel & Sowder):
- EMPIRICAL: Relies only on examples, numerical verification, or graphs
- GENERIC: Uses general algebraic manipulation but doesn't cite theorems
- FORMAL: Explicitly invokes theorems and verifies hypotheses deductively

YOUR TASK:
1. Analyze the handwritten student work in the image
2. Apply the CERC rubric strictly
3. Identify the student's reasoning stage
4. Provide specific, actionable feedback

CRITICAL GRADING PRINCIPLES:
- Partial credit is key: award points for correct methodology even if final answer is wrong
- Look for EXPLICIT verification of conditions (e.g., "f is continuous on [a,b], therefore...")
- Distinguish between correct procedure and correct justification
- Note if student uses theorem without stating/verifying hypotheses
- AP FRQs require WRITTEN JUSTIFICATION, not just correct answers

Return ONLY valid JSON (no markdown, no extra text):
{
  "score": <0-9>,
  "cerc": {
    "claim": {
      "score": <0-3>,
      "feedback": "<specific feedback on claim>"
    },
    "evidence": {
      "score": <0-3>,
      "feedback": "<specific feedback on calculations/work shown>"
    },
    "reasoning": {
      "score": <0-2>,
      "feedback": "<specific feedback on logical connection>"
    },
    "conditions": {
      "score": <0-1>,
      "feedback": "<specific feedback on hypothesis verification>"
    }
  },
  "reasoningStage": "<empirical|generic|formal>",
  "missingElements": [
    "<list specific missing elements, e.g., 'Did not verify continuity for MVT'>",
    "<another missing element>"
  ],
  "overallFeedback": "<2-3 sentence summary of performance>",
  "suggestedActionPoints": [
    "<specific action point 1>",
    "<specific action point 2>",
    "<specific action point 3>"
  ]
}`;
}

// Helper to convert image URL/file to base64
export async function imageToBase64(imageUrl: string): Promise<string> {
  // In production, this would fetch from Firebase Storage/S3
  // For now, handle both data URLs and regular URLs
  if (imageUrl.startsWith("data:image")) {
    // Already a data URL, extract base64
    return imageUrl.split(",")[1];
  }

  // For mock/testing, return placeholder
  // In production, fetch the actual image and convert
  throw new Error("Image fetching not implemented - requires Firebase Storage integration");
}
