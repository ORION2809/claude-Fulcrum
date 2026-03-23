---
name: review-delta
description: Token-efficient delta code review using knowledge graph blast-radius analysis.
argument-hint: "[file or function name]"
---

# Review Delta

Focused, token-efficient code review of only changed code and its blast radius.

## Steps

1. Update graph: `build_or_update_graph_tool()`
2. Get context: `get_review_context_tool()` — changed files, impacted nodes, snippets, guidance
3. Analyze blast radius — callers, inheritance, dependents
4. Review each change — correctness, tests, callers affected
5. Report: summary, risk level, issues, blast radius, test gaps, recommendations

## Advantages

- 5-10x fewer tokens than full-file review
- Automatic blast-radius detection
- Structural context (call chains, inheritance)
- Test gap detection
