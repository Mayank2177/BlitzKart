package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"server/internal/config"
	"server/internal/handlers"
	"server/internal/middleware"
	"server/internal/repositories"
	"server/internal/services"
)

func main() {
	// Initialize database connection
	config.ConnectDB()
	log.Println("Database connection initialized")

	// Initialize repositories
	userRepo := repositories.NewUserRepository(config.DB)
	productRepo := repositories.NewProductRepository(config.DB)
	searchHistoryRepo := repositories.NewSearchHistoryRepository(config.DB)
	productViewRepo := repositories.NewProductViewRepository(config.DB)
	orderRepo := repositories.NewOrderRepository(config.DB)

	// Initialize services
	authService := services.NewAuthService()
	userService := services.NewUserService(userRepo)
	recommendationService := services.NewRecommendationService(searchHistoryRepo, productViewRepo, productRepo, orderRepo)

	// Initialize handlers
	authHandler := &handlers.AuthHandler{AuthService: authService}
	userHandler := handlers.NewUserHandler(userService)
	recommendationHandler := handlers.NewRecommendationHandler(recommendationService)

	// Configure router
	router := gin.Default()

	// Public routes
	router.GET("/", handlers.WelcomeHandler)
	router.POST("/api/auth/login", authHandler.Login)

	// Product routes (public)
	router.GET("/products", handlers.GetProducts)
	router.GET("/products/:id", handlers.GetProduct)

	// Inventory routes
	router.GET("/inventory", handlers.GetInventory)
	router.GET("/inventory/:id", handlers.GetInventoryByID)
	router.POST("/inventory", handlers.PostInventory)

	// Dispatch routes
	router.GET("/dispatch", handlers.GetDispatch)
	router.GET("/dispatch/:id", handlers.GetDispatchByID)
	router.POST("/dispatch", handlers.PostDispatch)

	// User routes
	router.GET("/api/users", userHandler.GetAllUsers)
	router.GET("/api/users/:id", userHandler.GetUser)
	router.POST("/api/users", userHandler.CreateUser)
	router.PUT("/api/users/:id", userHandler.UpdateUser)
	router.DELETE("/api/users/:id", userHandler.DeleteUser)

	// Recommendation routes
	router.GET("/api/recommendations/:userId", recommendationHandler.GetRecommendations)
	router.GET("/api/reorder-recommendations/:userId", recommendationHandler.GetReorderRecommendations)
	router.POST("/api/search/:userId", recommendationHandler.RecordSearch)
	router.POST("/api/product-view/:userId/:productId", recommendationHandler.RecordProductView)
	router.GET("/api/search-suggestions", recommendationHandler.GetSearchSuggestions)

	// Protected Routes Group
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.POST("/orders", handlers.CreateOrder)
		protected.GET("/orders/:id", handlers.GetOrder)
		protected.POST("/products", handlers.CreateProductDB)
	}

	log.Println("Server starting on localhost:8080")
	router.Run("localhost:8080")
}