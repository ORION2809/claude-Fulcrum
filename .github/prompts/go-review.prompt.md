---
description: "Review Go code for idiomatic patterns, error handling, concurrency safety, and performance. Checks for common Go pitfalls."
agent: "agent"
---

# Go Review

Review Go code for idiomatic patterns, correctness, and performance.

## Checklist

### Error Handling
- All errors checked — no `_ = err` ignoring
- Errors wrapped with context: `fmt.Errorf("doing X: %w", err)`
- Custom error types where appropriate
- `errors.Is()` / `errors.As()` instead of string comparison

### Concurrency
- No goroutine leaks — all goroutines have exit paths
- Channels properly closed by senders
- `sync.Mutex` used correctly (lock/unlock in same function, deferred unlock)
- `context.Context` passed for cancellation
- No data races (run `go vet -race`)

### Idioms
- Short variable names in small scopes, descriptive in larger ones
- Interfaces defined at consumer, not producer
- Avoid `init()` — prefer explicit initialization
- Use `io.Reader`/`io.Writer` interfaces over concrete types
- Prefer table-driven tests

### Performance
- Avoid unnecessary allocations in hot paths
- Pre-size slices when length is known: `make([]T, 0, n)`
- Use `strings.Builder` for string concatenation
- Avoid reflection in performance-critical code

{{{ input }}}
