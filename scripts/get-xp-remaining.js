/**
 * Get XP Remaining for all students
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });

const API_KEY = process.env.MATH_ACADEMY_API_KEY;
const BASE_URL = process.env.MATH_ACADEMY_BASE_URL;

const STUDENTS = [
  { name: 'Alex Mathew', id: '5440', course: 'AP Calculus BC' },
  { name: 'Ananya Kakarlapudi', id: '29185', course: 'AP Calculus BC' },
  { name: 'Elle Liemandt', id: '5437', course: 'AP Calculus BC' },
  { name: 'Emily Smith', id: '5433', course: 'Precalculus' },
  { name: 'Maddie Price', id: '5434', course: 'AP Calculus AB' },
  { name: 'Sloane Price', id: '5439', course: 'AP Calculus AB' },
  { name: 'Sloka Vudumu', id: '17295', course: 'AP Calculus AB' },
];

async function fetchProfile(id) {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    headers: { 'Public-API-Key': API_KEY, 'Accept': 'application/json' },
  });
  const data = await response.json();
  return data.student;
}

async function main() {
  console.log('==================================================');
  console.log('  XP REMAINING - ALL STUDENTS');
  console.log('==================================================\n');

  const results = [];

  for (const student of STUDENTS) {
    console.log(`[${student.name}] Fetching course info...`);

    try {
      const profile = await fetchProfile(student.id);
      const courseName = profile.currentCourse?.name || 'No course';

      // Extract XP remaining from course name
      const xpMatch = courseName.match(/\((\d+)\s*XP\s*remaining\)/i);
      const xpRemaining = xpMatch ? parseInt(xpMatch[1]) : null;

      results.push({
        name: student.name,
        id: student.id,
        expectedCourse: student.course,
        actualCourse: courseName,
        xpRemaining: xpRemaining,
        hasXP: xpRemaining !== null,
      });

      console.log(`   Course: ${courseName}`);
      if (xpRemaining) {
        console.log(`   ✅ XP Remaining: ${xpRemaining.toLocaleString()}`);
      } else {
        console.log(`   ❌ No XP data in course name`);
      }
      console.log('');

      await new Promise(r => setTimeout(r, 300));
    } catch (error) {
      console.error(`   Error: ${error.message}\n`);
      results.push({
        name: student.name,
        id: student.id,
        error: error.message,
      });
    }
  }

  // Summary table
  console.log('\n==================================================');
  console.log('  SUMMARY TABLE');
  console.log('==================================================\n');

  console.log('| Student | Expected Course | XP Remaining | Weeks to Complete @ 125 XP/wk |');
  console.log('|---------|-----------------|--------------|-------------------------------|');

  for (const r of results) {
    if (r.error) {
      console.log(`| ${r.name} | ${r.expectedCourse} | ERROR | - |`);
    } else if (r.xpRemaining) {
      const weeks = Math.ceil(r.xpRemaining / 125);
      console.log(`| ${r.name} | ${r.expectedCourse} | ${r.xpRemaining.toLocaleString()} | ${weeks} weeks |`);
    } else {
      console.log(`| ${r.name} | ${r.expectedCourse} | N/A (likely completed) | - |`);
    }
  }

  console.log('\n==================================================');
  console.log('  INTERPRETATION');
  console.log('==================================================\n');

  const withXP = results.filter(r => r.xpRemaining);
  const noXP = results.filter(r => r.hasXP === false && !r.error);

  console.log(`Students with XP remaining: ${withXP.length}`);
  withXP.forEach(s => {
    const weeks = Math.ceil(s.xpRemaining / 125);
    const mayAP = weeks <= 8 ? '✅ Possible' : '❌ Unlikely';
    console.log(`   • ${s.name}: ${s.xpRemaining.toLocaleString()} XP (~${weeks} weeks) - May 2026 AP: ${mayAP}`);
  });

  console.log(`\nStudents WITHOUT XP data: ${noXP.length}`);
  noXP.forEach(s => {
    console.log(`   • ${s.name}: Course name = "${s.actualCourse}"`);
    console.log(`     Interpretation: Likely completed course or enrolled in different version`);
  });

  console.log('\n==================================================\n');

  // Save JSON
  const fs = require('fs');
  fs.writeFileSync('./xp-remaining-data.json', JSON.stringify(results, null, 2));
  console.log('📄 Data saved to: xp-remaining-data.json\n');
}

main().catch(console.error);
