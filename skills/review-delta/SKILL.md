---
name: review-delta
description: Token-efficient delta code review using knowledge graph blast-radius analysis. Reviews only changed code and its 2-hop impact neighbors.
argument-hint: "[file or function name]"
---

# Review Delta

Perform a focused, token-efficient code review of only the changed code and its structural blast radius.

## When to Use

- **Regular code review** — After making changes, before committing
- **Quick feedback loops** — Get review feedback without sending entire files
- **Large codebase reviews** — When full-file context would exceed token limits
- **CI integration** — Automated reviews that minimize API costs

## How It Works

Instead of sending entire files to the model, Review Delta:

1. Detects changed code via `git diff`
2. Builds a blast-radius map using the knowledge graph (2-hop neighbors)
3. Sends only the changed nodes + their immediate dependents/dependencies
4. Produces a structured review with risk assessment

This achieves **6.8x token reduction** compared to full-file reviews while maintaining **8.8/10 review quality** (vs 7.2/10 without graph context).

## Steps

1. **Ensure the graph is current** by calling `build_or_update_graph_tool()` (incremental update).

2. **Get review context** by calling `get_review_context_tool()`. This returns:
   - Changed files (auto-detected from git diff)
   - Impacted nodes and files (blast radius)
   - Source code snippets for changed areas
   - Review guidance (test coverage gaps, wide impact warnings, inheritance concerns)

3. **Analyze the blast radius** by reviewing `impacted_nodes` and `impacted_files`:
   - Functions whose callers changed (may need signature/behavior verification)
   - Classes with inheritance changes (Liskov substitution concerns)
   - Files with many dependents (high-risk changes)

4. **Perform the review** using the context. For each changed file:
   - Review the source snippet for correctness, style, and potential bugs
   - Check if impacted callers/dependents need updates
   - Verify test coverage using `query_graph_tool(pattern="tests_for", target=<function_name>)`
   - Flag any untested changed functions

5. **Report findings** in structured format:

   ```markdown
   ## Delta Review

   ### Summary
   One-line overview of the changes

   ### Risk Level
   Low / Medium / High (based on blast radius size)

   ### Issues Found
   - [file:line] Issue description → Suggested fix

   ### Blast Radius
   - X files impacted, Y functions affected
   - List of impacted files/functions

   ### Test Coverage Gaps
   - function_name in file — no test coverage found

   ### Recommendations
   1. Actionable suggestion
   2. Actionable suggestion
   ```

## Advantages Over Full-Repo Review

- **5-10x fewer tokens** — Only sends changed + impacted code to the model
- **Automatic blast radius** — Identifies impact without manual file searching
- **Structural context** — Knows who calls what, inheritance chains, import graphs
- **Test gap detection** — Flags untested functions automatically
- **Risk quantification** — Rates changes by number of dependents affected

## Examples

```
# Quick delta review of uncommitted changes
> build_or_update_graph_tool()
> get_review_context_tool()

# Delta review against a specific base branch
> get_review_context_tool(base="develop")

# Check specific function's test coverage
> query_graph_tool(pattern="tests_for", target="calculateDiscount")
```
