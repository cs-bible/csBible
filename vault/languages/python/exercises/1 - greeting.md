> [!note] Exercise
> Make a python program that ask the user for his name, age and height
> Later print the message “The user $name, who is $age years old, is $height meters tall”

```python title="notHelloWorld basic answer" group="nothelloWorld"
name = input("What is your name")
age = input("How old are you?")
height = input("How tall are you? (centimetres)")
print("The user ",name, " is ", age, " years old and ",height, " centimetres tall")
```
```python title="notHelloWorld Advanced answer" group:nothelloWorld
def ask_data():
    name = None
    age = None
    height = None
    
    while True: ## Do-while like structures in python
        name = input("What is your name: ")
        if validate_data(name, "name"):
            break
    
    while True:
        age = input("How old are you: ")
        if validate_data(age, "age"):
            break
    
    while True:
        height = input("How tall are you (cm): ")
        if validate_data(height, "height"):
            break
    
    return name, age, height


def validate_data(data, field_type):
    if field_type == "name":
        if any(char.isdigit() for char in data):
            print("Error: name can only contain letters")
            return False
        elif len(data.strip()) == 0:
            print("Error: name cannot be empty")
            return False
        else:
            return True
    
    elif field_type in ["age", "height"]:
        try:
            value = int(data)
            if value <= 0:
                print(f"Error:{field_type} must be positive")
                return False
            return True
        except ValueError:
            print(f"Error: {field_type} must be a numeric value")
            return False
    return False

name, age, height = ask_data()

print(f"The user {name} is {age} years old and {height} centimetres tall")
```

