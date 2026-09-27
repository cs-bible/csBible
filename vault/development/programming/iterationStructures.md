---
tags:
  - concepts
  - basics
  - codeStructures
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

#  Iteration structures :LiIterationCw:

## While
Execution will continue if the `bolean expression` is true 
### <mark style="background: #FFB86CA6;">Structure</mark>
```txt title="whileBlock"
while(boolean expression){ //if true -> block executes, else it does not
	sentence1;
	sentence2;
	...
};
```

![[whileBlock.png|395]]

> [!danger] 
> NEVER MAKE A CONDITION ALLWAYS TRUE
> `while(1>0)` | `while(true)` ⚠️❌ Causes an infinte loop and makes the execution stay on that point until interrupted

## do-while
It is the same as `while`, though with this structure you ensure that instructions are executed at least once
### <mark style="background: #FFB86CA6;">Structure</mark>

```txt title="doWhileBlock"
do{
	sentence1;
	sentence2;
	... 
}while(boolean expression)
```

![[doWhileBlock.png|355]]
## For
Executes code a <mark style="background: #FF5582A6;">specific number of times</mark>

```txt title="forBlock"
for (control variable declaration;condition;update){
	sentence1;
	sentence2;
	sentence3;
}
```

![[forBlock.png]]
## Nested fors

The first `for` executes the second, when the second `for` finishes the execution, the first one updates its control and executes again (if `contition == true` )
```txt title="nestedFors"
for (int x = 0; x < 3; x++) {
	for (int y = 0; y < 3; y++) {
		sentence;
	}
}
```

![[nestedFors]]
## Related Topics
- [[selectionStructures|Selection structures]]
- [[methods|Methods with loops]]
- [[algorithms|Algorithms with iteration]]
