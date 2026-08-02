---
tags:
  - java
  - oop
  - advanced
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
#  Constructors :DeJavaOriginal: :LiConstruction:

Constructors are special methods that initialize objects creating them with the `new` reserved statement.
<mark style="background: #ABF7F7A6;">They allways have the same name of the Class and dont return anything</mark>
## Main characteristics
- They can have instructions
- Invoked with `new` 
- Without a constructor, Java automatically creates one without parameters

## Types
```java title="types"
class Dog {     
	Dog() { // Default (no parameters)  
		instructions 
	} 
	Dog(String name){ // With parameters
		instructions
	} 
	Dog(String name, int age){ // Overload
		instructions
	} 
}
```

## Overload
Constructors with the same name, different parameters.

```java title="overloadTypes"
class Dog {     
	Dog(String name){ // With parameter name
		instructions
	} 
	Dog(String name, int age){ // Overload (parameters name & age)
		instructions
	}
	Dog(int age, String name){ // Overload (parameters order changed)
		instructions
	}
	Dog(String name, float age){ // Overload (parameters type changed)
		instructions
	}
	Dog(String name, int age, String breed){ // Overload (+ breed)
		instructions
	}
}
```

## Using this
`this(...)` is used to call another constructor of the same class.
It helps reuse code and avoid repeating instructions.
It must be the first line inside the constructor.

```java title="this"
Dog(String name) { // Receives only name
    this(name, 0); // Calls constructor with name and age, age = 0 by default
}

Dog(String name, int age) { // Main constructor
    this.name = name;
    this.age = age;
}

Dog(int age, String name) { // Same parameters, different order
    this(name, age); // Reuses the main constructor
}

Dog(String name, float age) { // Age with different type
    this(name, (int) age); // Converts float to int and reuses constructor
}

Dog(String name, int age, String breed) { // Adds breed
    this(name, age); // Reuses constructor with name and age
    this.breed = breed;
}
```

## Related Topics
- [[objects|Introduction to objects]]
- [[inheritance#Overload|Constructor overload]]
- [[methods|Métodos en Java]]