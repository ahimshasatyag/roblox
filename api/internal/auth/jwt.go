package auth

import (
	"time"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	ID    int    `json:"id"`
	Scope string `json:"scope"`
	Username string `json:"username"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func GenerateToken(secret string, id int, scope string, username string, email string, ttl time.Duration) (string, error) {
	c := Claims{
		ID:    id,
		Scope: scope,
		Username: username,
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "roblox-api",
			Subject:   scope,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	return token.SignedString([]byte(secret))
}

func ParseToken(secret string, tokenString string) (*Claims, error) {
	tkn, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := tkn.Claims.(*Claims); ok && tkn.Valid {
		return claims, nil
	}
	return nil, jwt.ErrTokenInvalidClaims
}
