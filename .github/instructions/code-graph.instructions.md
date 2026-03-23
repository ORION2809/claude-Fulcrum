---
applyTo: "**"
---
# Code Review Graph Instructions

This project has the **code-review-graph** MCP server available for structural code analysis.

## Available MCP Tools

When the `code-review-graph` MCP server is enabled, these 9 tools are available:

| Tool | Purpose |
|------|---------|
| `build_or_update_graph_tool` | Build from scratch or incrementally update the knowledge graph |
| `get_impact_radius_tool` | Get blast radius of recent changes |
| `query_graph_tool` | Query relationships: callers_of, callees_of, imports_of, tests_for, inheritors_of, importers_of, children_of, file_summary |
| `get_review_context_tool` | Get changed code + blast radius + review guidance |
| `semantic_search_nodes_tool` | Search nodes by natural language (requires embeddings) |
| `embed_graph_tool` | Generate vector embeddings for semantic search |
| `list_graph_stats_tool` | Show graph statistics |
| `get_docs_section_tool` | Retrieve optimized workflow instructions |
| `find_large_functions_tool` | Find functions exceeding a line threshold |

## When to Use

- **Code reviews** — Use `get_review_context_tool` for token-efficient reviews with blast-radius
- **Impact analysis** — Use `get_impact_radius_tool` before merging or refactoring
- **Dependency tracing** — Use `query_graph_tool` to trace callers, callees, and test coverage
- **Onboarding** — Use `list_graph_stats_tool` and `query_graph_tool(pattern="file_summary")` to understand codebase structure

## Setup

The MCP server runs via: `uvx code-review-graph serve`

The graph auto-updates via PostToolUse hooks on Write/Edit/Bash operations.
