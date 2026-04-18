#!/bin/bash

# Script to create test user with correct password hash

echo "=========================================="
echo "Setting Up Test User"
echo "=========================================="
echo ""

DB_PATH="../database/ecommerce.db"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "✗ Database not found at $DB_PATH"
    echo "Please start the server first to create the database"
    exit 1
fi

echo "Generating password hash for 'password123'..."

# Create a temporary Go program to generate the hash
cat > /tmp/gen_hash.go << 'EOF'
package main
import (
    "fmt"
    "golang.org/x/crypto/bcrypt"
)
func main() {
    hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
    fmt.Print(string(hash))
}
EOF

# Generate the hash
HASH=$(go run /tmp/gen_hash.go)
rm /tmp/gen_hash.go

echo "✓ Hash generated"
echo ""

# Check if user already exists
EXISTING=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM users WHERE email = 'test@example.com';")

if [ "$EXISTING" -gt 0 ]; then
    echo "User test@example.com already exists. Updating password..."
    sqlite3 "$DB_PATH" "UPDATE users SET password = '$HASH' WHERE email = 'test@example.com';"
    echo "✓ Password updated"
else
    echo "Creating new user test@example.com..."
    sqlite3 "$DB_PATH" "INSERT INTO users (first_name, last_name, email, phone_number, password, created_at, updated_at) VALUES ('Test', 'User', 'test@example.com', '1234567890', '$HASH', datetime('now'), datetime('now'));"
    echo "✓ User created"
fi

echo ""
echo "=========================================="
echo "Test User Ready!"
echo "=========================================="
echo ""
echo "Credentials:"
echo "  Email:    test@example.com"
echo "  Password: password123"
echo ""
echo "Test the login:"
echo "  curl -X POST http://localhost:8080/api/auth/login \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo ""
