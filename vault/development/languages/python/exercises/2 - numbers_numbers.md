
> [!note] Exercise
> Make a python program that ask for an integer N between 10 and 20
> Print all integer numbers between 1 and N
> Print all integer numbers between 30 and N (reverse order)

```python title="numbers_numbers"
def ask_number():
    while True:
        number = int(input("Enter a number between 10 and 20:\n"))
        if 10 <= number <= 20:
            return number
        else:
            print(f"{number} is not between 10 and 20")


number = ask_number()

for i in range (number,21):
    print(i)
    
print("=================")

for i in range(30,number - 1,-1):
    print(i)
```

