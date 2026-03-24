---
description: "Fix C++ build errors: CMake, compilation, and linker failures. Parse errors, fix one at a time with minimal changes."
agent: "agent"
---

# C++ Build Fix

Fix C++ compilation, CMake, and linker errors incrementally.

## Steps
1. Run `cmake --build build` or `make` and capture errors
2. Group errors by file, fix in dependency order
3. Fix one error at a time with minimal changes
4. Re-run build after each fix to verify

## Common C++ Build Errors
- Undefined references → check include paths and link targets
- Template errors → simplify template instantiation, check SFINAE
- Missing headers → verify `#include` and `target_link_libraries` in CMake
- ODR violations → ensure single definition across translation units
- Linker errors → check library paths and link order

{{{ input }}}
