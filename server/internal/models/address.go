package models

import (
	"time"

	"gorm.io/gorm"
)

// Address stores user address information.
type Address struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `json:"user_id"`
	User      User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Street    string         `json:"street"`
	City      string         `json:"city"`
	State     string         `json:"state"`
	ZipCode   string         `json:"zip_code"`
	Country   string         `json:"country"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
