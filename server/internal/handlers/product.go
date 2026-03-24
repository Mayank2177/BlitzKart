package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"server/internal/config"
	"server/internal/dto/responses"
	"server/internal/models"
)

// GetProducts retrieves all products
func GetProducts(c *gin.Context) {
	var products []models.Product

	if err := config.DB.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, responses.FailResponse("Could not fetch products"))
		return
	}

	list := make([]responses.ProductListItem, len(products))
	for i, p := range products {
		list[i] = responses.ProductListItem{
			ID:    p.ID,
			Name:  p.Name,
			Price: p.Price,
			SKU:   p.SKU,
		}
	}

	c.JSON(http.StatusOK, responses.SuccessResponse("Products fetched", list))
}

// GetProduct retrieves a single product by ID
func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, responses.FailResponse("Product not found"))
		return
	}

	resp := responses.ProductResponse{
		ID:          product.ID,
		Name:        product.Name,
		Description: product.Description,
		SKU:         product.SKU,
		Price:       product.Price,
		CategoryID:  product.CategoryID,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
	}

	c.JSON(http.StatusOK, responses.SuccessResponse("Product fetched", resp))
}

// CreateProductDB creates a new product (Admin only)
func CreateProductDB(c *gin.Context) {
	var input models.Product

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, responses.FailResponse(err.Error()))
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, responses.FailResponse("Could not create product"))
		return
	}

	resp := responses.ProductResponse{
		ID:          input.ID,
		Name:        input.Name,
		Description: input.Description,
		SKU:         input.SKU,
		Price:       input.Price,
		CategoryID:  input.CategoryID,
		CreatedAt:   input.CreatedAt,
		UpdatedAt:   input.UpdatedAt,
	}

	c.JSON(http.StatusCreated, responses.SuccessResponse("Product created", resp))
}