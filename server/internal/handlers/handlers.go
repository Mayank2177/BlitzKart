package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)


// Root handler
func WelcomeHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Welcome to BlitzKart API"})
}

// CreateOrder handles order creation
func CreateOrder(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully"})
}

// GetOrder retrieves an order by ID
func GetOrder(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"id": id, "message": "Order retrieved"})
}

// CreateProduct handles product creation (admin)
func CreateProduct(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"message": "Product created successfully"})
}

// Inventory handlers
func GetInventory(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Get all inventory"})
}

func GetInventoryByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(200, gin.H{"id": id, "message": "Get inventory by ID"})
}

func PostInventory(c *gin.Context) {
	c.JSON(201, gin.H{"message": "Inventory created"})
}

// Dispatch handlers
func GetDispatch(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Get all dispatch"})
}

func GetDispatchByID(c *gin.Context) {
    id := c.Param("id")

	c.JSON(200, gin.H{"id": id, "message": "Get dispatch by ID"})
}

func PostDispatch(c *gin.Context) {
	c.JSON(201, gin.H{"message": "Dispatch created"})
}