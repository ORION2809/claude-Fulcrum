# ECC for Kimi Code

This supplements the root `AGENTS.md` with Kimi Code-specific guidance.

## Runtime

When running under Kimi Code, treat Kimi as the active coding agent platform. Use
`.kimi/agents/fulcrum.yaml` as the default Fulcrum agent file and `.kimi/mcp.json`
as the project-local MCP baseline.

Start from the repository root:

```powershell
kimi --agent-file .kimi/agents/fulcrum.yaml --mcp-config-file .kimi/mcp.json
```

## Skills

Kimi Code discovers project skills from `.agents/skills/`, so keep shared skills
there. Use `.kimi/skills/` only for Kimi-specific overrides or command-style
wrappers.

Set `merge_all_available_skills = true` in Kimi config when you want Kimi to
merge `.kimi/skills/`, `.claude/skills/`, `.codex/skills/`, and `.agents/skills/`
instead of selecting only the first brand directory.

## Search And Reading

Prefer Kimi's `Grep` tool, or `rg` through `Shell`, for repository search. Read
nearby code before editing and keep changes scoped to the requested behavior.

## Planning

Use Kimi plan mode when the user asks for a plan, when the task is architecturally
ambiguous, or when a change touches multiple major subsystems. Plan mode should
produce a concrete file-by-file implementation plan before edits begin.

## Subagents

Map Fulcrum roles to Kimi subagents:

- Planning and architecture: `planner`
- Code review: `reviewer`
- Security-sensitive work: `security-reviewer`
- New features and bug fixes: `tdd-guide`
- Current API or framework documentation: `docs-researcher`
- Build, test, or type failures: `build-error-resolver`

Use role names from this list rather than inventing platform-local alternatives.

## Safety

Avoid YOLO mode unless the task is a trusted local verification run. Do not commit
or write API keys, OAuth tokens, runtime sessions, logs, or files from `~/.kimi/`.
Real authentication should be done with Kimi's `/login` flow or local environment
configuration outside the repository.
