---
description: "Fix Rust build errors: cargo build, borrow checker, and clippy failures. Parse errors, fix one at a time, verify after each fix."
agent: "agent"
---

# Rust Build Fix

Fix Rust compilation, borrow checker, and clippy errors incrementally.

## Steps
1. Run `cargo build 2>&1` and capture errors
2. Group errors by file, prioritize borrow/lifetime errors first
3. Fix one error at a time with minimal changes
4. Re-run build after each fix to verify
5. Run `cargo clippy` after build is clean

## Common Rust Build Errors
- Borrow checker violations → restructure ownership, use references
- Lifetime mismatches → add/fix lifetime annotations
- Missing trait implementations → derive or implement manually
- Type mismatches → check generics and trait bounds

{{{ input }}}
