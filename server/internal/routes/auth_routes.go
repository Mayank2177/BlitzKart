package routes

import (
	"github.com/gin-gonic/gin"
)

// SetupAuthRoutes configures authentication routes
func SetupAuthRoutes(router *gin.Engine, h *Handlers) {
	auth := router.Group("/api/auth")
	{
		auth.POST("/login", h.AuthHandler.Login)
	}
}
