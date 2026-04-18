# API Quick Reference Card

## Base URL
```
http://localhost:8080
```

## Quick Start
```bash
# 1. Start server
go run cmd/api/main.go

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# 3. Use token
curl http://localhost:8080/api/cart -H "Authorization: Bearer $TOKEN"
```

---

## All Endpoints (36 Total)

### 🌐 General (1)
```
GET  /                          Health check
```

### 🔐 Authentication (1)
```
POST /api/auth/login            Login (returns JWT token)
```

### 👥 Users (4)
```
GET    /api/users               Get all users
GET    /api/users/:id           Get user by ID
POST   /api/users               Create user
DELETE /api/users/:id           Delete user
```

### 📦 Products (7)
```
GET    /products                Get all products
GET    /products/:id            Get product by ID
GET    /products/search         Search products (?q=query)
GET    /products/category       Get by category (?category_id=1)
POST   /api/products 🔒         Create product
PUT    /api/products/:id 🔒     Update product
DELETE /api/products/:id 🔒     Delete product
```

### 🎯 Recommendations (5)
```
GET  /api/recommendations/:userId              Get recommendations
GET  /api/reorder-recommendations/:userId      Reorder suggestions
POST /api/search/:userId                       Record search
POST /api/product-view/:userId/:productId      Record view
GET  /api/search-suggestions                   Search suggestions (?q=query)
```

### 🛒 Cart (5) - All Protected 🔒
```
GET    /api/cart                Get cart
POST   /api/cart                Add to cart
PUT    /api/cart/items/:id      Update quantity
DELETE /api/cart/items/:id      Remove item
DELETE /api/cart                Clear cart
```

### 📋 Orders (6) - All Protected 🔒
```
POST /api/orders                 Create order
GET  /api/orders                 Get user's orders
GET  /api/orders/:id             Get order by ID
GET  /api/orders/:id/history     Get order history
PUT  /api/orders/:id/status      Update status (Admin)
POST /api/orders/:id/cancel      Cancel order
```

### 📊 Inventory (3) - Mock
```
GET  /inventory                  Get all inventory
GET  /inventory/:id              Get inventory by ID
POST /inventory                  Create inventory
```

### 🚚 Dispatch (3) - Mock
```
GET  /dispatch                   Get all dispatch
GET  /dispatch/:id               Get dispatch by ID
POST /dispatch                   Create dispatch
```

---

## Common Request Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:8080/products
curl "http://localhost:8080/products?limit=10"
curl "http://localhost:8080/products/search?q=laptop"
```

### Add to Cart (Protected)
```bash
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"product_variant_id":1,"quantity":2}'
```

### Create Order (Protected)
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"product_variant_id":1,"quantity":2}]}'
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Authentication

### Protected Endpoints (14)
All endpoints marked with 🔒 require JWT token:

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

**Get Token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')
```

---

## Test Credentials

```
Email: test@example.com
Password: password123
```

---

## Test Scripts

```bash
./test_all_routes.sh          # All endpoints
./test_cart.sh                # Cart only
./test_products.sh            # Products only
./test_orders.sh              # Orders only
./test_recommendations.sh     # Recommendations only
```

---

## Pagination

Most list endpoints support:
```
?page=1&limit=20
```

Example:
```bash
curl "http://localhost:8080/products?page=1&limit=10"
curl "http://localhost:8080/api/orders?page=2&limit=5" -H "Authorization: Bearer $TOKEN"
```

---

## Common Workflows

### 1. Browse Products
```bash
# Get all products
curl http://localhost:8080/products

# Search
curl "http://localhost:8080/products/search?q=laptop"

# Get by category
curl "http://localhost:8080/products/category?category_id=1"

# Get details
curl http://localhost:8080/products/1
```

### 2. Shopping Cart Flow
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# Add to cart
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"product_variant_id":1,"quantity":2}'

# View cart
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer $TOKEN"

# Update quantity
curl -X PUT http://localhost:8080/api/cart/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity":3}'
```

### 3. Checkout Flow
```bash
# Create order from cart
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"product_variant_id":1,"quantity":2}]}'

# View order
curl http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer $TOKEN"

# Track order history
curl http://localhost:8080/api/orders/1/history \
  -H "Authorization: Bearer $TOKEN"
```

---

## Tips

1. **Save Token**: Store JWT token in environment variable
   ```bash
   export TOKEN="your_jwt_token_here"
   curl http://localhost:8080/api/cart -H "Authorization: Bearer $TOKEN"
   ```

2. **Pretty Print**: Use `jq` for formatted JSON
   ```bash
   curl http://localhost:8080/products | jq '.'
   ```

3. **Debug**: Add `-v` flag to see full request/response
   ```bash
   curl -v http://localhost:8080/products
   ```

4. **Test All**: Run comprehensive tests
   ```bash
   ./test_all_routes.sh
   ```

---

## Need More Details?

See `API_ENDPOINTS.md` for complete documentation with:
- Detailed request/response examples
- All query parameters
- Error handling
- Postman collection structure
