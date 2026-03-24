package repositories

import (
	"server/internal/database"
	"server/internal/models"
	"gorm.io/gorm"
)

type SearchHistoryRepository struct {
	*database.BaseRepository
}

func NewSearchHistoryRepository(db *gorm.DB) *SearchHistoryRepository {
	return &SearchHistoryRepository{
		BaseRepository: database.NewBaseRepository(db),
	}
}

func (r *SearchHistoryRepository) Create(history *models.SearchHistory) error {
	return r.DB.Create(history).Error
}

func (r *SearchHistoryRepository) GetUserSearchHistory(userID uint, limit int) ([]*models.SearchHistory, error) {
	var history []*models.SearchHistory
	err := r.DB.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Find(&history).Error
	return history, err
}

func (r *SearchHistoryRepository) GetPopularSearches(limit int) ([]string, error) {
	var queries []string
	err := r.DB.Model(&models.SearchHistory{}).
		Select("query").
		Group("query").
		Order("COUNT(*) DESC").
		Limit(limit).
		Pluck("query", &queries).Error
	return queries, err
}
