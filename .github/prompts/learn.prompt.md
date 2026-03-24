---
description: "Extract reusable patterns from the current session — error resolutions, debugging techniques, workarounds, and project-specific conventions."
agent: "agent"
---

# Learn — Extract Reusable Patterns

Analyze the current session and extract patterns worth saving for future use.

## What to Extract

1. **Error Resolution Patterns** — What error occurred? Root cause? What fixed it?
2. **Debugging Techniques** — Non-obvious steps, tool combinations that worked
3. **Workarounds** — Library quirks, API limitations, version-specific fixes
4. **Project Conventions** — Codebase patterns discovered, architecture decisions

## Output Format

For each pattern found, produce:

```markdown
# [Descriptive Pattern Name]

**Context:** [When this applies]

## Problem
[What problem this solves — be specific]

## Solution
[The pattern/technique/workaround]

## Example
[Concrete code example]

## When to Use
[Trigger conditions for applying this pattern]
```

## Rules
- Only extract genuinely reusable patterns — not trivial fixes
- Be specific about context and trigger conditions
- Include concrete examples, not abstract descriptions
- Note any caveats or limitations

{{{ input }}}
