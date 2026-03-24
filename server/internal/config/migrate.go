package config

import (
	"log"
	"server/internal/models"
)

// MigrateModels runs auto-migration for all models
func MigrateModels() {
	log.Println("Running database migrations...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.Address{},
		&models.Category{},
		&models.Product{},
		&models.ProductVariant{},
		&models.ProductImage{},
		&models.Review{},
		&models.Cart{},
		&models.CartItem{},
		&models.Coupon{},
		&models.Order{},
		&models.OrderItem{},
		&models.OrderStatusHistory{},
		&models.PaymentTransaction{},
		&models.Shipment{},
		&models.SearchHistory{},
		&models.ProductView{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migration completed successfully")
}
