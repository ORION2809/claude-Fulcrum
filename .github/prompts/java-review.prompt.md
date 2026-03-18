---
description: "Review Java/Spring Boot code for layered architecture, JPA patterns, security, and concurrency."
mode: "agent"
---

# Java Review

Review Java and Spring Boot code for architecture, patterns, and best practices.

## Checklist

### Architecture
- Layered architecture: Controller → Service → Repository
- DTOs for API boundaries — never expose entities directly
- Constructor injection (not field injection with `@Autowired`)
- Services are stateless
- Transactions at service layer with `@Transactional`

### JPA/Hibernate
- N+1 query prevention (`JOIN FETCH`, `@EntityGraph`)
- Proper use of `FetchType.LAZY` vs `EAGER`
- `Pageable` for list endpoints
- Avoid bidirectional relationships when unidirectional suffices
- Use `@Version` for optimistic locking when needed

### Security
- Authorization on every endpoint (`@PreAuthorize` or method security)
- Input validation with `@Valid` and Bean Validation
- No SQL injection — use Spring Data repositories or parameterized queries
- CORS properly configured
- Secrets externalized (not in `application.yml`)

### Java Idioms
- `Optional<T>` instead of null returns
- `record` for immutable DTOs
- Streams for collection transformations
- `final` on fields and parameters where possible
- SLF4J for logging — no `System.out.println`

{{{ input }}}
