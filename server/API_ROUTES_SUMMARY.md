# API Routes Summary - BlitzKart Backend

## ✅ Routes Folder Status: WORKING

All routes are now organized in `server/internal/routes/` folder and properly connected.

---

## How to Test All Routes

### Start the Server
```bash
cd server
go run cmd/api/main.go
```

### Run Comprehensive Test
```bash
cd server
./test_all_routes.sh
```

---

## All Available Endpoints

### 1. General Routes ✅
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/` | Welcome/Health check | ✅ Working |

---

### 2. Authentication Routes ✅
| Method | Endpoint | Description | Body | Status |
|--------|----------|-------------|------|--------|
| POST | `/api/auth/login` | User login | `{"email":"test@example.com","password":"password123"}` | ✅ Working |

**Example:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

### 3. User Routes ✅
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | ✅ Working |
| GET | `/api/users/:id` | Get user by ID | ✅ Working |
| POST | `/api/users` | Create new user | ✅ Working |
| PUT | `/api/users/:id` | Update user | ✅ Working |
| DELETE | `/api/users/:id` | Delete user | ✅ Working |

**Examples:**
```bash
# Get all users
curl http://localhost:8080/api/users

# Get user by ID
curl http://localhost:8080/api/users/1

# Create user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","first_name":"John","last_name":"Doe","phone_number":"1234567890","password":"pass123"}'
```

---

### 4. Product Routes ✅
| Method | Endpoint | Description | Protected | Status |
|--------|----------|-------------|-----------|--------|
| GET | `/products` | Get all products | No | ✅ Working |
| GET | `/products/:id` | Get product by ID | No | ✅ Working |
| GET | `/products/search` | Search products by name | No | ✅ Working |
| GET | `/products/category` | Get products by category | No | ✅ Working |
| POST | `/api/products` | Create product | Yes (JWT) | ✅ Working |
| PUT | `/api/products/:id` | Update product | Yes (JWT) | ✅ Working |
| DELETE | `/api/products/:id` | Delete product | Yes (JWT) | ✅ Working |

**Examples:**
```bash
# Get all products
curl http://localhost:8080/products

# Get all products with limit
curl "http://localhost:8080/products?limit=10"

# Get product by ID
curl http://localhost:8080/products/1

# Search products
curl "http://localhost:8080/products/search?q=laptop"

# Get products by category
curl "http://localhost:8080/products/category?category_id=1"

# Create product (requires JWT)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name":"New Product",
    "description":"Product description",
    "sku":"PROD-001",
    "price":99.99,
    "category_id":1
  }'

# Update product (requires JWT)
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name":"Updated Product",
    "price":149.99
  }'

# Delete product (requires JWT)
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Recommendation Routes ✅
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/recommendations/:userId` | Get personalized recommendations | ✅ Working |
| GET | `/api/reorder-recommendations/:userId` | Get reorder recommendations | ✅ Working |
| POST | `/api/search/:userId` | Record user search | ✅ Working |
| POST | `/api/product-view/:userId/:productId` | Record product view | ✅ Working |
| GET | `/api/search-suggestions?q=query` | Get search suggestions | ✅ Working |

**Examples:**
```bash
# Get recommendations
curl http://localhost:8080/api/recommendations/1

# Get recommendations with limit
curl "http://localhost:8080/api/recommendations/1?limit=5"

# Record search
curl -X POST http://localhost:8080/api/search/1 \
  -H "Content-Type: application/json" \
  -d '{"query":"laptop"}'

# Record product view
curl -X POST http://localhost:8080/api/product-view/1/5

# Get search suggestions
curl "http://localhost:8080/api/search-suggestions?q=lap"

# Get reorder recommendations
curl http://localhost:8080/api/reorder-recommendations/1
```

---

### 6. Order Routes ✅
| Method | Endpoint | Description | Protected | Status |
|--------|----------|-------------|-----------|--------|
| POST | `/api/orders` | Create order | Yes (JWT) | ✅ Working |
| GET | `/api/orders` | Get user's orders | Yes (JWT) | ✅ Working |
| GET | `/api/orders/:id` | Get order by ID | Yes (JWT) | ✅ Working |
| GET | `/api/orders/:id/history` | Get order with status history | Yes (JWT) | ✅ Working |
| PUT | `/api/orders/:id/status` | Update order status (Admin) | Yes (JWT) | ✅ Working |
| POST | `/api/orders/:id/cancel` | Cancel order | Yes (JWT) | ✅ Working |

**Examples:**
```bash
# Create order (requires JWT)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {"product_variant_id": 1, "quantity": 2},
      {"product_variant_id": 4, "quantity": 1}
    ]
  }'

# Get user's orders (requires JWT)
curl http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get orders with pagination
curl "http://localhost:8080/api/orders?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get order by ID (requires JWT)
curl http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get order with history
curl http://localhost:8080/api/orders/1/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update order status (Admin, requires JWT)
curl -X PUT http://localhost:8080/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status":"processing"}'

# Cancel order (requires JWT)
curl -X POST http://localhost:8080/api/orders/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 7. Cart Routes ✅
| Method | Endpoint | Description | Protected | Status |
|--------|----------|-------------|-----------|--------|
| GET | `/api/cart` | Get user's cart | Yes (JWT) | ✅ Working |
| POST | `/api/cart` | Add item to cart | Yes (JWT) | ✅ Working |
| PUT | `/api/cart/items/:id` | Update cart item quantity | Yes (JWT) | ✅ Working |
| DELETE | `/api/cart/items/:id` | Remove item from cart | Yes (JWT) | ✅ Working |
| DELETE | `/api/cart` | Clear entire cart | Yes (JWT) | ✅ Working |

**Examples:**
```bash
# Get cart (requires JWT)
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add item to cart (requires JWT)
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"product_variant_id":1,"quantity":2}'

# Update cart item quantity (requires JWT)
curl -X PUT http://localhost:8080/api/cart/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"quantity":5}'

# Remove item from cart (requires JWT)
curl -X DELETE http://localhost:8080/api/cart/items/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Clear cart (requires JWT)
curl -X DELETE http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 8. Inventory Routes ✅
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/inventory` | Get all inventory | ✅ Working |
| GET | `/inventory/:id` | Get inventory by ID | ✅ Working |
| POST | `/inventory` | Create inventory | ✅ Working |

**Examples:**
```bash
# Get all inventory
curl http://localhost:8080/inventory

# Get inventory by ID
curl http://localhost:8080/inventory/1

# Create inventory
curl -X POST http://localhost:8080/inventory \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Item","artist":"Test Artist","price":99.99}'
```

---

### 9. Dispatch Routes ✅
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/dispatch` | Get all dispatch | ✅ Working |
| GET | `/dispatch/:id` | Get dispatch by ID | ✅ Working |
| POST | `/dispatch` | Create dispatch | ✅ Working |

**Examples:**
```bash
# Get all dispatch
curl http://localhost:8080/dispatch

# Get dispatch by ID
curl http://localhost:8080/dispatch/1

# Create dispatch
curl -X POST http://localhost:8080/dispatch \
  -H "Content-Type: application/json" \
  -d '{"order_id":"ORD123","status":"Processing","location":"Warehouse"}'
```

---
server/internal/routes/
├── routes.go                    # Main routes setup
├── auth_routes.go              # Authentication routes
├── user_routes.go              # User management routes
├── product_routes.go           # Product routes
├── order_routes.go             # Order routes (protected)
├── recommendation_routes.go    # Recommendation routes
├── inventory_routes.go         # Inventory routes
└── dispatch_routes.go          # Dispatch routes
```

---

## Test Scripts Available

1. **test_all_routes.sh** - Tests all endpoints
2. **test_full_recommendations.sh** - Tests recommendation system
3. **test_recommendations.sh** - Basic recommendation tests
4. **test_cart.sh** - Tests cart management endpoints
5. **test_products.sh** - Tests product management endpoints
6. **test_orders.sh** - Tests order management endpoints

---

## Protected Routes

Routes marked with 🔒 require JWT authentication:
- `POST /api/products` 🔒
- `PUT /api/products/:id` 🔒
- `DELETE /api/products/:id` 🔒
- `POST /api/orders` 🔒
- `GET /api/orders` 🔒
- `GET /api/orders/:id` 🔒
- `GET /api/orders/:id/history` 🔒
- `PUT /api/orders/:id/status` 🔒 (Admin)
- `POST /api/orders/:id/cancel` 🔒
- `GET /api/cart` 🔒
- `POST /api/cart` 🔒
- `PUT /api/cart/items/:id` 🔒
- `DELETE /api/cart/items/:id` 🔒
- `DELETE /api/cart` 🔒

To access protected routes, include the JWT token in the Authorization header:
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Total Endpoints: 36

- ✅ All routes working
- ✅ Routes folder properly integrated
- ✅ Recommendation system functional
- ✅ Protected routes secured with JWT
- ✅ Cart management fully implemented
- ✅ Product management with full CRUD operations
- ✅ Order management with complete workflow

---

## Quick Start

```bash
# 1. Start server
cd server
go run cmd/api/main.go

# 2. Test all routes
./test_all_routes.sh

# 3. Test recommendations specifically
./test_full_recommendations.sh
```
