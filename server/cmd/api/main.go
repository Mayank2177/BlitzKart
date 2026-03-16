package main

import (
	"github.com/gin-gonic/gin"

	"server/internal/handlers"
	"server/internal/middleware"
)


func main() {

    // configuring router

    router := gin.Default()
    
    router.GET("/inventory", handlers.GetInventory)
    router.GET("/inventory/:id", handlers.GetInventoryByID)
    router.POST("/inventory", handlers.PostInventory)
    router.GET("/dispatch", handlers.GetDispatch)
    router.GET("/dispatch/:id", handlers.GetDispatchByID)
    router.POST("/dispatch", handlers.PostDispatch)
    router.GET("/", handlers.WelcomeHandler)


	// Protected Routes Group
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware()) // Custom middleware to check JWT
	{
		protected.POST("/orders", handlers.CreateOrder)
		protected.GET("/orders/:id", handlers.GetOrder)
		protected.POST("/products", handlers.CreateProduct) // Admin action
	}

    router.Run("localhost:8080")

    
}