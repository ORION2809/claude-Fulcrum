# Code Graph Build

Build or update the code review knowledge graph for structural code analysis.

1. Check if graph exists:
   - Run: `code-review-graph status` or call `list_graph_stats_tool`
   - If `last_updated` is null, a full build is needed

2. Build or update the graph:
   - **First time**: `build_or_update_graph_tool(full_rebuild=True)` or `code-review-graph build --full`
   - **Updates**: `build_or_update_graph_tool()` or `code-review-graph update`

3. Verify the build:
   - Call `list_graph_stats_tool` and report:
     - Files parsed
     - Nodes and edges created
     - Languages detected
     - Any errors

## Notes

- Graph stored at `.code-review-graph/graph.db` (SQLite, WAL mode)
- Incremental updates use git diff, complete in <2s
- 14 languages: Python, TypeScript, JavaScript, Vue, Go, Rust, Java, C#, Ruby, Kotlin, Swift, PHP, Solidity, C/C++
- Add `.code-review-graphignore` to exclude files/directories

$ARGUMENTS
