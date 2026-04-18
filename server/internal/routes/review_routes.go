package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/middleware"
)

// SetupReviewRoutes sets up all review-related routes
func SetupReviewRoutes(router *gin.Engine, h *Handlers) {
	// Public routes - anyone can view reviews
	public := router.Group("/api/reviews")
	{
		public.GET("/product/:productId", h.ReviewHandler.GetProductReviews) // Get all reviews for a product
		public.GET("/user/:userId", h.ReviewHandler.GetUserReviews)          // Get all reviews by a user
		public.GET("/:id", h.ReviewHandler.GetReviewByID)                    // Get a specific review
	}

	// Protected routes - require authentication
	protected := router.Group("/api/reviews")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.POST("", h.ReviewHandler.CreateReview)       // Create a review
		protected.PUT("/:id", h.ReviewHandler.UpdateReview)    // Update a review
		protected.DELETE("/:id", h.ReviewHandler.DeleteReview) // Delete a review
	}
}
