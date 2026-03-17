/**
 * Historical Analysis - Pilot Students
 * Gets last 30 days of activity for comprehensive view
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });

const API_KEY = process.env.MATH_ACADEMY_API_KEY;
const BASE_URL = process.env.MATH_ACADEMY_BASE_URL;

// Pilot students with Alpha School emails
const PILOT_STUDENTS = [
  { name: 'Alex Mathew', searchTerm: 'alex', expectedCourse: 'BC' },
  { name: 'Ananya Kakarlapudi', searchTerm: 'ananya', expectedCourse: 'BC' },
  { name: 'Elle Liemandt', searchTerm: 'elle', expectedCourse: 'BC' },
  { name: 'Emily Smith', searchTerm: 'emily', expectedCourse: 'Precalc/AB' },
  { name: 'Maddie Price', searchTerm: 'maddie', expectedCourse: 'AB' },
  { name: 'Sloane Price', searchTerm: 'sloane', expectedCourse: 'AB' },
  { name: 'Sloka Vudumu', searchTerm: 'sloka', expectedCourse: 'AB' },
];

/**
 * Get date ranges for last 4 weeks
 */
function getLast4Weeks() {
  const weeks = [];
  const now = new Date();

  for (let i = 0; i < 4; i++) {
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - (i * 7));
    const dayOfWeek = weekEnd.getDay();
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    weekEnd.setDate(weekEnd.getDate() + daysToSunday);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    weeks.push({
      start: weekStart.toISOString().split('T')[0],
      end: weekEnd.toISOString().split('T')[0],
      label: `Week ${4 - i} (${weekStart.toISOString().split('T')[0]})`,
    });
  }

  return weeks.reverse();
}

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
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    headers: {
      'Public-API-Key': API_KEY,
      'Accept': 'application/json',
    },
  });
  const data = await response.json();
  return data.student;
}

async function fetchStudentActivity(id, startDate, endDate) {
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
    lastActivityAt: totals.lastActivityAt || null,
  };
}

async function analyzeStudentHistorical(studentInfo, allStudents) {
  console.log(`\n[Analyzing] ${studentInfo.name}...`);

  // Find student - look for @alpha.school email or name match
  const found = allStudents.filter(s => {
    if (s.email?.includes('@alpha.school')) {
      const emailName = s.email.split('@')[0].toLowerCase();
      return emailName.includes(studentInfo.searchTerm.toLowerCase());
    }
    const nameMatch = s.firstName?.toLowerCase().includes(studentInfo.searchTerm.toLowerCase());
    return nameMatch;
  });

  if (found.length === 0) {
    return { name: studentInfo.name, status: 'NOT_FOUND' };
  }

  // Prefer @alpha.school email if multiple matches
  let student = found[0];
  const alphaStudent = found.find(s => s.email?.includes('@alpha.school'));
  if (alphaStudent) {
    student = alphaStudent;
  }

  try {
    // Get profile
    const profile = await fetchStudentProfile(student.id);

    // Get last 4 weeks of activity
    const weeks = getLast4Weeks();
    const weeklyData = [];

    for (const week of weeks) {
      const activity = await fetchStudentActivity(student.id, week.start, week.end);
      weeklyData.push({
        label: week.label,
        ...activity,
      });
      await new Promise(r => setTimeout(r, 300)); // Rate limit
    }

    // Calculate totals
    const totalXP = weeklyData.reduce((sum, w) => sum + w.xpAwarded, 0);
    const totalQuestions = weeklyData.reduce((sum, w) => sum + w.questionsAttempted, 0);
    const totalCorrect = weeklyData.reduce((sum, w) => sum + w.questionsCorrect, 0);
    const totalTimeEngaged = weeklyData.reduce((sum, w) => sum + w.timeEngaged, 0);
    const totalTimeProductive = weeklyData.reduce((sum, w) => sum + w.timeProductive, 0);
    const totalDaysActive = weeklyData.reduce((sum, w) => sum + w.daysActive, 0);

    const avgXPPerWeek = Math.round(totalXP / 4);
    const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions * 100) : 0;
    const overallFocus = totalTimeEngaged > 0 ? (totalTimeProductive / totalTimeEngaged * 100) : 0;

    // Extract XP remaining from course name
    const courseName = profile.currentCourse?.name || '';
    const xpMatch = courseName.match(/\((\d+)\s*XP\s*remaining\)/i);
    const xpRemaining = xpMatch ? parseInt(xpMatch[1]) : null;

    // Calculate weeks to completion
    let weeksToComplete = null;
    if (xpRemaining && avgXPPerWeek > 0) {
      weeksToComplete = Math.ceil(xpRemaining / avgXPPerWeek);
    }

    return {
      name: studentInfo.name,
      status: 'FOUND',
      id: student.id,
      email: student.email,
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        currentCourse: courseName,
        xpRemaining: xpRemaining,
      },
      last4Weeks: {
        totalXP,
        avgXPPerWeek,
        totalQuestions,
        totalCorrect,
        overallAccuracy: Math.round(overallAccuracy * 10) / 10,
        totalTimeEngaged: Math.round(totalTimeEngaged * 10) / 10,
        totalTimeProductive: Math.round(totalTimeProductive * 10) / 10,
        overallFocus: Math.round(overallFocus * 10) / 10,
        totalDaysActive,
        weeksToComplete,
      },
      weeklyBreakdown: weeklyData,
    };
  } catch (error) {
    console.error(`  ❌ Error:`, error.message);
    return {
      name: studentInfo.name,
      status: 'ERROR',
      message: error.message,
    };
  }
}

async function main() {
  console.log('==================================================');
  console.log('  HISTORICAL ANALYSIS - LAST 4 WEEKS');
  console.log('==================================================\n');

  const allStudents = await fetchAllStudents();
  console.log(`✅ Loaded ${allStudents.length} students\n`);

  const results = [];
  for (const pilot of PILOT_STUDENTS) {
    const result = await analyzeStudentHistorical(pilot, allStudents);
    results.push(result);
    await new Promise(r => setTimeout(r, 500));
  }

  // Generate report
  console.log('\n\n==================================================');
  console.log('  DETAILED REPORT');
  console.log('==================================================\n');

  for (const r of results) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`  ${r.name.toUpperCase()}`);
    console.log('='.repeat(70));

    if (r.status !== 'FOUND') {
      console.log(`\n❌ Status: ${r.status}`);
      if (r.message) console.log(`   ${r.message}`);
      continue;
    }

    console.log(`\n✅ Status: ACTIVE`);
    console.log(`📧 Email: ${r.email}`);
    console.log(`🆔 MathAcademy ID: ${r.id}`);

    console.log(`\n📚 CURRENT COURSE:`);
    console.log(`   ${r.profile.currentCourse}`);
    if (r.profile.xpRemaining) {
      console.log(`   📊 XP Remaining: ${r.profile.xpRemaining.toLocaleString()}`);
      if (r.last4Weeks.weeksToComplete) {
        console.log(`   ⏱️  Est. Completion: ${r.last4Weeks.weeksToComplete} weeks (at current pace)`);
      }
    }

    console.log(`\n📊 LAST 4 WEEKS SUMMARY:`);
    console.log(`   Total XP: ${r.last4Weeks.totalXP}`);
    console.log(`   Avg XP/Week: ${r.last4Weeks.avgXPPerWeek} (target: 125)`);
    console.log(`   Total Questions: ${r.last4Weeks.totalQuestions} (${r.last4Weeks.totalCorrect} correct)`);
    console.log(`   Overall Accuracy: ${r.last4Weeks.overallAccuracy}%`);
    console.log(`   Total Time Engaged: ${r.last4Weeks.totalTimeEngaged} min`);
    console.log(`   Overall Focus: ${r.last4Weeks.overallFocus}%`);
    console.log(`   Days Active: ${r.last4Weeks.totalDaysActive}/28 days`);

    console.log(`\n📈 WEEKLY BREAKDOWN:`);
    r.weeklyBreakdown.forEach(w => {
      console.log(`   ${w.label}:`);
      console.log(`      XP: ${w.xpAwarded}, Questions: ${w.questionsAttempted}/${w.questionsCorrect}, Days: ${w.daysActive}/7`);
    });

    // Assessment
    const velocity = (r.last4Weeks.avgXPPerWeek / 125) * 100;
    const accuracy = r.last4Weeks.overallAccuracy;
    const focus = r.last4Weeks.overallFocus;

    console.log(`\n🎯 ASSESSMENT:`);
    if (velocity < 40) {
      console.log(`   ⚠️  Low velocity (${Math.round(velocity)}% of target)`);
    } else if (velocity >= 80) {
      console.log(`   ✅ Strong velocity (${Math.round(velocity)}% of target)`);
    } else {
      console.log(`   🟡 Moderate velocity (${Math.round(velocity)}% of target)`);
    }

    if (accuracy < 70) {
      console.log(`   ⚠️  Low accuracy (${accuracy}%)`);
    } else if (accuracy >= 85) {
      console.log(`   ✅ Excellent accuracy (${accuracy}%)`);
    } else {
      console.log(`   🟡 Good accuracy (${accuracy}%)`);
    }

    if (focus < 70) {
      console.log(`   ⚠️  Low focus integrity (${focus}%)`);
    } else if (focus >= 85) {
      console.log(`   ✅ Excellent focus (${focus}%)`);
    } else {
      console.log(`   🟡 Good focus (${focus}%)`);
    }

    // Specific recommendations
    console.log(`\n💡 RECOMMENDATIONS:`);
    if (r.profile.xpRemaining && r.profile.xpRemaining > 5000 && velocity < 60) {
      console.log(`   • Increase pace significantly (${r.profile.xpRemaining} XP left, ~${r.last4Weeks.weeksToComplete} weeks at current rate)`);
    }
    if (accuracy < 75) {
      console.log(`   • Focus on accuracy over speed - review prerequisite concepts`);
    }
    if (r.last4Weeks.totalDaysActive < 14) {
      console.log(`   • Increase consistency - aim for 5+ days/week`);
    }
    if (r.last4Weeks.totalXP < 50) {
      console.log(`   • 🔴 CRITICAL: Nearly zero engagement - immediate intervention needed`);
    }
  }

  // Cohort summary
  console.log('\n\n==================================================');
  console.log('  COHORT SUMMARY');
  console.log('==================================================\n');

  const found = results.filter(r => r.status === 'FOUND');
  const avgXP = Math.round(found.reduce((sum, r) => sum + r.last4Weeks.avgXPPerWeek, 0) / found.length);
  const avgAccuracy = Math.round(found.reduce((sum, r) => sum + r.last4Weeks.overallAccuracy, 0) / found.length * 10) / 10;

  console.log(`Students Analyzed: ${found.length}/${results.length}`);
  console.log(`Cohort Avg XP/Week: ${avgXP} (target: 125)`);
  console.log(`Cohort Avg Accuracy: ${avgAccuracy}%`);

  const lowEngagement = found.filter(r => r.last4Weeks.totalXP < 200);
  if (lowEngagement.length > 0) {
    console.log(`\n🔴 LOW ENGAGEMENT (< 200 XP in 4 weeks):`);
    lowEngagement.forEach(s => console.log(`   • ${s.name}`));
  }

  const highXP = found.filter(r => r.profile.xpRemaining && r.profile.xpRemaining > 5000);
  if (highXP.length > 0) {
    console.log(`\n⏰ HIGH XP REMAINING (> 5000):`);
    highXP.forEach(s => console.log(`   • ${s.name}: ${s.profile.xpRemaining} XP (${s.last4Weeks.weeksToComplete} weeks)`));
  }

  console.log('\n==================================================\n');

  // Save JSON
  const fs = require('fs');
  fs.writeFileSync('./pilot-students-historical.json', JSON.stringify(results, null, 2));
  console.log(`📄 Report saved to: pilot-students-historical.json\n`);
}

main().catch(console.error);
