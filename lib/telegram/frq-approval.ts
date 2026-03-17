/**
 * Telegram FRQ Approval Helpers
 * Sends FRQ notifications with inline buttons for approval
 */

import FormData from 'form-data';

interface FRQApprovalData {
  frqId: string;
  studentName: string;
  studentId: string;
  assessmentTitle: string;
  score: number;
  blocked: boolean;
  blockedReason?: string;
  frqPreview?: string;
}

/**
 * Send FRQ notification with approval buttons
 */
export async function sendFRQApprovalRequest(data: FRQApprovalData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("❌ Telegram credentials not configured");
    return false;
  }

  const { frqId, studentName, assessmentTitle, score, blocked, blockedReason, frqPreview } = data;

  // Build message
  const scorePercentage = (score * 100).toFixed(0);
  const scoreEmoji = score >= 0.90 ? "🟢" : score >= 0.80 ? "🟡" : "🔴";

  let message = blocked
    ? `⚠️ *FRQ Generated (BLOCKED)*\n\n` +
      `*Student:* ${studentName}\n` +
      `*Assessment:* ${assessmentTitle}\n` +
      `${scoreEmoji} *Score:* ${scorePercentage}%\n` +
      `*FRQ ID:* \`${frqId}\`\n\n` +
      `🔒 *Blocked:* ${blockedReason}\n\n` +
      `Student must complete training before accessing this FRQ.`
    : `🎓 *New FRQ Generated*\n\n` +
      `*Student:* ${studentName}\n` +
      `*Assessment:* ${assessmentTitle}\n` +
      `${scoreEmoji} *Score:* ${scorePercentage}%\n` +
      `*FRQ ID:* \`${frqId}\`\n\n` +
      `✅ Prerequisites met\n` +
      `📱 Tap buttons below to approve/reject`;

  if (frqPreview && !blocked) {
    message += `\n\n📝 *Preview:*\n\`\`\`\n${frqPreview.slice(0, 200)}...\n\`\`\``;
  }

  // Build inline keyboard with approval buttons
  const keyboard = blocked
    ? {
        inline_keyboard: [
          [
            {
              text: "📋 View Student Progress",
              callback_data: `view_progress:${data.studentId}`,
            },
          ],
        ],
      }
    : {
        inline_keyboard: [
          [
            {
              text: "✅ Approve & Send PDF",
              callback_data: `approve:${frqId}`,
            },
            {
              text: "❌ Reject",
              callback_data: `reject:${frqId}`,
            },
          ],
          [
            {
              text: "📄 Send PDF Only",
              callback_data: `pdf:${frqId}`,
            },
          ],
        ],
      };

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error("❌ Telegram API error:", result);
      return false;
    }

    console.log("✅ Telegram FRQ approval request sent");
    console.log(`📱 Message ID: ${result.result.message_id}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error);
    return false;
  }
}

/**
 * Send PDF document to Telegram
 * Downloads PDF from Railway first, then uploads as file buffer
 */
export async function sendPDFToTelegram(pdfUrl: string, caption: string, pdfData?: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const pdfApiKey = process.env.PDF_COMPILER_API_KEY;

  if (!botToken || !chatId) {
    console.error("❌ Telegram credentials not configured");
    return false;
  }

  try {
    // Step 1: Fetch PDF from Railway
    console.log(`[Telegram] Requesting PDF from: ${pdfUrl}`);

    const pdfResponse = await fetch(pdfUrl, {
      method: pdfData ? "POST" : "GET",
      headers: {
        ...(pdfApiKey ? { "Authorization": `Bearer ${pdfApiKey}` } : {}),
        ...(pdfData ? { "Content-Type": "application/json" } : {}),
      },
      ...(pdfData ? { body: JSON.stringify(pdfData) } : {}),
    });

    if (!pdfResponse.ok) {
      console.error(`❌ Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
      const errorText = await pdfResponse.text();
      console.error(`❌ PDF Error response: ${errorText.substring(0, 200)}`);
      return false;
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    console.log(`[Telegram] PDF downloaded: ${pdfBuffer.length} bytes`);

    // Step 2: Upload to Telegram using multipart/form-data (Node.js form-data)
    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("caption", caption);
    form.append("parse_mode", "Markdown");
    form.append("document", pdfBuffer, {
      filename: "frq-assignment.pdf",
      contentType: "application/pdf",
    });

    // Use form-data with proper streaming (not fetch)
    const response = await new Promise<any>((resolve, reject) => {
      form.submit(
        {
          protocol: "https:",
          host: "api.telegram.org",
          path: `/bot${botToken}/sendDocument`,
          method: "POST",
        },
        (err, res) => {
          if (err) return reject(err);

          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            resolve({ statusCode: res.statusCode, body: data });
          });
          res.on("error", reject);
        }
      );
    });

    // Parse response from form.submit()
    if (response.statusCode !== 200) {
      console.error(`❌ Telegram API error (${response.statusCode}):`, response.body.substring(0, 300));
      return false;
    }

    let result;
    try {
      result = JSON.parse(response.body);
    } catch (jsonError) {
      console.error(`❌ Telegram response not JSON:`, response.body.substring(0, 300));
      return false;
    }

    if (!result.ok) {
      console.error("❌ Telegram sendDocument error:", result);
      return false;
    }

    console.log("✅ PDF sent to Telegram");
    return true;
  } catch (error) {
    console.error("❌ Failed to send PDF:", error);
    return false;
  }
}

/**
 * Send action confirmation (approve/reject)
 */
export async function sendActionConfirmation(
  action: "approved" | "rejected" | "pdf_sent",
  frqId: string,
  studentName: string
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return false;

  const emoji = {
    approved: "✅",
    rejected: "❌",
    pdf_sent: "📄",
  };

  const actionText = {
    approved: "APPROVED & SENT",
    rejected: "REJECTED",
    pdf_sent: "PDF SENT",
  };

  const message = `${emoji[action]} *FRQ ${actionText[action]}*\n\n` +
    `*Student:* ${studentName}\n` +
    `*FRQ ID:* \`${frqId}\`\n` +
    `*Time:* ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    return (await response.json()).ok;
  } catch (error) {
    console.error("❌ Failed to send confirmation:", error);
    return false;
  }
}
