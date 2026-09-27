---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# C data types
C has builtin data types, and types that you add to the program you are creating with [[languages/c/program-structure|librarys]].
## Builtin types
Types that dont need any library to be used, they are embedded in the c language core.
- `char` integer type used for representing characters
- `int` integer signed type used for integer numbers
- `float` floating-comma type with simple precission.
- `double` floating-comma with double precission.
- `_Bool` integer that can represent `0` or `1`
- `void` incomplete type that cannot be completed
## Library-provided types
They are provided mostly from [[languages/c/program-structure|standard librarys]]
`<stdbool.h>` provides macros for working with `_Bool`type, using `true` and `false`
`<stdint.h>` Provides integer types with specified widths, such as `int8_t`, `int32_t`, and `uint64_t`.
`<stddef.h>` Provides common types and macros such as `size_t`, `ptrdiff_t`, `NULL`, and `offsetof`.
## Derived types
- `Array` 
- `Pointer`
- `Function`
## User-defined types
- `struct`
- `union`
- `enum`
## Type aliases
`typedef`
