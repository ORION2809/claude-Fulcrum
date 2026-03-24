---
description: "Analyze test coverage, identify gaps in files below 80%, and generate missing tests to reach target coverage."
agent: "agent"
---

# Test Coverage

Analyze test coverage and generate missing tests to reach 80%+ coverage.

## Step 1: Detect Test Framework

| Indicator | Coverage Command |
|-----------|-----------------|
| `jest.config.*` or package.json jest | `npx jest --coverage` |
| `vitest.config.*` | `npx vitest run --coverage` |
| `pytest.ini` / `pyproject.toml` | `pytest --cov=src --cov-report=term` |
| `Cargo.toml` | `cargo llvm-cov` |
| `go.mod` | `go test -coverprofile=coverage.out ./...` |

## Step 2: Analyze Coverage
1. Run the coverage command
2. List files below 80% coverage, sorted worst-first
3. For each, identify untested functions, missing branch coverage, edge cases

## Step 3: Generate Missing Tests

Priority order:
1. **Happy path** — Core functionality with valid inputs
2. **Error handling** — Invalid inputs, missing data, failures
3. **Edge cases** — Empty, null, boundary values
4. **Branch coverage** — Each if/else, switch case

## Rules
- Follow existing test patterns in the project
- Place tests adjacent to source files (or project convention)
- Mock external dependencies
- Each test must be independent — no shared mutable state

{{{ input }}}
