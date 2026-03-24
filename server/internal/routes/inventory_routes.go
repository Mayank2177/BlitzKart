package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/handlers"
)

// SetupInventoryRoutes configures inventory routes
func SetupInventoryRoutes(router *gin.Engine, h *Handlers) {
	inventory := router.Group("/inventory")
	{
		inventory.GET("", handlers.GetInventory)
		inventory.GET("/:id", handlers.GetInventoryByID)
		inventory.POST("", handlers.PostInventory)
	}
}
