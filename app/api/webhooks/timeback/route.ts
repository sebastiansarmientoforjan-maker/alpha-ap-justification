/**
 * TimeBack Webhook Endpoint
 *
 * Receives notifications when students complete assessments
 * Auto-triggers FRQ generation for qualifying quiz completions
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { TimeBackWebhookPayload, AssessmentTriggerResult } from "@/lib/types/timeback";
import { getDataService } from "@/services/data";
import { BedrockClaudeClient } from "@/lib/claude/bedrock-client";
import { sendTelegramMessage } from "@/lib/telegram/bot";
import { sendFRQApprovalRequest } from "@/lib/telegram/frq-approval";
import { checkFRQPrerequisites, getBlockedFRQMessage } from "@/lib/prerequisites";
import { detectCourse, getSystemPromptForCourse, getUserPromptForCourse } from "@/lib/prompts";

const WEBHOOK_SECRET = process.env.TIMEBACK_WEBHOOK_SECRET;
const claudeClient = new BedrockClaudeClient();

// AP Math cohort student IDs (TimeBack sourcedIds)
const AP_MATH_COHORT = [
  // Real students (from TimeBack)
  '571c432f-93f2-40af-9093-f6177e6d2dd7', // Ananya Kakarlapudi
  '053c8c5c-0707-4d95-a0c3-6a5855223230', // Alex Mathew
  '68c0e9bb-ab6b-438d-951c-288d73866d10', // Sloka Vudumu
  '2e940a0a-9a01-4d91-992b-d59b27f710da', // Elle Liemandt
  '0846ebc0-420d-486e-8f9a-6872f5ef77c1', // Maddie Price
  '7a3ede84-6a3e-4e83-aa7e-a88b535aff25', // Sloane Price

  // Test student (for testing only)
  '1a69ff43-1036-4507-bf21-0ac45ab93666', // Test 20 _test_ (phantom)

  // Legacy mock IDs (keep for backward compatibility with mock adapter)
  'ananya-001',
  'emily-001',
  'alex-001',
  'sloka-001',
  'elle-001',
  'maddie-001',
  'sloane-001',
];

// Minimum score to trigger FRQ generation (80%)
const SCORE_THRESHOLD = 0.80;

/**
 * Verify webhook signature (HMAC-SHA256)
 */
function verifySignature(payload: string, signature: string | null): boolean {
  if (!signature || !WEBHOOK_SECRET) {
    console.warn('[TimeBack Webhook] Signature verification skipped (no secret configured)');
    return true; // Allow if not configured yet
  }

  const expectedSignature = createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  const signatureValue = signature.startsWith('sha256=')
    ? signature.substring(7)
    : signature;

  return signatureValue === expectedSignature;
}

/**
 * Validate webhook payload structure
 */
function validatePayload(data: any): { valid: boolean; error?: string; payload?: TimeBackWebhookPayload } {
  if (!data) {
    return { valid: false, error: 'Empty payload' };
  }

  if (!data.student?.sourcedId) {
    return { valid: false, error: 'Missing student.sourcedId' };
  }

  if (!data.assessment?.title) {
    return { valid: false, error: 'Missing assessment.title' };
  }

  if (typeof data.result?.score !== 'number') {
    return { valid: false, error: 'Missing or invalid result.score' };
  }

  if (data.result.scoreStatus !== 'fully graded') {
    return { valid: false, error: `Score not fully graded (status: ${data.result.scoreStatus})` };
  }

  return { valid: true, payload: data as TimeBackWebhookPayload };
}

/**
 * Check if student should trigger FRQ generation
 */
function shouldTriggerFRQ(payload: TimeBackWebhookPayload): { trigger: boolean; reason: string } {
  // Check if student is in AP Math cohort
  if (!AP_MATH_COHORT.includes(payload.student.sourcedId)) {
    return {
      trigger: false,
      reason: `Student ${payload.student.sourcedId} not in AP Math cohort`
    };
  }

  // Check assessment type (only Quiz/Exam/Test, not practice)
  const assessmentType = payload.assessment.type?.toLowerCase();
  if (!['quiz', 'exam', 'test'].includes(assessmentType)) {
    return {
      trigger: false,
      reason: `Assessment type '${payload.assessment.type}' does not trigger FRQs`
    };
  }

  // Check score threshold
  if (payload.result.score < SCORE_THRESHOLD) {
    return {
      trigger: false,
      reason: `Score ${(payload.result.score * 100).toFixed(0)}% below threshold ${(SCORE_THRESHOLD * 100)}%`
    };
  }

  return { trigger: true, reason: 'All criteria met' };
}

/**
 * Generate FRQ using Claude (reuses logic from /api/admin/generate-frq)
 */
async function generateFRQ(payload: TimeBackWebhookPayload): Promise<{ frqId: string; blocked: boolean; blockedReason?: string; problemStatement?: string; topic?: string; type?: string; course?: string }> {
  const dataService = await getDataService();

  // Determine FRQ type based on score
  const frqType = payload.result.score >= 0.80 ? 'general' : 'topic';
  const topic = payload.assessment.title; // e.g., "Mean Value Theorem Quiz"

  console.log(`[TimeBack Webhook] Generating ${frqType} FRQ for topic: ${topic}`);

  // DETECT STUDENT'S COURSE (AB, BC, or Statistics)
  const studentCourse = await detectCourse(payload.student.sourcedId, payload.assessment.title);
  console.log(`[TimeBack Webhook] Detected course: ${studentCourse}`);

  // CHECK PREREQUISITES: Has student completed enough training problems?
  // Assume Week 1 for now (can be made dynamic based on course timeline)
  const targetWeek = 1;
  let prerequisiteCheck;
  let isBlocked = false;
  let blockedReason = "";

  try {
    const weekSummary = await dataService.getStudentWeekSummary(
      payload.student.sourcedId,
      targetWeek
    );

    prerequisiteCheck = checkFRQPrerequisites(
      payload.student.sourcedId,
      targetWeek,
      weekSummary
    );

    if (!prerequisiteCheck.canReceiveFRQ) {
      isBlocked = true;
      blockedReason = getBlockedFRQMessage(prerequisiteCheck);
      console.log(`[TimeBack Webhook] ⚠️  FRQ will be BLOCKED: ${blockedReason}`);
    } else {
      console.log(`[TimeBack Webhook] ✅ Prerequisites met: ${prerequisiteCheck.reason}`);
    }
  } catch (error) {
    console.error(`[TimeBack Webhook] Error checking prerequisites:`, error);
    // Continue without blocking if prerequisite check fails
  }

  // Get course-specific prompts (intelligent selection)
  const systemPrompt = getSystemPromptForCourse(studentCourse);
  const userPrompt = getUserPromptForCourse(studentCourse, topic, payload.result.score, frqType);

  console.log(`[TimeBack Webhook] Using ${studentCourse} specialized prompts`);

  // Call Claude via Bedrock with course-specific prompts
  const message = await claudeClient.createMessage({
    model: "claude-sonnet-4-5",
    max_tokens: 8192,
    temperature: 0.7,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Parse response
  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response format from Claude");
  }

  let jsonText = content.text;
  const markdownMatch = content.text.match(/```json\n([\s\S]*?)\n```/);
  if (markdownMatch) {
    jsonText = markdownMatch[1];
  } else {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonText = jsonMatch[0];
  }

  const generatedData = JSON.parse(jsonText);

  // Format problem statement with parts (a), (b), (c), (d) if present
  let fullProblemStatement = generatedData.problemStatement || '';

  if (generatedData.parts && Array.isArray(generatedData.parts)) {
    // Build formatted multi-part problem with compact spacing (fits on one page)
    fullProblemStatement += '\n\n\\begin{enumerate}[label=(\\alph*), leftmargin=*, itemsep=0.4cm]\n';

    generatedData.parts.forEach((part: any) => {
      // Extract question text (Claude should already format with \[...\] for display mode)
      const questionText = part.question || '';
      fullProblemStatement += `\\item ${questionText}\n\n`;
    });

    fullProblemStatement += '\\end{enumerate}\n';
  }

  // Create FRQ assignment in database
  const assignment = await dataService.createFRQAssignment({
    studentId: payload.student.sourcedId,
    quizId: payload.result.sourcedId, // Link to TimeBack result
    type: frqType as 'general' | 'topic',
    topic: topic,
    problemStatement: fullProblemStatement,
    status: isBlocked ? 'pending' : 'pending', // Status stays same, blocking is separate
    blocked: isBlocked,
    blockedReason: isBlocked ? blockedReason : undefined,
    prerequisiteCheck: prerequisiteCheck ? {
      weekNumber: prerequisiteCheck.weekNumber,
      problemsCompleted: prerequisiteCheck.problemsCompleted,
      problemsRequired: prerequisiteCheck.problemsRequired,
    } : undefined,
  });

  console.log(`[TimeBack Webhook] FRQ ${isBlocked ? 'generated (BLOCKED)' : 'generated'}: ${assignment.id}`);
  return {
    frqId: assignment.id,
    blocked: isBlocked,
    blockedReason: isBlocked ? blockedReason : undefined,
    problemStatement: fullProblemStatement,
    topic: topic,
    type: frqType,
    course: studentCourse,
  };
}

/**
 * POST /api/webhooks/timeback
 * Main webhook handler
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    console.log('[TimeBack Webhook] Received webhook call');

    // 1. Verify authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[TimeBack Webhook] Missing or invalid Authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (WEBHOOK_SECRET && token !== WEBHOOK_SECRET) {
      console.error('[TimeBack Webhook] Invalid webhook secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-timeback-signature');

    if (!verifySignature(rawBody, signature)) {
      console.error('[TimeBack Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 3. Parse and validate payload
    const data = JSON.parse(rawBody);
    const validation = validatePayload(data);

    if (!validation.valid) {
      console.error(`[TimeBack Webhook] Invalid payload: ${validation.error}`);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const payload = validation.payload!;

    console.log(`[TimeBack Webhook] Valid payload received:`);
    console.log(`  Event: ${payload.event}`);
    console.log(`  Student: ${payload.student.givenName} ${payload.student.familyName} (${payload.student.sourcedId})`);
    console.log(`  Assessment: ${payload.assessment.title}`);
    console.log(`  Score: ${(payload.result.score * 100).toFixed(0)}%`);

    // 4. Check if should trigger FRQ
    const triggerCheck = shouldTriggerFRQ(payload);

    if (!triggerCheck.trigger) {
      console.log(`[TimeBack Webhook] ⏭️  Skipping FRQ generation: ${triggerCheck.reason}`);
      return NextResponse.json({
        received: true,
        triggered: false,
        reason: triggerCheck.reason,
        processingTime: Date.now() - startTime,
      });
    }

    console.log(`[TimeBack Webhook] ✅ Triggering FRQ generation: ${triggerCheck.reason}`);

    // 5. Generate FRQ with Claude
    const { frqId, blocked, blockedReason, problemStatement, topic, type, course } = await generateFRQ(payload);

    // 6. Send Telegram notification with PDF
    try {
      // Send notification with approval buttons
      await sendFRQApprovalRequest({
        frqId,
        studentName: `${payload.student.givenName} ${payload.student.familyName}`,
        studentId: payload.student.sourcedId,
        assessmentTitle: payload.assessment.title,
        score: payload.result.score,
        blocked,
        blockedReason,
      });

      // If not blocked, also send PDF immediately for review
      console.log(`[TimeBack Webhook] Checking PDF sending: blocked=${blocked}, PDF_COMPILER_URL=${!!process.env.PDF_COMPILER_URL}`);

      if (!blocked && process.env.PDF_COMPILER_URL && problemStatement && topic && type && course) {
        console.log('[TimeBack Webhook] 🚀 Starting PDF generation and send...');
        const { sendPDFToTelegram } = await import('@/lib/telegram/frq-approval');

        // Use FRQ data returned from generateFRQ (no need to query again)
        const pdfUrl = `${process.env.PDF_COMPILER_URL}/compile`;

        // Build LaTeX content for PDF compiler (College Board style)
        // Escape special LaTeX characters in text fields
        const escapeLatex = (text: string) => {
          return text
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/[&%$#_{}]/g, '\\$&')
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\^/g, '\\textasciicircum{}');
        };

        // Detect course display name
        const courseDisplayName = {
          'calculus-ab': 'AP CALCULUS AB',
          'calculus-bc': 'AP CALCULUS BC',
          'statistics': 'AP STATISTICS'
        }[course || 'calculus-ab'] || 'AP MATHEMATICS';

        const latexContent = `\\documentclass[11pt, letterpaper]{article}

% Required Packages
\\usepackage{amsmath, amssymb, amsthm}
\\usepackage{geometry}
\\usepackage{fancyhdr}
\\usepackage{enumitem}

% Margin Specification (College Board standard)
\\geometry{top=1in, bottom=1in, left=1in, right=1in}

% Header and Footer
\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{1pt}
\\lhead{\\textbf{${courseDisplayName}}}
\\rhead{\\textbf{FREE-RESPONSE QUESTION}}
\\cfoot{\\thepage}

\\begin{document}

% Alpha School Header (top right corner - compact)
\\begin{flushright}
\\textbf{Alpha School} \\textit{-- HS Math Academic Team}
\\end{flushright}

\\vspace{0.15cm}

% Section Header (College Board style - compact)
\\begin{center}
    \\Large\\textbf{SECTION II, PART A}\\\\
    \\vspace{0.1cm}
    \\normalsize\\textbf{Time---30 minutes}\\quad A graphing calculator may be required.
\\end{center}

\\vspace{0.2cm}
\\hrule
\\vspace{0.3cm}

% Student Information (compact)
\\noindent\\textbf{Student:} ${escapeLatex(payload.student.givenName)} ${escapeLatex(payload.student.familyName)}\\quad
\\textbf{Date:} ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\\quad
\\textbf{Context:} ${escapeLatex(payload.assessment.title)} (${(payload.result.score * 100).toFixed(0)}\\%)

\\vspace{0.3cm}
\\hrule
\\vspace{0.3cm}

% Problem Statement
\\noindent\\textbf{1.} ${problemStatement}

\\vspace{1.5in}

% Instructions Footer (compact)
\\begin{center}
    \\small\\textbf{SHOW ALL YOUR WORK. JUSTIFY YOUR ANSWERS.}\\\\
    Answers without supporting work may not receive credit.
\\end{center}

\\end{document}`;

        const pdfData = {
          latexContent: latexContent
        };

        console.log(`[TimeBack Webhook] Calling sendPDFToTelegram with URL: ${pdfUrl}`);
        await sendPDFToTelegram(
          pdfUrl,
          `📄 *FRQ Assignment PDF*\n\n*Student:* ${payload.student.givenName} ${payload.student.familyName}\n*Assessment:* ${payload.assessment.title}\n*Score:* ${(payload.result.score * 100).toFixed(0)}%\n*FRQ ID:* \`${frqId}\`\n\n_Review and tap buttons above to approve/reject_`,
          pdfData
        );
        console.log('[TimeBack Webhook] ✅ PDF sent to Telegram successfully');
      } else {
        console.log(`[TimeBack Webhook] ⏭️ Skipping PDF send (blocked=${blocked}, PDF_COMPILER_URL=${!!process.env.PDF_COMPILER_URL}, hasData=${!!(problemStatement && topic && type && course)})`);
      }

      console.log('[TimeBack Webhook] Telegram notification sent');
    } catch (telegramError) {
      console.error('[TimeBack Webhook] Failed to send Telegram notification:', telegramError);
      // Don't fail the whole webhook if Telegram fails
    }

    const processingTime = Date.now() - startTime;
    console.log(`[TimeBack Webhook] ✅ Complete in ${processingTime}ms`);

    const result: AssessmentTriggerResult = {
      triggered: true,
      reason: triggerCheck.reason,
      frqId,
      studentId: payload.student.sourcedId,
      assessmentTitle: payload.assessment.title,
      score: payload.result.score,
    };

    return NextResponse.json({
      received: true,
      ...result,
      processingTime,
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('[TimeBack Webhook] Error processing webhook:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/timeback
 * Health check endpoint
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    service: 'TimeBack Webhook Endpoint',
    version: '1.0.0',
    endpoints: {
      webhook: 'POST /api/webhooks/timeback',
      health: 'GET /api/webhooks/timeback',
    },
    configuration: {
      secretConfigured: !!WEBHOOK_SECRET,
      cohortSize: AP_MATH_COHORT.length,
      scoreThreshold: `${(SCORE_THRESHOLD * 100)}%`,
    },
  });
}
