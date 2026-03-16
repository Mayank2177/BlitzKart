package models

import (
	"time"

	"gorm.io/gorm"
)

// OrderItem represents a product within an order.
type OrderItem struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	OrderID          uint           `json:"order_id"`
	Order            Order          `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	ProductVariantID uint           `json:"product_variant_id"`
	ProductVariant   ProductVariant `gorm:"foreignKey:ProductVariantID" json:"product_variant,omitempty"`
	Quantity         int            `json:"quantity"`
	Price            float64        `json:"price"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}
