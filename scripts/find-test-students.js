/**
 * Find Test/Demo Students in TimeBack
 *
 * Search for non-real students we can use for testing
 */

require('dotenv').config({ path: '.env.local' });

const CLIENT_ID = process.env.TIMEBACK_CLIENT_ID;
const CLIENT_SECRET = process.env.TIMEBACK_CLIENT_SECRET;
const COGNITO_DOMAIN = process.env.TIMEBACK_COGNITO_DOMAIN;
const ONEROSTER_BASE = process.env.TIMEBACK_API_BASE_URL;

async function getOAuth2Token() {
  const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`;
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

async function searchAllUsers(token, limit = 100) {
  try {
    const response = await fetch(
      `${ONEROSTER_BASE}/ims/oneroster/rostering/v1p2/users?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('API Error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Request failed:', error.message);
    return [];
  }
}

function isTestStudent(user) {
  const fullName = `${user.givenName} ${user.familyName}`.toLowerCase();
  const email = (user.email || '').toLowerCase();

  const testKeywords = [
    'test', 'demo', 'sample', 'fake', 'dummy', 'trial',
    'example', 'sandbox', 'dev', 'development', 'alpha test'
  ];

  return testKeywords.some(keyword =>
    fullName.includes(keyword) || email.includes(keyword)
  );
}

async function run() {
  console.log('🔍 Searching for Test/Demo Students in TimeBack\n');
  console.log('════════════════════════════════════════════════════════\n');

  const token = await getOAuth2Token();
  console.log('✅ Authenticated\n');

  console.log('Fetching users...\n');
  const users = await searchAllUsers(token, 200);

  console.log(`📊 Found ${users.length} total users\n`);
  console.log('────────────────────────────────────────────────────────\n');

  // Categorize users
  const testStudents = users.filter(u => isTestStudent(u));
  const deletedUsers = users.filter(u => u.status === 'tobedeleted');
  const regularUsers = users.filter(u => !isTestStudent(u) && u.status === 'active');

  console.log('📋 TEST/DEMO STUDENTS:\n');
  if (testStudents.length > 0) {
    testStudents.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.givenName} ${user.familyName}`);
      console.log(`   sourcedId: ${user.sourcedId}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Status: ${user.status}\n`);
    });
  } else {
    console.log('   ❌ No test students found with test/demo keywords\n');
  }

  console.log('────────────────────────────────────────────────────────\n');
  console.log('🗑️  DELETED/INACTIVE USERS:\n');
  if (deletedUsers.length > 0) {
    deletedUsers.slice(0, 5).forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.givenName} ${user.familyName}`);
      console.log(`   sourcedId: ${user.sourcedId}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Status: ${user.status}\n`);
    });
    if (deletedUsers.length > 5) {
      console.log(`   ... and ${deletedUsers.length - 5} more\n`);
    }
  } else {
    console.log('   None found\n');
  }

  console.log('────────────────────────────────────────────────────────\n');
  console.log('📊 SUMMARY:\n');
  console.log(`   Total users: ${users.length}`);
  console.log(`   Test/Demo students: ${testStudents.length}`);
  console.log(`   Deleted users: ${deletedUsers.length}`);
  console.log(`   Regular active users: ${regularUsers.length}\n`);

  console.log('════════════════════════════════════════════════════════\n');

  if (testStudents.length > 0) {
    console.log('✅ Found test students! You can use these for testing.\n');
    console.log('Recommended test student:');
    const best = testStudents[0];
    console.log(`   Name: ${best.givenName} ${best.familyName}`);
    console.log(`   sourcedId: ${best.sourcedId}`);
    console.log(`   Email: ${best.email}\n`);
  } else if (deletedUsers.length > 0) {
    console.log('⚠️  No test students found, but there are deleted users.');
    console.log('   You could potentially use a deleted user for testing.\n');
  } else {
    console.log('🔴 No test students found!');
    console.log('   All users appear to be real students.');
    console.log('   Recommendation: Ask TimeBack to create test accounts.\n');
  }

  // Show first 10 regular users for reference
  console.log('────────────────────────────────────────────────────────\n');
  console.log('👥 SAMPLE OF REGULAR USERS (first 10):\n');
  regularUsers.slice(0, 10).forEach((user, idx) => {
    console.log(`${idx + 1}. ${user.givenName} ${user.familyName}`);
    console.log(`   Email: ${user.email || 'N/A'}\n`);
  });
}

run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
