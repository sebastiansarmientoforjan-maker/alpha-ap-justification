/**
 * Double-check: Find ALL possible matches for each pilot student
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });

const API_KEY = process.env.MATH_ACADEMY_API_KEY;
const BASE_URL = process.env.MATH_ACADEMY_BASE_URL;

const PILOT_STUDENTS = [
  { name: 'Alex Mathew', searchTerms: ['alex', 'mathew'] },
  { name: 'Ananya Kakarlapudi', searchTerms: ['ananya', 'kakarlapudi'] },
  { name: 'Elle Liemandt', searchTerms: ['elle', 'liemandt'] },
  { name: 'Emily Smith', searchTerms: ['emily', 'smith'] },
  { name: 'Maddie Price', searchTerms: ['maddie', 'madeleine', 'price'] },
  { name: 'Sloane Price', searchTerms: ['sloane', 'price'] },
  { name: 'Sloka Vudumu', searchTerms: ['sloka', 'vudumu'] },
];

async function fetchAllStudents() {
  const response = await fetch(`${BASE_URL}/students`, {
    headers: {
      'Public-API-Key': API_KEY,
      'Accept': 'application/json',
    },
  });
  const data = await response.json();
  return data.students || data;
}

async function fetchStudentProfile(id) {
  try {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
      headers: {
        'Public-API-Key': API_KEY,
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    return data.student;
  } catch (error) {
    return null;
  }
}

function findMatches(allStudents, searchTerms) {
  const matches = [];

  for (const student of allStudents) {
    const email = (student.email || '').toLowerCase();
    const firstName = (student.firstName || '').toLowerCase();
    const lastName = (student.lastName || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();

    // Check if any search term matches
    let matchType = [];
    for (const term of searchTerms) {
      const termLower = term.toLowerCase();

      if (email.includes(termLower)) matchType.push('email');
      if (firstName.includes(termLower)) matchType.push('firstName');
      if (lastName.includes(termLower)) matchType.push('lastName');
    }

    // Special check for @alpha.school
    const isAlphaSchool = email.includes('@alpha.school');

    if (matchType.length > 0) {
      matches.push({
        id: student.id,
        email: student.email || 'NO EMAIL',
        firstName: student.firstName,
        lastName: student.lastName,
        fullName: fullName,
        matchType: matchType.join(', '),
        isAlphaSchool: isAlphaSchool,
      });
    }
  }

  return matches;
}

async function main() {
  console.log('==================================================');
  console.log('  DOUBLE-CHECK: ALL POSSIBLE MATCHES');
  console.log('==================================================\n');

  const allStudents = await fetchAllStudents();
  console.log(`✅ Loaded ${allStudents.length} students from MathAcademy\n`);

  for (const pilot of PILOT_STUDENTS) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`  SEARCHING: ${pilot.name.toUpperCase()}`);
    console.log(`  Search terms: ${pilot.searchTerms.join(', ')}`);
    console.log('='.repeat(70));

    const matches = findMatches(allStudents, pilot.searchTerms);

    if (matches.length === 0) {
      console.log(`\n❌ NO MATCHES FOUND`);
      console.log(`   Try different search terms or verify student is in MathAcademy`);
      continue;
    }

    console.log(`\n✅ Found ${matches.length} possible match(es):\n`);

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      console.log(`--- Match ${i + 1} ${match.isAlphaSchool ? '(@alpha.school ✓)' : ''} ---`);
      console.log(`   ID: ${match.id}`);
      console.log(`   Name: ${match.firstName} ${match.lastName}`);
      console.log(`   Email: ${match.email}`);
      console.log(`   Match Type: ${match.matchType}`);

      // Fetch profile for additional context
      console.log(`   Fetching profile...`);
      const profile = await fetchStudentProfile(match.id);
      if (profile) {
        console.log(`   Current Course: ${profile.currentCourse?.name || 'No course'}`);
      }
      console.log('');

      await new Promise(r => setTimeout(r, 300)); // Rate limit
    }

    // Highlight Alpha School matches
    const alphaMatches = matches.filter(m => m.isAlphaSchool);
    if (alphaMatches.length > 0 && alphaMatches.length !== matches.length) {
      console.log(`💡 Recommendation: ${alphaMatches.length} match(es) have @alpha.school email\n`);
    }
  }

  // Summary
  console.log('\n\n==================================================');
  console.log('  SUMMARY');
  console.log('==================================================\n');

  for (const pilot of PILOT_STUDENTS) {
    const matches = findMatches(allStudents, pilot.searchTerms);
    const alphaMatches = matches.filter(m => m.isAlphaSchool);

    if (matches.length === 0) {
      console.log(`❌ ${pilot.name}: NO MATCHES`);
    } else if (alphaMatches.length === 1) {
      console.log(`✅ ${pilot.name}: 1 @alpha.school match (ID: ${alphaMatches[0].id})`);
    } else if (alphaMatches.length > 1) {
      console.log(`⚠️  ${pilot.name}: ${alphaMatches.length} @alpha.school matches - NEEDS VERIFICATION`);
    } else {
      console.log(`🟡 ${pilot.name}: ${matches.length} matches (no @alpha.school) - NEEDS VERIFICATION`);
    }
  }

  console.log('\n==================================================\n');
}

main().catch(console.error);
