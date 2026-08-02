---
tags:
  - concepts
  - basics
  - databases
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
#  Relational Characteristics

## Relationship Degree:
### Reflexive Relationships:
Where the same entity participates more than once in the relationship
Pedro and Juana are Personas(Entities) married to each other. With that
Pedro(Persona) -->Is married to Juana(Persona)
and in turn
Juana(Persona)-->Is married to Pedro(Persona)
### Binary Relationships
Where 2 entities participate.
Juana is a student taking mathematics, Pedro is a professor teaching mathematics.
Juana(Student)--->Takes--->Subject<---Teaches<---(Pedro)
### Ternary Quaternary Relationships....

3, 4 entities participate in the relationship respectively.

---

## Relationship Cardinality
The maximum number of occurrences of each entity that can intervene in an occurrence of a relationship. There are 3 types
### 1:1
Each occurrence of entity A is related to an occurrence of entity B 
![[entity_relations1_1.png]]

### 1:N
Each occurrence of entity A is related with several occurrences of entity B
![[entity_relations1_N.png]]]
### N:N
Many occurrences of entity A are related with many occurrences of entity B
![[entity_relationsN_N.png]]