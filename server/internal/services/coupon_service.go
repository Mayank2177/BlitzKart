package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"
	"strings"
	"time"
)

type CouponService struct {
	couponRepo *repositories.CouponRepository
}

func NewCouponService(couponRepo *repositories.CouponRepository) *CouponService {
	return &CouponService{
		couponRepo: couponRepo,
	}
}

// CreateCoupon creates a new coupon
func (s *CouponService) CreateCoupon(req *dto.CreateCouponRequest) (*dto.CouponResponse, error) {
	// Validate discount value based on type
	if req.DiscountType == "percentage" && req.DiscountValue > 100 {
		return nil, errors.New("percentage discount cannot exceed 100%")
	}

	// Check if coupon code already exists
	exists, err := s.couponRepo.CheckCodeExists(strings.ToUpper(req.Code), 0)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("coupon code already exists")
	}

	// Check if expiry date is in the future
	if req.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("expiry date must be in the future")
	}

	coupon := &models.Coupon{
		Code:          strings.ToUpper(req.Code),
		DiscountType:  req.DiscountType,
		DiscountValue: req.DiscountValue,
		ExpiresAt:     req.ExpiresAt,
	}

	if err := s.couponRepo.Create(coupon); err != nil {
		return nil, err
	}

	return s.toCouponResponse(coupon), nil
}

// GetCouponByID retrieves a coupon by ID
func (s *CouponService) GetCouponByID(id uint) (*dto.CouponResponse, error) {
	coupon, err := s.couponRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("coupon not found")
	}

	return s.toCouponResponse(coupon), nil
}

// UpdateCoupon updates a coupon
func (s *CouponService) UpdateCoupon(id uint, req *dto.UpdateCouponRequest) (*dto.CouponResponse, error) {
	// Validate discount value based on type
	if req.DiscountType == "percentage" && req.DiscountValue > 100 {
		return nil, errors.New("percentage discount cannot exceed 100%")
	}

	// Check if coupon exists
	coupon, err := s.couponRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("coupon not found")
	}

	// Check if coupon code already exists (excluding current coupon)
	exists, err := s.couponRepo.CheckCodeExists(strings.ToUpper(req.Code), id)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("coupon code already exists")
	}

	// Check if expiry date is in the future
	if req.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("expiry date must be in the future")
	}

	// Update fields
	coupon.Code = strings.ToUpper(req.Code)
	coupon.DiscountType = req.DiscountType
	coupon.DiscountValue = req.DiscountValue
	coupon.ExpiresAt = req.ExpiresAt

	if err := s.couponRepo.Update(coupon); err != nil {
		return nil, err
	}

	return s.toCouponResponse(coupon), nil
}

// DeleteCoupon deletes a coupon
func (s *CouponService) DeleteCoupon(id uint) error {
	// Check if coupon exists
	_, err := s.couponRepo.GetByID(id)
	if err != nil {
		return errors.New("coupon not found")
	}

	return s.couponRepo.Delete(id)
}

// GetAllCoupons retrieves all coupons
func (s *CouponService) GetAllCoupons() (*dto.CouponsListResponse, error) {
	coupons, err := s.couponRepo.GetAll()
	if err != nil {
		return nil, err
	}

	count, err := s.couponRepo.Count()
	if err != nil {
		return nil, err
	}

	couponResponses := make([]dto.CouponResponse, 0, len(coupons))
	for _, coupon := range coupons {
		couponResponses = append(couponResponses, *s.toCouponResponse(&coupon))
	}

	return &dto.CouponsListResponse{
		TotalCoupons: count,
		Coupons:      couponResponses,
	}, nil
}

// GetActiveCoupons retrieves all active (non-expired) coupons
func (s *CouponService) GetActiveCoupons() (*dto.CouponsListResponse, error) {
	coupons, err := s.couponRepo.GetActive()
	if err != nil {
		return nil, err
	}

	couponResponses := make([]dto.CouponResponse, 0, len(coupons))
	for _, coupon := range coupons {
		couponResponses = append(couponResponses, *s.toCouponResponse(&coupon))
	}

	return &dto.CouponsListResponse{
		TotalCoupons: len(couponResponses),
		Coupons:      couponResponses,
	}, nil
}

// ValidateCoupon validates a coupon and calculates discount
func (s *CouponService) ValidateCoupon(req *dto.ValidateCouponRequest) (*dto.CouponValidationResponse, error) {
	// Get coupon by code
	coupon, err := s.couponRepo.GetByCode(strings.ToUpper(req.Code))
	if err != nil {
		return &dto.CouponValidationResponse{
			Valid:   false,
			Message: "Coupon not found",
		}, nil
	}

	// Check if coupon is expired
	if s.couponRepo.IsExpired(coupon) {
		return &dto.CouponValidationResponse{
			Valid:   false,
			Message: "Coupon has expired",
			Coupon:  s.toCouponResponse(coupon),
		}, nil
	}

	// Calculate discount
	discountAmount := s.calculateDiscount(coupon, req.OrderTotal)
	finalTotal := req.OrderTotal - discountAmount

	// Ensure final total is not negative
	if finalTotal < 0 {
		finalTotal = 0
	}

	return &dto.CouponValidationResponse{
		Valid:          true,
		Message:        "Coupon is valid",
		DiscountAmount: discountAmount,
		FinalTotal:     finalTotal,
		Coupon:         s.toCouponResponse(coupon),
	}, nil
}

// ApplyCoupon applies a coupon to calculate final price
func (s *CouponService) ApplyCoupon(code string, orderTotal float64) (float64, float64, error) {
	// Validate coupon
	validation, err := s.ValidateCoupon(&dto.ValidateCouponRequest{
		Code:       code,
		OrderTotal: orderTotal,
	})
	if err != nil {
		return 0, orderTotal, err
	}

	if !validation.Valid {
		return 0, orderTotal, errors.New(validation.Message)
	}

	return validation.DiscountAmount, validation.FinalTotal, nil
}

// calculateDiscount calculates the discount amount based on coupon type
func (s *CouponService) calculateDiscount(coupon *models.Coupon, orderTotal float64) float64 {
	switch coupon.DiscountType {
	case "percentage":
		return (orderTotal * coupon.DiscountValue) / 100
	case "fixed":
		if coupon.DiscountValue > orderTotal {
			return orderTotal // Don't exceed order total
		}
		return coupon.DiscountValue
	default:
		return 0
	}
}

// Helper function to convert model to response
func (s *CouponService) toCouponResponse(coupon *models.Coupon) *dto.CouponResponse {
	return &dto.CouponResponse{
		ID:            coupon.ID,
		Code:          coupon.Code,
		DiscountType:  coupon.DiscountType,
		DiscountValue: coupon.DiscountValue,
		ExpiresAt:     coupon.ExpiresAt,
		IsExpired:     s.couponRepo.IsExpired(coupon),
		CreatedAt:     coupon.CreatedAt,
		UpdatedAt:     coupon.UpdatedAt,
	}
}