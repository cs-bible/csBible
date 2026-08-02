-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: centroestudios
-- ------------------------------------------------------
-- Server version	5.7.12-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `centroestudios`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `centroestudios` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `centroestudios`;

--
-- Table structure for table `alumno`
--

DROP TABLE IF EXISTS `alumno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alumno` (
  `dni` varchar(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  PRIMARY KEY (`dni`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno`
--

LOCK TABLES `alumno` WRITE;
/*!40000 ALTER TABLE `alumno` DISABLE KEYS */;
INSERT INTO `alumno` VALUES ('25469874X','Ana','Sanz','ana.sanz@gmail.com','989767233','Calle Protugal, 3, Madrid','1987-02-24'),('51423010E','Blanca','Carrillo','blanca.carrillo@yahoo.es','96325487','Calle Hortaleza, 18, Madrid','1982-11-08'),('54123658E','Ana','Puerto','ana.puerto@gmail.com','658956332','Calle Moliner, 17, Madrid','1993-12-08'),('57845214L','Julio','Marcos','julio.marcos@gmail.com','923564767','Calle Altamira, 25, Madrid','1995-12-01'),('58745625J','Carlos','Sevilla','carlos.sevilla@gmail.com','698523654','Calle Gran via, 22, Madrid','1989-05-08'),('65263765T','Curro','Alonso','curro.alonso@gmail.com','956434525','Calle Gran via, 17, Madrid','1993-04-08'),('65742148O','Marta','Gracia','marta.gracia@yahoo.es','698545216','Calle Pintores, 18, Madrid','1988-04-08'),('70584632H','David','Moreno','david.moreno@yahoo.es','698546325','Calle Rosales, 25, Madrid','1991-05-15'),('78741254B','Mario','Blanco','mario.blanco@yahoo.es','612653712','Calle Fuencarral, 2, Madrid','1985-07-28');
/*!40000 ALTER TABLE `alumno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumno_asignatura`
--

DROP TABLE IF EXISTS `alumno_asignatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alumno_asignatura` (
  `alumno` varchar(11) NOT NULL,
  `asignatura` varchar(11) NOT NULL,
  `nota_1Ev` int(2) DEFAULT NULL,
  `nota_2Ev` int(2) DEFAULT NULL,
  `nota_3Ev` int(2) DEFAULT NULL,
  `nota_Final` int(2) DEFAULT NULL,
  PRIMARY KEY (`alumno`,`asignatura`),
  KEY `asignatura` (`asignatura`),
  CONSTRAINT `alumno_asignatura_ibfk_1` FOREIGN KEY (`alumno`) REFERENCES `alumno` (`dni`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `alumno_asignatura_ibfk_2` FOREIGN KEY (`asignatura`) REFERENCES `asignatura` (`codigo`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno_asignatura`
--

LOCK TABLES `alumno_asignatura` WRITE;
/*!40000 ALTER TABLE `alumno_asignatura` DISABLE KEYS */;
INSERT INTO `alumno_asignatura` VALUES ('25469874X','DAM_BBDD',4,NULL,NULL,NULL),('25469874X','DAM_FOL',6,NULL,NULL,NULL),('25469874X','DAM_PR',3,NULL,NULL,NULL),('25469874X','DAM_SI',4,NULL,NULL,NULL),('51423010E','AYF_FOL',7,NULL,NULL,NULL),('51423010E','AYF_OYPI',8,NULL,NULL,NULL),('54123658E','DAM_AC',4,NULL,NULL,NULL),('54123658E','DAM_DI',6,NULL,NULL,NULL),('57845214L','DAM_BBDD',7,NULL,NULL,NULL),('57845214L','DAM_FOL',6,NULL,NULL,NULL),('57845214L','DAM_PR',5,NULL,NULL,NULL),('57845214L','DAM_SI',9,NULL,NULL,NULL),('58745625J','DAM_AC',10,NULL,NULL,NULL),('58745625J','DAM_DI',8,NULL,NULL,NULL),('65263765T','DAM_BBDD',5,NULL,NULL,NULL),('65263765T','DAM_FOL',7,NULL,NULL,NULL),('65263765T','DAM_PR',4,NULL,NULL,NULL),('65263765T','DAM_SI',6,NULL,NULL,NULL),('65742148O','DAM_BBDD',9,NULL,NULL,NULL),('65742148O','DAM_FOL',8,NULL,NULL,NULL),('65742148O','DAM_PR',10,NULL,NULL,NULL),('65742148O','DAM_SI',9,NULL,NULL,NULL),('70584632H','DAM_AC',5,NULL,NULL,NULL),('70584632H','DAM_DI',7,NULL,NULL,NULL),('78741254B','AYF_FOL',9,NULL,NULL,NULL),('78741254B','AYF_OYPI',8,NULL,NULL,NULL);
/*!40000 ALTER TABLE `alumno_asignatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignatura`
--

DROP TABLE IF EXISTS `asignatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asignatura` (
  `codigo` varchar(11) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `descripcion` varchar(90) DEFAULT NULL,
  `horas` int(4) DEFAULT NULL,
  `ciclo` varchar(15) NOT NULL,
  `curso` int(2) DEFAULT NULL,
  `profesor` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `profesor` (`profesor`),
  CONSTRAINT `asignatura_ibfk_1` FOREIGN KEY (`profesor`) REFERENCES `profesor` (`dni`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignatura`
--

LOCK TABLES `asignatura` WRITE;
/*!40000 ALTER TABLE `asignatura` DISABLE KEYS */;
INSERT INTO `asignatura` VALUES ('AYF_CAC','Comunicación y atención al cliente','Se estudiará...',200,'AYF',1,NULL),('AYF_CF','Contabilidad y Fiscalidad','Se estudiará...',120,'AYF',2,NULL),('AYF_FOL','Formación y orientación laboral','Formación...',150,'AYF',1,'74512365X'),('AYF_ING','Inglés','Se estudiará...',160,'AYF',1,NULL),('AYF_OYPI','Ofimática y proceso de la información','Ofimática...',250,'AYF',1,'63254157C'),('DAM_AC','Acceso de datos','Continuación de bases de datos',250,'DAM',2,'63254157C'),('DAM_BBDD','Bases de datos','Introducción a las bases de datos',250,'DAM',1,'63254157C'),('DAM_DI','Desarrollo de interfaces','Interfaces',250,'DAM',2,'45124785A'),('DAM_FOL','Formación y orientación laboral','Formación...',150,'DAM',1,'74512365X'),('DAM_LM','Lenguaje de Marcas','XML, HTML, ...',140,'DAM',1,'63254157C'),('DAM_PR','Programación','Introducción a la Programación',300,'DAM',1,'45124785A'),('DAM_SI','Sistemas informáticos','Sistemas...',210,'DAM',1,'45124785A');
/*!40000 ALTER TABLE `asignatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesor`
--

DROP TABLE IF EXISTS `profesor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profesor` (
  `dni` varchar(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`dni`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesor`
--

LOCK TABLES `profesor` WRITE;
/*!40000 ALTER TABLE `profesor` DISABLE KEYS */;
INSERT INTO `profesor` VALUES ('45124785A','Jorge','Alonso','jorge.alonso@ufv.es','965875487','Calle Altamira, 25, Madrid'),('63254157C','Esmeralda','Sanz','esmeralda.sanz@ufv.es','658784578','Calle Protugal, 3, Madrid'),('65847512N','Marta','Potro','marta.potro@ufv.es','652148754','Calle Gran via, 17, Madrid'),('74512365X','Sergio','Prieto','mario.blanco@yahoo.es','965874521','Calle Fuencarral, 2, Madrid');
/*!40000 ALTER TABLE `profesor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-14  2:36:00
