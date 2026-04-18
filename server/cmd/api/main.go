package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"server/internal/config"
	"server/internal/repositories"
	"server/internal/routes"
	"server/internal/services"
)

func main() {
	// Initialize database connection
	config.ConnectDB()
	log.Println("Database connection initialized")

	// Seed database with sample data (optional - runs only once)
	config.SeedDatabase()

	// Initialize repositories
	userRepo := repositories.NewUserRepository(config.DB)
	productRepo := repositories.NewProductRepository(config.DB)
	searchHistoryRepo := repositories.NewSearchHistoryRepository(config.DB)
	productViewRepo := repositories.NewProductViewRepository(config.DB)
	orderRepo := repositories.NewOrderRepository(config.DB)
	cartRepo := repositories.NewCartRepository(config.DB)
	productVariantRepo := repositories.NewProductVariantRepository(config.DB)
	reviewRepo := repositories.NewReviewRepository(config.DB)
	addressRepo := repositories.NewAddressRepository(config.DB)
	categoryRepo := repositories.NewCategoryRepository(config.DB)
	couponRepo := repositories.NewCouponRepository(config.DB)

	// Initialize services
	authService := services.NewAuthService(userRepo)
	userService := services.NewUserService(userRepo)
	recommendationService := services.NewRecommendationService(searchHistoryRepo, productViewRepo, productRepo, orderRepo)
	cartService := services.NewCartService(cartRepo, productVariantRepo)
	productService := services.NewProductService(productRepo)
	orderService := services.NewOrderService(orderRepo, productVariantRepo, cartRepo)
	reviewService := services.NewReviewService(reviewRepo, productRepo, orderRepo)
	addressService := services.NewAddressService(addressRepo)
	categoryService := services.NewCategoryService(categoryRepo)
	couponService := services.NewCouponService(couponRepo)

	// Initialize handlers through routes package
	h := routes.InitializeHandlers(authService, userService, recommendationService, cartService, productService, orderService, reviewService, addressService, categoryService, couponService)

	// Configure router
	router := gin.Default()

	// Setup all routes from routes folder
	routes.SetupRoutes(router, h)

	log.Println("Server starting on localhost:8080")
	log.Println("All routes loaded from routes folder")
	router.Run("localhost:8080")
}
