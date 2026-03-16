package requests

// OrderItemRequest represents a single item in the cart/order
type OrderItemRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,min=1"`
}

// CreateOrderRequest defines the payload for creating a new order
type CreateOrderRequest struct {
	Items []OrderItemRequest `json:"items" binding:"required,min=1,dive"`
	// 'dive' tells Gin to validate each item in the slice against its own tags
	
	AddressLine1 string `json:"address_line_1" binding:"required,max=255"`
	AddressLine2 string `json:"address_line_2"`
	City         string `json:"city" binding:"required,max=100"`
	State        string `json:"state" binding:"required,max=100"`
	ZipCode      string `json:"zip_code" binding:"required,max=20"`
	Country      string `json:"country" binding:"required,max=50"`
	
	PaymentMethod string `json:"payment_method" binding:"required,oneof=credit_card paypal bank_transfer"`
}

// UpdateOrderStatusRequest (Admin only)
type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=pending processing shipped delivered cancelled"`
}