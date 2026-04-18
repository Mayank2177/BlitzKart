package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/middleware"
)

// SetupCouponRoutes sets up all coupon-related routes
func SetupCouponRoutes(router *gin.Engine, h *Handlers) {
	// Public routes - anyone can view active coupons and validate
	public := router.Group("/api/coupons")
	{
		public.GET("/active", h.CouponHandler.GetActiveCoupons)     // Get active coupons
		public.POST("/validate", h.CouponHandler.ValidateCoupon)    // Validate coupon
	}

	// Protected routes - require authentication (Admin only)
	protected := router.Group("/api/coupons")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.POST("", h.CouponHandler.CreateCoupon)           // Create coupon
		protected.GET("", h.CouponHandler.GetAllCoupons)           // Get all coupons
		protected.GET("/:id", h.CouponHandler.GetCouponByID)       // Get coupon by ID
		protected.PUT("/:id", h.CouponHandler.UpdateCoupon)        // Update coupon
		protected.DELETE("/:id", h.CouponHandler.DeleteCoupon)     // Delete coupon
	}
}