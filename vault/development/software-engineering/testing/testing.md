---
cssclasses:
  - centerImages
  - " roundedImages"
  - " centerTitles"
---
# Code testing :LiTestTubes:
Code testing is the process of verifying that software behaves as expected, detecting errors early, and ensuring quality before deployment. It involves several stages, from testing individual units to validating the entire system.

## 1. Unit tests
Test cases for every module programmed.
> [!summary]
> Unit tests verify that each individual module or component works correctly in isolation from the rest of the system. They focus on small sections of code and are usually automated with frameworks such as [[jUnit|JUnit]] or PyTest.
## 2. Integration tests
Test how the different modules that had already complied with the Unit tests interact between each other.

> [!summary]
> Integration testing ensures that communication and data flow between modules work correctly. It detects interface errors, configuration issues, and problems caused by module dependencies.

> [!summary] Tests
> 1. Incrementals: Progressive addition of modules
> 2. Non-incrementals: All modules at the same time (not recommended)
## 3. Validation tests
User performs these tests.
> [!summary]
> Alpha testing is conducted under developer supervision in a controlled environment. Beta testing is performed by end-users in real-world conditions to gather feedback and find unexpected issues.

> [!summary] Tests
> 1. Alpha: Developer is present during the testing and noting all bugs
> 2. Beta: User tries the software, annotates the bugs and sends the report to the developer.

## 4. System tests
> [!summary] Tests
> 1. Recovery: The software is evaluated in terms of how it performs a full recovery if a failure occurs
> 2. Security: Verify that there is no way of illegal access into the system.
> 3. Stress test: How the software performs in high-demand situations

> [!highlights] Info
> Other important system tests include Performance testing (evaluates speed and response time), Usability testing (ensures ease of use), Compatibility testing (checks operation across different platforms), and Installation testing (verifies correct setup and configuration).
## Related Topics
- [[whiteBoxTesting|White box testing]]
- [[jUnit|JUnit for unit testing]]
- [[softwareDesignModels|Software design models]]
