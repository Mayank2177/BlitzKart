package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/handlers"
	"server/internal/middleware"
)

// SetupOrderRoutes configures order routes (protected)
func SetupOrderRoutes(router *gin.Engine, h *Handlers) {
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.POST("/orders", handlers.CreateOrder)
		protected.GET("/orders/:id", handlers.GetOrder)
	}
}
