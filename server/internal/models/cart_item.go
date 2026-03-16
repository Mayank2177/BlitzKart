package models

import (
	"time"

	"gorm.io/gorm"
)

// CartItem represents an item in a shopping cart.
type CartItem struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	CartID           uint           `json:"cart_id"`
	Cart             Cart           `gorm:"foreignKey:CartID" json:"cart,omitempty"`
	ProductVariantID uint           `json:"product_variant_id"`
	ProductVariant   ProductVariant `gorm:"foreignKey:ProductVariantID" json:"product_variant,omitempty"`
	Quantity         int            `json:"quantity"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}
