---
description: "Build or update the code review knowledge graph for structural code analysis. Uses Tree-sitter to parse 14 languages into a persistent SQLite graph."
mode: "agent"
---

# Code Graph Build

Build or incrementally update the persistent code knowledge graph for this repository.

## Steps

1. Check if the graph exists by running:
   ```bash
   code-review-graph status
   ```

2. If no graph exists, perform a full build:
   ```bash
   code-review-graph build --full
   ```

3. If the graph exists, perform an incremental update:
   ```bash
   code-review-graph update
   ```

4. Verify the build succeeded by checking stats:
   ```bash
   code-review-graph status
   ```

Report: files parsed, nodes created, edges created, languages detected, and any errors.

## Notes

- Graph is stored at `.code-review-graph/graph.db`
- Incremental updates use git diff and complete in <2s
- Supports: Python, TypeScript, JavaScript, Vue, Go, Rust, Java, C#, Ruby, Kotlin, Swift, PHP, Solidity, C/C++
- Add patterns to `.code-review-graphignore` to exclude files

{{{ input }}}
