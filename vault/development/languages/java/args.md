---
tags:
  - java
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# :DeJavaOriginal:  Args

When we create a main method it always has this structure

```java title="Main"
public static void main(String[] args){
	(Instructions);
}
```

`String[] args` is an [[arrays|array]] of strings that insert parameters into the main method
Those parameters could be for example commands on the system cli, or parameters needed by the main method, and we can work with them using the methods associated to the arrays

```java title="argsExecution"
package example_args;

public class Example {
	public static void main(String[] args) {
		if(args.length < 2) {
			System.out.println("[Example] - FATAL: 2 or more args were expected");
		System.exit(-3);
		}else {
			String name = args[0];
			String greeting = args[1];
			System.out.println(greeting + " " + name);
			System.out.println("[Example] - Program executed correctly");
			System.exit(0);
		}
}
}
```

# Running with args
args : Javi , “Hello there”

```batch prompt=cmd title="cmdExecution_withEnviromentalVariables" group="bash"
cd Exercises\2nd Quarter\example_args\bin
java example_args.Example Jhon "Hello there"
```
```bash group="bash"  prompt="zsh" path="~/xerve/example_args"
java -cp bin example_args.Example Javi "Hello there"
```

