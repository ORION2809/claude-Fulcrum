# Changelog

## 2.0.0 - Claude Fulcrum (2026-03)

### Highlights

- **Claude Fulcrum launch** â€” unified AI agent harness combining production-ready agents, skills, hooks, commands, rules, and multi-agent orchestration into a single project.
- **Cross-platform support** â€” works across Claude Code, Codex CLI, Cursor, GitHub Copilot, and OpenCode.
- **Multi-agent orchestration** â€” integrated claude-flow swarm coordination with 60+ agent types, vector memory, and consensus protocols.
- **5 platform configs** â€” platform-specific configurations (.codex, .cursor, .opencode, .github, .vscode) ship with the repo.

---

## 1.8.0 - 2026-03-04

### Highlights

- Harness-first release focused on reliability, eval discipline, and autonomous loop operations.
- Hook runtime now supports profile-based control and targeted hook disabling.
- NanoClaw v2 adds model routing, skill hot-load, branching, search, compaction, export, and metrics.

### Core

- Added new commands: `/harness-audit`, `/loop-start`, `/loop-status`, `/quality-gate`, `/model-route`.
- Added new skills:
  - `agent-harness-construction`
  - `agentic-engineering`
  - `ralphinho-rfc-pipeline`
  - `ai-first-engineering`
  - `enterprise-agent-ops`
  - `nanoclaw-repl`
  - `continuous-agent-loop`
- Added new agents:
  - `harness-optimizer`
  - `loop-operator`

### Hook Reliability

- Fixed SessionStart root resolution with robust fallback search.
- Moved session summary persistence to `Stop` where transcript payload is available.
- Added quality-gate and cost-tracker hooks.
- Replaced fragile inline hook one-liners with dedicated script files.
- Added `ECC_HOOK_PROFILE` and `ECC_DISABLED_HOOKS` controls.

### Cross-Platform

- Improved Windows-safe path handling in doc warning logic.
- Hardened observer loop behavior to avoid non-interactive hangs.

### Notes

- `autonomous-loops` is kept as a compatibility alias for one release; `continuous-agent-loop` is the canonical name.
