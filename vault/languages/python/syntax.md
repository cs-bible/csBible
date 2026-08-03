# Type declaration
[[languages/python/README|Python]] is a dynamically typed, non-declarative language, this means that you do not manually define types; they are determined by the value assigned to the variable.

For example:

```py title="typeExample"
name = "John"          # Type: str ("John")
age = 10               # Type: int (10)
knows_python = False   # Type: bool (False)
```
# Code structures
[[languages/python/README|Python]] uses an indentation rule for structures, rather than symbols like [[languages/java/README|Java’s]]   braces`{}`.
There are no semicolons in Python.

<mark style="background: #FF5582A6;">INDENTATION IS MANDATORY, THIS IS THE WAY PYTHON KNOWS HOW TO RUN YOUR CODE PROPERLY </mark>

```py title="codeStructuresSyntax"
name = "John"
def hello_world():
	if name == "John":
		print("Hello ", name)
	else:
		print ("Hello world")
hello_world()
```

> [!important] In [[python - README|Python]] 
> Blocks are defined by identation.
> The `:` marks the start of a code block.
> No semicolons are needed at the end of the line.
# :DePythonOriginal: Python casting

In [[languages/python/README|Python]] the variables can be converted to other types, and the way of doing this is pretty simple.
See [[casting]] for more context about this concept.
## Explicit casting

```python title="explicit casting"
user_input = input("Introduce a number") # input() returns a string
number = int(user_input) # converts user_input to an integer
```

## Implicit casting
```python title="implicit casting"
value = 5 + 2.5 # Python automatically converts 5 to a float
print(value) # 7.5
```

> [!Important]
> Not every value can be converted to every type. Invalid conversions raise exceptions such as [[try_except|ValueError]]

