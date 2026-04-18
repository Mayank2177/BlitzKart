package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"
)

type ReviewService struct {
	reviewRepo  *repositories.ReviewRepository
	productRepo *repositories.ProductRepository
	orderRepo   *repositories.OrderRepository
}

func NewReviewService(
	reviewRepo *repositories.ReviewRepository,
	productRepo *repositories.ProductRepository,
	orderRepo *repositories.OrderRepository,
) *ReviewService {
	return &ReviewService{
		reviewRepo:  reviewRepo,
		productRepo: productRepo,
		orderRepo:   orderRepo,
	}
}

// CreateReview creates a new product review
func (s *ReviewService) CreateReview(userID uint, req *dto.CreateReviewRequest) (*dto.ReviewResponse, error) {
	// Check if product exists
	product, err := s.productRepo.FindById(req.ProductID)
	if err != nil {
		return nil, errors.New("product not found")
	}
	if product == nil {
		return nil, errors.New("product not found")
	}

	// Check if user has purchased this product
	hasPurchased, err := s.orderRepo.CheckUserPurchasedProduct(userID, req.ProductID)
	if err != nil {
		return nil, err
	}
	if !hasPurchased {
		return nil, errors.New("you can only review products you have purchased")
	}

	// Check if user already reviewed this product
	exists, err := s.reviewRepo.CheckUserReviewExists(userID, req.ProductID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("you have already reviewed this product")
	}

	// Create review
	review := &models.Review{
		UserID:    userID,
		ProductID: req.ProductID,
		Rating:    req.Rating,
		Comment:   req.Comment,
	}

	if err := s.reviewRepo.Create(review); err != nil {
		return nil, err
	}

	// Get the created review with user info
	createdReview, err := s.reviewRepo.GetByID(review.ID)
	if err != nil {
		return nil, err
	}

	return s.toReviewResponse(createdReview), nil
}

// GetReviewByID retrieves a review by ID
func (s *ReviewService) GetReviewByID(id uint) (*dto.ReviewResponse, error) {
	review, err := s.reviewRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("review not found")
	}
	return s.toReviewResponse(review), nil
}

// UpdateReview updates a review
func (s *ReviewService) UpdateReview(reviewID, userID uint, req *dto.UpdateReviewRequest) (*dto.ReviewResponse, error) {
	// Check if review exists and belongs to user
	review, err := s.reviewRepo.GetByID(reviewID)
	if err != nil {
		return nil, errors.New("review not found")
	}

	if review.UserID != userID {
		return nil, errors.New("you can only update your own reviews")
	}

	// Update review
	review.Rating = req.Rating
	review.Comment = req.Comment

	if err := s.reviewRepo.Update(review); err != nil {
		return nil, err
	}

	// Get updated review
	updatedReview, err := s.reviewRepo.GetByID(reviewID)
	if err != nil {
		return nil, err
	}

	return s.toReviewResponse(updatedReview), nil
}

// DeleteReview deletes a review
func (s *ReviewService) DeleteReview(reviewID, userID uint) error {
	// Check if review exists and belongs to user
	owns, err := s.reviewRepo.CheckUserOwnsReview(reviewID, userID)
	if err != nil {
		return err
	}
	if !owns {
		return errors.New("you can only delete your own reviews")
	}

	return s.reviewRepo.Delete(reviewID)
}

// GetProductReviews retrieves all reviews for a product
func (s *ReviewService) GetProductReviews(productID uint, page, pageSize int) (*dto.ProductReviewsResponse, error) {
	// Check if product exists
	product, err := s.productRepo.FindById(productID)
	if err != nil || product == nil {
		return nil, errors.New("product not found")
	}

	// Calculate offset
	offset := (page - 1) * pageSize

	// Get reviews
	reviews, err := s.reviewRepo.GetByProductID(productID, pageSize, offset)
	if err != nil {
		return nil, err
	}

	// Get total count
	totalCount, err := s.reviewRepo.CountByProductID(productID)
	if err != nil {
		return nil, err
	}

	// Get average rating
	avgRating, err := s.reviewRepo.GetAverageRatingByProductID(productID)
	if err != nil {
		return nil, err
	}

	// Get rating breakdown
	breakdown, err := s.reviewRepo.GetRatingBreakdownByProductID(productID)
	if err != nil {
		return nil, err
	}

	// Convert to response
	reviewResponses := make([]dto.ReviewResponse, 0, len(reviews))
	for _, review := range reviews {
		reviewResponses = append(reviewResponses, *s.toReviewResponse(&review))
	}

	return &dto.ProductReviewsResponse{
		ProductID:       productID,
		TotalReviews:    totalCount,
		AverageRating:   avgRating,
		RatingBreakdown: breakdown,
		Reviews:         reviewResponses,
	}, nil
}

// GetUserReviews retrieves all reviews by a user
func (s *ReviewService) GetUserReviews(userID uint, page, pageSize int) (*dto.UserReviewsResponse, error) {
	// Calculate offset
	offset := (page - 1) * pageSize

	// Get reviews
	reviews, err := s.reviewRepo.GetByUserID(userID, pageSize, offset)
	if err != nil {
		return nil, err
	}

	// Get total count
	totalCount, err := s.reviewRepo.CountByUserID(userID)
	if err != nil {
		return nil, err
	}

	// Convert to response
	reviewResponses := make([]dto.ReviewResponse, 0, len(reviews))
	for _, review := range reviews {
		reviewResponses = append(reviewResponses, *s.toReviewResponse(&review))
	}

	return &dto.UserReviewsResponse{
		UserID:       userID,
		TotalReviews: totalCount,
		Reviews:      reviewResponses,
	}, nil
}

// Helper function to convert model to response
func (s *ReviewService) toReviewResponse(review *models.Review) *dto.ReviewResponse {
	userName := ""
	if review.User.FirstName != "" || review.User.LastName != "" {
		userName = review.User.FirstName + " " + review.User.LastName
	} else if review.User.Email != "" {
		userName = review.User.Email
	}

	return &dto.ReviewResponse{
		ID:        review.ID,
		UserID:    review.UserID,
		UserName:  userName,
		ProductID: review.ProductID,
		Rating:    review.Rating,
		Comment:   review.Comment,
		CreatedAt: review.CreatedAt,
		UpdatedAt: review.UpdatedAt,
	}
}
