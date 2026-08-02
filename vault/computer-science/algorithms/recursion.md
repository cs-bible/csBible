---
cssclasses:
  - centerImages
  - " centerTitles"
  - " roundedImages"
---
 # Recursion
Recursion is a mechanism in wich a function calls itself during its execution. This can be used for many matters, but the main use of this is for re-evaulating conditions with different values, or checking a limit in a condition.

```txt title="recursion_example"
int char_to_integer(char c)
{
	int result = (int) c - '0';
	if (-10 < result && result > 10 )
	{
		print result
	} 
	else
		char_to_integer(result + '0')
}
```






# Related topics
[[backtracking]]