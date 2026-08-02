---
tags:
  - intermediate
  - python
  - dataStructures
cssclasses:
  - centerImages
  - " centerTitles"
  - " roundedImages"
---
# :DePythonOriginal: Slicing
Slicing is an operation used to access or copy a portion of a list.

> [!warning]
> All slicing operations create a new list and do not modify the original one.
## :DePythonOriginal: General syntax
```python title="slicing_syntax"
list[start:end:step]
```

`start` → starting index (included)
`end` → ending index (excluded)
`step` → interval between elements

## :DePythonOriginal: Slicing
```python title="slicing"
numbers = [10, 20, 30, 40, 50]
# Indexes   0   1   2   3   4
# -Indexes -5  -4  -3  -2  -1
split1 = numbers[1:4] # Slicing (start in position 1, end before position 4)

# split1 = [20, 30, 40]

split2 = numbers[2:] # Starts at index 2 and continues to the end of the list

# split2 = [30, 40, 50]

split3 = numbers[:3]  # Starts at the beginning of the list and stops before index 3

# split3 = [10, 20, 30]

split4 = numbers[-3:] # Slicing (Starts -3 end at the last index)

# split4 = [30, 40, 50]
```

## :DePythonOriginal: Step parameter
The `step` parameter states how much Python advanced each time.

```python title="step_slicing"
numbers = [10, 20, 30, 40, 50]
split1 = numbers[::2]
# split1 = [10, 30, 50]
```

# :DePythonOriginal: Uses of slicing
Slicing can be used in many ways, here you can find 2 examples of uses.
### :DePythonOriginal: Inverting a list
```python title=inverting-list"
numbers = [10, 20, 30, 40, 50]

split1 = numbers[::-1]
# split1 = [50, 40, 30, 20, 10]
```

### :DePythonOriginal: Splitting a list
```python title="splitting a list"
numbers = [10, 20, 30, 40, 50]

# Splitting in half
middle = len(numbers) // 2

first_half = numbers[:middle]
second_half = numbers[middle:]

first_three_items = numbers[:3] # Selecting a determined number of items
```

### :DePythonOriginal: Full copy of a list
```python title="copying-list"
numbers = [10, 20, 30]
copy = numbers[:]

# copy = [10, 20, 30]
```
