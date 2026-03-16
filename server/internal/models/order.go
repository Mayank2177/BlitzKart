package models

import (
	"time"

	"gorm.io/gorm"
)

// Order represents a customer order.
type Order struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	UserID     uint           `json:"user_id"`
	User       User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	TotalPrice float64        `json:"total_price"`
	Status     string         `gorm:"default:'pending'" json:"status"`
	Items      []OrderItem    `gorm:"foreignKey:OrderID" json:"items,omitempty"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
