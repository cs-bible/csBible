---
tags:
  - sql
  - sqlStatements
  - advanced
  - codeStructures
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# :DeMysqlOriginal: Select Sentence - Minimum Syntax

```sql title="select"
SELECT expression [,expression]
[FROM tableName];
-- expression = columnName [Alias] | * | expression [Alias] 
-- * Selects everything
```

### From
Indicates the table/s affected by the query
### columnName
Indicates the column from where the data is searched,  this column must be from the table indicated in the `FROM` 
### expression

States the information that is searched through the query, instead of being simply the value of the column it can be one of the following expressions:
- Expression in which any column of the table in the `FROM` is involucrated, could be algebraic expressions ( +, -, * , /, ^) or SQL-engine functions (differs for each engine), Examples
	- Date → `CURRENT_DATE` or `DATE_ADD`
	- Strings → `UPPERCASE`, `LOWERCASE` or `LENGTH`
	- Numerical: `ABS`, `SQRT` or `MOD`

