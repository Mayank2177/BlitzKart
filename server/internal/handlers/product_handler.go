package handlers

import (
	"server/internal/dto"
	"server/internal/services"
	"server/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	productService *services.ProductService
}

func NewProductHandler(productService *services.ProductService) *ProductHandler {
	return &ProductHandler{
		productService: productService,
	}
}

// GetAllProducts retrieves all products
// @Summary Get all products
// @Description Get a list of all products
// @Tags products
// @Produce json
// @Param limit query int false "Limit number of results" default(50)
// @Success 200 {object} dto.ProductsListResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /products [get]
func (h *ProductHandler) GetAllProducts(ctx *gin.Context) {
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "50"))

	products, errResp := h.productService.GetAllProducts(limit)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Products retrieved successfully", products)
}

// GetProductByID retrieves a single product by ID
// @Summary Get product by ID
// @Description Get detailed information about a specific product
// @Tags products
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} dto.ProductDetailResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /products/{id} [get]
func (h *ProductHandler) GetProductByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid product ID: "+err.Error())
		return
	}

	product, errResp := h.productService.GetProductByID(uint(id))
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Product retrieved successfully", product)
}

// CreateProduct creates a new product
// @Summary Create product
// @Description Create a new product (Admin only)
// @Tags products
// @Accept json
// @Produce json
// @Param request body dto.CreateProductRequest true "Create product request"
// @Success 201 {object} dto.ProductDetailResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/products [post]
func (h *ProductHandler) CreateProduct(ctx *gin.Context) {
	var req dto.CreateProductRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, "Invalid request: "+err.Error())
		return
	}

	product, errResp := h.productService.CreateProduct(&req)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendCreated(ctx, "Product created successfully", product)
}

// UpdateProduct updates an existing product
// @Summary Update product
// @Description Update an existing product (Admin only)
// @Tags products
// @Accept json
// @Produce json
// @Param id path int true "Product ID"
// @Param request body dto.UpdateProductRequest true "Update product request"
// @Success 200 {object} dto.ProductDetailResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/products/{id} [put]
func (h *ProductHandler) UpdateProduct(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid product ID: "+err.Error())
		return
	}

	var req dto.UpdateProductRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		utils.SendBadRequest(ctx, "Invalid request: "+err.Error())
		return
	}

	product, errResp := h.productService.UpdateProduct(uint(id), &req)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Product updated successfully", product)
}

// DeleteProduct deletes a product
// @Summary Delete product
// @Description Delete a product (Admin only)
// @Tags products
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/products/{id} [delete]
func (h *ProductHandler) DeleteProduct(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid product ID: "+err.Error())
		return
	}

	errResp := h.productService.DeleteProduct(uint(id))
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Product deleted successfully", nil)
}

// SearchProducts searches for products by name
// @Summary Search products
// @Description Search for products by name
// @Tags products
// @Produce json
// @Param q query string true "Search query"
// @Param limit query int false "Limit number of results" default(20)
// @Success 200 {object} dto.ProductsListResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /products/search [get]
func (h *ProductHandler) SearchProducts(ctx *gin.Context) {
	query := ctx.Query("q")
	if query == "" {
		utils.SendBadRequest(ctx, "Search query is required")
		return
	}

	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))

	products, errResp := h.productService.SearchProducts(query, limit)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Products found", products)
}

// GetProductsByCategory retrieves products by category
// @Summary Get products by category
// @Description Get all products in a specific category
// @Tags products
// @Produce json
// @Param category_id query int true "Category ID"
// @Param limit query int false "Limit number of results" default(50)
// @Success 200 {object} dto.ProductsListResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /products/category [get]
func (h *ProductHandler) GetProductsByCategory(ctx *gin.Context) {
	categoryID, err := strconv.ParseUint(ctx.Query("category_id"), 10, 32)
	if err != nil {
		utils.SendBadRequest(ctx, "Invalid category ID: "+err.Error())
		return
	}

	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "50"))

	products, errResp := h.productService.GetProductsByCategory(uint(categoryID), limit)
	if errResp != nil {
		utils.SendError(ctx, errResp.Code, errResp.Message)
		return
	}

	utils.SendSuccess(ctx, "Products retrieved successfully", products)
}
