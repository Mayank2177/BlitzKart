package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"server/internal/dto"
	"server/internal/services"
	"server/internal/utils"
)

type CategoryHandler struct {
	categoryService *services.CategoryService
}

func NewCategoryHandler(categoryService *services.CategoryService) *CategoryHandler {
	return &CategoryHandler{
		categoryService: categoryService,
	}
}

// CreateCategory creates a new category (Admin only)
func (h *CategoryHandler) CreateCategory(ctx *gin.Context) {
	var req dto.CreateCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	category, err := h.categoryService.CreateCategory(&req)
	if err != nil {
		if err.Error() == "category with this slug already exists" {
			utils.SendError(ctx, 409, err.Error())
			return
		}
		if err.Error() == "parent category not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to create category")
		return
	}

	utils.SendCreated(ctx, "Category created successfully", category)
}

// GetCategoryByID retrieves a category by ID
func (h *CategoryHandler) GetCategoryByID(ctx *gin.Context) {
	categoryID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid category ID")
		return
	}

	category, err := h.categoryService.GetCategoryByID(uint(categoryID))
	if err != nil {
		utils.SendNotFound(ctx, "Category not found")
		return
	}

	utils.SendSuccess(ctx, "Category retrieved successfully", category)
}

// UpdateCategory updates a category (Admin only)
func (h *CategoryHandler) UpdateCategory(ctx *gin.Context) {
	categoryID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid category ID")
		return
	}

	var req dto.UpdateCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, err.Error())
		return
	}

	category, err := h.categoryService.UpdateCategory(uint(categoryID), &req)
	if err != nil {
		if err.Error() == "category not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		if err.Error() == "category with this slug already exists" {
			utils.SendError(ctx, 409, err.Error())
			return
		}
		if err.Error() == "parent category not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		if err.Error() == "category cannot be its own parent" {
			utils.SendBadRequest(ctx, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to update category")
		return
	}

	utils.SendSuccess(ctx, "Category updated successfully", category)
}

// DeleteCategory deletes a category (Admin only)
func (h *CategoryHandler) DeleteCategory(ctx *gin.Context) {
	categoryID, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid category ID")
		return
	}

	err = h.categoryService.DeleteCategory(uint(categoryID))
	if err != nil {
		if err.Error() == "category not found" {
			utils.SendNotFound(ctx, err.Error())
			return
		}
		if err.Error() == "cannot delete category with children" {
			utils.SendError(ctx, 400, err.Error())
			return
		}
		utils.SendInternalError(ctx, "Failed to delete category")
		return
	}

	utils.SendSuccess(ctx, "Category deleted successfully", nil)
}

// GetAllCategories retrieves all categories
func (h *CategoryHandler) GetAllCategories(ctx *gin.Context) {
	categories, err := h.categoryService.GetAllCategories()
	if err != nil {
		utils.SendInternalError(ctx, "Failed to get categories")
		return
	}

	utils.SendSuccess(ctx, "Categories retrieved successfully", categories)
}

// GetCategoryTree retrieves the category tree structure
func (h *CategoryHandler) GetCategoryTree(ctx *gin.Context) {
	tree, err := h.categoryService.GetCategoryTree()
	if err != nil {
		utils.SendInternalError(ctx, "Failed to get category tree")
		return
	}

	utils.SendSuccess(ctx, "Category tree retrieved successfully", tree)
}

// GetCategoryBySlug retrieves a category by slug
func (h *CategoryHandler) GetCategoryBySlug(ctx *gin.Context) {
	slug := ctx.Param("slug")
	if slug == "" {
		utils.SendBadRequest(ctx, "Slug is required")
		return
	}

	category, err := h.categoryService.GetCategoryBySlug(slug)
	if err != nil {
		utils.SendNotFound(ctx, "Category not found")
		return
	}

	utils.SendSuccess(ctx, "Category retrieved successfully", category)
}