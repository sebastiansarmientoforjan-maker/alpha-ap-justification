/**
 * Find AP Math Students in TimeBack
 *
 * Search for the 7 specific students we need for the course
 */

require('dotenv').config({ path: '.env.local' });

const CLIENT_ID = process.env.TIMEBACK_CLIENT_ID;
const CLIENT_SECRET = process.env.TIMEBACK_CLIENT_SECRET;
const COGNITO_DOMAIN = process.env.TIMEBACK_COGNITO_DOMAIN;
const ONEROSTER_BASE = process.env.TIMEBACK_API_BASE_URL;

const TARGET_STUDENTS = [
  { firstName: 'Ananya', lastName: 'Kakarlapudi', course: 'AP Calc BC' },
  { firstName: 'Emily', lastName: 'Smith', course: 'Precalculus' },
  { firstName: 'Alex', lastName: 'Mathew', course: 'AP Calc BC' },
  { firstName: 'Sloka', lastName: 'Vudumu', course: 'AP Calc AB' },
  { firstName: 'Elle', lastName: 'Liemandt', course: 'AP Calc BC' },
  { firstName: 'Maddie', lastName: 'Price', course: 'AP Calc AB' },
  { firstName: 'Sloane', lastName: 'Price', course: 'AP Calc AB' }
];

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

async function searchUsers(token, searchTerm) {
  try {
    const response = await fetch(
      `${ONEROSTER_BASE}/ims/oneroster/rostering/v1p2/users?search=${encodeURIComponent(searchTerm)}&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error(`Error searching for "${searchTerm}":`, error.message);
    return [];
  }
}

async function run() {
  console.log('🔍 Searching for AP Math Students in TimeBack\n');
  console.log('════════════════════════════════════════════════════════\n');

  const token = await getOAuth2Token();
  console.log('✅ Authenticated\n');

  const results = [];

  for (const student of TARGET_STUDENTS) {
    console.log(`Searching for ${student.firstName} ${student.lastName}...`);

    // Search by last name
    const matches = await searchUsers(token, student.lastName);

    const found = matches.find(user =>
      user.givenName?.toLowerCase().includes(student.firstName.toLowerCase()) &&
      user.familyName?.toLowerCase().includes(student.lastName.toLowerCase())
    );

    if (found) {
      console.log(`  ✅ FOUND!`);
      console.log(`     sourcedId: ${found.sourcedId}`);
      console.log(`     Email: ${found.email || 'N/A'}`);
      console.log(`     Status: ${found.status}\n`);

      results.push({
        ...student,
        sourcedId: found.sourcedId,
        email: found.email,
        status: found.status
      });
    } else {
      console.log(`  ❌ NOT FOUND in TimeBack\n`);
      results.push({
        ...student,
        sourcedId: null,
        email: null,
        status: 'not found'
      });
    }
  }

  console.log('════════════════════════════════════════════════════════\n');
  console.log('📊 RESULTS SUMMARY:\n');

  const found = results.filter(r => r.sourcedId);
  const notFound = results.filter(r => !r.sourcedId);

  console.log(`✅ Found: ${found.length}/${TARGET_STUDENTS.length} students\n`);

  if (found.length > 0) {
    console.log('Students found in TimeBack:');
    found.forEach(s => {
      console.log(`  - ${s.firstName} ${s.lastName}`);
      console.log(`    sourcedId: ${s.sourcedId}`);
      console.log(`    Course: ${s.course}\n`);
    });
  }

  if (notFound.length > 0) {
    console.log('❌ Students NOT found in TimeBack:');
    notFound.forEach(s => {
      console.log(`  - ${s.firstName} ${s.lastName} (${s.course})`);
    });
    console.log();
  }

  console.log('════════════════════════════════════════════════════════\n');

  if (found.length === TARGET_STUDENTS.length) {
    console.log('🎉 All students found! Ready to proceed.');
    console.log('\n⚠️  IMPORTANT: These are REAL students in PRODUCTION.');
    console.log('    Only activate TimeBack adapter when ready to go live.\n');
  } else {
    console.log('⚠️  Some students not found. Possible reasons:');
    console.log('   - Different name spelling in TimeBack');
    console.log('   - Students not yet enrolled');
    console.log('   - Need to search in different class/org\n');
  }
}

run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
