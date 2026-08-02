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


# :DeMysqlOriginal: Advanced Statements - IN | BETWEEN| IS NULL | EXISTS | LIKE
## IN

Checks if the result of an expression is within a determined set

```sql title="IN" Group="IN"
SELECT * FROM subject
WHERE term = 1 AND career IN('Computer Science', 'Physics')
```
```sql title="[NOT]IN" Group="IN"
SELECT * FROM subject
WHERE term = 1 AND career NOT IN('Computer Science', 'Physics')
```
## BETWEEN

Checks if the result of an expression is included between 2 values

```sql title="Between" Group="Between"
SELECT * FROM student
WHERE YEAR (birthDate) BETWEEN 1990 AND 1999;
```
```sql title="[NOT]BETWEEN" Group="Between"
SELECT * FROM student
WHERE YEAR (birthDate) NOT BETWEEN 1990 AND 1999;
```

## NULL
Checks if a datum is or not NULL, works with operand `IS` 
```sql title="NULL" Group="NULL"
SELECT *
FROM subject
WHERE teacher IS NULL;
```
```sql title="[NOT] NULL" Group="NULL"
SELECT *
FROM subject
WHERE teacher IS NOT NULL;
```

## ALL

True if complies with all the returned datum from the [[subQuerys|Sub-query]] following

```sql title="ALL"
SELECT * FROM subject
WHERE term = 2 AND career = 'Computer Science'
AND hours > ALL(SELECT hours FROM subject
		WHERE term = 1 AND ciclo 'Computer Science');
--subjects from 2nd term with >hours than ALL of 1st term subjects-- 
```

## ANY
True if the comparison complies for at least ONE value of the [[subQuerys|sub-query]] .
```sql title="ANY"
SELECT * FROM subject
WHERE term = 2 AND career = 'Computer Science'
  AND hours > ANY (SELECT hours FROM subject
					WHERE term = 1 AND career = 'Computer Science');
--subjects from 2nd term with >hours than ONE of 1st term subjects-- 
```

## LIKE
Checks if a value matches a pattern using wildcards.

```sql title="LIKE" group="like"
-- column1 from student if name starts with 'A'
SELECT column1 FROM student WHERE name LIKE 'A%';

-- column1 from student if name ends with 'son'
SELECT column1 FROM student WHERE name LIKE '%son';

-- column1 from student if name contains 'ar'
SELECT column1 FROM student WHERE name LIKE '%ar%';

-- column1 from student if name has exactly 4 characters
SELECT column1 FROM student WHERE name LIKE '____';

-- column1 from student if email domain is gmail
SELECT column1 FROM student WHERE email LIKE '%@gmail.com';
```
```sql title="[NOT] LIKE" group="like"
-- column1 from student if name does NOT start with 'A'
SELECT column1 FROM student WHERE name NOT LIKE 'A%';

-- column1 from student if name does NOT end with 'son'
SELECT column1 FROM student WHERE name NOT LIKE '%son';

-- column1 from student if name does NOT contain 'ar'
SELECT column1 FROM student WHERE name NOT LIKE '%ar%';

-- column1 from student if name does NOT have exactly 4 characters
SELECT column1 FROM student WHERE name NOT LIKE '____';

-- column1 from student if email is NOT from gmail
SELECT column1 FROM student WHERE email NOT LIKE '%@gmail.com';
```

## EXISTS
Checks if the [[subQuerys|sub-query]] returns something or not.

```sql title="  EXISTS" group="Exists"
-- column1 from table 1 if there is data in table 2
SELECT column1 FROM table1 WHERE EXISTS(SELECT* FROM table2);
```
```sql title="[NOT] EXISTS" group="Exists"
-- column1 from table 1 if there IS NOT data in table 2
SELECT column1 FROM table1 WHERE NOT EXISTS(SELECT* FROM table2);
```

