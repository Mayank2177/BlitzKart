package repositories

import (
	"server/internal/database"
	"server/internal/models"
	"gorm.io/gorm"
)

type OrderRepository struct {
	*database.BaseRepository
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{
		BaseRepository: database.NewBaseRepository(db),
	}
}

// GetUserOrders returns all orders for a user
func (r *OrderRepository) GetUserOrders(userID uint, limit int) ([]*models.Order, error) {
	var orders []*models.Order
	err := r.DB.Where("user_id = ?", userID).
		Preload("Items").
		Order("created_at DESC").
		Limit(limit).
		Find(&orders).Error
	return orders, err
}

// GetUserPurchasedProductIDs returns product IDs from user's past orders
func (r *OrderRepository) GetUserPurchasedProductIDs(userID uint, limit int) ([]uint, error) {
	var productIDs []uint
	
	// Get product variant IDs from order items
	err := r.DB.Table("order_items").
		Select("DISTINCT product_variants.product_id").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Joins("JOIN product_variants ON product_variants.id = order_items.product_variant_id").
		Where("orders.user_id = ? AND orders.status IN ?", userID, []string{"delivered", "completed"}).
		Order("order_items.created_at DESC").
		Limit(limit).
		Pluck("product_variants.product_id", &productIDs).Error
	
	return productIDs, err
}

// GetUserOrderedCategories returns category IDs from user's past orders
func (r *OrderRepository) GetUserOrderedCategories(userID uint) ([]uint, error) {
	var categoryIDs []uint
	
	err := r.DB.Table("order_items").
		Select("DISTINCT products.category_id").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Joins("JOIN product_variants ON product_variants.id = order_items.product_variant_id").
		Joins("JOIN products ON products.id = product_variants.product_id").
		Where("orders.user_id = ? AND orders.status IN ?", userID, []string{"delivered", "completed"}).
		Pluck("products.category_id", &categoryIDs).Error
	
	return categoryIDs, err
}

// GetFrequentlyOrderedProducts returns products user orders most
func (r *OrderRepository) GetFrequentlyOrderedProducts(userID uint, limit int) ([]uint, error) {
	var productIDs []uint
	
	err := r.DB.Table("order_items").
		Select("product_variants.product_id, COUNT(*) as order_count").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Joins("JOIN product_variants ON product_variants.id = order_items.product_variant_id").
		Where("orders.user_id = ? AND orders.status IN ?", userID, []string{"delivered", "completed"}).
		Group("product_variants.product_id").
		Order("order_count DESC").
		Limit(limit).
		Pluck("product_variants.product_id", &productIDs).Error
	
	return productIDs, err
}
