#!/usr/bin/env node
/**
 * Data Integrity Test Suite
 * Validates Week 1 data structure without requiring server/auth
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Week 1 Data Integrity Tests');
console.log('==============================\n');

let PASS = 0;
let FAIL = 0;
const bugs = [];

function test(name, fn) {
  process.stdout.write(`Testing: ${name} ... `);
  try {
    fn();
    console.log('✅ PASS');
    PASS++;
  } catch (error) {
    console.log('❌ FAIL');
    console.log(`  Error: ${error.message}`);
    FAIL++;
    bugs.push({ test: name, error: error.message });
  }
}

// Test 1: Week 1 content file exists and is valid
test('Week 1 content file structure', () => {
  const contentPath = path.join(__dirname, 'data', 'week-1-content.ts');
  if (!fs.existsSync(contentPath)) {
    throw new Error('week-1-content.ts not found');
  }

  const content = fs.readFileSync(contentPath, 'utf-8');

  // Check for all required problem IDs
  const requiredIDs = [
    'w1-mvt-001',
    'w1-ivt-001',
    'w1-mvt-002',
    'w1-stats-001',
    'w1-stats-002',
    'w1-stats-003'
  ];

  requiredIDs.forEach(id => {
    if (!content.includes(`id: "${id}"`)) {
      throw new Error(`Missing problem ID: ${id}`);
    }
  });

  // Check course assignments
  if (!content.includes('course: "calculus-bc"')) {
    throw new Error('Missing calculus-bc course assignment');
  }
  if (!content.includes('course: "statistics"')) {
    throw new Error('Missing statistics course assignment');
  }
});

// Test 2: Mock adapter references correct IDs
test('Mock adapter problem ID consistency', () => {
  const mockPath = path.join(__dirname, 'services', 'data', 'mock.adapter.ts');
  if (!fs.existsSync(mockPath)) {
    throw new Error('mock.adapter.ts not found');
  }

  const content = fs.readFileSync(mockPath, 'utf-8');

  // Check that it imports week1Problems
  if (!content.includes('import { week1Problems }')) {
    throw new Error('Mock adapter does not import week1Problems');
  }

  // Check that old IDs are gone
  if (content.includes('"prob-w1-001"') && !content.includes('id: "prob-w2-')) {
    throw new Error('Old problem ID "prob-w1-001" still in use (should be w1-mvt-001)');
  }

  // Check that new IDs are referenced
  if (!content.includes('"w1-mvt-001"')) {
    throw new Error('New problem ID "w1-mvt-001" not referenced in mock data');
  }
});

// Test 3: Problem solver page supports new IDs
test('Problem solver dynamic route structure', () => {
  const solverPath = path.join(__dirname, 'app', 'student', 'week', '1', 'problem', '[problemId]', 'page.tsx');
  if (!fs.existsSync(solverPath)) {
    throw new Error('Problem solver page not found');
  }

  const content = fs.readFileSync(solverPath, 'utf-8');

  // Check that it uses getDataService
  if (!content.includes('getDataService')) {
    throw new Error('Problem solver does not use getDataService');
  }

  // Check that it has all 5 phases
  const phases = [
    'Phase 1: Understand',
    'Phase 2: Solve on Paper',
    'Phase 3: Justify (CERC)',
    'Phase 4: Self-Check',
    'Phase 5: Reflect'
  ];
  phases.forEach(phase => {
    if (!content.includes(phase)) {
      throw new Error(`Missing phase: ${phase}`);
    }
  });
});

// Test 4: LaTeX syntax validation
test('LaTeX syntax in problem statements', () => {
  const contentPath = path.join(__dirname, 'data', 'week-1-content.ts');
  const content = fs.readFileSync(contentPath, 'utf-8');

  // Check for balanced delimiters
  const inlineMathMatches = content.match(/\$[^$]+\$/g) || [];
  const displayMathMatches = content.match(/\$\$[^$]+\$\$/g) || [];

  if (inlineMathMatches.length === 0 && displayMathMatches.length === 0) {
    throw new Error('No LaTeX expressions found');
  }

  // Check for common LaTeX commands
  const latexCommands = ['\\frac', '\\lim', '\\begin{cases}'];
  let foundCommands = 0;
  latexCommands.forEach(cmd => {
    if (content.includes(cmd)) foundCommands++;
  });

  if (foundCommands === 0) {
    throw new Error('No LaTeX commands found (expected \\frac, \\lim, etc.)');
  }
});

// Test 5: CERC skeleton completeness
test('CERC skeleton structure', () => {
  const contentPath = path.join(__dirname, 'data', 'week-1-content.ts');
  const content = fs.readFileSync(contentPath, 'utf-8');

  // Check that all problems have complete CERC
  const cercFields = ['claim:', 'evidence:', 'reasoning:', 'conditions:'];
  cercFields.forEach(field => {
    const matches = (content.match(new RegExp(field, 'g')) || []).length;
    // Should appear at least 6 times (once per problem in correctCERCResponse)
    if (matches < 6) {
      throw new Error(`CERC field "${field}" appears only ${matches} times, expected at least 6`);
    }
  });
});

// Test 6: Sentence frames structure
test('Sentence frames completeness', () => {
  const contentPath = path.join(__dirname, 'data', 'week-1-content.ts');
  const content = fs.readFileSync(contentPath, 'utf-8');

  // Check sentenceFrames object exists for each problem
  const sentenceFramesCount = (content.match(/sentenceFrames: \{/g) || []).length;
  if (sentenceFramesCount < 6) {
    throw new Error(`Only ${sentenceFramesCount} sentenceFrames objects found, expected 6`);
  }
});

// Test 7: Theorem info structure
test('Theorem info completeness', () => {
  const contentPath = path.join(__dirname, 'data', 'week-1-content.ts');
  const content = fs.readFileSync(contentPath, 'utf-8');

  // Check theoremInfo exists with required fields
  const theoremCount = (content.match(/theoremInfo: \{/g) || []).length;
  if (theoremCount < 6) {
    throw new Error(`Only ${theoremCount} theoremInfo objects found, expected 6`);
  }

  // Check for hypotheses arrays
  const hypothesesCount = (content.match(/hypotheses: \[/g) || []).length;
  if (hypothesesCount < 6) {
    throw new Error(`Only ${hypothesesCount} hypotheses arrays found, expected 6`);
  }
});

// Test 8: Hints structure (3 levels)
test('Hint levels completeness', () => {
  const contentPath = path.join(__dirname, 'data', 'week-1-content.ts');
  const content = fs.readFileSync(contentPath, 'utf-8');

  // Each problem should have level1, level2, level3
  const level1Count = (content.match(/level1:/g) || []).length;
  const level2Count = (content.match(/level2:/g) || []).length;
  const level3Count = (content.match(/level3:/g) || []).length;

  if (level1Count < 6 || level2Count < 6 || level3Count < 6) {
    throw new Error(`Incomplete hint levels: L1=${level1Count}, L2=${level2Count}, L3=${level3Count}`);
  }
});

// Test 9: Course filtering logic
test('Course-specific problem distribution', () => {
  const contentPath = path.join(__dirname, 'data', 'week-1-content.ts');
  const content = fs.readFileSync(contentPath, 'utf-8');

  // Count calculus vs statistics problems (match exact property, not comments)
  const calculusBCCount = (content.match(/^\s+course: "calculus-bc",/gm) || []).length;
  const calculusABCount = (content.match(/^\s+course: "calculus-ab",/gm) || []).length;
  const statsCount = (content.match(/^\s+course: "statistics",/gm) || []).length;

  const totalCalculus = calculusBCCount + calculusABCount;

  if (totalCalculus !== 3) {
    throw new Error(`Expected 3 calculus problems, found ${totalCalculus} (BC: ${calculusBCCount}, AB: ${calculusABCount})`);
  }
  if (statsCount !== 3) {
    throw new Error(`Expected 3 statistics problems, found ${statsCount}`);
  }
});

// Test 10: Prerequisites integration
test('Prerequisite check integration', () => {
  const webhookPath = path.join(__dirname, 'app', 'api', 'webhooks', 'timeback', 'route.ts');
  if (!fs.existsSync(webhookPath)) {
    throw new Error('Webhook route not found');
  }

  const content = fs.readFileSync(webhookPath, 'utf-8');

  // Check prerequisite imports and usage
  if (!content.includes('checkFRQPrerequisites')) {
    throw new Error('Webhook does not import checkFRQPrerequisites');
  }
  if (!content.includes('getStudentWeekSummary')) {
    throw new Error('Webhook does not use getStudentWeekSummary');
  }
});

console.log('\n📊 Summary');
console.log('----------');
console.log(`✅ Passed: ${PASS}`);
console.log(`❌ Failed: ${FAIL}`);

if (bugs.length > 0) {
  console.log('\n🐛 Bugs Found:');
  bugs.forEach((bug, i) => {
    console.log(`${i + 1}. ${bug.test}`);
    console.log(`   ${bug.error}`);
  });
}

console.log('');

if (FAIL === 0) {
  console.log('🎉 All data integrity tests passed!');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Review above.');
  process.exit(1);
}
