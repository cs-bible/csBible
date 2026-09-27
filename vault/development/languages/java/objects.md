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
# Introduction to Objects :DeJavaOriginal: :LiCuboid: 

## Classes
In Java, source code is divided into classes, each class has its specific methods and attributes, as well as its constructor or constructors.
```java cpp title:Example_class
public class Animal {
    protected String nombre;
    Animal(String nombre) {
        this.nombre = nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
```
## Objects
An object in Java is an instance of a class, with its attributes (each with its type) and methods defined in the class. Objects are created through constructors.
> [!Tip] Tip
> We can imagine a class is like a cookie mold, and an object is each of the cookies we can form with that mold, with almost identical characteristics, but they are different cookies.

---

### Example of an object (Creation and invocation)

## Constructor
```java cpp title:Example_object_Constructor
class Persona {
    public void saludo() { 
        System.out.println("Hola " + nombre);
    }
    Persona(String nombre) {
        // Constructor that indicates you only need a String nombre to create a Persona object
    }
};
```

```java cpp title:Example_object_Creation_and_invocation
Persona p = new Persona("Ana");
Ana.saludo(); // Will print Hello Ana
```
