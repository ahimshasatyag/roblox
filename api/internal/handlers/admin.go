package handlers

import (
	"api/internal/auth"
	"api/internal/models"
	"database/sql"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

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
