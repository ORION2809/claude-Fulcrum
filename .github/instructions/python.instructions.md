---
applyTo: "**/*.py,**/*.pyi"
---
# Python Instructions

- Follow PEP 8 style — use `black` or `ruff format` for formatting
- Use type hints on all function signatures (`def foo(x: int) -> str:`)
- Prefer `dataclasses` or `pydantic` for data structures — avoid raw dicts
- Use `pathlib.Path` instead of `os.path` for file operations
- Prefer f-strings over `.format()` or `%` formatting
- Use context managers (`with`) for resource management (files, connections)
- Use `logging` module instead of `print()` for diagnostics
- Prefer list/dict/set comprehensions over `map()`/`filter()` when readable
- Use `enum.Enum` for constants with fixed values
- Handle exceptions explicitly — never bare `except:` without specifying type
- Use `__all__` to control public exports from modules
- Prefer `collections.abc` abstract types in type hints (`Sequence`, `Mapping`)
- Use `pytest` for testing, `pytest-cov` for coverage
