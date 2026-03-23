---
name: code-review-graph
description: Build and maintain a persistent knowledge graph of your codebase using Tree-sitter AST parsing. Enables token-efficient code reviews with blast-radius analysis across 14 languages.
argument-hint: "[full | update | status]"
---

# Code Review Graph

Build, update, and query a persistent knowledge graph of your codebase for structural code understanding and token-efficient reviews.

## When to Use

- First-time setup — Initialize the knowledge graph for a new repository
- After major refactoring — Rebuild the graph after large-scale code changes
- Before code reviews — Ensure the graph is current for blast-radius analysis
- Debugging dependency issues — Trace callers, callees, and impact chains

## MCP Tools

| Tool | Purpose |
|------|---------|
| `build_or_update_graph_tool` | Build or incrementally update the graph |
| `get_impact_radius_tool` | Blast radius of recent changes |
| `query_graph_tool` | Query: callers_of, callees_of, imports_of, tests_for, etc. |
| `get_review_context_tool` | Changed code + blast radius + review guidance |
| `list_graph_stats_tool` | Graph statistics |
| `find_large_functions_tool` | Functions exceeding line threshold |
| `semantic_search_nodes_tool` | Natural language node search |
| `embed_graph_tool` | Generate vector embeddings |
| `get_docs_section_tool` | Optimized workflow instructions |

## Steps

1. Check status: `list_graph_stats_tool`
2. Build/update: `build_or_update_graph_tool(full_rebuild=True)` or `build_or_update_graph_tool()`
3. Verify: `list_graph_stats_tool` — confirm files, nodes, edges, languages

## Performance

- Full build: ~30s for 100K LOC
- Incremental update: <2s
- Token reduction: 6.8x fewer tokens for reviews
