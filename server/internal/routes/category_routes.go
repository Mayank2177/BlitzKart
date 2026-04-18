package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/middleware"
)

// SetupCategoryRoutes sets up all category-related routes
func SetupCategoryRoutes(router *gin.Engine, h *Handlers) {
	// Public routes - anyone can view categories
	public := router.Group("/api/categories")
	{
		public.GET("", h.CategoryHandler.GetAllCategories)           // Get all categories
		public.GET("/tree", h.CategoryHandler.GetCategoryTree)       // Get category tree
		public.GET("/:id", h.CategoryHandler.GetCategoryByID)        // Get category by ID
		public.GET("/slug/:slug", h.CategoryHandler.GetCategoryBySlug) // Get category by slug
	}

	// Protected routes - require authentication (Admin only)
	protected := router.Group("/api/categories")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.POST("", h.CategoryHandler.CreateCategory)         // Create category
		protected.PUT("/:id", h.CategoryHandler.UpdateCategory)     // Update category
		protected.DELETE("/:id", h.CategoryHandler.DeleteCategory)  // Delete category
	}
}