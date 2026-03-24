---
description: "Fix Go build errors: go build, go vet, and linter failures. Parse errors, fix one at a time, verify after each fix."
agent: "agent"
---

# Go Build Fix

Fix Go build, vet, and linter errors incrementally.

## Steps
1. Run `go build ./...` and capture errors
2. Run `go vet ./...` for static analysis issues
3. Group errors by file, sort by dependency order
4. Fix one error at a time with minimal changes
5. Re-run build after each fix to verify
6. Stop if a fix introduces more errors than it resolves

## Common Go Build Errors
- Unused imports → remove or use `_` import
- Undefined references → check imports, exported names
- Type mismatches → verify interface satisfaction
- Circular imports → restructure package dependencies

{{{ input }}}
