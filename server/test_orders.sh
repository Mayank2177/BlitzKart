#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Order Management Endpoints${NC}"
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

# Step 2: Create an order
echo -e "${BLUE}2. Creating a new order...${NC}"
CREATE_ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "product_variant_id": 1,
        "quantity": 2
      },
      {
        "product_variant_id": 4,
        "quantity": 1
      }
    ]
  }')

echo "$CREATE_ORDER_RESPONSE" | jq '.'

if echo "$CREATE_ORDER_RESPONSE" | grep -q '"message":"Order created successfully"'; then
  echo -e "${GREEN}✅ Order created successfully${NC}\n"
  
  # Extract order ID
  ORDER_ID=$(echo "$CREATE_ORDER_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')
  
  if [ ! -z "$ORDER_ID" ]; then
    # Step 3: Get order by ID
    echo -e "${BLUE}3. Getting order by ID ($ORDER_ID)...${NC}"
    GET_ORDER_RESPONSE=$(curl -s "$BASE_URL/api/orders/$ORDER_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "$GET_ORDER_RESPONSE" | jq '.'
    echo -e "${GREEN}✅ Order retrieved${NC}\n"
    
    # Step 4: Get order with history
    echo -e "${BLUE}4. Getting order with status history...${NC}"
    ORDER_HISTORY_RESPONSE=$(curl -s "$BASE_URL/api/orders/$ORDER_ID/history" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "$ORDER_HISTORY_RESPONSE" | jq '.'
    echo -e "${GREEN}✅ Order history retrieved${NC}\n"
    
    # Step 5: Update order status (Admin operation)
    echo -e "${BLUE}5. Updating order status to 'processing'...${NC}"
    UPDATE_STATUS_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/orders/$ORDER_ID/status" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "status": "processing"
      }')
    
    echo "$UPDATE_STATUS_RESPONSE" | jq '.'
    
    if echo "$UPDATE_STATUS_RESPONSE" | grep -q '"message":"Order status updated successfully"'; then
      echo -e "${GREEN}✅ Order status updated${NC}\n"
    else
      echo -e "${RED}❌ Failed to update order status${NC}\n"
    fi
    
    # Step 6: Cancel order
    echo -e "${BLUE}6. Cancelling order...${NC}"
    CANCEL_RESPONSE=$(curl -s -X POST "$BASE_URL/api/orders/$ORDER_ID/cancel" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "$CANCEL_RESPONSE" | jq '.'
    
    if echo "$CANCEL_RESPONSE" | grep -q '"message":"Order cancelled successfully"'; then
      echo -e "${GREEN}✅ Order cancelled successfully${NC}\n"
    else
      echo -e "${RED}❌ Failed to cancel order (might be in non-cancellable status)${NC}\n"
    fi
  fi
else
  echo -e "${RED}❌ Failed to create order${NC}\n"
fi

# Step 7: Create another order for list testing
echo -e "${BLUE}7. Creating another order...${NC}"
CREATE_ORDER2_RESPONSE=$(curl -s -X POST "$BASE_URL/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [
      {
        "product_variant_id": 2,
        "quantity": 1
      }
    ]
  }')

echo "$CREATE_ORDER2_RESPONSE" | jq '.'

if echo "$CREATE_ORDER2_RESPONSE" | grep -q '"message":"Order created successfully"'; then
  echo -e "${GREEN}✅ Second order created${NC}\n"
else
  echo -e "${RED}❌ Failed to create second order${NC}\n"
fi

# Step 8: Get all user orders
echo -e "${BLUE}8. Getting all user orders...${NC}"
ALL_ORDERS_RESPONSE=$(curl -s "$BASE_URL/api/orders" \
  -H "Authorization: Bearer $TOKEN")

echo "$ALL_ORDERS_RESPONSE" | jq '.'
echo -e "${GREEN}✅ All orders retrieved${NC}\n"

# Step 9: Get orders with pagination
echo -e "${BLUE}9. Getting orders with pagination (page=1, limit=5)...${NC}"
PAGINATED_ORDERS=$(curl -s "$BASE_URL/api/orders?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

echo "$PAGINATED_ORDERS" | jq '.'
echo -e "${GREEN}✅ Paginated orders retrieved${NC}\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Order Management Tests Completed!${NC}"
echo -e "${BLUE}========================================${NC}"
