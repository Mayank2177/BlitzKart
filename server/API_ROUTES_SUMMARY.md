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
| POST | `/api/products` | Create product | Yes (JWT) | ✅ Working |

**Examples:**
```bash
# Get all products
curl http://localhost:8080/products

# Get product by ID
curl http://localhost:8080/products/1

# Create product (requires JWT)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"New Product","price":99.99,"sku":"PROD-001","category_id":1}'
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
| GET | `/api/orders/:id` | Get order by ID | Yes (JWT) | ✅ Working |

**Examples:**
```bash
# Create order (requires JWT)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"user_id":1,"total":100}'

# Get order (requires JWT)
curl http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 7. Inventory Routes ✅
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

### 8. Dispatch Routes ✅
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

## Routes Folder Structure

```
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

---

## Protected Routes

Routes marked with 🔒 require JWT authentication:
- `POST /api/products` 🔒
- `POST /api/orders` 🔒
- `GET /api/orders/:id` 🔒

To access protected routes, include the JWT token in the Authorization header:
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Total Endpoints: 23

- ✅ All routes working
- ✅ Routes folder properly integrated
- ✅ Recommendation system functional
- ✅ Protected routes secured with JWT

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
