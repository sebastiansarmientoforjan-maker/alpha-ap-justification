#!/bin/bash

# FASE 1: Flujo FRQ Completo - Script de Prueba Automatizado
# =========================================================

BASE_URL="http://localhost:3003"
API_URL="$BASE_URL/api"

echo "🚀 Iniciando Prueba FASE 1: Flujo FRQ Completo"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
  local test_name=$1
  local method=$2
  local endpoint=$3
  local data=$4

  echo -e "${YELLOW}Testing:${NC} $test_name"

  if [ "$method" == "POST" ]; then
    response=$(curl -s -X POST "$API_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    response=$(curl -s "$API_URL$endpoint")
  fi

  if echo "$response" | grep -q "success.*true\|\"success\":true"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $response"
    ((TESTS_FAILED++))
  fi
  echo ""
}

# Test 1: Telegram Connection
echo "═══════════════════════════════════════════════════"
echo "TEST 1: Telegram Connection"
echo "═══════════════════════════════════════════════════"
test_endpoint "Telegram Bot Connection" "GET" "/test-telegram?action=test"

# Test 2: Create Mock Quiz
echo "═══════════════════════════════════════════════════"
echo "TEST 2: Create Mock Quiz"
echo "═══════════════════════════════════════════════════"
QUIZ_DATA='{
  "studentId": "sloka-001",
  "studentName": "Sloka Vudumu",
  "topic": "Mean Value Theorem",
  "score": 68,
  "weakTopics": ["MVT", "continuity", "differentiability"]
}'
test_endpoint "Create Quiz" "POST" "/admin/quiz/create" "$QUIZ_DATA"

# Test 3: Generate FRQ (will take longer - Claude API call)
echo "═══════════════════════════════════════════════════"
echo "TEST 3: Generate FRQ with Claude"
echo "═══════════════════════════════════════════════════"
echo "⏳ This may take 30-60 seconds (Claude API + PDF generation)..."
FRQ_DATA='{
  "studentId": "sloka-001",
  "studentName": "Sloka Vudumu",
  "quizScore": 68,
  "weakTopics": ["MVT", "continuity", "differentiability"],
  "course": "calculus-ab",
  "reasoningStage": "empirical"
}'

echo "Calling Claude API..."
frq_response=$(curl -s -X POST "$API_URL/admin/generate-frq" \
  -H "Content-Type: application/json" \
  -d "$FRQ_DATA")

if echo "$frq_response" | grep -q "success.*true\|\"success\":true"; then
  echo -e "${GREEN}✓ PASSED${NC} - FRQ Generated"
  ((TESTS_PASSED++))

  # Extract FRQ ID for next tests
  FRQ_ID=$(echo "$frq_response" | grep -o '"frqId":"[^"]*"' | cut -d'"' -f4)
  echo "FRQ ID: $FRQ_ID"

  echo ""
  echo "📱 Check your Telegram for:"
  echo "   - FRQ notification with student details"
  echo "   - PDF attachment"
  echo "   - Action buttons (Approve/Reject/Regenerate)"
else
  echo -e "${RED}✗ FAILED${NC}"
  echo "Response: $frq_response"
  ((TESTS_FAILED++))
fi
echo ""

# Test 4: Assign FRQ
if [ ! -z "$FRQ_ID" ]; then
  echo "═══════════════════════════════════════════════════"
  echo "TEST 4: Assign FRQ to Student"
  echo "═══════════════════════════════════════════════════"
  ASSIGN_DATA="{
    \"frqId\": \"$FRQ_ID\",
    \"studentId\": \"sloka-001\",
    \"assignedAt\": \"$(date -Iseconds)\"
  }"
  test_endpoint "Assign FRQ" "POST" "/admin/frq/assign" "$ASSIGN_DATA"
else
  echo "⚠️  Skipping Test 4: No FRQ ID available"
fi

# Test 5: Test Railway PDF Compiler Connection
echo "═══════════════════════════════════════════════════"
echo "TEST 5: Railway PDF Compiler"
echo "═══════════════════════════════════════════════════"
test_endpoint "Railway Connection" "GET" "/test-railway"

# Summary
echo ""
echo "═══════════════════════════════════════════════════"
echo "FASE 1 Test Summary"
echo "═══════════════════════════════════════════════════"
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  echo ""
  echo "✅ Next Steps:"
  echo "   1. Check Telegram for FRQ notification"
  echo "   2. Open http://localhost:3001/admin to see dashboard"
  echo "   3. Open http://localhost:3001/student (as sloka-001) to see assigned FRQ"
  echo ""
  echo "Ready for FASE 2: Week 1 Training Session (CERC)"
else
  echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
  echo "Review the errors above and fix before proceeding."
fi

echo ""
