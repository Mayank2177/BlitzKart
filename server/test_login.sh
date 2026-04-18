#!/bin/bash

echo "=========================================="
echo "Testing Login Endpoint"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8080/api"

echo "Attempting to login with test credentials..."
echo "Email: test@example.com"
echo "Password: password123"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP Status Code: $HTTP_CODE"
echo ""
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Login successful!"
    TOKEN=$(echo "$BODY" | jq -r '.data.access_token' 2>/dev/null)
    if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        echo "✓ JWT Token received: ${TOKEN:0:50}..."
    else
        echo "✗ No token in response"
    fi
else
    echo "✗ Login failed with status code: $HTTP_CODE"
fi
echo ""
