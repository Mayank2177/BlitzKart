package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response represents a standard API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// PaginatedResponse represents a paginated API response
type PaginatedResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Meta    Pagination  `json:"meta"`
}

// Pagination holds pagination metadata
type Pagination struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	TotalItems int `json:"total_items"`
	TotalPages int `json:"total_pages"`
}

// SendSuccess sends a successful response
func SendSuccess(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// SendCreated sends a created response
func SendCreated(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// SendError sends an error response
func SendError(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, Response{
		Success: false,
		Error:   message,
	})
}

// SendBadRequest sends a bad request error
func SendBadRequest(c *gin.Context, message string) {
	SendError(c, http.StatusBadRequest, message)
}

// SendUnauthorized sends an unauthorized error
func SendUnauthorized(c *gin.Context, message string) {
	SendError(c, http.StatusUnauthorized, message)
}

// SendNotFound sends a not found error
func SendNotFound(c *gin.Context, message string) {
	SendError(c, http.StatusNotFound, message)
}

// SendInternalError sends an internal server error
func SendInternalError(c *gin.Context, message string) {
	SendError(c, http.StatusInternalServerError, message)
}

// SendPaginated sends a paginated response
func SendPaginated(c *gin.Context, message string, data interface{}, pagination Pagination) {
	c.JSON(http.StatusOK, PaginatedResponse{
		Success: true,
		Message: message,
		Data:    data,
		Meta:    pagination,
	})
}

// CalculatePagination calculates pagination metadata
func CalculatePagination(page, limit, totalItems int) Pagination {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	totalPages := (totalItems + limit - 1) / limit

	return Pagination{
		Page:       page,
		Limit:      limit,
		TotalItems: totalItems,
		TotalPages: totalPages,
	}
}
