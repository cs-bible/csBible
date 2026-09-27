---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

#  Unit Tests - White Box :LiTestTubeDiagonal:
They are linked to the procedure itself.


They focus on the internal workings of the program, they are also known as structural tests.

### <mark style="background: #FF5582A6;">IMPORTANT</mark>
- All paths of each module are executed at least once.
- All statements are executed at least once.
- Execute all logical decisions in TRUE and FALSE.
- Execute all loops at their limits.
- Use all internal data structures.
---
## How to do the tests
### Steps assignment
The first thing is to assign a number to each instruction of the code
![[Tarea 3 - Ejercicio Realización Pruebas#Ejercicio 1#Código]]

### Graph construction
Then these numbers are passed to a graph, where the flow of instructions is represented, so we can determine all possible paths through this same graph, also we will make a table with the paths, input values and expected result.
![[Tarea 3 - Ejercicio Realización Pruebas#Ejercicio 1#Grafo]]

### Cyclomatic Complexity
The cyclomatic complexity determines how many paths must be tested to have completed all scenarios and that everything is tested, it is calculated as follows (see example)

![[Tarea 3 - Ejercicio Realización Pruebas#Ejercicio 1#Calculo complejidad ciclomática]]

> [!info] Predicate nodes
> Predicate nodes are those nodes from which 2 or more paths (or edges) come out

## Related Topics
- [[testing|Testing strategies]]
- [[jUnit|JUnit testing]]
- [[algorithms|Algorithms]]