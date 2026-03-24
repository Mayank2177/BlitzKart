package utils

import (
	"errors"

	"github.com/gin-gonic/gin"
)

// GetUserIDFromContext extracts user ID from gin context
func GetUserIDFromContext(c *gin.Context) (uint, error) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, errors.New("user ID not found in context")
	}

	// Handle different types that might be stored
	switch v := userID.(type) {
	case uint:
		return v, nil
	case int:
		return uint(v), nil
	case float64:
		return uint(v), nil
	default:
		return 0, errors.New("invalid user ID type in context")
	}
}

// GetEmailFromContext extracts email from gin context
func GetEmailFromContext(c *gin.Context) (string, error) {
	email, exists := c.Get("email")
	if !exists {
		return "", errors.New("email not found in context")
	}

	emailStr, ok := email.(string)
	if !ok {
		return "", errors.New("invalid email type in context")
	}

	return emailStr, nil
}

// SetUserContext sets user information in gin context
func SetUserContext(c *gin.Context, userID uint, email string) {
	c.Set("user_id", userID)
	c.Set("email", email)
}
