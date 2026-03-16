package models

import (
	"time"

	"gorm.io/gorm"
)

// Shipment represents a shipment for an order.
type Shipment struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	OrderID        uint           `json:"order_id"`
	Order          Order          `gorm:"foreignKey:OrderID" json:"order,omitempty"`
	AddressID      uint           `json:"address_id"`
	TrackingNumber string         `json:"tracking_number"`
	Status         string         `json:"status"`
	ShippedAt      *time.Time     `json:"shipped_at,omitempty"`
	DeliveredAt    *time.Time     `json:"delivered_at,omitempty"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
