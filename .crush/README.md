# Crush Platform — Claude Fulcrum

> Crush (formerly OpenCode) integration with NVIDIA NIM multi-agent orchestration.

## Quick Start

### 1. Install Crush

```bash
# NPM
npm install -g @charmland/crush

# Homebrew (macOS/Linux)
brew install charmbracelet/tap/crush

# Windows
winget install charmbracelet.crush
```

### 2. Set Environment Variables

```bash
# Set NVIDIA NIM API key (get from https://build.nvidia.com)
# NEVER hardcode this — always use environment variables
export NVIDIA_API_KEY="your-nvidia-api-key-here"
```

On Windows PowerShell:
```powershell
$env:NVIDIA_API_KEY = "your-nvidia-api-key-here"
```

### 3. Run Crush

```bash
# From any project that has Fulcrum installed
crush
```

Crush reads `.crush/crush.json` and auto-discovers:
- NVIDIA NIM as provider (4 models with intelligent routing)
- 15 specialized sub-agents with model-routed specialization
- 31 slash commands mapped to agents
- 8 MCP servers (code-review-graph, context7, playwright, memory, sequential-thinking, claude-flow, cloudflare-docs, vercel)
- Skills from `.claude/skills/`, `.crush/skills/`, `.agents/skills/`, and `.cursor/skills/`

## Multi-Agent Architecture

The Crush config uses NVIDIA NIM models with intelligent routing:

| Agent | Role | Model | Can Write |
|-------|------|-------|-----------|
| `coder` | Primary coding agent | Kimi K2 | Yes |
| `task` | Subtask agent (spawned via `agent` tool) | Kimi K2 | Yes |
| `title` | Session title generation | Kimi K2 | No |

### 15 Specialized Sub-Agents

| Agent | Role | Model |
|-------|------|-------|
| `planner` | Implementation planning | Kimi K2 |
| `architect` | System design and scalability | Qwen 3.5 397B |
| `code-reviewer` | Code quality and security review | Kimi K2 |
| `security-reviewer` | OWASP Top 10, vulnerability detection | Kimi K2 |
| `tdd-guide` | Test-driven development (80%+ coverage) | Kimi K2 |
| `build-error-resolver` | Build error resolution (minimal diffs) | DeepSeek V3.2 |
| `e2e-runner` | Playwright E2E testing | Kimi K2 |
| `doc-updater` | Documentation generation | Llama 4 Maverick |
| `refactor-cleaner` | Dead code cleanup | Kimi K2 |
| `go-reviewer` | Go code review | Kimi K2 |
| `go-build-resolver` | Go build error resolution | DeepSeek V3.2 |
| `rust-reviewer` | Rust ownership/safety review | Kimi K2 |
| `rust-build-resolver` | Cargo build error resolution | DeepSeek V3.2 |
| `database-reviewer` | PostgreSQL/Supabase specialist | Kimi K2 |
| `code-graph-reviewer` | AST-based blast-radius review | Kimi K2 |

### Multi-Agent Orchestration Flow

```
You type a complex request
        │
        ▼
   coder agent (Kimi K2 via NVIDIA NIM)
        │
        ├── Spawns task agent → /plan (implementation planning)
        ├── Spawns task agent → /code-review (quality review)
        ├── Spawns task agent → /security (security audit)
        ├── Spawns task agent → /tdd (test-driven development)
        └── Uses MCP tools:
            ├── code-review-graph → blast-radius analysis
            ├── context7 → live documentation lookup
            ├── playwright → E2E browser testing
            ├── memory → persistent cross-session memory
            ├── sequential-thinking → complex reasoning
            └── claude-flow → swarm orchestration
```

### Using the Agent Tool

Crush's built-in `agent` tool spawns subtasks:

```
> Build a REST API with auth, tests, and documentation

Crush will autonomously:
1. Plan the implementation (task agent)
2. Write the code (coder agent)
3. Generate tests (task agent)
4. Review for security (task agent)
5. Update documentation (task agent)
```

### Swarm Orchestration via claude-flow MCP

For parallel multi-agent execution:

```bash
# The claude-flow MCP is configured in crush.json
# Use it from within Crush to coordinate parallel workers:

> Use claude-flow to deploy a hierarchical swarm:
> - Worker 1: Implement the API routes
> - Worker 2: Write integration tests
> - Worker 3: Generate OpenAPI docs
```

## Available NVIDIA NIM Models

The config includes 4 models you can switch between mid-session (`Ctrl+O`):

| Model | Role | Best For |
|-------|------|----------|
| **Kimi K2 Instruct** (default) | Primary coder, reviewer, TDD | General coding, multi-step tasks |
| **DeepSeek V3.2** | Build resolvers | Fast error fixes, minimal diffs |
| **Llama 4 Maverick** | Doc updater | Lightweight documentation tasks |
| **Qwen 3.5 397B** | Architect agent | Deep reasoning, system design |

## MCP Servers

| Server | Purpose |
|--------|---------|
| `code-review-graph` | Blast-radius code review (14 languages) |
| `context7` | Live library documentation |
| `playwright` | E2E browser testing |
| `memory` | Persistent cross-session memory |
| `sequential-thinking` | Complex reasoning chains |
| `claude-flow` | Multi-agent swarm orchestration || `cloudflare-docs` | Cloudflare Workers documentation |
| `vercel` | Vercel deployment management |
## OpenCode (Legacy) Setup

If using the original OpenCode instead of Crush:

```bash
# Set NVIDIA NIM as the model provider
export LOCAL_ENDPOINT=https://integrate.api.nvidia.com/v1
export OPENAI_API_KEY=$NVIDIA_API_KEY

# Copy the NVIDIA config
cp .opencode/opencode-nvidia.json .opencode/opencode.json

# Run OpenCode
opencode
```

## Comparison: OpenCode vs Crush

| Feature | OpenCode (archived) | Crush (active) |
|---------|-------------------|----------------|
| Status | Archived Sep 2025 | Active development |
| Custom providers | `LOCAL_ENDPOINT` env var only | Full `providers` config with `openai-compat` |
| MCP | Basic stdio/sse | stdio + http + sse with env var expansion |
| Skills | `instructions` array | Agent Skills standard + auto-discovery |
| Model switching | Config only | Mid-session via `Ctrl+O` |
| Notifications | None | Desktop notifications on completion |
