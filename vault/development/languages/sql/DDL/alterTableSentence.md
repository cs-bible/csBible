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

# :DeMysqlOriginal: ALTER TABLE 
Modifies the table structure
## Syntax

```sql cpp title:Alter_table
ALTER TABLE {tableName}
alter_especification [, alter_especification ...];
```

## alter_especification

```sql title="Alter_especification"
ADD [COLUMN] column_name
ADD [CONSTRAINT [symbol]] PRIMARY KEY (index_col_name,...) 
ADD [CONSTRAINT [symbol]] UNIQUE [name] (col_name,...) 
ADD [CONSTRAINT [symbol]] FOREIGN KEY [name] (col_name,...)
[reference_definition]
CHANGE [COLUMN] oldColumn_name newColumn_name 
DROP [COLUMN] column_name
```
