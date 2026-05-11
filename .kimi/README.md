# Kimi Code Platform

Claude Fulcrum can run directly inside Kimi Code through the project-local
`.kimi/` layer. Shared skills stay in `.agents/skills/`; this directory only
contains Kimi-specific wiring.

## Install Kimi Code

Windows PowerShell:

```powershell
Invoke-RestMethod https://code.kimi.com/install.ps1 | Invoke-Expression
kimi --version
```

Linux or macOS:

```bash
curl -LsSf https://code.kimi.com/install.sh | bash
kimi --version
```

If `uv` is already installed:

```bash
uv tool install --python 3.13 kimi-cli
```

## Authenticate

From the project root, start Kimi and run:

```text
/login
```

The Kimi Code platform flow stores credentials under `~/.kimi/`. Do not commit
credentials, sessions, logs, or generated runtime state.

## Run Fulcrum

Recommended project command:

```powershell
kimi --agent-file .kimi/agents/fulcrum.yaml --mcp-config-file .kimi/mcp.json
```

Plan-first mode:

```powershell
kimi --agent-file .kimi/agents/fulcrum.yaml --mcp-config-file .kimi/mcp.json --plan
```

One-shot read-only architecture check:

```powershell
kimi --agent-file .kimi/agents/fulcrum.yaml --mcp-config-file .kimi/mcp.json --plan --prompt "Summarize this repo architecture. Do not edit files."
```

## MCP

Project MCP configuration lives in `.kimi/mcp.json` and mirrors the Codex
baseline: `claude-flow`, `code-review-graph`, `context7`, `playwright`,
`sequential-thinking`, and `memory`.

Inside Kimi, inspect loaded servers with:

```text
/mcp
```

## Skills And Command Wrappers

Kimi discovers shared skills from `.agents/skills/`. Explicitly load a skill with:

```text
/skill:tdd-workflow fix the failing email validation tests
```

## Global Laptop Install

To make Fulcrum skills available to Kimi Code from every project on this laptop,
copy the shared skills and Kimi command wrappers into Kimi's user skill root:

```powershell
$repo = (Get-Location).Path
$targetRoot = "$env:USERPROFILE\.kimi\skills"
New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

Copy-Item "$repo\.agents\skills\*" $targetRoot -Recurse -Force
Copy-Item "$repo\.kimi\skills\*" $targetRoot -Recurse -Force
```

Kimi discovers `~/.kimi/skills/` globally, so these skills are available even
outside this repository. Keep `merge_all_available_skills = true` in
`~/.kimi/config.toml` so Kimi also merges any Claude or Codex skill roots you
use.

Command-like wrappers live under `.kimi/skills/command-*`:

| Fulcrum command | Kimi invocation |
| --- | --- |
| `/plan` | `/skill:command-plan` |
| `/tdd` | `/skill:command-tdd` |
| `/code-review` | `/skill:command-code-review` |
| `/security-scan` | `/skill:command-security-scan` |
| `/e2e` | `/skill:command-e2e` |
| `/verify` | `/skill:command-verify` |
| `/harness-audit` | `/skill:command-harness-audit` |

## Hooks

Kimi hooks are beta. Example hook scripts are included in `.kimi/hooks/`, but they
are not enabled by default. Add them to `~/.kimi/config.toml` only after reviewing
the behavior:

```toml
[[hooks]]
event = "PreToolUse"
matcher = "Shell|WriteFile|StrReplaceFile"
command = ".kimi/hooks/protect-env.ps1"
timeout = 10

[[hooks]]
event = "PostToolUse"
matcher = "WriteFile|StrReplaceFile"
command = ".kimi/hooks/post-edit-format.ps1"
timeout = 30
```

Use `.sh` scripts instead of `.ps1` on Linux or macOS.

## Safety

Kimi's YOLO mode auto-approves file edits, shell commands, and MCP calls. Use it
only for trusted local verification. Keep manual approval for new MCP servers,
repo-wide changes, and anything that can touch external systems.
