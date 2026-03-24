#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=========================================="
echo "   TESTING ALL API ROUTES"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${BLUE}Testing: ${description}${NC}"
    echo "  ${method} ${endpoint}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${BASE_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${BASE_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -d "${data}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓ Status: ${http_code}${NC}"
        echo "  Response: $(echo $body | jq -c '.' 2>/dev/null || echo $body)"
    else
        echo -e "  ${RED}✗ Status: ${http_code}${NC}"
        echo "  Response: $(echo $body | jq -c '.' 2>/dev/null || echo $body)"
    fi
    echo ""
}

echo "=========================================="
echo "1. GENERAL ROUTES"
echo "=========================================="
test_endpoint "GET" "/" "" "Welcome/Health Check"

echo "=========================================="
echo "2. AUTHENTICATION ROUTES"
echo "=========================================="
test_endpoint "POST" "/api/auth/login" '{"email":"test@example.com","password":"password123"}' "User Login"

echo "=========================================="
echo "3. USER ROUTES"
echo "=========================================="
test_endpoint "GET" "/api/users" "" "Get All Users"
test_endpoint "POST" "/api/users" '{"email":"newuser@test.com","first_name":"John","last_name":"Doe","password":"pass123"}' "Create User"
test_endpoint "GET" "/api/users/1" "" "Get User by ID"
test_endpoint "PUT" "/api/users/1" '{"first_name":"Jane","last_name":"Smith"}' "Update User"

echo "=========================================="
echo "4. PRODUCT ROUTES (Public)"
echo "=========================================="
test_endpoint "GET" "/products" "" "Get All Products"
test_endpoint "GET" "/products/1" "" "Get Product by ID"

echo "=========================================="
echo "5. RECOMMENDATION ROUTES"
echo "=========================================="
test_endpoint "POST" "/api/search/1" '{"query":"laptop"}' "Record Search"
test_endpoint "POST" "/api/product-view/1/1" "" "Record Product View"
test_endpoint "GET" "/api/recommendations/1" "" "Get Recommendations"
test_endpoint "GET" "/api/recommendations/1?limit=5" "" "Get Recommendations (Limited)"
test_endpoint "GET" "/api/search-suggestions?q=lap" "" "Get Search Suggestions"
test_endpoint "GET" "/api/reorder-recommendations/1" "" "Get Reorder Recommendations"

echo "=========================================="
echo "6. INVENTORY ROUTES"
echo "=========================================="
test_endpoint "GET" "/inventory" "" "Get All Inventory"
test_endpoint "GET" "/inventory/1" "" "Get Inventory by ID"
test_endpoint "POST" "/inventory" '{"title":"Test Item","artist":"Test Artist","price":99.99}' "Create Inventory"

echo "=========================================="
echo "7. DISPATCH ROUTES"
echo "=========================================="
test_endpoint "GET" "/dispatch" "" "Get All Dispatch"
test_endpoint "GET" "/dispatch/1" "" "Get Dispatch by ID"
test_endpoint "POST" "/dispatch" '{"order_id":"ORD123","status":"Processing","location":"Warehouse"}' "Create Dispatch"

echo "=========================================="
echo "8. PROTECTED ROUTES (Without JWT - Should Fail)"
echo "=========================================="
test_endpoint "POST" "/api/products" '{"name":"Test Product","price":99.99,"sku":"TEST-001","category_id":1}' "Create Product (Protected)"
test_endpoint "POST" "/api/orders" '{"user_id":1,"total":100}' "Create Order (Protected)"
test_endpoint "GET" "/api/orders/1" "" "Get Order (Protected)"

echo "=========================================="
echo "   TEST SUMMARY"
echo "=========================================="
echo "All routes have been tested!"
echo "Note: Protected routes will return 401 without valid JWT token"
echo ""
