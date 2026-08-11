-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: inventory_management
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `asset_assignment`
--

DROP TABLE IF EXISTS `asset_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_assignment` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `inventory_id` int NOT NULL,
  `user_id` int NOT NULL,
  `quantity` int NOT NULL,
  `assigned_by` int NOT NULL,
  `assigned_date` date NOT NULL,
  `remarks` text,
  `status` tinyint DEFAULT '1',
  `is_deleted` enum('yes','no') NOT NULL DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assignment_id`),
  KEY `fk_assignment_inventory_idx` (`inventory_id`),
  KEY `fk_asset_assignment_users1_idx` (`user_id`),
  KEY `fk_asset_assignment_users1_idx1` (`assigned_by`),
  CONSTRAINT `fk_assignment_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_assignment_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_assignment_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_assignment`
--

LOCK TABLES `asset_assignment` WRITE;
/*!40000 ALTER TABLE `asset_assignment` DISABLE KEYS */;
INSERT INTO `asset_assignment` VALUES (1,2,4,3,3,'2026-08-02','Updated Assignment',1,'yes','2026-08-01 16:42:00'),(2,2,4,7,3,'2026-08-02','Testing transfer module',1,'no','2026-08-02 08:13:37'),(3,2,5,0,3,'2026-08-02','Assignment for transfer testing',1,'yes','2026-08-02 08:40:48'),(4,2,5,1,3,'2026-08-05',NULL,1,'no','2026-08-04 19:39:14'),(5,2,7,1,3,'2026-08-06','testing',1,'no','2026-08-06 16:44:27'),(6,2,3,0,3,'2026-08-06','testing assignment to self',1,'yes','2026-08-06 18:23:41'),(7,2,3,0,3,'2026-08-07','testing',1,'yes','2026-08-06 19:06:46'),(8,3,10,5,11,'2026-08-07','testing cross group transfers',1,'no','2026-08-07 09:42:56'),(9,3,11,0,11,'2026-08-07',NULL,1,'yes','2026-08-07 09:43:18'),(10,3,7,0,3,'2026-08-07','Transfer completed',1,'yes','2026-08-07 10:36:11'),(11,4,7,1,3,'2026-08-09',NULL,1,'no','2026-08-08 19:29:51'),(12,4,10,1,11,'2026-08-09','Transfer completed',1,'no','2026-08-08 19:33:26'),(13,5,3,0,3,'2026-08-09',NULL,1,'yes','2026-08-09 12:10:05'),(14,4,3,2,3,'2026-08-09',NULL,1,'no','2026-08-09 12:26:36'),(15,2,3,1,3,'2026-08-09',NULL,1,'no','2026-08-09 12:26:55'),(16,3,12,4,11,'2026-08-09',NULL,1,'no','2026-08-09 12:30:51'),(17,3,11,1,11,'2026-08-09',NULL,1,'no','2026-08-09 12:38:20');
/*!40000 ALTER TABLE `asset_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_disposal`
--

DROP TABLE IF EXISTS `asset_disposal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_disposal` (
  `disposal_id` int NOT NULL AUTO_INCREMENT,
  `assignment_id` int NOT NULL,
  `disposed_by` int NOT NULL,
  `quantity` int NOT NULL,
  `reason` text,
  `is_deleted` enum('yes','no') NOT NULL DEFAULT 'no',
  `remarks` text,
  `disposed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`disposal_id`),
  KEY `fk_disposal_assignment_idx` (`assignment_id`),
  KEY `fk_disposal_requests_users1_idx` (`disposed_by`),
  CONSTRAINT `fk_disposal_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `asset_assignment` (`assignment_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_disposal_requested_by` FOREIGN KEY (`disposed_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_disposal`
--

LOCK TABLES `asset_disposal` WRITE;
/*!40000 ALTER TABLE `asset_disposal` DISABLE KEYS */;
INSERT INTO `asset_disposal` VALUES (1,3,5,1,'Damaged','no','Testing disposal module','2026-08-02 15:30:12'),(2,5,7,1,'Damaged','no','testing disposal','2026-08-06 16:45:15'),(3,7,3,1,'Damaged','no','t5','2026-08-06 19:39:18'),(4,6,3,1,'Damaged','no','t6','2026-08-06 19:39:37'),(5,6,3,1,'Damaged','no','t7','2026-08-06 19:40:11'),(6,9,11,1,'Damaged','no','testing logic','2026-08-07 09:44:05'),(7,11,7,3,'Damaged','no','received damaged products','2026-08-08 19:30:59'),(8,13,3,1,'Damaged','no','disposal','2026-08-09 12:10:25');
/*!40000 ALTER TABLE `asset_disposal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_history`
--

DROP TABLE IF EXISTS `asset_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `inventory_id` int NOT NULL,
  `performed_by` int NOT NULL,
  `action` enum('RECEIVED','ASSIGNED','TRANSFERRED','DISPOSED','UPDATED','CANCELLED','REJECTED') NOT NULL,
  `quantity` int NOT NULL,
  `reference_table` varchar(50) DEFAULT NULL,
  `reference_id` int DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `fk_asset_history_inventory1_idx` (`inventory_id`),
  KEY `fk_asset_history_users1_idx` (`performed_by`),
  CONSTRAINT `fk_history_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_performed_by_id` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_history`
--

LOCK TABLES `asset_history` WRITE;
/*!40000 ALTER TABLE `asset_history` DISABLE KEYS */;
INSERT INTO `asset_history` VALUES (1,2,3,'TRANSFERRED',2,'transfer_requests',1,'Asset transferred successfully','2026-08-02 10:26:49'),(2,2,3,'REJECTED',1,'transfer_requests',2,'Transfer request rejected','2026-08-02 10:38:34'),(3,2,5,'DISPOSED',1,'asset_disposal',1,'Testing disposal module','2026-08-02 15:30:12'),(4,2,3,'REJECTED',1,'transfer_requests',3,'Transfer request rejected','2026-08-05 08:16:10'),(5,2,7,'DISPOSED',1,'asset_disposal',2,'testing disposal','2026-08-06 16:45:15'),(6,2,3,'DISPOSED',1,'asset_disposal',3,'t5','2026-08-06 19:39:18'),(7,2,3,'DISPOSED',1,'asset_disposal',4,'t6','2026-08-06 19:39:37'),(8,2,3,'DISPOSED',1,'asset_disposal',5,'t7','2026-08-06 19:40:11'),(9,3,11,'DISPOSED',1,'asset_disposal',6,'testing logic','2026-08-07 09:44:05'),(10,3,3,'TRANSFERRED',1,'transfer_requests',9,'Asset transferred successfully','2026-08-07 10:36:11'),(11,4,7,'DISPOSED',3,'asset_disposal',7,'received damaged products','2026-08-08 19:30:59'),(12,4,11,'TRANSFERRED',1,'transfer_requests',11,'Asset transferred successfully','2026-08-08 19:33:26'),(13,3,7,'TRANSFERRED',1,'transfer_requests',12,'Asset transferred successfully','2026-08-08 19:51:24'),(14,3,10,'RECEIVED',1,'transfer_requests',12,'Asset received through transfer','2026-08-08 19:51:24'),(15,3,3,'TRANSFERRED',1,'transfer_requests',12,'Transfer completed from group','2026-08-08 19:51:24'),(16,3,11,'TRANSFERRED',1,'transfer_requests',12,'Transfer received into group','2026-08-08 19:51:24'),(17,5,3,'DISPOSED',1,'asset_disposal',8,'disposal','2026-08-09 12:10:25');
/*!40000 ALTER TABLE `asset_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `asset_id` int NOT NULL AUTO_INCREMENT,
  `asset_name` varchar(150) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `description` text,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` enum('yes','no') NOT NULL DEFAULT 'no',
  PRIMARY KEY (`asset_id`),
  UNIQUE KEY `uq_asset_name` (`asset_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'Laptop','Pieces','Dell Latitude 5420 - Updated',1,'2026-07-31 08:47:47','yes'),(2,'Keyboard','Pieces','Mechanical Keyboard',1,'2026-08-01 12:46:02','no'),(3,'Dell Laptop','Nos.',NULL,1,'2026-08-09 18:55:20','no'),(4,'Portronics Keyboard','Nos.',NULL,1,'2026-08-10 19:30:47','no');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cadres`
--

DROP TABLE IF EXISTS `cadres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cadres` (
  `cadre_id` int NOT NULL AUTO_INCREMENT,
  `cadre_name` varchar(100) NOT NULL,
  `description` text,
  `status` tinyint DEFAULT '1',
  PRIMARY KEY (`cadre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cadres`
--

LOCK TABLES `cadres` WRITE;
/*!40000 ALTER TABLE `cadres` DISABLE KEYS */;
INSERT INTO `cadres` VALUES (1,'Scientist','Scientific Staff',1),(2,'Technical','Technical Staff',1),(3,'Administrative','Administrative Staff',1),(4,'Contractual','Contract Employees',1),(5,'ABC','Dummy cadre',1);
/*!40000 ALTER TABLE `cadres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designations`
--

DROP TABLE IF EXISTS `designations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designations` (
  `desig_id` int NOT NULL AUTO_INCREMENT,
  `designation_name` varchar(100) NOT NULL,
  `description` text,
  `status` tinyint DEFAULT '1',
  PRIMARY KEY (`desig_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designations`
--

LOCK TABLES `designations` WRITE;
/*!40000 ALTER TABLE `designations` DISABLE KEYS */;
INSERT INTO `designations` VALUES (1,'Scientist C','Scientist Grade C',1),(2,'Scientist D','Scientist Grade D',1),(3,'Senior Technician','Senior Technical Staff',1),(4,'Assistant','Administrative Assistant',1),(5,'XYZ','Dummy designation',1),(6,'PQR','Dummy designation',1),(7,'IJK','Dummy designation',1);
/*!40000 ALTER TABLE `designations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) NOT NULL,
  `description` text,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` enum('yes','no') NOT NULL DEFAULT 'no',
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'IT Department','Handles all IT assets',1,'2026-07-29 16:08:20','yes'),(2,'Group1','created for testing',1,'2026-08-05 09:45:44','no'),(3,'group2','testing delete feature',1,'2026-08-05 16:39:29','yes'),(4,'Group2','created for testing cross group transfers',1,'2026-08-07 08:39:55','no');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internal_designations`
--

DROP TABLE IF EXISTS `internal_designations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internal_designations` (
  `internal_desig_id` int NOT NULL AUTO_INCREMENT,
  `designation_name` varchar(100) NOT NULL,
  `description` text,
  `status` tinyint DEFAULT '1',
  PRIMARY KEY (`internal_desig_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internal_designations`
--

LOCK TABLES `internal_designations` WRITE;
/*!40000 ALTER TABLE `internal_designations` DISABLE KEYS */;
INSERT INTO `internal_designations` VALUES (1,'Inventory Holder','Responsible for inventory management',1),(2,'Store Incharge','Responsible for store management',1),(3,'Lab Incharge','Responsible for laboratory inventory',1),(4,'Project Lead','Project management role',1),(5,'Administrative','Administrative role purpose',1),(6,'Inventory Management','Inventory management role purpose',1),(7,'General User','General user role purpose',1);
/*!40000 ALTER TABLE `internal_designations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int DEFAULT NULL,
  `sr_no` int NOT NULL,
  `ledger_number` varchar(50) DEFAULT NULL,
  `quantity_received` int NOT NULL DEFAULT '0',
  `quantity_available` int NOT NULL DEFAULT '0',
  `unit` varchar(20) NOT NULL DEFAULT 'Nos.',
  `purchase_cost` decimal(12,2) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `received_by` int DEFAULT NULL,
  `remarks` text,
  `status` tinyint DEFAULT '1',
  `is_deleted` enum('yes','no') NOT NULL DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity_disposed` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`inventory_id`),
  KEY `fk_inventory_assets1_idx` (`asset_id`),
  KEY `fk_inventory_received_by_idx` (`received_by`),
  CONSTRAINT `fk_inventory_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_inventory_received_by` FOREIGN KEY (`received_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,2,2,'LED-002-UPDATED',30,30,'Nos.',60000.00,'2026-08-02',3,'Updated purchase',1,'yes','2026-08-01 12:46:20',0),(2,2,1,'LED-001',20,0,'Nos.',45000.00,'2026-08-01',3,'Dell purchase',1,'no','2026-08-01 16:31:46',5),(3,2,2,'LED-004',20,8,'Nos.',750000.00,'2026-08-07',11,NULL,1,'no','2026-08-07 09:24:44',1),(4,2,5,'LED-005',30,20,'Nos.',4000.00,'2026-08-09',3,NULL,1,'no','2026-08-08 19:29:18',3),(5,2,3,'LED-006',2,1,'Nos.',5000.00,'2026-08-09',3,NULL,1,'no','2026-08-09 12:09:37',1),(6,3,6,'LED-121',15,15,'Nos.',1075000.00,'2026-08-10',3,NULL,1,'no','2026-08-09 18:55:20',0),(7,4,10,'LED-010',10,10,'piece',10000.00,'2026-08-11',3,NULL,1,'no','2026-08-10 19:30:47',0);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `receiver_id` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `fk_notification_receiver_idx` (`receiver_id`),
  CONSTRAINT `fk_notifications_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,5,'Testing','Notification module test.',1,'2026-08-02 17:21:47'),(2,5,'Asset Assigned','You have been assigned 1 Keyboard(s).',0,'2026-08-04 19:39:14'),(3,3,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-05 07:41:11'),(4,5,'Transfer Rejected','Your transfer request has been rejected.',0,'2026-08-05 08:16:10'),(5,3,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-05 08:18:46'),(6,3,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-05 08:42:52'),(7,5,'Transfer Approved','Your transfer request has been approved and completed.',0,'2026-08-05 08:43:16'),(8,3,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-05 08:48:36'),(9,5,'Transfer Approved','Your transfer request has been approved and completed.',0,'2026-08-05 08:49:14'),(10,3,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-05 08:54:13'),(11,5,'Transfer Approved','Your transfer request has been approved and completed.',0,'2026-08-05 08:54:31'),(12,7,'Asset Assigned','You have been assigned 2 Keyboard(s).',1,'2026-08-06 16:44:27'),(13,3,'Asset Assigned','You have been assigned 2 Keyboard(s).',1,'2026-08-06 18:23:41'),(14,3,'Asset Assigned','You have been assigned 1 Keyboard(s).',1,'2026-08-06 19:06:46'),(15,10,'Asset Assigned','You have been assigned 5 Keyboard(s).',0,'2026-08-07 09:42:56'),(16,11,'Asset Assigned','You have been assigned 1 Keyboard(s).',1,'2026-08-07 09:43:18'),(17,11,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-07 10:03:42'),(18,11,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-07 10:23:23'),(19,10,'Transfer Approved','Source Inventory Holder approved your request. Waiting for Destination Inventory Holder approval.',0,'2026-08-07 10:25:29'),(20,10,'Transfer Completed','Your transfer request has been completed successfully.',0,'2026-08-07 10:36:11'),(21,3,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-07 10:39:15'),(22,7,'Transfer Approved','Source Inventory Holder approved your request. Waiting for Destination Inventory Holder approval.',1,'2026-08-07 10:39:33'),(23,7,'Asset Assigned','You have been assigned 5 Keyboard(s).',1,'2026-08-08 19:29:51'),(24,3,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-08 19:32:08'),(25,7,'Transfer Approved','Source Inventory Holder approved your request. Waiting for Destination Inventory Holder approval.',1,'2026-08-08 19:32:57'),(26,7,'Transfer Completed','Your transfer request has been completed successfully.',1,'2026-08-08 19:33:26'),(27,3,'Transfer Request','A new transfer request requires your approval.',1,'2026-08-08 19:50:36'),(28,7,'Transfer Approved','Source Inventory Holder approved your request. Waiting for Destination Inventory Holder approval.',1,'2026-08-08 19:51:01'),(29,7,'Transfer Completed','Your transfer request has been completed successfully.',1,'2026-08-08 19:51:24'),(30,3,'Asset Assigned','You have been assigned 1 Keyboard(s).',1,'2026-08-09 12:10:05'),(31,3,'Asset Assigned','You have been assigned 2 Keyboard(s).',1,'2026-08-09 12:26:36'),(32,3,'Asset Assigned','You have been assigned 1 Keyboard(s).',1,'2026-08-09 12:26:55'),(33,12,'Asset Assigned','You have been assigned 4 Keyboard(s).',1,'2026-08-09 12:30:51'),(34,11,'Asset Assigned','You have been assigned 1 Keyboard(s).',0,'2026-08-09 12:38:20');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transfer_requests`
--

DROP TABLE IF EXISTS `transfer_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfer_requests` (
  `transfer_request_id` int NOT NULL AUTO_INCREMENT,
  `assignment_id` int NOT NULL,
  `requested_by` int NOT NULL,
  `to_user` int NOT NULL,
  `quantity` int NOT NULL,
  `same_group_transfer` enum('yes','no') NOT NULL DEFAULT 'no',
  `reason` text,
  `source_holder_status` tinyint DEFAULT NULL,
  `destination_holder_status` tinyint DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `is_deleted` enum('yes','no') NOT NULL DEFAULT 'no',
  `requested_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `source_approved_at` timestamp NULL DEFAULT NULL,
  `destination_approved_at` timestamp NULL DEFAULT NULL,
  `remarks` text,
  PRIMARY KEY (`transfer_request_id`),
  KEY `fk_transfer_assignment_idx` (`assignment_id`),
  KEY `fk_transfer_requested_by_idx` (`requested_by`),
  KEY `fk_transfer_to_user` (`to_user`),
  CONSTRAINT `fk_transfer_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `asset_assignment` (`assignment_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_transfer_requested_by` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_transfer_to_user` FOREIGN KEY (`to_user`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfer_requests`
--

LOCK TABLES `transfer_requests` WRITE;
/*!40000 ALTER TABLE `transfer_requests` DISABLE KEYS */;
INSERT INTO `transfer_requests` VALUES (1,3,5,4,2,'yes','Need this asset for testing',1,1,2,'no','2026-08-02 08:42:34','2026-08-02 09:34:57','2026-08-02 09:34:57',NULL),(2,3,5,4,1,'yes','Testing rejection',NULL,NULL,0,'no','2026-08-02 10:36:53',NULL,NULL,NULL),(3,4,5,4,1,'yes','testing',1,1,0,'no','2026-08-05 07:41:11','2026-08-05 08:16:02','2026-08-05 08:16:02',NULL),(7,4,5,4,1,'yes','testing',1,1,2,'no','2026-08-05 08:54:13','2026-08-05 08:54:31','2026-08-05 08:54:31',NULL),(9,8,10,7,1,'no','testing for cross group transfer',1,1,2,'no','2026-08-07 10:23:23','2026-08-07 10:25:29','2026-08-07 10:36:11',NULL),(11,11,7,10,1,'no','take it mate',1,1,2,'no','2026-08-08 19:32:08','2026-08-08 19:32:57','2026-08-08 19:33:26',NULL),(12,10,7,10,1,'no','rakh le yarr',1,1,2,'no','2026-08-08 19:50:36','2026-08-08 19:51:01','2026-08-08 19:51:24',NULL);
/*!40000 ALTER TABLE `transfer_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(80) DEFAULT NULL,
  `gen` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `mobile_no` varchar(15) DEFAULT NULL,
  `email_id` varchar(100) DEFAULT NULL,
  `cadre_id` int DEFAULT NULL,
  `desig_id` int DEFAULT NULL,
  `internal_desig_id` int DEFAULT NULL,
  `role` enum('ADMIN','INVENTORY_HOLDER','USER') NOT NULL,
  `telephone_no` varchar(11) DEFAULT NULL,
  `user_name` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `is_gazetted` enum('yes','no') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` enum('yes','no') NOT NULL DEFAULT 'no',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_type` enum('permanent','temporary','generic') DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`user_name`),
  UNIQUE KEY `unique_email` (`email_id`),
  KEY `fk_users_groups_idx` (`group_id`),
  KEY `fk_users_cadres_idx` (`cadre_id`),
  KEY `fk_users_designations_idx` (`desig_id`),
  KEY `fk_users_internal_designations_idx` (`internal_desig_id`),
  CONSTRAINT `fk_users_cadres` FOREIGN KEY (`cadre_id`) REFERENCES `cadres` (`cadre_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_users_designations` FOREIGN KEY (`desig_id`) REFERENCES `designations` (`desig_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_users_groups` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_users_internal_designations` FOREIGN KEY (`internal_desig_id`) REFERENCES `internal_designations` (`internal_desig_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System',NULL,'Administrator',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ADMIN',NULL,'admin','$2b$10$FXctleozZLeVAmslpV0AfeBn4QswhV4SK3kBm6FNs6zcF1eoPuZ6O',1,NULL,'2026-07-28 16:37:07','no','2026-07-29 08:05:36',NULL,NULL),(2,'Aditya','','Raj','Male','2005-01-01','9999999999','aditya@example.com',NULL,NULL,NULL,'USER','','aditya','$2b$10$FXctleozZLeVAmslpV0AfeBn4QswhV4SK3kBm6FNs6zcF1eoPuZ6O',1,'no','2026-07-29 08:41:18','yes','2026-08-02 09:24:51','permanent',NULL),(3,'Inventory',NULL,NULL,NULL,NULL,'8642097531','inventory@example.com',2,3,1,'INVENTORY_HOLDER',NULL,'inventoryholder','$2b$10$j2oV5ZXQg8XNM1jqpB8Joe/YnNUKNWJirYXAl28jaG8PZ6gihQq9y',1,NULL,'2026-08-01 13:33:07','no','2026-08-10 21:04:20',NULL,2),(4,'User',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'USER',NULL,'user1','$2b$10$WsLPa8kpMVB5CT0CA07oUOhJhk0ECx/gWnSUnBBL3LahseBjoNfN6',1,NULL,'2026-08-01 16:33:43','no','2026-08-01 16:33:43',NULL,1),(5,'Test',NULL,NULL,NULL,NULL,'9876542130','test@example.com',3,4,2,'USER',NULL,'user2','$2b$10$xZcFu5CE81VAggTAFLnRVuvvMWgieNO/Et6i9TZJxT2CkW/XWhAYK',1,NULL,'2026-08-02 08:34:57','yes','2026-08-06 15:29:06',NULL,2),(7,'user3',NULL,NULL,NULL,NULL,'8887779996','user3@gmail.com',1,2,4,'USER',NULL,'user3A','$2b$10$24jJRJnZL.2PCq.5GTAcyObJsze3ypTuu0W4B4nCW2uKvYkuuTC1C',1,NULL,'2026-08-05 11:00:02','no','2026-08-05 11:00:02',NULL,2),(8,'user4',NULL,NULL,NULL,NULL,'9999988888','user4@example.com',2,4,4,'USER',NULL,'user4A','$2b$10$ZCzYxdC1WkIIXQUQNV14iO.He2uB2XLG8y2DPCIZRNGe.3x6i9zSu',1,NULL,'2026-08-05 17:30:18','yes','2026-08-05 17:31:40',NULL,2),(9,'user4',NULL,NULL,NULL,NULL,'9876543210','user4b@example.com',4,4,2,'USER',NULL,'user4B','$2b$10$rYV4z1p1rVM1MG26mK84AOtpiC3RHp6.MRc3kC3Pxelkq/2v1PRtO',1,NULL,'2026-08-05 17:36:47','yes','2026-08-05 17:42:02',NULL,2),(10,'user4',NULL,NULL,NULL,NULL,'9876501234','user4c@gmail.com',3,4,2,'USER',NULL,'user4C','$2b$10$qKkKzNj4c7AqiYNPjJzyRe/Zu1ffEXybWNoA3EZJfDkK4/56dR11K',1,NULL,'2026-08-07 08:41:30','no','2026-08-07 08:41:30',NULL,4),(11,'IH2',NULL,NULL,NULL,NULL,'7894561230','inventory2@example.com',3,1,1,'INVENTORY_HOLDER',NULL,'inventoryholder2','$2b$10$tEPwZUnJEarUyg4P/Cbw0.GwGgEQKzwx0m/6IpL2LJtdX90Rk6PH6',1,NULL,'2026-08-07 08:43:25','no','2026-08-07 08:43:25',NULL,4),(12,'user5',NULL,NULL,NULL,NULL,'9988776655','user5@example.com',3,2,3,'USER',NULL,'user5A','$2b$10$TDit3IYQNhks4nR.tlD/0uXhCCvC63UDYyWaFSaL48jhc2cj4yhjS',1,NULL,'2026-08-08 17:46:26','no','2026-08-08 17:46:26',NULL,4);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'inventory_management'
--

--
-- Dumping routines for database 'inventory_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-12  1:50:23
