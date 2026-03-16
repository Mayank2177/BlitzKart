package models

import (
	"time"

	"gorm.io/gorm"
)

// Product represents a catalog item.
type Product struct {
	ID          uint             `gorm:"primaryKey" json:"id"`
	Name        string           `json:"name"`
	Description string           `json:"description"`
	SKU         string           `json:"sku"`
	Price       float64          `json:"price"`
	CategoryID  uint             `json:"category_id"`
	Category    Category         `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Variants    []ProductVariant `gorm:"foreignKey:ProductID" json:"variants,omitempty"`
	Images      []ProductImage   `gorm:"foreignKey:ProductID" json:"images,omitempty"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
	DeletedAt   gorm.DeletedAt   `gorm:"index" json:"-"`
}