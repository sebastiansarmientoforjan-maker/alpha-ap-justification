/**
 * Setup Telegram Webhook
 * Configures Telegram Bot to send callbacks to our endpoint
 */

require('dotenv').config({ path: '.env.local' });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const WEBHOOK_URL = `${BASE_URL}/api/webhooks/telegram/callback`;

async function setupWebhook() {
  console.log('\n🤖 Setting up Telegram Webhook\n');
  console.log('════════════════════════════════════════════════════════════\n');

  if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not configured in .env.local');
    process.exit(1);
  }

  console.log(`📍 Webhook URL: ${WEBHOOK_URL}\n`);

  try {
    // Set webhook
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message', 'callback_query'],
      }),
    });

    const result = await response.json();

    if (result.ok) {
      console.log('✅ Webhook configured successfully!\n');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Failed to configure webhook\n');
      console.error('Error:', result);
    }

    // Get webhook info
    console.log('\n────────────────────────────────────────────────────────────\n');
    console.log('📋 Webhook Info:\n');

    const infoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const info = await infoResponse.json();

    if (info.ok) {
      console.log(`  URL: ${info.result.url || 'Not set'}`);
      console.log(`  Pending Updates: ${info.result.pending_update_count}`);
      console.log(`  Last Error: ${info.result.last_error_message || 'None'}`);
      console.log(`  Max Connections: ${info.result.max_connections || 40}`);
    }

    console.log('\n════════════════════════════════════════════════════════════\n');
    console.log('✅ Setup complete!');
    console.log('\nNext steps:');
    console.log('  1. Test the webhook by clicking buttons in Telegram');
    console.log('  2. Check server logs for callback processing');
    console.log('  3. Run: node scripts/test-frq-generator-e2e.js\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupWebhook();
