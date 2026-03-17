#!/usr/bin/env node
/**
 * Prerequisite System Logic Test
 * Simulates the prerequisite checking flow
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Prerequisite System Logic Tests');
console.log('===================================\n');

let PASS = 0;
let FAIL = 0;

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
  }
}

// Read the prerequisite file
const prereqPath = path.join(__dirname, 'lib', 'prerequisites.ts');
const prereqContent = fs.readFileSync(prereqPath, 'utf-8');

// Test 1: Function exists
test('checkFRQPrerequisites function exists', () => {
  if (!prereqContent.includes('export function checkFRQPrerequisites')) {
    throw new Error('checkFRQPrerequisites function not found');
  }
});

// Test 2: Required problems constant
test('REQUIRED_PROBLEMS constant defined', () => {
  if (!prereqContent.includes('REQUIRED_PROBLEMS')) {
    throw new Error('REQUIRED_PROBLEMS constant not found');
  }

  // Should be 2 (2 out of 3 problems)
  const match = prereqContent.match(/REQUIRED_PROBLEMS\s*=\s*(\d+)/);
  if (!match || match[1] !== '2') {
    throw new Error(`REQUIRED_PROBLEMS should be 2, found ${match ? match[1] : 'undefined'}`);
  }
});

// Test 3: getBlockedFRQMessage function
test('getBlockedFRQMessage function exists', () => {
  if (!prereqContent.includes('export function getBlockedFRQMessage')) {
    throw new Error('getBlockedFRQMessage function not found');
  }
});

// Test 4: PrerequisiteCheck type structure
test('PrerequisiteCheck return type', () => {
  if (!prereqContent.includes('canReceiveFRQ:')) {
    throw new Error('canReceiveFRQ field missing');
  }
  if (!prereqContent.includes('problemsCompleted')) {
    throw new Error('problemsCompleted tracking missing');
  }
  if (!prereqContent.includes('problemsRequired')) {
    throw new Error('problemsRequired tracking missing');
  }
});

// Test 5: Webhook integration
test('Webhook uses prerequisite check', () => {
  const webhookPath = path.join(__dirname, 'app', 'api', 'webhooks', 'timeback', 'route.ts');
  const webhookContent = fs.readFileSync(webhookPath, 'utf-8');

  if (!webhookContent.includes('checkFRQPrerequisites')) {
    throw new Error('Webhook does not import/use checkFRQPrerequisites');
  }

  if (!webhookContent.includes('getStudentWeekSummary')) {
    throw new Error('Webhook does not call getStudentWeekSummary');
  }

  if (!webhookContent.includes('blocked: isBlocked')) {
    throw new Error('Webhook does not set blocked field on FRQ assignment');
  }
});

// Test 6: BlockedFRQCard component
test('BlockedFRQCard component exists', () => {
  const cardPath = path.join(__dirname, 'components', 'student', 'blocked-frq-card.tsx');
  if (!fs.existsSync(cardPath)) {
    throw new Error('blocked-frq-card.tsx not found');
  }

  const content = fs.readFileSync(cardPath, 'utf-8');

  if (!content.includes('prerequisiteCheck')) {
    throw new Error('Component does not accept prerequisiteCheck prop');
  }

  if (!content.includes('problemsCompleted') || !content.includes('problemsRequired')) {
    throw new Error('Component does not display progress tracking');
  }

  // Check for progress bar
  if (!content.includes('progress =')) {
    throw new Error('Component does not calculate progress percentage');
  }
});

// Test 7: Student dashboard shows blocked FRQs
test('Student dashboard handles blocked FRQs', () => {
  const dashboardPath = path.join(__dirname, 'components', 'student', 'student-dashboard.tsx');
  if (!fs.existsSync(dashboardPath)) {
    throw new Error('student-dashboard.tsx not found');
  }

  const content = fs.readFileSync(dashboardPath, 'utf-8');

  if (!content.includes('blockedFRQs')) {
    throw new Error('Dashboard does not separate blocked FRQs');
  }

  if (!content.includes('frq.blocked')) {
    throw new Error('Dashboard does not filter by blocked status');
  }

  // Check for "Locked Assignments" section
  if (!content.includes('Locked Assignments')) {
    throw new Error('Dashboard does not have "Locked Assignments" section');
  }
});

// Test 8: FRQAssignment type has blocked fields
test('FRQAssignment type supports blocking', () => {
  const typesPath = path.join(__dirname, 'lib', 'types', 'index.ts');
  const content = fs.readFileSync(typesPath, 'utf-8');

  const frqAssignmentMatch = content.match(/export interface FRQAssignment \{[\s\S]*?\n\}/);
  if (!frqAssignmentMatch) {
    throw new Error('FRQAssignment interface not found');
  }

  const frqInterface = frqAssignmentMatch[0];

  if (!frqInterface.includes('blocked?:')) {
    throw new Error('FRQAssignment missing blocked field');
  }

  if (!frqInterface.includes('blockedReason?:')) {
    throw new Error('FRQAssignment missing blockedReason field');
  }

  if (!frqInterface.includes('prerequisiteCheck?:')) {
    throw new Error('FRQAssignment missing prerequisiteCheck field');
  }
});

// Test 9: Mock data includes blocked FRQ example
test('Mock adapter has blocked FRQ example', () => {
  const mockPath = path.join(__dirname, 'services', 'data', 'mock.adapter.ts');
  const content = fs.readFileSync(mockPath, 'utf-8');

  if (!content.includes('blocked: true') && !content.includes('blocked:true')) {
    throw new Error('Mock data does not include any blocked FRQ examples');
  }

  if (!content.includes('blockedReason:')) {
    throw new Error('Mock data does not include blockedReason examples');
  }
});

// Test 10: DataService has getStudentWeekSummary
test('DataService interface includes tracking methods', () => {
  const servicePath = path.join(__dirname, 'services', 'data', 'index.ts');
  const content = fs.readFileSync(servicePath, 'utf-8');

  if (!content.includes('getStudentWeekSummary')) {
    throw new Error('DataService missing getStudentWeekSummary method');
  }

  if (!content.includes('saveProblemAttempt')) {
    throw new Error('DataService missing saveProblemAttempt method');
  }

  if (!content.includes('getProblemAttempts')) {
    throw new Error('DataService missing getProblemAttempts method');
  }
});

console.log('\n📊 Summary');
console.log('----------');
console.log(`✅ Passed: ${PASS}`);
console.log(`❌ Failed: ${FAIL}`);
console.log('');

if (FAIL === 0) {
  console.log('🎉 All prerequisite logic tests passed!');
  console.log('\n💡 Next Steps:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Use manual test checklist: test-manual.md');
  console.log('   3. Complete at least one problem as a student');
  console.log('   4. Verify FRQ unlocks after 2nd problem completion');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Fix issues before manual testing.');
  process.exit(1);
}
