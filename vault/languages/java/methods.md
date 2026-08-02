---
tags:
  - java
  - basics
  - codeStructures
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Methods :DeJavaOriginal: :LiFunctionSquare:

[[javi's/developer/concepts/functions|Functions]] in Java are called methods

```java title="methodSytntax"
public type name([parameters]){ 
	instructions;
	[return]; // States the result that has to be delivered from this method
}
```

## Method types (Most common ones, syntax is similar between them)
###  int
Must return an int value
```java title="intMethod"
public int add([int a, int b}){
	int output = 0;
	output = a+b;
	return output; 
}
```
### float
Returns a float value
```Java title=floatMethod"
public float divide([float a, float b]){
    float output = 0.0f;
    output = a / b;
    return output;
}
```

### double
Returns a double value
```java title="doubleMethod"
public double round([double number]){
    double output = 0.0;
    output = Math.round(number * 100.0) / 100.0;
    return output;
}
```
### String
Returns a String .
```java title="stringMethod"
public String concat([String a, String b]){
    String output = "";
    output = a + b;
    return output;
}
```

### void
No return
```java title="voidMethod"
public void print([String message]){
    System.out.println(message);
    // No return
}
```

### Array[] (int example)
Returns an array
```java title="arrayMethod"
public int[] createArray([int size]){
    int[] output = new int[size];
    return output;
}
```
## Related Topics
- [[codeStructure|Java code structure]]
- [[constructors|Constructors]]
- [[inheritance#Overload|Method overload]]
- [[accessModifiers|Java acces modifiers]]