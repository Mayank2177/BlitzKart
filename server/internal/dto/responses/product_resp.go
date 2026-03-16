package responses

import "time"

// ProductResponse defines what the client sees when fetching products
type ProductResponse struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	// We deliberately do NOT expose CostPrice or internal supplier IDs
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ProductListItem is a lighter version for list views (optional optimization)
type ProductListItem struct {
	ID    uint    `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Image string  `json:"image_url,omitempty"` // Assuming you add an image field later
}