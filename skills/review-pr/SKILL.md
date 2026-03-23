---
name: review-pr
description: Comprehensive PR review powered by knowledge graph structural analysis. Full blast-radius detection, test coverage verification, and risk assessment across all PR changes.
argument-hint: "[PR number or branch name]"
---

# Review PR

Perform a comprehensive code review of a pull request or branch diff using the knowledge graph for full structural context.

## When to Use

- **PR review** — Before merging any pull request
- **Branch comparison** — Compare feature branch against main/develop
- **Pre-merge verification** — Confirm all changes are safe before merge
- **Team review augmentation** — Provide structural analysis human reviewers may miss

## How It Works

Review PR uses the knowledge graph to provide deep structural understanding of all changes in a PR:

1. Identifies all changed files across all PR commits
2. Maps the complete blast radius using graph traversal
3. Checks test coverage for every changed function
4. Detects breaking changes in public APIs
5. Generates a structured review with file-by-file analysis

## Steps

1. **Identify the changes** for the PR:
   - If a PR number or branch is provided, use `git diff main...<branch>` to get changed files
   - Otherwise auto-detect from the current branch vs main/master

2. **Update the graph** by calling `build_or_update_graph_tool(base="main")` to ensure the graph reflects the current state.

3. **Get the full review context** by calling `get_review_context_tool(base="main")`:
   - Uses `main` (or specified base branch) as the diff base
   - Returns all changed files across all commits in the PR

4. **Analyze impact** by calling `get_impact_radius_tool(base="main")`:
   - Review the blast radius across the entire PR
   - Identify high-risk areas (widely depended-upon code)

5. **Deep-dive each changed file**:
   - Read source of files with significant changes
   - Use `query_graph_tool(pattern="callers_of", target=<func>)` for high-risk functions
   - Use `query_graph_tool(pattern="tests_for", target=<func>)` to verify test coverage
   - Check for breaking changes in public APIs

6. **Generate structured review output**:

   ```markdown
   ## PR Review: <title>

   ### Summary
   1-3 sentence overview

   ### Risk Assessment
   - **Overall risk**: Low / Medium / High
   - **Blast radius**: X files, Y functions impacted
   - **Test coverage**: N changed functions covered / M total

   ### File-by-File Review
   #### <file_path>
   - Changes: description
   - Impact: who depends on this
   - Issues: bugs, style, concerns

   ### Missing Tests
   - function_name in file — no test coverage found

   ### Breaking Changes
   - Public API changes that affect consumers

   ### Recommendations
   1. Actionable suggestion
   2. Actionable suggestion
   ```

## Tips

- For large PRs, focus on the highest-impact files first (most dependents)
- Use `semantic_search_nodes_tool` to find related code the PR might have missed
- Check if renamed/moved functions have updated all callers
- Use `find_large_functions_tool` to flag overly complex additions
- Cross-reference with `query_graph_tool(pattern="inheritors_of")` for interface changes

## Examples

```
# Review current branch against main
> build_or_update_graph_tool(base="main")
> get_review_context_tool(base="main")
> get_impact_radius_tool(base="main")

# Review a specific branch
> build_or_update_graph_tool(base="main")
> get_review_context_tool(base="main")

# Check if all callers of a changed function are updated
> query_graph_tool(pattern="callers_of", target="authenticate")
```
