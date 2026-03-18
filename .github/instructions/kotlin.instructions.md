---
applyTo: "**/*.kt,**/*.kts"
---
# Kotlin Instructions

- Use `val` over `var` — prefer immutability
- Use data classes for value objects — `data class User(val name: String)`
- Use sealed classes/interfaces for closed hierarchies
- Prefer `when` over `if-else` chains for exhaustive matching
- Use extension functions for adding behavior to existing types
- Use `?.let {}` and `?.run {}` for safe nullable operations
- Prefer coroutines over callbacks — use `suspend` functions
- Use `Flow` for reactive streams, `StateFlow` for observable state
- Use Kotlin DSL for builders and configuration
- Avoid `!!` (non-null assertion) — handle nullability explicitly
- Use `require()` and `check()` for preconditions
- Use `scope functions` appropriately: `let`, `run`, `with`, `apply`, `also`
