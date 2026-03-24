package routes

import (
	"github.com/gin-gonic/gin"
)

// SetupRecommendationRoutes configures recommendation routes
func SetupRecommendationRoutes(router *gin.Engine, h *Handlers) {
	recommendations := router.Group("/api")
	{
		recommendations.GET("/recommendations/:userId", h.RecommendationHandler.GetRecommendations)
		recommendations.GET("/reorder-recommendations/:userId", h.RecommendationHandler.GetReorderRecommendations)
		recommendations.POST("/search/:userId", h.RecommendationHandler.RecordSearch)
		recommendations.POST("/product-view/:userId/:productId", h.RecommendationHandler.RecordProductView)
		recommendations.GET("/search-suggestions", h.RecommendationHandler.GetSearchSuggestions)
	}
}
