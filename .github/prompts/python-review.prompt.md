---
description: "Review Python code for PEP 8 compliance, Pythonic idioms, type hints, security, and performance."
mode: "agent"
---

# Python Review

Review Python code for idiomatic patterns, security, and performance.

## Checklist

### Style & Idioms
- PEP 8 compliant (use `ruff` or `black` for formatting)
- Type hints on all function signatures
- Pythonic patterns: comprehensions, context managers, generators
- `dataclasses` or `pydantic` for data structures
- `pathlib.Path` over `os.path`

### Error Handling
- Specific exceptions caught (never bare `except:`)
- Custom exceptions for domain errors
- Proper `finally` or context managers for cleanup
- Logging with `logging` module, not `print()`

### Security
- No `eval()`, `exec()`, or `pickle.loads()` on untrusted data
- SQL queries use parameterized statements
- User input validated before processing
- No hardcoded secrets

### Performance
- Generator expressions for large datasets
- `collections.defaultdict` / `Counter` where appropriate
- Avoid mutable default arguments (`def f(x=[])`)
- Use `functools.lru_cache` for expensive computations with repeated inputs

{{{ input }}}
