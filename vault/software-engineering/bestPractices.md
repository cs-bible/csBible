---
tags:
  - concepts
  - bestPractices
  - cleancoding
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# Best practices :LiBadgeCheck:

## 💪 Consistent and clear names

Use descriptive names, using the specific nomenclature of each language, also each type of code has to be named in an specific way.
- **Classes:** Nouns `UserManager` | `PaymentProcessor`
- **Methods / Functions:** Verbs `setUserNumber` |  `makePayment`
- **Variables (Except Booleans):** `userName` | `userNumber`
- **Booleans:** Affirmations `isActive` | `hasPermission`

```java title="naming" group="naming"
public class UserManager { // CapitalCase for classes
	// camelCase for variables and methods
    String userName; // camelCase
    int userNumber = setUserNumber(); //camelCase
    final int MAX_USERS = 100; //UPPERCASE for constants
}
```
```cpp title="naming" group="naming"
class UserManager{ // CapitalCase for Classes
	// camelCase for variables and functions
	String userName; // camelCase
	int userNumber = setUserNumber(); // camelCase
	const int MAX_USERS = 1000; // UPPERCASE for constants
};
```
```python title="naming" group="naming"
class UserManager: # CapitalCase for classes
	MAX_USERS = 100 # UPPERCASE for constants
	# snake_case for variables and methods
	def __init__(self): # snake_case (function init)
		self.user_name = "pepe" # snake_case
		self.user_number = self.set_user_number() # snake_case

```

## :LiAlignJustify: Keep your code clean

More info about it on [[cleanCoding]]
Use indents (4 spaces), short lines and separate code blocks by its use.

```java title="Clean Code" group="clean"
public class PaymentProcessor{
	void makePayment(){
		if (disposable > pay) {
		    processPayment(disposable,pay);
		} else {
		    showError();
		}
	}
	
	void processPayment(int disposable, int pay){
		disposable -= pay;
	}
}
```
```cpp title="Clean Code" group="clean"
class PaymentProcessor{
	void makePayment(){
		if (disposable > pay){
			processPayment(disposable,pay);
		}else{
			showError();
		}
	}
	
	void processPayment(){
		disposable -= pay;
	}
};
```


## :LiBookOpenCheck: Use constants and modifiers properly

Declare constants and encapsulate variables, use getters and setters for modification and accessibility.

```java title="Constants" group="constants"
public class LlmAgent {
	// This constant makes sense as it stablishes a use limit
    private static final double BASIC_MAX_USES = 15;    
}
```
```cpp title="Constants" group="constants"
class Llmagent{
	// This constant makes sense as it stablishes a use limit
	const int BASIC_MAX_USES = 15;
};
```


```java title="Encapsulation" group="encapsulation"
public class BankAccount{
	private double accountBalance = 0;
	private double creditUsage = 400;
	setAccountBalance(1000);
	
	public double getAccountBalance(){
		return accountBalance;
	}
	
	public void setAccountBalance(double accountBalance){
		if (accountBalance >= 0){
			 this.accountBalance = accountBalance;
        }
	}
	
	public double getCreditUsage(){
		return creditUsage;
	}
	
	public void setCreditUsage(double creditUsage){
		if (creditUsage >= 0){
			 this.creditUsage = creditUsage;
        }
	}
}
```
```cpp title="Encapsulation" group="encapsulation"
class BankAccount{
	private:
		double accountBalance = 0;
		double creditUsage = 400;
	public:
		double getAccountBalance(){
			return accountBalance;
		}
		
		void setAccountBalance(double accountBalance){
			if (accountBalance >= 0){
				this -> accountBalance = accountBalance;
			}
		}
		
		double getCreditUsage(){
			return creditUsage;
		}
		
		void setCreditUsage(double creditUsage){
			if(creditUsage >= 0){
				this -> creditUsage = creditUsage;
			}
		}	
};
```

## :LiTelescope: Declare variables and resources on their minimum scope

Variables should be declared on the functions or blocks in which they are used.
Resources should be declared, opened and closed on the functions or blocks in which they are used.

```java title="Minimum Scope" group="scope"
// Good (i is declared inside the for)

for (int i = 0; i < array.size(); i++) {
    String element = array.get(i);
    System.out.println(element);
}

// Bad (i is declared outside the for)

int i = 0
for (i; i < array.size(); i++) {
    String element = array.get(i);
    System.out.println(element);
}

// Good (input is opened and closed within the method)
public void readUserName() {
	Scanner input = new Scanner(System.in);
	
	System.out.print("Enter your name: ");    
	String userName = input.nextLine();
	    
	System.out.println("Hello, " + userName);
	input.close(); 
}

// Bad (input is opened outside the method and is never closed)
Scanner input = new Scanner (System.in);
readUsername(input);
public void readUserName(Scanner input) {
	System.out.print("Enter your name: ");    
	String userName = input.nextLine();
	    
	System.out.println("Hello, " + userName);
	
}
```
```cpp title="Minimun Scope" group="scope"
// Good (i is declared inside the for)

for (int i = 0; i < array.size(); i++){
	string element = array[i];
	cout << element << endl;
}

// Bad (i is declared outside the for)

int i = 0;
for (i; i < array.size(); i++){
	string element = array[i];
	cout << element << endl;
}

// Good (input logic is contained within the method)

void readUserName(){
	string userName;
	cout << "Enter your name: ";
	getline(cin >> ws, userName);
	
	cout << "Hello, " << userName << endl;
}

// Bad (input is passed from outside, harder to manage)

void readUserName(istream& input){
	string userName;
	cout << "Enter your name: ";
	getline(input >> ws, userName);
	
	cout << "Hello, " << userName << endl;
}
```


## :LiFile:  Document your code

Document the intention of your code, not everyone thinks like you

```java title="javadoc (Java Documentation)" group="document"
/**
  * Calculates the average number of an integer ArrayList
  * @param numbers ArrayList used in the calculation
  * @return Average as a double value
 */
 
public double averageCalculation(ArrayList<Integer> numbers) {
    int sum = 0;
    for (int n : numbers) {
	    sum += n;
	}
	return (double) sum / numbers.size();
}
```
```cpp title="Doxygen (C++ Documentation)" group="document"
public:
	/**  
	 * @brief Calculates the average of an integer array 
	 * @param numbers Array used in the calculation 
	 * @return Average as a double value 
	 */
	double averageCalculation(std::vector<int> numbers){
		int sum = 0;
		for (int n : numbers) {
			sum += n;
		}
		
		return (double) sum / numbers.size();
	}
```


## :LiAlertTriangle: Correct exception management

<mark style="background: #ABF7F7A6;">You should never capture a generic exception like </mark> `Exception`
 
Use try-catch blocks (or variations) every time an exception could be thrown.

```java title="try-catch" group="exceptions"
try  {
	Scanner input = new Scanner (System.in)
    int value = input.nextInt();
    input.close();
} catch (InputMismatchException ex) {
    System.err.println("Error reading int value");
}
```
```cpp title="try-catch" group="exceptions"
try {
	int value;    
	std::cin >> value;
    if (std::cin.fail())
        throw std::runtime_error("Error reading int value");
    std::cout << value << std::endl; 
}catch (const std::runtime_error& ex){
	 std::cerr << ex.what() << std::endl;
}
```


Try-with_Resources blocks has the advantage of closing immediately the resources opened in the block.

```java title="Try-with_Resources"
try(Scanner input = new Scanner (System.in)){
	int value = Scanner.nextInt();
	System.out.println(value);
}catch(InputMismatchException ex){
	System.err.println("Error reading input");}
```

Try-catch-Finally blocks ensure that the instructions in the finally statement are executed whether is an exception or not. 

```java title="Try-catch-finally"
public void divide(int a, int b) {
    try {
        int result = a / b;                          
        System.out.println("Result: " + result);
    } catch (ArithmeticException ex) {
        System.err.println("Error: division by zero");
    } finally {
        System.out.println("Operation attempted");
    }
}
```


## 🚫 :LiRepeat: Dry principle (Dont repeat Yourself)

If a block of code is repeated in the code, make a method / function about it

```java title="NOT DRY" group="undry"
int vegetables = 0;
int hotDogs = 0;
Scanner input = new Scanner(System.in);

// this is bad (Repetition of int validation)
try{
	number = input.nextInt();
}catch(InputMismatchException e){
	e.printStackTrace();
}

try{
	hotDogs = input.nextInt();
}catch(InputMismatchException e){
	e.printStackTrace();
}
input.close();
```
```cpp title="NOT DRY" group="undry"
int vegetables = 0;
int hotDogs = 0;

// this is bad (Repetition of int validation)
try {
    std::cin >> vegetables;
    if (std::cin.fail())
        throw std::runtime_error("Error reading int value");
} catch (const std::runtime_error& e) {
    std::cerr << e.what() << std::endl;
    std::cin.clear();
}

try {
    std::cin >> hotDogs;
    if (std::cin.fail())
        throw std::runtime_error("Error reading int value");
} catch (const std::runtime_error& e) {
    std::cerr << e.what() << std::endl;
    std::cin.clear();
}
```


```java title="DRY" group="dryed"
int vegetables = 0;
int hotDogs = 0;
Scanner input = new Scanner(System.in);

// This is good (intWriter method)
vegetables = intWriter();
hotDogs = intWriter();
input.close();

int intWriter(Scanner input){
	int output = 0;
		try{
			output = input.nextInt();
		}catch(InputMismatchException e){
			e.printStackTrace();
		}
	return output;
}
```
```cpp title="DRY" group="dryed"
int vegetables = 0; 
int hotDogs = 0; 
vegetables = intWriter(); 
hotDogs = intWriter();

int intWriter() {
    int output = 0;
    try {
        std::cin >> output;
        if (std::cin.fail())
            throw std::runtime_error("Error reading int value");
    } catch (const std::runtime_error& e) {
        std::cerr << e.what() << std::endl;
        std::cin.clear();
    }
    return output;
}
```


