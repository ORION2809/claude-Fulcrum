---
description: "Generate and run Rust tests: unit tests, integration tests, doc tests, property-based tests with proptest."
agent: "agent"
---

# Rust Test

Generate idiomatic Rust tests following TDD methodology.

## Test Patterns
- Unit tests in `#[cfg(test)]` module in same file
- Integration tests in `tests/` directory
- Doc tests in `///` comments
- Property-based tests with `proptest`

## Structure
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_input() {
        let result = process(valid_input());
        assert_eq!(result, expected_output());
    }

    #[test]
    fn test_error_case() {
        let result = process(invalid_input());
        assert!(result.is_err());
    }

    #[test]
    #[should_panic(expected = "invariant violated")]
    fn test_panic_case() {
        dangerous_operation(bad_input());
    }
}
```

## Coverage
Run: `cargo llvm-cov` or `cargo tarpaulin`

{{{ input }}}
