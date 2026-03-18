---
description: "Comprehensive code review for security, quality, and best practices. Reviews uncommitted changes and blocks on critical issues."
mode: "agent"
---

# Code Review

Review all uncommitted changes for security vulnerabilities, code quality, and best practices.

## Review Process

1. Identify changed files via `git diff --name-only HEAD`
2. For each file, check all categories below
3. Generate a severity-rated report
4. Block if CRITICAL or HIGH issues found

## Security Issues (CRITICAL)
- Hardcoded credentials, API keys, tokens
- SQL injection vulnerabilities
- XSS vulnerabilities
- Missing input validation
- Insecure dependencies
- Path traversal risks
- SSRF vulnerabilities

## Code Quality (HIGH)
- Functions > 50 lines
- Files > 800 lines
- Nesting depth > 4 levels
- Missing error handling
- `console.log` / `print()` statements left in
- TODO/FIXME comments without tickets
- Mutation of shared state

## Best Practices (MEDIUM)
- Missing tests for new code
- Accessibility issues (a11y)
- Missing type annotations
- Poor naming conventions
- Code duplication

## Report Format
```
## Code Review Report

### CRITICAL
- [file:line] Issue description → Suggested fix

### HIGH
- [file:line] Issue description → Suggested fix

### MEDIUM
- [file:line] Issue description → Suggested fix

Ready to commit: YES/NO
```

{{{ input }}}
