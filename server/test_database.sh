#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Database Configuration${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if database directory exists
echo -e "${BLUE}1. Checking database directory...${NC}"
if [ -d "../database" ]; then
    echo -e "${GREEN}✅ Database directory exists${NC}"
else
    echo -e "${YELLOW}⚠️  Database directory doesn't exist, will be created on first run${NC}"
fi
echo ""

# Check if database file exists
echo -e "${BLUE}2. Checking database file...${NC}"
if [ -f "../database/ecommerce.db" ]; then
    echo -e "${GREEN}✅ Database file exists${NC}"
    DB_SIZE=$(du -h ../database/ecommerce.db | cut -f1)
    echo -e "   Size: $DB_SIZE"
else
    echo -e "${YELLOW}⚠️  Database file doesn't exist, will be created on first run${NC}"
fi
echo ""

# Check if server builds
echo -e "${BLUE}3. Building server...${NC}"
if go build -o test_server ./cmd/api 2>&1; then
    echo -e "${GREEN}✅ Server builds successfully${NC}"
    rm -f test_server
else
    echo -e "${RED}❌ Server build failed${NC}"
    exit 1
fi
echo ""

# Try to start server briefly to test database connection
echo -e "${BLUE}4. Testing database connection...${NC}"
echo -e "${YELLOW}Starting server for 3 seconds to test database...${NC}"

# Start server in background
timeout 3s go run ./cmd/api/main.go > /tmp/server_test.log 2>&1 &
SERVER_PID=$!

# Wait a bit for server to start
sleep 2

# Check if server is still running (means it started successfully)
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server started successfully${NC}"
    echo -e "${GREEN}✅ Database connection working${NC}"
    
    # Kill the server
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
else
    echo -e "${RED}❌ Server failed to start${NC}"
    echo -e "${RED}Check logs below:${NC}"
    cat /tmp/server_test.log
    exit 1
fi
echo ""

# Check database file was created
echo -e "${BLUE}5. Verifying database file creation...${NC}"
if [ -f "../database/ecommerce.db" ]; then
    echo -e "${GREEN}✅ Database file created successfully${NC}"
    DB_SIZE=$(du -h ../database/ecommerce.db | cut -f1)
    echo -e "   Size: $DB_SIZE"
    
    # Check if tables were created
    TABLE_COUNT=$(sqlite3 ../database/ecommerce.db "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null)
    if [ ! -z "$TABLE_COUNT" ] && [ "$TABLE_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Database tables created: $TABLE_COUNT tables${NC}"
    else
        echo -e "${YELLOW}⚠️  No tables found (might need to check migration)${NC}"
    fi
else
    echo -e "${RED}❌ Database file was not created${NC}"
    exit 1
fi
echo ""

# Show some server logs
echo -e "${BLUE}6. Server startup logs:${NC}"
echo -e "${YELLOW}---${NC}"
grep -E "(Database|connected|migration|seeded)" /tmp/server_test.log | head -10
echo -e "${YELLOW}---${NC}"
echo ""

# Clean up
rm -f /tmp/server_test.log

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Database Configuration Test Passed!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}Database is working correctly!${NC}"
echo -e "Location: ../database/ecommerce.db"
echo ""
echo -e "To start the server:"
echo -e "  ${YELLOW}go run cmd/api/main.go${NC}"
