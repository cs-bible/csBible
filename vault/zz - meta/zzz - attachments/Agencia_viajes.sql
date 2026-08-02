-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: agencia_viajes
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Current Database: `agencia_viajes`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `agencia_viajes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `agencia_viajes`;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `fecha_registro` date NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `correo_electronico` (`correo_electronico`),
  UNIQUE KEY `telefono` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Laura','Pérez Gómez','654123987','laura.perez@gmail.com','Calle Falsa 123','2024-12-15'),(2,'Carlos','López Díaz','653987654','carlos.lopez@gmail.com','Avenida Siempreviva 456','2025-01-01'),(3,'Ana','Martínez Ruiz','652147852','ana.martinez@gmail.com','Plaza Mayor 789','2024-11-20'),(4,'Pedro','González Fernández','655123789','pedro.gonzalez@gmail.com','Calle Sol 45','2024-10-01'),(5,'Lucía','Ramírez Torres','656987321','lucia.ramirez@gmail.com','Avenida Mar 67','2024-09-15'),(6,'Javier','Hernández López','657654987','javier.hernandez@gmail.com','Plaza Luna 12','2024-08-20'),(7,'Isabel','Morales Sánchez','658321456','isabel.morales@gmail.com','Calle Estrella 98','2024-07-10'),(8,'Andrés','Domínguez Pérez','659147852','andres.dominguez@gmail.com','Avenida Primavera 34','2024-06-25');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinos`
--

DROP TABLE IF EXISTS `destinos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinos` (
  `id_destino` int NOT NULL AUTO_INCREMENT,
  `nombre_destino` varchar(100) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_destino`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinos`
--

LOCK TABLES `destinos` WRITE;
/*!40000 ALTER TABLE `destinos` DISABLE KEYS */;
INSERT INTO `destinos` VALUES (1,'París','Francia','La ciudad del amor y la Torre Eiffel.'),(2,'Cancún','México','Playas paradisíacas y resorts de lujo.'),(3,'Roma','Italia','La ciudad eterna con monumentos históricos como el Coliseo.'),(4,'Nueva York','Estados Unidos','La ciudad que nunca duerme, con lugares icónicos como Times Square y Central Park.'),(5,'Tokio','Japón','La mezcla perfecta de modernidad y tradición, con templos, tecnología y gastronomía.'),(6,'El Cairo','Egipto','Descubre las pirámides de Giza y el río Nilo en la cuna de la civilización.'),(7,'Sídney','Australia','Famosa por su Ópera House, playas y estilo de vida relajado.'),(8,'Cape Town','Sudáfrica','Paisajes impresionantes con Table Mountain y viñedos cercanos.');
/*!40000 ALTER TABLE `destinos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_reserva` int DEFAULT NULL,
  `fecha_pago` datetime NOT NULL,
  `monto_pago` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_reserva` (`id_reserva`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reservas` (`id_reserva`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,'2025-01-11 10:00:00',1500.00),(2,2,'2025-01-13 14:00:00',2400.00),(3,3,'2025-01-16 09:00:00',1000.00),(9,4,'2025-01-19 09:00:00',1800.00),(10,5,'2025-01-20 11:00:00',2000.00),(11,6,'2025-01-21 13:00:00',2250.00),(12,7,'2025-01-22 15:00:00',4400.00),(13,8,'2025-01-23 17:00:00',1700.00),(14,9,'2025-01-19 09:30:00',3000.00),(15,10,'2025-01-20 14:00:00',3600.00),(16,11,'2025-01-21 10:00:00',1000.00),(17,12,'2025-01-22 16:30:00',7200.00),(18,13,'2025-01-23 11:00:00',4000.00),(19,13,'2025-01-25 11:00:00',1000.00),(20,13,'2025-01-26 12:30:00',1000.00),(21,13,'2025-01-27 13:00:00',1000.00),(22,13,'2025-01-28 14:15:00',1000.00),(23,13,'2025-01-29 15:00:00',1000.00),(24,14,'2025-01-31 10:30:00',2200.00),(25,14,'2025-02-01 11:00:00',2200.00),(26,15,'2025-02-06 14:00:00',2000.00),(27,15,'2025-02-07 15:30:00',2000.00);
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paquetes`
--

DROP TABLE IF EXISTS `paquetes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paquetes` (
  `id_paquete` int NOT NULL AUTO_INCREMENT,
  `nombre_paquete` varchar(100) NOT NULL,
  `id_destino` int DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `duracion_dias` int NOT NULL,
  PRIMARY KEY (`id_paquete`),
  KEY `id_destino` (`id_destino`),
  CONSTRAINT `paquetes_ibfk_1` FOREIGN KEY (`id_destino`) REFERENCES `destinos` (`id_destino`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paquetes`
--

LOCK TABLES `paquetes` WRITE;
/*!40000 ALTER TABLE `paquetes` DISABLE KEYS */;
INSERT INTO `paquetes` VALUES (1,'Luna de miel en París',1,1500.00,5),(2,'Vacaciones en Cancún',2,1200.00,7),(3,'Tour histórico por Roma',3,1000.00,4),(4,'Aventura en Nueva York',4,1800.00,6),(5,'Explorando Tokio',5,2000.00,7),(6,'Egipto Mágico',6,1500.00,5),(7,'Relajación en Sídney',7,2200.00,8),(8,'Descubre Cape Town',8,1700.00,6);
/*!40000 ALTER TABLE `paquetes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `id_paquete` int DEFAULT NULL,
  `fecha_reserva` date NOT NULL,
  `cantidad_personas` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_paquete` (`id_paquete`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (1,1,1,'2025-01-10',2,3000.00),(2,2,2,'2025-01-12',4,4800.00),(3,3,3,'2025-01-15',1,1000.00),(4,4,4,'2025-01-18',2,3600.00),(5,5,5,'2025-01-19',1,2000.00),(6,2,6,'2025-01-20',3,4500.00),(7,3,7,'2025-01-21',4,8800.00),(8,1,8,'2025-01-22',2,3400.00),(9,1,1,'2025-01-18',2,3000.00),(10,2,2,'2025-01-19',3,3600.00),(11,3,3,'2025-01-20',1,1000.00),(12,4,4,'2025-01-21',4,7200.00),(13,5,5,'2025-01-22',2,4000.00),(14,2,8,'2025-01-24',2,5000.00),(15,3,7,'2025-01-30',1,4400.00),(16,4,5,'2025-02-05',2,4000.00);
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-18  9:24:01
