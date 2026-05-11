# Kimi Code Compatibility Plan

Status: implemented. This document records the research basis and the
file-by-file implementation plan used for the `.kimi/` platform layer.

Last verified: 2026-05-11

## Goal

Make Claude Fulcrum first-class on Kimi Code while preserving the existing multi-platform shape for Claude Code, Codex, Cursor, Copilot, OpenCode, Crush, Kilo, and Kilo Code.

The target experience is:

```powershell
cd C:\path\to\project
kimi --agent-file .kimi/agents/fulcrum.yaml --mcp-config-file .kimi/mcp.json
```

For laptop-wide skill availability, copy `.agents/skills/*` and `.kimi/skills/*`
into `~/.kimi/skills/`. Kimi discovers that user-level directory globally, while
the `.kimi/` project layer remains the repo-local agent, MCP, hook, and wrapper
configuration.

Kimi should then load:

- Root project guidance from `AGENTS.md`
- Kimi-specific guidance from `.kimi/AGENTS.md`
- Project skills from `.agents/skills/` and, where useful, `.kimi/skills/`
- MCP servers equivalent to the Codex and Crush baselines
- A Fulcrum root agent with planner, reviewer, security, TDD, docs, and build-fix subagents
- Optional lifecycle hooks mapped to Kimi's hook events

## Verified Kimi Code Facts

Kimi Code CLI supports macOS, Linux, and Windows PowerShell, and installs via `https://code.kimi.com/install.ps1` on Windows or `https://code.kimi.com/install.sh` on Linux/macOS. It can also be installed with `uv tool install --python 3.13 kimi-cli`.

Kimi uses `~/.kimi/config.toml` by default, but can load another TOML or JSON config with `--config-file`. The config includes model/provider settings, `merge_all_available_skills`, loop control, background task settings, web search/fetch services, MCP client settings, and beta hooks.

Kimi reads merged `AGENTS.md` content from the project root to the working directory, including `.kimi/AGENTS.md`, through the `${KIMI_AGENTS_MD}` system prompt variable.

Kimi skills are directories containing `SKILL.md`. Project-level discovery includes `.kimi/skills/`, `.claude/skills/`, `.codex/skills/`, and `.agents/skills/`. By default, brand-specific skill directories are mutually exclusive by priority, but `merge_all_available_skills = true` loads all existing brand directories with priority `kimi > claude > codex`.

Kimi custom agents are YAML files loaded with `--agent-file`. They can `extend: default`, specify a Markdown system prompt, exclude tools, and define subagents. Built-in subagent types are `coder`, `explore`, and `plan`; custom subagents can also be declared.

Kimi MCP config is stored globally in `~/.kimi/mcp.json`, but project-specific or temporary MCP config can be loaded with `--mcp-config-file`. The format is the common `{"mcpServers": {...}}` JSON format used by other MCP clients.

Kimi hooks are currently beta. They are configured in TOML `[[hooks]]` entries and support lifecycle events such as `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SessionStart`, `SessionEnd`, `SubagentStart`, `SubagentStop`, `PreCompact`, and `PostCompact`.

Kimi plan mode can be enabled with `--plan` or `default_plan_mode = true`. In plan mode, Kimi is read-only and writes an implementation plan before requesting approval.

## Existing Fulcrum Assets To Reuse

Reuse these as canonical inputs rather than duplicating behavior:

- `AGENTS.md`: project-wide agent instructions and platform-neutral rules
- `.codex/AGENTS.md`: useful Codex-specific comparison material for the Kimi-specific instruction layer
- `.codex/config.toml`: current MCP baseline
- `.codex/agents/*.toml`: current explorer, reviewer, and docs-researcher role intent
- `.agents/skills/`: Kimi-compatible project skills because Kimi already discovers this directory
- `agents/*.md`: source material for Kimi custom subagent prompts
- `commands/*.md`: source material for Kimi command-as-skill wrappers if needed
- `scripts/hooks/*`: possible hook script targets after JSON input compatibility is checked
- `mcp-configs/mcp-servers.json` and `.mcp.json`: existing MCP server inventory
- `scripts/lib/install-targets/*`: install target framework to extend with a Kimi target
- `scripts/ci/*`: validation framework to extend with Kimi-specific checks
- `package.json`: package files list and platform keywords

## Compatibility Architecture

Add a `.kimi/` platform layer with only Kimi-specific wiring. Keep shared capabilities in the existing canonical folders.

Planned structure:

```text
.kimi/
  AGENTS.md
  README.md
  config.example.toml
  mcp.json
  agents/
    fulcrum.yaml
    fulcrum.md
    planner.yaml
    planner.md
    reviewer.yaml
    reviewer.md
    security-reviewer.yaml
    security-reviewer.md
    tdd-guide.yaml
    tdd-guide.md
    docs-researcher.yaml
    docs-researcher.md
    build-error-resolver.yaml
    build-error-resolver.md
  hooks/
    protect-env.ps1
    protect-env.sh
    post-edit-format.ps1
    post-edit-format.sh
```

Do not copy all 122 skills into `.kimi/skills/` unless a Kimi-specific override is needed. Kimi can load `.agents/skills/` directly.

## Exact Implementation Steps

1. Add `.kimi/AGENTS.md`.

   Content should supplement root `AGENTS.md`, not replace it. Include:

   - Kimi Code is the active platform when running under `kimi`
   - Prefer `rg` through Kimi's `Grep`/`Shell` tools for search
   - Use Kimi plan mode for complex changes when the user asks for planning
   - Treat `.agents/skills/` as the canonical shared skill directory
   - Use `.kimi/agents/fulcrum.yaml` as the default Fulcrum agent file
   - Use `.kimi/mcp.json` for project-local MCP parity
   - Avoid YOLO mode except trusted local verification tasks
   - Map Fulcrum roles to Kimi subagents rather than inventing new role names

2. Add `.kimi/config.example.toml`.

   Include no real secrets. Use a placeholder API key or recommend `/login`.

   Required settings:

   ```toml
   default_model = "kimi-for-coding"
   default_thinking = false
   default_yolo = false
   default_plan_mode = false
   default_editor = ""
   theme = "dark"
   merge_all_available_skills = true

   [providers.kimi-for-coding]
   type = "kimi"
   base_url = "https://api.kimi.com/coding/v1"
   api_key = "env:KIMI_API_KEY"

   [models.kimi-for-coding]
   provider = "kimi-for-coding"
   model = "kimi-for-coding"
   max_context_size = 262144

   [loop_control]
   max_steps_per_turn = 100
   max_retries_per_step = 3
   max_ralph_iterations = 0
   reserved_context_size = 50000
   compaction_trigger_ratio = 0.85

   [background]
   max_running_tasks = 4
   keep_alive_on_exit = false
   agent_task_timeout_s = 900

   [mcp.client]
   tool_call_timeout_ms = 60000
   ```

   During implementation, verify whether Kimi accepts `api_key = "env:KIMI_API_KEY"` literally. If it does not, document `/login` as the supported setup path and keep the example commented.

3. Add `.kimi/mcp.json`.

   Start with the same baseline as `.codex/config.toml`, converted to MCP JSON:

   - `claude-flow`: `npx -y claude-flow@alpha mcp start`
   - `code-review-graph`: `uvx code-review-graph serve`
   - `context7`: `npx -y @upstash/context7-mcp@latest`
   - `playwright`: `npx -y @playwright/mcp --browser chrome`
   - `sequential-thinking`: `npx -y @modelcontextprotocol/server-sequential-thinking`
   - `memory`: `npx -y @modelcontextprotocol/server-memory`

   Keep optional servers such as Cloudflare, Vercel, Exa, and GitHub out of the default unless they are already in the repo baseline and do not require secrets.

4. Add `.kimi/agents/fulcrum.yaml` and `.kimi/agents/fulcrum.md`.

   `fulcrum.yaml` should:

   - `extend: default`
   - use `system_prompt_path: ./fulcrum.md`
   - define subagents for `planner`, `reviewer`, `security-reviewer`, `tdd-guide`, `docs-researcher`, and `build-error-resolver`

   `fulcrum.md` should be a compact Kimi-specific wrapper around:

   - `${KIMI_AGENTS_MD}`
   - `${KIMI_SKILLS}`
   - `${KIMI_WORK_DIR}`
   - `${KIMI_ADDITIONAL_DIRS_INFO}`

   It should also include concise Fulcrum routing rules:

   - planning and architecture -> `planner`
   - code review -> `reviewer`
   - security-sensitive work -> `security-reviewer`
   - new features and bug fixes -> `tdd-guide`
   - current API/framework docs -> `docs-researcher`
   - build/test failures -> `build-error-resolver`

5. Add subagent YAML and Markdown prompt files.

   Each subagent YAML should inherit from `./fulcrum.yaml` and add role-specific prompt args. Use restricted tools where possible:

   - `planner`: read/search/web only; no write tools
   - `docs-researcher`: read/search/web only; no write tools
   - `reviewer`: read/search/shell for inspection; no write tools
   - `security-reviewer`: read/search/shell/web; no write tools
   - `tdd-guide`: coder-style tools, because it may write tests and implementation
   - `build-error-resolver`: coder-style tools, because it may fix build failures

   Source the prompt language from existing `agents/*.md` and `.codex/agents/*.toml`, but keep Kimi prompts short enough that the full system prompt remains usable.

6. Decide command compatibility strategy.

   Kimi has its own built-in slash command system and does not document a project-local custom slash command directory equivalent to `commands/*.md`. Therefore, implement Fulcrum commands for Kimi as skills, not slash commands.

   Planned approach:

   - Keep canonical commands in `commands/*.md`
   - Add a command index section to `.kimi/README.md`
   - For high-value commands, create lightweight `.kimi/skills/command-*` wrappers only if Kimi does not already discover equivalent `.agents/skills/`
   - Use `/skill:<name>` in Kimi for explicit command-like invocation

   Initial command wrappers to consider:

   - `command-plan`
   - `command-tdd`
   - `command-code-review`
   - `command-security-scan`
   - `command-e2e`
   - `command-verify`
   - `command-harness-audit`

7. Add optional Kimi hook scripts.

   First map existing hook intent to Kimi events:

   | Kimi event | Fulcrum behavior | Existing source |
   | --- | --- | --- |
   | `PreToolUse` + `Shell` | block dangerous shell commands | `scripts/hooks/protect-configs.js`, `pre-bash-*` |
   | `PreToolUse` plus `WriteFile` or `StrReplaceFile` | protect `.env` and config secrets | `scripts/hooks/protect-configs.js` |
   | `PostToolUse` plus `WriteFile` or `StrReplaceFile` | format changed files | `scripts/hooks/post-edit-format.js` |
   | `PostToolUse` plus `WriteFile` or `StrReplaceFile` | warn on console logging | `scripts/hooks/post-edit-console-warn.js` |
   | `PreCompact` | preserve session summary | `scripts/hooks/pre-compact.js` |
   | `Stop` | quality gate reminder | `scripts/hooks/quality-gate.js` |

   Kimi hook scripts receive JSON on stdin. Before enabling any hook by default, add a small adapter script or update existing scripts so they can parse Kimi's `tool_name`, `tool_input`, and `hook_event_name` fields. Start with docs-only examples; enable by default only after tests.

8. Extend installer support.

   Add a Kimi install target to:

   - `scripts/lib/install-targets/kimi-project.js`
   - `scripts/lib/install-targets/registry.js`
   - `manifests/install-components.json`
   - `manifests/install-modules.json`
   - `manifests/install-profiles.json`

   The install target should copy or generate:

   - `.kimi/AGENTS.md`
   - `.kimi/README.md`
   - `.kimi/config.example.toml`
   - `.kimi/mcp.json`
   - `.kimi/agents/**`
   - optional `.kimi/hooks/**`

   It should not copy runtime files from `~/.kimi/`, credentials, sessions, logs, or user history.

9. Update package metadata.

   Add `.kimi/` to `package.json` `files`.

   Add keywords:

   - `kimi`
   - `kimi-code`
   - `moonshot`

   Update the package description only after the implementation actually lands.

10. Add validation.

   Add `scripts/ci/validate-kimi.js` and wire it into `npm test`.

   Checks: `.kimi/AGENTS.md` exists; `.kimi/config.example.toml` exists and
   contains no real API key; `.kimi/mcp.json` parses as JSON and has a
   top-level `mcpServers` object; every `.kimi/agents/*.yaml` has `version: 1`
   and `agent`; every `system_prompt_path` target exists; every subagent `path`
   target exists; no `.kimi/**` file contains personal absolute paths; no
   `.kimi/**` file contains `sk-` style secrets except documented placeholders.

   If adding hook scripts, add fixture tests for Kimi hook JSON input.

11. Update docs.

   Add `.kimi/README.md` for users.

   Required sections: install Kimi Code; authenticate with `/login`; run from a
   Fulcrum-enabled project; run with project MCP config; run with custom Fulcrum
   agent file; use Kimi plan mode; load skills with `/skill:<name>`; inspect MCP
   with `/mcp`; warn about YOLO mode and beta hooks; include Windows PowerShell
   examples.

   Update root `README.md` cross-platform list only after the `.kimi/` implementation and validator pass.

12. Verify end to end.

   Minimum checks:

   ```powershell
   npm test
   kimi --version
   kimi --agent-file .kimi/agents/fulcrum.yaml --mcp-config-file .kimi/mcp.json --plan --prompt "Summarize this repo architecture. Do not edit files."
   kimi --agent-file .kimi/agents/fulcrum.yaml --mcp-config-file .kimi/mcp.json --prompt "List loaded skills and MCP servers. Do not edit files."
   ```

   If a network-backed Kimi account is not available in CI, keep Kimi CLI execution as manual verification and validate config statically in CI.

## Key Risks And Decisions

The largest compatibility risk is command parity. Kimi documents built-in slash commands and skills, but not a project-local custom slash command directory. The plan therefore maps Fulcrum commands to skills for Kimi.

The second risk is hooks. Kimi hooks are beta and use their own JSON contract, so existing Claude/Codex hook scripts should not be blindly reused. Adapt and test them before enabling them.

The third risk is provider config secrets. Prefer `/login` for real users. Keep committed config files as examples only and never commit API keys.

The fourth risk is duplicate skill loading. Because Kimi can discover `.agents/skills/` directly, `.kimi/skills/` should be reserved for Kimi-specific overrides or command wrappers.

## Source References

- Kimi Code Quick Start: <https://www.kimi.com/code/docs/en/kimi-code-cli/getting-started.html>
- Kimi config files: <https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/configuration-files.html>
- Kimi skills: <https://www.kimi.com/code/docs/en/kimi-code-cli/customization/skills.html>
- Kimi agents and subagents: <https://www.kimi.com/code/docs/en/kimi-code-cli/customization/sub-agents.html>
- Kimi MCP: <https://www.kimi.com/code/docs/en/kimi-code-cli/customization/mcp.html>
- Kimi hooks: <https://www.kimi.com/code/docs/en/kimi-code-cli/customization/hooks.html>
- Kimi command reference: <https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-command.html>
- Kimi slash commands: <https://www.kimi.com/code/docs/en/kimi-code-cli/reference/slash-commands.html>
- Kimi data locations: <https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/data-locations.html>
