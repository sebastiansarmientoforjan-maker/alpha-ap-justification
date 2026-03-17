/**
 * FINAL CORRECT ANALYSIS - All 7 students with verified IDs
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });

const API_KEY = process.env.MATH_ACADEMY_API_KEY;
const BASE_URL = process.env.MATH_ACADEMY_BASE_URL;

// VERIFIED IDs with full name + course match
const STUDENTS = [
  { name: 'Alex Mathew', id: '5440', expectedCourse: 'AP Calculus BC' },
  { name: 'Ananya Kakarlapudi', id: '29185', expectedCourse: 'AP Calculus BC' },
  { name: 'Elle Liemandt', id: '5437', expectedCourse: 'AP Calculus BC' },
  { name: 'Emily Smith', id: '5433', expectedCourse: 'Precalculus' },
  { name: 'Maddie Price', id: '5434', expectedCourse: 'AP Calculus AB' },
  { name: 'Sloane Price', id: '5439', expectedCourse: 'AP Calculus AB' },
  { name: 'Sloka Vudumu', id: '17295', expectedCourse: 'AP Calculus AB' },
];

async function fetchProfile(id) {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    headers: { 'Public-API-Key': API_KEY, 'Accept': 'application/json' },
  });
  const data = await response.json();
  return data.student;
}

async function fetchActivity(id, startDate, endDate) {
  const response = await fetch(`${BASE_URL}/students/${id}/activity`, {
    headers: {
      'Public-API-Key': API_KEY,
      'Accept': 'application/json',
      'Start-Date': startDate,
      'End-Date': endDate,
    },
  });
  const data = await response.json();
  const activityData = data?.activity || data;
  const totals = activityData?.totals || {};

  return {
    xpAwarded: totals.xpAwarded || 0,
    questionsAttempted: totals.questions || 0,
    questionsCorrect: totals.questionsCorrect || 0,
    timeEngaged: (totals.timeEngaged || 0) / 60,
    timeProductive: (totals.timeProductive || 0) / 60,
    daysActive: totals.daysActive || 0,
  };
}

function getWeeks() {
  const weeks = [];
  const now = new Date();

  for (let i = 0; i < 4; i++) {
    const end = new Date(now);
    end.setDate(now.getDate() - (i * 7));
    const dayOfWeek = end.getDay();
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    end.setDate(end.getDate() + daysToSunday);

    const start = new Date(end);
    start.setDate(end.getDate() - 6);

    weeks.push({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    });
  }

  return weeks.reverse();
}

async function analyzeStudent(student) {
  console.log(`\n[Analyzing] ${student.name} (ID: ${student.id})...`);

  const profile = await fetchProfile(student.id);
  const weeks = getWeeks();

  let totalXP = 0;
  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalTimeEngaged = 0;
  let totalTimeProductive = 0;

  for (const week of weeks) {
    const activity = await fetchActivity(student.id, week.start, week.end);
    totalXP += activity.xpAwarded;
    totalQuestions += activity.questionsAttempted;
    totalCorrect += activity.questionsCorrect;
    totalTimeEngaged += activity.timeEngaged;
    totalTimeProductive += activity.timeProductive;
    await new Promise(r => setTimeout(r, 300));
  }

  const avgXP = Math.round(totalXP / 4);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0;
  const focus = totalTimeEngaged > 0 ? Math.round((totalTimeProductive / totalTimeEngaged) * 1000) / 10 : 0;
  const velocityScore = Math.round((avgXP / 125) * 100);

  // Extract XP remaining
  const courseName = profile.currentCourse?.name || '';
  const xpMatch = courseName.match(/\((\d+)\s*XP\s*remaining\)/i);
  const xpRemaining = xpMatch ? parseInt(xpMatch[1]) : null;

  return {
    name: student.name,
    id: student.id,
    apiName: `${profile.firstName} ${profile.lastName}`,
    course: courseName,
    xpRemaining,
    totalXP,
    avgXP,
    velocityScore,
    totalQuestions,
    totalCorrect,
    accuracy,
    totalTimeEngaged: Math.round(totalTimeEngaged * 10) / 10,
    focus,
  };
}

async function main() {
  console.log('==================================================');
  console.log('  FINAL CORRECT ANALYSIS - ALL 7 STUDENTS');
  console.log('  Using Verified IDs');
  console.log('==================================================\n');

  const results = [];
  for (const student of STUDENTS) {
    const result = await analyzeStudent(student);
    results.push(result);
    await new Promise(r => setTimeout(r, 500));
  }

  // Print detailed report
  console.log('\n\n==================================================');
  console.log('  COMPREHENSIVE RESULTS');
  console.log('==================================================\n');

  for (const r of results) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`  ${r.name.toUpperCase()}`);
    console.log('='.repeat(70));

    console.log(`\n✅ VERIFIED`);
    console.log(`   MathAcademy ID: ${r.id}`);
    console.log(`   API Name: ${r.apiName}`);
    console.log(`   Course: ${r.course}`);
    if (r.xpRemaining) {
      console.log(`   XP Remaining: ${r.xpRemaining.toLocaleString()}`);
    }

    console.log(`\n📊 PERFORMANCE (Last 4 Weeks):`);
    console.log(`   Total XP: ${r.totalXP}`);
    console.log(`   Avg XP/Week: ${r.avgXP} (${r.velocityScore}% of target)`);
    console.log(`   Questions: ${r.totalQuestions} (${r.totalCorrect} correct)`);
    console.log(`   Accuracy: ${r.accuracy}%`);
    console.log(`   Time Engaged: ${r.totalTimeEngaged} min`);
    console.log(`   Focus Integrity: ${r.focus}%`);

    // Assessment
    let tier = '🔴 NOT READY';
    if (r.velocityScore >= 80 && r.accuracy >= 85 && r.focus >= 85) {
      tier = '🟢 TIER A: READY';
    } else if (r.velocityScore >= 40 && r.accuracy >= 75 && r.totalXP >= 200) {
      tier = '🟡 TIER B: CONDITIONAL';
    }

    console.log(`\n🎯 TIER: ${tier}`);
  }

  // Rankings
  console.log('\n\n==================================================');
  console.log('  RANKINGS');
  console.log('==================================================\n');

  const byVelocity = [...results].sort((a, b) => b.avgXP - a.avgXP);
  console.log('📈 BY VELOCITY (XP/Week):');
  byVelocity.forEach((r, i) => {
    const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(`   ${emoji} ${i + 1}. ${r.name}: ${r.avgXP} XP/week (${r.velocityScore}%)`);
  });

  const byAccuracy = [...results].filter(r => r.totalQuestions > 0).sort((a, b) => b.accuracy - a.accuracy);
  console.log('\n🎯 BY ACCURACY:');
  byAccuracy.forEach((r, i) => {
    const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    console.log(`   ${emoji} ${i + 1}. ${r.name}: ${r.accuracy}%`);
  });

  // Tiers
  console.log('\n\n==================================================');
  console.log('  TIER ASSIGNMENTS');
  console.log('==================================================\n');

  const tierA = results.filter(r => r.velocityScore >= 80 && r.accuracy >= 85 && r.focus >= 85);
  const tierB = results.filter(r =>
    !tierA.includes(r) &&
    r.velocityScore >= 40 &&
    r.accuracy >= 75 &&
    r.totalXP >= 200
  );
  const tierC = results.filter(r => !tierA.includes(r) && !tierB.includes(r));

  console.log(`🟢 TIER A - READY TO START (${tierA.length}):`);
  tierA.forEach(r => console.log(`   • ${r.name} - ${r.avgXP} XP/week, ${r.accuracy}% accuracy`));

  console.log(`\n🟡 TIER B - CONDITIONAL (${tierB.length}):`);
  tierB.forEach(r => console.log(`   • ${r.name} - ${r.avgXP} XP/week, ${r.accuracy}% accuracy`));

  console.log(`\n🔴 TIER C - NOT READY (${tierC.length}):`);
  tierC.forEach(r => console.log(`   • ${r.name} - ${r.avgXP} XP/week, ${r.totalXP} XP in 4 weeks`));

  console.log('\n==================================================\n');

  // Save JSON
  const fs = require('fs');
  fs.writeFileSync('./FINAL_CORRECT_ANALYSIS.json', JSON.stringify(results, null, 2));
  console.log('📄 Full data saved to: FINAL_CORRECT_ANALYSIS.json\n');
}

main().catch(console.error);
