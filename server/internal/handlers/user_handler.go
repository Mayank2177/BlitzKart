package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"server/internal/dto"
	"server/internal/services"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) GetAllUsers(ctx *gin.Context) {
	allUsers, err := h.userService.GetAllUsers()
	if err != nil {
		ctx.AbortWithStatusJSON(err.Code, err)
		return
	}

	ctx.JSON(http.StatusOK, allUsers)
}

func (h *UserHandler) GetUser(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User ID not valid"})
		return
	}

	user, userErr := h.userService.GetUser(uint(userID))
	if userErr != nil {
		ctx.AbortWithStatusJSON(userErr.Code, userErr)
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (h *UserHandler) DeleteUser(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User ID not valid"})
		return
	}

	deleteError := h.userService.DeleteUser(uint(userID))
	if deleteError != nil {
		ctx.AbortWithStatusJSON(deleteError.Code, deleteError)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}

func (h *UserHandler) CreateUser(ctx *gin.Context) {
	var createUserRequest dto.CreateUserRequest

	if err := ctx.ShouldBindJSON(&createUserRequest); err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			out := make(map[string]string)
			for _, fe := range ve {
				out[fe.Field()] = msgForTag(fe)
			}
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errors": out})
			return
		}
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createUserResponse, signupError := h.userService.CreateUser(&createUserRequest)
	if signupError != nil {
		ctx.AbortWithStatusJSON(signupError.Code, signupError)
		return
	}

	ctx.JSON(http.StatusCreated, createUserResponse)
}

func (h *UserHandler) UpdateUser(ctx *gin.Context) {
	userID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "User ID not valid"})
		return
	}

	var updateUserRequest dto.UpdateUserRequest

	if err := ctx.ShouldBindJSON(&updateUserRequest); err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			out := make(map[string]string)
			for _, fe := range ve {
				out[fe.Field()] = msgForTag(fe)
			}
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errors": out})
			return
		}
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updateError := h.userService.UpdateUser(uint(userID), &updateUserRequest)
	if updateError != nil {
		ctx.AbortWithStatusJSON(updateError.Code, updateError)
		return
	}

	ctx.JSON(http.StatusNoContent, gin.H{"message": "User updated"})
}

func msgForTag(fe validator.FieldError) string {
 switch fe.Tag() {
 case "required":
  return "This field is required"
 case "min":
  return fmt.Sprintf("Minimum length is %s", fe.Param())
 case "custom_password":
  return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
 default:
  return "Invalid value"
 }
}