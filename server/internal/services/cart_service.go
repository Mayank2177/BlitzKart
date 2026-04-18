package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"

	"gorm.io/gorm"
)

type CartService struct {
	cartRepo           *repositories.CartRepository
	productVariantRepo *repositories.ProductVariantRepository
}

func NewCartService(cartRepo *repositories.CartRepository, productVariantRepo *repositories.ProductVariantRepository) *CartService {
	return &CartService{
		cartRepo:           cartRepo,
		productVariantRepo: productVariantRepo,
	}
}

// GetCart retrieves the user's cart
func (s *CartService) GetCart(userID uint) (*dto.CartResponse, *models.ErrorResponse) {
	cart, err := s.cartRepo.GetOrCreateCart(userID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve cart: " + err.Error(),
		}
	}

	return s.mapCartToResponse(cart), nil
}

// AddToCart adds an item to the user's cart
func (s *CartService) AddToCart(userID uint, req *dto.AddToCartRequest) (*dto.CartResponse, *models.ErrorResponse) {
	// Validate product variant exists
	variant, err := s.productVariantRepo.FindByID(req.ProductVariantID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Product variant not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to validate product variant: " + err.Error(),
		}
	}

	// Check stock availability
	if variant.Stock < req.Quantity {
		return nil, &models.ErrorResponse{
			Code:    400,
			Message: "Insufficient stock: requested quantity exceeds available stock",
		}
	}

	// Get or create cart
	cart, err := s.cartRepo.GetOrCreateCart(userID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve cart: " + err.Error(),
		}
	}

	// Add item to cart
	_, err = s.cartRepo.AddItem(cart.ID, req.ProductVariantID, req.Quantity)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to add item to cart: " + err.Error(),
		}
	}

	// Reload cart with updated items
	cart, err = s.cartRepo.GetCartByUserID(userID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve updated cart: " + err.Error(),
		}
	}

	return s.mapCartToResponse(cart), nil
}

// UpdateCartItem updates the quantity of a cart item
func (s *CartService) UpdateCartItem(userID, cartItemID uint, req *dto.UpdateCartItemRequest) (*dto.CartResponse, *models.ErrorResponse) {
	// Verify cart item belongs to user
	cartItem, err := s.cartRepo.GetCartItemByUserAndItemID(userID, cartItemID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Cart item not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve cart item: " + err.Error(),
		}
	}

	// Check stock availability
	hasStock, err := s.productVariantRepo.CheckStock(cartItem.ProductVariantID, req.Quantity)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to check stock: " + err.Error(),
		}
	}

	if !hasStock {
		return nil, &models.ErrorResponse{
			Code:    400,
			Message: "Insufficient stock: requested quantity exceeds available stock",
		}
	}

	// Update quantity
	_, err = s.cartRepo.UpdateItemQuantity(cartItemID, req.Quantity)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to update cart item: " + err.Error(),
		}
	}

	// Reload cart
	cart, err := s.cartRepo.GetCartByUserID(userID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve updated cart: " + err.Error(),
		}
	}

	return s.mapCartToResponse(cart), nil
}

// RemoveCartItem removes an item from the cart
func (s *CartService) RemoveCartItem(userID, cartItemID uint) (*dto.CartResponse, *models.ErrorResponse) {
	// Verify cart item belongs to user
	_, err := s.cartRepo.GetCartItemByUserAndItemID(userID, cartItemID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Cart item not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve cart item: " + err.Error(),
		}
	}

	// Remove item
	err = s.cartRepo.RemoveItem(cartItemID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to remove cart item: " + err.Error(),
		}
	}

	// Reload cart
	cart, err := s.cartRepo.GetCartByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Cart might be empty now, return empty cart
			return &dto.CartResponse{
				UserID:    userID,
				Items:     []dto.CartItemResponse{},
				Total:     0,
				ItemCount: 0,
			}, nil
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve updated cart: " + err.Error(),
		}
	}

	return s.mapCartToResponse(cart), nil
}

// ClearCart removes all items from the cart
func (s *CartService) ClearCart(userID uint) *models.ErrorResponse {
	cart, err := s.cartRepo.GetCartByUserID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Cart doesn't exist, nothing to clear
			return nil
		}
		return &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve cart: " + err.Error(),
		}
	}

	err = s.cartRepo.ClearCart(cart.ID)
	if err != nil {
		return &models.ErrorResponse{
			Code:    500,
			Message: "Failed to clear cart: " + err.Error(),
		}
	}

	return nil
}

// mapCartToResponse converts a cart model to response DTO
func (s *CartService) mapCartToResponse(cart *models.Cart) *dto.CartResponse {
	response := &dto.CartResponse{
		ID:        cart.ID,
		UserID:    cart.UserID,
		Items:     []dto.CartItemResponse{},
		Total:     0,
		ItemCount: 0,
		CreatedAt: cart.CreatedAt,
		UpdatedAt: cart.UpdatedAt,
	}

	for _, item := range cart.Items {
		subtotal := item.ProductVariant.Price * float64(item.Quantity)
		response.Items = append(response.Items, dto.CartItemResponse{
			ID:               item.ID,
			ProductVariantID: item.ProductVariantID,
			ProductName:      item.ProductVariant.Product.Name,
			ProductSKU:       item.ProductVariant.Product.SKU,
			VariantSKU:       item.ProductVariant.SKU,
			Price:            item.ProductVariant.Price,
			Quantity:         item.Quantity,
			Subtotal:         subtotal,
			Stock:            item.ProductVariant.Stock,
			CreatedAt:        item.CreatedAt,
			UpdatedAt:        item.UpdatedAt,
		})
		response.Total += subtotal
		response.ItemCount += item.Quantity
	}

	return response
}
