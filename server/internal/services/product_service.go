package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"
	"server/internal/repositories"

	"gorm.io/gorm"
)

type ProductService struct {
	productRepo *repositories.ProductRepository
}

func NewProductService(productRepo *repositories.ProductRepository) *ProductService {
	return &ProductService{
		productRepo: productRepo,
	}
}

// GetAllProducts retrieves all products with optional limit
func (s *ProductService) GetAllProducts(limit int) (*dto.ProductsListResponse, *models.ErrorResponse) {
	if limit <= 0 {
		limit = 50 // Default limit
	}

	products, err := s.productRepo.GetAll(limit)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve products: " + err.Error(),
		}
	}

	productList := make([]dto.ProductListResponse, len(products))
	for i, p := range products {
		productList[i] = dto.ProductListResponse{
			ID:          p.ID,
			Name:        p.Name,
			Description: p.Description,
			SKU:         p.SKU,
			Price:       p.Price,
			CategoryID:  p.CategoryID,
			CreatedAt:   p.CreatedAt,
		}
	}

	return &dto.ProductsListResponse{
		Products:   productList,
		TotalCount: len(productList),
		Page:       1,
		Limit:      limit,
	}, nil
}

// GetProductByID retrieves a single product with full details
func (s *ProductService) GetProductByID(id uint) (*dto.ProductDetailResponse, *models.ErrorResponse) {
	product, err := s.productRepo.FindById(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Product not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve product: " + err.Error(),
		}
	}

	return s.mapProductToDetailResponse(product), nil
}

// CreateProduct creates a new product
func (s *ProductService) CreateProduct(req *dto.CreateProductRequest) (*dto.ProductDetailResponse, *models.ErrorResponse) {
	// Create product model
	product := &models.Product{
		Name:        req.Name,
		Description: req.Description,
		SKU:         req.SKU,
		Price:       req.Price,
		CategoryID:  req.CategoryID,
	}

	// Save to database
	err := s.productRepo.Create(product)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to create product: " + err.Error(),
		}
	}

	// Reload product to get all associations
	product, err = s.productRepo.FindById(product.ID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve created product: " + err.Error(),
		}
	}

	return s.mapProductToDetailResponse(product), nil
}

// UpdateProduct updates an existing product
func (s *ProductService) UpdateProduct(id uint, req *dto.UpdateProductRequest) (*dto.ProductDetailResponse, *models.ErrorResponse) {
	// Check if product exists
	product, err := s.productRepo.FindById(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &models.ErrorResponse{
				Code:    404,
				Message: "Product not found",
			}
		}
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve product: " + err.Error(),
		}
	}

	// Update fields if provided
	if req.Name != "" {
		product.Name = req.Name
	}
	if req.Description != "" {
		product.Description = req.Description
	}
	if req.SKU != "" {
		product.SKU = req.SKU
	}
	if req.Price > 0 {
		product.Price = req.Price
	}
	if req.CategoryID > 0 {
		product.CategoryID = req.CategoryID
	}

	// Save updates
	err = s.productRepo.Update(product)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to update product: " + err.Error(),
		}
	}

	// Reload product to get all associations
	product, err = s.productRepo.FindById(product.ID)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve updated product: " + err.Error(),
		}
	}

	return s.mapProductToDetailResponse(product), nil
}

// DeleteProduct soft deletes a product
func (s *ProductService) DeleteProduct(id uint) *models.ErrorResponse {
	// Check if product exists
	_, err := s.productRepo.FindById(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &models.ErrorResponse{
				Code:    404,
				Message: "Product not found",
			}
		}
		return &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve product: " + err.Error(),
		}
	}

	// Delete product
	err = s.productRepo.Delete(id)
	if err != nil {
		return &models.ErrorResponse{
			Code:    500,
			Message: "Failed to delete product: " + err.Error(),
		}
	}

	return nil
}

// SearchProducts searches products by name
func (s *ProductService) SearchProducts(query string, limit int) (*dto.ProductsListResponse, *models.ErrorResponse) {
	if limit <= 0 {
		limit = 20 // Default limit for search
	}

	products, err := s.productRepo.SearchByName(query, limit)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to search products: " + err.Error(),
		}
	}

	productList := make([]dto.ProductListResponse, len(products))
	for i, p := range products {
		productList[i] = dto.ProductListResponse{
			ID:          p.ID,
			Name:        p.Name,
			Description: p.Description,
			SKU:         p.SKU,
			Price:       p.Price,
			CategoryID:  p.CategoryID,
			CreatedAt:   p.CreatedAt,
		}
	}

	return &dto.ProductsListResponse{
		Products:   productList,
		TotalCount: len(productList),
		Page:       1,
		Limit:      limit,
	}, nil
}

// GetProductsByCategory retrieves products by category
func (s *ProductService) GetProductsByCategory(categoryID uint, limit int) (*dto.ProductsListResponse, *models.ErrorResponse) {
	if limit <= 0 {
		limit = 50 // Default limit
	}

	products, err := s.productRepo.GetByCategory(categoryID, limit)
	if err != nil {
		return nil, &models.ErrorResponse{
			Code:    500,
			Message: "Failed to retrieve products by category: " + err.Error(),
		}
	}

	productList := make([]dto.ProductListResponse, len(products))
	for i, p := range products {
		productList[i] = dto.ProductListResponse{
			ID:          p.ID,
			Name:        p.Name,
			Description: p.Description,
			SKU:         p.SKU,
			Price:       p.Price,
			CategoryID:  p.CategoryID,
			CreatedAt:   p.CreatedAt,
		}
	}

	return &dto.ProductsListResponse{
		Products:   productList,
		TotalCount: len(productList),
		Page:       1,
		Limit:      limit,
	}, nil
}

// mapProductToDetailResponse converts a product model to detail response DTO
func (s *ProductService) mapProductToDetailResponse(product *models.Product) *dto.ProductDetailResponse {
	response := &dto.ProductDetailResponse{
		ID:          product.ID,
		Name:        product.Name,
		Description: product.Description,
		SKU:         product.SKU,
		Price:       product.Price,
		CategoryID:  product.CategoryID,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
	}

	// Map category if loaded
	if product.Category.ID != 0 {
		response.Category = &dto.ProductCategoryResponse{
			ID:   product.Category.ID,
			Name: product.Category.Name,
			Slug: product.Category.Slug,
		}
	}

	// Map variants if loaded
	if len(product.Variants) > 0 {
		response.Variants = make([]dto.ProductVariantSummary, len(product.Variants))
		for i, v := range product.Variants {
			response.Variants[i] = dto.ProductVariantSummary{
				ID:    v.ID,
				SKU:   v.SKU,
				Price: v.Price,
				Stock: v.Stock,
			}
		}
	}

	// Map images if loaded
	if len(product.Images) > 0 {
		response.Images = make([]dto.ProductImageResponse, len(product.Images))
		for i, img := range product.Images {
			response.Images[i] = dto.ProductImageResponse{
				ID:      img.ID,
				URL:     img.URL,
				AltText: img.AltText,
			}
		}
	}

	return response
}
