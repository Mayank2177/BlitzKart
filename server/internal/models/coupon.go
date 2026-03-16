package models

import (
	"time"
	"gorm.io/gorm"
)


// Coupon represents a discount code.
type Coupon struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Code          string         `gorm:"uniqueIndex" json:"code"`
	DiscountType  string         `json:"discount_type"`
	DiscountValue float64        `json:"discount_value"`
	ExpiresAt     time.Time      `json:"expires_at"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}