#### Constants behave much like in C; except there are other similar keywords that can be used here:

<br>

We need to distinguish between:
* **Variables**:
	* **constants `const`** : The generic use case working as defined here [[computer-science/programming/constants|constants]]

	* **constant expressions `constexpr`**: For constant where the value is known at compile time.
* **Functions**:
	* **`consteval`** : For functions to be evaluated at compile time.
	* **constant expressions `constexpr`**: Can also be used on functions. If used here it means the function will be evaluated at compile time **if possible**.

>[!Warning] `consteval` functions can’t have side effects nor modify non-local variables
```cpp
#include <iostream>

constexpr int sum(int a, int b) { return (a + b); }

consteval int sum2(int a, int b) { return (a + b); }

int	main(void)
{
	int x = 2;
	int y = 3;
	
	constexpr int x_2 = 2;
	constexpr int y_2 = 3;
	
	std::cout << sum(x, y) << '\n';
	std::cout << sum2(x_2, y_2) << '\n';

	return (0);
}
```
→ What’s happening in this program:

`sum()` takes 2, 3 from `x` and `y` ; the compiler **isn’t assured** these are **constants running during compilation**, `sum()` will be evaluated at **run time**.

`sum2()` takes 2, 3 from `x_2` and `y_2`; the compiler **is assured** these are **constants running during compilation** through `constexpr` in line 9 and 10, `sum2()` will be evaluated **during compilation**. Also, `x` and `y` will throw an error if placed on `sum2()`

>[!note] 
>`const` can also be ran at compile time if its defined to be able to do so