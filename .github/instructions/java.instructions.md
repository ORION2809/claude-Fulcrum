---
applyTo: "**/*.java"
---
# Java Instructions

- Use Java 17+ features — records, sealed classes, pattern matching
- Use `record` for immutable data carriers instead of verbose POJOs
- Prefer `Optional<T>` over null returns — never return null for collections
- Use `var` for local variables when the type is obvious from context
- Use `Stream` API for collection transformations — avoid manual loops when clearer
- Use `final` on fields and parameters where mutation is not needed
- Handle exceptions at the right level — don't catch and ignore
- Use `@Override` annotation on all overriding methods
- Prefer composition over inheritance — inject dependencies via constructor
- Use SLF4J/Logback for logging, never `System.out.println`
- Use `@Nonnull`/`@Nullable` annotations for null-safety documentation
- Follow Spring Boot layered architecture: Controller → Service → Repository
