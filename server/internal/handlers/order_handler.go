package handlers

import (
	"server/internal/dto"
	"server/internal/services"
	"server/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	orderService *services.OrderService
}

func NewOrderHandler(orderService *services.OrderService) *OrderHandler {
	return &OrderHandler{
		orderService: orderService,
	}
}

// CreateOrder creates a new order
// @Summary Create order
// @Description Create a new order from items
// @Tags orders
// @Accept json
// @Produce json
// @Param request body dto.CreateOrderRequest true "Create order request"
// @Success 201 {object} dto.OrderDetailResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/orders [post]
func (h *OrderHandler) CreateOrder(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	var req dto.CreateOrderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, "Invalid request: "+err.Error())
		return
	}

	order, errResp := h.orderService.CreateOrder(userID, &req)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendCreated(ctx, "Order created successfully", order)
}

// GetOrderByID retrieves an order by ID
// @Summary Get order by ID
// @Description Get detailed information about a specific order
// @Tags orders
// @Produce json
// @Param id path int true "Order ID"
// @Success 200 {object} dto.OrderDetailResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/orders/{id} [get]
func (h *OrderHandler) GetOrderByID(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	orderID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid order ID: "+err.Error())
		return
	}

	order, errResp := h.orderService.GetOrderByID(uint(orderID), userID)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Order retrieved successfully", order)
}

// GetUserOrders retrieves all orders for the authenticated user
// @Summary Get user orders
// @Description Get all orders for the authenticated user with pagination
// @Tags orders
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(20)
// @Success 200 {object} dto.OrdersListResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/orders [get]
func (h *OrderHandler) GetUserOrders(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))

	orders, errResp := h.orderService.GetUserOrders(userID, page, limit)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Orders retrieved successfully", orders)
}

// UpdateOrderStatus updates the status of an order (Admin only)
// @Summary Update order status
// @Description Update the status of an order (Admin only)
// @Tags orders
// @Accept json
// @Produce json
// @Param id path int true "Order ID"
// @Param request body dto.UpdateOrderStatusRequest true "Update status request"
// @Success 200 {object} dto.OrderDetailResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/orders/{id}/status [put]
func (h *OrderHandler) UpdateOrderStatus(ctx *gin.Context) {
	orderID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid order ID: "+err.Error())
		return
	}

	var req dto.UpdateOrderStatusRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, "Invalid request: "+err.Error())
		return
	}

	order, errResp := h.orderService.UpdateOrderStatus(uint(orderID), &req)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Order status updated successfully", order)
}

// CancelOrder cancels an order
// @Summary Cancel order
// @Description Cancel an order (only if pending or processing)
// @Tags orders
// @Produce json
// @Param id path int true "Order ID"
// @Success 200 {object} dto.OrderDetailResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/orders/{id}/cancel [post]
func (h *OrderHandler) CancelOrder(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	orderID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid order ID: "+err.Error())
		return
	}

	order, errResp := h.orderService.CancelOrder(uint(orderID), userID)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Order cancelled successfully", order)
}

// GetOrderWithHistory retrieves an order with its status history
// @Summary Get order with history
// @Description Get order details along with status change history
// @Tags orders
// @Produce json
// @Param id path int true "Order ID"
// @Success 200 {object} dto.OrderWithHistoryResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/orders/{id}/history [get]
func (h *OrderHandler) GetOrderWithHistory(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	orderID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid order ID: "+err.Error())
		return
	}

	orderWithHistory, errResp := h.orderService.GetOrderWithHistory(uint(orderID), userID)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Order with history retrieved successfully", orderWithHistory)
}
