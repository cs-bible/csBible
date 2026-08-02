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


# Inheritance - Java :DeJavaOriginal: 
Inheritance occurs when a class is an abstraction of another, sharing attributes, but also having some exclusive ones.

> [!summary] 
> Allow definition of subclasses from a superclass (abstraction)
> 
> Subclasses inherit attributes and methods from the superclass
> 
> Allow creation of Hierarchy’s and relations between classes


<mark style="background: #FF5582A6;">TO REFERENCE AN ELEMENT THAT IS DEFINED IN BOTH CLASSES YOU HAVE TO USE THE KEYWORD</mark> `super` <mark style="background: #FF5582A6;">TO USE THE SUPERCLASS ELEMENT </mark>


![[inheritance.png|286]]
<div class="page-break" style="page-break-before: always;"></div>

```java title="inheritanceSuperclass"
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

```java title="inheritanceSubclass"
public class Dog extends Animal {
    private String race;
    
    public Perro(String name, String race) {
        super(name);  // superclass constructor
        this.race = race;
    }
    
    public void hacerSonido() {
        System.out.println(name + " woofs");
    }
}

Perro milu = new Perro("Milu", "Border Collie");
milu.hacerSonido();  // milu woofs
```

<div class="page-break" style="page-break-before: always;"></div>

[[polymorphism]]



