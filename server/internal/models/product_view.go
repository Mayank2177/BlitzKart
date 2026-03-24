package models

import (
	"time"
)

type ProductView struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	ProductID uint      `json:"product_id"`
	ViewCount int       `gorm:"default:1" json:"view_count"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
