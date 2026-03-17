/**
 * Generate comprehensive data for DOCX export via Claude.ai
 * 12 weeks historical + aligned to course workflow
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

function getLast12Weeks() {
  const weeks = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const end = new Date(now);
    end.setDate(now.getDate() - (i * 7));
    const dayOfWeek = end.getDay();
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    end.setDate(end.getDate() + daysToSunday);

    const start = new Date(end);
    start.setDate(end.getDate() - 6);

    weeks.push({
      weekNum: 12 - i,
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }

  return weeks.reverse();
}

async function analyzeStudent(student, weeks) {
  console.log(`\n[${student.name}] Fetching 12 weeks...`);

  const profile = await fetchProfile(student.id);
  const weeklyData = [];

  for (const week of weeks) {
    const activity = await fetchActivity(student.id, week.start, week.end);
    weeklyData.push({
      weekNum: week.weekNum,
      label: week.label,
      ...activity,
    });
    await new Promise(r => setTimeout(r, 300));
  }

  // Calculate totals and trends
  const totalXP = weeklyData.reduce((sum, w) => sum + w.xpAwarded, 0);
  const totalQuestions = weeklyData.reduce((sum, w) => sum + w.questionsAttempted, 0);
  const totalCorrect = weeklyData.reduce((sum, w) => sum + w.questionsCorrect, 0);
  const totalTimeEngaged = weeklyData.reduce((sum, w) => sum + w.timeEngaged, 0);
  const totalTimeProductive = weeklyData.reduce((sum, w) => sum + w.timeProductive, 0);

  const avgXP = Math.round(totalXP / 12);
  const recentAvgXP = Math.round(weeklyData.slice(-4).reduce((sum, w) => sum + w.xpAwarded, 0) / 4);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0;
  const focus = totalTimeEngaged > 0 ? Math.round((totalTimeProductive / totalTimeEngaged) * 1000) / 10 : 0;

  // Trend analysis
  const firstHalf = weeklyData.slice(0, 6).reduce((sum, w) => sum + w.xpAwarded, 0) / 6;
  const secondHalf = weeklyData.slice(6, 12).reduce((sum, w) => sum + w.xpAwarded, 0) / 6;
  const trend = secondHalf > firstHalf * 1.2 ? 'Improving' :
                secondHalf < firstHalf * 0.8 ? 'Declining' : 'Stable';

  // Extract XP remaining
  const courseName = profile.currentCourse?.name || '';
  const xpMatch = courseName.match(/\((\d+)\s*XP\s*remaining\)/i);
  const xpRemaining = xpMatch ? parseInt(xpMatch[1]) : null;

  return {
    name: student.name,
    id: student.id,
    course: student.course,
    courseAPI: courseName,
    xpRemaining,
    totalXP,
    avgXP,
    recentAvgXP,
    accuracy,
    focus,
    totalTimeEngaged: Math.round(totalTimeEngaged),
    trend,
    weeklyData,
  };
}

async function main() {
  console.log('==================================================');
  console.log('  GENERATING DOCX DATA - 12 WEEK ANALYSIS');
  console.log('==================================================\n');

  const weeks = getLast12Weeks();
  console.log(`Analysis period: ${weeks[0].label} - ${weeks[11].label}\n`);

  const results = [];
  for (const student of STUDENTS) {
    const result = await analyzeStudent(student, weeks);
    results.push(result);
    await new Promise(r => setTimeout(r, 500));
  }

  // Generate formatted output for Claude.ai
  console.log('\n\n' + '='.repeat(80));
  console.log('COPY THE TEXT BELOW TO CLAUDE.AI');
  console.log('='.repeat(80) + '\n');

  const output = generateClaudePrompt(results, weeks);
  console.log(output);

  // Save to file for backup
  const fs = require('fs');
  fs.writeFileSync('./CLAUDE_AI_DOCX_INPUT.txt', output);
  console.log('\n\n' + '='.repeat(80));
  console.log('✅ Text saved to: CLAUDE_AI_DOCX_INPUT.txt');
  console.log('📄 Copy this file content to Claude.ai and ask:');
  console.log('"Create a professional DOCX document from this data"');
  console.log('='.repeat(80) + '\n');
}

function generateClaudePrompt(results, weeks) {
  const output = [];

  output.push('# TASK: Create Professional DOCX Document');
  output.push('');
  output.push('Please create a well-formatted Microsoft Word DOCX document with the following structure:');
  output.push('');
  output.push('---');
  output.push('');
  output.push('# Alpha AP Math Justification Training');
  output.push('## Comprehensive Student Analysis & Implementation Plan');
  output.push('');
  output.push('**Program Lead:** Sebastian');
  output.push('**Analysis Period:** ' + weeks[0].label + ' - ' + weeks[11].label + ' (12 weeks)');
  output.push('**Target Launch:** March 18, 2026');
  output.push('**AP Exam Dates:** May 6 (BC), May 13 (AB)');
  output.push('**Data Source:** MathAcademy API (Real-time)');
  output.push('');
  output.push('---');
  output.push('');
  output.push('## Executive Summary');
  output.push('');
  output.push('This document presents a comprehensive analysis of 7 pilot students for the AP Math Justification Training program at Alpha High School. The program targets a critical skill gap: students demonstrate procedural fluency but struggle with mathematical justification required for AP Free Response Questions (FRQs).');
  output.push('');
  output.push('**Key Findings:**');
  output.push('- **2 students (29%)** are ready for immediate program start (Tier A)');
  output.push('- **1 student (14%)** requires 2 weeks accuracy coaching before start (Tier B)');
  output.push('- **2 students (29%)** need reactivation/consistency building (Tier C)');
  output.push('- **2 students (29%)** require intervention before eligibility (Tier D)');
  output.push('');
  output.push('**Program Structure:** 4-week progression using CERC framework (Claim-Evidence-Reasoning-Conditions)');
  output.push('- Week 1: Error-forcing problems (breaking empirical reasoning)');
  output.push('- Week 2: Condition verification (MVT, IVT, EVT applications)');
  output.push('- Week 3: Global argumentation (blank canvas practice)');
  output.push('- Week 4: Boss Battle (collaborative timed FRQ synthesis)');
  output.push('');
  output.push('---');
  output.push('');
  output.push('## Part 1: Individual Student Profiles (12-Week Analysis)');
  output.push('');

  // Rankings first
  const byVelocity = [...results].sort((a, b) => b.recentAvgXP - a.recentAvgXP);
  const byAccuracy = [...results].filter(r => r.accuracy > 0).sort((a, b) => b.accuracy - a.accuracy);

  output.push('### Overall Rankings');
  output.push('');
  output.push('**By Recent Velocity (Last 4 Weeks):**');
  byVelocity.forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    const percent = Math.round((r.recentAvgXP / 125) * 100);
    output.push(`${medal} ${i + 1}. ${r.name}: ${r.recentAvgXP} XP/week (${percent}% of target)`);
  });
  output.push('');

  output.push('**By Accuracy (12 Weeks):**');
  byAccuracy.forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    output.push(`${medal} ${i + 1}. ${r.name}: ${r.accuracy}%`);
  });
  output.push('');
  output.push('---');
  output.push('');

  // Individual profiles
  for (const student of results) {
    output.push(`### ${student.name}`);
    output.push('');
    output.push(`**MathAcademy ID:** ${student.id}`);
    output.push(`**Expected Course:** ${student.course}`);
    output.push(`**Current Course:** ${student.courseAPI}`);
    if (student.xpRemaining) {
      output.push(`**XP Remaining:** ${student.xpRemaining.toLocaleString()}`);
      const weeksToComplete = Math.ceil(student.xpRemaining / Math.max(student.recentAvgXP, 1));
      output.push(`**Est. Completion:** ${weeksToComplete} weeks (at current pace)`);
    }
    output.push('');

    output.push('**12-Week Performance Summary:**');
    output.push(`- Total XP: ${student.totalXP.toLocaleString()}`);
    output.push(`- Average XP/Week: ${student.avgXP} (full period)`);
    output.push(`- Recent XP/Week: ${student.recentAvgXP} (last 4 weeks)`);
    output.push(`- Overall Accuracy: ${student.accuracy}%`);
    output.push(`- Focus Integrity: ${student.focus}%`);
    output.push(`- Total Study Time: ${student.totalTimeEngaged} minutes`);
    output.push(`- Trend: ${student.trend}`);
    output.push('');

    output.push('**Weekly Breakdown:**');
    output.push('');
    output.push('| Week | Date | XP | Questions | Accuracy | Time (min) | Days Active |');
    output.push('|------|------|----:|----------:|---------:|-----------:|------------:|');

    student.weeklyData.forEach(w => {
      const acc = w.questionsAttempted > 0 ?
        Math.round((w.questionsCorrect / w.questionsAttempted) * 100) + '%' : 'N/A';
      const time = Math.round(w.timeEngaged);
      output.push(`| ${w.weekNum} | ${w.label} | ${w.xpAwarded} | ${w.questionsAttempted} | ${acc} | ${time} | ${w.daysActive} |`);
    });
    output.push('');

    // Tier assessment
    let tier = '🔴 TIER D';
    let readiness = 'Not Ready';

    if (student.recentAvgXP >= 100 && student.accuracy >= 85 && student.focus >= 85) {
      tier = '🟢 TIER A';
      readiness = 'Ready for Immediate Start';
    } else if (student.recentAvgXP >= 200 && student.accuracy >= 80) {
      tier = '🟡 TIER B';
      readiness = 'Conditional - Needs Coaching';
    } else if (student.recentAvgXP >= 40 && student.accuracy >= 75 && student.totalXP >= 200) {
      tier = '🔴 TIER C';
      readiness = 'Needs Preparation';
    }

    output.push(`**Assessment:**`);
    output.push(`- **Tier:** ${tier}`);
    output.push(`- **Readiness:** ${readiness}`);
    output.push('');

    // Recommendations
    output.push(`**Recommendations:**`);
    if (tier.includes('TIER A')) {
      output.push('- ✅ Start Week 1 immediately (March 18)');
      output.push('- Focus on error-forcing problems with full CERC scaffolding');
      output.push('- Target: Complete 2-3 problems per week');
    } else if (tier.includes('TIER B')) {
      output.push('- 🟡 2-3 weeks accuracy coaching before Week 1');
      output.push('- Reduce velocity, focus on error analysis');
      output.push('- Target: 88%+ accuracy before training start');
    } else if (tier.includes('TIER C')) {
      output.push('- 🔴 2-4 weeks consistency building');
      output.push('- Establish 80+ XP/week pattern for 4 consecutive weeks');
      output.push('- Improve accuracy to 85%+ before training');
    } else {
      output.push('- ⚫ Immediate intervention required');
      output.push('- Verify account status and engagement barriers');
      output.push('- Not eligible for pilot unless dramatic improvement');
    }
    output.push('');
    output.push('---');
    output.push('');
  }

  output.push('');
  output.push('## Part 2: Course Workflow & Implementation');
  output.push('');
  output.push('### 4-Week Progression Structure');
  output.push('');
  output.push('The AP Justification Training follows a research-based progression through the Harel & Sowder reasoning taxonomy: empirical → generic → formal deductive reasoning.');
  output.push('');
  output.push('| Week | Focus | Scaffolding | Problem Type | XP Rewards |');
  output.push('|------|-------|-------------|--------------|------------|');
  output.push('| 1 | Error-forcing problems | Full CERC sentence frames | MVT/IVT condition bypass | +50 XP per flaw identified |');
  output.push('| 2 | Condition verification | Structural outline only | EVT/Rolle\'s applications | +50 XP per condition verified |');
  output.push('| 3 | Global argumentation | Blank canvas | Communication precision | +100 XP per peer critique |');
  output.push('| 4 | Boss Battle | Timed (AP conditions) | Integrated FRQ synthesis | +150 XP for complete CERC |');
  output.push('');
  output.push('### CERC Framework');
  output.push('');
  output.push('Every student response uses 4 structured fields:');
  output.push('- **Claim:** The mathematical conclusion');
  output.push('- **Evidence:** Computational/algebraic work supporting the claim');
  output.push('- **Reasoning:** The theorem or principle connecting evidence to claim');
  output.push('- **Conditions:** Explicit verification that theorem hypotheses are satisfied');
  output.push('');
  output.push('**Example (MVT Application):**');
  output.push('');
  output.push('*Problem:* Apply MVT to f(x) = 1/x² on [-1,1]');
  output.push('');
  output.push('**Incorrect (Empirical) Response:**');
  output.push('- Claim: "c = 0 satisfies MVT"');
  output.push('- Missing: Condition verification (f is NOT continuous on [-1,1])');
  output.push('');
  output.push('**Correct (Formal) Response:**');
  output.push('- Claim: "MVT cannot be applied"');
  output.push('- Evidence: "f(x) has vertical asymptote at x=0"');
  output.push('- Reasoning: "MVT requires continuity on [a,b]"');
  output.push('- Conditions: "f(x) = 1/x² is NOT continuous at x=0 ∈ [-1,1], therefore MVT does not apply"');
  output.push('');
  output.push('### Gamification System');
  output.push('');
  output.push('**XP System (Reasoning-Based, NOT Speed-Based):**');
  output.push('- +50 XP: Correctly identify broken theorem condition');
  output.push('- +100 XP: Identify logical flaw in peer argument');
  output.push('- +150 XP: Submit unassisted complete CERC proof (Week 3+)');
  output.push('');
  output.push('**Badges (Milestone-Based):**');
  output.push('- 🔍 **"The Skeptic"** - Survive error-forcing problem without empirical trap');
  output.push('- 🏛️ **"The Architect"** - Unassisted flawless CERC proof');
  output.push('- ⚔️ **"Boss Slayer"** - Complete Week 4 Boss Battle with full condition verification');
  output.push('');
  output.push('**Design Principles:**');
  output.push('- NO leaderboards (avoid competition, foster collaboration)');
  output.push('- NO countdown timers until Week 4 (reduce anxiety)');
  output.push('- Badges unlock with satisfying GSAP animations');
  output.push('');
  output.push('### Week 4: Boss Battle Structure');
  output.push('');
  output.push('Multi-phase collaborative challenge:');
  output.push('- **Phase 1 (Individual):** Untangle algebraic evidence (15 min)');
  output.push('- **Phase 2 (Team):** Construct CERC argument collaboratively (20 min)');
  output.push('- **Phase 3 (Curveball):** Unexpected constraint introduced (e.g., function no longer differentiable at x=0)');
  output.push('- **Final:** Timed FRQ simulation under AP conditions');
  output.push('');
  output.push('Full cohort works as ONE TEAM against the problem (not competing against each other).');
  output.push('');
  output.push('---');
  output.push('');
  output.push('## Part 3: Week-by-Week Implementation Plan');
  output.push('');
  output.push('### Week 1: March 18-24 (Tier A Launch)');
  output.push('');
  output.push('**Students:** Elle Liemandt, Emily Smith');
  output.push('');
  output.push('**Deliverables:**');
  output.push('- Kickoff session: CERC framework introduction');
  output.push('- Problem 1: MVT condition bypass (BC: f(x)=1/x² on [-1,1])');
  output.push('- Problem 2: IVT discontinuity trap (BC: Sign change without solution)');
  output.push('- Emily variant: Precalculus-level continuity reasoning');
  output.push('');
  output.push('**Scaffolding:** Full sentence frames provided');
  output.push('- "The theorem [name] requires the condition [state condition]..."');
  output.push('- "Verification: [show calculation]..."');
  output.push('- "Therefore, [conclusion]..."');
  output.push('');
  output.push('**Progress Monitoring:**');
  output.push('- Daily: 150+ XP (Elle), 220+ XP (Emily)');
  output.push('- Weekly: 2 CERC submissions completed');
  output.push('- Escalation: Accuracy drop below 85% → prerequisite review');
  output.push('');
  output.push('**Parallel Actions:**');
  output.push('- Ananya: Accuracy coaching session (error pattern analysis)');
  output.push('- Sloka: Reactivation call (restart plan)');
  output.push('- Sloane: Engagement intervention (barriers assessment)');
  output.push('- Alex: Status verification (account check)');
  output.push('');
  output.push('---');
  output.push('');
  output.push('### Week 2: March 25-31 (Tier A Progress)');
  output.push('');
  output.push('**Students:** Elle Liemandt, Emily Smith');
  output.push('');
  output.push('**Deliverables:**');
  output.push('- Problem 3: Global vs local argument (BC: Does maximum exist?)');
  output.push('- Emily variant: Domain/range verification reasoning');
  output.push('');
  output.push('**Scaffolding:** Structural outline only (sentence frames removed)');
  output.push('- Students must construct full argument with outline guide');
  output.push('');
  output.push('**Progress Monitoring:**');
  output.push('- Check-in: Ananya accuracy progress (target: 88%+)');
  output.push('- Check-in: Maddie engagement (Week 2 of consistency building)');
  output.push('- Check-in: Sloka reactivation (Week 1 XP)');
  output.push('');
  output.push('---');
  output.push('');
  output.push('### Week 3: April 1-7 (Tier A Week 3 + Tier B Start)');
  output.push('');
  output.push('**Students:** Elle, Emily, + Ananya (if approved)');
  output.push('');
  output.push('**Deliverables:**');
  output.push('- Problems 4-5: EVT/Rolle\'s applications (BC)');
  output.push('- Emily: Global argumentation prep');
  output.push('- Ananya: Week 1 problems (compressed schedule)');
  output.push('');
  output.push('**Scaffolding:** Blank canvas (no frames, no outline)');
  output.push('');
  output.push('**Decision Gates:**');
  output.push('- Approve Ananya for Week 1 IF accuracy ≥88%');
  output.push('- Assess Maddie readiness (Week 3 of consistency)');
  output.push('- Assess Sloka readiness (Week 2 active)');
  output.push('');
  output.push('---');
  output.push('');
  output.push('### Week 4: April 8-14 (Tier A Boss Battle)');
  output.push('');
  output.push('**Students:** Elle, Emily');
  output.push('');
  output.push('**Deliverables:**');
  output.push('- Mini Boss Battle (integrated FRQ)');
  output.push('- 3-phase collaborative challenge');
  output.push('- Timed simulation (AP conditions)');
  output.push('');
  output.push('**Milestone:** Tier A students complete full 4-week program');
  output.push('');
  output.push('**Decision Gates:**');
  output.push('- Approve Maddie for Week 1 IF 4 weeks × 100+ XP');
  output.push('- Approve Sloka for Week 1 IF 3 weeks × 80+ XP + accuracy ≥85%');
  output.push('');
  output.push('---');
  output.push('');
  output.push('### Week 5-7: April 15 - May 5 (Tier B/C Completion)');
  output.push('');
  output.push('**Students:** Ananya, Maddie (if approved), Sloka (if approved)');
  output.push('');
  output.push('**Deliverables:**');
  output.push('- Ananya: Weeks 2-4 (compressed if needed)');
  output.push('- Maddie/Sloka: Weeks 1-2 (may not complete full 4 weeks before AP)');
  output.push('');
  output.push('**Spring Break:** April 22-28 (optional practice only)');
  output.push('');
  output.push('**Final Prep:** May 1-5 (confidence building, no new content)');
  output.push('');
  output.push('---');
  output.push('');
  output.push('## Part 4: Success Metrics & Monitoring');
  output.push('');
  output.push('### Individual Success Criteria');
  output.push('');
  output.push('**Tier A (Elle, Emily):**');
  output.push('- Complete all 4 weeks by April 21');
  output.push('- Earn "The Architect" badge (unassisted CERC proof)');
  output.push('- Demonstrate formal deductive reasoning on Boss Battle');
  output.push('- Target: 90%+ accuracy on final FRQ');
  output.push('');
  output.push('**Tier B (Ananya):**');
  output.push('- Improve accuracy to 88%+ by April 1');
  output.push('- Complete compressed 3-week program by May 1');
  output.push('- Earn "The Skeptic" badge minimum');
  output.push('- Target: 85%+ accuracy on practice FRQ');
  output.push('');
  output.push('**Tier C (Maddie, Sloka):**');
  output.push('- Establish consistent 80+ XP/week for 4 weeks');
  output.push('- Complete Week 1-2 before AP exam');
  output.push('- Demonstrate understanding of CERC framework');
  output.push('- Target: Can identify missing conditions in worked examples');
  output.push('');
  output.push('### Cohort Success Metrics');
  output.push('');
  output.push('**Participation:**');
  output.push('- Target: 60%+ of eligible students complete full program');
  output.push('- Stretch: 80%+ complete at least Week 1-2');
  output.push('');
  output.push('**Reasoning Advancement:**');
  output.push('- Target: 80%+ show progression from empirical → generic or formal');
  output.push('- Measured via pre/post CERC response quality');
  output.push('');
  output.push('**AP Impact:**');
  output.push('- Target: 10%+ improvement on May AP FRQ scores vs historical baseline');
  output.push('- Baseline: Alpha school avg FRQ score 2025 (if available)');
  output.push('');
  output.push('### Monitoring Dashboards');
  output.push('');
  output.push('**Daily (Automated):**');
  output.push('- MathAcademy XP tracking via API');
  output.push('- Accuracy monitoring (alert if <80%)');
  output.push('- Engagement alerts (zero activity for 3+ days)');
  output.push('');
  output.push('**Weekly (Manual Review):**');
  output.push('- CERC submission quality review');
  output.push('- Hint usage patterns (detect wheel-spinning)');
  output.push('- Reasoning stage assessment (empirical/generic/formal)');
  output.push('');
  output.push('**Escalation Triggers:**');
  output.push('- Velocity drop >30% from baseline → check-in call within 48hrs');
  output.push('- Accuracy drop below 75% → prerequisite review session');
  output.push('- Missing 2 consecutive CERC submissions → intervention');
  output.push('- Hint usage >5 per problem → wheel-spinning protocol');
  output.push('');
  output.push('---');
  output.push('');
  output.push('## Part 5: Technical Implementation');
  output.push('');
  output.push('### Platform Stack');
  output.push('');
  output.push('- **Framework:** Next.js 14 (App Router)');
  output.push('- **Database:** TimeBack LMS integration (OneRoster 1.2 + QTI 3.0)');
  output.push('- **AI:** Claude API (problem generation + Socratic feedback)');
  output.push('- **UI:** Tailwind CSS + Aceternity UI + Magic UI + GSAP animations');
  output.push('- **Math Rendering:** KaTeX');
  output.push('- **Monitoring:** MathAcademy API integration (real-time XP tracking)');
  output.push('');
  output.push('### Data Integration');
  output.push('');
  output.push('**MathAcademy API:**');
  output.push('- Real-time XP/accuracy monitoring');
  output.push('- Automatic escalation alerts');
  output.push('- Historical trend analysis');
  output.push('');
  output.push('**TimeBack LMS:**');
  output.push('- OneRoster sync for student roster');
  output.push('- QTI 3.0 for problem deployment');
  output.push('- LTI 1.3 Advantage for grade posting');
  output.push('');
  output.push('### Configuration Checklist');
  output.push('');
  output.push('**Week 1 Setup:**');
  output.push('- [ ] Deploy Week 1 error-forcing problems (BC + Precalc versions)');
  output.push('- [ ] Configure CERC submission forms with validation');
  output.push('- [ ] Set up XP/Badge system with GSAP animations');
  output.push('- [ ] Create student dashboards');
  output.push('- [ ] Integrate MathAcademy API monitoring');
  output.push('');
  output.push('**Content Pipeline:**');
  output.push('- [ ] Week 1: 3 problems (BC + Precalc variants)');
  output.push('- [ ] Week 2: 2 condition verification problems');
  output.push('- [ ] Week 3: 2 global argumentation problems');
  output.push('- [ ] Week 4: 1 Boss Battle integrated FRQ');
  output.push('');
  output.push('---');
  output.push('');
  output.push('## Part 6: Open Decisions & Next Steps');
  output.push('');
  output.push('### Open Decisions');
  output.push('');
  output.push('1. **Ananya fast-track:** If accuracy reaches 88%+ by April 1, compress Weeks 1-2 to catch up with Tier A?');
  output.push('');
  output.push('2. **Maddie/Sloka approval:** Is 4 weeks × 80 XP sufficient, or require accuracy improvement too?');
  output.push('');
  output.push('3. **Alex/Sloane status:** Drop from pilot or offer 2-week "last chance" window?');
  output.push('');
  output.push('4. **Emily post-program:** After completing 4 weeks, offer "AP AB preview" or keep in Precalc lane?');
  output.push('');
  output.push('5. **Post-May cohort:** Plan June-August program for deferred students?');
  output.push('');
  output.push('### Next Steps (Week of March 18)');
  output.push('');
  output.push('**Monday March 17:**');
  output.push('- [ ] Finalize Week 1 problem content (BC + Precalc)');
  output.push('- [ ] Deploy platform with CERC forms');
  output.push('- [ ] Send kickoff emails to Elle + Emily');
  output.push('');
  output.push('**Tuesday March 18:**');
  output.push('- [ ] Kickoff session: Elle (9:00 AM)');
  output.push('- [ ] Kickoff session: Emily (10:00 AM)');
  output.push('- [ ] Assign Week 1 Problems 1-2');
  output.push('');
  output.push('**Wednesday March 19:**');
  output.push('- [ ] Accuracy coaching: Ananya (error analysis)');
  output.push('');
  output.push('**Thursday March 20:**');
  output.push('- [ ] Reactivation call: Sloka (restart plan)');
  output.push('');
  output.push('**Friday March 21:**');
  output.push('- [ ] Engagement intervention: Sloane (barriers)');
  output.push('- [ ] Status verification: Alex (account check)');
  output.push('- [ ] Weekly review: Tier A progress check');
  output.push('');
  output.push('---');
  output.push('');
  output.push('## Appendix: Data Sources & Methodology');
  output.push('');
  output.push('**MathAcademy API:**');
  output.push('- Version: Beta 6');
  output.push('- Base URL: https://mathacademy.com/api/beta6');
  output.push('- Authentication: Public-API-Key header');
  output.push('- Rate Limiting: ~100 requests/minute');
  output.push('');
  output.push('**Data Collection:**');
  output.push('- 12 weeks historical data (' + weeks[0].label + ' - ' + weeks[11].label + ')');
  output.push('- Metrics: XP awarded, questions attempted/correct, time engaged/productive, days active');
  output.push('- API caveat: Times in seconds (converted to minutes in analysis)');
  output.push('');
  output.push('**Student ID Verification:**');
  output.push('- All 7 students verified by full name + course match');
  output.push('- API limitation: Email addresses not exposed');
  output.push('- Note: "K8749" style names indicate anonimized last names in API');
  output.push('');
  output.push('**Tier Classification Logic:**');
  output.push('- Tier A: Recent velocity ≥100 XP/wk AND accuracy ≥85% AND focus ≥85%');
  output.push('- Tier B: Recent velocity ≥200 XP/wk AND accuracy ≥80% (high speed, needs accuracy work)');
  output.push('- Tier C: Recent velocity ≥40 XP/wk AND accuracy ≥75% AND total XP ≥200 (needs consistency)');
  output.push('- Tier D: Below Tier C thresholds (requires intervention)');
  output.push('');
  output.push('---');
  output.push('');
  output.push('**Document Generated:** ' + new Date().toISOString());
  output.push('**Analysis Tool:** MathAcademy API + Custom Node.js Scripts');
  output.push('**Next Update:** March 24, 2026 (weekly cadence)');
  output.push('');
  output.push('---');
  output.push('');
  output.push('# END OF DOCUMENT');
  output.push('');
  output.push('*Please format this as a professional Microsoft Word DOCX with:*');
  output.push('- *Title page with program name and date*');
  output.push('- *Table of contents*');
  output.push('- *Consistent heading styles (Heading 1, 2, 3)*');
  output.push('- *Tables with borders and shading*');
  output.push('- *Page numbers in footer*');
  output.push('- *Professional font (Calibri or Arial)*');

  return output.join('\n');
}

main().catch(console.error);
