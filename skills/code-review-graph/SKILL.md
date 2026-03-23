---
name: code-review-graph
description: Build and maintain a persistent knowledge graph of your codebase using Tree-sitter AST parsing. Enables token-efficient code reviews with blast-radius analysis across 14 languages.
argument-hint: "[full | update | status]"
---

# Code Review Graph

Build, update, and query a persistent knowledge graph of your codebase for structural code understanding and token-efficient reviews.

## When to Use

- **First-time setup** — Initialize the knowledge graph for a new repository
- **After major refactoring** — Rebuild the graph after large-scale code changes
- **Before code reviews** — Ensure the graph is current for blast-radius analysis
- **Debugging dependency issues** — Trace callers, callees, and impact chains
- **Understanding unfamiliar codebases** — Visualize structure and relationships

## How It Works

The code-review-graph system parses your entire codebase using Tree-sitter and stores the resulting AST relationships in a SQLite knowledge graph. It tracks:

- **Nodes**: Functions, classes, methods, modules, interfaces, enums, type aliases
- **Edges**: CALLS, IMPORTS_FROM, INHERITS, IMPLEMENTS, CONTAINS, TESTED_BY, DEPENDS_ON
- **Languages**: Python, TypeScript, JavaScript, Vue, Go, Rust, Java, C#, Ruby, Kotlin, Swift, PHP, Solidity, C/C++

### MCP Tools Available

| Tool | Purpose |
|------|---------|
| `build_or_update_graph_tool` | Build from scratch or incrementally update the graph |
| `get_impact_radius_tool` | Get blast radius of recent changes (files + functions affected) |
| `query_graph_tool` | Query relationships: callers_of, callees_of, imports_of, tests_for, etc. |
| `get_review_context_tool` | Get changed code + blast radius + review guidance in one call |
| `semantic_search_nodes_tool` | Search nodes by natural language (requires embeddings) |
| `embed_graph_tool` | Generate vector embeddings for semantic search |
| `list_graph_stats_tool` | Show graph statistics (nodes, edges, languages, last updated) |
| `get_docs_section_tool` | Retrieve optimized workflow instructions for skills |
| `find_large_functions_tool` | Detect functions exceeding a line threshold |

### Incremental Updates

After the initial full build, the graph updates incrementally using git diff to detect changed files. Only modified files are re-parsed, making updates complete in under 2 seconds even on large codebases.

## Steps

1. **Check current status**:
   ```
   Call list_graph_stats_tool to check if a graph exists
   ```

2. **Build or update**:
   ```
   # First time (full build):
   build_or_update_graph_tool(full_rebuild=True)

   # Subsequent updates (incremental):
   build_or_update_graph_tool()
   ```

3. **Verify** by calling `list_graph_stats_tool` and confirming:
   - Files parsed count matches expected
   - Node and edge counts are reasonable
   - All project languages are detected

## Configuration

- Graph database stored at `.code-review-graph/graph.db` in repository root
- Ignore patterns via `.code-review-graphignore` (same syntax as `.gitignore`)
- MCP server: `uvx code-review-graph serve` (stdio transport)

## Performance

- Full build: ~30s for 100K LOC repositories
- Incremental update: <2s for typical edits
- Token reduction: 6.8x fewer tokens needed for reviews vs full-file context

## Examples

```
# Check if graph exists
> list_graph_stats_tool
{"files_parsed": 0, "last_updated": null}

# Full build
> build_or_update_graph_tool(full_rebuild=True)
{"files_parsed": 142, "nodes_created": 1847, "edges_created": 3291}

# Query callers of a function
> query_graph_tool(pattern="callers_of", target="handlePayment")
[{"name": "processOrder", "file": "src/orders.ts", "line": 45}, ...]

# Find large functions
> find_large_functions_tool(threshold=50)
[{"name": "parseConfig", "file": "src/config.ts", "lines": 87}, ...]
```
