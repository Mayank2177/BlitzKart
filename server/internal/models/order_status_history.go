package models

import (
	"time"

	"gorm.io/gorm"
)

// OrderStatusHistory captures the status changes for an order.
type OrderStatusHistory struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	OrderID   uint           `json:"order_id"`
	Order     Order          `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	Status    string         `json:"status"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
