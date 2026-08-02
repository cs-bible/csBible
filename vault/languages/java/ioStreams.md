---
tags:
  - java
  - sockets
  - advanced
  - streams
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
A client and a server often communicate through handlers `InputStream` and `OutputStream` 
The client writes in the `OutputStream` associated to the `socket` and the server reads them from the `InputStream`
The server may as well read write in the `OutputStream` and read from the `InputStream`

![[ioStreams.png]]

