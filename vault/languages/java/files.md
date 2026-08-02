---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

#  java.io :DeJavaOriginal: 
The java.io package of [[javi's/developer/languages/java/01 - Index|Java]] has several classes to support file work, depending on:
- Type of content
- File access mode

## By type of content
* * *
> [!note] Files with characters (text)
> They are accessible from any editor that offers the operating system, have exclusively characters

> [!note] Binary records (bytes)
> These are those files that do not contain characters, but bytes, can only be opened by specific programs, which know how to decode those bytes.

##  According to access mode
* * *
> [!note] Sequential records
> The information is stored as a continuous chain of bytes, so to access 1 you must access all those prior to that

> [!note] Alegible records
> You can access a specific file position directly without having to go through previous data, for example using Arrays is a random access mode

# File class (java.io)
* * *
Regardless of the file type, Java defines a class within the package that java.io represents a file or directory within a file system


# # Jfilechooser
It is a class like Scanner works with different methods, consult them here:
https://docs.oracle.com/javase/8/docs/api/javax/swing/JFileChooser.html
```java title="JFileChooser example"
private File openFile(){ 
	JFileChooser chooser = new JFileChooser();
	chooser.setMultiSelectionEnabled(false);
	File file = null;
	int selection = chooser.showOpenDialog(null);
	try {
		if(selection == JFileChooser.APPROVE_OPTION){
			file = chooser.getSelectedFile();
		}
	}catch(HeadlessException e){
		return null;
	}
	
	return file;
}
```

```java title="explanation Part 1"
private File openFile(){ // Method that returns a file
        JFileChooser chooser = new JFileChooser(); // chooser declaration.
	(Instructions);
	return File (variable)
```

```java title="explanation Part 2"
chooser.setMultiSelectionEnabled(false); //Toggles multiselection off
	File file = null; //file variable initialized to null
	int selection = chooser.showOpenDialog(null); // shows window and assings the exit code of the method to selection variable
```

```java title="explanation Part 3"
try {
	if(selection == JFileChooser.APPROVE_OPTION){ // accept button is clicked
		fichero = chooser.getSelectedFile(); //file = file choosed.
	}
	}catch(HeadlessException e){ 
		return null;
}
```

