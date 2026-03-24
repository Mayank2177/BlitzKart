package services

import (
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"
	"strings"
)

type RecommendationService struct {
	searchHistoryRepo *repositories.SearchHistoryRepository
	productViewRepo   *repositories.ProductViewRepository
	productRepo       *repositories.ProductRepository
	orderRepo         *repositories.OrderRepository
}

func NewRecommendationService(
	searchHistoryRepo *repositories.SearchHistoryRepository,
	productViewRepo *repositories.ProductViewRepository,
	productRepo *repositories.ProductRepository,
	orderRepo *repositories.OrderRepository,
) *RecommendationService {
	return &RecommendationService{
		searchHistoryRepo: searchHistoryRepo,
		productViewRepo:   productViewRepo,
		productRepo:       productRepo,
		orderRepo:         orderRepo,
	}
}

// GetRecommendations returns personalized product recommendations
func (s *RecommendationService) GetRecommendations(userID uint, limit int) (*dto.RecommendationResponse, error) {
	// Get user's search history
	searchHistory, err := s.searchHistoryRepo.GetUserSearchHistory(userID, 10)
	if err != nil {
		return nil, err
	}

	// Get user's viewed products
	viewedProductIDs, err := s.productViewRepo.GetUserViewedProducts(userID, 10)
	if err != nil {
		return nil, err
	}

	// Get user's past orders
	purchasedProductIDs, err := s.orderRepo.GetUserPurchasedProductIDs(userID, 10)
	if err != nil {
		return nil, err
	}

	var recommendations []dto.ProductRecommendation
	var excludeIDs []uint
	reason := "Based on your browsing history"

	// Exclude already purchased products from recommendations
	excludeIDs = append(excludeIDs, purchasedProductIDs...)

	// Strategy 1: Recommend based on past orders (highest priority)
	if len(purchasedProductIDs) > 0 {
		orderProducts, _ := s.getProductsByPastOrders(userID, purchasedProductIDs, limit)
		recommendations = append(recommendations, orderProducts...)
		reason = "Based on your past orders"
	}

	// Strategy 2: Recommend based on viewed products' categories
	if len(viewedProductIDs) > 0 && len(recommendations) < limit {
		excludeIDs = append(excludeIDs, viewedProductIDs...)
		categoryProducts, _ := s.getProductsByViewedCategories(viewedProductIDs, excludeIDs, limit-len(recommendations))
		recommendations = append(recommendations, categoryProducts...)
		if len(purchasedProductIDs) == 0 {
			reason = "Based on products you've viewed"
		}
	}

	// Strategy 3: Recommend based on search keywords
	if len(searchHistory) > 0 && len(recommendations) < limit {
		searchProducts, _ := s.getProductsBySearchKeywords(searchHistory, excludeIDs, limit-len(recommendations))
		recommendations = append(recommendations, searchProducts...)
		if len(recommendations) > 0 && len(purchasedProductIDs) == 0 && len(viewedProductIDs) == 0 {
			reason = "Based on your search history"
		}
	}

	// Strategy 4: Fallback to popular products
	if len(recommendations) < limit {
		popularProducts, _ := s.getPopularProducts(excludeIDs, limit-len(recommendations))
		recommendations = append(recommendations, popularProducts...)
		if len(viewedProductIDs) == 0 && len(searchHistory) == 0 && len(purchasedProductIDs) == 0 {
			reason = "Popular products you might like"
		}
	}

	return &dto.RecommendationResponse{
		Products: recommendations,
		Reason:   reason,
	}, nil
}

// RecordSearch saves user search query
func (s *RecommendationService) RecordSearch(userID uint, query string, resultsCount int) error {
	history := &models.SearchHistory{
		UserID:       userID,
		Query:        query,
		ResultsCount: resultsCount,
	}
	return s.searchHistoryRepo.Create(history)
}

// RecordProductView tracks when user views a product
func (s *RecommendationService) RecordProductView(userID, productID uint) (int, error) {
	return s.productViewRepo.RecordView(userID, productID)
}

// Helper functions
func (s *RecommendationService) getProductsByPastOrders(userID uint, purchasedProductIDs []uint, limit int) ([]dto.ProductRecommendation, error) {
	// Get categories from past orders
	categoryIDs, err := s.orderRepo.GetUserOrderedCategories(userID)
	if err != nil || len(categoryIDs) == 0 {
		return nil, err
	}

	// Find similar products in same categories (excluding already purchased)
	var recommendations []models.Product
	err = s.productRepo.DB.
		Where("category_id IN ?", categoryIDs).
		Where("id NOT IN ?", purchasedProductIDs).
		Order("created_at DESC").
		Limit(limit).
		Find(&recommendations).Error

	return s.convertToRecommendations(recommendations), err
}

func (s *RecommendationService) getProductsByViewedCategories(viewedProductIDs []uint, excludeIDs []uint, limit int) ([]dto.ProductRecommendation, error) {
	// Get categories of viewed products
	var products []models.Product
	err := s.productRepo.DB.Where("id IN ?", viewedProductIDs).Find(&products).Error
	if err != nil {
		return nil, err
	}

	// Extract unique category IDs
	categoryMap := make(map[uint]bool)
	for _, p := range products {
		categoryMap[p.CategoryID] = true
	}

	var categoryIDs []uint
	for id := range categoryMap {
		categoryIDs = append(categoryIDs, id)
	}

	// Find products in same categories (excluding already viewed/purchased)
	var recommendations []models.Product
	query := s.productRepo.DB.Where("category_id IN ?", categoryIDs)
	
	if len(excludeIDs) > 0 {
		query = query.Where("id NOT IN ?", excludeIDs)
	}
	
	err = query.Limit(limit).Find(&recommendations).Error

	return s.convertToRecommendations(recommendations), err
}

func (s *RecommendationService) getProductsBySearchKeywords(searchHistory []*models.SearchHistory, excludeIDs []uint, limit int) ([]dto.ProductRecommendation, error) {
	// Extract keywords from search history
	var keywords []string
	for _, search := range searchHistory {
		keywords = append(keywords, search.Query)
	}

	// Search products by keywords
	var products []models.Product
	query := s.productRepo.DB.Limit(limit)
	
	if len(excludeIDs) > 0 {
		query = query.Where("id NOT IN ?", excludeIDs)
	}
	
	for _, keyword := range keywords {
		query = query.Or("name LIKE ? OR description LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}
	
	err := query.Find(&products).Error
	return s.convertToRecommendations(products), err
}

func (s *RecommendationService) getPopularProducts(excludeIDs []uint, limit int) ([]dto.ProductRecommendation, error) {
	productIDs, err := s.productViewRepo.GetMostViewedProducts(limit * 2) // Get more to filter
	if err != nil || len(productIDs) == 0 {
		// Fallback to newest products
		var products []models.Product
		query := s.productRepo.DB.Order("created_at DESC").Limit(limit)
		if len(excludeIDs) > 0 {
			query = query.Where("id NOT IN ?", excludeIDs)
		}
		err = query.Find(&products).Error
		return s.convertToRecommendations(products), err
	}

	// Filter out excluded IDs
	var filteredIDs []uint
	excludeMap := make(map[uint]bool)
	for _, id := range excludeIDs {
		excludeMap[id] = true
	}
	
	for _, id := range productIDs {
		if !excludeMap[id] {
			filteredIDs = append(filteredIDs, id)
			if len(filteredIDs) >= limit {
				break
			}
		}
	}

	if len(filteredIDs) == 0 {
		return nil, nil
	}

	var products []models.Product
	err = s.productRepo.DB.Where("id IN ?", filteredIDs).Limit(limit).Find(&products).Error
	return s.convertToRecommendations(products), err
}

func (s *RecommendationService) convertToRecommendations(products []models.Product) []dto.ProductRecommendation {
	var recommendations []dto.ProductRecommendation
	for _, p := range products {
		recommendations = append(recommendations, dto.ProductRecommendation{
			ID:         p.ID,
			Name:       p.Name,
			Price:      p.Price,
			CategoryID: p.CategoryID,
			Score:      1.0,
		})
	}
	return recommendations
}

// GetSearchSuggestions returns search suggestions based on history
func (s *RecommendationService) GetSearchSuggestions(query string, limit int) ([]string, error) {
	var suggestions []string
	
	// Get popular searches that match the query
	err := s.searchHistoryRepo.DB.Model(&models.SearchHistory{}).
		Select("DISTINCT query").
		Where("query LIKE ?", "%"+strings.ToLower(query)+"%").
		Group("query").
		Order("COUNT(*) DESC").
		Limit(limit).
		Pluck("query", &suggestions).Error
	
	return suggestions, err
}

// GetReorderRecommendations suggests products user might want to reorder
func (s *RecommendationService) GetReorderRecommendations(userID uint, limit int) (*dto.RecommendationResponse, error) {
	// Get frequently ordered products
	frequentProductIDs, err := s.orderRepo.GetFrequentlyOrderedProducts(userID, limit)
	if err != nil || len(frequentProductIDs) == 0 {
		return &dto.RecommendationResponse{
			Products: []dto.ProductRecommendation{},
			Reason:   "No past orders found",
		}, nil
	}

	// Get product details
	var products []models.Product
	err = s.productRepo.DB.Where("id IN ?", frequentProductIDs).Find(&products).Error
	if err != nil {
		return nil, err
	}

	return &dto.RecommendationResponse{
		Products: s.convertToRecommendations(products),
		Reason:   "Products you order frequently",
	}, nil
}
