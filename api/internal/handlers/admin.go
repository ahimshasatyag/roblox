package handlers

import (
	"api/internal/auth"
	"api/internal/models"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

func (h *AdminHandler) UploadProductImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file_required"})
		return
	}

	ext := filepath.Ext(file.Filename)
	if ext == "" {
		ext = ".png"
	}
	filename := fmt.Sprintf("product_%d%s", time.Now().UnixNano(), ext)
	dir := filepath.Join("uploads", "products")
	_ = os.MkdirAll(dir, 0755)
	dst := filepath.Join(dir, filename)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "upload_failed"})
		return
	}

	publicPath := filepath.ToSlash(filepath.Join("/uploads/products", filename))
	c.JSON(http.StatusOK, gin.H{"url": publicPath})
}

type AdminHandler struct {
	DB     *sqlx.DB
	Secret string
}

func (h *AdminHandler) Register(c *gin.Context) {
	var req models.AdminRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	res, err := h.DB.Exec(
		"INSERT INTO users (role_id, fullname, username, password, email) VALUES (?, ?, ?, ?, ?)",
		req.RoleID, req.Fullname, req.Username, string(hashed), req.Email,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id64, _ := res.LastInsertId()
	var user models.User
	if err := h.DB.Get(&user, "SELECT id, role_id, fullname, username, password, created_at, email FROM users WHERE id = ?", id64); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"user": user})
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req models.AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	var user models.User
	err := h.DB.Get(&user, "SELECT id, role_id, fullname, username, password, created_at, email FROM users WHERE username = ?", req.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
		return
	}
	email := ""
	if user.Email != nil {
		email = *user.Email
	}
	token, err := auth.GenerateToken(h.Secret, user.ID, "admin", user.Username, email, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.SetCookie("admin_accessToken", token, 60*60*24, "/", "", false, false)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *AdminHandler) Me(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)
	var user models.User
	err := h.DB.Get(&user, "SELECT id, role_id, fullname, username, password, created_at, email FROM users WHERE id = ?", claims.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *AdminHandler) Logout(c *gin.Context) {
	c.SetCookie("admin_accessToken", "", -1, "/", "", false, false)
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *AdminHandler) ListProducts(c *gin.Context) {
	var items []models.Product
	err := h.DB.Select(&items, "SELECT id, name, starting_price, image_url, created_at, updated_at FROM products ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"products": items})
}

func (h *AdminHandler) GetProduct(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var p models.Product
	if err := h.DB.Get(&p, "SELECT id, name, starting_price, image_url, created_at, updated_at FROM products WHERE id = ?", id); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "product_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product": p})
}

func (h *AdminHandler) CreateProduct(c *gin.Context) {
	var req models.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	res, err := h.DB.Exec(
		"INSERT INTO products (name, starting_price, image_url) VALUES (?, ?, ?)",
		req.Name, req.StartingPrice, req.ImageURL,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id, _ := res.LastInsertId()
	var p models.Product
	if err := h.DB.Get(&p, "SELECT id, name, starting_price, image_url, created_at, updated_at FROM products WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"product": p})
}

func (h *AdminHandler) UpdateProduct(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req models.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.Name != nil {
		sets = append(sets, "name = ?")
		args = append(args, *req.Name)
	}
	if req.StartingPrice != nil {
		sets = append(sets, "starting_price = ?")
		args = append(args, *req.StartingPrice)
	}
	if req.ImageURL != nil {
		sets = append(sets, "image_url = ?")
		args = append(args, *req.ImageURL)
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	q := "UPDATE products SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, id)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	var p models.Product
	if err := h.DB.Get(&p, "SELECT id, name, starting_price, image_url, created_at, updated_at FROM products WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product": p})
}

func (h *AdminHandler) DeleteProduct(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM products WHERE id = ?", id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *AdminHandler) ListRobuxes(c *gin.Context) {
	var items []models.Robux
	err := h.DB.Select(&items, "SELECT id, robux_amount, price, created_at, updated_at FROM robuxes ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"robuxes": items})
}

func (h *AdminHandler) CreateRobux(c *gin.Context) {
	var req models.CreateRobuxRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	res, err := h.DB.Exec(
		"INSERT INTO robuxes (robux_amount, price) VALUES (?, ?)",
		req.RobuxAmount, req.Price,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id, _ := res.LastInsertId()
	var r models.Robux
	if err := h.DB.Get(&r, "SELECT id, robux_amount, price, created_at, updated_at FROM robuxes WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"robux": r})
}

func (h *AdminHandler) UpdateRobux(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req models.UpdateRobuxRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.RobuxAmount != nil {
		sets = append(sets, "robux_amount = ?")
		args = append(args, *req.RobuxAmount)
	}
	if req.Price != nil {
		sets = append(sets, "price = ?")
		args = append(args, *req.Price)
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	q := "UPDATE robuxes SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, id)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	var r models.Robux
	if err := h.DB.Get(&r, "SELECT id, robux_amount, price, created_at, updated_at FROM robuxes WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"robux": r})
}

func (h *AdminHandler) DeleteRobux(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM robuxes WHERE id = ?", id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *AdminHandler) ListOrders(c *gin.Context) {
	var items []models.Order
	q := `
		SELECT 
			oh.id as id,
			oh.id as order_header_id,
			oh.invoice_number as invoice_number,
			oh.total as total,
			oh.created_at as header_date,
			COALESCE(oh.status, 'belum_bayar') as status,
			COALESCE(o.order_name, 'Pesanan Robux') as order_name,
			ra.username as roblox_username,
			pm.metode_pembayaran as payment_method,
			pm.akun as payment_account
		FROM order_headers oh
		LEFT JOIN orders o ON oh.order_id = o.id
		LEFT JOIN roblox_accounts ra ON oh.roblox_account_id = ra.id
		LEFT JOIN pembayaran p ON o.pembayaran_id = p.id
		LEFT JOIN payment_methods pm ON p.parent_payment_method_id = pm.id
		ORDER BY oh.id DESC
	`
	err := h.DB.Unsafe().Select(&items, q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"orders": items})
}

func (h *AdminHandler) CreateOrder(c *gin.Context) {
	var req models.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	res, err := h.DB.Exec(
		"INSERT INTO orders (order_name, quantity, total, user_account_id) VALUES (?, ?, ?, ?)",
		req.OrderName, req.Quantity, req.Total, req.UserAccountID,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id, _ := res.LastInsertId()
	var o models.Order
	if err := h.DB.Get(&o, "SELECT id, order_name, order_date, quantity, total, created_at, updated_at, user_account_id FROM orders WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"order": o})
}

func (h *AdminHandler) UpdateOrder(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req models.UpdateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.OrderName != nil {
		sets = append(sets, "order_name = ?")
		args = append(args, *req.OrderName)
	}
	if req.OrderDate != nil {
		sets = append(sets, "order_date = ?")
		args = append(args, *req.OrderDate)
	}
	if req.Quantity != nil {
		sets = append(sets, "quantity = ?")
		args = append(args, *req.Quantity)
	}
	if req.Total != nil {
		sets = append(sets, "total = ?")
		args = append(args, *req.Total)
	}
	if req.UserAccountID != nil {
		sets = append(sets, "user_account_id = ?")
		args = append(args, *req.UserAccountID)
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	q := "UPDATE orders SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, id)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error", "details": err.Error()})
		return
	}

	// Update status in order_header if provided
	if req.Status != nil {
		_, err = h.DB.Exec("UPDATE order_headers SET status = ? WHERE order_id = ?", *req.Status, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "update_header_status_failed"})
			return
		}
	}
	var o models.Order
	if err := h.DB.Get(&o, "SELECT id, order_name, order_date, quantity, total, created_at, updated_at, user_account_id FROM orders WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"order": o})
}

func (h *AdminHandler) DeleteOrder(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM orders WHERE id = ?", id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *AdminHandler) ListRobloxAccounts(c *gin.Context) {
	var items []models.RobloxAccount
	err := h.DB.Select(&items, "SELECT id, order_id, username, password, phone, email, created_at, updated_at FROM roblox_accounts ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"roblox_accounts": items})
}

func (h *AdminHandler) CreateRobloxAccount(c *gin.Context) {
	var req models.CreateRobloxAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	res, err := h.DB.Exec(
		"INSERT INTO roblox_accounts (order_id, username, password, phone, email) VALUES (?, ?, ?, ?, ?)",
		req.OrderID, req.Username, req.Password, req.Phone, req.Email,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id, _ := res.LastInsertId()
	var ra models.RobloxAccount
	if err := h.DB.Get(&ra, "SELECT id, order_id, username, password, phone, email, created_at, updated_at FROM roblox_accounts WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"roblox_account": ra})
}

func (h *AdminHandler) UpdateRobloxAccount(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req models.UpdateRobloxAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.OrderID != nil {
		sets = append(sets, "order_id = ?")
		args = append(args, *req.OrderID)
	}
	if req.Username != nil {
		sets = append(sets, "username = ?")
		args = append(args, *req.Username)
	}
	if req.Password != nil {
		sets = append(sets, "password = ?")
		args = append(args, *req.Password)
	}
	if req.Phone != nil {
		sets = append(sets, "phone = ?")
		args = append(args, *req.Phone)
	}
	if req.Email != nil {
		sets = append(sets, "email = ?")
		args = append(args, *req.Email)
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	q := "UPDATE roblox_accounts SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, id)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	var ra models.RobloxAccount
	if err := h.DB.Get(&ra, "SELECT id, order_id, username, password, phone, email, created_at, updated_at FROM roblox_accounts WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"roblox_account": ra})
}

func (h *AdminHandler) DeleteRobloxAccount(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM roblox_accounts WHERE id = ?", id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *AdminHandler) ListPaymentMethods(c *gin.Context) {
	var items []models.PaymentMethod
	err := h.DB.Select(&items, "SELECT id, metode_pembayaran, akun, created_at, updated_at FROM payment_methods ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"payment_methods": items})
}

func (h *AdminHandler) CreatePaymentMethod(c *gin.Context) {
	var req models.CreatePaymentMethodRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	res, err := h.DB.Exec("INSERT INTO payment_methods (metode_pembayaran, akun) VALUES (?, ?)", req.MetodePembayaran, req.Akun)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id, _ := res.LastInsertId()
	var pm models.PaymentMethod
	if err := h.DB.Get(&pm, "SELECT id, metode_pembayaran, akun, created_at, updated_at FROM payment_methods WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"payment_method": pm})
}

func (h *AdminHandler) UpdatePaymentMethod(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req models.UpdatePaymentMethodRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.MetodePembayaran != nil {
		sets = append(sets, "metode_pembayaran = ?")
		args = append(args, *req.MetodePembayaran)
	}
	if req.Akun != nil {
		sets = append(sets, "akun = ?")
		args = append(args, *req.Akun)
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	q := "UPDATE payment_methods SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, id)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	var pm models.PaymentMethod
	if err := h.DB.Get(&pm, "SELECT id, metode_pembayaran, akun, created_at, updated_at FROM payment_methods WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"payment_method": pm})
}

func (h *AdminHandler) DeletePaymentMethod(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM payment_methods WHERE id = ?", id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *AdminHandler) ListPembayaran(c *gin.Context) {
	parentStr := strings.TrimSpace(c.Query("parent_payment_method_id"))
	var items []models.Pembayaran
	var err error
	if parentStr != "" {
		id, parseErr := strconv.ParseUint(parentStr, 10, 64)
		if parseErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_parent"})
			return
		}
		err = h.DB.Select(&items, "SELECT id, parent_payment_method_id, nama_pembayaran, created_at, updated_at FROM pembayaran WHERE parent_payment_method_id = ? ORDER BY id ASC", id)
	} else {
		err = h.DB.Select(&items, "SELECT id, parent_payment_method_id, nama_pembayaran, created_at, updated_at FROM pembayaran ORDER BY id ASC")
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"pembayaran": items})
}

func (h *AdminHandler) CreatePembayaran(c *gin.Context) {
	var req models.CreatePembayaranRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	res, err := h.DB.Exec("INSERT INTO pembayaran (parent_payment_method_id, nama_pembayaran) VALUES (?, ?)", req.ParentPaymentMethodID, req.NamaPembayaran)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id, _ := res.LastInsertId()
	var p models.Pembayaran
	if err := h.DB.Get(&p, "SELECT id, parent_payment_method_id, nama_pembayaran, created_at, updated_at FROM pembayaran WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"pembayaran": p})
}

func (h *AdminHandler) UpdatePembayaran(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req models.UpdatePembayaranRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.ParentPaymentMethodID != nil {
		sets = append(sets, "parent_payment_method_id = ?")
		args = append(args, *req.ParentPaymentMethodID)
	}
	if req.NamaPembayaran != nil {
		sets = append(sets, "nama_pembayaran = ?")
		args = append(args, *req.NamaPembayaran)
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	q := "UPDATE pembayaran SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, id)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	var p models.Pembayaran
	if err := h.DB.Get(&p, "SELECT id, parent_payment_method_id, nama_pembayaran, created_at, updated_at FROM pembayaran WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"pembayaran": p})
}

func (h *AdminHandler) DeletePembayaran(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM pembayaran WHERE id = ?", id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *AdminHandler) ListMenus(c *gin.Context) {
	var items []models.MenuAdmin
	err := h.DB.Select(&items, "SELECT id_menu, nm_menu, id_parent, no_urut, nm_folder, nm_icon FROM menu_admin ORDER BY no_urut ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"menus": items})
}

func (h *AdminHandler) ListUsers(c *gin.Context) {
	var items []models.User
	err := h.DB.Select(&items, "SELECT id, role_id, fullname, username, created_at, email FROM users ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"users": items})
}

func (h *AdminHandler) GetUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var user models.User
	err = h.DB.Get(&user, "SELECT id, role_id, fullname, username, created_at, email FROM users WHERE id = ?", id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "user_not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *AdminHandler) UpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.RoleID != nil {
		sets = append(sets, "role_id = ?")
		args = append(args, *req.RoleID)
	}
	if req.Fullname != nil {
		sets = append(sets, "fullname = ?")
		args = append(args, *req.Fullname)
	}
	if req.Username != nil {
		sets = append(sets, "username = ?")
		args = append(args, *req.Username)
	}
	if req.Email != nil {
		sets = append(sets, "email = ?")
		args = append(args, *req.Email)
	}
	if req.Password != nil && *req.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(*req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
			return
		}
		sets = append(sets, "password = ?")
		args = append(args, string(hashed))
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	q := "UPDATE users SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, id)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error", "details": err.Error()})
		return
	}
	var user models.User
	if err := h.DB.Get(&user, "SELECT id, role_id, fullname, username, created_at, email FROM users WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *AdminHandler) DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM users WHERE id = ?", id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *AdminHandler) ListRoles(c *gin.Context) {
	var items []models.UserRole
	err := h.DB.Select(&items, "SELECT id, role_name FROM user_roles ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"roles": items})
}

func (h *AdminHandler) ListProductItems(c *gin.Context) {
	productID := c.Query("id_product")
	var items []models.ProductItem
	var err error
	if productID != "" {
		err = h.DB.Select(&items, "SELECT id, id_product, name, price, created_at, updated_at FROM product_items WHERE id_product = ? ORDER BY id ASC", productID)
	} else {
		err = h.DB.Select(&items, "SELECT id, id_product, name, price, created_at, updated_at FROM product_items ORDER BY id ASC")
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product_items": items})
}

func (h *AdminHandler) CreateProductItem(c *gin.Context) {
	var req models.CreateProductItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	res, err := h.DB.Exec(
		"INSERT INTO product_items (id_product, name, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
		req.IDProduct, req.Name, req.Price,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id, _ := res.LastInsertId()
	var item models.ProductItem
	if err := h.DB.Get(&item, "SELECT id, id_product, name, price, created_at, updated_at FROM product_items WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"product_item": item})
}

func (h *AdminHandler) UpdateProductItem(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req models.UpdateProductItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.Name != nil {
		sets = append(sets, "name = ?")
		args = append(args, *req.Name)
	}
	if req.Price != nil {
		sets = append(sets, "price = ?")
		args = append(args, *req.Price)
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	sets = append(sets, "updated_at = NOW()")
	q := "UPDATE product_items SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, id)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	var item models.ProductItem
	if err := h.DB.Get(&item, "SELECT id, id_product, name, price, created_at, updated_at FROM product_items WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product_item": item})
}

func (h *AdminHandler) DeleteProductItem(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM product_items WHERE id = ?", id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
func (h *AdminHandler) GetDashboardStats(c *gin.Context) {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	filterStatus := c.Query("status")

	if startDate == "" && endDate == "" {
		// Default to last 7 days if no range is specified
		startDate = time.Now().AddDate(0, 0, -7).Format("2006-01-02")
	}

	whereClauses := []string{"1=1"}
	args := []interface{}{}

	if startDate != "" {
		whereClauses = append(whereClauses, "order_date >= ?")
		args = append(args, startDate+" 00:00:00")
	}
	if endDate != "" {
		whereClauses = append(whereClauses, "order_date <= ?")
		args = append(args, endDate+" 23:59:59")
	}
	if filterStatus != "" {
		if filterStatus == "belum_bayar" {
			whereClauses = append(whereClauses, "(status = 'belum_bayar' OR status IS NULL)")
		} else {
			whereClauses = append(whereClauses, "status = ?")
			args = append(args, filterStatus)
		}
	}

	var orderItem int
	var orderRobux int
	var totalOrder int

	// 1. Order Item Count
	qItem := "SELECT COUNT(*) FROM orders"
	if filterStatus != "" {
		qItem += " JOIN order_headers oh_filter ON orders.order_header_id = oh_filter.id"
	}
	qItem += " WHERE id_product_items IS NOT NULL"
	if startDate != "" || endDate != "" || filterStatus != "" {
		qItem += " AND " + strings.Join(whereClauses, " AND ")
	}
	err := h.DB.Get(&orderItem, qItem, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error_item", "details": err.Error()})
		return
	}

	// 2. Order Robux Count
	qRobux := "SELECT COUNT(*) FROM orders"
	if filterStatus != "" {
		qRobux += " JOIN order_headers oh_filter ON orders.order_header_id = oh_filter.id"
	}
	qRobux += " WHERE robuxes_id IS NOT NULL"
	if startDate != "" || endDate != "" || filterStatus != "" {
		qRobux += " AND " + strings.Join(whereClauses, " AND ")
	}
	err = h.DB.Get(&orderRobux, qRobux, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error_robux", "details": err.Error()})
		return
	}

	// 3. Total Order Count
	qTotal := "SELECT COUNT(*) FROM orders"
	if filterStatus != "" {
		qTotal += " JOIN order_headers oh_filter ON orders.order_header_id = oh_filter.id"
	}
	if startDate != "" || endDate != "" || filterStatus != "" {
		qTotal += " WHERE " + strings.Join(whereClauses, " AND ")
	}
	err = h.DB.Get(&totalOrder, qTotal, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error_total", "details": err.Error()})
		return
	}

	// 4. Fetch daily orders history
	type DailyOrder struct {
		Date  string `db:"date" json:"date"`
		Count int    `db:"count" json:"count"`
	}
	var history []DailyOrder
	qHistory := "SELECT DATE_FORMAT(order_date, '%Y-%m-%d') as date, COUNT(*) as count FROM orders"
	if filterStatus != "" {
		qHistory += " JOIN order_headers oh_filter ON orders.order_header_id = oh_filter.id"
	}
	if startDate != "" || endDate != "" || filterStatus != "" {
		qHistory += " WHERE " + strings.Join(whereClauses, " AND ")
	}
	qHistory += " GROUP BY date ORDER BY date ASC LIMIT 30" // Increased limit for filtered view
	err = h.DB.Select(&history, qHistory, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error_history", "details": err.Error()})
		return
	}

	// 5. Fetch status distribution (always return full distribution regardless of status filter, 
	// but respect date filter)
	type StatusCount struct {
		Status string `db:"status" json:"status"`
		Count  int    `db:"count" json:"count"`
	}
	var statuses []StatusCount
	qStatus := "SELECT COALESCE(status, 'belum_bayar') as status, COUNT(*) as count FROM order_headers"
	statusArgs := []interface{}{}
	statusWhere := []string{"1=1"}
	if startDate != "" {
		statusWhere = append(statusWhere, "created_at >= ?")
		statusArgs = append(statusArgs, startDate+" 00:00:00")
	}
	if endDate != "" {
		statusWhere = append(statusWhere, "created_at <= ?")
		statusArgs = append(statusArgs, endDate+" 23:59:59")
	}
	qStatus += " WHERE " + strings.Join(statusWhere, " AND ") + " GROUP BY COALESCE(status, 'belum_bayar')"
	err = h.DB.Select(&statuses, qStatus, statusArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error_status", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"order_item":  orderItem,
		"order_robux": orderRobux,
		"total_order": totalOrder,
		"history":     history,
		"statuses":    statuses,
	})
}
