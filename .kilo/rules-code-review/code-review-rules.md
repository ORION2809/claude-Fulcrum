# Code Review Mode Rules

## Confidence-Based Filtering
- Report only if >80% confident it's a real issue
- Skip stylistic preferences unless they violate project conventions
- Consolidate similar issues into one finding
- Prioritize: Security > Correctness > Performance > Style

## Review Checklist Priority
1. **CRITICAL** — Security vulnerabilities, data loss risks
2. **HIGH** — Logic bugs, missing error handling, race conditions
3. **MEDIUM** — Performance issues, missing tests, code complexity
4. **LOW** — Naming, formatting, minor style issues

## Process
1. Run git diff to see all changes
2. Read full files for context (not just changed lines)
3. Check imports, dependencies, and call sites
4. Apply checklist top-down by severity
