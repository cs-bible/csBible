---
cssclasses:
  - centerImages
  - " centerTitles"
  - " roundedImages"
---
# Python data types
Unlike other [[OOP]] languages, Python uses a dynamic type system: you do not manually define types; they are determined by the value assigned to the variable.

<mark style="background: #FF5582A6;">However</mark>, [[languages/python/README|Python]] has built-int types that are mandatory to know.

There are 2 categories of built-in types
<mark style="background: #FF5582A6;">Mutable</mark> and <mark style="background: #ABF7F7A6;">immutable</mark>

## :DePythonOriginal: Immutable
These cannot be changed after they are created

```py title="mutable integrated types"
number = 10 # int
decimal = 10.1 # float
you_are_learning = True # bool
name = "Jhon" # str
value # None

# tuples
coordinates = (10,20) # tuple of 2 elements
```

## :DePythonOriginal: Mutable
These can be modified in place
```py title="immutable integrated types"
# lists 
numbers = [1, 2, 3] # list of ints
names = ["Jhon", "Ana"] # list of strings

# dictionaries 
person = {
	"name": "Jhon",
	"age": 20
}

empty = {}

person = dict(name="Ana",age=20)

# sets
user_roles = {"admin","moderator","user"} #set of 3 elements
empty = set()
```
