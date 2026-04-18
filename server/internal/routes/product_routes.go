package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/middleware"
)

// SetupProductRoutes configures product routes
func SetupProductRoutes(router *gin.Engine, h *Handlers) {
	// Public product routes
	router.GET("/products", h.ProductHandler.GetAllProducts)
	router.GET("/products/:id", h.ProductHandler.GetProductByID)
	router.GET("/products/search", h.ProductHandler.SearchProducts)
	router.GET("/products/category", h.ProductHandler.GetProductsByCategory)

	// Protected product routes (Admin only)
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.POST("/products", h.ProductHandler.CreateProduct)
		protected.PUT("/products/:id", h.ProductHandler.UpdateProduct)
		protected.DELETE("/products/:id", h.ProductHandler.DeleteProduct)
	}
}

