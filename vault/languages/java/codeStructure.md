---
tags:
  - java
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Classes and packages in Java  :DeJavaOriginal: 
## Classes
Minimum organization unit in Java 
## Packages
A package is a group of classes Java must have minimum 1 package with 1 class in order to work
## Structure
```java title="javaBasicStructure"
package example;  // Mandatory statement
public class Example{
	// executes automatically when a class is instanced (AT LEAST 1 MANDATORY)
	public static void main (String[] args){
		System.out.println ("Hello world");
	}
}
```
 
![[javaCodeStructure.png]]

> [!attention] Important
> MainClass MUST HAVE a main method (public static void main(String[] args))

## Related Topics
- [[objects|Objects and Classes]]
- [[args|Args in main method]]
- [[OOP|Object-Oriented Programming]]
