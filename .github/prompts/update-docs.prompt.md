---
description: "Sync documentation with codebase: generate script references, environment variable docs, API docs, and README updates from source-of-truth files."
agent: "agent"
---

# Update Docs

Synchronize documentation with the current codebase state.

## Sources of Truth

| Source | Generates |
|--------|-----------|
| `package.json` / `Makefile` / `Cargo.toml` | Available commands reference |
| `.env.example` | Environment variable documentation |
| Route files / OpenAPI spec | API endpoint reference |
| Source code exports | Public API documentation |
| `Dockerfile` / `docker-compose.yml` | Infrastructure setup docs |

## Steps

1. **Script Reference** — Extract all scripts/commands and generate a reference table
2. **Environment Docs** — Extract env vars, categorize as required/optional, document format
3. **API Reference** — List endpoints, methods, auth requirements, request/response shapes
4. **README Sync** — Ensure README reflects current setup steps, dependencies, and usage
5. **Architecture Notes** — Update component descriptions if structure changed

## Rules
- Generate from source files, don't invent documentation
- Preserve existing manual documentation sections
- Flag outdated docs that conflict with current code
- Use consistent markdown formatting

{{{ input }}}
