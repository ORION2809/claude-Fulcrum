---
description: "Run the quality pipeline: detect language/tooling, run formatter checks, lint/type checks, and produce a remediation list."
agent: "agent"
---

# Quality Gate

Run the quality pipeline on the specified files or project.

## Pipeline

1. **Detect Language/Tooling** — Identify the project's language, formatter, linter, and type checker
2. **Run Formatter Checks** — Verify code is properly formatted (Prettier, Black, gofmt, rustfmt, etc.)
3. **Run Lint Checks** — Execute linter with project config (ESLint, Ruff, golangci-lint, clippy, etc.)
4. **Run Type Checks** — Check for type errors (tsc, mypy, go vet, etc.)
5. **Produce Remediation List** — Concise list of issues with file:line and suggested fixes

## Options
- Default: check current directory
- `--fix`: auto-format/fix where supported
- `--strict`: fail on warnings

## Output
```
QUALITY GATE: [PASS/FAIL]

Format:  [OK/X issues]
Lint:    [OK/X issues]
Types:   [OK/X errors]

Remediation:
- [file:line] Issue → Fix
```

{{{ input }}}
