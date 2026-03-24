package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"server/internal/dto"
	"server/internal/services"
)

type RecommendationHandler struct {
	recommendationService *services.RecommendationService
}

func NewRecommendationHandler(recommendationService *services.RecommendationService) *RecommendationHandler {
	return &RecommendationHandler{
		recommendationService: recommendationService,
	}
}

// GetRecommendations returns personalized recommendations for a user
func (h *RecommendationHandler) GetRecommendations(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	limit := 10
	if limitParam := ctx.Query("limit"); limitParam != "" {
		if l, err := strconv.Atoi(limitParam); err == nil && l > 0 {
			limit = l
		}
	}

	recommendations, err := h.recommendationService.GetRecommendations(uint(userID), limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get recommendations"})
		return
	}

	ctx.JSON(http.StatusOK, recommendations)
}

// RecordSearch saves a user's search query
func (h *RecommendationHandler) RecordSearch(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var req dto.SearchHistoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Record the search (results count can be updated later)
	err = h.recommendationService.RecordSearch(uint(userID), req.Query, 0)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record search"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Search recorded successfully"})
}

// RecordProductView tracks when a user views a product
func (h *RecommendationHandler) RecordProductView(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	productID, err := strconv.ParseUint(ctx.Param("productId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	viewCount, err := h.recommendationService.RecordProductView(uint(userID), uint(productID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record view"})
		return
	}

	ctx.JSON(http.StatusOK, dto.ProductViewResponse{
		Message:   "Product view recorded successfully",
		UserID:    uint(userID),
		ProductID: uint(productID),
		ViewCount: viewCount,
	})
}

// GetSearchSuggestions returns search suggestions based on query
func (h *RecommendationHandler) GetSearchSuggestions(ctx *gin.Context) {
	query := ctx.Query("q")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter 'q' is required"})
		return
	}

	limit := 5
	if limitParam := ctx.Query("limit"); limitParam != "" {
		if l, err := strconv.Atoi(limitParam); err == nil && l > 0 {
			limit = l
		}
	}

	suggestions, err := h.recommendationService.GetSearchSuggestions(query, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get suggestions"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"suggestions": suggestions})
}

// GetReorderRecommendations returns products user might want to reorder
func (h *RecommendationHandler) GetReorderRecommendations(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("userId"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	limit := 10
	if limitParam := ctx.Query("limit"); limitParam != "" {
		if l, err := strconv.Atoi(limitParam); err == nil && l > 0 {
			limit = l
		}
	}

	recommendations, err := h.recommendationService.GetReorderRecommendations(uint(userID), limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get reorder recommendations"})
		return
	}

	ctx.JSON(http.StatusOK, recommendations)
}
