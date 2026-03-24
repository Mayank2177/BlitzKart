#!/bin/bash

echo "=== Testing Recommendation Endpoints ==="
echo ""

echo "1. Testing GET /api/recommendations/1"
curl -s http://localhost:8080/api/recommendations/1 | jq '.'
echo ""

echo "2. Testing POST /api/search/1 (Record Search)"
curl -s -X POST http://localhost:8080/api/search/1 \
  -H "Content-Type: application/json" \
  -d '{"query":"laptop"}' | jq '.'
echo ""

echo "3. Testing POST /api/product-view/1/5 (Record Product View)"
curl -s -X POST http://localhost:8080/api/product-view/1/5 | jq '.'
echo ""

echo "4. Testing GET /api/search-suggestions?q=lap"
curl -s "http://localhost:8080/api/search-suggestions?q=lap" | jq '.'
echo ""

echo "5. Testing GET /api/reorder-recommendations/1"
curl -s http://localhost:8080/api/reorder-recommendations/1 | jq '.'
echo ""

echo "=== All Tests Complete ==="
