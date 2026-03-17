/**
 * Telegram Callback Handler
 * Processes button clicks from Telegram (approve/reject FRQ)
 */

import { NextRequest, NextResponse } from "next/server";
import { getDataService } from "@/services/data";
import { sendActionConfirmation, sendPDFToTelegram } from "@/lib/telegram/frq-approval";

const PDF_COMPILER_URL = process.env.PDF_COMPILER_URL;
const PDF_COMPILER_API_KEY = process.env.PDF_COMPILER_API_KEY;

export async function POST(request: NextRequest) {
  console.log('[Telegram Callback] Received callback');

  try {
    const body = await request.json();

    // Telegram sends updates with callback_query
    if (!body.callback_query) {
      return NextResponse.json({ ok: true, message: "Not a callback query" });
    }

    const callbackQuery = body.callback_query;
    const callbackData = callbackQuery.data; // Format: "action:frqId"
    const [action, frqId] = callbackData.split(":");

    console.log(`[Telegram Callback] Action: ${action}, FRQ ID: ${frqId}`);

    const dataService = await getDataService();

    // Get FRQ assignment
    const frq = await dataService.getFRQAssignment(frqId);
    if (!frq) {
      console.error(`[Telegram Callback] FRQ not found: ${frqId}`);
      return NextResponse.json({ ok: false, error: "FRQ not found" }, { status: 404 });
    }

    // Get student info
    const student = await dataService.getUserById(frq.studentId);
    if (!student) {
      console.error(`[Telegram Callback] Student not found: ${frq.studentId}`);
      return NextResponse.json({ ok: false, error: "Student not found" }, { status: 404 });
    }

    // Process action
    switch (action) {
      case "approve":
        console.log(`[Telegram Callback] Approving FRQ ${frqId}`);

        // Update FRQ status
        await dataService.updateFRQAssignment(frqId, {
          status: "approved",
          approvedAt: new Date(),
          approvedBy: "telegram-bot",
        });

        // Send PDF
        if (PDF_COMPILER_URL && PDF_COMPILER_API_KEY) {
          try {
            // Generate PDF URL
            const pdfUrl = `${PDF_COMPILER_URL}/compile?frqId=${frqId}`;

            // Send PDF to Telegram
            await sendPDFToTelegram(
              pdfUrl,
              `📄 *FRQ Assignment - APPROVED*\n\n*Student:* ${student.name}\n*FRQ ID:* \`${frqId}\``
            );

            console.log('[Telegram Callback] PDF sent successfully');
          } catch (pdfError) {
            console.error('[Telegram Callback] Failed to send PDF:', pdfError);
          }
        }

        // Send confirmation
        await sendActionConfirmation("approved", frqId, student.name);

        // Answer callback query to remove loading state
        await answerCallbackQuery(callbackQuery.id, "✅ FRQ Approved & PDF Sent!");
        break;

      case "reject":
        console.log(`[Telegram Callback] Rejecting FRQ ${frqId}`);

        // Update FRQ status
        await dataService.updateFRQAssignment(frqId, {
          status: "rejected",
        });

        // Send confirmation
        await sendActionConfirmation("rejected", frqId, student.name);

        // Answer callback query
        await answerCallbackQuery(callbackQuery.id, "❌ FRQ Rejected");
        break;

      case "pdf":
        console.log(`[Telegram Callback] Sending PDF only for ${frqId}`);

        // Send PDF without approving
        if (PDF_COMPILER_URL && PDF_COMPILER_API_KEY) {
          try {
            const pdfUrl = `${PDF_COMPILER_URL}/compile?frqId=${frqId}`;

            await sendPDFToTelegram(
              pdfUrl,
              `📄 *FRQ Preview*\n\n*Student:* ${student.name}\n*FRQ ID:* \`${frqId}\`\n\n_Not yet approved_`
            );

            console.log('[Telegram Callback] PDF preview sent');
          } catch (pdfError) {
            console.error('[Telegram Callback] Failed to send PDF:', pdfError);
          }
        }

        // Answer callback query
        await answerCallbackQuery(callbackQuery.id, "📄 PDF Sent!");
        break;

      case "view_progress":
        // For blocked FRQs - view student progress
        const studentId = frqId; // In this case, frqId is actually studentId
        console.log(`[Telegram Callback] Viewing progress for ${studentId}`);

        // Get progress summary
        const progress = await dataService.getStudentProgressSummary(studentId);
        const progressMessage =
          `📊 *Student Progress*\n\n` +
          `*Student:* ${student.name}\n` +
          `*Total XP:* ${progress?.totalXP || 0}\n` +
          `*Badges:* ${progress?.badges.length || 0}\n` +
          `*Reasoning Stage:* ${progress?.currentStage || "empirical"}\n\n` +
          `*Week 1 Completion:* ${progress?.weeklyProgress?.[0]?.completion || 0}%`;

        await sendActionConfirmation("pdf_sent", studentId, student.name); // Reuse for now
        await answerCallbackQuery(callbackQuery.id, "📊 Progress Sent!");
        break;

      default:
        console.warn(`[Telegram Callback] Unknown action: ${action}`);
        await answerCallbackQuery(callbackQuery.id, "⚠️ Unknown action");
    }

    return NextResponse.json({ ok: true, message: `Action ${action} processed` });
  } catch (error) {
    console.error('[Telegram Callback] Error processing callback:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Answer callback query to remove loading state in Telegram
 */
async function answerCallbackQuery(callbackQueryId: string, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: false,
      }),
    });
  } catch (error) {
    console.error("Failed to answer callback query:", error);
  }
}
