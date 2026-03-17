import { NextRequest, NextResponse } from "next/server";
import { sendTelegramActionConfirmation } from "@/lib/telegram/bot";

/**
 * Telegram Webhook Handler
 * Receives callbacks when Sebastian clicks inline buttons
 */

interface TelegramUpdate {
  update_id: number;
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
    };
    message: {
      message_id: number;
      chat: {
        id: number;
      };
    };
    data: string; // e.g., "approve_frq:frq-abc123"
  };
}

export async function POST(req: NextRequest) {
  try {
    const update: TelegramUpdate = await req.json();

    // Handle callback queries (button clicks)
    if (update.callback_query) {
      const { callback_query } = update;
      const { data, from, message } = callback_query;

      console.log(`📱 Telegram callback from ${from.first_name}: ${data}`);

      // Parse callback data
      const [action, frqId] = data.split(":");

      let responseText = "";
      let success = false;

      // Handle different actions
      switch (action) {
        case "approve_frq":
          success = await handleApprove(frqId);
          responseText = success
            ? "✅ FRQ approved and assigned to student!"
            : "❌ Failed to approve FRQ. Check logs.";
          break;

        case "reject_frq":
          success = await handleReject(frqId);
          responseText = success
            ? "❌ FRQ rejected."
            : "❌ Failed to reject FRQ. Check logs.";
          break;

        case "regenerate_frq":
          success = await handleRegenerate(frqId);
          responseText = success
            ? "🔄 Regenerating FRQ with Claude..."
            : "❌ Failed to regenerate FRQ. Check logs.";
          break;

        default:
          responseText = "❓ Unknown action";
      }

      // Send acknowledgment to Telegram
      await answerCallbackQuery(callback_query.id, responseText);

      // Update the original message to show it's been handled
      if (success) {
        await updateMessageWithStatus(
          message.chat.id,
          message.message_id,
          action,
          frqId
        );
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, message: "No callback to process" });

  } catch (error) {
    console.error("❌ Telegram webhook error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}

/**
 * Handle FRQ approval
 */
async function handleApprove(frqId: string): Promise<boolean> {
  try {
    console.log(`✅ Approving FRQ: ${frqId}`);

    // Call internal API to approve
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/frq-approvals/${frqId}/approve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to approve FRQ");
    }

    const result = await response.json();

    // Send confirmation
    await sendTelegramActionConfirmation(
      "approved",
      frqId,
      result.studentName || "Student"
    );

    return true;
  } catch (error) {
    console.error("❌ Error approving FRQ:", error);
    return false;
  }
}

/**
 * Handle FRQ rejection
 */
async function handleReject(frqId: string): Promise<boolean> {
  try {
    console.log(`❌ Rejecting FRQ: ${frqId}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/frq-approvals/${frqId}/reject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Rejected via Telegram",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reject FRQ");
    }

    const result = await response.json();

    await sendTelegramActionConfirmation(
      "rejected",
      frqId,
      result.studentName || "Student"
    );

    return true;
  } catch (error) {
    console.error("❌ Error rejecting FRQ:", error);
    return false;
  }
}

/**
 * Handle FRQ regeneration
 */
async function handleRegenerate(frqId: string): Promise<boolean> {
  try {
    console.log(`🔄 Regenerating FRQ: ${frqId}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/frq-approvals/${frqId}/regenerate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to regenerate FRQ");
    }

    const result = await response.json();

    await sendTelegramActionConfirmation(
      "regenerated",
      frqId,
      result.studentName || "Student"
    );

    return true;
  } catch (error) {
    console.error("❌ Error regenerating FRQ:", error);
    return false;
  }
}

/**
 * Send answer to callback query (shows notification in Telegram)
 */
async function answerCallbackQuery(callbackQueryId: string, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  try {
    await fetch(
      `https://api.telegram.org/bot${botToken}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text: text,
          show_alert: false, // Shows as notification, not modal
        }),
      }
    );
  } catch (error) {
    console.error("❌ Failed to answer callback query:", error);
  }
}

/**
 * Update the original message to show it's been handled
 */
async function updateMessageWithStatus(
  chatId: number,
  messageId: number,
  action: string,
  frqId: string
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  const statusEmoji = {
    approve_frq: "✅",
    reject_frq: "❌",
    regenerate_frq: "🔄",
  };

  const statusText = {
    approve_frq: "APPROVED",
    reject_frq: "REJECTED",
    regenerate_frq: "REGENERATING",
  };

  try {
    await fetch(
      `https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `${statusEmoji[action as keyof typeof statusEmoji]} ${statusText[action as keyof typeof statusText]}`,
                  callback_data: "handled",
                },
              ],
            ],
          },
        }),
      }
    );
  } catch (error) {
    console.error("❌ Failed to update message:", error);
  }
}
