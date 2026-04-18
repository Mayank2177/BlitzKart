package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"server/internal/dto"
	"server/internal/services"
	"server/internal/utils"
)

type AddressHandler struct {
	addressService *services.AddressService
}

func NewAddressHandler(addressService *services.AddressService) *AddressHandler {
	return &AddressHandler{
		addressService: addressService,
	}
}

// CreateAddress creates a new address for the authenticated user
func (h *AddressHandler) CreateAddress(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized")
		return
	}

	var req dto.CreateAddressRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	address, err := h.addressService.CreateAddress(userID, &req)
	if err != nil {
		utils.SendInternalError(ctx, "Failed to create address")
		return
	}

	utils.SendCreated(ctx, "Address created successfully", address)
}

// GetAddressByID retrieves a specific address
func (h *AddressHandler) GetAddressByID(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized")
		return
	}

	addressID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid address ID")
		return
	}

	address, err := h.addressService.GetAddressByID(uint(addressID), userID)
	if err != nil {
		if err.Error() == "address not found or access denied" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to get address")
		return
	}

	utils.SendSuccess(ctx, "Address retrieved successfully", address)
}

// UpdateAddress updates an address
func (h *AddressHandler) UpdateAddress(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized")
		return
	}

	addressID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid address ID")
		return
	}

	var req dto.UpdateAddressRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	address, err := h.addressService.UpdateAddress(uint(addressID), userID, &req)
	if err != nil {
		if err.Error() == "address not found or access denied" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to update address")
		return
	}

	utils.SendSuccess(ctx, "Address updated successfully", address)
}

// DeleteAddress deletes an address
func (h *AddressHandler) DeleteAddress(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized")
		return
	}

	addressID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid address ID")
		return
	}

	err = h.addressService.DeleteAddress(uint(addressID), userID)
	if err != nil {
		if err.Error() == "address not found or access denied" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to delete address")
		return
	}

	utils.SendSuccess(ctx, "Address deleted successfully", nil)
}

// GetUserAddresses retrieves all addresses for the authenticated user
func (h *AddressHandler) GetUserAddresses(ctx *gin.Context) {
	userID, err := utils.GetUserIDFromContext(ctx)
	if err != nil {
		utils.SendUnauthorized(ctx, "Unauthorized")
		return
	}

	addresses, err := h.addressService.GetUserAddresses(userID)
	if err != nil {
		utils.SendInternalError(ctx, "Failed to get addresses")
		return
	}

	utils.SendSuccess(ctx, "Addresses retrieved successfully", addresses)
}
