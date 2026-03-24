package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/handlers"
	"server/internal/middleware"
)

// SetupProductRoutes configures product routes
func SetupProductRoutes(router *gin.Engine, h *Handlers) {
	// Public product routes
	router.GET("/products", handlers.GetProducts)
	router.GET("/products/:id", handlers.GetProduct)

	// Protected product routes
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.POST("/products", handlers.CreateProductDB)
	}
}
