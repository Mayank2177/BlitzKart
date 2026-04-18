package dto

import "time"

// CreateCouponRequest represents the request to create a coupon
type CreateCouponRequest struct {
	Code          string    `json:"code" binding:"required,min=3,max=50"`
	DiscountType  string    `json:"discount_type" binding:"required,oneof=percentage fixed"`
	DiscountValue float64   `json:"discount_value" binding:"required,min=0"`
	ExpiresAt     time.Time `json:"expires_at" binding:"required"`
}

// UpdateCouponRequest represents the request to update a coupon
type UpdateCouponRequest struct {
	Code          string    `json:"code" binding:"required,min=3,max=50"`
	DiscountType  string    `json:"discount_type" binding:"required,oneof=percentage fixed"`
	DiscountValue float64   `json:"discount_value" binding:"required,min=0"`
	ExpiresAt     time.Time `json:"expires_at" binding:"required"`
}

// ValidateCouponRequest represents the request to validate a coupon
type ValidateCouponRequest struct {
	Code      string  `json:"code" binding:"required"`
	OrderTotal float64 `json:"order_total" binding:"required,min=0"`
}

// CouponResponse represents a coupon in API responses
type CouponResponse struct {
	ID            uint      `json:"id"`
	Code          string    `json:"code"`
	DiscountType  string    `json:"discount_type"`
	DiscountValue float64   `json:"discount_value"`
	ExpiresAt     time.Time `json:"expires_at"`
	IsExpired     bool      `json:"is_expired"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// CouponValidationResponse represents coupon validation result
type CouponValidationResponse struct {
	Valid          bool    `json:"valid"`
	Message        string  `json:"message"`
	DiscountAmount float64 `json:"discount_amount,omitempty"`
	FinalTotal     float64 `json:"final_total,omitempty"`
	Coupon         *CouponResponse `json:"coupon,omitempty"`
}

// CouponsListResponse represents all coupons
type CouponsListResponse struct {
	TotalCoupons int              `json:"total_coupons"`
	Coupons      []CouponResponse `json:"coupons"`
}

// ApplyCouponRequest represents applying coupon to order
type ApplyCouponRequest struct {
	CouponCode string `json:"coupon_code" binding:"required"`
}