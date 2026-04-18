package services

import (
	"context"
	"errors"

	"server/internal/models"
	"server/internal/repositories"
	"server/internal/utils"
)

// AuthService defines authentication behavior.
type AuthService interface {
	Login(ctx context.Context, email, password string) (models.User, string, error)
}

// authService implements the AuthService interface.
type authService struct {
	userRepo *repositories.UserRepository
}

// NewAuthService returns a new AuthService instance.
func NewAuthService(userRepo *repositories.UserRepository) AuthService {
	return &authService{
		userRepo: userRepo,
	}
}

// Login validates credentials and returns a user + token.
func (s *authService) Login(ctx context.Context, email, password string) (models.User, string, error) {
	// Validate input
	if email == "" || password == "" {
		return models.User{}, "", errors.New("email and password are required")
	}

	// Find user by email
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return models.User{}, "", errors.New("invalid credentials")
	}

	// Verify password
	if !utils.CheckPasswordHash(password, user.Password) {
		return models.User{}, "", errors.New("invalid credentials")
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID, user.Email)
	if err != nil {
		return models.User{}, "", errors.New("failed to generate token")
	}

	return *user, token, nil
}
