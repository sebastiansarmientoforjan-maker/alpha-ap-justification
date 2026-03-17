import { NextRequest, NextResponse } from "next/server";
import { sendTelegramFRQNotification } from "@/lib/telegram/bot";
import { generateFRQPDF } from "@/lib/pdf/frq-generator";
import { sendFRQPDFToTelegram } from "@/lib/telegram/send-document";
import { BedrockClaudeClient } from "@/lib/claude/bedrock-client";

const claudeClient = new BedrockClaudeClient();

const WEEK_1_GENERATION_PROMPT = `You are an AP Mathematics FRQ generator specialized in error-forcing pedagogy.

CRITICAL: You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON. Do not include explanatory notes or comments outside the JSON structure.

Your task: Generate ONE complete FRQ package including problem, solution, rubric, and pedagogical justification.

CRITICAL COMPONENTS TO GENERATE:

1. **FRQ Problem Statement** (LaTeX formatted)
   - Clear, AP-style problem
   - Error-forcing if score < 80% (targets weak topics)
   - General mixed-topic if score ≥ 80%

2. **Complete CERC Model Solution**
   - Claim: The conclusion
   - Evidence: Mathematical computations/data
   - Reasoning: Theorem/principle connecting evidence to claim
   - Conditions: Explicit verification of ALL hypotheses

3. **College Board Rubric Application**
   - Break down the solution into scoring criteria
   - Assign points (typical AP FRQ: 6-9 points total)
   - Justify each point assignment
   - Reference actual CB rubric standards

4. **Unit Notes**
   - Which unit/topic this belongs to
   - Key concepts tested
   - Common misconceptions

5. **Pedagogical Justification**
   - WHY this specific problem for this student
   - HOW it connects to their MathAcademy performance
   - HOW it aligns with actual AP exam questions
   - Skills targeted

6. **THREE Week 1 Training Problems**
   - Error-forcing problems that prepare for the FRQ
   - Each with trap explanation
   - Progression toward FRQ complexity

ERROR CATEGORIES:
- CONDITION_BYPASS: Student skips verifying theorem hypotheses
- LOCAL_ONLY_ARGUMENT: Student checks ONE condition, misses another
- CER_BREAKDOWN: Student states theorem but doesn't connect evidence

SCAFFOLDING LEVELS (based on reasoning stage):
- Empirical → Full sentence frames
- Generic → Structural outline only
- Formal → Minimal scaffolding

OUTPUT FORMAT: Respond with ONLY a valid JSON object. Start directly with { and end with }. Do not wrap in markdown code blocks. Do not include any text outside the JSON.`;

interface GenerateFRQRequest {
  studentId: string;
  studentName: string;
  quizScore: number;
  weakTopics: string[];
  course: "calculus-ab" | "calculus-bc" | "statistics";
  reasoningStage?: "empirical" | "generic" | "formal";
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateFRQRequest = await req.json();

    const {
      studentId,
      studentName,
      quizScore,
      weakTopics,
      course,
      reasoningStage = "empirical",
    } = body;

    // Validate required fields
    if (!studentId || !quizScore || !course) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Decide FRQ type based on score
    const frqType = quizScore < 80 ? "specific" : "general";

    // Step 2: Build Claude prompt with student context
    const courseMap = {
      "calculus-ab": "AP Calculus AB",
      "calculus-bc": "AP Calculus BC",
      "statistics": "AP Statistics",
    };

    const userPrompt = JSON.stringify({
      studentName,
      course: courseMap[course] || course,
      quizScore,
      weakTopics: weakTopics.length > 0 ? weakTopics : ["general review"],
      frqType,
      reasoningStage,
      instructions: {
        frq: frqType === "specific"
          ? `Generate an FRQ targeting these weak topics: ${weakTopics.join(", ")}. The student scored ${quizScore}% on these topics in MathAcademy.`
          : `Generate a general FRQ covering mixed topics. The student scored ${quizScore}% (strong performance) and needs comprehensive review.`,
        solution: "Provide a COMPLETE CERC model solution. Be specific and rigorous.",
        rubric: "Apply College Board rubric standards. Break down into 6-9 total points with justification for each criterion.",
        unitNotes: "Identify which AP unit this belongs to and key concepts tested.",
        justification: `Explain WHY this problem is perfect for this student given their ${quizScore}% score and ${frqType} FRQ type. Connect to actual AP exam format.`,
        week1Problems: [
          "Problem 1: Error-forcing problem targeting primary weakness",
          "Problem 2: Different theorem/condition trap",
          "Problem 3: Integration preparing for FRQ complexity",
        ],
        scaffolding: `Provide ${reasoningStage} level scaffolding in Week 1 problems`,
      },
      requiredOutput: {
        frq: {
          statement: "LaTeX formatted problem statement",
          type: frqType,
        },
        solution: {
          cercResponse: {
            claim: "string",
            evidence: "string",
            reasoning: "string",
            conditions: "string",
          },
          rubric: {
            totalPoints: "number",
            breakdown: [{
              criterion: "string",
              points: "number",
              maxPoints: "number",
              justification: "string",
            }],
          },
          unitNotes: ["string", "string"],
        },
        problemSelection: {
          rationale: "Why this problem?",
          mathAcademyConnection: "How it connects to quiz performance",
          apExamAlignment: "How it maps to real AP exam",
          skillsTargeted: ["skill1", "skill2"],
        },
        week1Problems: [{
          title: "string",
          statement: "LaTeX formatted",
          trap: "string",
          sentenceFrames: {},
          hints: {},
        }],
      },
    }, null, 2);

    // Step 3: Call Claude API via Bedrock
    console.log("Calling Claude API (via AWS Bedrock) for FRQ generation...");
    const message = await claudeClient.createMessage({
      model: "claude-sonnet-4-5",
      max_tokens: 8192, // Increased for longer responses
      temperature: 0.7,
      system: WEEK_1_GENERATION_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Step 4: Parse Claude's response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response format from Claude");
    }

    let generatedData;
    try {
      // Extract JSON from Claude's response (may be wrapped in markdown)
      let jsonText = content.text;

      // Try to extract from markdown code block first
      const markdownMatch = content.text.match(/```json\n([\s\S]*?)\n```/);
      if (markdownMatch) {
        jsonText = markdownMatch[1];
      } else {
        // Try to find JSON object
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
      }

      console.log("Extracted JSON length:", jsonText.length);
      generatedData = JSON.parse(jsonText);
      console.log("✅ Successfully parsed FRQ data");
    } catch (parseError) {
      console.error("❌ Failed to parse Claude response");
      console.error("Response length:", content.text.length);
      console.error("First 500 chars:", content.text.substring(0, 500));
      console.error("Last 500 chars:", content.text.substring(content.text.length - 500));
      console.error("Parse error:", parseError);
      throw new Error(`Failed to parse generated FRQ data: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    // Step 5: Add metadata
    const frqWithMetadata = {
      ...generatedData,
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedFor: studentId,
        studentName,
        quizScore,
        weakTopics,
        frqType,
        reasoningStage,
        status: "pending_approval",
      },
    };

    // Step 6: Store in database (pending approval)
    // TODO: Implement Firebase storage
    // await db.collection("frq_pending_approval").add(frqWithMetadata);

    // Step 7: Generate PDF (TODO: Fix Railway integration)
    // For now, skipping PDF generation to test end-to-end flow
    console.log("📄 Skipping PDF generation (Railway integration pending)");
    // const pdfPath = await generateFRQPDF({...});

    // Step 8: Send notification to Telegram (without PDF for now)
    console.log("📱 Sending notification to Telegram...");
    await sendTelegramFRQNotification({
      studentName,
      quizScore,
      frqType,
      weakTopics,
      frqId: generatedData.frq?.id || `frq-${Date.now()}`,
      frqStatement: generatedData.frq.statement,
      week1Problems: generatedData.week1Problems?.map((p: any) => p.title || "Problem") || [],
    });

    return NextResponse.json({
      success: true,
      message: "FRQ generated successfully and sent for approval",
      frqId: frqWithMetadata.frq.id,
      frqType,
      previewUrl: `/admin/frq-approvals/${frqWithMetadata.frq.id}`,
    });

  } catch (error) {
    console.error("Error generating FRQ:", error);
    return NextResponse.json(
      {
        error: "Failed to generate FRQ",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Telegram notification is now handled by sendTelegramFRQNotification imported above
