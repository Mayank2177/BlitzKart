package routes

import (
	"github.com/gin-gonic/gin"
	"server/internal/handlers"
	"server/internal/middleware"
	"server/internal/services"
)

// Handlers holds all handler instances
type Handlers struct {
	AuthHandler           *handlers.AuthHandler
	UserHandler           *handlers.UserHandler
	RecommendationHandler *handlers.RecommendationHandler
	CartHandler           *handlers.CartHandler
	ProductHandler        *handlers.ProductHandler
	OrderHandler          *handlers.OrderHandler
	ReviewHandler         *handlers.ReviewHandler
	AddressHandler        *handlers.AddressHandler
	CategoryHandler       *handlers.CategoryHandler
	CouponHandler         *handlers.CouponHandler
}

// InitializeHandlers creates and returns all handler instances
func InitializeHandlers(authService services.AuthService, userService *services.UserService, recommendationService *services.RecommendationService, cartService *services.CartService, productService *services.ProductService, orderService *services.OrderService, reviewService *services.ReviewService, addressService *services.AddressService, categoryService *services.CategoryService, couponService *services.CouponService) *Handlers {
	return &Handlers{
		AuthHandler:           &handlers.AuthHandler{AuthService: authService},
		UserHandler:           handlers.NewUserHandler(userService),
		RecommendationHandler: handlers.NewRecommendationHandler(recommendationService),
		CartHandler:           handlers.NewCartHandler(cartService),
		ProductHandler:        handlers.NewProductHandler(productService),
		OrderHandler:          handlers.NewOrderHandler(orderService),
		ReviewHandler:         handlers.NewReviewHandler(reviewService),
		AddressHandler:        handlers.NewAddressHandler(addressService),
		CategoryHandler:       handlers.NewCategoryHandler(categoryService),
		CouponHandler:         handlers.NewCouponHandler(couponService),
	}
}

// SetupRoutes initializes all application routes
func SetupRoutes(router *gin.Engine, h *Handlers) {
	// Public routes
	router.GET("/", handlers.WelcomeHandler)

	// Setup route groups
	SetupAuthRoutes(router, h)
	SetupProductRoutes(router, h)
	SetupInventoryRoutes(router, h)
	SetupDispatchRoutes(router, h)
	SetupUserRoutes(router, h)
	SetupRecommendationRoutes(router, h)
	SetupOrderRoutes(router, h)
	SetupCartRoutes(router, h)
	SetupReviewRoutes(router, h)
	SetupAddressRoutes(router, h)
	SetupCategoryRoutes(router, h)
	SetupCouponRoutes(router, h)
}

// SetupProtectedRoutes creates a protected route group with JWT middleware
func SetupProtectedRoutes(router *gin.Engine) *gin.RouterGroup {
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	return protected
}
