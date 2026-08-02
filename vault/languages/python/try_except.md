---
cssclasses:
  - centerImages
  - " centerTitles"
  - " roundedImages"
---
# :DePythonOriginal: Exception handling in python
In [[python - README|Python]] like in any other programming language, [[exceptions]] can and will happen throughout your code. 
A common way to handle exceptions is with a `try-except` block.

```python title="try-except"
try: 
	number = input("Please, type a number")
	value = int(number)
except ValueError:
	print(f"{number} is not a numeric value")
```

`try`: code that may raise an exception.
`except`: code that is executed only if  the specified exception is raised.
`ValueError`: occurs when a function receives an argument of the correct type, but with an inappropriate value (in this case the [[casting|cast]] between `number` and `value`).

## :DePythonOriginal: :LiPlay: Example
```python title="try-except example" group=try-except
try:
	number = input("Please, type a number")
	# User types abc
	value = int(number) # Tries to cast "abc" to an integer (it can`t)
except ValueError:
	print(f"{number} is not a numeric value")
	# "abc" cannot be converted to an integer, so ValueError is raised and this code executes
```
```python title="try-except example" group=try-except
try: 
	number = input("Please, type a number")
	# user types 3
	value = int(number) # casts "3" into 3
except ValueError: # does not happen
	print(f"{number} is not a numeric value")
```
