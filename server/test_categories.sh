#!/bin/bash

echo "=========================================="
echo "Testing Category Management"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8080/api"

# Step 1: Test public endpoints (no auth needed)
echo "1. Getting all categories..."
curl -s -X GET "$BASE_URL/categories" | jq '.'
echo ""

echo "2. Getting category tree..."
curl -s -X GET "$BASE_URL/categories/tree" | jq '.'
echo ""

# Step 3: Login to get token for admin operations
echo "3. Getting JWT token for admin operations..."
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

# Step 4: Create a new category
echo "4. Creating new category..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "slug": "test-category"
  }')

echo "Response: $CREATE_RESPONSE"
CATEGORY_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')
echo ""

# Step 5: Get category by ID
if [ ! -z "$CATEGORY_ID" ]; then
    echo "5. Getting category by ID ($CATEGORY_ID)..."
    curl -s -X GET "$BASE_URL/categories/$CATEGORY_ID" | jq '.'
    echo ""
fi

# Step 6: Update category
if [ ! -z "$CATEGORY_ID" ]; then
    echo "6. Updating category..."
    curl -s -X PUT "$BASE_URL/categories/$CATEGORY_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Updated Test Category",
        "slug": "updated-test-category"
      }' | jq '.'
    echo ""
fi

echo "✓ Category management test complete!"
