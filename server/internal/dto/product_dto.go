package dto

import "time"

// CreateProductRequest represents the request to create a new product
type CreateProductRequest struct {
	Name        string  `json:"name" binding:"required,min=3,max=200"`
	Description string  `json:"description" binding:"max=1000"`
	SKU         string  `json:"sku" binding:"required,min=3,max=100"`
	Price       float64 `json:"price" binding:"required,gt=0"`
	CategoryID  uint    `json:"category_id" binding:"required"`
}

// UpdateProductRequest represents the request to update a product
type UpdateProductRequest struct {
	Name        string  `json:"name" binding:"omitempty,min=3,max=200"`
	Description string  `json:"description" binding:"omitempty,max=1000"`
	SKU         string  `json:"sku" binding:"omitempty,min=3,max=100"`
	Price       float64 `json:"price" binding:"omitempty,gt=0"`
	CategoryID  uint    `json:"category_id" binding:"omitempty"`
}

// ProductDetailResponse represents a detailed product with variants and images
type ProductDetailResponse struct {
	ID          uint                    `json:"id"`
	Name        string                  `json:"name"`
	Description string                  `json:"description"`
	SKU         string                  `json:"sku"`
	Price       float64                 `json:"price"`
	CategoryID  uint                    `json:"category_id"`
	Category    *CategoryResponse       `json:"category,omitempty"`
	Variants    []ProductVariantSummary `json:"variants,omitempty"`
	Images      []ProductImageResponse  `json:"images,omitempty"`
	CreatedAt   time.Time               `json:"created_at"`
	UpdatedAt   time.Time               `json:"updated_at"`
}

// ProductListResponse represents a simplified product for list views
type ProductListResponse struct {
	ID          uint      `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	SKU         string    `json:"sku"`
	Price       float64   `json:"price"`
	CategoryID  uint      `json:"category_id"`
	CreatedAt   time.Time `json:"created_at"`
}

// ProductVariantSummary represents a product variant summary
type ProductVariantSummary struct {
	ID    uint    `json:"id"`
	SKU   string  `json:"sku"`
	Price float64 `json:"price"`
	Stock int     `json:"stock"`
}

// ProductImageResponse represents a product image
type ProductImageResponse struct {
	ID      uint   `json:"id"`
	URL     string `json:"url"`
	AltText string `json:"alt_text"`
}

// CategoryResponse represents a category
type CategoryResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

// ProductsListResponse represents a paginated list of products
type ProductsListResponse struct {
	Products   []ProductListResponse `json:"products"`
	TotalCount int                   `json:"total_count"`
	Page       int                   `json:"page"`
	Limit      int                   `json:"limit"`
}
