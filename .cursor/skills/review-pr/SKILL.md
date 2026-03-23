---
name: review-pr
description: Comprehensive PR review powered by knowledge graph structural analysis.
argument-hint: "[PR number or branch name]"
---

# Review PR

Comprehensive code review of a pull request using the knowledge graph for structural context.

## Steps

1. Identify changes: `git diff main...<branch>`
2. Update graph: `build_or_update_graph_tool(base="main")`
3. Get context: `get_review_context_tool(base="main")`
4. Analyze impact: `get_impact_radius_tool(base="main")`
5. Deep-dive: callers_of, tests_for for high-risk functions
6. Report: summary, risk, file-by-file review, test gaps, recommendations

## Tips

- Focus on highest-impact files first (most dependents)
- Use `semantic_search_nodes_tool` to find related code
- Check renamed/moved functions have updated callers
