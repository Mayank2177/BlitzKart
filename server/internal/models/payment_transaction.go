package models

import (
	"time"

	"gorm.io/gorm"
)

// PaymentTransaction represents a payment capture for an order.
type PaymentTransaction struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	OrderID        uint           `json:"order_id"`
	Order          Order          `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Amount         float64        `json:"amount"`
	Provider       string         `json:"provider"`
	Status         string         `json:"status"`
	TransactionRef string         `json:"transaction_ref"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
