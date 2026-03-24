---
description: "Fix Java/Maven/Gradle build errors: compilation, dependency, and Spring Boot startup failures."
agent: "agent"
---

# Java Build Fix

Fix Java/Maven/Gradle build and compilation errors incrementally.

## Steps
1. Run `mvn compile` or `./gradlew compileJava` and capture errors
2. Group errors by type: compilation, dependency, annotation processing
3. Fix one error at a time with minimal changes
4. Re-run build after each fix to verify

## Common Java Build Errors
- Missing imports → add correct import statements
- Dependency not found → check `pom.xml` / `build.gradle` declarations
- Annotation processing → verify processor configurations
- Spring Boot startup → check `@ComponentScan`, `@Configuration`, bean conflicts

{{{ input }}}
