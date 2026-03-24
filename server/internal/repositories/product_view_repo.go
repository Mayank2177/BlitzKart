package repositories

import (
	"server/internal/database"
	"server/internal/models"
	"gorm.io/gorm"
)

type ProductViewRepository struct {
	*database.BaseRepository
}

func NewProductViewRepository(db *gorm.DB) *ProductViewRepository {
	return &ProductViewRepository{
		BaseRepository: database.NewBaseRepository(db),
	}
}

func (r *ProductViewRepository) RecordView(userID, productID uint) (int, error) {
	var view models.ProductView
	
	// Check if view exists
	err := r.DB.Where("user_id = ? AND product_id = ?", userID, productID).First(&view).Error
	
	if err == gorm.ErrRecordNotFound {
		// Create new view
		view = models.ProductView{
			UserID:    userID,
			ProductID: productID,
			ViewCount: 1,
		}
		err = r.DB.Create(&view).Error
		return 1, err
	}
	
	if err != nil {
		return 0, err
	}
	
	// Increment view count
	view.ViewCount++
	err = r.DB.Save(&view).Error
	return view.ViewCount, err
}

func (r *ProductViewRepository) GetUserViewedProducts(userID uint, limit int) ([]uint, error) {
	var productIDs []uint
	err := r.DB.Model(&models.ProductView{}).
		Where("user_id = ?", userID).
		Order("view_count DESC, updated_at DESC").
		Limit(limit).
		Pluck("product_id", &productIDs).Error
	return productIDs, err
}

func (r *ProductViewRepository) GetMostViewedProducts(limit int) ([]uint, error) {
	var productIDs []uint
	err := r.DB.Model(&models.ProductView{}).
		Select("product_id").
		Group("product_id").
		Order("SUM(view_count) DESC").
		Limit(limit).
		Pluck("product_id", &productIDs).Error
	return productIDs, err
}
