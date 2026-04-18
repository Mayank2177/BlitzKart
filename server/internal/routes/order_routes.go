package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/middleware"
)

// SetupOrderRoutes configures order routes (protected)
func SetupOrderRoutes(router *gin.Engine, h *Handlers) {
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		// Order management
		protected.POST("/orders", h.OrderHandler.CreateOrder)                  // Create order
		protected.GET("/orders", h.OrderHandler.GetUserOrders)                 // Get user's orders
		protected.GET("/orders/:id", h.OrderHandler.GetOrderByID)              // Get order by ID
		protected.POST("/orders/:id/cancel", h.OrderHandler.CancelOrder)       // Cancel order
		protected.GET("/orders/:id/history", h.OrderHandler.GetOrderWithHistory) // Get order with history
		
		// Admin only - update order status
		protected.PUT("/orders/:id/status", h.OrderHandler.UpdateOrderStatus)
	}
}

