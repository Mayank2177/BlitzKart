package config

import (
	"log"
	"server/internal/models"
)

// SeedDatabase adds sample data to the database
func SeedDatabase() {
	log.Println("Starting database seeding...")

	// Check if categories already exist
	var categoryCount int64
	DB.Model(&models.Category{}).Count(&categoryCount)
	
	if categoryCount > 0 {
		log.Println("Database already seeded, skipping...")
		return
	}

	// Create categories
	categories := []models.Category{
		{Name: "Electronics", Slug: "electronics"},
		{Name: "Clothing", Slug: "clothing"},
		{Name: "Books", Slug: "books"},
		{Name: "Home & Kitchen", Slug: "home-kitchen"},
		{Name: "Sports", Slug: "sports"},
	}

	for i := range categories {
		if err := DB.Create(&categories[i]).Error; err != nil {
			log.Printf("Error creating category: %v", err)
		}
	}

	// Create products
	products := []models.Product{
		{
			Name:        "Laptop Pro 15",
			Description: "High-performance laptop with 16GB RAM and 512GB SSD",
			SKU:         "LAPTOP-001",
			Price:       1299.99,
			CategoryID:  categories[0].ID,
		},
		{
			Name:        "Wireless Mouse",
			Description: "Ergonomic wireless mouse with precision tracking",
			SKU:         "MOUSE-001",
			Price:       29.99,
			CategoryID:  categories[0].ID,
		},
		{
			Name:        "Mechanical Keyboard",
			Description: "RGB mechanical keyboard with blue switches",
			SKU:         "KEYBOARD-001",
			Price:       89.99,
			CategoryID:  categories[0].ID,
		},
		{
			Name:        "USB-C Hub",
			Description: "7-in-1 USB-C hub with HDMI and card reader",
			SKU:         "HUB-001",
			Price:       49.99,
			CategoryID:  categories[0].ID,
		},
		{
			Name:        "Noise Cancelling Headphones",
			Description: "Premium wireless headphones with active noise cancellation",
			SKU:         "HEADPHONE-001",
			Price:       249.99,
			CategoryID:  categories[0].ID,
		},
		{
			Name:        "Cotton T-Shirt",
			Description: "Comfortable 100% cotton t-shirt",
			SKU:         "TSHIRT-001",
			Price:       19.99,
			CategoryID:  categories[1].ID,
		},
		{
			Name:        "Denim Jeans",
			Description: "Classic fit denim jeans",
			SKU:         "JEANS-001",
			Price:       59.99,
			CategoryID:  categories[1].ID,
		},
		{
			Name:        "Running Shoes",
			Description: "Lightweight running shoes with cushioned sole",
			SKU:         "SHOES-001",
			Price:       79.99,
			CategoryID:  categories[4].ID,
		},
		{
			Name:        "Programming Book",
			Description: "Learn Go programming from scratch",
			SKU:         "BOOK-001",
			Price:       39.99,
			CategoryID:  categories[2].ID,
		},
		{
			Name:        "Coffee Maker",
			Description: "Automatic drip coffee maker with timer",
			SKU:         "COFFEE-001",
			Price:       69.99,
			CategoryID:  categories[3].ID,
		},
		{
			Name:        "Blender",
			Description: "High-speed blender for smoothies and shakes",
			SKU:         "BLENDER-001",
			Price:       89.99,
			CategoryID:  categories[3].ID,
		},
		{
			Name:        "Yoga Mat",
			Description: "Non-slip yoga mat with carrying strap",
			SKU:         "YOGA-001",
			Price:       29.99,
			CategoryID:  categories[4].ID,
		},
		{
			Name:        "Dumbbells Set",
			Description: "Adjustable dumbbells 5-25 lbs",
			SKU:         "DUMBBELL-001",
			Price:       149.99,
			CategoryID:  categories[4].ID,
		},
		{
			Name:        "Smartphone Stand",
			Description: "Adjustable phone stand for desk",
			SKU:         "STAND-001",
			Price:       15.99,
			CategoryID:  categories[0].ID,
		},
		{
			Name:        "Backpack",
			Description: "Water-resistant laptop backpack",
			SKU:         "BACKPACK-001",
			Price:       49.99,
			CategoryID:  categories[1].ID,
		},
	}

	for i := range products {
		if err := DB.Create(&products[i]).Error; err != nil {
			log.Printf("Error creating product: %v", err)
		}
	}

	log.Printf("Database seeded successfully! Created %d categories and %d products", len(categories), len(products))
}
