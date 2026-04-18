package repositories

import (
	"server/internal/models"
	"gorm.io/gorm"
)

type ReviewRepository struct {
	DB *gorm.DB
}

func NewReviewRepository(db *gorm.DB) *ReviewRepository {
	return &ReviewRepository{DB: db}
}

// Create creates a new review
func (r *ReviewRepository) Create(review *models.Review) error {
	return r.DB.Create(review).Error
}

// GetByID retrieves a review by ID
func (r *ReviewRepository) GetByID(id uint) (*models.Review, error) {
	var review models.Review
	err := r.DB.Preload("User").Preload("Product").First(&review, id).Error
	if err != nil {
		return nil, err
	}
	return &review, nil
}

// Update updates a review
func (r *ReviewRepository) Update(review *models.Review) error {
	return r.DB.Save(review).Error
}

// Delete soft deletes a review
func (r *ReviewRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Review{}, id).Error
}

// GetByProductID retrieves all reviews for a product
func (r *ReviewRepository) GetByProductID(productID uint, limit, offset int) ([]models.Review, error) {
	var reviews []models.Review
	err := r.DB.
		Preload("User").
		Where("product_id = ?", productID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error
	return reviews, err
}

// GetByUserID retrieves all reviews by a user
func (r *ReviewRepository) GetByUserID(userID uint, limit, offset int) ([]models.Review, error) {
	var reviews []models.Review
	err := r.DB.
		Preload("Product").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error
	return reviews, err
}

// CountByProductID counts total reviews for a product
func (r *ReviewRepository) CountByProductID(productID uint) (int64, error) {
	var count int64
	err := r.DB.Model(&models.Review{}).Where("product_id = ?", productID).Count(&count).Error
	return count, err
}

// CountByUserID counts total reviews by a user
func (r *ReviewRepository) CountByUserID(userID uint) (int64, error) {
	var count int64
	err := r.DB.Model(&models.Review{}).Where("user_id = ?", userID).Count(&count).Error
	return count, err
}

// GetAverageRatingByProductID calculates average rating for a product
func (r *ReviewRepository) GetAverageRatingByProductID(productID uint) (float64, error) {
	var avgRating float64
	err := r.DB.Model(&models.Review{}).
		Where("product_id = ?", productID).
		Select("COALESCE(AVG(rating), 0)").
		Scan(&avgRating).Error
	return avgRating, err
}

// GetRatingBreakdownByProductID gets count of each rating (1-5) for a product
func (r *ReviewRepository) GetRatingBreakdownByProductID(productID uint) (map[int]int64, error) {
	breakdown := make(map[int]int64)
	
	// Initialize all ratings to 0
	for i := 1; i <= 5; i++ {
		breakdown[i] = 0
	}
	
	// Get actual counts
	type RatingCount struct {
		Rating int   `json:"rating"`
		Count  int64 `json:"count"`
	}
	
	var results []RatingCount
	err := r.DB.Model(&models.Review{}).
		Select("rating, COUNT(*) as count").
		Where("product_id = ?", productID).
		Group("rating").
		Scan(&results).Error
	
	if err != nil {
		return breakdown, err
	}
	
	// Update breakdown with actual counts
	for _, result := range results {
		breakdown[result.Rating] = result.Count
	}
	
	return breakdown, nil
}

// CheckUserReviewExists checks if user already reviewed a product
func (r *ReviewRepository) CheckUserReviewExists(userID, productID uint) (bool, error) {
	var count int64
	err := r.DB.Model(&models.Review{}).
		Where("user_id = ? AND product_id = ?", userID, productID).
		Count(&count).Error
	return count > 0, err
}

// GetUserReviewForProduct gets a user's review for a specific product
func (r *ReviewRepository) GetUserReviewForProduct(userID, productID uint) (*models.Review, error) {
	var review models.Review
	err := r.DB.
		Where("user_id = ? AND product_id = ?", userID, productID).
		First(&review).Error
	if err != nil {
		return nil, err
	}
	return &review, nil
}

// CheckUserOwnsReview checks if a review belongs to a user
func (r *ReviewRepository) CheckUserOwnsReview(reviewID, userID uint) (bool, error) {
	var count int64
	err := r.DB.Model(&models.Review{}).
		Where("id = ? AND user_id = ?", reviewID, userID).
		Count(&count).Error
	return count > 0, err
}
