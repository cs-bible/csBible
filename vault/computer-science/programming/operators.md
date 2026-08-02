---
tags:
  - java
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
#  Operators :LiHash:

## Arithmetic operators
The arithmetic operators are used to perform mathematical operations
> [!NOTE] arithmetic operators
> sum +
> subtraction -
> multiplication *
> division /
> module% (Calculates the rest of a division)

```txt title="arithmetic operators"
c = a + b; 
a = c - b;
a = c * b;
b = c / b;
a = c % b;
```
## Comparison operators

They assess equality and magnitude
> [! NOTE] comparison operators
> Less than <
> greater than <
> Not less than! <
> Not greater than! >
> Less than or equal to < =
> More than or equal to > =
> Distance from! =
> Same as = =

#### Java
```txt title="relational"
int m = 2, n = 5;
boolean res = false;
res = m > n; //res = false
res = m < n; //res = true
res = m >= n; //res = false
res = m <= n; //res = true
res = m == n; //res = false
res = m != n; //res = true
```

## Logical operators
### Logical
> [!NOTE] Logical Operators
> AND && or & (The result is true if both are true)
> OR || (The result is false unless one of the operands is true)
> NOT ! (If the operand is true the result will be false)
> XOR ^ (If one operand is true and the other false the result will be true)

### Logical operators

```txt title="logicalOperators" 
int m = 2, n = 5;
boolean result;
res = m > n && m >= n; //result = false
res = !(m < n || m != n); // result = false
```
## Unary operators
They are applied to a single operand.
> [!NOTE] Unary Operators
> Complement of 1 of the operand ~ 
> Sign change of operand - 
> Operand decrement --
> Operand increment ++
> Not operand !

```txt title="unaryOperators""
int m = 2, n = 5;
m++; //m=3
n--: //n=4
```
  
# Assignment operators   
   They allow assigning values to different operands
  > [!NOTE] Unary Operators              
  > Assignment =
  > Multiplication and assignment \*= 
  > Division and assignment /=                        
  > Module and assignment %= 
  > Addition and assignment += 
  > Subtraction and assignment -=         
  
        
  ```txt cpp title:Assignment_operators                                    
  int num = 5;        
  num += 5; //num = 10, equivalent to num = num + 5                   
  num -= 2; //num = 3, equivalent to num = num - 2     
  num *= 3; //num = 15, equivalent to num = num * 3                   
  num /= 2; //num = 2, equivalent to num = num/2 (remainder = 1)
  num %= 2; //num = 1, equivalent to num = num % 2  
  ```
## Related Topics
- [[selectionStructures|Selection structures (if, switch)]]
- [[primitiveTypes|Java data types]]