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

// Create creates a new order
func (r *OrderRepository) Create(order *models.Order) error {
	return r.DB.Create(order).Error
}

// FindByID retrieves an order by ID with all associations
func (r *OrderRepository) FindByID(id uint) (*models.Order, error) {
	var order models.Order
	err := r.DB.Preload("Items.ProductVariant.Product").
		Preload("User").
		First(&order, id).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

// FindByIDAndUserID retrieves an order by ID for a specific user
func (r *OrderRepository) FindByIDAndUserID(id, userID uint) (*models.Order, error) {
	var order models.Order
	err := r.DB.Where("id = ? AND user_id = ?", id, userID).
		Preload("Items.ProductVariant.Product").
		First(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

// UpdateStatus updates the order status
func (r *OrderRepository) UpdateStatus(orderID uint, status string) error {
	return r.DB.Model(&models.Order{}).
		Where("id = ?", orderID).
		Update("status", status).Error
}

// Cancel cancels an order (soft delete or status update)
func (r *OrderRepository) Cancel(orderID uint) error {
	return r.DB.Model(&models.Order{}).
		Where("id = ?", orderID).
		Update("status", "cancelled").Error
}

// GetAllOrders retrieves all orders with pagination
func (r *OrderRepository) GetAllOrders(limit, offset int) ([]*models.Order, error) {
	var orders []*models.Order
	err := r.DB.Preload("Items").
		Preload("User").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&orders).Error
	return orders, err
}

// CountUserOrders counts total orders for a user
func (r *OrderRepository) CountUserOrders(userID uint) (int64, error) {
	var count int64
	err := r.DB.Model(&models.Order{}).
		Where("user_id = ?", userID).
		Count(&count).Error
	return count, err
}

// CreateStatusHistory creates a status history entry
func (r *OrderRepository) CreateStatusHistory(history *models.OrderStatusHistory) error {
	return r.DB.Create(history).Error
}

// GetOrderStatusHistory retrieves status history for an order
func (r *OrderRepository) GetOrderStatusHistory(orderID uint) ([]*models.OrderStatusHistory, error) {
	var history []*models.OrderStatusHistory
	err := r.DB.Where("order_id = ?", orderID).
		Order("updated_at DESC").
		Find(&history).Error
	return history, err
}
