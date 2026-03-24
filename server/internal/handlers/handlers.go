package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"server/internal/dto/requests"
	"server/internal/dto/responses"
)

// Root handler
func WelcomeHandler(c *gin.Context) {
	c.JSON(http.StatusOK, responses.SuccessResponse("Welcome to BlitzKart API", nil))
}

// CreateOrder handles order creation
func CreateOrder(c *gin.Context) {
	var req requests.CreateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, responses.FailResponse(err.Error()))
		return
	}

	// TODO: pass req to order service once implemented
	c.JSON(http.StatusCreated, responses.SuccessResponse("Order created successfully", nil))
}

// GetOrder retrieves an order by ID
func GetOrder(c *gin.Context) {
	id := c.Param("id")
	// TODO: fetch from order service once implemented
	c.JSON(http.StatusOK, responses.SuccessResponse("Order retrieved", gin.H{"id": id}))
}

// Inventory handlers
func GetInventory(c *gin.Context) {
	c.JSON(http.StatusOK, responses.SuccessResponse("Get all inventory", nil))
}

func GetInventoryByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, responses.SuccessResponse("Get inventory by ID", gin.H{"id": id}))
}

func PostInventory(c *gin.Context) {
	c.JSON(http.StatusCreated, responses.SuccessResponse("Inventory created", nil))
}

// Dispatch handlers
func GetDispatch(c *gin.Context) {
	c.JSON(http.StatusOK, responses.SuccessResponse("Get all dispatch", nil))
}

func GetDispatchByID(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, responses.SuccessResponse("Get dispatch by ID", gin.H{"id": id}))
}

func PostDispatch(c *gin.Context) {
	c.JSON(http.StatusCreated, responses.SuccessResponse("Dispatch created", nil))
}