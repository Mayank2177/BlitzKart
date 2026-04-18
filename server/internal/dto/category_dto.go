package dto

import "time"

// CreateCategoryRequest represents the request to create a category
type CreateCategoryRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Slug     string `json:"slug" binding:"required,min=2,max=100"`
	ParentID *uint  `json:"parent_id,omitempty"`
}

// UpdateCategoryRequest represents the request to update a category
type UpdateCategoryRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Slug     string `json:"slug" binding:"required,min=2,max=100"`
	ParentID *uint  `json:"parent_id,omitempty"`
}

// CategoryResponse represents a category in API responses
type CategoryResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	ParentID  *uint     `json:"parent_id,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CategoryTreeResponse represents a category with its children
type CategoryTreeResponse struct {
	ID       uint                   `json:"id"`
	Name     string                 `json:"name"`
	Slug     string                 `json:"slug"`
	ParentID *uint                  `json:"parent_id,omitempty"`
	Children []CategoryTreeResponse `json:"children,omitempty"`
}

// CategoriesListResponse represents all categories
type CategoriesListResponse struct {
	TotalCategories int                `json:"total_categories"`
	Categories      []CategoryResponse `json:"categories"`
}