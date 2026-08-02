---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Introduction 

When working with Threads, so far we have used Thread.sleep(milisTimeout) which makes the thread wait until the timeout is met, but this is quite inefficient, so for that we are going to use the <mark style="background: #FF5582A6;">Thread Scheduling Algorithm</mark>

# Thread Scheduling Algorithm 
## Golden Rules
- Must be Fair and Efficient
- Must minimize response time to the user, especially in more interactive processes
- Must execute the largest number of processes
- Maintain a balance in the use of system resources

## Methods
```java title="join" group="metodos"
Thread.join() //espera que termine el hilo antes de continuar
```
```java title="sleep" group="metodos"
Thread.sleep(int); // Duerme durante el tiempo especificado (ms)
```
```java title="isAlive" group="metodos"
Thread.isAlive(); // T/F si el hilo sigue activo o no
```
```java title="yield" group="metodos"
Thread.yield(); // Sugiere ejecucion de otro hilo (no asegura)
```

## Related Topics
- [[concurrency|Concurrent programming]]
- [[executionQueues]]
- [[processBuilder|Process management]]