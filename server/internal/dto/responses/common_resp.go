package responses

// APIResponse is the standard wrapper for all successful API responses
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"` // Optional pagination info
}

// ErrorResponse is the standard wrapper for error responses
type ErrorResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
	Code    int    `json:"code,omitempty"` // Custom application error code
}

// Meta holds pagination details
type Meta struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	TotalItems int `json:"total_items"`
	TotalPages int `json:"total_pages"`
}

// Helper functions to build responses easily

func SuccessResponse(message string, data interface{}) APIResponse {
	return APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	}
}

func FailResponse(errorMsg string) ErrorResponse {
	return ErrorResponse{
		Success: false,
		Error:   errorMsg,
	}
}