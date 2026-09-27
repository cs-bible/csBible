---
tags:
  - sql
  - sqlStatements
  - basics
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# :DeMysqlOriginal: Update Sentence

Modifies the content of any column/row of the tables in the database

## Related Topics
- [[insertSentence|INSERT]] — add new data
- [[deleteSentence|DELETE]] — remove data
- [[selectSentence|SELECT]] — query data to update
## Syntax

```sql title="updateSentence"
UPDATE table_name
SET column1_name={expr1|DEFAULT}[,column2_name={expr2 | DEFAULT}...]
[WHERE condition]
[ORDER BY customOrder];
```

> [!WARNING]
> IF YOU WHERE IS NOT WRITTEN <mark style="background: #FF5582A6;">ALL THE DATA IN THE TABLE IS MODIFIED</mark>

# Example

<mark style="background: #FF5582A6;">Add 10 hours to each subject of Computer Science</mark>

```sql title="updateSentence"
UPDATE subject
SET hours = hours+10
WHERE studies = 'Computer Science';
```


