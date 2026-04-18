package dto

import "time"

// CreateReviewRequest represents the request to create a review
type CreateReviewRequest struct {
	ProductID uint   `json:"product_id" binding:"required"`
	Rating    int    `json:"rating" binding:"required,min=1,max=5"`
	Comment   string `json:"comment" binding:"required,min=10,max=500"`
}

// UpdateReviewRequest represents the request to update a review
type UpdateReviewRequest struct {
	Rating  int    `json:"rating" binding:"required,min=1,max=5"`
	Comment string `json:"comment" binding:"required,min=10,max=500"`
}

// ReviewResponse represents a review in API responses
type ReviewResponse struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	UserName  string    `json:"user_name"`
	ProductID uint      `json:"product_id"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ProductReviewsResponse represents all reviews for a product
type ProductReviewsResponse struct {
	ProductID     uint             `json:"product_id"`
	TotalReviews  int64            `json:"total_reviews"`
	AverageRating float64          `json:"average_rating"`
	RatingBreakdown map[int]int64  `json:"rating_breakdown"` // e.g., {5: 10, 4: 5, 3: 2, 2: 1, 1: 0}
	Reviews       []ReviewResponse `json:"reviews"`
}

// UserReviewsResponse represents all reviews by a user
type UserReviewsResponse struct {
	UserID       uint             `json:"user_id"`
	TotalReviews int64            `json:"total_reviews"`
	Reviews      []ReviewResponse `json:"reviews"`
}
