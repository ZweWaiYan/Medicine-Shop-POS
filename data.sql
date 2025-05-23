-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: pharmacy_management
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_code` varchar(50) DEFAULT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_path` varchar(500) DEFAULT NULL,
  `is_expired` tinyint(1) NOT NULL DEFAULT '0',
  `expire_date` date DEFAULT NULL,
  `alert_date` date DEFAULT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` int DEFAULT '0',
  `remark` text,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_code` (`item_code`),
  UNIQUE KEY `bar_code` (`barcode`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'ITEM0001','1234556789','Sayar Kho','Cream',10.99,'/images/b3073e4a-2fe0-4638-a3b7-bce74eb0c523.jpg',0,'2025-12-24','2025-11-24','2025-02-03 15:45:29',100,'test'),(8,'ITEM0003','123455610011','Vitamin C','Capsule',10.99,'/images/8d1b18c2-44c8-4cce-ab86-7e95ac3e35fe.jpg',0,'2025-12-05','2025-11-05','2025-02-03 19:09:44',1000,'NULL'),(9,'ITEM0004','1233445567','Paracap','Capsule',10.99,'/images/cb2eb4d2-a73f-4c72-ac38-89b6ba173e0a.jpg',0,'2025-12-31','2025-11-30','2025-02-04 03:05:34',100,'null'),(10,'ITEM0005','11234567','Voltex','Cream',10.99,'/images/9813352d-6a7a-4477-9bec-580a813a7a60.jpg',0,'2025-07-13','2025-06-13','2025-02-04 03:09:06',100,'null');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('admin','pharmacist') DEFAULT 'pharmacist',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','$2a$10$nDE9Fy5hyPTVb0KopyZFcefMBHd2u6zZbJnzWnsIBrPLkV1hUodue','2025-02-02 16:47:48','pharmacist'),(2,'mgmg','$2a$10$O1vPn/FcL7LHssoQFekKXuyNuzGQQQb7VJ9OV/GD68rUqN7vI7gGW','2025-02-02 16:50:37','pharmacist'),(3,'alexia','$2a$10$R3Js5lkwm1TX.LfCay8htuwHBW/SkYreR9q3RCrw.Z2VlAaRWcLPa','2025-02-03 19:15:13','pharmacist');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-04 19:01:51
