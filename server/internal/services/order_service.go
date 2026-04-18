package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"
	"time"

	"gorm.io/gorm"
)

type OrderService struct {
	orderRepo          *repositories.OrderRepository
	productVariantRepo *repositories.ProductVariantRepository
	cartRepo           *repositories.CartRepository
}

func NewOrderService(orderRepo *repositories.OrderRepository, productVariantRepo *repositories.ProductVariantRepository, cartRepo *repositories.CartRepository) *OrderService {
	return &OrderService{
		orderRepo:          orderRepo,
		productVariantRepo: productVariantRepo,
		cartRepo:           cartRepo,
	}
}

// CreateOrder creates a new order from cart or direct items
func (s *OrderService) CreateOrder(userID uint, req *dto.CreateOrderRequest) (*dto.OrderDetailResponse, *models.ErrorResponse) {
	// Validate items and calculate total
	var totalPrice float64
	var orderItems []models.OrderItem

	for _, item := range req.Items {
		// Get product variant
		variant, err := s.productVariantRepo.FindByID(item.ProductVariantID)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, &models.ErrorResponse{
					Code:    404,
					Message: "Product variant not found: ID " + string(rune(item.ProductVariantID)),
				}
			}
			return nil, &models.ErrorResponse{
				Code:    500,
				Message: "Failed to validate product variant: " + err.Error(),
			}
		}

		// Check stock availability
		if variant.Stock < item.Quantity {
			return nil, &models.ErrorResponse{
				Code:    400,
				Message: "Insufficient stock for product: " + variant.Product.Name,
			}
		}

		// Calculate item price
		itemPrice := variant.Price * float64(item.Quantity)
		totalPrice += itemPrice

		// Create order item
		orderItems = append(orderItems, models.OrderItem{
			ProductVariantID: item.ProductVariantID,
			Quantity:         item.Quantity,
			Price:            variant.Price,
		})
	}

	// Create order
	order := &models.Order{
		UserID:     userID,
		TotalPrice: totalPrice,
		Status:     "pending",
		Items:      orderItems,
	}

	// Save order
	err := s.orderRepo.Create(order)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to create order: " + err.Error(),
		}
	}

	// Deduct stock for each item
	for _, item := range orderItems {
		err := s.productVariantRepo.UpdateStock(item.ProductVariantID, -item.Quantity)
		if err != nil {
			// Log error but don't fail the order
			// In production, you might want to implement a rollback mechanism
		}
	}

	// Create initial status history
	statusHistory := &models.OrderStatusHistory{
		OrderID:   order.ID,
		Status:    "pending",
		UpdatedAt: time.Now(),
	}
	s.orderRepo.CreateStatusHistory(statusHistory)

	// Clear user's cart after successful order
	cart, err := s.cartRepo.GetCartByUserID(userID)
	if err == nil && cart != nil {
		s.cartRepo.ClearCart(cart.ID)
	}

	// Reload order with associations
	order, err = s.orderRepo.FindByID(order.ID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve created order: " + err.Error(),
		}
	}

	return s.mapOrderToDetailResponse(order), nil
}

// GetOrderByID retrieves an order by ID
func (s *OrderService) GetOrderByID(orderID, userID uint) (*dto.OrderDetailResponse, *models.ErrorResponse) {
	order, err := s.orderRepo.FindByIDAndUserID(orderID, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Order not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve order: " + err.Error(),
		}
	}

	return s.mapOrderToDetailResponse(order), nil
}

// GetUserOrders retrieves all orders for a user
func (s *OrderService) GetUserOrders(userID uint, page, limit int) (*dto.OrdersListResponse, *models.ErrorResponse) {
	if page < 1 {
		page = 1
	}
	if limit <= 0 {
		limit = 20
	}

	// Get orders
	orders, err := s.orderRepo.GetUserOrders(userID, limit)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve orders: " + err.Error(),
		}
	}

	// Count total orders
	totalCount, err := s.orderRepo.CountUserOrders(userID)
	if err != nil {
		totalCount = int64(len(orders))
	}

	// Map to response
	orderList := make([]dto.OrderListResponse, len(orders))
	for i, order := range orders {
		orderList[i] = dto.OrderListResponse{
			ID:         order.ID,
			UserID:     order.UserID,
			TotalPrice: order.TotalPrice,
			Status:     order.Status,
			ItemCount:  len(order.Items),
			CreatedAt:  order.CreatedAt,
		}
	}

	return &dto.OrdersListResponse{
		Orders:     orderList,
		TotalCount: totalCount,
		Page:       page,
		Limit:      limit,
	}, nil
}

// UpdateOrderStatus updates the status of an order
func (s *OrderService) UpdateOrderStatus(orderID uint, req *dto.UpdateOrderStatusRequest) (*dto.OrderDetailResponse, *models.ErrorResponse) {
	// Check if order exists
	order, err := s.orderRepo.FindByID(orderID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Order not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve order: " + err.Error(),
		}
	}

	// Validate status transition
	if !s.isValidStatusTransition(order.Status, req.Status) {
		return nil, &models.ErrorResponse{
			Code:    400,
			Message: "Invalid status transition from " + order.Status + " to " + req.Status,
		}
	}

	// Update status
	err = s.orderRepo.UpdateStatus(orderID, req.Status)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to update order status: " + err.Error(),
		}
	}

	// Create status history entry
	statusHistory := &models.OrderStatusHistory{
		OrderID:   orderID,
		Status:    req.Status,
		UpdatedAt: time.Now(),
	}
	s.orderRepo.CreateStatusHistory(statusHistory)

	// Reload order
	order, err = s.orderRepo.FindByID(orderID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve updated order: " + err.Error(),
		}
	}

	return s.mapOrderToDetailResponse(order), nil
}

// CancelOrder cancels an order
func (s *OrderService) CancelOrder(orderID, userID uint) (*dto.OrderDetailResponse, *models.ErrorResponse) {
	// Check if order exists and belongs to user
	order, err := s.orderRepo.FindByIDAndUserID(orderID, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Order not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve order: " + err.Error(),
		}
	}

	// Check if order can be cancelled
	if !s.canCancelOrder(order.Status) {
		return nil, &models.ErrorResponse{
			Code:    400,
			Message: "Order cannot be cancelled in current status: " + order.Status,
		}
	}

	// Cancel order
	err = s.orderRepo.Cancel(orderID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to cancel order: " + err.Error(),
		}
	}

	// Restore stock for cancelled items
	for _, item := range order.Items {
		err := s.productVariantRepo.UpdateStock(item.ProductVariantID, item.Quantity)
		if err != nil {
			// Log error but don't fail the cancellation
		}
	}

	// Create status history entry
	statusHistory := &models.OrderStatusHistory{
		OrderID:   orderID,
		Status:    "cancelled",
		UpdatedAt: time.Now(),
	}
	s.orderRepo.CreateStatusHistory(statusHistory)

	// Reload order
	order, err = s.orderRepo.FindByID(orderID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve cancelled order: " + err.Error(),
		}
	}

	return s.mapOrderToDetailResponse(order), nil
}

// GetOrderWithHistory retrieves an order with its status history
func (s *OrderService) GetOrderWithHistory(orderID, userID uint) (*dto.OrderWithHistoryResponse, *models.ErrorResponse) {
	// Get order
	order, err := s.orderRepo.FindByIDAndUserID(orderID, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Order not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve order: " + err.Error(),
		}
	}

	// Get status history
	history, err := s.orderRepo.GetOrderStatusHistory(orderID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve order history: " + err.Error(),
		}
	}

	// Map to response
	historyResponse := make([]dto.OrderStatusHistoryResponse, len(history))
	for i, h := range history {
		historyResponse[i] = dto.OrderStatusHistoryResponse{
			ID:        h.ID,
			OrderID:   h.OrderID,
			Status:    h.Status,
			UpdatedAt: h.UpdatedAt,
		}
	}

	return &dto.OrderWithHistoryResponse{
		Order:   *s.mapOrderToDetailResponse(order),
		History: historyResponse,
	}, nil
}

// Helper methods

func (s *OrderService) mapOrderToDetailResponse(order *models.Order) *dto.OrderDetailResponse {
	response := &dto.OrderDetailResponse{
		ID:         order.ID,
		UserID:     order.UserID,
		TotalPrice: order.TotalPrice,
		Status:     order.Status,
		CreatedAt:  order.CreatedAt,
		UpdatedAt:  order.UpdatedAt,
	}

	// Map items
	if len(order.Items) > 0 {
		response.Items = make([]dto.OrderItemDetailResponse, len(order.Items))
		for i, item := range order.Items {
			subtotal := item.Price * float64(item.Quantity)
			response.Items[i] = dto.OrderItemDetailResponse{
				ID:               item.ID,
				ProductVariantID: item.ProductVariantID,
				ProductName:      item.ProductVariant.Product.Name,
				ProductSKU:       item.ProductVariant.Product.SKU,
				VariantSKU:       item.ProductVariant.SKU,
				Quantity:         item.Quantity,
				Price:            item.Price,
				Subtotal:         subtotal,
			}
		}
	}

	return response
}

func (s *OrderService) isValidStatusTransition(currentStatus, newStatus string) bool {
	validTransitions := map[string][]string{
		"pending":    {"processing", "cancelled"},
		"processing": {"shipped", "cancelled"},
		"shipped":    {"delivered"},
		"delivered":  {},
		"cancelled":  {},
	}

	allowedStatuses, exists := validTransitions[currentStatus]
	if !exists {
		return false
	}

	for _, status := range allowedStatuses {
		if status == newStatus {
			return true
		}
	}

	return false
}

func (s *OrderService) canCancelOrder(status string) bool {
	cancellableStatuses := []string{"pending", "processing"}
	for _, s := range cancellableStatuses {
		if s == status {
			return true
		}
	}
	return false
}
