package handlers

import (
	"server/internal/dto"
	"server/internal/services"
	"server/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CartHandler struct {
	cartService *services.CartService
}

func NewCartHandler(cartService *services.CartService) *CartHandler {
	return &CartHandler{
		cartService: cartService,
	}
}

// GetCart retrieves the user's cart
// @Summary Get user's cart
// @Description Get the current user's shopping cart with all items
// @Tags cart
// @Produce json
// @Success 200 {object} dto.CartResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/cart [get]
func (h *CartHandler) GetCart(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	cart, errResp := h.cartService.GetCart(userID)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Cart retrieved successfully", cart)
}

// AddToCart adds an item to the cart
// @Summary Add item to cart
// @Description Add a product variant to the user's cart
// @Tags cart
// @Accept json
// @Produce json
// @Param request body dto.AddToCartRequest true "Add to cart request"
// @Success 200 {object} dto.CartResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/cart [post]
func (h *CartHandler) AddToCart(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	var req dto.AddToCartRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, "Invalid request: "+err.Error())
		return
	}

	cart, errResp := h.cartService.AddToCart(userID, &req)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Item added to cart successfully", cart)
}

// UpdateCartItem updates the quantity of a cart item
// @Summary Update cart item
// @Description Update the quantity of an item in the cart
// @Tags cart
// @Accept json
// @Produce json
// @Param id path int true "Cart Item ID"
// @Param request body dto.UpdateCartItemRequest true "Update cart item request"
// @Success 200 {object} dto.CartResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/cart/items/{id} [put]
func (h *CartHandler) UpdateCartItem(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	cartItemID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid cart item ID: "+err.Error())
		return
	}

	var req dto.UpdateCartItemRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, "Invalid request: "+err.Error())
		return
	}

	cart, errResp := h.cartService.UpdateCartItem(userID, uint(cartItemID), &req)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Cart item updated successfully", cart)
}

// RemoveCartItem removes an item from the cart
// @Summary Remove cart item
// @Description Remove an item from the user's cart
// @Tags cart
// @Produce json
// @Param id path int true "Cart Item ID"
// @Success 200 {object} dto.CartResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/cart/items/{id} [delete]
func (h *CartHandler) RemoveCartItem(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	cartItemID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid cart item ID: "+err.Error())
		return
	}

	cart, errResp := h.cartService.RemoveCartItem(userID, uint(cartItemID))
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Item removed from cart successfully", cart)
}

// ClearCart removes all items from the cart
// @Summary Clear cart
// @Description Remove all items from the user's cart
// @Tags cart
// @Produce json
// @Success 200 {object} map[string]string
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/cart [delete]
func (h *CartHandler) ClearCart(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized: "+err.Error())
		return
	}

	errResp := h.cartService.ClearCart(userID)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Cart cleared successfully", nil)
}
