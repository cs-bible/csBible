---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
#  Junit :DeJavaOriginal::LiTestTube:


JUnit is a framework for automatization of unitary tests, it works with annotations (made with @)
## JUnit 5 anottations

### @Test
States a testing method
```Java title="@Test"
@Test
void sumTest(){
assertEquals(8,calculator.add(5,3)); // Compares value expected vs obtained
} 
```

### @Before/AfterEach
Marks test instructions, can set pre-test (BeforeEach) or post-test (Aftereach) instructions

```java cpp title:JUnit_Before/AfterEach
int counter = 0;
@BeforeEach
void before(){
	counter++;
	System.out.println("Start of test" + counter+1);
	calculator = new Calculator();
}

@After
void after(){
	System.out.println("End of test" + counter+1);
}
```

## Directivas junit 5
### @Before/After All
Set instructions for the tests, can be BeforeAll or AfterAll the test (in a single unit)

```java cpp title:Before/AfterAll
@BeforeAll
void start{
	System.out.println("Start of the unitary tests with JUnit5")
}

@AfterAll
void finish{
	System.out.println("End of the unitary tests with JUnit5")
}
```

# Assertions
An assertion is the comparison between a value we expected of the test, and the value we get after doing it.
Can also be a sentence that checks if the code does a specific thing, like throwing an exception.
## Most common assertions in JUnit5
### assertEquals(expectedValue, realValue)

We check if both values are Equal (TRUE IF THEY ARE | FALSE IF NOT)
```java title="assertEquals()"
assertEquals(8, 5 + 3); // TRUE
assertEquals("HEY", "HEY"); // TRUE
```
### assertNotEquals(expectedValue, realValue)
We check if both values are distinct from each other. (TRUE IF THEY ARE NOT EQUAL | FALSE IF THEY ARE EQUAL)
```java title="assertNotEquals()"
assertNotEquals(5, 3 + 3); // TRUE 
assertNotEquals("HEY", "BYE"); // TRUE
```
### assertTrue(condition)
Checks if the condition is true.
```java cpp title:assertTrue
assertTrue(5 > 3); // TRUE
assertTrue(number % 2 == 0); // TRUE IF number is even
```
### assertFalse(condition)
Checks if the condition is false.
```java title="assertFalse()"
assertFalse(5 < 3); // TRUE (Condition is false)
assertFalse(number % 2 == 0); // TRUE IF number is odd (Condition is false)
```
### assertNull(value)
Checks if the value is null.
```java title="assertNull()"
assertNull(value); // True if null
```
### assertNotNull(value)
Checks if the value IS NOT null.
```java title="assertNotNull()"
assertNull(value); // TRUE IF NOT NULL
```
### assertThrows(Exception.class, executable)
Checks if an exception is thrown
```java title="assertThrows"
assertThrows(InputMismatchException.class, () -> {     Scanner scanner = new Scanner("abc"); 
scanner.nextInt();
```

## Related Topics
- [[testing|Testing strategies]]
- [[whiteBoxTesting|White box testing]]
- [[methods|Testing methods]]
