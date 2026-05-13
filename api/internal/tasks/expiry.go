package tasks

import (
	"log"
	"time"

	"github.com/jmoiron/sqlx"
)

func StartExpiryTask(db *sqlx.DB) {
	log.Println("Starting background task: order expiry...")
	go func() {
		// Initial run
		expireOrders(db)
		cleanupNotifications(db)
		
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		
		for range ticker.C {
			expireOrders(db)
			cleanupNotifications(db)
		}
	}()
}

func expireOrders(db *sqlx.DB) {
	res, err := db.Exec("UPDATE order_headers SET status = 'gagal' WHERE status = 'belum_bayar' AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)")
	if err != nil {
		log.Printf("[Expiry Task] Error updating expired orders: %v", err)
		return
	}
	
	affected, _ := res.RowsAffected()
	if affected > 0 {
		log.Printf("[Expiry Task] Updated %d expired orders to 'gagal'", affected)
	}
}

func cleanupNotifications(db *sqlx.DB) {
	res, err := db.Exec("DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 5 DAY)")
	if err != nil {
		log.Printf("[Cleanup Task] Error cleaning up old notifications: %v", err)
		return
	}
	
	affected, _ := res.RowsAffected()
	if affected > 0 {
		log.Printf("[Cleanup Task] Deleted %d notifications older than 5 days", affected)
	}
}
