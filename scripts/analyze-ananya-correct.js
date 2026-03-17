/**
 * Analyze the CORRECT Ananya (ID 29185 - AP Calc BC)
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });

const API_KEY = process.env.MATH_ACADEMY_API_KEY;
const BASE_URL = process.env.MATH_ACADEMY_BASE_URL;

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

async function main() {
  console.log('==================================================');
  console.log('  ANANYA KAKARLAPUDI - CORRECT ANALYSIS');
  console.log('  ID: 29185 (AP Calculus BC)');
  console.log('==================================================\n');

  const profile = await fetchProfile('29185');

  console.log('📚 PROFILE:');
  console.log(`   Name: ${profile.firstName} ${profile.lastName}`);
  console.log(`   Course: ${profile.currentCourse?.name || 'No course'}\n`);

  // Extract XP remaining
  const courseName = profile.currentCourse?.name || '';
  const xpMatch = courseName.match(/\((\d+)\s*XP\s*remaining\)/i);
  const xpRemaining = xpMatch ? parseInt(xpMatch[1]) : null;

  if (xpRemaining) {
    console.log(`   ✅ XP Remaining: ${xpRemaining.toLocaleString()}`);
    console.log(`   📍 User said: "5,100 XP remaining"`);
    console.log(`   ${xpRemaining === 5100 ? '✅ EXACT MATCH!' : xpRemaining > 4000 && xpRemaining < 6000 ? '✅ CLOSE MATCH' : '⚠️  Different value'}\n`);
  }

  console.log('📊 LAST 4 WEEKS ACTIVITY:\n');

  const weeks = getWeeks();
  let totalXP = 0;
  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalTime = 0;

  for (const week of weeks) {
    const activity = await fetchActivity('29185', week.start, week.end);
    totalXP += activity.xpAwarded;
    totalQuestions += activity.questionsAttempted;
    totalCorrect += activity.questionsCorrect;
    totalTime += activity.timeEngaged;

    console.log(`   ${week.start}: ${activity.xpAwarded} XP, ${activity.questionsAttempted} questions, ${activity.daysActive} days`);
    await new Promise(r => setTimeout(r, 300));
  }

  const avgXP = Math.round(totalXP / 4);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0;

  console.log(`\n   Total 4 weeks: ${totalXP} XP`);
  console.log(`   Avg XP/week: ${avgXP} (target: 125)`);
  console.log(`   Overall accuracy: ${accuracy}%`);
  console.log(`   Total time: ${Math.round(totalTime)} min\n`);

  // Assessment
  console.log('🎯 ASSESSMENT:');
  if (totalXP === 0) {
    console.log('   🔴 NO ACTIVITY in last 4 weeks');
    console.log('   ⚠️  Student is enrolled but not practicing');
  } else if (avgXP < 40) {
    console.log('   🟡 LOW velocity - needs significant acceleration');
  } else if (avgXP >= 80) {
    console.log('   ✅ GOOD velocity - on track');
  }

  if (xpRemaining) {
    const weeksToComplete = Math.ceil(xpRemaining / Math.max(avgXP, 1));
    console.log(`\n   📅 Est. completion: ${weeksToComplete} weeks (at current pace)`);
    console.log(`   🗓️  May 2026 AP: ${weeksToComplete <= 8 ? '✅ Feasible' : '⚠️  Tight timeline'}`);
  }

  console.log('\n==================================================\n');
}

main().catch(console.error);
