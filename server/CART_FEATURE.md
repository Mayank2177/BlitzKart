# Cart Management Feature

## Overview
Complete shopping cart management system with JWT authentication, stock validation, and comprehensive CRUD operations.

## Features Implemented

### 1. Cart Operations
- ✅ Get user's cart (auto-creates if doesn't exist)
- ✅ Add items to cart
- ✅ Update item quantities
- ✅ Remove individual items
- ✅ Clear entire cart

### 2. Business Logic
- ✅ Stock validation before adding/updating items
- ✅ Automatic quantity increment for duplicate items
- ✅ User ownership verification for all operations
- ✅ Real-time cart total and item count calculation
- ✅ Product variant support with pricing

### 3. Security
- ✅ All endpoints protected with JWT authentication
- ✅ User can only access their own cart
- ✅ Cart items verified to belong to requesting user

## Architecture

### Files Created/Modified

#### DTOs
- `server/internal/dto/cart_dto.go` - Request/Response structures

#### Repositories
- `server/internal/repositories/cart_repo.go` - Cart data access layer
- `server/internal/repositories/product_variant_repo.go` - Product variant operations

#### Services
- `server/internal/services/cart_service.go` - Business logic layer

#### Handlers
- `server/internal/handlers/cart_handler.go` - HTTP request handlers

#### Routes
- `server/internal/routes/cart_routes.go` - Route definitions

#### Modified Files
- `server/cmd/api/main.go` - Wired up cart dependencies
- `server/internal/routes/routes.go` - Added cart handler initialization
- `server/API_ROUTES_SUMMARY.md` - Updated documentation

## API Endpoints

### GET /api/cart
Get the authenticated user's shopping cart.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "status": "success",
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "items": [
      {
        "id": 1,
        "product_variant_id": 1,
        "product_name": "Laptop",
        "product_sku": "LAP-001",
        "variant_sku": "LAP-001-16GB",
        "price": 999.99,
        "quantity": 2,
        "subtotal": 1999.98,
        "stock": 50,
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-01-01T10:00:00Z"
      }
    ],
    "total": 1999.98,
    "item_count": 2,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

### POST /api/cart
Add an item to the cart.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_variant_id": 1,
  "quantity": 2
}
```

**Validation:**
- `product_variant_id`: Required, must exist
- `quantity`: Required, minimum 1, must not exceed stock

**Response:** Same as GET /api/cart

### PUT /api/cart/items/:id
Update the quantity of a cart item.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 5
}
```

**Validation:**
- `quantity`: Required, minimum 1, must not exceed stock
- Cart item must belong to authenticated user

**Response:** Same as GET /api/cart

### DELETE /api/cart/items/:id
Remove a specific item from the cart.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** Same as GET /api/cart (with item removed)

### DELETE /api/cart
Clear all items from the cart.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "status": "success",
  "message": "Cart cleared successfully",
  "data": null
}
```

## Testing

### Run Cart Tests
```bash
cd server
./test_cart.sh
```

The test script will:
1. Login and get JWT token
2. Get empty/existing cart
3. Add multiple items
4. Update item quantities
5. Remove items
6. Clear cart
7. Verify empty cart

### Manual Testing

1. Start the server:
```bash
cd server
go run cmd/api/main.go
```

2. Login to get token:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. Use the token in subsequent requests:
```bash
TOKEN="your_jwt_token_here"

# Get cart
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer $TOKEN"

# Add to cart
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"product_variant_id":1,"quantity":2}'
```

## Database Schema

### Cart Table
```sql
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER NOT NULL REFERENCES carts(id),
  product_variant_id INTEGER NOT NULL REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
```

## Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "status": "error",
  "message": "Unauthorized",
  "error": "missing or invalid token"
}
```

**404 Not Found**
```json
{
  "status": "error",
  "message": "Product variant not found",
  "error": "record not found"
}
```

**400 Bad Request - Insufficient Stock**
```json
{
  "status": "error",
  "message": "Insufficient stock",
  "error": "requested quantity exceeds available stock"
}
```

**400 Bad Request - Invalid Input**
```json
{
  "status": "error",
  "message": "Invalid request",
  "error": "quantity must be at least 1"
}
```

## Future Enhancements

Potential improvements for the cart system:

1. **Cart Expiration**: Auto-clear carts after X days of inactivity
2. **Guest Carts**: Support for anonymous users with session-based carts
3. **Cart Merge**: Merge guest cart with user cart on login
4. **Wishlist**: Move items between cart and wishlist
5. **Save for Later**: Temporary item storage
6. **Price Tracking**: Alert users to price changes
7. **Stock Notifications**: Notify when out-of-stock items are available
8. **Cart Sharing**: Share cart via link
9. **Bulk Operations**: Add/remove multiple items at once
10. **Cart Analytics**: Track cart abandonment rates

## Dependencies

- **GORM**: Database ORM
- **Gin**: HTTP framework
- **JWT**: Authentication
- **Product Variants**: Requires product_variants table with stock tracking

## Notes

- Cart is automatically created on first access for each user
- Adding an existing product variant increments the quantity
- All operations validate stock availability
- Soft deletes are supported (deleted_at field)
- Cart totals are calculated in real-time from variant prices
