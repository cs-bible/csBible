---
tags:
  - advanced
  - dataStructures
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# 2D arrays
Data structures stored in rows and columns, used to organize related values in a grid-like structure.
## Declaration
`type[][] name = new type[rows][columns]` ← General declaration

## Inizialization / Insertion
`int[][] name = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9} }` ← Direct initialization with values

`name[row][column] = value` ← Inserts value in the row and column specified

`name[0][0] = 100` ← Inserts value 100 in row 0 column 0 

`name[0][1] = 50` ← Inserts value 50 in row 0 column 1
## Selection 
`datum = name[row][column]` ← selects the value located in the specified row and column

`datum = name[0][0]` ← selects the value in 0 0 (100 in this specific case)

`datum = name[0][1]` ← selects the value in 0 1 (50 in this specific case)


## Traversion

```txt title="traversion"
for (row from 0 to rows - 1)
    for (column from 0 to columns - 1)
		process name[row][column]
```

Example in java

```java title="traversionExample"
int name[][] = {{1 , 2 , 3},{4 , 5, 6},{7, 8, 9}};
for (int row = 0; row < name.length; row++) {
    for (int column = 0; column < name[row].length; column++) {
        System.out.println(name[row][column]);
    }
}
/**
1  2  3
4  5  6
7  8  9
**/
```

 