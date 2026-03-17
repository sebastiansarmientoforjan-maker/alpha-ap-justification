import { NextResponse } from "next/server";
import {
  testTelegramConnection,
  sendTelegramMessage,
  sendTelegramFRQNotification
} from "@/lib/telegram/bot";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "test";

  // Test 1: Connection test
  if (action === "test") {
    const connectionTest = await testTelegramConnection();

    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: connectionTest.error,
        help: "Make sure TELEGRAM_BOT_TOKEN is set in .env.local",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Bot connection successful",
      botInfo: connectionTest.botInfo,
    });
  }

  // Test 2: Send simple message
  if (action === "message") {
    const messageSent = await sendTelegramMessage(
      "✅ *Telegram Bot Connected!*\n\nYour AP Justification notification system is ready."
    );

    if (!messageSent) {
      return NextResponse.json({
        success: false,
        error: "Failed to send message. Check TELEGRAM_CHAT_ID in .env.local",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Test message sent to Telegram!",
    });
  }

  // Test 3: Send full FRQ notification (mock data)
  if (action === "frq") {
    const sent = await sendTelegramFRQNotification({
      studentName: "Test Student",
      quizScore: 75,
      frqType: "specific",
      weakTopics: ["derivatives", "MVT"],
      frqId: "frq-test-123",
      frqStatement: "Consider the function f(x) = x³ - 3x on the interval [-2, 2]. Apply the Mean Value Theorem to find a value c in (-2, 2) such that f'(c) equals the average rate of change of f on [-2, 2].",
      week1Problems: [
        "MVT: Checking Differentiability",
        "IVT: Condition Verification",
        "FTC: Domain Restrictions",
      ],
    });

    if (!sent) {
      return NextResponse.json({
        success: false,
        error: "Failed to send FRQ notification",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Mock FRQ notification sent! Check your Telegram.",
    });
  }

  // Default: Show available actions
  return NextResponse.json({
    available_actions: [
      {
        action: "test",
        url: "/api/test-telegram?action=test",
        description: "Test bot connection (returns bot info)",
      },
      {
        action: "message",
        url: "/api/test-telegram?action=message",
        description: "Send a simple test message",
      },
      {
        action: "frq",
        url: "/api/test-telegram?action=frq",
        description: "Send a full FRQ notification with buttons (mock data)",
      },
    ],
  });
}
