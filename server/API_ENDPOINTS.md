# Complete API Endpoints Reference

## Base URL
```
http://localhost:8080
```

---

## 1. General Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Welcome/Health check | No |

**Example:**
```bash
curl http://localhost:8080/
```

---

## 2. Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com",
      "first_name": "Test",
      "last_name": "User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 3. User Management Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | No |
| GET | `/api/users/:id` | Get user by ID | No |
| POST | `/api/users` | Create new user | No |
| DELETE | `/api/users/:id` | Delete user | No |

### Get All Users
```bash
curl http://localhost:8080/api/users
```

### Get User by ID
```bash
curl http://localhost:8080/api/users/1
```

### Create User
**Request Body:**
```json
{
  "email": "newuser@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "1234567890",
  "password": "password123"
}
```

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","first_name":"John","last_name":"Doe","phone_number":"1234567890","password":"password123"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:8080/api/users/1
```

---

## 4. Product Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get product by ID | No |
| GET | `/products/search` | Search products | No |
| GET | `/products/category` | Get products by category | No |
| POST | `/api/products` | Create product | Yes (JWT) |
| PUT | `/api/products/:id` | Update product | Yes (JWT) |
| DELETE | `/api/products/:id` | Delete product | Yes (JWT) |

### Get All Products
```bash
# Get all products
curl http://localhost:8080/products

# With limit
curl "http://localhost:8080/products?limit=10"
```

### Get Product by ID
```bash
curl http://localhost:8080/products/1
```

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Laptop Pro 15",
    "description": "High-performance laptop",
    "sku": "LAPTOP-001",
    "price": 1299.99,
    "category_id": 1,
    "category": {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics"
    },
    "variants": [
      {
        "id": 1,
        "sku": "LAPTOP-001-16GB",
        "price": 1299.99,
        "stock": 30
      }
    ],
    "images": []
  }
}
```

### Search Products
```bash
curl "http://localhost:8080/products/search?q=laptop"
curl "http://localhost:8080/products/search?q=laptop&limit=5"
```

### Get Products by Category
```bash
curl "http://localhost:8080/products/category?category_id=1"
curl "http://localhost:8080/products/category?category_id=1&limit=20"
```

### Create Product (Protected)
**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "sku": "PROD-001",
  "price": 99.99,
  "category_id": 1
}
```

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"New Product","description":"Product description","sku":"PROD-001","price":99.99,"category_id":1}'
```

### Update Product (Protected)
**Request Body:**
```json
{
  "name": "Updated Product",
  "price": 149.99
}
```

```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Updated Product","price":149.99}'
```

### Delete Product (Protected)
```bash
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 5. Recommendation Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/recommendations/:userId` | Get personalized recommendations | No |
| GET | `/api/reorder-recommendations/:userId` | Get reorder recommendations | No |
| POST | `/api/search/:userId` | Record user search | No |
| POST | `/api/product-view/:userId/:productId` | Record product view | No |
| GET | `/api/search-suggestions` | Get search suggestions | No |

### Get Recommendations
```bash
curl http://localhost:8080/api/recommendations/1
curl "http://localhost:8080/api/recommendations/1?limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "recommendations": [
      {
        "product_id": 5,
        "name": "Wireless Mouse",
        "price": 29.99,
        "reason": "Based on your browsing history"
      }
    ],
    "total_count": 10
  }
}
```

### Get Reorder Recommendations
```bash
curl http://localhost:8080/api/reorder-recommendations/1
curl "http://localhost:8080/api/reorder-recommendations/1?limit=5"
```

### Record Search
**Request Body:**
```json
{
  "query": "laptop"
}
```

```bash
curl -X POST http://localhost:8080/api/search/1 \
  -H "Content-Type: application/json" \
  -d '{"query":"laptop"}'
```

### Record Product View
```bash
curl -X POST http://localhost:8080/api/product-view/1/5
```

### Get Search Suggestions
```bash
curl "http://localhost:8080/api/search-suggestions?q=lap"
```

---

## 6. Cart Routes (All Protected)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | Yes (JWT) |
| POST | `/api/cart` | Add item to cart | Yes (JWT) |
| PUT | `/api/cart/items/:id` | Update cart item quantity | Yes (JWT) |
| DELETE | `/api/cart/items/:id` | Remove item from cart | Yes (JWT) |
| DELETE | `/api/cart` | Clear entire cart | Yes (JWT) |

### Get Cart
```bash
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "items": [
      {
        "id": 1,
        "product_variant_id": 1,
        "product_name": "Laptop Pro 15",
        "product_sku": "LAPTOP-001",
        "variant_sku": "LAPTOP-001-16GB",
        "price": 1299.99,
        "quantity": 2,
        "subtotal": 2599.98,
        "stock": 30
      }
    ],
    "total": 2599.98,
    "item_count": 2
  }
}
```

### Add to Cart
**Request Body:**
```json
{
  "product_variant_id": 1,
  "quantity": 2
}
```

```bash
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"product_variant_id":1,"quantity":2}'
```

### Update Cart Item
**Request Body:**
```json
{
  "quantity": 5
}
```

```bash
curl -X PUT http://localhost:8080/api/cart/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"quantity":5}'
```

### Remove Cart Item
```bash
curl -X DELETE http://localhost:8080/api/cart/items/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Clear Cart
```bash
curl -X DELETE http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 7. Order Routes (All Protected)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create order | Yes (JWT) |
| GET | `/api/orders` | Get user's orders | Yes (JWT) |
| GET | `/api/orders/:id` | Get order by ID | Yes (JWT) |
| GET | `/api/orders/:id/history` | Get order with status history | Yes (JWT) |
| PUT | `/api/orders/:id/status` | Update order status (Admin) | Yes (JWT) |
| POST | `/api/orders/:id/cancel` | Cancel order | Yes (JWT) |

### Create Order
**Request Body:**
```json
{
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
}
```

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"items":[{"product_variant_id":1,"quantity":2},{"product_variant_id":4,"quantity":1}]}'
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_price": 2629.97,
    "status": "pending",
    "items": [
      {
        "id": 1,
        "product_variant_id": 1,
        "product_name": "Laptop Pro 15",
        "product_sku": "LAPTOP-001",
        "variant_sku": "LAPTOP-001-16GB",
        "quantity": 2,
        "price": 1299.99,
        "subtotal": 2599.98
      }
    ],
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

### Get User's Orders
```bash
# Get all orders
curl http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# With pagination
curl "http://localhost:8080/api/orders?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Order by ID
```bash
curl http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Order with History
```bash
curl http://localhost:8080/api/orders/1/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": { /* order details */ },
    "history": [
      {
        "id": 1,
        "order_id": 1,
        "status": "pending",
        "updated_at": "2024-01-01T10:00:00Z"
      },
      {
        "id": 2,
        "order_id": 1,
        "status": "processing",
        "updated_at": "2024-01-01T11:00:00Z"
      }
    ]
  }
}
```

### Update Order Status (Admin)
**Request Body:**
```json
{
  "status": "processing"
}
```

Valid statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

```bash
curl -X PUT http://localhost:8080/api/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status":"processing"}'
```

### Cancel Order
```bash
curl -X POST http://localhost:8080/api/orders/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 8. Inventory Routes (Mock)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/inventory` | Get all inventory | No |
| GET | `/inventory/:id` | Get inventory by ID | No |
| POST | `/inventory` | Create inventory | No |

```bash
curl http://localhost:8080/inventory
curl http://localhost:8080/inventory/1
```

---

## 9. Dispatch Routes (Mock)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dispatch` | Get all dispatch | No |
| GET | `/dispatch/:id` | Get dispatch by ID | No |
| POST | `/dispatch` | Create dispatch | No |

```bash
curl http://localhost:8080/dispatch
curl http://localhost:8080/dispatch/1
```

---

## Summary

### Total Endpoints: 36

#### By Category:
- **General**: 1 endpoint
- **Authentication**: 1 endpoint
- **Users**: 4 endpoints
- **Products**: 7 endpoints
- **Recommendations**: 5 endpoints
- **Cart**: 5 endpoints (all protected)
- **Orders**: 6 endpoints (all protected)
- **Inventory**: 3 endpoints (mock)
- **Dispatch**: 3 endpoints (mock)

#### By Authentication:
- **Public**: 22 endpoints
- **Protected (JWT)**: 14 endpoints

---

## Authentication

### Getting a JWT Token

1. **Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

2. **Extract Token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')
```

3. **Use Token:**
```bash
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid JWT)
- **404**: Not Found
- **500**: Internal Server Error

---

## Testing

### Test Scripts Available:
```bash
./test_all_routes.sh          # Test all endpoints
./test_cart.sh                # Test cart endpoints
./test_products.sh            # Test product endpoints
./test_orders.sh              # Test order endpoints
./test_recommendations.sh     # Test recommendation endpoints
```

### Quick Test:
```bash
# Start server
go run cmd/api/main.go

# Test health check
curl http://localhost:8080/

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test products
curl http://localhost:8080/products
```

---

## Postman Collection

You can import these endpoints into Postman using this structure:

```
BlitzKart API
├── General
│   └── Health Check (GET /)
├── Authentication
│   └── Login (POST /api/auth/login)
├── Users
│   ├── Get All Users (GET /api/users)
│   ├── Get User (GET /api/users/:id)
│   ├── Create User (POST /api/users)
│   └── Delete User (DELETE /api/users/:id)
├── Products
│   ├── Get All Products (GET /products)
│   ├── Get Product (GET /products/:id)
│   ├── Search Products (GET /products/search)
│   ├── Get by Category (GET /products/category)
│   ├── Create Product (POST /api/products) 🔒
│   ├── Update Product (PUT /api/products/:id) 🔒
│   └── Delete Product (DELETE /api/products/:id) 🔒
├── Cart 🔒
│   ├── Get Cart (GET /api/cart)
│   ├── Add to Cart (POST /api/cart)
│   ├── Update Item (PUT /api/cart/items/:id)
│   ├── Remove Item (DELETE /api/cart/items/:id)
│   └── Clear Cart (DELETE /api/cart)
├── Orders 🔒
│   ├── Create Order (POST /api/orders)
│   ├── Get Orders (GET /api/orders)
│   ├── Get Order (GET /api/orders/:id)
│   ├── Get History (GET /api/orders/:id/history)
│   ├── Update Status (PUT /api/orders/:id/status)
│   └── Cancel Order (POST /api/orders/:id/cancel)
└── Recommendations
    ├── Get Recommendations (GET /api/recommendations/:userId)
    ├── Reorder Recommendations (GET /api/reorder-recommendations/:userId)
    ├── Record Search (POST /api/search/:userId)
    ├── Record View (POST /api/product-view/:userId/:productId)
    └── Search Suggestions (GET /api/search-suggestions)
```

🔒 = Requires JWT Authentication

---

## Notes

1. **Base URL**: All endpoints use `http://localhost:8080` as the base URL
2. **Content-Type**: Always use `application/json` for POST/PUT requests
3. **Authorization**: Protected endpoints require `Authorization: Bearer <token>` header
4. **Pagination**: Most list endpoints support `?page=1&limit=20` query parameters
5. **Test User**: Email: `test@example.com`, Password: `password123`
