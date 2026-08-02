---
tags:
  - concepts
  - basics
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# Casting :LiArrowLeftRight:
Is the process of converting from one data type to another
2 types
## Implicit casting
Automatic conversion, occurs when data is  automatically converted without the programmer having to do it explicitly.
```java title="implicitCasting" group="implicit"
int n = 42;
long m = n; //Widening: int → long (safe)
```
```cpp title="implicitCasting" group="implicit"
int n = 42;
long m = n; //Widening: int → long (safe)
```
```c title="implicitCasting" group="implicit"
int n = 42;
long m = n; //Widening: int → long (safe)
```
```js title="implicitCasting" group="implicit"
let n = 42;
let m = n; //Type coercion automatic
```
## Explicit casting
Manual, occurs when the programmer explicitly indicates that the conversion must be performed. Necessary when converting from a larger data type to a smaller one to avoid data loss.

```java title="explicitCasting" group="explicit"
double n2 = 42.7;
int m2 = (int) n2; //Narrowing: double → int (truncates)
```
```cpp title="explicitCasting" group="explicit"
double n2 = 42.7;
int m2 = static_cast<int>(n2); //Narrowing: double → int
```
```c title="explicitCasting" group="explicit"
double n2 = 42.7;
int m2 = (int) n2; //C-style cast: double → int (truncates)
```
```js title="explicitCasting" group="explicit"
let n2 = "42.7";
let m2 = Number(n2); //String → number (truncates)
```
```python title="explicitCasting" group="explicit"
n2 = 42.7
m2 = int(n2) #float → int (truncates decimal)
```
