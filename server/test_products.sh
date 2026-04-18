#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Product Management Endpoints${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Get all products
echo -e "${BLUE}1. Getting all products...${NC}"
ALL_PRODUCTS=$(curl -s "$BASE_URL/products")
echo "$ALL_PRODUCTS" | jq '.'
echo -e "${GREEN}✅ All products retrieved${NC}\n"

# Step 2: Get all products with limit
echo -e "${BLUE}2. Getting products with limit=5...${NC}"
LIMITED_PRODUCTS=$(curl -s "$BASE_URL/products?limit=5")
echo "$LIMITED_PRODUCTS" | jq '.'
echo -e "${GREEN}✅ Limited products retrieved${NC}\n"

# Step 3: Get product by ID
echo -e "${BLUE}3. Getting product by ID (ID: 1)...${NC}"
PRODUCT_DETAIL=$(curl -s "$BASE_URL/products/1")
echo "$PRODUCT_DETAIL" | jq '.'
echo -e "${GREEN}✅ Product detail retrieved${NC}\n"

# Step 4: Search products
echo -e "${BLUE}4. Searching products (query: laptop)...${NC}"
SEARCH_RESULTS=$(curl -s "$BASE_URL/products/search?q=laptop")
echo "$SEARCH_RESULTS" | jq '.'
echo -e "${GREEN}✅ Search results retrieved${NC}\n"

# Step 5: Get products by category
echo -e "${BLUE}5. Getting products by category (Category ID: 1)...${NC}"
CATEGORY_PRODUCTS=$(curl -s "$BASE_URL/products/category?category_id=1")
echo "$CATEGORY_PRODUCTS" | jq '.'
echo -e "${GREEN}✅ Category products retrieved${NC}\n"

# Step 6: Login to get JWT token for protected routes
echo -e "${BLUE}6. Logging in to get JWT token...${NC}"
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

# Step 7: Create a new product
echo -e "${BLUE}7. Creating a new product...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "This is a test product created via API",
    "sku": "TEST-PROD-001",
    "price": 99.99,
    "category_id": 1
  }')

echo "$CREATE_RESPONSE" | jq '.'

if echo "$CREATE_RESPONSE" | grep -q '"message":"Product created successfully"'; then
  echo -e "${GREEN}✅ Product created successfully${NC}\n"
  
  # Extract product ID for update/delete
  PRODUCT_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')
  
  if [ ! -z "$PRODUCT_ID" ]; then
    # Step 8: Update the product
    echo -e "${BLUE}8. Updating product ID $PRODUCT_ID...${NC}"
    UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/products/$PRODUCT_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "name": "Updated Test Product",
        "price": 149.99
      }')
    
    echo "$UPDATE_RESPONSE" | jq '.'
    
    if echo "$UPDATE_RESPONSE" | grep -q '"message":"Product updated successfully"'; then
      echo -e "${GREEN}✅ Product updated successfully${NC}\n"
    else
      echo -e "${RED}❌ Failed to update product${NC}\n"
    fi
    
    # Step 9: Get the updated product
    echo -e "${BLUE}9. Getting updated product details...${NC}"
    UPDATED_PRODUCT=$(curl -s "$BASE_URL/products/$PRODUCT_ID")
    echo "$UPDATED_PRODUCT" | jq '.'
    echo -e "${GREEN}✅ Updated product retrieved${NC}\n"
    
    # Step 10: Delete the product
    echo -e "${BLUE}10. Deleting product ID $PRODUCT_ID...${NC}"
    DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/products/$PRODUCT_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "$DELETE_RESPONSE" | jq '.'
    
    if echo "$DELETE_RESPONSE" | grep -q '"message":"Product deleted successfully"'; then
      echo -e "${GREEN}✅ Product deleted successfully${NC}\n"
    else
      echo -e "${RED}❌ Failed to delete product${NC}\n"
    fi
  fi
else
  echo -e "${RED}❌ Failed to create product${NC}\n"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Product Management Tests Completed!${NC}"
echo -e "${BLUE}========================================${NC}"
