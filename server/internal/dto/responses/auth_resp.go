package responses

import "time"

// AuthResponse returned upon successful login/register
type AuthResponse struct {
	User        UserDetail `json:"user"`
	AccessToken string     `json:"access_token"`
	// RefreshToken string     `json:"refresh_token"` // Optional
}

// UserDetail exposes safe user information
type UserDetail struct {
	ID        uint      `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	// NEVER include Password or PasswordHash here
}