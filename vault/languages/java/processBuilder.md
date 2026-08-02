---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Processbuilder

> [! summary] ProcessBuilder
> Serves to launch processes from java, has its own methods, consult them in the link below
> https://docs.oracle.com/javase/8/docs/api/java/lang/ProcessBuilder.html
# Example of code with processbuilder (Sequential)

```java title="Sequential ProcessBuilder"
package structuredSequentialLaunching;
	import java.io.IOException;
	import java.util.InputMismatchException;
	import java.util.Scanner;

public class main {
	public static void launchProcess(int num, String path){
	ProcessBuilder builder = new ProcessBuilder(path);
	
	for (int i = 0; i < num; i++) {
		try {
			builder.start();
			System.out.println("Process Output " + (i+1) + " = [Correct] ");
		} catch (IOException e) {
			System.out.println("Error while launching the process");
		}
	}
}
	public static void main(String[] args) {
		System.out.println("Start");
		Scanner input = new Scanner (System.in);
		int executions = 0;
		String path = "C:\\Program Files\\Oracle\\VirtualBox\\VirtualBox.exe";
		System.out.println("Please, state the numer of times you want to execute this process");
		
		do {
			try {
				executions = input.nextInt();
			} catch (InputMismatchException ex) {
				System.out.println("An integer number was expected");
				input.next();
			}
		} while (executions < 1);
		launchProcess(executions, path);
		System.out.println("Bye");
		input.close();
		}
}
```

# Example code with process builder (Concurrent)
```java title="Clase launchProcess"
package lanzamientoPOOConcurrente;

import java.io.IOException;

public class launchProcess {
    public static int processCounter = 0;
    ProcessBuilder process;
    public String path;
    public int number;
    
    launchProcess(String path, int number){
        this.path = path;
        this.number = number;
        processCounter++;
    }
    
    public void execute(int number){
        System.out.println("Executing process number " + number);
        process = new ProcessBuilder(this.path);
        try {
            process.start();
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error with the process" + number);
        }
    }
}
```

```java title="Clase Principal"
package lanzamientoPOOConcurrente;

import java.util.ArrayList;
import java.util.Scanner;

public class main {
final static String path = "\"C:\\Program Files\\Oracle\\VirtualBox\\VirtualBox.exe\"";
final static int 0 = 0;
public static void main(String[] args) {
    System.out.println("Start");
		Scanner input = new Scanner (System.in);
        int number = 0;
        ArrayList<launchProcess> processList = new ArrayList<launchProcess>();
		System.out.println("Please, state the numer of times you want to execute this process");
		number = input.nextInt();
        for(int i = 0; i <number; i++){
            launchProcess process = new launchProcess(path, i+1);
            processList.add(process);  
        }

        for (launchProcess process : processList) {
            process.execute(process.number);
        }
        input.close();  
}
}
```
