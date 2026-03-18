---
description: "Incrementally fix build and type errors with minimal, safe changes. Detects build system, parses errors, fixes one at a time."
mode: "agent"
---

# Build Fix

Incrementally fix build and type errors with minimal changes.

## Step 1: Detect Build System

| Indicator | Build Command |
|-----------|---------------|
| `package.json` with `build` script | `npm run build` or `pnpm build` |
| `tsconfig.json` (TypeScript only) | `npx tsc --noEmit` |
| `Cargo.toml` | `cargo build 2>&1` |
| `pom.xml` | `mvn compile` |
| `build.gradle` / `build.gradle.kts` | `./gradlew compileJava` |
| `go.mod` | `go build ./...` |
| `pyproject.toml` | `mypy .` |

## Step 2: Parse and Group Errors
1. Run the build command and capture output
2. Group errors by file path
3. Sort by dependency order (fix imports/types before logic)

## Step 3: Fix Loop (One at a Time)
For each error:
1. Read the file — see error context (10 lines around)
2. Diagnose — identify root cause
3. Fix minimally — smallest change that resolves the error
4. Re-run build — verify error is gone, no new errors introduced
5. Move to next error

## Guardrails — STOP and ask if:
- A fix introduces more errors than it resolves
- Same error persists after 3 attempts
- Fix requires architectural changes
- Missing dependencies need installation

## Summary Output
```
Errors fixed: X
Errors remaining: Y
New errors introduced: Z (should be 0)
```

{{{ input }}}
