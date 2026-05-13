package models

import "time"

type User struct {
	ID        int       `db:"id" json:"id"`
	RoleID    *int      `db:"role_id" json:"role_id"`
	Fullname  string    `db:"fullname" json:"fullname"`
	Username  string    `db:"username" json:"username"`
	Password  string    `db:"password" json:"-"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	Email     *string   `db:"email" json:"email"`
}

type UserAccount struct {
	ID        int       `db:"id" json:"id"`
	FullName  string    `db:"full_name" json:"full_name"`
	Email     string    `db:"email" json:"email"`
	Password  string    `db:"password" json:"-"`
	IsActive  bool      `db:"is_active" json:"is_active"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	Pic       *string   `db:"pic" json:"pic"`
	NoHP      *string   `db:"no_hp" json:"no_hp"`
}

type AdminRegisterRequest struct {
	RoleID   *int    `json:"role_id"`
	Fullname string  `json:"fullname" binding:"required"`
	Username string  `json:"username" binding:"required"`
	Password string  `json:"password" binding:"required"`
	Email    *string `json:"email"`
}

type AdminLoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UpdateUserRequest struct {
	RoleID   *int    `json:"role_id"`
	Fullname *string `json:"fullname"`
	Username *string `json:"username"`
	Password *string `json:"password"`
	Email    *string `json:"email"`
}

type ClientRegisterRequest struct {
	FullName string  `json:"full_name" binding:"required"`
	Email    string  `json:"email" binding:"required"`
	Password string  `json:"password" binding:"required"`
	Pic      *string `json:"pic"`
	NoHP     *string `json:"no_hp"`
}

type ClientLoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type ClientUpdateRequest struct {
	FullName *string `json:"full_name"`
	Email    *string `json:"email"`
	NoHP     *string `json:"no_hp"`
	Pic      *string `json:"pic"`
}

type OrderHeader struct {
	ID              uint64    `db:"id" json:"id"`
	OrderID         uint64    `db:"order_id" json:"order_id"`
	RobloxAccountID uint64    `db:"roblox_account_id" json:"roblox_account_id"`
	InvoiceNumber   string    `db:"invoice_number" json:"invoice_number"`
	Total           float64   `db:"total" json:"total"`
	Status          string    `db:"status" json:"status"`
	CreatedAt       time.Time `db:"created_at" json:"created_at"`
	UpdatedAt       time.Time `db:"updated_at" json:"updated_at"`
}

type Product struct {
	ID            uint64    `db:"id" json:"id"`
	Name          string    `db:"name" json:"name"`
	StartingPrice float64   `db:"starting_price" json:"starting_price"`
	ImageURL      *string   `db:"image_url" json:"image_url"`
	CreatedAt     time.Time `db:"created_at" json:"created_at"`
	UpdatedAt     time.Time `db:"updated_at" json:"updated_at"`
}

type CreateProductRequest struct {
	Name          string  `json:"name" binding:"required"`
	StartingPrice float64 `json:"starting_price" binding:"required"`
	ImageURL      *string `json:"image_url"`
}

type UpdateProductRequest struct {
	Name          *string  `json:"name"`
	StartingPrice *float64 `json:"starting_price"`
	ImageURL      *string  `json:"image_url"`
}

type Robux struct {
	ID          uint64    `db:"id" json:"id"`
	RobuxAmount int       `db:"robux_amount" json:"robux_amount"`
	Price       float64   `db:"price" json:"price"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}

type CreateRobuxRequest struct {
	RobuxAmount int     `json:"robux_amount" binding:"required"`
	Price       float64 `json:"price" binding:"required"`
}

type UpdateRobuxRequest struct {
	RobuxAmount *int     `json:"robux_amount"`
	Price       *float64 `json:"price"`
}

type Order struct {
	ID             uint64    `db:"id" json:"id"`
	InvoiceNumber  *string   `db:"invoice_number" json:"invoice_number"`
	OrderName      string    `db:"order_name" json:"order_name"`
	OrderDate      time.Time `db:"order_date" json:"order_date"`
	Quantity       int       `db:"quantity" json:"quantity"`
	Total          float64   `db:"total" json:"total"`
	Status         string    `db:"status" json:"status"`
	CreatedAt      time.Time `db:"created_at" json:"created_at"`
	UpdatedAt      time.Time `db:"updated_at" json:"updated_at"`
	UserAccountID  uint64    `db:"user_account_id" json:"user_account_id"`
	PaymentMethod  *string   `db:"payment_method" json:"payment_method"`
	PaymentAccount *string   `db:"payment_account" json:"payment_account"`
	RobuxesID      *uint64   `db:"robuxes_id" json:"robuxes_id"`
	PembayaranID   *uint64   `db:"pembayaran_id" json:"pembayaran_id"`
	OrderHeaderID  *uint64    `db:"order_header_id" json:"order_header_id"`
	HeaderTotal    *float64   `db:"header_total" json:"header_total"`
	RobloxUsername *string    `db:"roblox_username" json:"roblox_username"`
	HeaderDate     *time.Time `db:"header_date" json:"header_date"`
	IDProductItems *uint64    `db:"id_product_items" json:"id_product_items"`
}

type CreateOrderRequest struct {
	OrderName      string  `json:"order_name" binding:"required"`
	Quantity       int     `json:"quantity" binding:"required"`
	Total          float64 `json:"total" binding:"required"`
	Status         string  `json:"status" binding:"required"`
	UserAccountID  uint64  `json:"user_account_id" binding:"required"`
	RobuxesID      *uint64 `json:"robuxes_id"`
	IDProductItems *uint64 `json:"id_product_items"`
}

type UpdateOrderRequest struct {
	InvoiceNumber *string    `json:"invoice_number"`
	OrderName     *string    `json:"order_name"`
	OrderDate     *time.Time `json:"order_date"`
	Quantity      *int       `json:"quantity"`
	Total         *float64   `json:"total"`
	Status        *string    `json:"status"`
	UserAccountID *uint64    `json:"user_account_id"`
	RobuxesID     *uint64    `json:"robuxes_id"`
}

type RobloxAccount struct {
	ID            uint64    `db:"id" json:"id"`
	OrderID       uint64    `db:"order_id" json:"order_id"`
	Username      string    `db:"username" json:"username"`
	Password      string    `db:"password" json:"password"`
	Phone         string    `db:"phone" json:"phone"`
	Email         string    `db:"email" json:"email"`
	CreatedAt     time.Time `db:"created_at" json:"created_at"`
	UpdatedAt     time.Time `db:"updated_at" json:"updated_at"`
}

type CreateRobloxAccountRequest struct {
	OrderID       uint64 `json:"order_id" binding:"required"`
	Username      string `json:"username" binding:"required"`
	Password      string `json:"password" binding:"required"`
	Phone         string `json:"phone" binding:"required"`
	Email         string `json:"email" binding:"required"`
}

type UpdateRobloxAccountRequest struct {
	OrderID       *uint64 `json:"order_id"`
	Username      *string `json:"username"`
	Password      *string `json:"password"`
	Phone         *string `json:"phone"`
	Email         *string `json:"email"`
}

type ClientCreateOrderRequest struct {
	OrderName string  `json:"order_name" binding:"required"`
	Quantity  int     `json:"quantity" binding:"required"`
	RobuxesID *uint64 `json:"robuxes_id"`
}

type ClientCreateRobloxAccountRequest struct {
	OrderID  uint64 `json:"order_id" binding:"required"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
	Email    string `json:"email" binding:"required"`
}

type PaymentMethod struct {
	ID               uint64    `db:"id" json:"id"`
	MetodePembayaran string    `db:"metode_pembayaran" json:"metode_pembayaran"`
	Akun             string    `db:"akun" json:"akun"`
	CreatedAt        time.Time `db:"created_at" json:"created_at"`
	UpdatedAt        time.Time `db:"updated_at" json:"updated_at"`
}

type CreatePaymentMethodRequest struct {
	MetodePembayaran string `json:"metode_pembayaran" binding:"required"`
	Akun             string `json:"akun" binding:"required"`
}

type UpdatePaymentMethodRequest struct {
	MetodePembayaran *string `json:"metode_pembayaran"`
	Akun             *string `json:"akun"`
}

type Pembayaran struct {
	ID                     uint64    `db:"id" json:"id"`
	ParentPaymentMethodID  uint64    `db:"parent_payment_method_id" json:"parent_payment_method_id"`
	NamaPembayaran         string    `db:"nama_pembayaran" json:"nama_pembayaran"`
	CreatedAt              time.Time `db:"created_at" json:"created_at"`
	UpdatedAt              time.Time `db:"updated_at" json:"updated_at"`
}

type CreatePembayaranRequest struct {
	ParentPaymentMethodID uint64 `json:"parent_payment_method_id" binding:"required"`
	NamaPembayaran        string `json:"nama_pembayaran" binding:"required"`
}

type UpdatePembayaranRequest struct {
	ParentPaymentMethodID *uint64 `json:"parent_payment_method_id"`
	NamaPembayaran        *string `json:"nama_pembayaran"`
}

type MenuAdmin struct {
	IDMenu   string  `db:"id_menu" json:"id_menu"`
	NmMenu   string  `db:"nm_menu" json:"nm_menu"`
	IDParent string  `db:"id_parent" json:"id_parent"`
	NoUrut   int     `db:"no_urut" json:"no_urut"`
	NmFolder string  `db:"nm_folder" json:"nm_folder"`
	NmIcon   *string `db:"nm_icon" json:"nm_icon"`
}

type UserRole struct {
	ID       int    `db:"id" json:"id"`
	RoleName string `db:"role_name" json:"role_name"`
}

type ProductItem struct {
	ID        uint64     `db:"id" json:"id"`
	IDProduct uint64     `db:"id_product" json:"id_product"`
	Name      string     `db:"name" json:"name"`
	Price     float64    `db:"price" json:"price"`
	CreatedAt *time.Time `db:"created_at" json:"created_at"`
	UpdatedAt *time.Time `db:"updated_at" json:"updated_at"`
}

type CreateProductItemRequest struct {
	IDProduct uint64  `json:"id_product" binding:"required"`
	Name      string  `json:"name" binding:"required"`
	Price     float64 `json:"price" binding:"required"`
}

type UpdateProductItemRequest struct {
	Name  *string  `json:"name"`
	Price *float64 `json:"price"`
}

type CreateProductItemOrderRequest struct {
	IDProductItem uint64 `json:"id_product_item" binding:"required"`
	Quantity      int    `json:"quantity" binding:"required"`
	Username      string `json:"username" binding:"required"`
	Password      string `json:"password"`
	Phone         string `json:"phone" binding:"required"`
	Email         string `json:"email" binding:"required"`
}
