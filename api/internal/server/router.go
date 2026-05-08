package server

import (
	"api/internal/handlers"
	"api/internal/middleware"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

func cors() gin.HandlerFunc {
	originsEnv := os.Getenv("CORS_ORIGINS")
	origins := []string{"http://localhost:3000"}
	if strings.TrimSpace(originsEnv) != "" {
		for _, o := range strings.Split(originsEnv, ",") {
			o = strings.TrimSpace(o)
			if o != "" {
				origins = append(origins, o)
			}
		}
	}
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		allowed := false
		for _, o := range origins {
			if origin == o {
				allowed = true
				break
			}
		}
		if allowed {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		}
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func SetupRouter(db *sqlx.DB, secret string) *gin.Engine {
	r := gin.Default()
	r.Use(cors())
	r.GET("/health", func(c *gin.Context) { c.String(200, "ok") })
	r.Static("/uploads/avatars", "./uploads/avatars")
	admin := &handlers.AdminHandler{DB: db, Secret: secret}
	client := &handlers.ClientHandler{DB: db, Secret: secret}

	r.GET("/products", client.ListProducts)
	r.GET("/robuxes", client.ListRobuxes)
	r.GET("/payment_methods", client.ListPaymentMethods)
	r.GET("/pembayaran", client.ListPembayaran)

	r.POST("/admin/register", admin.Register)
	r.POST("/admin/login", admin.Login)
	r.POST("/admin/logout", admin.Logout)
	r.POST("/client/register", client.Register)
	r.POST("/client/login", client.Login)
	r.POST("/client/logout", client.Logout)

	ag := r.Group("/admin")
	ag.Use(middleware.Auth(secret), middleware.Scope("admin"))
	ag.GET("/me", admin.Me)
	ag.GET("/products", admin.ListProducts)
	ag.POST("/products", admin.CreateProduct)
	ag.PUT("/products/:id", admin.UpdateProduct)
	ag.DELETE("/products/:id", admin.DeleteProduct)
	ag.GET("/robuxes", admin.ListRobuxes)
	ag.POST("/robuxes", admin.CreateRobux)
	ag.PUT("/robuxes/:id", admin.UpdateRobux)
	ag.DELETE("/robuxes/:id", admin.DeleteRobux)
	ag.GET("/orders", admin.ListOrders)
	ag.POST("/orders", admin.CreateOrder)
	ag.PUT("/orders/:id", admin.UpdateOrder)
	ag.DELETE("/orders/:id", admin.DeleteOrder)
	ag.GET("/roblox_accounts", admin.ListRobloxAccounts)
	ag.POST("/roblox_accounts", admin.CreateRobloxAccount)
	ag.PUT("/roblox_accounts/:id", admin.UpdateRobloxAccount)
	ag.DELETE("/roblox_accounts/:id", admin.DeleteRobloxAccount)
	ag.GET("/payment_methods", admin.ListPaymentMethods)
	ag.POST("/payment_methods", admin.CreatePaymentMethod)
	ag.PUT("/payment_methods/:id", admin.UpdatePaymentMethod)
	ag.DELETE("/payment_methods/:id", admin.DeletePaymentMethod)
	ag.GET("/pembayaran", admin.ListPembayaran)
	ag.POST("/pembayaran", admin.CreatePembayaran)
	ag.PUT("/pembayaran/:id", admin.UpdatePembayaran)
	ag.DELETE("/pembayaran/:id", admin.DeletePembayaran)
	ag.GET("/menus", admin.ListMenus)

	cg := r.Group("/client")
	cg.Use(middleware.Auth(secret), middleware.Scope("client"))
	cg.GET("/me", client.Me)
	cg.PATCH("/me", client.UpdateMe)
	cg.POST("/me/avatar", client.UploadAvatar)
	cg.PUT("/me/avatar", client.UploadAvatar)
	cg.GET("/orders", client.ListMyOrders)
	cg.POST("/orders", client.CreateOrder)
	cg.PUT("/orders/:id", client.UpdateOrderQuantity)
	cg.DELETE("/orders/:id", client.DeleteOrder)
	cg.POST("/roblox_accounts", client.CreateRobloxAccount)
	cg.POST("/finalize", client.FinalizePayment)
	cg.GET("/orders/header/:id/items", client.GetOrderHeaderItems)

	return r
}
