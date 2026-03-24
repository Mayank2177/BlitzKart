package routes

import (
	"github.com/gin-gonic/gin"
)

// SetupUserRoutes configures user routes
func SetupUserRoutes(router *gin.Engine, h *Handlers) {
	users := router.Group("/api/users")
	{
		users.GET("", h.UserHandler.GetAllUsers)
		users.GET("/:id", h.UserHandler.GetUser)
		users.POST("", h.UserHandler.CreateUser)
		users.PUT("/:id", h.UserHandler.UpdateUser)
		users.DELETE("/:id", h.UserHandler.DeleteUser)
	}
}
