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

type ClientHandler struct {
	DB     *sqlx.DB
	Secret string
}

func (h *ClientHandler) ListProducts(c *gin.Context) {
	var items []models.Product
	err := h.DB.Select(&items, "SELECT id, name, starting_price, image_url, created_at, updated_at FROM products ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"products": items})
}

func (h *ClientHandler) GetProduct(c *gin.Context) {
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

func (h *ClientHandler) ListRobuxes(c *gin.Context) {
	var items []models.Robux
	err := h.DB.Select(&items, "SELECT id, robux_amount, price, created_at, updated_at FROM robuxes ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"robuxes": items})
}

func (h *ClientHandler) Register(c *gin.Context) {
	var req models.ClientRegisterRequest
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
		"INSERT INTO user_accounts (full_name, email, password, is_active, pic, no_hp) VALUES (?, ?, ?, 1, ?, ?)",
		req.FullName, req.Email, string(hashed), valueOrNil(req.Pic), valueOrNil(req.NoHP),
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	id64, _ := res.LastInsertId()
	var ua models.UserAccount
	if err := h.DB.Get(&ua, "SELECT id, full_name, email, password, is_active, created_at, pic, no_hp FROM user_accounts WHERE id = ?", id64); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"user_account": ua})
}

func (h *ClientHandler) Login(c *gin.Context) {
	var req models.ClientLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	var ua models.UserAccount
	err := h.DB.Get(&ua, "SELECT id, full_name, email, password, is_active, created_at, pic, no_hp FROM user_accounts WHERE email = ?", req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
		return
	}
	if !ua.IsActive {
		c.JSON(http.StatusForbidden, gin.H{"error": "inactive"})
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(ua.Password), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
		return
	}
	token, err := auth.GenerateToken(h.Secret, ua.ID, "client", ua.FullName, ua.Email, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.SetCookie("client_accessToken", token, 60*60*24, "/", "", false, false)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *ClientHandler) Me(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)
	var ua models.UserAccount
	err := h.DB.Get(&ua, "SELECT id, full_name, email, password, is_active, created_at, pic, no_hp FROM user_accounts WHERE id = ?", claims.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user_account": ua})
}

func (h *ClientHandler) UpdateMe(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)
	var req models.ClientUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	sets := []string{}
	args := []interface{}{}
	if req.FullName != nil {
		sets = append(sets, "full_name = ?")
		args = append(args, *req.FullName)
	}
	if req.Email != nil {
		sets = append(sets, "email = ?")
		args = append(args, *req.Email)
	}
	if req.NoHP != nil {
		sets = append(sets, "no_hp = ?")
		args = append(args, *req.NoHP)
	}
	if req.Pic != nil {
		sets = append(sets, "pic = ?")
		args = append(args, *req.Pic)
	}
	if len(sets) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "nothing_to_update"})
		return
	}
	q := "UPDATE user_accounts SET " + strings.Join(sets, ", ") + " WHERE id = ?"
	args = append(args, claims.ID)
	if _, err := h.DB.Exec(q, args...); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	var ua models.UserAccount
	if err := h.DB.Get(&ua, "SELECT id, full_name, email, password, is_active, created_at, pic, no_hp FROM user_accounts WHERE id = ?", claims.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user_account": ua})
}

func valueOrNil(p *string) interface{} {
	if p == nil {
		return nil
	}
	return *p
}

func (h *ClientHandler) UploadAvatar(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)
	// Fetch current avatar to delete later if replaced successfully
	var oldPic sql.NullString
	_ = h.DB.Get(&oldPic, "SELECT pic FROM user_accounts WHERE id = ?", claims.ID)
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file_required"})
		return
	}
	ext := filepath.Ext(file.Filename)
	if ext == "" {
		ext = ".png"
	}
	filename := fmt.Sprintf("avatar_%d%s", time.Now().UnixNano(), ext)
	dir := filepath.Join("uploads", "avatars")
	_ = os.MkdirAll(dir, 0755)
	dst := filepath.Join(dir, filename)
	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "upload_failed"})
		return
	}
	publicPath := filepath.ToSlash(filepath.Join("/uploads/avatars", filename))
	if _, err := h.DB.Exec("UPDATE user_accounts SET pic = ? WHERE id = ?", publicPath, claims.ID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	// Safely delete previous avatar file if it exists and is under our uploads directory
	if oldPic.Valid && oldPic.String != "" && oldPic.String != publicPath {
		if strings.HasPrefix(oldPic.String, "/uploads/avatars/") {
			oldBase := filepath.Base(oldPic.String)
			if oldBase != "" {
				oldDst := filepath.Join("uploads", "avatars", oldBase)
				_ = os.Remove(oldDst)
			}
		}
	}
	var ua models.UserAccount
	if err := h.DB.Get(&ua, "SELECT id, full_name, email, password, is_active, created_at, pic, no_hp FROM user_accounts WHERE id = ?", claims.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user_account": ua})
}

func (h *ClientHandler) Logout(c *gin.Context) {
	c.SetCookie("client_accessToken", "", -1, "/", "", false, false)
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *ClientHandler) CreateOrder(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)
	var req models.ClientCreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}

	// Calculate initial total
	var price float64
	if req.RobuxesID != nil {
		err := h.DB.Get(&price, "SELECT price FROM robuxes WHERE id = ?", *req.RobuxesID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_robux_id"})
			return
		}
	} else {
		// Fallback to name matching if ID is missing (legacy)
		var robuxes []models.Robux
		if err := h.DB.Select(&robuxes, "SELECT robux_amount, price FROM robuxes"); err == nil {
			for _, r := range robuxes {
				if fmt.Sprintf("Top Up Robux %d", r.RobuxAmount) == req.OrderName {
					price = r.Price
					break
				}
			}
		}
	}
	initialTotal := price * float64(req.Quantity)

	res, err := h.DB.Exec(
		"INSERT INTO orders (order_name, quantity, total, user_account_id, robuxes_id) VALUES (?, ?, ?, ?, ?)",
		req.OrderName, req.Quantity, initialTotal, claims.ID, req.RobuxesID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error", "details": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	var o models.Order
	if err := h.DB.Unsafe().Get(&o, "SELECT * FROM orders WHERE id = ?", id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error", "details": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"order": o})
}

func (h *ClientHandler) ListMyOrders(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)
	status := strings.TrimSpace(c.Query("status"))
	var items []models.Order
	var err error
	if status == "draft" {
		q := `
			SELECT 
				o.*,
				'-' as invoice_number,
				o.total as total,
				o.created_at as header_date,
				'draft' as status,
				ra.username as roblox_username,
				pm.metode_pembayaran as payment_method,
				pm.akun as payment_account,
				o.id_product_items,
				o.robuxes_id,
				o.order_name
			FROM orders o
			LEFT JOIN order_headers oh ON o.order_header_id = oh.id
			LEFT JOIN roblox_accounts ra ON o.id = ra.order_id
			LEFT JOIN pembayaran p ON o.pembayaran_id = p.id
			LEFT JOIN payment_methods pm ON p.parent_payment_method_id = pm.id
			WHERE o.user_account_id = ? AND o.order_header_id IS NULL
		`
		err = h.DB.Unsafe().Select(&items, q+" ORDER BY o.id DESC", claims.ID)
	} else {
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
				pm.akun as payment_account,
				o.id_product_items,
				o.robuxes_id
			FROM order_headers oh
			LEFT JOIN orders o ON oh.order_id = o.id
			LEFT JOIN roblox_accounts ra ON oh.roblox_account_id = ra.id
			LEFT JOIN pembayaran p ON o.pembayaran_id = p.id
			LEFT JOIN payment_methods pm ON p.parent_payment_method_id = pm.id
			WHERE oh.id IN (SELECT order_header_id FROM orders WHERE user_account_id = ? AND order_header_id IS NOT NULL)
		`
		if status != "" {
			err = h.DB.Unsafe().Select(&items, q+" AND oh.status = ? ORDER BY oh.id DESC", claims.ID, status)
		} else {
			err = h.DB.Unsafe().Select(&items, q+" ORDER BY oh.id DESC", claims.ID)
		}
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"orders": items})
}
func (h *ClientHandler) CreateRobloxAccount(c *gin.Context) {
	v, _ := c.Get("claims")
	_ = v.(*auth.Claims)
	var req models.ClientCreateRobloxAccountRequest
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

type updateQtyReq struct {
	Quantity int `json:"quantity" binding:"required"`
}

func (h *ClientHandler) UpdateOrderQuantity(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)
	idStr := c.Param("id")
	id64, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id64 <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var req updateQtyReq
	if err := c.ShouldBindJSON(&req); err != nil || req.Quantity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}

	// Recalculate total
	var existingOrder models.Order
	if err := h.DB.Unsafe().Get(&existingOrder, "SELECT id, order_name, id_product_items, robuxes_id FROM orders WHERE id = ?", id64); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "order_not_found"})
		return
	}

	var price float64
	if existingOrder.IDProductItems != nil {
		// Fetch price from product_items
		err := h.DB.Get(&price, "SELECT price FROM product_items WHERE id = ?", *existingOrder.IDProductItems)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "fetch_item_price_failed"})
			return
		}
	} else {
		// Existing logic for Robux matching
		var robuxes []models.Robux
		if err := h.DB.Select(&robuxes, "SELECT id, robux_amount, price FROM robuxes"); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "fetch_prices_failed"})
			return
		}
		for _, r := range robuxes {
			if (existingOrder.RobuxesID != nil && *existingOrder.RobuxesID == r.ID) || 
			   fmt.Sprintf("Top Up Robux %d", r.RobuxAmount) == existingOrder.OrderName {
				price = r.Price
				break
			}
		}
	}
	newTotal := price * float64(req.Quantity)

	_, err = h.DB.Exec("UPDATE orders SET quantity = ?, total = ? WHERE id = ? AND user_account_id = ?", req.Quantity, newTotal, id64, claims.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	var o models.Order
	if err := h.DB.Unsafe().Get(&o, "SELECT id, order_name, order_date, quantity, total, status, created_at, updated_at, user_account_id FROM orders WHERE id = ?", id64); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"order": o})
}
func (h *ClientHandler) DeleteOrder(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)
	idStr := c.Param("id")
	id64, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id64 <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}
	var owner uint64
	err = h.DB.Get(&owner, "SELECT user_account_id FROM orders WHERE id = ?", id64)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	if int(owner) != claims.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return
	}
	if _, err := h.DB.Exec("DELETE FROM orders WHERE id = ?", id64); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
func generateInvoiceNumber(db *sqlx.DB) (string, error) {
	now := time.Now()
	prefix := fmt.Sprintf("INV-%02d%04d-", int(now.Month()), now.Year())
	var last string
	_ = db.Get(&last, "SELECT invoice_number FROM order_headers WHERE invoice_number LIKE ? ORDER BY invoice_number DESC LIMIT 1", prefix+"%")
	if strings.TrimSpace(last) == "" {
		return prefix + "00001", nil
	}
	parts := strings.Split(last, "-")
	suf := parts[len(parts)-1]
	n, err := strconv.Atoi(suf)
	if err != nil {
		n = 0
	}
	return fmt.Sprintf("%s%05d", prefix, n+1), nil
}

func (h *ClientHandler) ListPaymentMethods(c *gin.Context) {
	var items []models.PaymentMethod
	err := h.DB.Select(&items, "SELECT id, metode_pembayaran, akun, created_at, updated_at FROM payment_methods ORDER BY id ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"payment_methods": items})
}

func (h *ClientHandler) ListPembayaran(c *gin.Context) {
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
type finalizePaymentReq struct {
	PaymentMethodID int `json:"payment_method_id" binding:"required"`
}

func (h *ClientHandler) FinalizePayment(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)

	var req finalizePaymentReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}

	// 1. Get all draft orders for this user
	var orders []models.Order
	err := h.DB.Unsafe().Select(&orders, "SELECT * FROM orders WHERE user_account_id = ? AND order_header_id IS NULL", claims.ID)
	if err != nil || len(orders) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no_draft_orders"})
		return
	}

	// 2. Fetch Robux prices to calculate actual totals
	var robuxes []models.Robux
	if err := h.DB.Select(&robuxes, "SELECT robux_amount, price FROM robuxes"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "fetch_prices_failed"})
		return
	}
	priceMap := make(map[int]float64)
	for _, r := range robuxes {
		priceMap[r.RobuxAmount] = r.Price
	}

	// 3. Generate invoice number
	inv, err := generateInvoiceNumber(h.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invoice_gen_failed"})
		return
	}

	tx, err := h.DB.Beginx()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "tx_failed"})
		return
	}
	defer tx.Rollback()

	var totalSubtotal float64
	var firstRAID uint64

	for i, o := range orders {
		var price float64
		if o.IDProductItems != nil {
			err := h.DB.Get(&price, "SELECT price FROM product_items WHERE id = ?", *o.IDProductItems)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "fetch_item_price_failed"})
				return
			}
		} else {
			// Parse amount from name like "Top Up Robux %d"
			var amt int
			_, _ = fmt.Sscanf(o.OrderName, "Top Up Robux %d", &amt)
			price = priceMap[amt]
		}
		
		itemTotal := price * float64(o.Quantity)

		// Update order total and pembayaran_id
		_, err = tx.Exec("UPDATE orders SET total = ?, pembayaran_id = ? WHERE id = ?", itemTotal, req.PaymentMethodID, o.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "update_order_failed", "details": err.Error()})
			return
		}


		// Get roblox account id for the header reference
		var raID uint64
		err = tx.Get(&raID, "SELECT id FROM roblox_accounts WHERE order_id = ?", o.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "fetch_ra_failed"})
			return
		}
		if i == 0 {
			firstRAID = raID
		}

		totalSubtotal += itemTotal
	}

	// Calculate final total with tax (10%)
	tax := float64(int(totalSubtotal * 0.1))
	finalTotal := totalSubtotal + tax

	// 4. Create order header with status
	resH, err := tx.Exec(
		"INSERT INTO order_headers (order_id, roblox_account_id, invoice_number, total, status, payment_method_id) VALUES (?, ?, ?, ?, 'belum_bayar', ?)",
		orders[0].ID, firstRAID, inv, finalTotal, req.PaymentMethodID,
	)
	if err != nil {
		// If column payment_method_id doesn't exist yet, try without it
		resH, err = tx.Exec(
			"INSERT INTO order_headers (order_id, roblox_account_id, invoice_number, total, status) VALUES (?, ?, ?, ?, 'belum_bayar')",
			orders[0].ID, firstRAID, inv, finalTotal,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "create_header_failed"})
			return
		}
	}

	headerID, _ := resH.LastInsertId()

	// 5. Link all orders to the new header
	for _, o := range orders {
		_, err = tx.Exec("UPDATE orders SET order_header_id = ? WHERE id = ?", headerID, o.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "link_orders_failed"})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "commit_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"invoice_number": inv,
		"total":          finalTotal,
		"order_count":    len(orders),
	})
}

func (h *ClientHandler) GetOrderHeaderItems(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_id"})
		return
	}

	var items []models.Order
	err = h.DB.Unsafe().Select(&items, "SELECT * FROM orders WHERE order_header_id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server_error", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *ClientHandler) ListProductItems(c *gin.Context) {
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

func (h *ClientHandler) CreateProductItemOrder(c *gin.Context) {
	v, _ := c.Get("claims")
	claims := v.(*auth.Claims)

	var req models.CreateProductItemOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}

	// 1. Get product item details for price and name (parent product name)
	var item struct {
		models.ProductItem
		ProductName string `db:"product_name"`
	}
	err := h.DB.Get(&item, `
		SELECT pi.*, pr.name as product_name 
		FROM product_items pi 
		JOIN products pr ON pi.id_product = pr.id 
		WHERE pi.id = ?`, req.IDProductItem)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "item_not_found"})
		return
	}

	total := item.Price * float64(req.Quantity)

	tx, err := h.DB.Beginx()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "tx_failed"})
		return
	}
	defer tx.Rollback()

	// 2. Create Order using ProductItem Name
	res, err := tx.Exec(
		"INSERT INTO orders (order_name, quantity, total, user_account_id, id_product_items) VALUES (?, ?, ?, ?, ?)",
		item.Name, req.Quantity, total, claims.ID, req.IDProductItem,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "create_order_failed", "details": err.Error()})
		return
	}
	orderID, _ := res.LastInsertId()

	// 3. Create Roblox Account
	_, err = tx.Exec(
		"INSERT INTO roblox_accounts (order_id, username, password, phone, email) VALUES (?, ?, ?, ?, ?)",
		orderID, req.Username, req.Password, req.Phone, req.Email,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "create_account_failed", "details": err.Error()})
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "commit_failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"ok": true, "order_id": orderID})
}
