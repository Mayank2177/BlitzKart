package repositories

import (
	"server/internal/models"

	"gorm.io/gorm"
)

type ProductVariantRepository struct {
	db *gorm.DB
}

func NewProductVariantRepository(db *gorm.DB) *ProductVariantRepository {
	return &ProductVariantRepository{db: db}
}

// FindByID retrieves a product variant by ID
func (r *ProductVariantRepository) FindByID(id uint) (*models.ProductVariant, error) {
	var variant models.ProductVariant
	err := r.db.Preload("Product").First(&variant, id).Error
	if err != nil {
		return nil, err
	}
	return &variant, nil
}

// CheckStock checks if the variant has sufficient stock
func (r *ProductVariantRepository) CheckStock(variantID uint, quantity int) (bool, error) {
	var variant models.ProductVariant
	err := r.db.First(&variant, variantID).Error
	if err != nil {
		return false, err
	}
	return variant.Stock >= quantity, nil
}

// UpdateStock updates the stock of a product variant
func (r *ProductVariantRepository) UpdateStock(variantID uint, quantity int) error {
	return r.db.Model(&models.ProductVariant{}).
		Where("id = ?", variantID).
		UpdateColumn("stock", gorm.Expr("stock + ?", quantity)).
		Error
}
