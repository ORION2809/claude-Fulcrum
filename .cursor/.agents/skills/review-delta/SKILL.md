---
name: review-delta
description: Token-efficient delta code review using knowledge graph blast-radius analysis.
argument-hint: "[file or function name]"
---

# Review Delta

Focused, token-efficient code review of only changed code and its blast radius.

## Steps

1. Update graph: `build_or_update_graph_tool()`
2. Get context: `get_review_context_tool()`
3. Analyze blast radius
4. Review each change
5. Report: summary, risk, issues, blast radius, test gaps
