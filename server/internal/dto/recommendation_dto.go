package dto

type RecommendationResponse struct {
	Products []ProductRecommendation `json:"products"`
	Reason   string                  `json:"reason"`
}

type ProductRecommendation struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	CategoryID  uint    `json:"category_id"`
	Score       float64 `json:"score"`
	ImageURL    string  `json:"image_url,omitempty"`
}

type SearchHistoryRequest struct {
	Query string `json:"query" binding:"required"`
}

type ProductViewResponse struct {
	Message   string `json:"message"`
	UserID    uint   `json:"user_id"`
	ProductID uint   `json:"product_id"`
	ViewCount int    `json:"view_count"`
}
