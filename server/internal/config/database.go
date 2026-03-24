// GORM connection & initialization
package config

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	// Connect to SQLite database
	DB, err = gorm.Open(sqlite.Open("../database/ecommerce.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")
	
	// Auto-migrate models (creates tables if they don't exist)
	MigrateModels()
}

type Inventory struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`	
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

var inventory = []Inventory{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

type Dispatch struct {
	ID       string `json:"id"`
	OrderID  string `json:"order_id"`
	Status   string `json:"status"`
	Location string `json:"location"`
}

var dispatch = []Dispatch{
	{ID: "1", OrderID: "ORD001", Status: "In Transit", Location: "Warehouse A"},
	{ID: "2", OrderID: "ORD002", Status: "Delivered", Location: "Customer Address"},
}