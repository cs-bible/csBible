---
cssclasses:
  - centerImages
  - " centerTitles"
  - " roundedImages"
---
# :DePythonOriginal: Python code structure
:DePythonOriginal: Python structures itself into  packages, modules and classes, but with a more flexible and simple syntax than [[codeStructure|Java]] has, for example.

> [!info] Package
> A file directory that contains modules

> [!info] Modules
> A `Module` is basically a Python file named for example `file.py` 
> 1 module can have <mark style="background: #FF5582A6;">MANY</mark> classes in the same file 

> [!info] Classes
> Classes in python, as in many other [[OOP]] languages, serve as a template for creating objects, each with their attributes and methods.

```python title="classExample"
class Person:
	def __init__(self,name,age):
		self.name = name
		self.__age = age
	
	def greet(self):
		print(f"Hello, im {self.name}") 
```

`def __init__(self,name,age)` is the [[pythonConstructor|constructor]] for this class
`self` → reference to the object that is created 
`name` → public Instance attribute
`__age` → private instance attribute. 
	The double underscore `__` (name mangling) indicatess that this attribute is intended to be private by convention
	

