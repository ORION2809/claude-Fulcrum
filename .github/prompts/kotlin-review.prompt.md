---
description: "Review Kotlin code for idiomatic patterns, coroutine safety, Compose best practices, and Android/KMP conventions."
mode: "agent"
---

# Kotlin Review

Review Kotlin code for idiomatic patterns, safety, and Android/KMP best practices.

## Checklist

### Kotlin Idioms
- `val` over `var` — immutability preferred
- Data classes for value objects
- Sealed classes for closed hierarchies
- Extension functions for external type behavior
- Scope functions used appropriately (`let`, `run`, `with`, `apply`, `also`)

### Null Safety
- No `!!` (non-null assertion) — handle nullable types explicitly
- `?.let {}` for safe nullable operations
- `requireNotNull()` / `checkNotNull()` at boundaries only
- Avoid platform types from Java interop

### Coroutines
- Structured concurrency — coroutines tied to appropriate scope
- `SupervisorJob` for independent child failures
- `withContext(Dispatchers.IO)` for blocking operations
- `Flow` for reactive streams, `StateFlow` for observable state
- Proper exception handling in coroutine scopes

### Compose (if applicable)
- State hoisting — state owned by caller, events flow down
- `remember` / `rememberSaveable` for state preservation
- Stable types for `@Composable` parameters to avoid recomposition
- Side effects in `LaunchedEffect` / `DisposableEffect`

{{{ input }}}
