/**
 * Analyze Pilot Students - MathAcademy API
 *
 * Comprehensive analysis of the 7 AP Justification pilot students
 * Fetches real-time data from MathAcademy API
 */

require('dotenv').config({ path: '../Documents/alpha-tracker/.env.local' });

const API_KEY = process.env.MATH_ACADEMY_API_KEY;
const BASE_URL = process.env.MATH_ACADEMY_BASE_URL;

// Pilot students to analyze
const PILOT_STUDENTS = [
  { name: 'Alex Mathew', email: 'alex' },
  { name: 'Ananya Kakarlapudi', email: 'ananya' },
  { name: 'Elle Liemandt', email: 'elle' },
  { name: 'Emily Smith', email: 'emily' },
  { name: 'Maddie Price', email: 'maddie' },
  { name: 'Sloane Price', email: 'sloane' },
  { name: 'Sloka Vudumu', email: 'sloka' },
];

/**
 * Get current week date range (Monday - Sunday)
 */
function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + daysToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    startDate: monday.toISOString().split('T')[0],
    endDate: sunday.toISOString().split('T')[0],
  };
}

/**
 * Fetch all students from MathAcademy
 */
async function fetchAllStudents() {
  console.log('[API] Fetching all students...');
  const response = await fetch(`${BASE_URL}/students`, {
    headers: {
      'Public-API-Key': API_KEY,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.students || data;
}

/**
 * Fetch student profile
 */
async function fetchStudentProfile(id) {
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    headers: {
      'Public-API-Key': API_KEY,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.student;
}

/**
 * Fetch student activity for current week
 */
async function fetchStudentActivity(id, startDate, endDate) {
  const response = await fetch(`${BASE_URL}/students/${id}/activity`, {
    headers: {
      'Public-API-Key': API_KEY,
      'Accept': 'application/json',
      'Start-Date': startDate,
      'End-Date': endDate,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const activityData = data?.activity || data;
  const totals = activityData?.totals || {};
  const tasks = activityData?.tasks || [];

  // Convert seconds to minutes
  return {
    xpAwarded: totals.xpAwarded || 0,
    questionsAttempted: totals.questions || 0,
    questionsCorrect: totals.questionsCorrect || 0,
    timeEngaged: (totals.timeEngaged || 0) / 60, // seconds to minutes
    timeProductive: (totals.timeProductive || 0) / 60,
    daysActive: totals.daysActive || 0,
    lastActivityAt: totals.lastActivityAt || null,
    tasks: tasks,
  };
}

/**
 * Calculate metrics
 */
function calculateMetrics(activity) {
  const velocityScore = (activity.xpAwarded / 125) * 100; // Target: 125 XP/week
  const accuracy = activity.questionsAttempted > 0
    ? (activity.questionsCorrect / activity.questionsAttempted) * 100
    : 0;
  const focusIntegrity = activity.timeEngaged > 0
    ? (activity.timeProductive / activity.timeEngaged) * 100
    : 0;

  return {
    velocityScore: Math.round(velocityScore),
    accuracy: Math.round(accuracy * 10) / 10,
    focusIntegrity: Math.round(focusIntegrity * 10) / 10,
  };
}

/**
 * Analyze a single student
 */
async function analyzeStudent(studentInfo, allStudents, weekDates) {
  console.log(`\n[Analyzing] ${studentInfo.name}...`);

  // Find student in MathAcademy
  const found = allStudents.filter(s => {
    const emailMatch = s.email?.toLowerCase().includes(studentInfo.email.toLowerCase());
    const nameMatch = s.firstName?.toLowerCase().includes(studentInfo.email.toLowerCase()) ||
                      s.lastName?.toLowerCase().includes(studentInfo.email.toLowerCase());
    return emailMatch || nameMatch;
  });

  if (found.length === 0) {
    return {
      name: studentInfo.name,
      status: 'NOT_FOUND',
      message: 'Student not found in MathAcademy API',
    };
  }

  if (found.length > 1) {
    console.warn(`  ⚠️  Multiple matches found for ${studentInfo.name}. Using first match.`);
  }

  const student = found[0];

  try {
    // Fetch profile and activity
    const [profile, activity] = await Promise.all([
      fetchStudentProfile(student.id),
      fetchStudentActivity(student.id, weekDates.startDate, weekDates.endDate),
    ]);

    const metrics = calculateMetrics(activity);

    // Calculate days since last activity
    let daysSinceLastActivity = 'Unknown';
    if (activity.lastActivityAt) {
      const lastDate = new Date(activity.lastActivityAt);
      const now = new Date();
      daysSinceLastActivity = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    }

    // Parse course progress from course name
    const courseName = profile.currentCourse?.name || 'No course';
    const xpMatch = courseName.match(/\((\d+)\s*XP\s*remaining\)/i);
    const xpRemaining = xpMatch ? parseInt(xpMatch[1]) : null;

    return {
      name: studentInfo.name,
      status: 'FOUND',
      id: student.id,
      email: student.email,
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        currentCourse: profile.currentCourse?.name || 'No course',
        xpRemaining: xpRemaining,
      },
      weeklyActivity: {
        xpAwarded: activity.xpAwarded,
        questionsAttempted: activity.questionsAttempted,
        questionsCorrect: activity.questionsCorrect,
        timeEngaged: Math.round(activity.timeEngaged * 10) / 10,
        timeProductive: Math.round(activity.timeProductive * 10) / 10,
        daysActive: activity.daysActive,
        daysSinceLastActivity: daysSinceLastActivity,
        tasksCompleted: activity.tasks.length,
      },
      metrics: {
        velocityScore: metrics.velocityScore,
        accuracy: metrics.accuracy,
        focusIntegrity: metrics.focusIntegrity,
      },
      assessment: generateAssessment(metrics, activity, xpRemaining, daysSinceLastActivity),
    };
  } catch (error) {
    console.error(`  ❌ Error analyzing ${studentInfo.name}:`, error.message);
    return {
      name: studentInfo.name,
      status: 'ERROR',
      message: error.message,
    };
  }
}

/**
 * Generate assessment based on metrics
 */
function generateAssessment(metrics, activity, xpRemaining, daysSinceLastActivity) {
  const issues = [];
  const strengths = [];
  let priority = 'LOW';

  // Velocity assessment
  if (metrics.velocityScore < 40) {
    issues.push('Low XP velocity (below 40% of weekly target)');
    priority = 'HIGH';
  } else if (metrics.velocityScore >= 100) {
    strengths.push('Excellent XP velocity (at or above target)');
  }

  // Accuracy assessment
  if (metrics.accuracy < 60) {
    issues.push('Low accuracy (below 60%)');
    priority = priority === 'HIGH' ? 'HIGH' : 'MEDIUM';
  } else if (metrics.accuracy >= 80) {
    strengths.push('Strong accuracy (80%+)');
  }

  // Focus assessment
  if (metrics.focusIntegrity < 70) {
    issues.push('Low focus integrity (distracted study sessions)');
  } else if (metrics.focusIntegrity >= 85) {
    strengths.push('Excellent focus (85%+ productive time)');
  }

  // Engagement assessment
  if (typeof daysSinceLastActivity === 'number' && daysSinceLastActivity >= 5) {
    issues.push(`No activity in ${daysSinceLastActivity} days`);
    priority = 'HIGH';
  } else if (activity.daysActive >= 5) {
    strengths.push(`Consistent engagement (${activity.daysActive}/7 days active)`);
  }

  // Course completion assessment
  if (xpRemaining !== null) {
    if (xpRemaining > 0 && xpRemaining < 6000) {
      const weeksToComplete = Math.ceil(xpRemaining / 125);
      issues.push(`${xpRemaining} XP remaining (~${weeksToComplete} weeks at current pace)`);
    }
  }

  return {
    priority,
    issues: issues.length > 0 ? issues : ['No major issues detected'],
    strengths: strengths.length > 0 ? strengths : ['Baseline performance'],
  };
}

/**
 * Main analysis function
 */
async function main() {
  console.log('==================================================');
  console.log('  PILOT STUDENT ANALYSIS - MATHACADEMY API');
  console.log('==================================================\n');

  const weekDates = getCurrentWeekDates();
  console.log(`📅 Analyzing week: ${weekDates.startDate} to ${weekDates.endDate}\n`);

  // Fetch all students once
  const allStudents = await fetchAllStudents();
  console.log(`✅ Loaded ${allStudents.length} students from MathAcademy\n`);

  // Analyze each pilot student
  const results = [];
  for (const pilotStudent of PILOT_STUDENTS) {
    const result = await analyzeStudent(pilotStudent, allStudents, weekDates);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }

  // Generate report
  console.log('\n\n==================================================');
  console.log('  COMPREHENSIVE ANALYSIS REPORT');
  console.log('==================================================\n');

  for (const result of results) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  ${result.name.toUpperCase()}`);
    console.log('='.repeat(60));

    if (result.status === 'NOT_FOUND') {
      console.log(`\n❌ Status: ${result.status}`);
      console.log(`   ${result.message}`);
      continue;
    }

    if (result.status === 'ERROR') {
      console.log(`\n❌ Status: ${result.status}`);
      console.log(`   Error: ${result.message}`);
      continue;
    }

    console.log(`\n✅ Status: ACTIVE`);
    console.log(`📧 Email: ${result.email}`);
    console.log(`🆔 MathAcademy ID: ${result.id}`);

    console.log(`\n📚 COURSE INFORMATION:`);
    console.log(`   Current Course: ${result.profile.currentCourse}`);
    if (result.profile.xpRemaining) {
      console.log(`   XP Remaining: ${result.profile.xpRemaining.toLocaleString()}`);
    }

    console.log(`\n📊 WEEKLY ACTIVITY (${weekDates.startDate} to ${weekDates.endDate}):`);
    console.log(`   XP Awarded: ${result.weeklyActivity.xpAwarded}`);
    console.log(`   Questions Attempted: ${result.weeklyActivity.questionsAttempted}`);
    console.log(`   Questions Correct: ${result.weeklyActivity.questionsCorrect}`);
    console.log(`   Time Engaged: ${result.weeklyActivity.timeEngaged} min`);
    console.log(`   Time Productive: ${result.weeklyActivity.timeProductive} min`);
    console.log(`   Days Active: ${result.weeklyActivity.daysActive}/7`);
    console.log(`   Tasks Completed: ${result.weeklyActivity.tasksCompleted}`);
    console.log(`   Days Since Last Activity: ${result.weeklyActivity.daysSinceLastActivity}`);

    console.log(`\n📈 PERFORMANCE METRICS:`);
    console.log(`   Velocity Score: ${result.metrics.velocityScore}/100 (target: 125 XP/week)`);
    console.log(`   Accuracy: ${result.metrics.accuracy}%`);
    console.log(`   Focus Integrity: ${result.metrics.focusIntegrity}%`);

    console.log(`\n🎯 ASSESSMENT:`);
    const priorityEmoji = result.assessment.priority === 'HIGH' ? '🔴' :
                         result.assessment.priority === 'MEDIUM' ? '🟡' : '🟢';
    console.log(`   Priority: ${priorityEmoji} ${result.assessment.priority}`);

    console.log(`\n   💪 Strengths:`);
    result.assessment.strengths.forEach(s => console.log(`      • ${s}`));

    if (result.assessment.issues[0] !== 'No major issues detected') {
      console.log(`\n   ⚠️  Issues:`);
      result.assessment.issues.forEach(i => console.log(`      • ${i}`));
    }
  }

  // Summary statistics
  console.log('\n\n==================================================');
  console.log('  COHORT SUMMARY');
  console.log('==================================================\n');

  const foundStudents = results.filter(r => r.status === 'FOUND');
  const highPriority = foundStudents.filter(r => r.assessment.priority === 'HIGH');
  const mediumPriority = foundStudents.filter(r => r.assessment.priority === 'MEDIUM');

  console.log(`Total Students: ${results.length}`);
  console.log(`Successfully Analyzed: ${foundStudents.length}`);
  console.log(`High Priority: ${highPriority.length}`);
  console.log(`Medium Priority: ${mediumPriority.length}`);

  if (foundStudents.length > 0) {
    const avgXP = Math.round(foundStudents.reduce((sum, r) => sum + r.weeklyActivity.xpAwarded, 0) / foundStudents.length);
    const avgAccuracy = Math.round(foundStudents.reduce((sum, r) => sum + r.metrics.accuracy, 0) / foundStudents.length * 10) / 10;
    const avgFocus = Math.round(foundStudents.reduce((sum, r) => sum + r.metrics.focusIntegrity, 0) / foundStudents.length * 10) / 10;

    console.log(`\nCohort Averages:`);
    console.log(`   XP/Week: ${avgXP}`);
    console.log(`   Accuracy: ${avgAccuracy}%`);
    console.log(`   Focus Integrity: ${avgFocus}%`);
  }

  if (highPriority.length > 0) {
    console.log(`\n🔴 HIGH PRIORITY STUDENTS:`);
    highPriority.forEach(s => console.log(`   • ${s.name}`));
  }

  console.log('\n==================================================');
  console.log('  Analysis complete!');
  console.log('==================================================\n');

  // Export JSON
  const fs = require('fs');
  const outputPath = './pilot-students-analysis.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed JSON report saved to: ${outputPath}\n`);
}

main().catch(console.error);
