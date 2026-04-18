package repositories

import (
	"server/internal/models"

	"gorm.io/gorm"
)

type CartRepository struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) *CartRepository {
	return &CartRepository{db: db}
}

// GetOrCreateCart gets the user's cart or creates one if it doesn't exist
func (r *CartRepository) GetOrCreateCart(userID uint) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Where("user_id = ?", userID).
		Preload("Items.ProductVariant.Product").
		First(&cart).Error

	if err == gorm.ErrRecordNotFound {
		// Create new cart
		cart = models.Cart{UserID: userID}
		if err := r.db.Create(&cart).Error; err != nil {
			return nil, err
		}
		return &cart, nil
	}

	if err != nil {
		return nil, err
	}

	return &cart, nil
}

// GetCartByUserID retrieves a user's cart with all items
func (r *CartRepository) GetCartByUserID(userID uint) (*models.Cart, error) {
	var cart models.Cart
	err := r.db.Where("user_id = ?", userID).
		Preload("Items.ProductVariant.Product").
		First(&cart).Error

	if err != nil {
		return nil, err
	}

	return &cart, nil
}

// AddItem adds an item to the cart or updates quantity if it exists
func (r *CartRepository) AddItem(cartID, productVariantID uint, quantity int) (*models.CartItem, error) {
	var cartItem models.CartItem

	// Check if item already exists in cart
	err := r.db.Where("cart_id = ? AND product_variant_id = ?", cartID, productVariantID).
		First(&cartItem).Error

	if err == gorm.ErrRecordNotFound {
		// Create new cart item
		cartItem = models.CartItem{
			CartID:           cartID,
			ProductVariantID: productVariantID,
			Quantity:         quantity,
		}
		if err := r.db.Create(&cartItem).Error; err != nil {
			return nil, err
		}
	} else if err != nil {
		return nil, err
	} else {
		// Update existing item quantity
		cartItem.Quantity += quantity
		if err := r.db.Save(&cartItem).Error; err != nil {
			return nil, err
		}
	}

	// Reload with associations
	if err := r.db.Preload("ProductVariant.Product").First(&cartItem, cartItem.ID).Error; err != nil {
		return nil, err
	}

	return &cartItem, nil
}

// UpdateItemQuantity updates the quantity of a cart item
func (r *CartRepository) UpdateItemQuantity(cartItemID uint, quantity int) (*models.CartItem, error) {
	var cartItem models.CartItem

	if err := r.db.First(&cartItem, cartItemID).Error; err != nil {
		return nil, err
	}

	cartItem.Quantity = quantity
	if err := r.db.Save(&cartItem).Error; err != nil {
		return nil, err
	}

	// Reload with associations
	if err := r.db.Preload("ProductVariant.Product").First(&cartItem, cartItem.ID).Error; err != nil {
		return nil, err
	}

	return &cartItem, nil
}

// RemoveItem removes an item from the cart
func (r *CartRepository) RemoveItem(cartItemID uint) error {
	return r.db.Delete(&models.CartItem{}, cartItemID).Error
}

// ClearCart removes all items from a cart
func (r *CartRepository) ClearCart(cartID uint) error {
	return r.db.Where("cart_id = ?", cartID).Delete(&models.CartItem{}).Error
}

// GetCartItem retrieves a specific cart item
func (r *CartRepository) GetCartItem(cartItemID uint) (*models.CartItem, error) {
	var cartItem models.CartItem
	err := r.db.Preload("ProductVariant.Product").First(&cartItem, cartItemID).Error
	if err != nil {
		return nil, err
	}
	return &cartItem, nil
}

// GetCartItemByUserAndItemID retrieves a cart item ensuring it belongs to the user
func (r *CartRepository) GetCartItemByUserAndItemID(userID, cartItemID uint) (*models.CartItem, error) {
	var cartItem models.CartItem
	err := r.db.Joins("JOIN carts ON cart_items.cart_id = carts.id").
		Where("carts.user_id = ? AND cart_items.id = ?", userID, cartItemID).
		Preload("ProductVariant.Product").
		First(&cartItem).Error

	if err != nil {
		return nil, err
	}

	return &cartItem, nil
}
