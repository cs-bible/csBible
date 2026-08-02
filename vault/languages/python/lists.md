---
tags:
  - dataStructures
  - python
  - basics
cssclasses:
  - " centerTitles"
  - " roundedImages"
  - centerImages
---
# :DePythonOriginal: lists in Python
## :DePythonOriginal: What is a list?
Lists are a data structure used to store multiple values in memory. Lists in [[python - README|Python]] have specific characteristics.
- Ordered
- Mutable
- Allow duplicated elements
- Can contain different types of values

```python title="lists_example"
numbers = [1, 2, 3]
names = ["Jack", "Louise", "Mark"]
mixed = [1, "Hello", True]
```

## :DePythonOriginal: List creation
In [[python - README|Python]] you can create lists in different ways.
- Empty list
- list with elements
- casting with `list()`

```python title="list_creation"
empty = []
numbers = [1, 2, 3]
letters = list("Python")
```

## :DePythonOriginal: Access to items
You can access an item in a list using its index (position)..

### Positive index
They start from the position 0 <mark style="background: #FF5582A6;">Beginning of the list</mark>
```python title="positive_index"
numbers[0]
numbers[1]
```

### Negative index
They start from last position <mark style="background: #FF5582A6;">End of the list</mark>
```python title="negative_index"
numbers[-1]
numbers[-2]
```

## :DePythonOriginal: Item addition and modification
They are 3 main ways to add/modify items in a list.
- Iterating over the list
- Adding an item manually 
- Modifying an item manually

```python title="addition_modification"
numbers = []

for i in range(10): # Iterating addition
	numbers.append(i)

for i in range(len(numbers)):
	numbers[i] *= 2 # Iterating modification (via indexes)

numbers.append(0) # Adds an item at the end of the list

numbers.insert(3,0) # Manual addition (inserts to position 3)

numbers[0] = 1 # Manual modification
```

## :DePythonOriginal: Iterating over a list
There are 2 ways of iterating over a list. 
- Using indexes
- Using a for-each loop 

```python title="iterating"
numbers = []

for i in range(len(numbers)): # Via index 
	print(numbers[i])

for number in numbers: # Via for-each loop
	print(number)
```


# Related topics
- [[arrays]]
- [[lists_operations]]
- [[lists_slicing]]