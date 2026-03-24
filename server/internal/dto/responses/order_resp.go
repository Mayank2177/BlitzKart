package responses

import "time"

// OrderItemResponse represents a single item in an order response
type OrderItemResponse struct {
	ID               uint    `json:"id"`
	ProductVariantID uint    `json:"product_variant_id"`
	Quantity         int     `json:"quantity"`
	Price            float64 `json:"price"`
}

// OrderResponse is returned after creating or fetching an order
type OrderResponse struct {
	ID         uint                `json:"id"`
	UserID     uint                `json:"user_id"`
	TotalPrice float64             `json:"total_price"`
	Status     string              `json:"status"`
	Items      []OrderItemResponse `json:"items"`
	CreatedAt  time.Time           `json:"created_at"`
}
