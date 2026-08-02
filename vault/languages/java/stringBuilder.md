---
tags:
  - java
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# StringBuilder :DeJavaOriginal: :LiTextCursor: :LiConstruction:


It is a mutable class that allows to create and manipulate character sequences efficiently
> [! info] Methods
> Available here https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html

```java title="StringBuilder "
StringBuilder sb = new StringBuilder ("Hello"); // object with hi written
sb.append ("World:"); // Add World:) TO THE FINAL OF THE STRING (appendix)
sb.insert (4, ","); // It is inserted in position 4 a, "(insert)
sb.delete (10,12); // ELIMINATE IN THE RANK OF POSITION 10-12 (delete)
System.out.println (sb.toString ()); // prints the object as a string
```

## Related Topics
- [[primitiveTypes|String vs primitive types]]
- [[wrappers|Wrapper classes]]
- [[constants|String constants]]
