package dto

import "time"

// CreateOrderRequest represents the request to create a new order
type CreateOrderRequest struct {
	Items []OrderItemRequest `json:"items" binding:"required,min=1,dive"`
}

// OrderItemRequest represents a single item in the order
type OrderItemRequest struct {
	ProductVariantID uint `json:"product_variant_id" binding:"required"`
	Quantity         int  `json:"quantity" binding:"required,min=1"`
}

// UpdateOrderStatusRequest represents the request to update order status
type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=pending processing shipped delivered cancelled"`
}

// OrderItemDetailResponse represents a detailed order item
type OrderItemDetailResponse struct {
	ID               uint    `json:"id"`
	ProductVariantID uint    `json:"product_variant_id"`
	ProductName      string  `json:"product_name"`
	ProductSKU       string  `json:"product_sku"`
	VariantSKU       string  `json:"variant_sku"`
	Quantity         int     `json:"quantity"`
	Price            float64 `json:"price"`
	Subtotal         float64 `json:"subtotal"`
}

// OrderDetailResponse represents a detailed order with all information
type OrderDetailResponse struct {
	ID         uint                      `json:"id"`
	UserID     uint                      `json:"user_id"`
	TotalPrice float64                   `json:"total_price"`
	Status     string                    `json:"status"`
	Items      []OrderItemDetailResponse `json:"items"`
	CreatedAt  time.Time                 `json:"created_at"`
	UpdatedAt  time.Time                 `json:"updated_at"`
}

// OrderListResponse represents a simplified order for list views
type OrderListResponse struct {
	ID         uint      `json:"id"`
	UserID     uint      `json:"user_id"`
	TotalPrice float64   `json:"total_price"`
	Status     string    `json:"status"`
	ItemCount  int       `json:"item_count"`
	CreatedAt  time.Time `json:"created_at"`
}

// OrdersListResponse represents a paginated list of orders
type OrdersListResponse struct {
	Orders     []OrderListResponse `json:"orders"`
	TotalCount int64               `json:"total_count"`
	Page       int                 `json:"page"`
	Limit      int                 `json:"limit"`
}

// OrderStatusHistoryResponse represents a status change entry
type OrderStatusHistoryResponse struct {
	ID        uint      `json:"id"`
	OrderID   uint      `json:"order_id"`
	Status    string    `json:"status"`
	UpdatedAt time.Time `json:"updated_at"`
}

// OrderWithHistoryResponse represents an order with its status history
type OrderWithHistoryResponse struct {
	Order   OrderDetailResponse          `json:"order"`
	History []OrderStatusHistoryResponse `json:"history"`
}
