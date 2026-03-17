/**
 * Test TimeBack Webhook Endpoint
 *
 * Run with: node scripts/test-timeback-webhook.js
 *
 * Make sure server is running: npm run dev
 */

require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/timeback';
const WEBHOOK_SECRET = process.env.TIMEBACK_WEBHOOK_SECRET;

// Test payload: Ananya completes MVT quiz with 85%
const testPayload = {
  event: 'assessment.completed',
  timestamp: new Date().toISOString(),
  student: {
    sourcedId: 'ananya-001',
    givenName: 'Ananya',
    familyName: 'Kakarlapudi',
    email: 'ananya.k@alpha.school'
  },
  assessment: {
    sourcedId: 'assessment-123',
    title: 'AP Calculus AB - Mean Value Theorem Quiz',
    type: 'Quiz',
    course: {
      sourcedId: 'course-456',
      title: 'AP Calculus AB'
    }
  },
  result: {
    sourcedId: 'result-789',
    score: 0.85, // 85%
    scoreStatus: 'fully graded',
    date: new Date().toISOString(),
    comment: 'Strong performance on derivatives'
  }
};

// Generate HMAC signature
function generateSignature(payload) {
  if (!WEBHOOK_SECRET) {
    console.warn('⚠️  TIMEBACK_WEBHOOK_SECRET not set - signature will be empty');
    return null;
  }

  const payloadString = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payloadString)
    .digest('hex');

  return `sha256=${signature}`;
}

async function testWebhook(scenario) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Testing: ${scenario.name}`);
  console.log('='.repeat(60));

  const payload = scenario.payload;
  const signature = generateSignature(payload);

  console.log('\n📤 Sending payload:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET || 'test-secret'}`,
        ...(signature && { 'X-TimeBack-Signature': signature }),
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log(`\n📥 Response (${response.status} ${response.statusText}):`);
    console.log(JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ Test PASSED');
    } else {
      console.log('\n❌ Test FAILED');
    }

    return { success: response.ok, result };

  } catch (error) {
    console.error('\n❌ Test ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

async function testHealthCheck() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🏥 Testing Health Check');
  console.log('='.repeat(60));

  try {
    const response = await fetch(WEBHOOK_URL, { method: 'GET' });
    const result = await response.json();

    console.log(`\n📥 Response (${response.status} ${response.statusText}):`);
    console.log(JSON.stringify(result, null, 2));

    if (response.ok && result.status === 'healthy') {
      console.log('\n✅ Health check PASSED');
      return true;
    } else {
      console.log('\n❌ Health check FAILED');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Health check ERROR:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('\n🧪 TimeBack Webhook Test Suite');
  console.log(`Target: ${WEBHOOK_URL}`);
  console.log(`Secret configured: ${!!WEBHOOK_SECRET}`);

  // Test 1: Health check
  await testHealthCheck();

  // Test 2: Valid webhook (should trigger FRQ)
  await testWebhook({
    name: 'Valid Quiz Completion (85% - should trigger)',
    payload: testPayload
  });

  // Test 3: Score below threshold (should NOT trigger)
  await testWebhook({
    name: 'Low Score (75% - should NOT trigger)',
    payload: {
      ...testPayload,
      result: {
        ...testPayload.result,
        score: 0.75
      }
    }
  });

  // Test 4: Non-AP student (should NOT trigger)
  await testWebhook({
    name: 'Non-AP Student (should NOT trigger)',
    payload: {
      ...testPayload,
      student: {
        sourcedId: 'random-student-999',
        givenName: 'Random',
        familyName: 'Student',
        email: 'random@example.com'
      }
    }
  });

  // Test 5: Not fully graded (should NOT trigger)
  await testWebhook({
    name: 'Partially Graded (should NOT trigger)',
    payload: {
      ...testPayload,
      result: {
        ...testPayload.result,
        scoreStatus: 'partially graded'
      }
    }
  });

  // Test 6: Invalid auth
  console.log(`\n${'='.repeat(60)}`);
  console.log('📝 Testing: Invalid Authorization');
  console.log('='.repeat(60));

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer wrong-secret',
      },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();
    console.log(`\n📥 Response (${response.status}):`);
    console.log(JSON.stringify(result, null, 2));

    if (response.status === 401) {
      console.log('\n✅ Test PASSED (correctly rejected)');
    } else {
      console.log('\n❌ Test FAILED (should return 401)');
    }
  } catch (error) {
    console.error('\n❌ Test ERROR:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 All tests complete');
  console.log('='.repeat(60));
}

// Run tests
runAllTests().catch(console.error);
