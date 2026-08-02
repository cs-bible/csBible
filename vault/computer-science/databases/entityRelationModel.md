---
tags:
  - concepts
  - databases
  - basics
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Entity-relationship model :LiNetwork:

## Entity

An entity is the object whose data you want to store, for example in a university entities could be professors, students or subjects
**There are 2 types of entities, strong and weak**
### <mark style="background: #ADCCFFA6;">Strong entity</mark>
Entity that does not depend on any other.
### <mark style="background: #ADCCFFA6;">Weak entity</mark>
Entity which existence depends on the existence of a strong entity
### <mark style="background: #ADCCFFA6;">Occurrence</mark>
When an entity has different ways of being represented, for example all humans are persons, but they are an independent individual.
For the same entity it could be different occurrences

-------------------------------------------------------
# Relation
Association between objects (represented by entities) each relation has a name that describes the association, generally a verb it’s used, they are represented with a rhombus, named with the relation’s name, and linked to the related entities.
For example, the entity student is related with the entity subject, via the relationship courses.

## Related Topics
- [[relationsCharacteristics|Relations Characteristics]]
- [[databaseModelTranslation|ER to relational translation]]
- [[createSentence|CREATE TABLE from ER]]
- [[databasesCharacteristics|Database characteristics]]