> [!note] Exercise
> Create a Python program that asks the user for numbers and stores them in a list. The program stops asking for numbers when the user enters **zero**.
> Display the numbers located at **even positions** in the list.
> Display the numbers in **reverse order**.
> Split the list into **two halves**. If the number of elements is odd, it does not matter which half contains the extra element. Display both halves.
> Display all the elements of the **first half**, except for the **first and last elements**.
> Display the **maximum** and **minimum** values of the **second half**.


```python title="number-collector"
import random
def ask_numbers():
    numbers = []
    while True:
        try:
            number = int(input("Introduce a number (0 finishes the program): "))
            if number == 0:
                break
            numbers.append(number)
        except ValueError:
            print("Please introduce a numeric value")
    return numbers

def process_list(numbers):
    print("Printing the even positions of the list")
    for i, number in enumerate(numbers):
        if i % 2 == 0:
            print(number)
    
    print("printing the list in reverse order")
    for number in reversed(numbers):
        print(number)

    print("Splitting the list")
    split1 = []
    split2 = []
    for number in numbers:
        middle = len(numbers) // 2
        split1 = numbers[:middle]
        split2 = numbers[middle:]
    
    print("Printing both splits")
    for number in split1:
        print(f"Split 1 {number}")
    
    for number in split2:
        print(f"Split 2 {number}")

    for number in split1[1:-1]:
        print(number)
    
    split2max = split2[0]
    split2min = split2[0]
    for number in split2:
        if number > split2max:
            split2max = number
        elif number < split2min:
            split2min = number
    print(f"Maximum: {split2max}")
    print(f"Minimum: {split2min}")
        
numbers = ask_numbers()
if len(numbers) != 0:
    process_list(numbers)
```
