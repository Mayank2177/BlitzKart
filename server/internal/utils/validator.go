package utils

import (
	"regexp"
	"strings"
)

// IsValidEmail checks if the email format is valid
func IsValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

// IsValidPhone checks if the phone number format is valid
func IsValidPhone(phone string) bool {
	phoneRegex := regexp.MustCompile(`^\+?[1-9]\d{1,14}$`)
	return phoneRegex.MatchString(phone)
}

// IsStrongPassword checks if password meets minimum requirements
func IsStrongPassword(password string) bool {
	if len(password) < 8 {
		return false
	}
	
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`[0-9]`).MatchString(password)
	
	return hasUpper && hasLower && hasNumber
}

// SanitizeString removes leading/trailing spaces and converts to lowercase
func SanitizeString(s string) string {
	return strings.TrimSpace(strings.ToLower(s))
}

// IsEmpty checks if a string is empty or contains only whitespace
func IsEmpty(s string) bool {
	return strings.TrimSpace(s) == ""
}
