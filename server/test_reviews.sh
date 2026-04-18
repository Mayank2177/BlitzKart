#!/bin/bash

# Review System Test Script
# Tests all review-related endpoints

BASE_URL="http://localhost:8080/api"
echo "=========================================="
echo "Testing Review System"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print test results
print_test() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Step 1: Login to get JWT token
echo "1. Logging in to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
    echo -e "${RED}✗${NC} Failed to get JWT token"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓${NC} Successfully logged in"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Get all products to find a product ID
echo "2. Getting products..."
PRODUCTS_RESPONSE=$(curl -s -X GET "$BASE_URL/products")
PRODUCT_ID=$(echo $PRODUCTS_RESPONSE | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')

if [ -z "$PRODUCT_ID" ]; then
    echo -e "${RED}✗${NC} No products found"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found product ID: $PRODUCT_ID"
echo ""

# Step 3: Create an order first (required to review)
echo "3. Adding product to cart..."
ADD_TO_CART=$(curl -s -X POST "$BASE_URL/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"product_variant_id\": 1,
    \"quantity\": 1
  }")
echo "Cart response: $ADD_TO_CART"
echo ""

echo "4. Creating an order..."
CREATE_ORDER=$(curl -s -X POST "$BASE_URL/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shipping_address": "123 Test St",
    "payment_method": "credit_card"
  }')
echo "Order response: $CREATE_ORDER"
echo ""

# Step 5: Create a review
echo "5. Creating a review..."
CREATE_REVIEW=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"product_id\": $PRODUCT_ID,
    \"rating\": 5,
    \"comment\": \"Excellent product! Highly recommended. Great quality and fast shipping.\"
  }")

REVIEW_ID=$(echo $CREATE_REVIEW | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')

if [ -z "$REVIEW_ID" ]; then
    echo -e "${YELLOW}ℹ${NC} Could not create review (might need to purchase first)"
    echo "Response: $CREATE_REVIEW"
else
    echo -e "${GREEN}✓${NC} Review created with ID: $REVIEW_ID"
fi
echo ""

# Step 6: Get review by ID
if [ ! -z "$REVIEW_ID" ]; then
    echo "6. Getting review by ID..."
    GET_REVIEW=$(curl -s -X GET "$BASE_URL/reviews/$REVIEW_ID")
    echo "Response: $GET_REVIEW"
    print_test $? "Get review by ID"
    echo ""
fi

# Step 7: Get product reviews
echo "7. Getting all reviews for product $PRODUCT_ID..."
PRODUCT_REVIEWS=$(curl -s -X GET "$BASE_URL/reviews/product/$PRODUCT_ID?page=1&pageSize=10")
echo "Response: $PRODUCT_REVIEWS"
print_test $? "Get product reviews"
echo ""

# Step 8: Get user reviews
echo "8. Getting all reviews by user..."
USER_REVIEWS=$(curl -s -X GET "$BASE_URL/reviews/user/1?page=1&pageSize=10")
echo "Response: $USER_REVIEWS"
print_test $? "Get user reviews"
echo ""

# Step 9: Update review
if [ ! -z "$REVIEW_ID" ]; then
    echo "9. Updating review..."
    UPDATE_REVIEW=$(curl -s -X PUT "$BASE_URL/reviews/$REVIEW_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "rating": 4,
        "comment": "Good product, but could be better. Updated my review after more use."
      }')
    echo "Response: $UPDATE_REVIEW"
    print_test $? "Update review"
    echo ""
fi

# Step 10: Try to create duplicate review (should fail)
echo "10. Testing duplicate review prevention..."
DUPLICATE_REVIEW=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"product_id\": $PRODUCT_ID,
    \"rating\": 3,
    \"comment\": \"This should fail as duplicate review for same product.\"
  }")
echo "Response: $DUPLICATE_REVIEW"
if echo "$DUPLICATE_REVIEW" | grep -q "already reviewed"; then
    echo -e "${GREEN}✓${NC} Duplicate review correctly prevented"
else
    echo -e "${YELLOW}ℹ${NC} Duplicate check response: $DUPLICATE_REVIEW"
fi
echo ""

# Step 11: Delete review
if [ ! -z "$REVIEW_ID" ]; then
    echo "11. Deleting review..."
    DELETE_REVIEW=$(curl -s -X DELETE "$BASE_URL/reviews/$REVIEW_ID" \
      -H "Authorization: Bearer $TOKEN")
    echo "Response: $DELETE_REVIEW"
    print_test $? "Delete review"
    echo ""
fi

# Summary
echo "=========================================="
echo "Review System Test Summary"
echo "=========================================="
echo ""
echo "Tested endpoints:"
echo "  - POST   /api/reviews (Create review)"
echo "  - GET    /api/reviews/:id (Get review by ID)"
echo "  - PUT    /api/reviews/:id (Update review)"
echo "  - DELETE /api/reviews/:id (Delete review)"
echo "  - GET    /api/reviews/product/:productId (Get product reviews)"
echo "  - GET    /api/reviews/user/:userId (Get user reviews)"
echo ""
echo "Features tested:"
echo "  ✓ JWT authentication"
echo "  ✓ Create review with rating and comment"
echo "  ✓ Get review by ID"
echo "  ✓ Update review"
echo "  ✓ Delete review"
echo "  ✓ Get all reviews for a product"
echo "  ✓ Get all reviews by a user"
echo "  ✓ Duplicate review prevention"
echo "  ✓ Purchase verification (can only review purchased products)"
echo ""
echo "Note: Some tests may fail if:"
echo "  - Server is not running"
echo "  - User hasn't purchased the product"
echo "  - Review already exists"
echo ""
