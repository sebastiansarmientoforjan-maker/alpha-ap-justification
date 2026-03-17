#!/bin/bash
# Test Suite for Week 1 Flow
# Tests all critical paths before production

echo "🧪 Week 1 Flow Test Suite"
echo "========================="
echo ""

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0

# Helper function
test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"

  echo -n "Testing: $name ... "

  response=$(curl -s -o /dev/null -w "%{http_code}" "$url")

  if [ "$response" = "$expected_status" ]; then
    echo "✅ PASS (HTTP $response)"
    ((PASS++))
  else
    echo "❌ FAIL (Expected $expected_status, got $response)"
    ((FAIL++))
  fi
}

# Test data endpoints
test_data_service() {
  local endpoint="$1"
  echo -n "Testing DataService: $endpoint ... "

  # Just check that the page loads (which exercises DataService)
  response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")

  if [ "$response" = "200" ]; then
    echo "✅ PASS"
    ((PASS++))
  else
    echo "❌ FAIL (HTTP $response)"
    ((FAIL++))
  fi
}

echo "📍 Route Tests"
echo "-------------"
test_endpoint "Week 1 Landing" "$BASE_URL/student/week/1"
test_endpoint "Week 1 Problems List" "$BASE_URL/student/week/1/problems"
test_endpoint "Problem Solver (Calculus MVT)" "$BASE_URL/student/week/1/problem/w1-mvt-001"
test_endpoint "Problem Solver (Calculus IVT)" "$BASE_URL/student/week/1/problem/w1-ivt-001"
test_endpoint "Problem Solver (Stats t-test)" "$BASE_URL/student/week/1/problem/w1-stats-001"
test_endpoint "Student Dashboard" "$BASE_URL/student"
test_endpoint "Admin Students Overview" "$BASE_URL/admin/students"
echo ""

echo "🗄️  DataService Integration Tests"
echo "--------------------------------"
test_data_service "/student/week/1/problems"
test_data_service "/student"
test_data_service "/admin/students"
echo ""

echo "📊 Summary"
echo "----------"
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️  Some tests failed. Check logs above."
  exit 1
fi
