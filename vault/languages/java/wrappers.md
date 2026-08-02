---
tags:
  - java
  - advanced
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# Wrappers :DeJavaOriginal:

Object counterparts of primitive data types (such as `int`, `double`, and `boolean`), allowing these values to be used wherever objects are required, such as in collections, generics, and many APIs.
 
![[primitiveTypes]]

> [!danger] Important
> Wrapper classes are **immutable**: once a wrapper object is created, its internal value cannot be changed; operations that seem to modify it actually create a new object.

# Methods

> [!tip] Available Methods
> Inherited from Object: https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html
> Inherited from Number: https://docs.oracle.com/javase/8/docs/api/java/lang/Number.html

```java title="Common methods (Numeric types)"
valueOf(type) / valueOf(String) // → Returns a wrapper  (e.g. Integer, Double)
parse[Type](String) //→ Returns a primitive value(e.g. int) (can throw NumberFormatException)
```

# [[primitiveTypes|Data types]] equivalents

<mark style="background: #FF5582A6;">THE FOLLOWING IS NOT CODE, JUST A VISUAL WAY TO SEE THE CORRELATION</mark>

```java title="equivalents"
Integer = int;
Boolean = boolean;
Byte = byte;
Short = short;
Float = float;
Character = char;
Long = long;
```


## Related Topics
- [[primitiveTypes|Java data types]]
- [[objects| Java objects]]
- [[casting|Type casting]]
- [[dinamicArrays|ArrayLists]] 