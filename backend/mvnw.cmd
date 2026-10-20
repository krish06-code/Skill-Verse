@REM Maven wrapper for Skill Verse Backend
@REM Requires: JDK 17 at C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot
@REM           Maven 3.9.9 at C:\maven\apache-maven-3.9.9
@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot
set MAVEN_HOME=C:\maven\apache-maven-3.9.9
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%
"C:\maven\apache-maven-3.9.9\bin\mvn.cmd" %*
