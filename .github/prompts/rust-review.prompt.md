---
description: "Review Rust code for ownership correctness, error handling, unsafe usage, and idiomatic patterns."
agent: "agent"
---

# Rust Review

Review Rust code for safety, idioms, and performance.

## Checklist

### Ownership & Lifetimes
- No unnecessary `clone()` calls
- Prefer borrowing (`&T`, `&mut T`) over ownership transfer when caller retains data
- Lifetime annotations correct and minimal
- No dangling references

### Error Handling
- `Result<T, E>` used instead of `panic!()`
- `?` operator for propagation
- Custom error types with `thiserror`
- `anyhow` for application-level errors

### Unsafe
- Every `unsafe` block has a `SAFETY:` comment explaining the invariant
- Minimize scope of `unsafe`
- No undefined behavior
- FFI boundaries properly documented

### Idioms
- Use `clippy` — zero warnings
- Prefer iterators over manual indexing
- Use `Option` instead of sentinel values
- Derive common traits: `Debug`, `Clone`, `PartialEq`
- Use `#[must_use]` on functions where ignoring return is likely a bug

### Performance
- Avoid allocations in hot loops
- Use `Cow<'_, str>` to avoid unnecessary string copies
- Consider `SmallVec` for small collections
- Profile before optimizing

{{{ input }}}
