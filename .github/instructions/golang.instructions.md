---
applyTo: "**/*.go,**/go.mod,**/go.sum"
---
# Go Instructions

- Follow effective Go and standard Go conventions
- Use `gofmt`/`goimports` — non-negotiable formatting
- Return errors explicitly — no panics for recoverable errors
- Use `errors.Is()` and `errors.As()` for error checking, not string comparison
- Wrap errors with context: `fmt.Errorf("doing X: %w", err)`
- Use `context.Context` as first parameter for cancellation-aware functions
- Prefer interfaces at the consumer side, not the producer
- Use table-driven tests with `t.Run()` subtests
- Use `t.Helper()` in test helper functions
- Prefer composition over inheritance (embedding)
- Use `sync.Mutex` for simple locking, channels for communication
- Close resources with `defer` immediately after opening
- Use struct literal initialization with named fields
- Keep packages small and focused — one package per concept
