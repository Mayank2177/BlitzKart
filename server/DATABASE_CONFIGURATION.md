# Database Configuration Guide

## Overview

The application uses SQLite as the database with GORM as the ORM. The database configuration has been improved with proper path handling, connection pooling, and error management.

## Improvements Made

### 1. Flexible Path Resolution
- ✅ Supports environment variable configuration
- ✅ Automatic path detection based on execution context
- ✅ Works from multiple directories (project root, server/, server/cmd/api/)
- ✅ Creates database directory if it doesn't exist

### 2. Connection Pool Configuration
- ✅ Max idle connections: 10
- ✅ Max open connections: 100
- ✅ Proper connection lifecycle management

### 3. Better Error Handling
- ✅ Detailed error messages
- ✅ Graceful failure with log.Fatal
- ✅ Database directory creation
- ✅ Connection validation

### 4. Logging
- ✅ GORM logger enabled (Info level)
- ✅ Connection success messages
- ✅ Database path logging

## Configuration Options

### Option 1: Environment Variable (Recommended)

Set the `DB_PATH` environment variable:

```bash
export DB_PATH=/absolute/path/to/database/ecommerce.db
```

Or in `.env` file:
```env
DB_PATH=../database/ecommerce.db
```

### Option 2: Automatic Detection (Default)

The system automatically detects the correct path based on where you run the application:

**Running from project root:**
```bash
cd /path/to/Blitzkart_backend
go run server/cmd/api/main.go
# Database: ./database/ecommerce.db
```

**Running from server directory:**
```bash
cd /path/to/Blitzkart_backend/server
go run cmd/api/main.go
# Database: ../database/ecommerce.db
```

**Running from server/cmd/api:**
```bash
cd /path/to/Blitzkart_backend/server/cmd/api
go run main.go
# Database: ../../../database/ecommerce.db
```

## Database Structure

### Location
```
Blitzkart_backend/
├── database/
│   └── ecommerce.db          # SQLite database file
└── server/
    └── internal/
        └── config/
            └── database.go    # Database configuration
```

### Tables Created (Auto-Migration)

The following tables are automatically created on first run:

1. **users** - User accounts
2. **addresses** - User addresses
3. **categories** - Product categories
4. **products** - Product catalog
5. **product_variants** - Product variants (size, color, etc.)
6. **product_images** - Product images
7. **reviews** - Product reviews
8. **carts** - Shopping carts
9. **cart_items** - Items in carts
10. **coupons** - Discount coupons
11. **orders** - Customer orders
12. **order_items** - Items in orders
13. **order_status_histories** - Order status tracking
14. **payment_transactions** - Payment records
15. **shipments** - Shipping information
16. **search_histories** - User search tracking
17. **product_views** - Product view tracking

## Functions

### ConnectDB()
Initializes the database connection with the following steps:
1. Determines database path (env var or auto-detect)
2. Creates database directory if needed
3. Opens SQLite connection with GORM
4. Configures connection pool
5. Runs auto-migration
6. Seeds initial data (if needed)

### getDBPath()
Returns the absolute path to the database file:
- Checks `DB_PATH` environment variable first
- Falls back to automatic detection based on working directory
- Handles multiple execution contexts

### CloseDB()
Gracefully closes the database connection:
- Gets underlying SQL database instance
- Closes connection pool
- Returns error if any

## Usage Examples

### Basic Usage

```go
package main

import (
    "server/internal/config"
)

func main() {
    // Connect to database
    config.ConnectDB()
    
    // Use database
    // config.DB is now available globally
    
    // Close database on shutdown (optional)
    defer config.CloseDB()
}
```

### With Environment Variable

```bash
# Set database path
export DB_PATH=/var/lib/myapp/ecommerce.db

# Run application
go run cmd/api/main.go
```

### Custom Configuration

```go
// In your code, before ConnectDB()
os.Setenv("DB_PATH", "/custom/path/database.db")
config.ConnectDB()
```

## Connection Pool Settings

Current configuration:
```go
sqlDB.SetMaxIdleConns(10)   // Maximum idle connections
sqlDB.SetMaxOpenConns(100)  // Maximum open connections
```

### Tuning Guidelines

**For low traffic:**
```go
sqlDB.SetMaxIdleConns(5)
sqlDB.SetMaxOpenConns(25)
```

**For high traffic:**
```go
sqlDB.SetMaxIdleConns(20)
sqlDB.SetMaxOpenConns(200)
```

**For production:**
```go
sqlDB.SetMaxIdleConns(10)
sqlDB.SetMaxOpenConns(100)
sqlDB.SetConnMaxLifetime(time.Hour)
sqlDB.SetConnMaxIdleTime(time.Minute * 10)
```

## Troubleshooting

### Issue: "Failed to connect to database"

**Solution:**
1. Check if database directory exists
2. Verify write permissions
3. Check disk space
4. Verify SQLite driver is installed

```bash
go get -u gorm.io/driver/sqlite
```

### Issue: "Database locked"

**Solution:**
SQLite doesn't handle concurrent writes well. Consider:
1. Reducing concurrent operations
2. Using connection pooling (already configured)
3. Switching to PostgreSQL for production

### Issue: "No such table"

**Solution:**
1. Delete the database file
2. Restart the application
3. Auto-migration will recreate tables

```bash
rm database/ecommerce.db
go run cmd/api/main.go
```

### Issue: "Permission denied"

**Solution:**
```bash
# Create database directory with proper permissions
mkdir -p database
chmod 755 database

# Or run with sudo (not recommended)
sudo go run cmd/api/main.go
```

## Migration

### Auto-Migration (Current)

Tables are automatically created/updated on application start:
```go
config.MigrateModels()
```

### Manual Migration (Future)

For production, consider using migration files:
```bash
# Install migrate tool
go install -tags 'sqlite3' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Create migration
migrate create -ext sql -dir migrations -seq create_users_table

# Run migrations
migrate -path migrations -database "sqlite3://database/ecommerce.db" up
```

## Seeding

Initial data is seeded automatically on first run:
- Test user (test@example.com / password123)
- 5 categories
- 15 products
- 40+ product variants

To re-seed:
```bash
# Delete database
rm database/ecommerce.db

# Restart application
go run cmd/api/main.go
```

## Backup & Restore

### Backup
```bash
# Simple copy
cp database/ecommerce.db database/ecommerce.db.backup

# With timestamp
cp database/ecommerce.db database/ecommerce.db.$(date +%Y%m%d_%H%M%S)

# Using SQLite command
sqlite3 database/ecommerce.db ".backup database/backup.db"
```

### Restore
```bash
# From backup
cp database/ecommerce.db.backup database/ecommerce.db

# Using SQLite command
sqlite3 database/ecommerce.db ".restore database/backup.db"
```

## Production Considerations

### 1. Use PostgreSQL
SQLite is great for development but consider PostgreSQL for production:

```go
import "gorm.io/driver/postgres"

dsn := "host=localhost user=postgres password=secret dbname=ecommerce port=5432"
DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
```

### 2. Environment Variables
Always use environment variables in production:
```bash
export DB_PATH=/var/lib/myapp/ecommerce.db
export DB_HOST=localhost
export DB_USER=postgres
export DB_PASSWORD=secret
export DB_NAME=ecommerce
```

### 3. Connection Pooling
Tune based on your load:
```go
sqlDB.SetMaxIdleConns(20)
sqlDB.SetMaxOpenConns(200)
sqlDB.SetConnMaxLifetime(time.Hour)
```

### 4. Monitoring
Add database metrics:
```go
stats := sqlDB.Stats()
log.Printf("Open connections: %d", stats.OpenConnections)
log.Printf("In use: %d", stats.InUse)
log.Printf("Idle: %d", stats.Idle)
```

## Testing

### Unit Tests
```go
func TestDatabaseConnection(t *testing.T) {
    config.ConnectDB()
    
    if config.DB == nil {
        t.Fatal("Database connection failed")
    }
    
    // Test query
    var count int64
    config.DB.Model(&models.User{}).Count(&count)
    
    if count < 0 {
        t.Fatal("Failed to query database")
    }
}
```

### Integration Tests
```bash
# Set test database
export DB_PATH=database/test.db

# Run tests
go test ./...

# Clean up
rm database/test.db
```

## Summary

The database configuration is now:
✅ Production-ready with proper error handling
✅ Flexible with multiple configuration options
✅ Optimized with connection pooling
✅ Well-documented with clear usage examples
✅ Easy to troubleshoot with detailed logging

For any issues, check the logs for the database path being used and verify file permissions.
