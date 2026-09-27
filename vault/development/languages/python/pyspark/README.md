---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Introduction

[[languages/python/pyspark/README|Pyspark]] is the Python API for Apache Spark, combining the simplicity of [[languages/python/README|Python]] with Apache Spark's distributed data processing capabilities.

> [!Important] Apache Spark  
> For more information regarding Apache Spark, visit the dedicated folder here

# What is [[languages/python/pyspark/README|Pyspark?]]

Pyspark is the [[languages/python/README|Python]] API designed for Apache Spark. It provides a wide range of tools for processing and analyzing large amounts of data.

Because of this, this framework is useful for projects regarding data analysis, machine learning, and big data workflows.

This allows developers to write scalable and fast programs using the simplicity of [[languages/python/README|Python]] while taking advantage of Apache Spark's distributed processing capabilities.

## Main characteristics

### SparkSQL

Allows the execution of SQL queries over structured and semi-structured data. Using DataFrames, you can combine SQL queries with DataFrame operations and, when necessary, lower-level RDD ([[computer-science/data-structures/README|Resilient Distributed Datasets]]) operations.

### DataFrames

DataFrames are distributed [[computer-science/data-structures/README|data structures]] organized into named columns. They provide a high-level API for manipulating structured and semi-structured data, while Spark's query optimizer can optimize their execution.

This provides an advantage because it allows complex operations to be executed in a more efficient and simple way.

### MLlib

MLlib is the machine-learning library of [[languages/python/pyspark/README|Pyspark]], designed to be scalable and easy to use.

It includes algorithms for classification, regression, clustering, and other machine-learning tasks.

### Processing

[[languages/python/pyspark/README|Pyspark]] can cache or persist intermediate data in memory, reducing the need to repeatedly read and write data to disk.

This can significantly improve performance for workloads that reuse the same data.

## How Pyspark works

[[languages/python/pyspark/README|Pyspark]] applications use Apache Spark's distributed execution architecture. The application communicates with a Spark Driver, which coordinates the execution of tasks across Spark Executors.

This allows data processing to be distributed across multiple machines or processes.