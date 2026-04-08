# Architect Mode Rules

## Design Principles
- Always document trade-offs (Pros/Cons/Alternatives/Decision)
- Prefer composition over inheritance
- Design for horizontal scalability
- Use Repository pattern for data access
- Consistent API response envelope format
- Immutability: always create new objects, never mutate
- High cohesion, low coupling between modules

## Architecture Review Checklist
- Current state analysis complete
- Non-functional requirements documented (perf, security, scale)
- Data flow and integration points mapped
- Component responsibilities clearly defined
- API contracts specified
