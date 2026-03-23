# Code Graph Review

Token-efficient delta code review using the knowledge graph for blast-radius analysis.

1. **Update graph** — `build_or_update_graph_tool()` (incremental, <2s)

2. **Get review context** — `get_review_context_tool()` returns:
   - Changed files (auto-detected from git diff)
   - Impacted nodes (blast radius via graph traversal)
   - Source snippets for changed areas
   - Review guidance (test gaps, impact warnings)

3. **Analyze blast radius**:
   - Functions whose callers changed → verify signature/behavior
   - Classes with inheritance changes → Liskov substitution
   - Files with many dependents → high-risk

4. **Review each change**:
   - Check correctness, style, potential bugs
   - Verify callers/dependents need no updates
   - Check test coverage: `query_graph_tool(pattern="tests_for", target=<func>)`
   - Flag untested changed functions

5. **Report findings**:
   - Summary, risk level, issues found
   - Blast radius map
   - Test coverage gaps
   - Actionable recommendations

## Advantages

- 6.8x fewer tokens than full-file review
- Automatic blast-radius detection
- Structural context (call chains, inheritance)
- Test gap detection

$ARGUMENTS
