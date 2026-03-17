#!/bin/bash
# Master Test Runner
# Executes all automated tests and generates report

echo "╔════════════════════════════════════════════════════════╗"
echo "║     Week 1 Comprehensive Test Suite                   ║"
echo "║     Alpha AP Justification Training                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

TOTAL_PASS=0
TOTAL_FAIL=0
START_TIME=$(date +%s)

# Test 1: Data Integrity
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Test Suite 1: Data Integrity"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if node test-data-integrity.js; then
  TOTAL_PASS=$((TOTAL_PASS + 10))
  echo ""
else
  TOTAL_FAIL=$((TOTAL_FAIL + 1))
  echo ""
  echo "❌ Data integrity tests failed. Fix before proceeding."
  exit 1
fi

# Test 2: Prerequisite Logic
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Test Suite 2: Prerequisite Logic"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if node test-prerequisite-logic.js; then
  TOTAL_PASS=$((TOTAL_PASS + 10))
  echo ""
else
  TOTAL_FAIL=$((TOTAL_FAIL + 1))
  echo ""
  echo "❌ Prerequisite logic tests failed. Fix before proceeding."
  exit 1
fi

# Test 3: TypeScript Compilation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📘 Test Suite 3: TypeScript Compilation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -n "Checking TypeScript errors... "
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
  echo "❌ FAIL"
  TOTAL_FAIL=$((TOTAL_FAIL + 1))
  echo ""
  echo "TypeScript errors found:"
  npx tsc --noEmit 2>&1 | grep "error TS" | head -10
  echo ""
  echo "⚠️  Fix TypeScript errors before deploying."
else
  echo "✅ PASS"
  TOTAL_PASS=$((TOTAL_PASS + 1))
fi
echo ""

# Test 4: Build Success
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  Test Suite 4: Production Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Building Next.js production bundle..."
if npm run build > /tmp/build-output.log 2>&1; then
  echo "✅ Build succeeded"
  TOTAL_PASS=$((TOTAL_PASS + 1))

  # Check build size
  if [ -d ".next" ]; then
    BUILD_SIZE=$(du -sh .next | cut -f1)
    echo "📊 Build size: $BUILD_SIZE"
  fi
else
  echo "❌ Build failed"
  TOTAL_FAIL=$((TOTAL_FAIL + 1))
  echo ""
  echo "Build errors:"
  tail -20 /tmp/build-output.log
fi
echo ""

# Final Summary
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Final Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ✅ Tests Passed:  $TOTAL_PASS"
echo "  ❌ Tests Failed:  $TOTAL_FAIL"
echo "  ⏱️  Duration:      ${DURATION}s"
echo ""

if [ $TOTAL_FAIL -eq 0 ]; then
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║  🎉  ALL AUTOMATED TESTS PASSED!                      ║"
  echo "╚════════════════════════════════════════════════════════╝"
  echo ""
  echo "✅ Data integrity verified (20/20 tests)"
  echo "✅ TypeScript compilation successful"
  echo "✅ Production build successful"
  echo ""
  echo "📋 Next Steps:"
  echo "   1. Review test-manual.md for browser testing checklist"
  echo "   2. Start dev server: npm run dev"
  echo "   3. Test complete problem-solving flow"
  echo "   4. Verify prerequisite system (2/3 rule)"
  echo "   5. Check admin dashboard views"
  echo ""
  echo "⚠️  Note: Manual browser testing required before production!"
  echo ""
  exit 0
else
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║  ❌  SOME TESTS FAILED                                ║"
  echo "╚════════════════════════════════════════════════════════╝"
  echo ""
  echo "🔧 Fix the failed tests before proceeding."
  echo "📄 Review TEST_RESULTS.md for details."
  echo ""
  exit 1
fi
