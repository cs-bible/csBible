---
tags:
  - concepts
  - basics
  - dataStructures
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Arrays :LiBrackets: 

Data structures that are consecutively stored in memory

```java title="java_declaration" group="arrays"
int[] list = new int [10]; // type[] name = new type[size]
```
```cpp title="cpp_declaration" group="arrays"
int list[10]; // tipe name[size]
```
```c title="C_declaration" group="arrays"
int list[10]; // type name[size]
```
```js title="js_decaration" group="arrays"
let list = [1,2] //scope name = [values]
```
```python title="py_declaration" group="arrays"
list = [] [] [] [] # name = [datum1] [datum2] (Dynamic size)
```


To insert values into an array 

```java title="valuesInsertion" group="values"
list[0] = 100; //In the index 0, int 100 is inserted
```
```cpp title="valuesInsertion" group="values"
list[0] = 100; //In index 0, int 100 is inserted
```
```c title="valuesInsertion" group="values"
list[0] = 100; //In index 0, int 100 is inserted
```
```js title="valuesInsertion" group="values"
list[0] = 100; //In index 0, 100 is inserted
```
```python title="valuesInsertion" group="values"
list[0] = 100; # In index 0, 100 is inserted
```

To select values in an array

```java title="valuesSelection" group="selection"
list[0] = 100; // Assign the value
System.out.println(lista[0]);  // Prints 100
int x = list[0]; // Assign x the value stored at position 0 of the array
```
```cpp title="valuesSelection" group="selection"
list[0] = 100;              // Assign value to index 0
std::cout << list[0];       // Print 100
int x = list[0];            // Read value from index 0 into x
```
```c title="valuesSelection" group="selection"
list[0] = 100;              // Assign value to index 0
printf("%d\n", list[0]);    // Print 100
int x = list[0];            // Read value from index 0 into x
```
```js title="valuesSelection" group="selection"
list[0] = 100; // Assign value to index 0
console.log(list[0]); // Print 100
let x = list[0]; // Read value from index 0 into x
```
```python title="valuesSelection" group="selection"
list[0] = 100 # Assign value to index 0
print(list[0]) # Print 100
x = list[0]  # Read value from index 0 into x
```

## Related Topics
- [[dinamicArrays|ArrayLists]] — dynamic alternative to arrays
- [[algorithms|Algorithms]] — working with arrays




