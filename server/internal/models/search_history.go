package models

import (
	"time"
)

type SearchHistory struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Query     string    `gorm:"size:255" json:"query"`
	ResultsCount int    `json:"results_count"`
	CreatedAt time.Time `json:"created_at"`
}
