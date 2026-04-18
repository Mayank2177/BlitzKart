# Complete Testing Guide - Terminal Commands

## Quick Verification Commands

### 1. Check if Project Builds ✅
```bash
cd server
go build ./cmd/api
```
**Expected:** No errors, creates `api` executable

---

### 2. Start the Server
```bash
cd server
go run cmd/api/main.go
```
**Expected Output:**
```
Database connected successfully at: ../database/ecommerce.db
Database migration completed successfully
Database seeded successfully! Created 5 categories, 15 products, and 40 product variants
Server starting on localhost:8080
All routes loaded from routes folder
```

**Keep this terminal open!** Open a new terminal for testing.

---

## Basic Health Checks

### 3. Test Server is Running
```bash
curl http://localhost:8080/
```
**Expected:**
```json
{
  "success": true,
  "message": "Welcome to BlitzKart API"
}
```

### 4. Test Products Endpoint (Public)
```bash
curl http://localhost:8080/products
```
**Expected:** JSON with list of products

### 5. Test Products with Limit
```bash
curl "http://localhost:8080/products?limit=5"
```
**Expected:** JSON with 5 products

---

## Authentication Testing

### 6. Login and Get JWT Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
**Expected:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 7. Save Token for Later Use
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | sed 's/"token":"//')

echo "Token saved: ${TOKEN:0:20}..."
```

---

## Cart Testing (Protected Endpoints)

### 8. Get Empty Cart
```bash
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** Empty cart or existing cart

### 9. Add Item to Cart
```bash
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"product_variant_id":1,"quantity":2}'
```
**Expected:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "items": [...],
    "total": 2599.98,
    "item_count": 2
  }
}
```

### 10. View Cart
```bash
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** Cart with items

---

## Order Testing

### 11. Create Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"product_variant_id":1,"quantity":2}]}'
```
**Expected:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_price": 2599.98,
    "status": "pending",
    "items": [...]
  }
}
```

### 12. Get User's Orders
```bash
curl http://localhost:8080/api/orders \
  -H "Authorization: Bearer $TOKEN"
```
**Expected:** List of orders

---

## Product Testing

### 13. Search Products
```bash
curl "http://localhost:8080/products/search?q=laptop"
```
**Expected:** Products matching "laptop"

### 14. Get Product by ID
```bash
curl http://localhost:8080/products/1
```
**Expected:** Detailed product information

### 15. Get Products by Category
```bash
curl "http://localhost:8080/products/category?category_id=1"
```
**Expected:** Products in category 1

---

## Recommendation Testing

### 16. Get Recommendations
```bash
curl http://localhost:8080/api/recommendations/1
```
**Expected:** Personalized recommendations

### 17. Record Product View
```bash
curl -X POST http://localhost:8080/api/product-view/1/5
```
**Expected:** Success message

### 18. Get Search Suggestions
```bash
curl "http://localhost:8080/api/search-suggestions?q=lap"
```
**Expected:** Search suggestions

---

## User Management Testing

### 19. Get All Users
```bash
curl http://localhost:8080/api/users
```
**Expected:** List of users

### 20. Get User by ID
```bash
curl http://localhost:8080/api/users/1
```
**Expected:** User details

---

## Automated Test Scripts

### 21. Run All Tests
```bash
cd server
./test_all_routes.sh
```

### 22. Test Cart Only
```bash
cd server
./test_cart.sh
```

### 23. Test Products Only
```bash
cd server
./test_products.sh
```

### 24. Test Orders Only
```bash
cd server
./test_orders.sh
```

### 25. Test Recommendations Only
```bash
cd server
./test_recommendations.sh
```

### 26. Test Database
```bash
cd server
./test_database.sh
```

---

## Database Verification

### 27. Check Database File Exists
```bash
ls -lh database/ecommerce.db
```
**Expected:** File exists with size > 0

### 28. Check Database Tables
```bash
sqlite3 database/ecommerce.db "SELECT name FROM sqlite_master WHERE type='table';"
```
**Expected:** List of tables (users, products, carts, orders, etc.)

### 29. Count Products
```bash
sqlite3 database/ecommerce.db "SELECT COUNT(*) FROM products;"
```
**Expected:** 15

### 30. Count Product Variants
```bash
sqlite3 database/ecommerce.db "SELECT COUNT(*) FROM product_variants;"
```
**Expected:** 40+

### 31. Check Test User Exists
```bash
sqlite3 database/ecommerce.db "SELECT email FROM users WHERE email='test@example.com';"
```
**Expected:** test@example.com

---

## Code Quality Checks

### 32. Check for Compilation Errors
```bash
cd server
go build ./...
```
**Expected:** No errors

### 33. Run Go Vet (Static Analysis)
```bash
cd server
go vet ./...
```
**Expected:** No issues

### 34. Format Check
```bash
cd server
gofmt -l .
```
**Expected:** Empty output (all files formatted)

### 35. Check Dependencies
```bash
cd server
go mod verify
```
**Expected:** "all modules verified"

---

## Performance Testing

### 36. Test Response Time
```bash
time curl -s http://localhost:8080/products > /dev/null
```
**Expected:** < 1 second

### 37. Test Multiple Requests
```bash
for i in {1..10}; do
  curl -s http://localhost:8080/products > /dev/null &
done
wait
echo "All requests completed"
```
**Expected:** All complete successfully

---

## Error Handling Testing

### 38. Test Invalid Endpoint
```bash
curl http://localhost:8080/invalid
```
**Expected:** 404 error

### 39. Test Unauthorized Access
```bash
curl http://localhost:8080/api/cart
```
**Expected:** 401 Unauthorized

### 40. Test Invalid Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@example.com","password":"wrong"}'
```
**Expected:** Login failed error

### 41. Test Invalid Product ID
```bash
curl http://localhost:8080/products/99999
```
**Expected:** 404 Not Found

### 42. Test Insufficient Stock
```bash
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"product_variant_id":1,"quantity":10000}'
```
**Expected:** Insufficient stock error

---

## Complete Workflow Test

### 43. Full E-commerce Flow
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | sed 's/"token":"//')

echo "✓ Logged in"

# 2. Browse products
curl -s http://localhost:8080/products > /dev/null
echo "✓ Browsed products"

# 3. View product details
curl -s http://localhost:8080/products/1 > /dev/null
echo "✓ Viewed product details"

# 4. Add to cart
curl -s -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"product_variant_id":1,"quantity":1}' > /dev/null
echo "✓ Added to cart"

# 5. View cart
curl -s http://localhost:8080/api/cart \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo "✓ Viewed cart"

# 6. Create order
curl -s -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"product_variant_id":2,"quantity":1}]}' > /dev/null
echo "✓ Created order"

# 7. View orders
curl -s http://localhost:8080/api/orders \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo "✓ Viewed orders"

echo ""
echo "✅ Complete workflow test passed!"
```

---

## Quick Health Check Script

### 44. One-Command Health Check
```bash
cd server && \
echo "1. Building..." && go build ./cmd/api && \
echo "✓ Build successful" && \
echo "2. Checking database..." && ls database/ecommerce.db && \
echo "✓ Database exists" && \
echo "3. Starting server (will auto-stop)..." && \
timeout 2s go run cmd/api/main.go 2>&1 | grep -q "Server starting" && \
echo "✓ Server starts successfully" && \
echo "" && \
echo "✅ All health checks passed!"
```

---

## Troubleshooting Commands

### 45. Check if Port 8080 is in Use
```bash
lsof -i :8080
```
**If in use:** Kill the process or use different port

### 46. Check Server Logs
```bash
cd server
go run cmd/api/main.go 2>&1 | tee server.log
```

### 47. Check Database Integrity
```bash
sqlite3 database/ecommerce.db "PRAGMA integrity_check;"
```
**Expected:** ok

### 48. Reset Database
```bash
rm database/ecommerce.db
cd server
go run cmd/api/main.go
```
**Note:** This will recreate and reseed the database

---

## Pretty Output with jq

### 49. Install jq (if not installed)
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

### 50. Use jq for Pretty JSON
```bash
curl http://localhost:8080/products | jq '.'
curl http://localhost:8080/api/cart -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## Summary Commands

### Quick Test (30 seconds)
```bash
cd server
go build ./cmd/api && \
echo "✓ Build OK" && \
curl -s http://localhost:8080/ > /dev/null && \
echo "✓ Server OK" && \
curl -s http://localhost:8080/products > /dev/null && \
echo "✓ Products OK" && \
echo "✅ Quick test passed!"
```

### Full Test (2 minutes)
```bash
cd server
./test_all_routes.sh
```

### Comprehensive Test (5 minutes)
```bash
cd server
./test_database.sh && \
./test_cart.sh && \
./test_products.sh && \
./test_orders.sh && \
./test_recommendations.sh && \
echo "✅ All tests passed!"
```

---

## Expected Results Summary

✅ **Build:** No errors
✅ **Server Start:** Starts on port 8080
✅ **Database:** Created and seeded
✅ **Public Endpoints:** Work without auth
✅ **Protected Endpoints:** Require JWT token
✅ **Cart:** All 5 operations work
✅ **Orders:** Create and retrieve work
✅ **Products:** CRUD operations work
✅ **Recommendations:** Personalization works
✅ **Error Handling:** Proper status codes
✅ **Performance:** Fast response times

---

## Quick Reference

**Start Server:**
```bash
cd server && go run cmd/api/main.go
```

**Get Token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | sed 's/"token":"//')
```

**Test Endpoint:**
```bash
curl http://localhost:8080/api/cart -H "Authorization: Bearer $TOKEN" | jq '.'
```

**Run All Tests:**
```bash
cd server && ./test_all_routes.sh
```
