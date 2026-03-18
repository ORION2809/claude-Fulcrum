---
description: "Review C++ code for memory safety, modern idioms, concurrency, and performance following C++ Core Guidelines."
mode: "agent"
---

# C++ Review

Review C++ code for safety, modern idioms, and performance.

## Checklist

### Memory Safety
- Smart pointers used — no raw `new`/`delete`
- RAII for all resource management
- No dangling pointers or references
- Move semantics used correctly
- No use-after-free or double-free

### Modern C++ (C++17/20/23)
- `std::optional` instead of sentinel values
- `std::variant` instead of unions
- `std::string_view` for read-only string parameters
- Structured bindings where appropriate
- `constexpr` for compile-time computations

### Concurrency
- No data races — proper synchronization
- `std::mutex` with `std::lock_guard` / `std::scoped_lock`
- Prefer `std::atomic` for simple shared state
- No blocking in async flows
- Thread-safe initialization of singletons

### Performance
- Avoid unnecessary copies — use references and move semantics
- Pre-allocate containers with `reserve()`
- Use `<algorithm>` and `<ranges>` over hand-written loops
- Profile before optimizing
- Consider cache locality for data structures

### Build
- Clean compilation with `-Wall -Wextra -Wpedantic`
- Zero `clang-tidy` warnings in modified code
- Address sanitizer clean

{{{ input }}}
