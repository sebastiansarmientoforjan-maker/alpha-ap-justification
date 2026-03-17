/**
 * End-to-End Test: FRQ Generator Complete Flow
 *
 * Simulates TimeBack webhook → FRQ generation → Telegram notification
 */

require('dotenv').config({ path: '.env.local' });

const WEBHOOK_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const WEBHOOK_SECRET = process.env.TIMEBACK_WEBHOOK_SECRET;

// Test student (phantom from TimeBack)
const TEST_STUDENT = {
  sourcedId: '1a69ff43-1036-4507-bf21-0ac45ab93666',
  givenName: 'Test',
  familyName: '20 _test_',
  email: 'test.20._test_@alpha.school'
};

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Mean Value Theorem Quiz (85% - Should Trigger)',
    assessment: {
      title: 'AP Calculus AB - Mean Value Theorem Quiz',
      type: 'quiz'
    },
    score: 0.85,
    scoreStatus: 'fully graded',
    shouldTrigger: true
  },
  {
    name: 'Integration Quiz (92% - Should Trigger)',
    assessment: {
      title: 'AP Calculus BC - Integration by Parts Quiz',
      type: 'quiz'
    },
    score: 0.92,
    scoreStatus: 'fully graded',
    shouldTrigger: true
  },
  {
    name: 'Derivatives Practice (75% - Should NOT Trigger - Low Score)',
    assessment: {
      title: 'AP Calculus AB - Derivatives Practice',
      type: 'practice'
    },
    score: 0.75,
    scoreStatus: 'fully graded',
    shouldTrigger: false
  }
];

async function sendWebhookPayload(scenario) {
  const separator = '═'.repeat(60);
  console.log(`\n${separator}`);
  console.log(`📝 TEST: ${scenario.name}`);
  console.log(`${separator}\n`);

  const payload = {
    event: 'assessment.completed',
    timestamp: new Date().toISOString(),
    student: {
      sourcedId: TEST_STUDENT.sourcedId,
      givenName: TEST_STUDENT.givenName,
      familyName: TEST_STUDENT.familyName,
      email: TEST_STUDENT.email
    },
    assessment: {
      title: scenario.assessment.title,
      type: scenario.assessment.type
    },
    result: {
      score: scenario.score,
      scoreStatus: scenario.scoreStatus
    }
  };

  console.log('📤 Sending webhook payload:');
  console.log(JSON.stringify(payload, null, 2));
  console.log();

  try {
    const response = await fetch(`${WEBHOOK_URL}/api/webhooks/timeback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { rawResponse: responseText };
    }

    console.log(`📥 Response (${response.status}):`);
    console.log(JSON.stringify(responseData, null, 2));
    console.log();

    // Validate result
    if (scenario.shouldTrigger) {
      if (response.ok && responseData.triggered) {
        console.log('✅ TEST PASSED: FRQ was triggered as expected');
        if (responseData.frqId) {
          console.log(`   FRQ ID: ${responseData.frqId}`);
        }
        if (responseData.processingTime) {
          console.log(`   Processing time: ${responseData.processingTime}ms`);
        }
      } else {
        console.log('❌ TEST FAILED: FRQ should have been triggered but was not');
      }
    } else {
      if (response.ok && !responseData.triggered) {
        console.log('✅ TEST PASSED: FRQ was correctly NOT triggered');
        console.log(`   Reason: ${responseData.reason}`);
      } else if (response.ok && responseData.triggered) {
        console.log('❌ TEST FAILED: FRQ was triggered when it should not have been');
      } else {
        console.log('⚠️  Request failed');
      }
    }

    return {
      success: response.ok,
      triggered: responseData.triggered,
      data: responseData
    };

  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return {
      success: false,
      triggered: false,
      error: error.message
    };
  }
}

async function run() {
  console.log('\n🧪 FRQ Generator End-to-End Test Suite\n');
  console.log('Configuration:');
  console.log(`  Webhook URL: ${WEBHOOK_URL}/api/webhooks/timeback`);
  console.log(`  Webhook Secret: ${WEBHOOK_SECRET ? '***' + WEBHOOK_SECRET.substring(WEBHOOK_SECRET.length - 4) : 'MISSING'}`);
  console.log(`  Test Student: ${TEST_STUDENT.givenName} ${TEST_STUDENT.familyName}`);
  console.log(`  Student ID: ${TEST_STUDENT.sourcedId}\n`);

  if (!WEBHOOK_SECRET) {
    console.error('❌ TIMEBACK_WEBHOOK_SECRET not configured in .env.local');
    process.exit(1);
  }

  console.log('═'.repeat(60));
  console.log('Starting tests...');
  console.log('═'.repeat(60));

  const results = [];

  // Test each scenario
  for (const scenario of TEST_SCENARIOS) {
    const result = await sendWebhookPayload(scenario);
    results.push({
      scenario: scenario.name,
      ...result
    });

    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  const separator = '═'.repeat(60);
  console.log(`\n${separator}`);
  console.log('📊 TEST SUMMARY');
  console.log(`${separator}\n`);

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}\n`);

  results.forEach((result, idx) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${idx + 1}. ${status} ${result.scenario}`);
  });

  console.log(`\n${separator}`);
  console.log('🔔 CHECK YOUR TELEGRAM');
  console.log(`${separator}\n`);
  console.log('If FRQs were triggered, you should receive:');
  console.log('  1. Telegram notification with FRQ assignment details');
  console.log('  2. PDF document attached (generated by Railway)\n');
  console.log('Expected notifications: 2 (MVT Quiz + Integration Quiz)\n');

  console.log(separator);
  console.log('✅ Test suite complete!');
  console.log(`${separator}\n`);
}

run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
