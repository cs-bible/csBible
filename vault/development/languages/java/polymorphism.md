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
#  Polymorphism :DeJavaOriginal:

Polymorphism allows that objects from different classes use the same methods in different ways.
## Types
### Overload (Compile-time)
> [!info] Overload (Compile-time)
> Methods with the same name but different parameters inside the same class, Java chooses between methods based on the way we invoke them.
> 
> Similar to the [[constructors#overload|Constructors overload]]

```java title="overloadPolymorphism"
public class Animal {
    (attributes);
    public void makeNoise(){ // default method
	    System.out.println("GRRR");
    }
    
    public void makeNoise(Dog dog){ // method with Dog as an argument
	    System.out.println("Woof");
    }
}
```
### Overwrite (Runtime)

> [!info] Overwrite (Runtime)
> Subclass rewrites method from Superclass ([[inheritance#dev_java_original Inheritance - Java|Inheritance]]) with `@Override` annotation.
> 
> The specific method is executed based on the object that invokes it
> 
> In the example below if any animal uses the `super.makeNoise()` will print `GRRR` in console, but if a Dog object uses the method `makeNoise()`  the print in the console would be `WOOF` 

```java title="overwritePolymorphism"
public class Animal {
    (attributes);
    public void makeNoise(){ // default
	    System.out.println("GRRR");
    }
}
public class Dog extends Animal{
	@Override   // Reserved word for overwrite
    public void makeNoise(){ 
	    System.out.println("WOOF");
    }
}
```

![[polymorphism.png]]
