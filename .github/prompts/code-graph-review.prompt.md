---
description: "Token-efficient delta code review using knowledge graph blast-radius analysis. Reviews only changed code and its structural impact."
mode: "agent"
---

# Code Graph Review (Delta)

Perform a focused, token-efficient code review of only the changed code and its blast radius using the knowledge graph.

## Steps

1. Update the graph incrementally:
   ```bash
   code-review-graph update
   ```

2. Get the blast radius of recent changes:
   ```bash
   code-review-graph impact
   ```

3. For each changed function, check:
   - Callers that may be affected
   - Test coverage for the changed function
   - Whether public API contracts are preserved

4. Generate a structured review:
   ```markdown
   ## Delta Review

   ### Summary
   One-line overview

   ### Risk Level: Low / Medium / High

   ### Issues
   - [severity] [file:line] Description → Fix

   ### Blast Radius
   X files, Y functions impacted

   ### Test Coverage Gaps
   - function_name — no tests found

   ### Recommendations
   1. Suggestion
   ```

## Advantages
- 5-10x fewer tokens than full-file review
- Automatic blast-radius detection
- Structural context (call chains, inheritance)
- Test gap detection

{{{ input }}}
