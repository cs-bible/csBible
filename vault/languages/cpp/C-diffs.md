> [!info] List with examples from exceptions in which C++ differs from C:

* **==Declaring and utilizing a string==**

:DeCOriginal: The size of the string can be determined at runtime (VLA):
```c
 char *str;
 str = "abc";
```
:DeCplusplusOriginal: The size of the string **must** be determined at compile time:
```cpp
const char *str;
str = "abc"
```

* **==Aliases==**

:DeCOriginal: To give an existing type a different name you must use `typedef`:
  ```c
  typedef int i;
  int main(void)
  {
       i var = 2;
       return(0);
  }
  ```
  :DeCplusplusOriginal: For c++, you use `using`:
```cpp
using i = int;
int main(void)
{
	i var = 2;
	return (0);
}
```

* ==**Smaller differences**==

	1.  In C++, you can use `auto` as a type as long as you assign in the same line you define the variable. What it does is self explanatory.
	2.  You can use `{}` instead of `=` in order to assign the variable a value.
	3.  You can (should) use `new` and `delete` instead of `malloc` and `free`, though they’re functionally the same thing.