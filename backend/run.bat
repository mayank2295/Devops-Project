@echo off
REM Set JAVA_HOME to JDK 17 to avoid compatibility issues
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Using Java 17 from: %JAVA_HOME%
echo.

REM Run the Spring Boot application
mvn spring-boot:run
