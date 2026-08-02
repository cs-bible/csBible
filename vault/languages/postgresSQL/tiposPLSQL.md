---
tags:
  - oracleSQL
  - basics
  - databases
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Tipos
La diferencia entre las bases de datos relacionales y las Objeto-Relacionales radica en la existencia de tipos de objetos (El equivalente a las [[objects#Classes|Clases]] de java) 

```PLSQL title="creacionTipos"
CREATE OR REPLACE TYPE phone AS OBJECT
	(type VARCHAR2(15), -- Phone or mobile phone
	number VARCHAR2(20)); -- Phone number
```

<mark style="background: #ABF7F7A6;">Un tipo es un <b>MODELO DE DATOS</b></mark>

# Tipos de tipos

## Coleccion (Varray)
Una coleccion es un grupo de elementos del mismo tipo.
Es la manera de representar atributos multivaluados

```PLSQL title="creacionColecciones"
CREATE TYPE phoneList AS VARRAY(10) OF phone;
```

Esto ha definido un nuevo tipo de datos llamado `phoneList`
Que tendra como maximo 10 elementos del tipo `phone` 
Basicamente es un array de elementos del tipo phone 

```plsql title="creacionTablas" group="tablas"
CREATE TABLE student(
	ID VARCHAR2(10) PRIMARY KEY,
	name VARCHAR2(20),
	surname VARCHAR2(40),
	email VARCHAR2(100),
	phone phoneList,
	address VARCHAR2(100),
	birtdhDate DATE
);
```
```plsql title="creacionTablasComoObjetos" group="tablas"
CREATE OR REPLACE TYPE studentType AS OBJECT (
	ID VARCHAR2(10),
	name VARCHAR2(20),
	surname VARCHAR2(40),
	email VARCHAR2(100),
	phone phoneList,
	address VARCHAR2(100),
	birtdhDate DATE
);

CREATE TABLE student OF studentType(
	ID PRIMARY KEY,
	UNIQUE (email)
);
```

# Tablas anidadas
En ORACLE existe la posibilidad de no limitar la cantidad de valores de un atributo multivaluado, definiendo para ello un tipo tabla. Aqui solo se especifica el tipo de datos que se desea para el atributo.

```plsql title="creacionTablaAnidada" group="nested"
CREATE TYPE phoneTable AS TABLE OF phone;

CREATE TABLE student(
	ID VARCHAR2(10) PRIMARY KEY,
	name VARCHAR2(20),
	surname VARCHAR2(40),
	email VARCHAR2(100),
	phone phoneTable,
	address VARCHAR2(100),
	birtdhDate DATE
)NESTED TABLE phone STORE AS ntPhone;
```
```plsql title="creacionTablaAnidadacomoObjeto" group="nested"
CREATE TYPE phoneTable AS TABLE OF phone;

CREATE OR REPLACE TYPE studentType AS OBJECT(
	ID VARCHAR2(10),
	name VARCHAR2(20),
	surname VARCHAR2(40),
	email VARCHAR2(100),
	phone phoneTable,
	address VARCHAR2(100),
	birtdhDate DATE
)

CREATE TABLE student OF studentType(
	ID PRIMARY KEY,
	UNIQUE(email)
	)NESTED TABLE phone STORE AS ntPhone;
```
