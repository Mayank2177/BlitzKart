package requests

// RegisterRequest defines the payload for user registration
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email,max=255"`
	Password string `json:"password" binding:"required,min=6,max=50"`
	Name     string `json:"name" binding:"required,max=100"`
}

// LoginRequest defines the payload for user login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// RefreshTokenRequest defines the payload for refreshing JWT
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}