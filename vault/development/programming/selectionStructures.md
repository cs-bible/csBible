---
tags:
  - codeStructures
  - basics
  - concepts
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Selection Structures :LiBoxSelect:
> [!danger] IMPORTANT
> Check [[computer-science/programming/operators|operators]] for better undestanding of the syntax

Statements that allow us to select and execute specific blocks of code while other arts are ignored
# If

Checks if a condition is true and executes the code inside if it is
```txt
if (rains == true)
		coat = true
```

# If else
Checks if a condition is true and if not executes the code inside the else statement
```txt
if (rains == true){
	coat = true
}else{
	coat = false
}
```

# If else if
Checks a condition
if (condition == True) → executes 1st if
else if (other condition == True) → Executes 2nd if
else ….

```txt title="ifElseif"
if (rains == true){
	coat = true
else if(cold == true){
	jacket = true
}
}
```

# Switch

It works based on a variable and its value.
<mark style="background: #FFF3A3A6;">IMPORTANT: There must be a</mark> `default` <mark style="background: #FFF3A3A6;">statement inside the switch, and each</mark> `case` <mark style="background: #FFF3A3A6;">must have its</mark> `break`, <mark style="background: #FFF3A3A6;">otherwise the switch logic will not execute properly</mark>
```txt title="switchSyntax"
int option = 0;
option = sc.nextInt();

switch(option){
	case 1:
		instructions of case 1
		break;
	case 2:
		instructions of case 2
		break;
	case 3:
		instructions of case 3
		break;
	default:
		Instructions if none of the others apply
		break;
}
```
