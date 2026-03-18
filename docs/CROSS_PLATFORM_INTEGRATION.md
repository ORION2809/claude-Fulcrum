# Cross-Platform Integration Guide

## Platform Inventory

| Platform | Config Location | Role |
|----------|----------------|------|
| **Claude Code (Claude Fulcrum)** | `~/.claude/` | Primary development Ã¢â‚¬â€ hooks, agents, skills, rules |
| **OpenAI Codex CLI** | `~/.claude/.codex/` | Secondary Ã¢â‚¬â€ GPT-5.4 agents (reviewer, explorer, docs-researcher) |
| **Cursor** | `~/.claude/.cursor/` | IDE Ã¢â‚¬â€ mirrored rules + unique skills (content, investor) |
| **GitHub Copilot** | `.github/copilot-instructions.md` | IDE Ã¢â‚¬â€ project-level instructions |
| **Claude-Flow (Orchestration)** | This project | Orchestration Ã¢â‚¬â€ swarms, memory, learning, consensus |

## Shared MCP Server Setup

Claude-flow's MCP server acts as the **shared coordination layer** across all platforms.

### Claude Code (`~/.claude/mcp-configs/mcp-servers.json`)

Add this entry:

```json
"claude-flow": {
  "command": "npx",
  "args": ["-y", "claude-flow@alpha", "mcp", "start"],
  "description": "Multi-agent swarm orchestration, vector memory, and self-learning"
}
```

### Codex CLI (`~/.claude/.codex/config.toml`)

Add this section:

```toml
[mcp_servers.claude-flow]
command = "npx"
args = ["-y", "claude-flow@alpha", "mcp", "start"]
```

### Cursor (Settings > MCP)

Add claude-flow as an MCP server through Cursor's MCP configuration UI.

## Hook Integration (Claude Fulcrum + Claude-Flow)

The two hook systems are **complementary, not competing**:

| Claude Fulcrum hooks (Quality) | Claude-Flow Hooks (Learning) | When Both Fire |
|---------------------|------------------------------|----------------|
| `post-edit-format.js` Ã¢â‚¬â€ auto-format | `post-edit --train-patterns` Ã¢â‚¬â€ learn patterns | Edit: Claude Fulcrum formats Ã¢â€ â€™ CF learns from edit |
| `quality-gate.js` Ã¢â‚¬â€ lint/type checks | `post-task --analyze-performance` Ã¢â‚¬â€ agent perf | Task: Claude Fulcrum gates quality Ã¢â€ â€™ CF optimizes agents |
| `cost-tracker.js` Ã¢â‚¬â€ token metrics | `session-end --export-metrics` Ã¢â‚¬â€ session stats | Session: Claude Fulcrum tracks cost Ã¢â€ â€™ CF exports learnings |
| `check-console-log.js` Ã¢â‚¬â€ code hygiene | `route --task` Ã¢â‚¬â€ intelligence routing | Stop: Claude Fulcrum cleans Ã¢â€ â€™ CF routes future work |

### How to Run Both

The `plugin/hooks/hooks.json` in claude-flows already defines claude-flow's hooks with `continueOnError: true`.
Claude Fulcrum hooks are defined in `~/.claude/settings.json`.

Both fire independently on the same events Ã¢â‚¬â€ no conflict. Claude-flow hooks call
`npx claude-flow@alpha hooks <event>` while Claude Fulcrum hooks call local Node.js scripts.

## Memory Architecture

```
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š  Claude-Flow AgentDB + HNSW (Shared Brain)          Ã¢â€â€š
Ã¢â€â€š  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š patterns     Ã¢â€â€š Ã¢â€â€š results      Ã¢â€â€š Ã¢â€â€š collaborationÃ¢â€â€š Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š namespace    Ã¢â€â€š Ã¢â€â€š namespace    Ã¢â€â€š Ã¢â€â€š namespace    Ã¢â€â€š Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ Ã¢â€â€š
Ã¢â€â€š         Ã¢â€â€š               Ã¢â€â€š                Ã¢â€â€š          Ã¢â€â€š
Ã¢â€â€š  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â´Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â´Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â´Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€šClaude Code  Ã¢â€â€š Ã¢â€â€šCodex CLI     Ã¢â€â€š Ã¢â€â€šCursor/CopilotÃ¢â€â€š Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€šwrites here  Ã¢â€â€š Ã¢â€â€šreads/writes  Ã¢â€â€š Ã¢â€â€šreads here    Ã¢â€â€š Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
```

### Store a Pattern (from any platform)

```bash
npx claude-flow@alpha memory store --key "pattern-name" --value "what worked" --namespace patterns
```

### Search Patterns (semantic vector search)

```bash
npx claude-flow@alpha memory search --query "authentication retry logic" --namespace patterns
```

## Agent Routing: Which Platform Does What

| Task Type | Best Platform | Why |
|-----------|---------------|-----|
| **Single file edit** | Claude Code / Copilot | Direct, fast, no swarm needed |
| **Code review** | Claude Code (code-reviewer agent) or Codex (reviewer agent) | Both have specialized reviewers |
| **Multi-file feature** | Claude Code + Claude-Flow swarm | Claude Fulcrum agents execute, CF coordinates |
| **Architecture decision** | Claude Code (architect agent) | Deep reasoning with Claude Fulcrum skills |
| **Security audit** | Claude Code (security-reviewer) + CF security hooks | Claude Fulcrum flags issues, CF learns patterns |
| **Documentation** | Cursor (doc skills) or Copilot | IDE-integrated doc generation |
| **Docs lookup** | Any (Context7 MCP shared) | All platforms have Context7 |
| **Performance analysis** | Claude-Flow (performance workers) | CF has dedicated benchmarking |

## Platform Strengths Matrix

| Capability | Claude Code | Codex CLI | Cursor | Copilot | Claude-Flow |
|-----------|:-----------:|:---------:|:------:|:-------:|:-----------:|
| Deep agents (25+) | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ | Ã¢Ëœâ€¦ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ |
| Hook system | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ |
| Slash commands | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ |
| IDE integration | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ | Ã¢â‚¬â€ |
| Inline completion | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ | Ã¢â‚¬â€ |
| Swarm orchestration | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ |
| Vector memory | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ |
| Self-learning | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ |
| Multi-model routing | Ã¢Ëœâ€¦ | Ã¢Ëœâ€¦ | Ã¢Ëœâ€¦ | Ã¢â‚¬â€ | Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦ |
