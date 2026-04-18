package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"
)

type AddressService struct {
	addressRepo *repositories.AddressRepository
}

func NewAddressService(addressRepo *repositories.AddressRepository) *AddressService {
	return &AddressService{
		addressRepo: addressRepo,
	}
}

// CreateAddress creates a new address for a user
func (s *AddressService) CreateAddress(userID uint, req *dto.CreateAddressRequest) (*dto.AddressResponse, error) {
	address := &models.Address{
		UserID:  userID,
		Street:  req.Street,
		City:    req.City,
		State:   req.State,
		ZipCode: req.ZipCode,
		Country: req.Country,
	}

	if err := s.addressRepo.Create(address); err != nil {
		return nil, err
	}

	return s.toAddressResponse(address), nil
}

// GetAddressByID retrieves an address by ID
func (s *AddressService) GetAddressByID(addressID, userID uint) (*dto.AddressResponse, error) {
	// Check if address belongs to user
	owns, err := s.addressRepo.CheckUserOwnsAddress(addressID, userID)
	if err != nil {
		return nil, err
	}
	if !owns {
		return nil, errors.New("address not found or access denied")
	}

	address, err := s.addressRepo.GetByID(addressID)
	if err != nil {
		return nil, errors.New("address not found")
	}

	return s.toAddressResponse(address), nil
}

// UpdateAddress updates an address
func (s *AddressService) UpdateAddress(addressID, userID uint, req *dto.UpdateAddressRequest) (*dto.AddressResponse, error) {
	// Check if address belongs to user
	owns, err := s.addressRepo.CheckUserOwnsAddress(addressID, userID)
	if err != nil {
		return nil, err
	}
	if !owns {
		return nil, errors.New("address not found or access denied")
	}

	address, err := s.addressRepo.GetByID(addressID)
	if err != nil {
		return nil, errors.New("address not found")
	}

	// Update fields
	address.Street = req.Street
	address.City = req.City
	address.State = req.State
	address.ZipCode = req.ZipCode
	address.Country = req.Country

	if err := s.addressRepo.Update(address); err != nil {
		return nil, err
	}

	return s.toAddressResponse(address), nil
}

// DeleteAddress deletes an address
func (s *AddressService) DeleteAddress(addressID, userID uint) error {
	// Check if address belongs to user
	owns, err := s.addressRepo.CheckUserOwnsAddress(addressID, userID)
	if err != nil {
		return err
	}
	if !owns {
		return errors.New("address not found or access denied")
	}

	return s.addressRepo.Delete(addressID)
}

// GetUserAddresses retrieves all addresses for a user
func (s *AddressService) GetUserAddresses(userID uint) (*dto.UserAddressesResponse, error) {
	addresses, err := s.addressRepo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	count, err := s.addressRepo.CountByUserID(userID)
	if err != nil {
		return nil, err
	}

	addressResponses := make([]dto.AddressResponse, 0, len(addresses))
	for _, address := range addresses {
		addressResponses = append(addressResponses, *s.toAddressResponse(&address))
	}

	return &dto.UserAddressesResponse{
		UserID:        userID,
		TotalAddresses: count,
		Addresses:     addressResponses,
	}, nil
}

// Helper function to convert model to response
func (s *AddressService) toAddressResponse(address *models.Address) *dto.AddressResponse {
	return &dto.AddressResponse{
		ID:        address.ID,
		UserID:    address.UserID,
		Street:    address.Street,
		City:      address.City,
		State:     address.State,
		ZipCode:   address.ZipCode,
		Country:   address.Country,
		CreatedAt: address.CreatedAt,
		UpdatedAt: address.UpdatedAt,
	}
}
