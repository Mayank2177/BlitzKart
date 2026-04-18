package repositories

import (
	"server/internal/models"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	DB *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{DB: db}
}

// Create creates a new category
func (r *CategoryRepository) Create(category *models.Category) error {
	return r.DB.Create(category).Error
}

// GetByID retrieves a category by ID
func (r *CategoryRepository) GetByID(id uint) (*models.Category, error) {
	var category models.Category
	err := r.DB.Preload("Parent").Preload("Children").First(&category, id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

// Update updates a category
func (r *CategoryRepository) Update(category *models.Category) error {
	return r.DB.Save(category).Error
}

// Delete soft deletes a category
func (r *CategoryRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Category{}, id).Error
}

// GetAll retrieves all categories
func (r *CategoryRepository) GetAll() ([]models.Category, error) {
	var categories []models.Category
	err := r.DB.Order("name ASC").Find(&categories).Error
	return categories, err
}

// GetRootCategories retrieves categories without parent (top-level)
func (r *CategoryRepository) GetRootCategories() ([]models.Category, error) {
	var categories []models.Category
	err := r.DB.Where("parent_id IS NULL").
		Preload("Children").
		Order("name ASC").
		Find(&categories).Error
	return categories, err
}

// GetCategoryTree retrieves the complete category tree
func (r *CategoryRepository) GetCategoryTree() ([]models.Category, error) {
	var categories []models.Category
	err := r.DB.Where("parent_id IS NULL").
		Preload("Children.Children").
		Order("name ASC").
		Find(&categories).Error
	return categories, err
}

// GetBySlug retrieves a category by slug
func (r *CategoryRepository) GetBySlug(slug string) (*models.Category, error) {
	var category models.Category
	err := r.DB.Where("slug = ?", slug).First(&category).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

// CheckSlugExists checks if a slug already exists (excluding given ID)
func (r *CategoryRepository) CheckSlugExists(slug string, excludeID uint) (bool, error) {
	var count int64
	query := r.DB.Model(&models.Category{}).Where("slug = ?", slug)
	if excludeID > 0 {
		query = query.Where("id != ?", excludeID)
	}
	err := query.Count(&count).Error
	return count > 0, err
}

// GetChildren retrieves all children of a category
func (r *CategoryRepository) GetChildren(parentID uint) ([]models.Category, error) {
	var categories []models.Category
	err := r.DB.Where("parent_id = ?", parentID).
		Order("name ASC").
		Find(&categories).Error
	return categories, err
}

// Count returns total number of categories
func (r *CategoryRepository) Count() (int, error) {
	var count int64
	err := r.DB.Model(&models.Category{}).Count(&count).Error
	return int(count), err
}

// CheckParentExists checks if a parent category exists
func (r *CategoryRepository) CheckParentExists(parentID uint) (bool, error) {
	var count int64
	err := r.DB.Model(&models.Category{}).Where("id = ?", parentID).Count(&count).Error
	return count > 0, err
}

// CheckHasChildren checks if a category has children
func (r *CategoryRepository) CheckHasChildren(categoryID uint) (bool, error) {
	var count int64
	err := r.DB.Model(&models.Category{}).Where("parent_id = ?", categoryID).Count(&count).Error
	return count > 0, err
}