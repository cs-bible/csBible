---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
tags:
  - mysql
  - recipes
  - java
  - databases
---

# Java - database connection (jdbc) :DeJavaOriginal: :LiDatabase:

For content regarding SQL syntax visit[[languages/sql/01 - Index|01 - Index|SQL]]and for concepts regarding databases basics check the `databases` files under the `concepts` folder

```java title="jbdc"
public class Database{
    public String url = null;
    public String user= null;
    public String pswd = null;
    public Database(){ 
        url = "jdbc:mysql://localhost:3305/centroestudios";
        user= "root";
        pswd = "root";
    }
    static Connection createConnection(String url, String user, String pswd){
    Connection con1 = null;
    try{
        con1 = DriverManager.getConnection(url, user, pswd);
        if(con1!=null){
            System.out.println("Connection sucessful");
        }
    }catch(SQLException ex){
        ex.printStackTrace();
    }
    return con1;
	}
}
```

> [!important]
> Mandatory parameters for the method `getConnection()` of the `DriverManager` class
> <sub>(Taking into account that parameters can have the name you want to)</sub>
> url → url of the database
> user → we will connect with this user
> pswd → password of the user we want to connect with



```java title="connection"
    private void conButtonActionPerformed(java.awt.event.ActionEvent evt) {                                             
        databaseHandler = new Database();
        Connection con1 = BBDD.createConnection(gestorBBDD.url,gestorBBDD.user,gestorBBDD.pswd);
        if(con1 !=null){
            textarea1.setText("Conexion correcta a la base de datos");
        }
    }  
```
