package services

import (
	"context"
	"errors"
	"time"

	"server/internal/models"
)

// AuthService defines authentication behavior.
type AuthService interface {
	Login(ctx context.Context, email, password string) (models.User, string, error)
}

// authService is a small in-memory stub implementation.
type authService struct{}

// NewAuthService returns a new AuthService instance.
func NewAuthService() AuthService {
	return &authService{}
}

// Login validates credentials and returns a user + token.
func (s *authService) Login(ctx context.Context, email, password string) (models.User, string, error) {
	if email == "" || password == "" {
		return models.User{}, "", errors.New("invalid credentials")
	}

	user := models.User{
		ID:        1,
		Email:     email,
		FirstName: "Test",
		LastName:  "User",
		CreatedAt: time.Now(),
	}

	// NOTE: This is a stub token. Replace with real JWT generation in production.
	return user, "dummy-token", nil
}
