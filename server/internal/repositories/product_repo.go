package repositories

import (
	"server/internal/database"
	"server/internal/models"
	"gorm.io/gorm"
)

type ProductRepository struct {
	*database.BaseRepository
}

func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{
		BaseRepository: database.NewBaseRepository(db),
	}
}

func (r *ProductRepository) FindById(id uint) (*models.Product, error) {
	var product models.Product
	err := r.DB.First(&product, id).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *ProductRepository) GetAll(limit int) ([]*models.Product, error) {
	var products []*models.Product
	err := r.DB.Limit(limit).Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepository) Create(product *models.Product) error {
	return r.DB.Create(product).Error
}

func (r *ProductRepository) Update(product *models.Product) error {
	return r.DB.Save(product).Error
}

func (r *ProductRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Product{}, id).Error
}

func (r *ProductRepository) SearchByName(query string, limit int) ([]*models.Product, error) {
	var products []*models.Product
	err := r.DB.Where("name LIKE ?", "%"+query+"%").Limit(limit).Find(&products).Error
	return products, err
}

func (r *ProductRepository) GetByCategory(categoryID uint, limit int) ([]*models.Product, error) {
	var products []*models.Product
	err := r.DB.Where("category_id = ?", categoryID).Limit(limit).Find(&products).Error
	return products, err
}
