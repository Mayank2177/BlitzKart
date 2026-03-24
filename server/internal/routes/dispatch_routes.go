package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/handlers"
)

// SetupDispatchRoutes configures dispatch routes
func SetupDispatchRoutes(router *gin.Engine, h *Handlers) {
	dispatch := router.Group("/dispatch")
	{
		dispatch.GET("", handlers.GetDispatch)
		dispatch.GET("/:id", handlers.GetDispatchByID)
		dispatch.POST("", handlers.PostDispatch)
	}
}
