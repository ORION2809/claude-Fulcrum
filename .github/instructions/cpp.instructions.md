---
applyTo: "**/*.cpp,**/*.hpp,**/*.cc,**/*.hh,**/*.cxx,**/*.h,**/CMakeLists.txt"
---
# C++ Instructions

- Follow C++ Core Guidelines (isocpp.github.io)
- Use smart pointers (`unique_ptr`, `shared_ptr`) — no raw `new`/`delete`
- Prefer `std::string_view` over `const std::string&` for read-only parameters
- Use `auto` for complex types but be explicit for readability when needed
- Prefer RAII for resource management — no manual cleanup
- Use `constexpr` for compile-time constants and computations
- Prefer range-based `for` loops over index-based when possible
- Use `std::optional` instead of sentinel values or out-parameters
- Use `std::variant` over unions for type-safe alternatives
- Mark single-argument constructors `explicit` to prevent implicit conversions
- Use `[[nodiscard]]` on functions where ignoring return value is likely a bug
- Use `std::move` judiciously for performance-critical moves
- Prefer `<algorithm>` and `<ranges>` over hand-written loops
