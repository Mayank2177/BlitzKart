package models

import (
	"time"

	"gorm.io/gorm"
)

// Category represents a product category.
type Category struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	Slug      string         `json:"slug"`
	ParentID  *uint          `json:"parent_id,omitempty"`
	Parent    *Category      `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	Children  []Category     `gorm:"foreignKey:ParentID" json:"children,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
