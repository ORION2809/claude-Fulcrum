# Claude Fulcrum - GitHub Copilot Instructions

## Project Overview

This is **Claude Fulcrum**, the ultimate AI agent harness for software development.
It provides 25 specialized agents, 112 skills, 62 commands, multi-agent orchestration, and cross-platform support for Claude Code, Codex, Cursor, Copilot, and OpenCode.

## Architecture

- **agents/** - 25 specialized agent definitions for Claude Code
- **skills/** - 108 workflow skills and domain knowledge
- **commands/** - 57 slash commands (/tdd, /plan, /e2e, /code-review, etc.)
- **hooks/** - Trigger-based automations (session persistence, pre/post-tool hooks)
- **rules/** - Language-specific guidelines (common, TypeScript, Python, Go, Kotlin, C++, Perl, PHP, Swift)
- **orchestration/** - Multi-agent swarm coordination via claude-flow
- **mcp-configs/** - MCP server configurations for external integrations
- **scripts/** - Cross-platform Node.js utilities for hooks and setup

## Key Conventions

- Use `npx claude-flow@alpha` for multi-agent orchestration CLI
- All hooks use `continueOnError: true` - they must never block the user
- Agent types: planner, coder, tester, reviewer, architect, security-reviewer, database-reviewer
- Agent format: Markdown with YAML frontmatter (name, description, tools, model)
- Skill format: Markdown with clear sections (When to Use, How It Works, Examples)

## Code Style

- TypeScript strict mode, ESM imports
- Immutable data patterns - never mutate, always return new objects
- Functions under 50 lines, files under 500 lines
- Explicit error handling at every level
- Input validation at system boundaries
- No hardcoded secrets - use environment variables

## Testing

- Run all tests: `node tests/run-all.js`
- Lint: `npm run lint`
- Coverage: `npm run coverage` (80%+ required)

## When Generating Code

- Prefer editing existing files over creating new ones
- Follow the existing directory structure
- Hook scripts must be idempotent and fast (<5s timeout)
- File naming: lowercase with hyphens (e.g., python-reviewer.md, tdd-workflow.md)
