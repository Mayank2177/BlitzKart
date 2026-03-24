package utils

import (
	"errors"
	"fmt"
)

// Common error types
var (
	ErrNotFound          = errors.New("resource not found")
	ErrUnauthorized      = errors.New("unauthorized access")
	ErrInvalidInput      = errors.New("invalid input")
	ErrDuplicateEntry    = errors.New("duplicate entry")
	ErrInternalServer    = errors.New("internal server error")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

// AppError represents an application-specific error
type AppError struct {
	Code    int
	Message string
	Err     error
}

// Error implements the error interface
func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

// NewAppError creates a new application error
func NewAppError(code int, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

// WrapError wraps an error with additional context
func WrapError(err error, message string) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %w", message, err)
}
