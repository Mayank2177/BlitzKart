package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	FirstName   string         `json:"first_name"`
	LastName    string         `json:"last_name"`
	PhoneNumber string         `json:"phone_number"`
	Email       string         `gorm:"uniqueIndex;size:255" json:"email"`
	Password    string         `gorm:"size:255" json:"-"` // Hide from JSON
	Orders      []Order        `json:"orders,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"` // Soft delete support
}
