package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"
	"strings"
)

type CategoryService struct {
	categoryRepo *repositories.CategoryRepository
}

func NewCategoryService(categoryRepo *repositories.CategoryRepository) *CategoryService {
	return &CategoryService{
		categoryRepo: categoryRepo,
	}
}

// CreateCategory creates a new category
func (s *CategoryService) CreateCategory(req *dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	// Check if slug already exists
	exists, err := s.categoryRepo.CheckSlugExists(req.Slug, 0)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("category with this slug already exists")
	}

	// If parent ID is provided, check if parent exists
	if req.ParentID != nil {
		parentExists, err := s.categoryRepo.CheckParentExists(*req.ParentID)
		if err != nil {
			return nil, err
		}
		if !parentExists {
			return nil, errors.New("parent category not found")
		}
	}

	category := &models.Category{
		Name:     req.Name,
		Slug:     strings.ToLower(req.Slug),
		ParentID: req.ParentID,
	}

	if err := s.categoryRepo.Create(category); err != nil {
		return nil, err
	}

	return s.toCategoryResponse(category), nil
}

// GetCategoryByID retrieves a category by ID
func (s *CategoryService) GetCategoryByID(id uint) (*dto.CategoryResponse, error) {
	category, err := s.categoryRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("category not found")
	}

	return s.toCategoryResponse(category), nil
}

// UpdateCategory updates a category
func (s *CategoryService) UpdateCategory(id uint, req *dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	// Check if category exists
	category, err := s.categoryRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("category not found")
	}

	// Check if slug already exists (excluding current category)
	exists, err := s.categoryRepo.CheckSlugExists(req.Slug, id)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("category with this slug already exists")
	}

	// If parent ID is provided, check if parent exists and not creating circular reference
	if req.ParentID != nil {
		if *req.ParentID == id {
			return nil, errors.New("category cannot be its own parent")
		}

		parentExists, err := s.categoryRepo.CheckParentExists(*req.ParentID)
		if err != nil {
			return nil, err
		}
		if !parentExists {
			return nil, errors.New("parent category not found")
		}
	}

	// Update fields
	category.Name = req.Name
	category.Slug = strings.ToLower(req.Slug)
	category.ParentID = req.ParentID

	if err := s.categoryRepo.Update(category); err != nil {
		return nil, err
	}

	return s.toCategoryResponse(category), nil
}

// DeleteCategory deletes a category
func (s *CategoryService) DeleteCategory(id uint) error {
	// Check if category exists
	_, err := s.categoryRepo.GetByID(id)
	if err != nil {
		return errors.New("category not found")
	}

	// Check if category has children
	hasChildren, err := s.categoryRepo.CheckHasChildren(id)
	if err != nil {
		return err
	}
	if hasChildren {
		return errors.New("cannot delete category with children")
	}

	return s.categoryRepo.Delete(id)
}

// GetAllCategories retrieves all categories
func (s *CategoryService) GetAllCategories() (*dto.CategoriesListResponse, error) {
	categories, err := s.categoryRepo.GetAll()
	if err != nil {
		return nil, err
	}

	count, err := s.categoryRepo.Count()
	if err != nil {
		return nil, err
	}

	categoryResponses := make([]dto.CategoryResponse, 0, len(categories))
	for _, category := range categories {
		categoryResponses = append(categoryResponses, *s.toCategoryResponse(&category))
	}

	return &dto.CategoriesListResponse{
		TotalCategories: count,
		Categories:      categoryResponses,
	}, nil
}

// GetCategoryTree retrieves the category tree structure
func (s *CategoryService) GetCategoryTree() ([]dto.CategoryTreeResponse, error) {
	categories, err := s.categoryRepo.GetCategoryTree()
	if err != nil {
		return nil, err
	}

	treeResponses := make([]dto.CategoryTreeResponse, 0, len(categories))
	for _, category := range categories {
		treeResponses = append(treeResponses, s.toCategoryTreeResponse(&category))
	}

	return treeResponses, nil
}

// GetCategoryBySlug retrieves a category by slug
func (s *CategoryService) GetCategoryBySlug(slug string) (*dto.CategoryResponse, error) {
	category, err := s.categoryRepo.GetBySlug(slug)
	if err != nil {
		return nil, errors.New("category not found")
	}

	return s.toCategoryResponse(category), nil
}

// Helper function to convert model to response
func (s *CategoryService) toCategoryResponse(category *models.Category) *dto.CategoryResponse {
	return &dto.CategoryResponse{
		ID:        category.ID,
		Name:      category.Name,
		Slug:      category.Slug,
		ParentID:  category.ParentID,
		CreatedAt: category.CreatedAt,
		UpdatedAt: category.UpdatedAt,
	}
}

// Helper function to convert model to tree response
func (s *CategoryService) toCategoryTreeResponse(category *models.Category) dto.CategoryTreeResponse {
	response := dto.CategoryTreeResponse{
		ID:       category.ID,
		Name:     category.Name,
		Slug:     category.Slug,
		ParentID: category.ParentID,
	}

	if len(category.Children) > 0 {
		children := make([]dto.CategoryTreeResponse, 0, len(category.Children))
		for _, child := range category.Children {
			children = append(children, s.toCategoryTreeResponse(&child))
		}
		response.Children = children
	}

	return response
}