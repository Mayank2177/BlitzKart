package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/middleware"
)

// SetupCartRoutes configures all cart-related routes
func SetupCartRoutes(router *gin.Engine, h *Handlers) {
	// Protected cart routes (require JWT authentication)
	cartGroup := router.Group("/api/cart")
	cartGroup.Use(middleware.JWTAuthMiddleware())
	{
		cartGroup.GET("", h.CartHandler.GetCart)           // Get user's cart
		cartGroup.POST("", h.CartHandler.AddToCart)        // Add item to cart
		cartGroup.DELETE("", h.CartHandler.ClearCart)      // Clear cart
		
		// Cart item operations
		cartGroup.PUT("/items/:id", h.CartHandler.UpdateCartItem)    // Update cart item quantity
		cartGroup.DELETE("/items/:id", h.CartHandler.RemoveCartItem) // Remove cart item
	}
}
