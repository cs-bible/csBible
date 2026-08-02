> [!note] Exercise
> Make a [[01 Index|Python]] program that ask for 10 numbers, and stores them into a list
> Then print all the numbers, indicating NEGATIVE if the number is so.
> You got it? Ok now modify it so it shows REPEATED next to the number if there is more than 1 ocurrence of that number in the list

```python title="solution NEGATIVE" group="lists_madness"
def ask_numbers():
    counter = 0
    numbers = []
    for counter in range(0,10):
        while True:
            try:
                numbers.append(int(input(f"Introduce an integer number ({counter+1} out of 10): ")))
                break
            except ValueError:
                print("Introduce an integer number please")
    return numbers     


def print_numbers(numbers):
    for number in numbers:
        if number < 0:
            print(f"{number} NEGATIVE")
        else:
            print(number)



numbers = ask_numbers()
print_numbers(numbers)
```
```python title="solution REPEATED" group:lists_madness
def ask_numbers():
    numbers = []
    for counter in range(0,10):
        while True:
            try:
                numbers.append(int(input(f"Introduce an integer number ({counter+1} out of 10): ")))
                break
            except ValueError:
                print("Introduce an integer number please")
    return numbers     


def print_numbers(numbers):
    for number in numbers:
        output = str(number)

        if number < 0:
            output += " NEGATIVE"

        if numbers.count(number) > 1:
            output += " REPEATED"

        print(output)

numbers = ask_numbers()
print_numbers(numbers)

```
