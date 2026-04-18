package dto

import "time"

// CreateAddressRequest represents the request to create an address
type CreateAddressRequest struct {
	Street  string `json:"street" binding:"required,min=5,max=200"`
	City    string `json:"city" binding:"required,min=2,max=100"`
	State   string `json:"state" binding:"required,min=2,max=100"`
	ZipCode string `json:"zip_code" binding:"required,min=3,max=20"`
	Country string `json:"country" binding:"required,min=2,max=100"`
}

// UpdateAddressRequest represents the request to update an address
type UpdateAddressRequest struct {
	Street  string `json:"street" binding:"required,min=5,max=200"`
	City    string `json:"city" binding:"required,min=2,max=100"`
	State   string `json:"state" binding:"required,min=2,max=100"`
	ZipCode string `json:"zip_code" binding:"required,min=3,max=20"`
	Country string `json:"country" binding:"required,min=2,max=100"`
}

// AddressResponse represents an address in API responses
type AddressResponse struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	Street    string    `json:"street"`
	City      string    `json:"city"`
	State     string    `json:"state"`
	ZipCode   string    `json:"zip_code"`
	Country   string    `json:"country"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// UserAddressesResponse represents all addresses for a user
type UserAddressesResponse struct {
	UserID        uint              `json:"user_id"`
	TotalAddresses int              `json:"total_addresses"`
	Addresses     []AddressResponse `json:"addresses"`
}
