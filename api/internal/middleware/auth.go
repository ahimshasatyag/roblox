package middleware

import (
	"strings"
	"net/http"
	"github.com/gin-gonic/gin"
	"api/internal/auth"
)

func Auth(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if !strings.HasPrefix(h, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		t := strings.TrimPrefix(h, "Bearer ")
		claims, err := auth.ParseToken(secret, t)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_token"})
			return
		}
		c.Set("claims", claims)
		c.Next()
	}
}

func Scope(expected string) gin.HandlerFunc {
	return func(c *gin.Context) {
		v, ok := c.Get("claims")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		claims := v.(*auth.Claims)
		if claims.Scope != expected {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.Next()
	}
}
