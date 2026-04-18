package dto

import "time"

// AddToCartRequest represents the request to add an item to cart
type AddToCartRequest struct {
	ProductVariantID uint `json:"product_variant_id" binding:"required"`
	Quantity         int  `json:"quantity" binding:"required,min=1"`
}

// UpdateCartItemRequest represents the request to update cart item quantity
type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" binding:"required,min=1"`
}

// CartItemResponse represents a single item in the cart
type CartItemResponse struct {
	ID               uint      `json:"id"`
	ProductVariantID uint      `json:"product_variant_id"`
	ProductName      string    `json:"product_name"`
	ProductSKU       string    `json:"product_sku"`
	VariantSKU       string    `json:"variant_sku"`
	Price            float64   `json:"price"`
	Quantity         int       `json:"quantity"`
	Subtotal         float64   `json:"subtotal"`
	Stock            int       `json:"stock"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// CartResponse represents the full cart with all items
type CartResponse struct {
	ID        uint               `json:"id"`
	UserID    uint               `json:"user_id"`
	Items     []CartItemResponse `json:"items"`
	Total     float64            `json:"total"`
	ItemCount int                `json:"item_count"`
	CreatedAt time.Time          `json:"created_at"`
	UpdatedAt time.Time          `json:"updated_at"`
}
