---
applyTo: "**/*.rs,**/Cargo.toml"
---
# Rust Instructions

- Use `clippy` lints — `cargo clippy -- -D warnings`
- Prefer `Result<T, E>` over `panic!()` — handle errors with `?` operator
- Use `thiserror` for library errors, `anyhow` for application errors
- Prefer `&str` over `String` in function parameters when no ownership needed
- Use `derive` macros: `Debug`, `Clone`, `PartialEq` on data types
- Prefer iterators and combinators over explicit loops when idiomatic
- Use `Option` instead of sentinel values — embrace `None`
- Mark types `#[non_exhaustive]` for future-proof public enums/structs
- Use `cargo fmt` for formatting — no manual style debates
- Prefer `Arc<Mutex<T>>` for shared mutable state across threads
- Write doc comments (`///`) on all public items
- Use `#[cfg(test)]` module for unit tests in the same file
