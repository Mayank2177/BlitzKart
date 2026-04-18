package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"server/internal/dto"
	"server/internal/services"
	"server/internal/utils"
)

type CouponHandler struct {
	couponService *services.CouponService
}

func NewCouponHandler(couponService *services.CouponService) *CouponHandler {
	return &CouponHandler{
		couponService: couponService,
	}
}

// CreateCoupon creates a new coupon (Admin only)
func (h *CouponHandler) CreateCoupon(ctx *gin.Context) {
	var req dto.CreateCouponRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	coupon, err := h.couponService.CreateCoupon(&req)
	if err != nil {
		if err.Error() == "coupon code already exists" {
			utils.SendError(ctx, 409, err.Error())
			return
		}
		if err.Error() == "percentage discount cannot exceed 100%" || 
		   err.Error() == "expiry date must be in the future" {
			utils.SendBadRequest(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to create coupon")
		return
	}

	utils.SendCreated(ctx, "Coupon created successfully", coupon)
}

// GetCouponByID retrieves a coupon by ID (Admin only)
func (h *CouponHandler) GetCouponByID(ctx *gin.Context) {
	couponID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid coupon ID")
		return
	}

	coupon, err := h.couponService.GetCouponByID(uint(couponID))
	if err != nil {
		utils.SendNotFound(ctx, "Coupon not found")
		return
	}

	utils.SendSuccess(ctx, "Coupon retrieved successfully", coupon)
}

// UpdateCoupon updates a coupon (Admin only)
func (h *CouponHandler) UpdateCoupon(ctx *gin.Context) {
	couponID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid coupon ID")
		return
	}

	var req dto.UpdateCouponRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	coupon, err := h.couponService.UpdateCoupon(uint(couponID), &req)
	if err != nil {
		if err.Error() == "coupon not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		if err.Error() == "coupon code already exists" {
			utils.SendError(ctx, 409, err.Error())
			return
		}
		if err.Error() == "percentage discount cannot exceed 100%" || 
		   err.Error() == "expiry date must be in the future" {
			utils.SendBadRequest(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to update coupon")
		return
	}

	utils.SendSuccess(ctx, "Coupon updated successfully", coupon)
}

// DeleteCoupon deletes a coupon (Admin only)
func (h *CouponHandler) DeleteCoupon(ctx *gin.Context) {
	couponID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid coupon ID")
		return
	}

	err = h.couponService.DeleteCoupon(uint(couponID))
	if err != nil {
		if err.Error() == "coupon not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to delete coupon")
		return
	}

	utils.SendSuccess(ctx, "Coupon deleted successfully", nil)
}

// GetAllCoupons retrieves all coupons (Admin only)
func (h *CouponHandler) GetAllCoupons(ctx *gin.Context) {
	coupons, err := h.couponService.GetAllCoupons()
	if err != nil {
		utils.SendInternalError(ctx, "Failed to get coupons")
		return
	}

	utils.SendSuccess(ctx, "Coupons retrieved successfully", coupons)
}

// GetActiveCoupons retrieves all active coupons (Public)
func (h *CouponHandler) GetActiveCoupons(ctx *gin.Context) {
	coupons, err := h.couponService.GetActiveCoupons()
	if err != nil {
		utils.SendInternalError(ctx, "Failed to get active coupons")
		return
	}

	utils.SendSuccess(ctx, "Active coupons retrieved successfully", coupons)
}

// ValidateCoupon validates a coupon code (Public)
func (h *CouponHandler) ValidateCoupon(ctx *gin.Context) {
	var req dto.ValidateCouponRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	validation, err := h.couponService.ValidateCoupon(&req)
	if err != nil {
		utils.SendInternalError(ctx, "Failed to validate coupon")
		return
	}

	if validation.Valid {
		utils.SendSuccess(ctx, "Coupon validation successful", validation)
	} else {
		utils.SendError(ctx, 400, validation.Message)
	}
}