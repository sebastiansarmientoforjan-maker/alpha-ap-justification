/**
 * Send PDF document via Telegram
 */

import fs from "fs/promises";
import FormData from "form-data";
import fetch from "node-fetch";

interface SendDocumentOptions {
  chatId: string;
  filePath: string;
  caption?: string;
  replyMarkup?: {
    inline_keyboard: Array<Array<{
      text: string;
      callback_data?: string;
      url?: string;
    }>>;
  };
}

/**
 * Send PDF document to Telegram chat
 */
export async function sendTelegramDocument(options: SendDocumentOptions): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.error("❌ TELEGRAM_BOT_TOKEN not configured");
    return false;
  }

  const { chatId, filePath, caption, replyMarkup } = options;

  try {
    // Read file
    const fileBuffer = await fs.readFile(filePath);
    const fileName = filePath.split("/").pop() || "document.pdf";

    // Create form data
    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("document", fileBuffer, {
      filename: fileName,
      contentType: "application/pdf",
    });

    if (caption) {
      form.append("caption", caption);
      form.append("parse_mode", "Markdown");
    }

    if (replyMarkup) {
      form.append("reply_markup", JSON.stringify(replyMarkup));
    }

    // Send to Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendDocument`,
      {
        method: "POST",
        body: form,
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("❌ Telegram sendDocument error:", result);
      return false;
    }

    console.log("✅ PDF sent to Telegram successfully");
    console.log(`📄 File: ${fileName}`);
    return true;

  } catch (error) {
    console.error("❌ Failed to send document to Telegram:", error);
    return false;
  }
}

/**
 * Send FRQ PDF with approval buttons
 */
export async function sendFRQPDFToTelegram(
  pdfPath: string,
  data: {
    studentName: string;
    quizScore: number;
    frqType: string;
    weakTopics: string[];
    frqId: string;
  }
): Promise<boolean> {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    console.error("❌ TELEGRAM_CHAT_ID not configured");
    return false;
  }

  const scoreEmoji = data.quizScore < 80 ? "🔴" : "🟢";
  const typeEmoji = data.frqType === "specific" ? "🎯" : "📚";

  const caption = `
📄 *NEW FRQ GENERATED*

👤 *Student:* ${data.studentName}
${scoreEmoji} *Score:* ${data.quizScore}%
${typeEmoji} *Type:* ${data.frqType.toUpperCase()}
${data.weakTopics.length > 0 ? `📌 *Topics:* ${data.weakTopics.join(", ")}` : ""}

📋 *This PDF contains:*
✓ Problem statement (LaTeX formatted)
✓ Complete CERC solution
✓ College Board rubric application
✓ Unit notes
✓ Pedagogical justification
✓ Week 1 training problems

*FRQ ID:* \`${data.frqId}\`
`.trim();

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "✅ Approve & Assign",
          callback_data: `approve_frq:${data.frqId}`,
        },
        {
          text: "❌ Reject",
          callback_data: `reject_frq:${data.frqId}`,
        },
      ],
      [
        {
          text: "🔄 Regenerate",
          callback_data: `regenerate_frq:${data.frqId}`,
        },
        {
          text: "👁️ View in Dashboard",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/frq-approvals/${data.frqId}`,
        },
      ],
    ],
  };

  return sendTelegramDocument({
    chatId,
    filePath: pdfPath,
    caption,
    replyMarkup: keyboard,
  });
}
