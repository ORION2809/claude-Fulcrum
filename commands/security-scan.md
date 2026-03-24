---
description: Run a security scan workflow across code, configs, and harness surfaces
---

# /security-scan

Run a focused security review before merge or release.

## What It Covers

- Secrets and credential leakage
- Dangerous config changes
- Dependency and supply-chain risk
- Input validation and injection exposure
- Auth, session, and permission mistakes

## Suggested Flow

1. Inspect the current diff and touched files.
2. Run the security reviewer on high-risk surfaces first.
3. Check config, hook, and MCP changes for trust-boundary regressions.
4. Summarize findings by severity.
5. Propose concrete remediations and follow-up verification.

## Remediation Checklist

- Remove or rotate exposed secrets immediately.
- Restore protected config if a quality tool was bypassed.
- Add validation, escaping, or parameterization at boundaries.
- Re-run tests, lint, and targeted security checks after fixes.

## Example

```text
/security-scan auth refactor before release
```
