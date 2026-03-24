---
description: "Fix Kotlin/Gradle build errors: compilation, Gradle sync, and dependency issues. Parse errors, fix one at a time."
agent: "agent"
---

# Kotlin Build Fix

Fix Kotlin compilation and Gradle build errors incrementally.

## Steps
1. Run `./gradlew build` and capture errors
2. Group errors by type: compilation, Gradle sync, dependency resolution
3. Fix one error at a time with minimal changes
4. Re-run build after each fix to verify

## Common Kotlin Build Errors
- Unresolved references → check imports and dependency declarations
- Type mismatches → verify generic types and null safety
- Gradle sync failures → check version compatibility
- Dependency conflicts → use `dependencyInsight` task to diagnose

{{{ input }}}
