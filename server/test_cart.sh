#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Cart Management Endpoints${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Login to get JWT token
echo -e "${BLUE}1. Logging in to get JWT token...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to get JWT token${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Get empty cart
echo -e "${BLUE}2. Getting cart (should be empty or existing)...${NC}"
CART_RESPONSE=$(curl -s -X GET "$BASE_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN")

echo "$CART_RESPONSE" | jq '.'
echo -e "${GREEN}✅ Cart retrieved${NC}\n"

# Step 3: Add item to cart (assuming product variant ID 1 exists)
echo -e "${BLUE}3. Adding item to cart (Product Variant ID: 1, Quantity: 2)...${NC}"
ADD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cart" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "product_variant_id": 1,
    "quantity": 2
  }')

echo "$ADD_RESPONSE" | jq '.'

if echo "$ADD_RESPONSE" | grep -q '"message":"Item added to cart successfully"'; then
  echo -e "${GREEN}✅ Item added to cart${NC}\n"
else
  echo -e "${RED}❌ Failed to add item to cart${NC}\n"
fi

# Step 4: Add another item to cart
echo -e "${BLUE}4. Adding another item to cart (Product Variant ID: 2, Quantity: 1)...${NC}"
ADD_RESPONSE2=$(curl -s -X POST "$BASE_URL/api/cart" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "product_variant_id": 2,
    "quantity": 1
  }')

echo "$ADD_RESPONSE2" | jq '.'

if echo "$ADD_RESPONSE2" | grep -q '"message":"Item added to cart successfully"'; then
  echo -e "${GREEN}✅ Second item added to cart${NC}\n"
else
  echo -e "${RED}❌ Failed to add second item${NC}\n"
fi

# Step 5: Get cart with items
echo -e "${BLUE}5. Getting cart with items...${NC}"
CART_WITH_ITEMS=$(curl -s -X GET "$BASE_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN")

echo "$CART_WITH_ITEMS" | jq '.'
echo -e "${GREEN}✅ Cart with items retrieved${NC}\n"

# Extract first cart item ID for update/delete operations
CART_ITEM_ID=$(echo "$CART_WITH_ITEMS" | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')

if [ -z "$CART_ITEM_ID" ]; then
  echo -e "${RED}❌ No cart items found to test update/delete${NC}"
else
  # Step 6: Update cart item quantity
  echo -e "${BLUE}6. Updating cart item $CART_ITEM_ID quantity to 5...${NC}"
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/cart/items/$CART_ITEM_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "quantity": 5
    }')

  echo "$UPDATE_RESPONSE" | jq '.'

  if echo "$UPDATE_RESPONSE" | grep -q '"message":"Cart item updated successfully"'; then
    echo -e "${GREEN}✅ Cart item updated${NC}\n"
  else
    echo -e "${RED}❌ Failed to update cart item${NC}\n"
  fi

  # Step 7: Remove cart item
  echo -e "${BLUE}7. Removing cart item $CART_ITEM_ID...${NC}"
  REMOVE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/cart/items/$CART_ITEM_ID" \
    -H "Authorization: Bearer $TOKEN")

  echo "$REMOVE_RESPONSE" | jq '.'

  if echo "$REMOVE_RESPONSE" | grep -q '"message":"Item removed from cart successfully"'; then
    echo -e "${GREEN}✅ Cart item removed${NC}\n"
  else
    echo -e "${RED}❌ Failed to remove cart item${NC}\n"
  fi
fi

# Step 8: Get cart after removal
echo -e "${BLUE}8. Getting cart after item removal...${NC}"
CART_AFTER_REMOVE=$(curl -s -X GET "$BASE_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN")

echo "$CART_AFTER_REMOVE" | jq '.'
echo -e "${GREEN}✅ Cart retrieved after removal${NC}\n"

# Step 9: Clear cart
echo -e "${BLUE}9. Clearing entire cart...${NC}"
CLEAR_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN")

echo "$CLEAR_RESPONSE" | jq '.'

if echo "$CLEAR_RESPONSE" | grep -q '"message":"Cart cleared successfully"'; then
  echo -e "${GREEN}✅ Cart cleared${NC}\n"
else
  echo -e "${RED}❌ Failed to clear cart${NC}\n"
fi

# Step 10: Get empty cart
echo -e "${BLUE}10. Getting cart after clearing (should be empty)...${NC}"
EMPTY_CART=$(curl -s -X GET "$BASE_URL/api/cart" \
  -H "Authorization: Bearer $TOKEN")

echo "$EMPTY_CART" | jq '.'
echo -e "${GREEN}✅ Empty cart retrieved${NC}\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Cart Management Tests Completed!${NC}"
echo -e "${BLUE}========================================${NC}"
