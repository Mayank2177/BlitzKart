package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/middleware"
)

// SetupAddressRoutes sets up all address-related routes
func SetupAddressRoutes(router *gin.Engine, h *Handlers) {
	// All address routes require authentication
	addresses := router.Group("/api/addresses")
	addresses.Use(middleware.JWTAuthMiddleware())
	{
		addresses.POST("", h.AddressHandler.CreateAddress)           // Create address
		addresses.GET("", h.AddressHandler.GetUserAddresses)         // Get all user addresses
		addresses.GET("/:id", h.AddressHandler.GetAddressByID)       // Get specific address
		addresses.PUT("/:id", h.AddressHandler.UpdateAddress)        // Update address
		addresses.DELETE("/:id", h.AddressHandler.DeleteAddress)     // Delete address
	}
}
