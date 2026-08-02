---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
tags:
  - concepts
  - exceptions
  - basics
---
An exception is an event that occurs during program execution when an error or unexpected condition is encountered.
> [!example]
> If you try to cast an `String` containing “abc” into an `integer` the conversion can not be completed and  an exception occurs
```
value = "abc"
number = CAST_TO_INTEGER(value)

Exception: Invalid conversion
```

## Why exceptions exist

Exceptions allow programs to detect and handle errors without immediately terminating execution. Instead of crashing, a program can react to unexpected situations and decide how to continue.

Common situations that may generate exceptions include:

- Invalid type conversions.
- Division by zero.
- Accessing elements outside a collection's bounds.
- Opening files that do not exist.
- Network communication failures.
- Invalid user input.
## Generating exceptions

Programs can also generate their own exceptions when a specific condition is not valid.

```
IF age < 0 THEN
    InvalidAgeException
END IF
```

This allows developers to detect incorrect states and prevent invalid operations.

## Benefits of exceptions

- Separate error-handling logic from normal program logic.
- Prevent unexpected program termination.
- Improve code readability and maintainability.
- Allow applications to recover from certain errors.
- Provide detailed information about failures.

Exception handling is a fundamental concept in modern software development and is supported by most programming languages.

# Related
[[try_except|Exception handling in Python]]
[[tryblocks|Exception handling in Java]]
