CREATE DATABASE  IF NOT EXISTS `travelweb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `travelweb`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: travelweb
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `hotel_id` int NOT NULL AUTO_INCREMENT,
  `hotel_name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `rating` float DEFAULT NULL,
  `amenities` text,
  `price_per_night` decimal(10,2) NOT NULL,
  `pic_link1` varchar(255) DEFAULT NULL,
  `pic_link2` varchar(255) DEFAULT NULL,
  `available_rooms` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`hotel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'Marriott','New York',4.5,'WiFi,Pool,Gym',200.00,'/images/marriott1.jpg','/images/marriott2.jpg',50,'2024-07-14 13:48:47','2024-07-14 13:48:47'),(2,'Hilton','Chicago',4,'WiFi,Parking,Gym',180.00,'/images/hilton1.jpg','/images/hilton2.jpg',40,'2024-07-14 13:48:47','2024-07-14 13:48:47'),(3,'Hyatt','Los Angeles',4.3,'WiFi,Pool,Spa',220.00,'/images/hyatt1.jpg','/images/hyatt2.jpg',60,'2024-07-14 13:48:47','2024-07-14 13:48:47'),(4,'Sheraton','Miami',4.1,'WiFi,Pool,Restaurant',190.00,'/images/sheraton1.jpg','/images/sheraton2.jpg',45,'2024-07-14 13:48:47','2024-07-14 13:48:47'),(5,'Holiday Inn','Dallas',3.9,'WiFi,Parking,Gym',150.00,'/images/holidayinn1.jpg','/images/holidayinn2.jpg',70,'2024-07-14 13:48:47','2024-07-14 13:48:47'),(6,'Ritz Carlton','San Francisco',4.7,'WiFi,Pool,Spa,Gym',300.00,'/images/ritzcarlton1.jpg','/images/ritzcarlton2.jpg',30,'2024-07-14 13:48:47','2024-07-14 13:48:47');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-14 21:50:07
