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

# :DeMysqlOriginal: Data Insertion - INSERT sentence

The `INSERT` sentence allows to insert data in the table/view  specified

## Related Topics
- [[createSentence|CREATE TABLE]] — tables must exist first
- [[updateSentence|UPDATE]] — modify existing data
- [[deleteSentence|DELETE]] — remove data
- [[databasesTerms|Database terms]] — tuples, attributes
## Syntax variations
### Simple INSERT
```sql title:Insert_Simple
INSERT INTO{tableName | viewName} [(columnList)]
VALUES (valuesList);
```

**`tableName` | `viewName`** --> Specifies the location for the data insert
**`columnList`** --> Column list for each specific data inserted in the values (ORDER MUST MATCH)
**`valuesList`** -->List with the data inserted

### Simple INSERT without column specification
> [!example] Example
>  Insert  James Ericcsson with email j.ericsson@gmail.com, ID 65987452N and phone number 652321452 in the students table

```sql title="noSpecifiedColumns"
INSERT INTO students
VALUES 
('65987452N', 'James', 'Ericcson', 'j.ericsson@gmail.com', '652321452', NULL)
```

### Multiple INSERT

> [!example] Example
> INSERT THE students
> - **Julia Parker**, ID **12457843N**, email [julia.parker@ufv.es](mailto:julia.parker@ufv.es), phone **698745487**.
> - Blanca Smith, ID 54123654B, email b.smith@gmail.com, phone 632145854.
>- Peter Johnson, ID 74854521L, email peter.johnson@gmail.com, phone 652145487.

```sql title="multipleInsert"
INSERT INTO students 
VALUES 
('12457843N', 'Julia', 'Parker', 'julia.parker@ufv.es', '698745487', NULL), 
('54123654B', 'Blanca', 'Smith', 'b.smith@gmail.com', '632145854', '15 Gran Via, Madrid'),
('74854521L', 'Peter', NULL, 'peter.johnson@gmail.com', '652145487', NULL);
```


