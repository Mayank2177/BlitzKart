package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"server/internal/dto/requests"
	"server/internal/dto/responses"
	"server/internal/services"
)

type AuthHandler struct {
	AuthService services.AuthService
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req requests.LoginRequest

	// 1. Bind and Validate JSON automatically
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, responses.FailResponse(err.Error()))
		return
	}

	// 2. Call Service (Pass the clean request struct)
	user, token, err := h.AuthService.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, responses.FailResponse("Invalid credentials"))
		return
	}

	// 3. Map Domain Model to DTO Response
	responseData := responses.AuthResponse{
		User: responses.UserDetail{
			ID:        user.ID,
			Email:     user.Email,
			Name:      user.FirstName + " " + user.LastName,
			CreatedAt: user.CreatedAt,
		},
		AccessToken: token,
	}

	// 4. Send Standardized Success Response
	c.JSON(http.StatusOK, responses.SuccessResponse("Login successful", responseData))
}