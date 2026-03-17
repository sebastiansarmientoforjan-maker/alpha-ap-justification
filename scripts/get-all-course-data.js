/**
 * Get COMPLETE course data including xpRemaining for all students
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });

const API_KEY = process.env.MATH_ACADEMY_API_KEY;
const BASE_URL = process.env.MATH_ACADEMY_BASE_URL;

const STUDENTS = [
  { name: 'Alex Mathew', id: '5440' },
  { name: 'Ananya Kakarlapudi', id: '29185' },
  { name: 'Elle Liemandt', id: '5437' },
  { name: 'Emily Smith', id: '5433' },
  { name: 'Maddie Price', id: '5434' },
  { name: 'Sloane Price', id: '5439' },
  { name: 'Sloka Vudumu', id: '17295' },
];

async function main() {
  console.log('==================================================');
  console.log('  COMPLETE COURSE DATA - ALL STUDENTS');
  console.log('==================================================\n');

  const results = [];

  for (const student of STUDENTS) {
    console.log(`\n[${student.name}]`);

    try {
      const response = await fetch(`${BASE_URL}/students/${student.id}`, {
        headers: { 'Public-API-Key': API_KEY, 'Accept': 'application/json' },
      });

      const data = await response.json();
      const profile = data.student;
      const course = profile.currentCourse || {};

      const result = {
        name: student.name,
        id: student.id,
        courseName: course.name || 'No course',
        progress: course.progress ? Math.round(course.progress * 1000) / 10 : 0,
        xpRemaining: course.xpRemaining || 0,
        grade: course.grade ? Math.round(course.grade * 1000) / 10 : 0,
        letterGrade: course.letterGrade || 'N/A',
        completed: course.completed || null,
      };

      results.push(result);

      console.log(`  Course: ${result.courseName}`);
      console.log(`  Progress: ${result.progress}%`);
      console.log(`  XP Remaining: ${result.xpRemaining.toLocaleString()}`);
      console.log(`  Grade: ${result.grade}% (${result.letterGrade})`);
      if (result.completed) {
        console.log(`  ✅ Completed: ${result.completed}`);
      }

      await new Promise(r => setTimeout(r, 300));
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.push({ name: student.name, id: student.id, error: error.message });
    }
  }

  // Summary table
  console.log('\n\n==================================================');
  console.log('  SUMMARY TABLE');
  console.log('==================================================\n');

  console.log('| Student | Course | Progress | XP Left | Grade | Weeks @ 125 XP/wk |');
  console.log('|---------|--------|----------|---------|-------|-------------------|');

  for (const r of results) {
    if (r.error) {
      console.log(`| ${r.name} | ERROR | - | - | - | - |`);
    } else {
      const weeks = r.xpRemaining > 0 ? Math.ceil(r.xpRemaining / 125) : 0;
      const weeksStr = weeks > 0 ? `${weeks} weeks` : 'Done';
      console.log(`| ${r.name} | ${r.courseName} | ${r.progress}% | ${r.xpRemaining.toLocaleString()} | ${r.letterGrade} | ${weeksStr} |`);
    }
  }

  // Analysis
  console.log('\n\n==================================================');
  console.log('  ANALYSIS & RECOMMENDATIONS');
  console.log('==================================================\n');

  const nearCompletion = results.filter(r => r.xpRemaining > 0 && r.xpRemaining < 500);
  const inProgress = results.filter(r => r.xpRemaining >= 500 && r.xpRemaining < 3000);
  const longWay = results.filter(r => r.xpRemaining >= 3000);
  const completed = results.filter(r => r.xpRemaining === 0);

  if (nearCompletion.length > 0) {
    console.log('🟢 NEAR COMPLETION (<500 XP):');
    nearCompletion.forEach(s => {
      const days = Math.ceil(s.xpRemaining / (s.name === 'Emily Smith' ? 232 : 125) * 7);
      console.log(`   • ${s.name}: ${s.xpRemaining} XP in ${s.courseName} (~${days} days)`);
    });
    console.log('');
  }

  if (inProgress.length > 0) {
    console.log('🟡 IN PROGRESS (500-3000 XP):');
    inProgress.forEach(s => {
      const weeks = Math.ceil(s.xpRemaining / 125);
      const mayAP = weeks <= 8 ? '✅ May 2026 possible' : '❌ May 2027 target';
      console.log(`   • ${s.name}: ${s.xpRemaining.toLocaleString()} XP in ${s.courseName} (~${weeks} weeks) - ${mayAP}`);
    });
    console.log('');
  }

  if (longWay.length > 0) {
    console.log('🔴 LONG WAY (>3000 XP):');
    longWay.forEach(s => {
      const weeks = Math.ceil(s.xpRemaining / 125);
      const months = Math.round(weeks / 4.3);
      console.log(`   • ${s.name}: ${s.xpRemaining.toLocaleString()} XP in ${s.courseName} (~${weeks} weeks / ${months} months) - Target May 2027`);
    });
    console.log('');
  }

  if (completed.length > 0) {
    console.log('✅ COMPLETED (0 XP):');
    completed.forEach(s => {
      console.log(`   • ${s.name}: ${s.courseName} completed (${s.grade}% grade)`);
    });
    console.log('');
  }

  console.log('==================================================\n');

  // Save JSON
  const fs = require('fs');
  fs.writeFileSync('./complete-course-data.json', JSON.stringify(results, null, 2));
  console.log('📄 Data saved to: complete-course-data.json\n');
}

main().catch(console.error);
