---
description: "Look up current documentation for a library or framework via Context7 MCP. Returns accurate, up-to-date answers with code examples."
agent: "agent"
---

# Documentation Lookup

Look up current documentation for a library, framework, or API. Uses Context7 MCP to fetch live docs instead of relying on training data.

## Usage
Provide:
1. **Library name** — e.g., Next.js, Prisma, React, Express, Django
2. **Question** — e.g., "How do I configure middleware?", "Auth setup"

## Workflow

1. **Resolve Library** — Identify the library and get its documentation source
2. **Query Docs** — Search the documentation for the user's specific question
3. **Summarize** — Return a concise answer with relevant code examples

## Output
- Short, accurate answer backed by current docs
- Include relevant code snippets
- Mention library version if applicable
- If docs are unavailable, note that the answer may be outdated

{{{ input }}}
