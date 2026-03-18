---
description: "Security audit: OWASP Top 10 review, secrets detection, dependency audit, input validation check. Flags vulnerabilities with severity ratings."
mode: "agent"
---

# Security Review

Perform a comprehensive security audit of the codebase or specified files.

## OWASP Top 10 Checklist

1. **Injection** — SQL queries parameterized? User input sanitized? ORMs used safely?
2. **Broken Auth** — Passwords hashed (bcrypt/argon2)? JWT validated? Sessions secure?
3. **Sensitive Data** — HTTPS enforced? Secrets in env vars? PII encrypted? Logs sanitized?
4. **XXE** — XML parsers configured securely? External entities disabled?
5. **Broken Access Control** — Auth on every route? CORS configured? Role checks?
6. **Misconfiguration** — Default creds removed? Debug off in prod? Security headers set?
7. **XSS** — Output escaped? CSP headers? Framework auto-escaping?
8. **Insecure Deserialization** — User input deserialized safely?
9. **Known Vulnerabilities** — Dependencies up to date? `npm audit` / `pip audit` clean?
10. **Insufficient Logging** — Security events logged? Alerts configured?

## Secrets Detection
Search for hardcoded:
- API keys, passwords, tokens
- Connection strings with credentials
- Private keys or certificates
- `.env` files committed to git

## Severity Ratings
- **CRITICAL** — Exploitable vulnerability, fix immediately
- **HIGH** — Security weakness, fix before merging
- **MEDIUM** — Best practice violation, fix when possible
- **LOW** — Minor improvement, optional

## Report Format
```
SECURITY AUDIT: [PASS/FAIL]

CRITICAL: [count]
HIGH: [count]
MEDIUM: [count]
LOW: [count]

[Detailed findings with file:line and suggested fixes]
```

{{{ input }}}
