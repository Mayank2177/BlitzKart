package repositories

import (
	"server/internal/models"
	"time"
	"gorm.io/gorm"
)

type CouponRepository struct {
	DB *gorm.DB
}

func NewCouponRepository(db *gorm.DB) *CouponRepository {
	return &CouponRepository{DB: db}
}

// Create creates a new coupon
func (r *CouponRepository) Create(coupon *models.Coupon) error {
	return r.DB.Create(coupon).Error
}

// GetByID retrieves a coupon by ID
func (r *CouponRepository) GetByID(id uint) (*models.Coupon, error) {
	var coupon models.Coupon
	err := r.DB.First(&coupon, id).Error
	if err != nil {
		return nil, err
	}
	return &coupon, nil
}

// GetByCode retrieves a coupon by code
func (r *CouponRepository) GetByCode(code string) (*models.Coupon, error) {
	var coupon models.Coupon
	err := r.DB.Where("code = ?", code).First(&coupon).Error
	if err != nil {
		return nil, err
	}
	return &coupon, nil
}

// Update updates a coupon
func (r *CouponRepository) Update(coupon *models.Coupon) error {
	return r.DB.Save(coupon).Error
}

// Delete soft deletes a coupon
func (r *CouponRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Coupon{}, id).Error
}

// GetAll retrieves all coupons
func (r *CouponRepository) GetAll() ([]models.Coupon, error) {
	var coupons []models.Coupon
	err := r.DB.Order("created_at DESC").Find(&coupons).Error
	return coupons, err
}

// GetActive retrieves all active (non-expired) coupons
func (r *CouponRepository) GetActive() ([]models.Coupon, error) {
	var coupons []models.Coupon
	err := r.DB.Where("expires_at > ?", time.Now()).
		Order("created_at DESC").
		Find(&coupons).Error
	return coupons, err
}

// CheckCodeExists checks if a coupon code already exists (excluding given ID)
func (r *CouponRepository) CheckCodeExists(code string, excludeID uint) (bool, error) {
	var count int64
	query := r.DB.Model(&models.Coupon{}).Where("code = ?", code)
	if excludeID > 0 {
		query = query.Where("id != ?", excludeID)
	}
	err := query.Count(&count).Error
	return count > 0, err
}

// Count returns total number of coupons
func (r *CouponRepository) Count() (int, error) {
	var count int64
	err := r.DB.Model(&models.Coupon{}).Count(&count).Error
	return int(count), err
}

// IsExpired checks if a coupon is expired
func (r *CouponRepository) IsExpired(coupon *models.Coupon) bool {
	return time.Now().After(coupon.ExpiresAt)
}

// GetExpiredCoupons retrieves all expired coupons
func (r *CouponRepository) GetExpiredCoupons() ([]models.Coupon, error) {
	var coupons []models.Coupon
	err := r.DB.Where("expires_at <= ?", time.Now()).
		Order("expires_at DESC").
		Find(&coupons).Error
	return coupons, err
}