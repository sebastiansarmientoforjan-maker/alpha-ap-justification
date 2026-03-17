/**
 * Telegram Bot Integration
 * Sends notifications when FRQs need approval
 */

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode: "Markdown" | "HTML";
  reply_markup?: {
    inline_keyboard: Array<Array<{
      text: string;
      callback_data?: string;
      url?: string;
    }>>;
  };
}

interface FRQNotificationData {
  studentName: string;
  quizScore: number;
  frqType: "specific" | "general";
  weakTopics: string[];
  frqId: string;
  frqStatement: string;
  week1Problems: string[];
}

/**
 * Send FRQ approval request to Telegram
 */
export async function sendTelegramFRQNotification(data: FRQNotificationData) {
  const {
    studentName,
    quizScore,
    frqType,
    weakTopics,
    frqId,
    frqStatement,
    week1Problems,
  } = data;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("❌ Telegram credentials not configured");
    console.error("Missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  // Format message with Markdown
  const scoreEmoji = quizScore < 80 ? "🔴" : "🟢";
  const typeEmoji = frqType === "specific" ? "🎯" : "📚";

  const message = `
🎓 *NEW FRQ GENERATED - Requires Approval*

👤 *Student:* ${studentName}
${scoreEmoji} *Quiz Score:* ${quizScore}% ${quizScore < 80 ? "(Below 80%)" : "(High Score)"}
${typeEmoji} *FRQ Type:* ${frqType.toUpperCase()}
${weakTopics.length > 0 ? `📌 *Weak Topics:* ${weakTopics.join(", ")}` : ""}

📝 *Generated FRQ Preview:*
\`\`\`
${frqStatement.slice(0, 250)}${frqStatement.length > 250 ? "..." : ""}
\`\`\`

📋 *Week 1 Problems:*
${week1Problems.map((title, idx) => `${idx + 1}. ${title}`).join("\n")}

*FRQ ID:* \`${frqId}\`
*Generated:* ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}
`.trim();

  // Create inline keyboard with action buttons
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "✅ Approve & Assign",
          callback_data: `approve_frq:${frqId}`,
        },
        {
          text: "❌ Reject",
          callback_data: `reject_frq:${frqId}`,
        },
      ],
      [
        {
          text: "🔄 Regenerate",
          callback_data: `regenerate_frq:${frqId}`,
        },
        // Temporarily disabled until NEXT_PUBLIC_BASE_URL is configured
        // {
        //   text: "👁️ View Full Details",
        //   url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/frq-approvals/${frqId}`,
        // },
      ],
    ],
  };

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
          reply_markup: keyboard,
        } as TelegramMessage),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("❌ Telegram API error:", result);
      return false;
    }

    console.log("✅ Telegram notification sent successfully");
    console.log(`📱 Message ID: ${result.result.message_id}`);
    return true;

  } catch (error) {
    console.error("❌ Failed to send Telegram notification:", error);
    return false;
  }
}

/**
 * Send simple text message to Telegram
 */
export async function sendTelegramMessage(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("❌ Telegram credentials not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      }
    );

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error);
    return false;
  }
}

/**
 * Send confirmation message after action
 */
export async function sendTelegramActionConfirmation(
  action: "approved" | "rejected" | "regenerated",
  frqId: string,
  studentName: string
) {
  const emoji = {
    approved: "✅",
    rejected: "❌",
    regenerated: "🔄",
  };

  const actionText = {
    approved: "approved and assigned",
    rejected: "rejected",
    regenerated: "regenerated",
  };

  const message = `
${emoji[action]} *FRQ ${actionText[action].toUpperCase()}*

*Student:* ${studentName}
*FRQ ID:* \`${frqId}\`
*Time:* ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}
${action === "approved" ? "\n✨ Student can now access Week 1 training!" : ""}
`.trim();

  return sendTelegramMessage(message);
}

/**
 * Test Telegram connection
 */
export async function testTelegramConnection() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return {
      success: false,
      error: "TELEGRAM_BOT_TOKEN not configured",
    };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );
    const result = await response.json();

    if (result.ok) {
      return {
        success: true,
        botInfo: result.result,
      };
    } else {
      return {
        success: false,
        error: result.description,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
