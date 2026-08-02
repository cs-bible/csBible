
> [!note] Exercise
> Make a python program that ask for 3 numbers, and show which one is the minimum value and the maximum, also it has to state if the numbers are odd or even. DONT USE LISTS

```python title="numbers numbers 2"
def ask_numbers():
    while True:
        number = input()
        try:
            value = int(number)
            break
        except ValueError:
            print(f"{number} is not a numeric value")
    return value

def order_number(number1,number2,number3):
    if number1 > number2:
        max = number1
        min = number2
    else:
        max = number2
        min = number1
    if max > number3:
        if number3 < min:
            min = number3
    else:
        max = number3
    
    return max,min

def number_is_even(number):
    return number % 2 == 0

print("Introduce the first number")
number1 = ask_numbers()
print("Introduce the second number")
number2 = ask_numbers()
print("Introduce the third number")
number3 = ask_numbers()

max,min = order_number(number1,number2,number3)

print(f"The greatest number is {max}, and the lower number is {min}")

if number_is_even(number1):
    print(f"{number1} is even")
else:
    print(f"{number1} is odd")

if number_is_even(number2):
        print(f"{number2} is even")
else:
    print(f"{number2} is odd")

if number_is_even(number3):
        print(f"{number3} is even")
else:
    print(f"{number3} is odd")
```
