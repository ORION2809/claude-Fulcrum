---
description: "Run comprehensive verification: build, types, lint, tests, secrets audit, console.log check, and git status. Produces pass/fail report."
agent: "agent"
---

# Verification

Run comprehensive verification on the current codebase in this exact order:

## Checks (in order)

1. **Build Check** — Run the build command. If it fails, report errors and STOP.
2. **Type Check** — Run TypeScript/type checker. Report all errors with file:line.
3. **Lint Check** — Run linter. Report warnings and errors.
4. **Test Suite** — Run all tests. Report pass/fail count and coverage percentage.
5. **Console.log Audit** — Search for `console.log` / `print()` in source files.
6. **Git Status** — Show uncommitted changes and modified files since last commit.

## Output Format

```
VERIFICATION: [PASS/FAIL]

Build:    [OK/FAIL]
Types:    [OK/X errors]
Lint:     [OK/X issues]
Tests:    [X/Y passed, Z% coverage]
Secrets:  [OK/X found]
Logs:     [OK/X console.logs]

Ready for PR: [YES/NO]
```

If any critical issues exist, list them with fix suggestions.

## Modes
- Default: All checks
- Quick: Only build + types
- Pre-commit: Checks relevant for commits
- Pre-PR: Full checks plus security scan

{{{ input }}}
