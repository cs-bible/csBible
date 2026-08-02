---
tags:
  - sql
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# :DeMysqlOriginal: SELECT sentence

## ALL | DISCTINT
State if the duplicated tuples in the result table are being shown or not 

<mark style="background: #FFF3A3A6;">ALL</mark>: All tuples will show, including duplicated ones (Default option)

<mark style="background: #FFF3A3A6;">DISCTINT</mark>: If a tuple is duplicated is only being selected once.  
### Syntax
```sql title="selectSyntax"
SELECT [ALL | DISCTINT] expression [, expression...]
[FROM table];
```

## ORDER BY
We can choose the order of the resulting data of the query, if there is no order specified, the data will be random OPTIONS: 

<mark style="background: #FFF3A3A6;">ASC</mark>: Orders the result in an Ascending way

<mark style="background: #FFF3A3A6;">DESC</mark>: Orders the result in a Descending way

### Syntax

```sql title="select_orderBy_Syntax"
SELECT [ALL | DISCTINT] expression [, expression...]
[FROM table
[ORDER BY {column_name | column_position} [ASC | DESC],...]
];
```

## WHERE
It states a conditional clause for the data shown in the query (Equivalent to [[selectionStructures|If]] in any programming language)

## Related Topics
- [[selectSyntax|SELECT basic syntax]]
- [[joinSentence|JOIN operations]]
- [[javi's/developer/languages/sql/operators|Relational operators]]
- [[advancedStatements|Advanced conditions]]

<mark style="background: #ADCCFFA6;">Conditions have this element </mark>
- Column name
- Constants (Numbers that dont change or fixed strings)
- Expressions (Algebra or SQL functions)
- [[advancedStatements]]
- Parenthesis: Alter the priority of the statements
- Operands

```sql title="comparisonOperands"
WHERE age        >  18
WHERE price      <  100
WHERE salary     >= 1500
WHERE quantity    <= 20
WHERE name      =  'Jhon'
WHERE type        != 'admin'
WHERE score  !> 80
WHERE ranking     !< 5
```

```sql title="logicOperands"
WHERE age > 18 AND city = 'Madrid'
WHERE price < 100 OR quantity > 5
WHERE NOT status = 'active'
```
## GROUP BY
Returns and <mark style="background: #FF5582A6;">unique grouped value</mark> of all the data selected 

> [!warning] IMPORTANTE
> IF USED, YOU CANT **USE SELECT** *
> **ALL THE DATA MUST BE DECLARED EXPLICITLY IN THE SENTENCE OR IN GROUPING FUNCTIONS**

Grouping functions
- AVG = Calculates the arithmetic average of the grouped values, only numeric columns.
- SUM =Calculates the sum of the grouped values, only numeric columns.
- MAX = Returns the maximum value of all the grouped values.
- MIN = Returns the minimum value of all the grouped values.
- COUNT = Returns the number of the grouped columns.
### Syntax

```sql title="GROUP BY"
SELECT teacher, COUNT(*) 
FROM subject 
WHERE career='Computer science' 
GROUP BY teacher;
--Number of subjects that belongs to each teacher (grouped by teacher)--
```

## HAVING

Filters grouped data
### Syntax

```sql title:Having
SELECT subject, AVG (grade) AS 'Average grades' 
FROM student_subject 
GROUP BY subject 
HAVING AVG(grade)>7  
-- Only subjects with a >7 average grade 
```

