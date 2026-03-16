package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"server/internal/config"
	"server/internal/models"
)

// GetProducts retrieves all products
func GetProducts(c *gin.Context) {
	var products []models.Product
	
	// GORM Query
	if err := config.DB.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": products})
}

// GetProduct retrieves a single product by ID
func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})
}

// CreateProduct creates a new product (Admin only usually)
func CreateProductDB(c *gin.Context) {
	var input models.Product

	// Bind JSON input to struct with validation
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save to DB
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create product"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": input})
}