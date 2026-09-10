---
cssclasses:
  - centerImages
  - " centerTitles"
  - " roundedImages"
---
# Introduction
[[languages/c/README|C]] has some reserved words that allow us to modify the type of a variable or how to use that variable
## Type modifiers/specifiers
- `signed` _(default for integer types)_, Specifies that the type can represent both negative and positive values.
- `unsigned` Specifies that the type can only represent non-negative values, allowing it to represent approximately twice as many non-negative values as its signed counterpart.
- `short` Specifies an integer type with a range and size that is no greater than that of `int`.
- `long`  Specifies an integer type with a range and size that is at least as large as `int`. It can also be applied to `double` to form `long double`.
## **Type qualifiers**
- `const` Specifies that an object cannot be modified through the qualified lvalue.
- `volatile` Specifies that the value of an object may change unexpectedly, preventing the compiler from assuming that its value remains unchanged between accesses.
- `restrict` Specifies that, for the lifetime of a pointer, accesses to the referenced object through that pointer are expected to be made only through that pointer (or pointers derived from it), enabling optimizations.
