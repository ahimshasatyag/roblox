-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: roblox
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `menu_admin`
--

DROP TABLE IF EXISTS `menu_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_admin` (
  `id_menu` varchar(30) NOT NULL,
  `nm_menu` varchar(100) DEFAULT NULL,
  `id_parent` varchar(30) DEFAULT NULL,
  `no_urut` int DEFAULT NULL,
  `nm_folder` varchar(100) DEFAULT NULL,
  `nm_icon` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_menu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_admin`
--

LOCK TABLES `menu_admin` WRITE;
/*!40000 ALTER TABLE `menu_admin` DISABLE KEYS */;
INSERT INTO `menu_admin` VALUES ('101','Dashboard','0',1,'#','fas fa-th-large'),('102','Administrator','0',2,'#','fas fa-user-circle'),('10201','Users','102',1,'users',NULL),('10202','User Roles','102',2,'userroles',NULL),('103','Products','0',3,'#','fas fa-window-maximize'),('10301','Products','103',1,'products',NULL),('10302','Robux','103',2,'robux',NULL);
/*!40000 ALTER TABLE `menu_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `icon` varchar(50) DEFAULT 'Bell',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'Robux Updated','[System] Updated package ID 1 to: 80 Robux, 12000.00','Package',1,'2026-05-13 08:39:16'),(2,'Robux Updated','[admin] Updated package ID 1 to: 80 Robux, 15000.00','Package',1,'2026-05-13 08:47:50'),(3,'Robux Updated','[admin] Updated package to: 80 Robux, 13000.00','Package',1,'2026-05-13 08:52:20');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_headers`
--

DROP TABLE IF EXISTS `order_headers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_headers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `roblox_account_id` bigint unsigned NOT NULL,
  `invoice_number` varchar(100) NOT NULL,
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('draft','belum_bayar','gagal','success') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `fk_order_headers_order` (`order_id`),
  KEY `fk_order_headers_roblox_account` (`roblox_account_id`),
  CONSTRAINT `fk_order_headers_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_headers_roblox_account` FOREIGN KEY (`roblox_account_id`) REFERENCES `roblox_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_headers`
--

LOCK TABLES `order_headers` WRITE;
/*!40000 ALTER TABLE `order_headers` DISABLE KEYS */;
INSERT INTO `order_headers` VALUES (2,13,13,'INV-05052026-00002',16500.00,'2026-05-05 08:58:00','2026-05-05 08:58:00',NULL),(8,25,25,'INV-052026-00002',184800.00,'2026-05-07 03:19:40','2026-05-07 03:19:40',NULL),(9,27,27,'INV-052026-00003',631400.00,'2026-05-07 04:13:18','2026-05-08 04:18:11','gagal'),(10,30,31,'INV-052026-00004',280500.00,'2026-05-07 04:32:04','2026-05-08 04:33:11','gagal'),(11,34,34,'INV-052026-00005',16500.00,'2026-05-07 05:02:54','2026-05-08 05:03:11','gagal'),(12,35,35,'INV-052026-00006',380600.00,'2026-05-08 02:47:08','2026-05-11 01:40:52','gagal'),(13,37,37,'INV-052026-00007',26400.00,'2026-05-12 07:53:33','2026-05-13 07:56:08','gagal'),(14,39,39,'INV-052026-00008',272250.00,'2026-05-13 03:46:16','2026-05-13 03:46:16','belum_bayar');
/*!40000 ALTER TABLE `order_headers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_name` varchar(255) NOT NULL,
  `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` int NOT NULL DEFAULT '1',
  `total` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_account_id` int NOT NULL,
  `order_header_id` bigint unsigned DEFAULT NULL,
  `pembayaran_id` bigint unsigned DEFAULT NULL,
  `robuxes_id` bigint unsigned DEFAULT NULL,
  `id_product_items` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_pembayaran` (`pembayaran_id`),
  KEY `fk_orders_robuxes` (`robuxes_id`),
  KEY `fk_orders_order_header` (`order_header_id`),
  KEY `fk_orders_user_accounts` (`user_account_id`),
  KEY `fk_order_product` (`id_product_items`),
  CONSTRAINT `fk_order_product` FOREIGN KEY (`id_product_items`) REFERENCES `product_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orders_order_header` FOREIGN KEY (`order_header_id`) REFERENCES `order_headers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_pembayaran` FOREIGN KEY (`pembayaran_id`) REFERENCES `pembayaran` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_robuxes` FOREIGN KEY (`robuxes_id`) REFERENCES `robuxes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_user_accounts` FOREIGN KEY (`user_account_id`) REFERENCES `user_accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (13,'Top Up Robux 80','2026-05-05 15:57:04',1,15000.00,'2026-05-05 08:57:04','2026-05-05 08:57:59',5,NULL,NULL,NULL,NULL),(25,'Top Up Robux 240','2026-05-07 10:18:55',4,168000.00,'2026-05-07 03:18:55','2026-05-07 03:19:40',1,8,2,3,NULL),(27,'Top Up Robux 2000','2026-05-07 11:05:21',2,574000.00,'2026-05-07 04:05:21','2026-05-07 04:13:18',1,9,3,7,NULL),(30,'Top Up Robux 320','2026-05-07 11:30:47',2,120000.00,'2026-05-07 04:30:47','2026-05-07 04:32:04',1,10,4,4,NULL),(31,'Top Up Robux 320','2026-05-07 11:30:55',2,120000.00,'2026-05-07 04:30:55','2026-05-07 04:32:04',1,10,4,4,NULL),(32,'Top Up Robux 80','2026-05-07 11:31:48',1,15000.00,'2026-05-07 04:31:48','2026-05-07 04:32:04',1,10,4,1,NULL),(34,'Top Up Robux 80','2026-05-07 12:02:16',1,15000.00,'2026-05-07 05:02:16','2026-05-07 05:02:54',1,11,3,1,NULL),(35,'Top Up Robux 160','2026-05-08 09:46:23',2,60000.00,'2026-05-08 02:46:23','2026-05-08 02:47:08',1,12,7,2,NULL),(36,'Top Up Robux 1000','2026-05-08 09:46:38',2,286000.00,'2026-05-08 02:46:38','2026-05-08 02:47:08',1,12,7,6,NULL),(37,'100 Emblems','2026-05-12 14:22:24',1,8000.00,'2026-05-12 07:22:24','2026-05-12 07:53:33',1,13,2,NULL,5),(38,'100 Emblems','2026-05-12 14:33:15',2,16000.00,'2026-05-12 07:33:15','2026-05-12 07:53:33',1,13,2,NULL,5),(39,'Violence District','2026-05-13 10:29:18',2,110000.00,'2026-05-13 03:29:18','2026-05-13 03:46:16',1,14,5,NULL,2),(40,'Violence District','2026-05-13 10:36:48',1,27500.00,'2026-05-13 03:36:48','2026-05-13 03:46:16',1,14,5,NULL,3),(41,'2000 Emblems','2026-05-13 10:45:34',1,110000.00,'2026-05-13 03:45:34','2026-05-13 03:46:16',1,14,5,NULL,1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `metode_pembayaran` varchar(100) NOT NULL,
  `akun` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'QRIS','C:UsersIMBA PCDocumentsNext.js\robloxwebpublicimagespembayaranarcode.jpg','2026-02-13 08:15:01','2026-02-13 08:15:01'),(2,'E-Wallet','081234567890','2026-02-13 08:15:01','2026-02-13 08:15:01'),(3,'Transfer Bank','1234567890','2026-02-13 08:15:01','2026-02-13 08:15:01');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pembayaran`
--

DROP TABLE IF EXISTS `pembayaran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pembayaran` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_payment_method_id` bigint unsigned NOT NULL,
  `nama_pembayaran` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pembayaran_payment_method` (`parent_payment_method_id`),
  CONSTRAINT `fk_pembayaran_payment_method` FOREIGN KEY (`parent_payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pembayaran`
--

LOCK TABLES `pembayaran` WRITE;
/*!40000 ALTER TABLE `pembayaran` DISABLE KEYS */;
INSERT INTO `pembayaran` VALUES (1,3,'BCA','2026-02-13 08:20:32','2026-02-13 08:20:32'),(2,3,'Mandiri','2026-02-13 08:20:32','2026-02-13 08:20:32'),(3,3,'BNI','2026-02-13 08:20:32','2026-02-13 08:20:32'),(4,3,'BRI','2026-02-13 08:20:32','2026-02-13 08:20:32'),(5,2,'ShopeePay','2026-02-13 08:20:32','2026-02-13 08:20:32'),(6,2,'Gopay','2026-02-13 08:20:32','2026-02-13 08:20:32'),(7,1,'QRIS','2026-02-13 08:20:32','2026-02-13 08:20:32');
/*!40000 ALTER TABLE `pembayaran` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_items`
--

DROP TABLE IF EXISTS `product_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_product` bigint unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_id_product` (`id_product`),
  CONSTRAINT `fk_product_items_product` FOREIGN KEY (`id_product`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_items`
--

LOCK TABLES `product_items` WRITE;
/*!40000 ALTER TABLE `product_items` DISABLE KEYS */;
INSERT INTO `product_items` VALUES (1,7,'2000 Emblems',110000,NULL,NULL),(2,7,'1000 Emblems',55000,NULL,NULL),(3,7,'500 Emblems',27500,NULL,NULL),(4,7,'250 Emblems',14000,NULL,NULL),(5,7,'100 Emblems',8000,NULL,NULL),(6,7,'15.000 Screw',49500,NULL,NULL),(7,7,'7.500 Screw',25000,NULL,NULL),(8,7,'2.500 Screw',9000,NULL,NULL),(9,7,'1000 Ornaments',98000,NULL,NULL),(10,7,'500 Ornaments',49000,NULL,NULL),(11,7,'250 Ornaments',24000,NULL,NULL),(12,7,'100 Ornaments',10000,NULL,NULL),(13,7,'VIP Pass',88000,NULL,NULL),(14,7,'2x Emote',24000,NULL,NULL),(15,7,'15 Sin',18000,NULL,NULL);
/*!40000 ALTER TABLE `product_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `starting_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Combat Warrior',19900.00,'C:\\Users\\IMBA PC\\Documents\\Next.js\\roblox\\web\\public\\images\\produk\\combat.jpg','2026-02-12 04:19:20','2026-02-12 04:19:20'),(2,'Evade',15000.00,'C:\\Users\\IMBA PC\\Documents\\Next.js\\roblox\\web\\public\\images\\produk\\evade.jpg','2026-02-12 04:19:20','2026-02-12 04:19:20'),(3,'Fisch',14900.00,'C:\\Users\\IMBA PC\\Documents\\Next.js\\roblox\\web\\public\\images\\produk\\fisch.jpg','2026-02-12 04:19:20','2026-02-12 04:19:20'),(4,'Fish It',10000.00,'C:\\Users\\IMBA PC\\Documents\\Next.js\\roblox\\web\\public\\images\\produk\\fishIt.jpg','2026-02-12 04:19:20','2026-02-12 04:19:20'),(5,'The Forge',10000.00,'C:\\Users\\IMBA PC\\Documents\\Next.js\\roblox\\web\\public\\images\\produk\\theForge.jpg','2026-02-12 04:19:20','2026-02-12 04:19:20'),(6,'Climb and Jump Tower',11900.00,'C:\\Users\\IMBA PC\\Documents\\Next.js\\roblox\\web\\public\\images\\produk\\tower.jpg','2026-02-12 04:19:20','2026-02-12 04:19:20'),(7,'Violence District',15000.00,'C:\\Users\\IMBA PC\\Documents\\Next.js\\roblox\\web\\public\\images\\produk\\vd.jpg','2026-02-12 04:19:20','2026-02-12 04:19:20');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roblox_accounts`
--

DROP TABLE IF EXISTS `roblox_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roblox_accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_roblox_accounts_order` (`order_id`),
  CONSTRAINT `fk_roblox_accounts_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roblox_accounts`
--

LOCK TABLES `roblox_accounts` WRITE;
/*!40000 ALTER TABLE `roblox_accounts` DISABLE KEYS */;
INSERT INTO `roblox_accounts` VALUES (13,13,'testuser','testpassword','081234567890','debug_user@example.com','2026-05-05 08:57:04','2026-05-05 08:57:59'),(25,25,'Ahimsha','Ahimsha123','081226641337','ahimshasatyag@gmail.com','2026-05-07 03:18:55','2026-05-07 03:19:40'),(27,27,'Ahimsha','Ahimsha123','081226641337','ahimshasatyag@gmail.com','2026-05-07 04:05:21','2026-05-07 04:13:18'),(30,31,'Ahimsha','Ahimsha123','081226641337','ahimshasatyag@gmail.com','2026-05-07 04:31:02','2026-05-07 04:32:04'),(31,30,'Ahimsha','Ahimsha123','081226641337','ahimshasatyag@gmail.com','2026-05-07 04:31:02','2026-05-07 04:32:04'),(32,32,'Ahimsha','Ahimsha123','081226641337','ahimshasatyag@gmail.com','2026-05-07 04:31:48','2026-05-07 04:32:04'),(34,34,'Ahimsha','Ahimsha123','081226641337','ahimshasatyag@gmail.com','2026-05-07 05:02:16','2026-05-07 05:02:16'),(35,35,'Ahimsha','Ahimsha123','081226641337','ahimshasatyag@gmail.com','2026-05-08 02:46:23','2026-05-08 02:46:23'),(36,36,'Ahimsha','Ahimsha123','081226641337','ahimshasatyag@gmail.com','2026-05-08 02:46:38','2026-05-08 02:46:38'),(37,37,'crowyth','','081226641337','ahimshasatyag@gmail.com','2026-05-12 07:22:24','2026-05-12 07:22:24'),(38,38,'crowyth','','081226641337','ahimshasatyag@gmail.com','2026-05-12 07:33:15','2026-05-12 07:33:15'),(39,39,'crowyth','','081226641337','ahimshasatyag@gmail.com','2026-05-13 03:29:18','2026-05-13 03:29:18'),(40,40,'crowyth','','081226641337','ahimshasatyag@gmail.com','2026-05-13 03:36:48','2026-05-13 03:36:48'),(41,41,'crowyth','','081226641338','ahimshasatyag@gmail.com','2026-05-13 03:45:34','2026-05-13 03:45:34');
/*!40000 ALTER TABLE `roblox_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `robuxes`
--

DROP TABLE IF EXISTS `robuxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `robuxes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `robux_amount` int NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `robuxes`
--

LOCK TABLES `robuxes` WRITE;
/*!40000 ALTER TABLE `robuxes` DISABLE KEYS */;
INSERT INTO `robuxes` VALUES (1,80,13000.00,'2026-02-12 06:54:57','2026-05-13 08:52:19'),(2,160,30000.00,'2026-02-12 06:54:57','2026-02-12 06:54:57'),(3,240,42000.00,'2026-02-12 06:54:57','2026-02-12 06:54:57'),(4,320,60000.00,'2026-02-12 06:54:57','2026-02-12 06:54:57'),(5,500,75000.00,'2026-02-12 06:54:57','2026-02-12 06:54:57'),(6,1000,143000.00,'2026-02-12 06:54:57','2026-02-12 06:54:57'),(7,2000,287000.00,'2026-02-12 06:54:57','2026-02-12 06:54:57');
/*!40000 ALTER TABLE `robuxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_accounts`
--

DROP TABLE IF EXISTS `user_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT '3',
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pic` varchar(255) DEFAULT NULL,
  `no_hp` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_user_accounts_role` (`role_id`),
  CONSTRAINT `fk_user_accounts_role` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_accounts`
--

LOCK TABLES `user_accounts` WRITE;
/*!40000 ALTER TABLE `user_accounts` DISABLE KEYS */;
INSERT INTO `user_accounts` VALUES (1,3,'Ahimsha','ahimshasatyag@gmail.com','$2a$10$CnYzM6MTZXuBASgirDwKyexEysp71Zb61xZ85Ix2fDJgn96QueBUS',1,'2026-02-10 03:16:40','/uploads/avatars/avatar_1777948890579286000.png','081226641337'),(2,3,'Naufal','naufal@gmail.com','$2a$10$PoAuVsobZQhVmOlrZgcrHeNh7WDHM62/pwOSR3.4L9MUdKid1Fh.m',1,'2026-05-05 03:51:07',NULL,NULL),(3,3,'Test User','test@example.com','$2a$10$4IQVTEHqrme.jHPUwP1YA.n0.i.WIXK1Qjkx7VD6Z/Fp9Dq7JMQwC',1,'2026-05-05 08:51:14',NULL,NULL),(4,3,'Test Four','test4@example.com','$2a$10$9KHKqash/DMyFLD8qnzRZeSlWRT8POFP34pxUtjnM9lEdz7ze.rWG',1,'2026-05-05 08:51:54',NULL,NULL),(5,3,'Debug User','debug_user@example.com','$2a$10$7SBIVZy/VagvD8XQziIBxOtmhakl8NUJ/VVzXW43I7ovlL0ye4BL2',1,'2026-05-05 08:54:29',NULL,NULL);
/*!40000 ALTER TABLE `user_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (3,'Customer'),(2,'Staff IT'),(1,'Super Admin');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `fullname` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'Super Admin','admin','$2a$10$agqEOGs61cXgh44SNJVs4eQh8wGhj9dEH.Dlli6wT9R7WKfvitLAG','2026-05-08 04:40:21','admin@gmail.com'),(2,2,'Ahimsha Satya Graha','ahimshasatyag','$2a$10$hXUDR4cQl7hSpGmSS.CoJ.NZYXIqhre/r.ZwxqB.0KtQY1JmKT6JO','2026-05-11 03:33:58','ahimshasatyag@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'roblox'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-13 16:45:32
