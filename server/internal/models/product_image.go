package models

import (
	"time"

	"gorm.io/gorm"
)

// ProductImage represents an image associated with a product.
type ProductImage struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	ProductID uint           `json:"product_id"`
	Product   Product        `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	URL       string         `json:"url"`
	AltText   string         `json:"alt_text"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
