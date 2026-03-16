package models

import (
	"time"

	"gorm.io/gorm"
)

// ProductVariant represents a specific variant of a product (size/color/etc).
type ProductVariant struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	ProductID uint           `json:"product_id"`
	Product   Product        `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	SKU       string         `json:"sku"`
	Price     float64        `json:"price"`
	Stock     int            `json:"stock"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
