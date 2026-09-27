---
tags:
  - basics
  - codeStructures
  - concepts
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Modular programming :LiPackage:

Modular programming is a key feature of modern programming, pieces of code are abstracted into modules which allow us to use them in different contexts.

## functions
Functions are  pieces of code that are abstracted so they can be used in different parts of the code.
```txt title="functions"
loginHandling(String user, String pswd){
	if((user == dbUser) && (pswd == dbPswd)){ //
		login = true;
	}
}

main(){ // program main code
	loginHandling("jhon","1234"); // Invoking of our function
	dataLoader(); // Invoking of another function
}
```

![[functions.png]]
