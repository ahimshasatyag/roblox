package main

import (
	"api/internal/db"
	"api/internal/server"
	"api/internal/tasks"
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		host := os.Getenv("DB_HOST")
		if host == "" {
			host = "127.0.0.1"
		}
		port := os.Getenv("DB_PORT")
		if port == "" {
			port = "3306"
		}
		user := os.Getenv("DB_USER")
		if user == "" {
			user = "root"
		}
		pass := os.Getenv("DB_PASS")
		name := os.Getenv("DB_NAME")
		if name == "" {
			name = "roblox"
		}
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&loc=Local", user, pass, host, port, name)
	}
	secret := os.Getenv("JWT_SECRET")
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	conn, err := db.New(dsn)
	if err != nil {
		time.Sleep(time.Second)
		panic(err)
	}
	tasks.StartExpiryTask(conn)
	r := server.SetupRouter(conn, secret)
	r.Run(":" + port)
}
