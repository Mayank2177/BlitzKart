#!/bin/bash

# E-Commerce Backend Verification Script
# This script verifies that all components are working correctly

echo "=========================================="
echo "E-Commerce Backend Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to print info
print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# 1. Check if Go is installed
echo "1. Checking Go installation..."
if command -v go &> /dev/null; then
    GO_VERSION=$(go version)
    print_success "Go is installed: $GO_VERSION"
else
    print_error "Go is not installed"
    exit 1
fi
echo ""

# 2. Check if project compiles
echo "2. Checking if project compiles..."
if go build -o /dev/null ./cmd/api 2>&1; then
    print_success "Project compiles successfully"
else
    print_error "Project compilation failed"
    exit 1
fi
echo ""

# 3. Check if database directory exists
echo "3. Checking database configuration..."
if [ -f "../database/ecommerce.db" ]; then
    print_success "Database file exists"
else
    print_info "Database file will be created on first run"
fi
echo ""

# 4. Check if .env file exists
echo "4. Checking environment configuration..."
if [ -f ".env" ]; then
    print_success ".env file exists"
else
    print_info ".env file not found, using defaults"
    if [ -f ".env.example" ]; then
        print_info "You can copy .env.example to .env"
    fi
fi
echo ""

# 5. Check if all required files exist
echo "5. Checking required files..."
REQUIRED_FILES=(
    "cmd/api/main.go"
    "internal/config/database.go"
    "internal/services/auth_service.go"
    "internal/services/user_service.go"
    "internal/services/product_service.go"
    "internal/services/cart_service.go"
    "internal/services/order_service.go"
    "internal/services/recommendation_service.go"
    "internal/handlers/auth_handler.go"
    "internal/handlers/user_handler.go"
    "internal/handlers/product_handler.go"
    "internal/handlers/cart_handler.go"
    "internal/handlers/order_handler.go"
    "internal/handlers/recommendation_handler.go"
    "internal/routes/routes.go"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_error "$file not found"
        ALL_FILES_EXIST=false
    fi
done
echo ""

# 6. Check if test scripts exist
echo "6. Checking test scripts..."
TEST_SCRIPTS=(
    "test_all_routes.sh"
    "test_cart.sh"
    "test_products.sh"
    "test_orders.sh"
    "test_recommendations.sh"
    "test_database.sh"
)

for script in "${TEST_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        print_success "$script exists"
        # Make executable if not already
        chmod +x "$script" 2>/dev/null
    else
        print_error "$script not found"
    fi
done
echo ""

# 7. Check Go dependencies
echo "7. Checking Go dependencies..."
if go mod verify &> /dev/null; then
    print_success "Go modules verified"
else
    print_info "Running go mod download..."
    go mod download
    print_success "Dependencies downloaded"
fi
echo ""

# 8. Summary
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo ""

if [ "$ALL_FILES_EXIST" = true ]; then
    print_success "All required files present"
    print_success "Project is ready to run!"
    echo ""
    echo "To start the server:"
    echo "  go run cmd/api/main.go"
    echo ""
    echo "To test the API:"
    echo "  ./test_all_routes.sh"
    echo ""
    echo "For more information, see:"
    echo "  - PROJECT_STATUS_COMPLETE.md"
    echo "  - API_ENDPOINTS.md"
    echo "  - TESTING_GUIDE.md"
else
    print_error "Some files are missing"
    echo "Please check the errors above"
fi
echo ""
