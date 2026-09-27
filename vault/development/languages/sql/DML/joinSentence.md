---
tags:
  - sql
  - sqlStatements
  - advanced
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# :DeMysqlOriginal: Join
Creates a table with data from 2 separate tables

## Related Topics
- [[selectSentence|SELECT with JOIN]]
- [[subQuerys|Subqueries]] — alternative to JOINs
- [[entityRelationModel|Entity-relationship model]] — relationships origin
- [[javi's/developer/03 - Notes/databases - relationsCharacteristics|Relationship characteristics]] 

 > [!warning] VERY IMPORTANT
 > PK FROM 1 TABLE MUST BE COMPARED TO THE FK OF THE OTHER, IN ORDER TO DELETE SPURIOUS CORRELATIONS

 

<mark style="background: #FF5582A6;">3 different options</mark>

## Inner join
```sql title="innerJoin"
SELECT s.*, t.name, t.surname 
FROM subject s INNER JOIN teacher t 
ON s.teacher = t.id;
--Returns all of the subjects data and the teacher's full name
--Only if there is a teacher assigned to the subject
```

## Left join
```sql title="leftJoin"
SELECT *  FROM student_subject ss LEFT JOIN student s 
ON ss.student = s.id LEFT JOIN subject sub
ON ss.subject = sub.id 
GROUP BY s.dni;
-- Shows all registrys os student_subject, including students without
-- subjects or subjects with no students assigned, filling with NULLS
-- on non-correlated fields
```

## Right join
```sql title="rightJoin"
SELECT * FROM student_subject ss RIGHT JOIN student s 
ON ss.student = s.id RIGHT JOIN subject sub
ON ss.subject = sub.id 
GROUP BY s.id;
-- All students and subjects included, even those with no subjects 
-- assigned, using NULL for missing data
```

## Key differences

| JOIN       | LEFT TABLE         | RIGHT TABLE        | No correlation |
| ---------- | ------------------ | ------------------ | -------------- |
| INNER      | only correlated    | only correlated    | excluded       |
| LEFT JOIN  | ALL                | correlated or NULL | LEFT           |
| RIGHT JOIN | correlated or NULL | ALL                | RIGHT          |
