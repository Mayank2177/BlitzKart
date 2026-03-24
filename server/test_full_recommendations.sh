#!/bin/bash

echo "=== Full Recommendation System Test ==="
echo ""

echo "1. Record search for 'laptop'"
curl -s -X POST http://localhost:8080/api/search/1 \
  -H "Content-Type: application/json" \
  -d '{"query":"laptop"}' | jq '.'
echo ""

echo "2. Record product views for user 1"
curl -s -X POST http://localhost:8080/api/product-view/1/1 | jq '.'
curl -s -X POST http://localhost:8080/api/product-view/1/2 | jq '.'
curl -s -X POST http://localhost:8080/api/product-view/1/3 | jq '.'
echo ""

echo "3. Get recommendations for user 1"
curl -s http://localhost:8080/api/recommendations/1 | jq '.'
echo ""

echo "4. Get search suggestions"
curl -s "http://localhost:8080/api/search-suggestions?q=lap" | jq '.'
echo ""

echo "5. Get reorder recommendations"
curl -s http://localhost:8080/api/reorder-recommendations/1 | jq '.'
echo ""

echo "=== Test Complete ==="
