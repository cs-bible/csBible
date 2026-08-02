---
tags:
  - concepts
  - databases
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

#  Erm to rm translation :LiDatabase:
## Translation basics
### 1. Entity --> table
Each entity is a table, for each entity there is a table in the relational model
### 2. Key rules
#### Attributes order:

Attributes order is not meaningful, it does not matter.
#### Relations
##### 1:N
The primary key from the entity that is `1` is migrated to the `N` entity
![[entity_relations1_N.png]]

| Order Table | |
|-------------|---|
| `order_id` | **PK** |
| attributes | |
| `client_id`| **FK** |

| Client Table |        |
| ------------ | ------ |
| `client_id`  | **PK** |
| attributes   |        |

##### N:N
Both primary keys are migrated to another table, making the primary key the group of both foreign keys.
![[entity_relationsN_N.png]]

| Student Table | |
|---------------|---|
| `student_id` | **PK** |
| attributes   | |

| Subject Table | |
|---------------|---|
| `subject_id` | **PK** |
| attributes   | |

| Student_courses_Subject |        |
| ----------------------- | ------ |
| `student_id`            | **PK** |
| `subject_id`            | **PK** |
| attributes              |        |


##### 1:1
The migration should be done in a way which less `NULLS` are generated
![[entity_relations1_1.png]]


| DriverLicense |               |
| ------------- | ------------- |
| `license_id`  | **PK**        |
| attributes    |               |
| `citizen_id`  | **FK UNIQUE** |

| Citizen Table |        |
| ------------- | ------ |
| `citizen_id`  | **PK** |
| attributes    |        |

