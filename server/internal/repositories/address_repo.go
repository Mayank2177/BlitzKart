package repositories

import (
	"server/internal/models"
	"gorm.io/gorm"
)

type AddressRepository struct {
	DB *gorm.DB
}

func NewAddressRepository(db *gorm.DB) *AddressRepository {
	return &AddressRepository{DB: db}
}

// Create creates a new address
func (r *AddressRepository) Create(address *models.Address) error {
	return r.DB.Create(address).Error
}

// GetByID retrieves an address by ID
func (r *AddressRepository) GetByID(id uint) (*models.Address, error) {
	var address models.Address
	err := r.DB.First(&address, id).Error
	if err != nil {
		return nil, err
	}
	return &address, nil
}

// Update updates an address
func (r *AddressRepository) Update(address *models.Address) error {
	return r.DB.Save(address).Error
}

// Delete soft deletes an address
func (r *AddressRepository) Delete(id uint) error {
	return r.DB.Delete(&models.Address{}, id).Error
}

// GetByUserID retrieves all addresses for a user
func (r *AddressRepository) GetByUserID(userID uint) ([]models.Address, error) {
	var addresses []models.Address
	err := r.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&addresses).Error
	return addresses, err
}

// CountByUserID counts total addresses for a user
func (r *AddressRepository) CountByUserID(userID uint) (int, error) {
	var count int64
	err := r.DB.Model(&models.Address{}).Where("user_id = ?", userID).Count(&count).Error
	return int(count), err
}

// CheckUserOwnsAddress checks if an address belongs to a user
func (r *AddressRepository) CheckUserOwnsAddress(addressID, userID uint) (bool, error) {
	var count int64
	err := r.DB.Model(&models.Address{}).
		Where("id = ? AND user_id = ?", addressID, userID).
		Count(&count).Error
	return count > 0, err
}
