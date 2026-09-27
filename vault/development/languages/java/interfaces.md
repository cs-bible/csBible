---
cssclasses:
  - " centerTitles"
  - " roundedImages"
  - centerImages
---
# Introduction
An interface in java is a specific type of structure, like a class, that contains a “behaviour contract” for a class.
[[languages/java/README|Java]] contains different interfaces such as `Runnable`, `List` ,`Set`and many more others, each with their specific behaviour and characteristics.

# Declaration
An interface is declared with the reserved keyword `interface`and it’s name.
```java title=interfaceDeclaration
public interface Animal{
	void makeSound();
}
```

# Usage
An interface is implemented within a class with the reserved keyworkd `implements`and the interface’s name. 
```java title=interfaceUsage
public class Dog implements Animal{

	@Override
	void makeSound(){
		System.out.println("WOOF");
	}
}
```

## Key points 


> [!attention] Implementation requirements
> When you implement a interface, Java requires you to override at least 1 method of the interface. This is                                                                                                                                                                                    


