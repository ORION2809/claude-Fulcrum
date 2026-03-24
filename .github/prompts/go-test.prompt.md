---
description: "Generate and run Go tests: table-driven tests, subtests, benchmarks, fuzzing. Follow TDD with idiomatic Go patterns."
agent: "agent"
---

# Go Test

Generate idiomatic Go tests following TDD methodology.

## Test Patterns
- **Table-driven tests** with `t.Run()` subtests
- Use `t.Helper()` in test helper functions
- Use `t.Parallel()` for independent tests
- `testify/assert` or standard library assertions
- Use `t.Cleanup()` for teardown

## Structure
```go
func TestFoo(t *testing.T) {
    tests := []struct {
        name     string
        input    InputType
        expected OutputType
        wantErr  bool
    }{
        {"valid input", validInput, expectedOutput, false},
        {"empty input", emptyInput, zeroValue, true},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := Foo(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("unexpected error: %v", err)
            }
            if got != tt.expected {
                t.Errorf("got %v, want %v", got, tt.expected)
            }
        })
    }
}
```

## Coverage
Run: `go test -coverprofile=coverage.out ./...`
View: `go tool cover -html=coverage.out`

{{{ input }}}
