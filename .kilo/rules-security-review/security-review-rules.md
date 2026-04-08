# Security Review Mode Rules

## Mandatory Checks Before Any Commit
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated and sanitized
- [ ] SQL injection prevention (parameterized queries only)
- [ ] XSS prevention (output escaped, CSP configured)
- [ ] CSRF protection enabled on state-changing endpoints
- [ ] Authentication on all protected routes
- [ ] Rate limiting on public endpoints
- [ ] Error messages don't leak internal details

## Critical Patterns to Flag
| Pattern | Severity |
|---------|----------|
| Hardcoded secrets | CRITICAL |
| Shell commands with user input | CRITICAL |
| String-concatenated SQL | CRITICAL |
| innerHTML with user data | HIGH |
| fetch(userProvidedUrl) | HIGH |
| Plaintext password comparison | CRITICAL |
| No auth on route | CRITICAL |
| No rate limiting | HIGH |
