---
tags:
  - sql
  - advanced
  - sqlStatements
  - queries
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---

# :DeMysqlOriginal: Correlated Query

Works with aliases in a table or query, in order to use this alias in the main query

```sql title="correlatedQuerys"
SELECT * FROM players p1 --p1 is the alias for this table (players) -- 
WHERE p1.salary > all (SELECT pc.salary FROM players pc 
	WHERE pc.captain_id = pc.player_id AND pc.team = p1.team);
	--pc is the alias for the subquery -- 
```




