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

	// Create test user (password: password123)
	testUser := models.User{
		FirstName:   "Test",
		LastName:    "User",
		Email:       "test@example.com",
		PhoneNumber: "1234567890",
		Password:    "$2a$10$YourHashedPasswordHere", // This will be set properly by auth
	}
	
	// Hash password properly
	hashedPassword := "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy" // password123
	testUser.Password = hashedPassword
	
	if err := DB.Create(&testUser).Error; err != nil {
		log.Printf("Error creating test user: %v", err)
	} else {
		log.Println("Test user created: test@example.com / password123")
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

	// Create product variants for each product
	variants := []models.ProductVariant{
		// Laptop variants
		{ProductID: products[0].ID, SKU: "LAPTOP-001-8GB", Price: 1099.99, Stock: 25},
		{ProductID: products[0].ID, SKU: "LAPTOP-001-16GB", Price: 1299.99, Stock: 30},
		{ProductID: products[0].ID, SKU: "LAPTOP-001-32GB", Price: 1599.99, Stock: 15},
		
		// Mouse variants
		{ProductID: products[1].ID, SKU: "MOUSE-001-BLACK", Price: 29.99, Stock: 100},
		{ProductID: products[1].ID, SKU: "MOUSE-001-WHITE", Price: 29.99, Stock: 80},
		
		// Keyboard variants
		{ProductID: products[2].ID, SKU: "KEYBOARD-001-BLUE", Price: 89.99, Stock: 50},
		{ProductID: products[2].ID, SKU: "KEYBOARD-001-RED", Price: 89.99, Stock: 45},
		{ProductID: products[2].ID, SKU: "KEYBOARD-001-BROWN", Price: 94.99, Stock: 40},
		
		// USB-C Hub variant
		{ProductID: products[3].ID, SKU: "HUB-001-GRAY", Price: 49.99, Stock: 75},
		
		// Headphones variants
		{ProductID: products[4].ID, SKU: "HEADPHONE-001-BLACK", Price: 249.99, Stock: 60},
		{ProductID: products[4].ID, SKU: "HEADPHONE-001-SILVER", Price: 249.99, Stock: 40},
		
		// T-Shirt variants
		{ProductID: products[5].ID, SKU: "TSHIRT-001-S", Price: 19.99, Stock: 100},
		{ProductID: products[5].ID, SKU: "TSHIRT-001-M", Price: 19.99, Stock: 150},
		{ProductID: products[5].ID, SKU: "TSHIRT-001-L", Price: 19.99, Stock: 120},
		{ProductID: products[5].ID, SKU: "TSHIRT-001-XL", Price: 19.99, Stock: 80},
		
		// Jeans variants
		{ProductID: products[6].ID, SKU: "JEANS-001-30", Price: 59.99, Stock: 50},
		{ProductID: products[6].ID, SKU: "JEANS-001-32", Price: 59.99, Stock: 70},
		{ProductID: products[6].ID, SKU: "JEANS-001-34", Price: 59.99, Stock: 60},
		{ProductID: products[6].ID, SKU: "JEANS-001-36", Price: 59.99, Stock: 40},
		
		// Running Shoes variants
		{ProductID: products[7].ID, SKU: "SHOES-001-8", Price: 79.99, Stock: 30},
		{ProductID: products[7].ID, SKU: "SHOES-001-9", Price: 79.99, Stock: 45},
		{ProductID: products[7].ID, SKU: "SHOES-001-10", Price: 79.99, Stock: 50},
		{ProductID: products[7].ID, SKU: "SHOES-001-11", Price: 79.99, Stock: 35},
		
		// Book variant
		{ProductID: products[8].ID, SKU: "BOOK-001-PAPERBACK", Price: 39.99, Stock: 200},
		
		// Coffee Maker variant
		{ProductID: products[9].ID, SKU: "COFFEE-001-12CUP", Price: 69.99, Stock: 40},
		
		// Blender variants
		{ProductID: products[10].ID, SKU: "BLENDER-001-600W", Price: 89.99, Stock: 35},
		{ProductID: products[10].ID, SKU: "BLENDER-001-1000W", Price: 119.99, Stock: 25},
		
		// Yoga Mat variants
		{ProductID: products[11].ID, SKU: "YOGA-001-BLUE", Price: 29.99, Stock: 60},
		{ProductID: products[11].ID, SKU: "YOGA-001-PURPLE", Price: 29.99, Stock: 55},
		{ProductID: products[11].ID, SKU: "YOGA-001-GREEN", Price: 29.99, Stock: 50},
		
		// Dumbbells variant
		{ProductID: products[12].ID, SKU: "DUMBBELL-001-SET", Price: 149.99, Stock: 20},
		
		// Smartphone Stand variants
		{ProductID: products[13].ID, SKU: "STAND-001-BLACK", Price: 15.99, Stock: 150},
		{ProductID: products[13].ID, SKU: "STAND-001-WHITE", Price: 15.99, Stock: 120},
		
		// Backpack variants
		{ProductID: products[14].ID, SKU: "BACKPACK-001-BLACK", Price: 49.99, Stock: 45},
		{ProductID: products[14].ID, SKU: "BACKPACK-001-GRAY", Price: 49.99, Stock: 40},
		{ProductID: products[14].ID, SKU: "BACKPACK-001-BLUE", Price: 49.99, Stock: 35},
	}

	for i := range variants {
		if err := DB.Create(&variants[i]).Error; err != nil {
			log.Printf("Error creating product variant: %v", err)
		}
	}

	log.Printf("Database seeded successfully! Created %d categories, %d products, and %d product variants", len(categories), len(products), len(variants))
}
