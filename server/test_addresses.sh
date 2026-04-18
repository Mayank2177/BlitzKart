#!/bin/bash

echo "=========================================="
echo "Testing Address Management"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8080/api"

# Step 1: Login to get token
echo "1. Getting JWT token..."
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

# Step 2: Create address
echo "2. Creating address..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/addresses" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA"
  }')

echo "Response: $CREATE_RESPONSE"
echo ""

# Step 3: Get all addresses
echo "3. Getting all addresses..."
GET_ALL_RESPONSE=$(curl -s -X GET "$BASE_URL/addresses" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_ALL_RESPONSE"
echo ""

echo "✓ Address management test complete!"
