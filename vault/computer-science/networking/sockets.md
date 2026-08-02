---
tags:
  - concepts
  - networkComunication
  - protocols
  - sockets
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Introduction
In a client-server application, the server is located in a host and listens in a specific port.

It waits for incoming connection requests and establishes a communication endpoint (another port) for each client.
# Protocols
## TCP (Transmission Control Protocol)
Connection-oriented, which means that a connection is established before data is sent. It is reliable and guarantees ordered delivery of data. ![[tcpRequest.png]]
## UDP (User Datagram Protocol) 
Connectionless, which means that it sends data without establishing a connection first. It is faster and lighter than TCP, but it does not guarantee delivery, order, or retransmission.

![[udpRequest.png]]
