// GORM connection & initialization
package config

import (
	"log"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	
	// Get absolute path for database
	dbPath := getDBPath()
	
	// Ensure database directory exists
	dbDir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dbDir, 0755); err != nil {
		log.Fatal("Failed to create database directory:", err)
	}
	
	// Configure GORM
	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}
	
	// Connect to SQLite database
	DB, err = gorm.Open(sqlite.Open(dbPath), config)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully at:", dbPath)
	
	// Get underlying SQL database for connection pool settings
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}
	
	// Set connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	
	// Auto-migrate models (creates tables if they don't exist)
	MigrateModels()
}

// getDBPath returns the absolute path to the database file
func getDBPath() string {
	// Check if DB_PATH environment variable is set
	if dbPath := os.Getenv("DB_PATH"); dbPath != "" {
		return dbPath
	}
	
	// Get current working directory
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatal("Failed to get current working directory:", err)
	}
	
	// Construct database path relative to project root
	// If running from server/ directory
	dbPath := filepath.Join(cwd, "..", "database", "ecommerce.db")
	
	// If running from project root
	if _, err := os.Stat(filepath.Join(cwd, "server")); err == nil {
		dbPath = filepath.Join(cwd, "database", "ecommerce.db")
	}
	
	// If running from server/cmd/api
	if filepath.Base(cwd) == "api" {
		dbPath = filepath.Join(cwd, "..", "..", "..", "database", "ecommerce.db")
	}
	
	return dbPath
}

// CloseDB closes the database connection
func CloseDB() error {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}