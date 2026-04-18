package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"server/internal/dto"
	"server/internal/services"
	"server/internal/utils"
)

type ReviewHandler struct {
	reviewService *services.ReviewService
}

func NewReviewHandler(reviewService *services.ReviewService) *ReviewHandler {
	return &ReviewHandler{
		reviewService: reviewService,
	}
}

// CreateReview creates a new product review
func (h *ReviewHandler) CreateReview(ctx *gin.Context) {
	// Get user ID from JWT token
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized")
		return
	}

	var req dto.CreateReviewRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	review, err := h.reviewService.CreateReview(userID, &req)
	if err != nil {
		if err.Error() == "product not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		if err.Error() == "you can only review products you have purchased" {
			utils.SendError(ctx, http.StatusForbidden, err.Error())
			return
		}
		if err.Error() == "you have already reviewed this product" {
			utils.SendError(ctx, http.StatusConflict, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to create review")
		return
	}

	utils.SendCreated(ctx, "Review created successfully", review)
}

// GetReviewByID retrieves a review by ID
func (h *ReviewHandler) GetReviewByID(ctx *gin.Context) {
	reviewID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid review ID")
		return
	}

	review, err := h.reviewService.GetReviewByID(uint(reviewID))
	if err != nil {
		utils.SendNotFound(ctx, "Review not found")
		return
	}

	utils.SendSuccess(ctx, "Review retrieved successfully", review)
}

// UpdateReview updates a review
func (h *ReviewHandler) UpdateReview(ctx *gin.Context) {
	// Get user ID from JWT token
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized")
		return
	}

	reviewID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid review ID")
		return
	}

	var req dto.UpdateReviewRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	review, err := h.reviewService.UpdateReview(uint(reviewID), userID, &req)
	if err != nil {
		if err.Error() == "review not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		if err.Error() == "you can only update your own reviews" {
			utils.SendError(ctx, http.StatusForbidden, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to update review")
		return
	}

	utils.SendSuccess(ctx, "Review updated successfully", review)
}

// DeleteReview deletes a review
func (h *ReviewHandler) DeleteReview(ctx *gin.Context) {
	// Get user ID from JWT token
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized")
		return
	}

	reviewID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid review ID")
		return
	}

	err = h.reviewService.DeleteReview(uint(reviewID), userID)
	if err != nil {
		if err.Error() == "you can only delete your own reviews" {
			utils.SendError(ctx, http.StatusForbidden, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to delete review")
		return
	}

	utils.SendSuccess(ctx, "Review deleted successfully", nil)
}

// GetProductReviews retrieves all reviews for a product
func (h *ReviewHandler) GetProductReviews(ctx *gin.Context) {
	productID, err := strconv.ParseUint(ctx.Param("productId"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid product ID")
		return
	}

	// Get pagination parameters
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(ctx.DefaultQuery("pageSize", "10"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	reviews, err := h.reviewService.GetProductReviews(uint(productID), page, pageSize)
	if err != nil {
		if err.Error() == "product not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to get reviews")
		return
	}

	utils.SendSuccess(ctx, "Reviews retrieved successfully", reviews)
}

// GetUserReviews retrieves all reviews by a user
func (h *ReviewHandler) GetUserReviews(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid user ID")
		return
	}

	// Get pagination parameters
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(ctx.DefaultQuery("pageSize", "10"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	reviews, err := h.reviewService.GetUserReviews(uint(userID), page, pageSize)
	if err != nil {
		utils.SendInternalError(ctx, "Failed to get reviews")
		return
	}

	utils.SendSuccess(ctx, "Reviews retrieved successfully", reviews)
}
