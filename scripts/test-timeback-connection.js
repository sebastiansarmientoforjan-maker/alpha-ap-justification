/**
 * TimeBack Connection Test Script
 *
 * This script tests the connection to TimeBack APIs WITHOUT affecting the main app.
 * It will tell us if credentials are for staging or production.
 */

require('dotenv').config({ path: '.env.local' });

const CLIENT_ID = process.env.TIMEBACK_CLIENT_ID;
const CLIENT_SECRET = process.env.TIMEBACK_CLIENT_SECRET;
const COGNITO_DOMAIN = process.env.TIMEBACK_COGNITO_DOMAIN;
const ONEROSTER_BASE = process.env.TIMEBACK_API_BASE_URL;
const QTI_BASE = process.env.TIMEBACK_QTI_BASE_URL;

console.log('🧪 TimeBack Connection Test\n');
console.log('Configuration:');
console.log(`  Cognito Domain: ${COGNITO_DOMAIN}`);
console.log(`  OneRoster Base: ${ONEROSTER_BASE}`);
console.log(`  QTI Base: ${QTI_BASE}`);
console.log(`  Client ID: ${CLIENT_ID ? CLIENT_ID.substring(0, 8) + '...' : 'MISSING'}`);
console.log(`  Client Secret: ${CLIENT_SECRET ? '***' + CLIENT_SECRET.substring(CLIENT_SECRET.length - 4) : 'MISSING'}\n`);

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing credentials in .env.local');
  process.exit(1);
}

async function getOAuth2Token() {
  console.log('Step 1: Requesting OAuth2 token from Cognito...');

  const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`;
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OAuth2 Error (${response.status}):`, errorText);
      return null;
    }

    const data = await response.json();
    console.log('✅ Token received');
    console.log(`   Access Token: ${data.access_token.substring(0, 20)}...`);
    console.log(`   Token Type: ${data.token_type}`);
    console.log(`   Expires In: ${data.expires_in}s\n`);

    return data.access_token;
  } catch (error) {
    console.error('❌ OAuth2 request failed:', error.message);
    return null;
  }
}

async function testOneRosterUsers(token) {
  console.log('Step 2: Testing OneRoster /users endpoint...');

  try {
    const response = await fetch(`${ONEROSTER_BASE}/ims/oneroster/rostering/v1p2/users?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OneRoster Error (${response.status}):`, errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ OneRoster /users response received\n');

    if (data.users && data.users.length > 0) {
      console.log(`Found ${data.users.length} users:\n`);
      data.users.forEach((user, idx) => {
        console.log(`User ${idx + 1}:`);
        console.log(`  sourcedId: ${user.sourcedId}`);
        console.log(`  Name: ${user.givenName} ${user.familyName}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Email: ${user.email || 'N/A'}`);
        console.log(`  Status: ${user.status}\n`);
      });

      // Check if these look like test or real students
      const names = data.users.map(u => `${u.givenName} ${u.familyName}`.toLowerCase());
      const looksLikeTest = names.some(name =>
        name.includes('test') ||
        name.includes('demo') ||
        name.includes('sample')
      );

      const hasAnanayOrEmily = names.some(name =>
        name.includes('ananya') ||
        name.includes('emily')
      );

      console.log('\n⚠️  ENVIRONMENT DETECTION:');
      if (looksLikeTest) {
        console.log('   ✅ Looks like STAGING/TEST environment (found test users)');
      } else if (hasAnanayOrEmily) {
        console.log('   🔴 Looks like PRODUCTION environment (found real student names)');
        console.log('   ⚠️  BE CAREFUL: These may be REAL students!');
      } else {
        console.log('   ❓ Cannot determine - please verify manually');
      }
    } else {
      console.log('No users found or unexpected response structure');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ OneRoster request failed:', error.message);
  }
}

async function testQTIItems(token) {
  console.log('\n─────────────────────────────────────────────────────\n');
  console.log('Step 3: Testing QTI /assessment-items endpoint...');

  try {
    const response = await fetch(`${QTI_BASE}/assessment-items?limit=3`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ QTI Error (${response.status}):`, errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ QTI /assessment-items response received\n');

    if (data.items && data.items.length > 0) {
      console.log(`Found ${data.items.length} assessment items:\n`);
      data.items.forEach((item, idx) => {
        console.log(`Item ${idx + 1}:`);
        console.log(`  ID: ${item.identifier}`);
        console.log(`  Title: ${item.title || 'N/A'}`);
        console.log(`  Type: ${item.metadata?.type || 'N/A'}`);
        console.log(`  Subject: ${item.metadata?.subject || 'N/A'}\n`);
      });
    } else {
      console.log('No items found or unexpected response structure');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ QTI request failed:', error.message);
  }
}

async function run() {
  console.log('════════════════════════════════════════════════════════\n');

  const token = await getOAuth2Token();

  if (!token) {
    console.log('\n❌ Cannot continue without valid token');
    process.exit(1);
  }

  console.log('─────────────────────────────────────────────────────\n');
  await testOneRosterUsers(token);
  await testQTIItems(token);

  console.log('\n════════════════════════════════════════════════════════');
  console.log('✅ Test complete!\n');
  console.log('Next Steps:');
  console.log('  1. Review the users above');
  console.log('  2. Verify if they are test or real students');
  console.log('  3. If PRODUCTION → Contact TimeBack for staging credentials');
  console.log('  4. If STAGING → Safe to proceed with adapter implementation');
  console.log('════════════════════════════════════════════════════════\n');
}

run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
