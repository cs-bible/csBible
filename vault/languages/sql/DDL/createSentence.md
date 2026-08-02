---
tags:
  - sql
  - basics
  - sqlStatements
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# :DeMysqlOriginal: CREATE sentence

The `CREATE` sentence allows to define new database structures like databases and tables.

## Database creation
Creates a new database in the SQL server.
### Syntax

```sql
CREATE DATABASE [IF NOT EXISTS] database_name
[CHARACTER SET charset_name]
[COLLATE collation_name];
```

**IF NOT EXISTS** → Prevents error if database already exists **CHARACTER SET** → Defines character encoding (utf8mb4 recommended) **COLLATE** → Defines sorting and comparison rules

> [!example] Create a database for a school management system

```sql
CREATE DATABASE IF NOT EXISTS school_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```
## Table creation
Creates a new table with defined columns, data types, and constraints.
### Syntax

```sql
CREATE TABLE [IF NOT EXISTS] table_name (
    column_name1 datatype [constraints],
    column_name2 datatype [constraints],
    ...
    [table_constraints]
) [ENGINE=engine_name];
```

### Common data types

**Numeric types**

- `INT` / `BIGINT` → Integer numbers
- `DECIMAL(p,s)` → Fixed-point numbers (precision, scale)
- `FLOAT` / `DOUBLE` → Floating-point numbers

**String types**

- `VARCHAR(n)` → Variable-length string (max n characters)
- `CHAR(n)` → Fixed-length string
- `TEXT` → Long text (up to 65,535 characters)

**Date and time types**

- `DATE` → Date (YYYY-MM-DD)
- `DATETIME` → Date and time
- `TIMESTAMP` → Timestamp (auto-updates)

### Common constraints

**Column constraints**

- `NOT NULL` → Column cannot be empty
- `UNIQUE` → All values must be different
- `PRIMARY KEY` → Unique identifier for rows
- `AUTO_INCREMENT` → Automatic sequential numbering
- `DEFAULT value` → Default value if none provided
- `CHECK (condition)` → Value must satisfy condition

**Table constraints**

- `PRIMARY KEY (column1, column2)` → Composite primary key
- `FOREIGN KEY (column) REFERENCES table(column)` → Foreign key relationship
- `UNIQUE (column1, column2)` → Unique combination of columns

> [!example] Create a students table with various constraints

```sql
CREATE TABLE students (
    student_id BIGINT NOT NULL AUTO_INCREMENT,
    dni VARCHAR(11) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    birthdate DATE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id)
) ENGINE=InnoDB;
```
## Foreign keys

Foreign keys establish relationships between tables and maintain referential integrity.

### Syntax

```sql
FOREIGN KEY (column_name) 
REFERENCES parent_table(parent_column)
[ON DELETE action]
[ON UPDATE action];
```

**Referential actions**

- `CASCADE` → Propagates changes/deletions to child records
- `SET NULL` → Sets foreign key to NULL
- `NO ACTION` → Prevents operation if child records exist
- `RESTRICT` → Same as NO ACTION (default)
- `SET DEFAULT` → Sets foreign key to default value

> [!example] Create tables with foreign key relationships

```sql
CREATE TABLE courses (
    course_id INT NOT NULL AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    credits INT DEFAULT 3,
    PRIMARY KEY (course_id)
);

CREATE TABLE enrollments (
    enrollment_id BIGINT NOT NULL AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(4,2),
    PRIMARY KEY (enrollment_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);
```

## Complete example

<mark style="background: #FFB86CA6;">(Code that creates the example from the notes)</mark>

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS store_db;
USE store_db;

-- Clients table
CREATE TABLE clients (
    client_id BIGINT NOT NULL AUTO_INCREMENT,
    dni VARCHAR(11) NOT NULL UNIQUE,
    first_name VARCHAR(50) DEFAULT NULL,
    last_name VARCHAR(50) DEFAULT NULL,
    address VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (client_id)
) ENGINE=InnoDB;

-- Articles table
CREATE TABLE articles (
    code VARCHAR(11) NOT NULL PRIMARY KEY,
    description TEXT DEFAULT NULL,
    stock BIGINT DEFAULT NULL,
    price DECIMAL(10,2)
);

-- Orders table
CREATE TABLE orders (
    code VARCHAR(11) NOT NULL PRIMARY KEY,
    client_id BIGINT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON DELETE NO ACTION 
        ON UPDATE CASCADE
);

-- Order items table (many-to-many relationship)
CREATE TABLE order_items (
    order_code VARCHAR(11) NOT NULL,
    article_code VARCHAR(11) NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_code, article_code),
    FOREIGN KEY (order_code) REFERENCES orders(code)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (article_code) REFERENCES articles(code)
        ON DELETE NO ACTION 
        ON UPDATE CASCADE
);
```


## Best practices

> [!warning] Important considerations
> 
> - Always use `IF NOT EXISTS` to avoid errors when recreating structures
> - Define `PRIMARY KEY` for every table to ensure row uniqueness
> - Use `NOT NULL` for essential columns
> - Choose appropriate data types to optimize storage
> - Use `AUTO_INCREMENT` for surrogate keys
> - Name constraints explicitly for easier debugging
> - Use `InnoDB` engine for foreign key support and transactions

## Related concepts

- [[alterTableSentence|ALTER TABLE]] - Modify existing tables
- [[dropSentence|DROP]] - Delete database objects
- [[insertSentence|INSERT]] - Add data to tables
- [[selectSentence|SELECT]] - Query data
- [[entityRelationModel|Entity-relationship model]] — design before CREATE
- [[databaseModelTranslation|ER to relational translation]]