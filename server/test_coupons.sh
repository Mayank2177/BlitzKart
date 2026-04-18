#!/bin/bash

echo "=========================================="
echo "Testing Coupon System"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8080/api"

# Step 1: Test public endpoints (no auth needed)
echo "1. Getting active coupons..."
curl -s -X GET "$BASE_URL/coupons/active" | jq '.'
echo ""

# Step 2: Login to get token for admin operations
echo "2. Getting JWT token for admin operations..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

if [ -z "$TOKEN" ]; then
    echo "✗ Failed to get token"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "✓ Got token: ${TOKEN:0:20}..."
echo ""

# Step 3: Create a new coupon
echo "3. Creating new coupon..."
FUTURE_DATE=$(date -u -d "+30 days" +"%Y-%m-%dT%H:%M:%SZ")
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/coupons" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"SAVE20\",
    \"discount_type\": \"percentage\",
    \"discount_value\": 20,
    \"expires_at\": \"$FUTURE_DATE\"
  }")

echo "Response: $CREATE_RESPONSE"
COUPON_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')
echo ""

# Step 4: Validate the coupon
echo "4. Validating coupon..."
VALIDATE_RESPONSE=$(curl -s -X POST "$BASE_URL/coupons/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE20",
    "order_total": 100.00
  }')

echo "Response: $VALIDATE_RESPONSE"
echo ""

# Step 5: Get all coupons
echo "5. Getting all coupons..."
curl -s -X GET "$BASE_URL/coupons" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 6: Create fixed discount coupon
echo "6. Creating fixed discount coupon..."
CREATE_FIXED_RESPONSE=$(curl -s -X POST "$BASE_URL/coupons" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"FLAT10\",
    \"discount_type\": \"fixed\",
    \"discount_value\": 10,
    \"expires_at\": \"$FUTURE_DATE\"
  }")

echo "Response: $CREATE_FIXED_RESPONSE"
echo ""

# Step 7: Validate fixed discount coupon
echo "7. Validating fixed discount coupon..."
VALIDATE_FIXED_RESPONSE=$(curl -s -X POST "$BASE_URL/coupons/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "FLAT10",
    "order_total": 50.00
  }')

echo "Response: $VALIDATE_FIXED_RESPONSE"
echo ""

echo "✓ Coupon system test complete!"
