---
tags:
  - java
  - xml
  - dataStructures
  - advanced
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# DOM





# SAX




# JAXB
`JAXB` needs a valid xml schema (also called  `xsd` )

It processes that schema and instantly generates an object of each element of the XML, bounding it for the class regardind that specific element

for example
```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="book">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="title" type="xs:string"/>
        <xs:element name="author" type="xs:string"/>
      </xs:sequence>
      <xs:attribute name="published_in" type="xs:gYear" use="required"/>
    </xs:complexType>
  </xs:element>
</xs:schema>
```




# XPATH
