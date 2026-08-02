---
tags:
  - java
  - snippets
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# Snippets java :DeJavaOriginal: :LiLayoutTemplate:
## setCharset()
### <mark style="background: #FF5582A6;">Includes Characters utf-8 in System.out</mark>

```java title="setCharset()"
private static void setCharset() {
	try {
		System.setOut(new PrintStream(System.out, true, StandardCharsets.UTF_8.name()));
	} catch (UnsupportedEncodingException e) {
		e.printStackTrace();
	}
}
```

## Input validation

```java title="int_validation" group="validation"
public static int readInt(Scanner input) {
	int output;
	boolean exit = false;
	output = INI_INT;
				
	do {
		try {
			output = input.nextInt();
			exit = true;
		} catch (InputMismatchException ex) {
			System.out.println("Input not valid, an integer number was expected");
			input.next();
		}
	} while (!exit);
	return output;
}
```
```java title="validate float" group="validation"
public static float readFloat(Scanner input) {
	float output;
	boolean exit = false;
	output = INI_FLOAT;
	do {
		try {
			output = entrada.nextFloat();
			exit = true;
		} catch (InputMismatchException ex) {
			System.out.println("Input not valid, a float number was expected");
			input.next();
		}
	} while (!exit);
	return output;
}
```

## generateNumber()

```java title="generarNum()" group=genNum
public static int generateNumber(int max, int min) {
	int output;
	output = (int) (Math.random() * (max - min + 1) + min);
	return output;
}
```
```java title="Float generarNum()" group=genNum
public static float generateNumber(int max, int min) {
	float output;
	output = (int) (Math.random() * (max - min + 1) + min);
	return output;
}
```
