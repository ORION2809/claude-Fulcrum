<div align="center">

# claude-fulcrum

### Cross-platform AI dev stack — 25 agents, 108 skills across Claude Code, Copilot, Cursor, Codex & OpenCode with shared orchestration via claude-flow

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Ready-6C47FF?logo=anthropic&logoColor=white)](#-supported-platforms)
[![Codex CLI](https://img.shields.io/badge/Codex_CLI-Ready-000000?logo=openai&logoColor=white)](#-supported-platforms)
[![Cursor](https://img.shields.io/badge/Cursor-Ready-00D4AA?logo=cursor&logoColor=white)](#-supported-platforms)
[![GitHub Copilot](https://img.shields.io/badge/Copilot-Ready-000000?logo=github&logoColor=white)](#-supported-platforms)
[![OpenCode](https://img.shields.io/badge/OpenCode-Ready-333333)](#-supported-platforms)

**25 Agents** · **108 Skills** · **57 Commands** · **9 Language Rule Sets** · **Multi-Agent Orchestration**

[Quick Start](#-quick-start) · [How It Differs From ECC](#-how-this-differs-from-ecc) · [Cross-Platform](#-the-cross-platform-integration) · [Features](#-features) · [Guides](#-guides) · [Architecture](#-architecture)

---

</div>

> Built after integrating [ECC](https://github.com/anthropics/ecc), [claude-flow](https://www.npmjs.com/package/claude-flow), and GitHub Copilot into a single shared-memory stack. This is the reference implementation for running all 5 major AI coding tools together — with one orchestration layer, one vector memory, and one set of agents.

---

## 🚀 Quick Start

```bash
git clone https://github.com/ORION2809/claude-Fulcrum.git
cd claude-fulcrum
npm install
./install.sh typescript   # replace with your stack (python, golang, kotlin, etc.)
```

Windows: `.\install.ps1 typescript`

```bash
npm test   # verify everything works
```

<details>
<summary>Other installation methods</summary>

### Claude Code Plugin

```bash
/plugin install claude-fulcrum
```

### npx (Quick Try)

```bash
npx claude-fulcrum typescript
```

</details>

---

## ⚖️ How This Differs From ECC

If you've used [Everything Claude Code](https://github.com/anthropics/ecc), here's what claude-fulcrum adds:

| | ECC | claude-fulcrum |
|---|---|---|
| **Platforms** | 4 (Claude Code, Codex, Cursor, OpenCode) | **5** (+ full GitHub Copilot) |
| **Language rule sets** | 5 | **9** (+ Kotlin, Rust, C++, Perl) |
| **Agents** | 21 | **25** |
| **Multi-agent orchestration** | Slash commands only | **claude-flow integrated** (60+ agent types, swarm topologies, vector memory) |
| **Copilot support** | Partial | **Full** (`.github/copilot-instructions.md` + `.vscode/settings.json`) |
| **Cross-platform guide** | No | **Yes** ([CROSS_PLATFORM_INTEGRATION.md](docs/CROSS_PLATFORM_INTEGRATION.md)) |
| **Shared memory layer** | Per-platform | **Unified** (all 5 platforms read/write the same vector memory) |

claude-fulcrum doesn't replace ECC — it extends and integrates it with orchestration, additional language support, and a unified cross-platform layer.

---

## 🔗 The Cross-Platform Integration

**This is the most unique part of this repo.** All 5 platforms share a single orchestration layer. Copilot reads patterns learned by Claude Code. Codex workers execute plans made in Cursor. Everything feeds into the same vector memory via [claude-flow](https://www.npmjs.com/package/claude-flow).

```

                   claude-fulcrum                         
                                                         
       
   25        108        57         9 Language    
   Agents    Skills     Commands   Rule Sets     
       
                                                     
    
       claude-flow: Shared Vector Memory + MCP         
    
                                                        
    
    Claude Code  Codex CLI  Cursor  Copilot  OC    
    

```

Each platform reads from and writes to the same shared context:

- **Claude Code** — deep TDD, planning, security reviews  writes patterns to memory
- **Codex CLI** — fast parallel execution  reads plans, writes results
- **Cursor** — visual IDE integration  reads agents/skills, writes code changes
- **GitHub Copilot** — inline completions  reads coding standards and learned patterns
- **OpenCode** — open-source fallback  reads full agent/skill library

 Full guide: [docs/CROSS_PLATFORM_INTEGRATION.md](docs/CROSS_PLATFORM_INTEGRATION.md)

---

## ✨ Features

### 25 Specialized Agents

Every agent is a domain expert that activates automatically based on context:

| Agent | Purpose | Auto-Triggered When |
|-------|---------|-------------------|
| **planner** | Implementation planning | Complex features, refactoring |
| **architect** | System design & scalability | Architectural decisions |
| **tdd-guide** | Test-driven development | New features, bug fixes |
| **code-reviewer** | Code quality & maintainability | After writing/modifying code |
| **security-reviewer** | Vulnerability detection | Before commits, sensitive code |
| **build-error-resolver** | Fix build/type errors | Build failures |
| **e2e-runner** | End-to-end Playwright testing | Critical user flows |
| **database-reviewer** | PostgreSQL/Supabase specialist | Schema design, queries |
| **python-reviewer** | Python code review | Python projects |
| **go-reviewer** | Go code review | Go projects |
| **kotlin-reviewer** | Kotlin/Android/KMP review | Kotlin projects |
| **java-reviewer** | Java/Spring Boot review | Java projects |
| **rust-reviewer** | Rust code review | Rust projects |
| **cpp-reviewer** | C++ code review | C++ projects |
| **doc-updater** | Documentation & codemaps | Updating docs |
| **refactor-cleaner** | Dead code cleanup | Code maintenance |
| *...and 9 more* | | |

### 108 Workflow Skills

Skills are domain knowledge that activate contextually:

| Category | Count | Examples |
|----------|-------|----------|
| **Languages** | 30+ | TypeScript, Python, Go, Kotlin, Java, Rust, C++, Perl, PHP, Swift |
| **Frameworks** | 20+ | React, Next.js, Django, Spring Boot, Laravel, Ktor, Compose |
| **Testing** | 15+ | TDD workflows, E2E (Playwright), regression, property-based |
| **Architecture** | 10+ | Clean architecture, API design, database patterns, MCP servers |
| **DevOps** | 10+ | Docker, deployment, CI/CD, verification loops |
| **Business** | 8+ | Market research, content engine, investor materials |
| **AI/ML** | 5+ | Continuous learning, autonomous loops, eval harness |

### 57 Slash Commands

```
/plan          — Implementation planning with task breakdown
/tdd           — Full TDD workflow (RED  GREEN  REFACTOR)
/code-review   — Comprehensive code quality review
/e2e           — Generate and run E2E tests
/build-fix     — Fix build errors automatically
/verify        — Run verification loop (lint + test + typecheck)
/security-scan — Security vulnerability scan
/learn         — Extract reusable patterns from sessions
/skill-create  — Generate new skills from git history
/harness-audit — Audit your harness configuration
/loop-start    — Start autonomous agent loop
...and 46 more
```

### 9 Language Rule Sets

Language-specific coding standards enforced automatically:

| Rule Set | Focus |
|----------|-------|
| **Common** | Security, error handling, immutability |
| **TypeScript** | Strict mode, ESM, React/Next.js patterns |
| **Python** | PEP 8, type hints, Pythonic idioms |
| **Go** | Standard library first, error handling, testing |
| **Kotlin** | Coroutines, null safety, Compose patterns |
| **C++** | Modern C++20, memory safety, RAII |
| **Perl** | Modern Perl 5.36+, Moose, strict/warnings |
| **PHP** | PSR-12, Laravel conventions, Composer |
| **Swift** | Swift concurrency, protocol-oriented design |

### Multi-Agent Orchestration

Coordinated agent swarms via [claude-flow](https://www.npmjs.com/package/claude-flow):

```bash
npx claude-flow@alpha mcp start                              # start MCP server
npx claude-flow@alpha swarm start --topology hierarchical     # run a swarm
npx claude-flow@alpha memory store --key "k" --value "v"      # vector memory
```

60+ agent types · hierarchical/mesh/ring/star topologies · HNSW vector memory · Raft/BFT consensus · self-learning

---

## 🖥️ Supported Platforms

| Platform | Config Location | Best For |
|----------|----------------|----------|
| **Claude Code** | `~/.claude/` | Deep workflows, TDD, planning |
| **Codex CLI** | `~/.codex/` | Fast parallel execution |
| **Cursor** | `.cursor/` | Visual IDE integration |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Inline completions |
| **OpenCode** | `.opencode/` | Open-source alternative |

---

## 📖 Guides

| Guide | Description |
|-------|-------------|
| [**Cross-Platform Integration**](docs/CROSS_PLATFORM_INTEGRATION.md) | **How all 5 platforms share one orchestration layer** — read this first |
| [**Extreme Dev Playbook**](docs/EXTREME_DEV_PLAYBOOK.md) | Daily workflow guide for all platforms working together |
| [**Shortform Guide**](docs/the-shortform-guide.md) | Setup, foundations, philosophy |
| [**Longform Guide**](docs/the-longform-guide.md) | Token optimization, memory persistence, evals, parallelization |
| [**Security Guide**](docs/the-security-guide.md) | Security scanning, secret management, OWASP patterns |
| [**Troubleshooting**](TROUBLESHOOTING.md) | Common issues and fixes |

---

## 🗂 Architecture

```
claude-fulcrum/
 agents/              25 specialized agents (planner, reviewer, tdd-guide...)
 skills/              108 workflow skills (TDD, API design, Django, React...)
 commands/            57 slash commands (/plan, /tdd, /code-review, /e2e...)
 hooks/               Hook definitions (pre/post tool use, session events)
 rules/               9 language rule sets
    common/          Universal coding standards
    typescript/      TypeScript/React/Next.js
    python/          Python/Django
    golang/          Go
    kotlin/          Kotlin/Android/KMP
    cpp/             C++
    perl/            Perl
    php/             PHP/Laravel
    swift/           Swift
 mcp-configs/         MCP server configurations
 orchestration/       claude-flow swarm orchestration
 scripts/             Install, CI, hooks, utilities
 docs/                Guides and documentation
 .codex/              Codex CLI platform config
 .cursor/             Cursor platform config
 .opencode/           OpenCode platform config
 .github/             GitHub + Copilot config
 .vscode/             VS Code settings
 install.sh           Unix installer
 install.ps1          Windows installer
 CLAUDE.md            Claude Code project instructions
 AGENTS.md            Agent routing instructions
 package.json         Project manifest
```

---

## 🔧 Configuration

### MCP Servers

Configured in `mcp-configs/`:

| Server | Purpose |
|--------|---------|
| **claude-flow** | Multi-agent swarm orchestration |
| **memory** | Persistent memory across sessions |
| **sequential-thinking** | Step-by-step reasoning |
| **context7** | Library documentation lookup |
| **playwright** | Browser automation & E2E testing |
| **firecrawl** | Web scraping & research |

### Environment Variables

```bash
CLAUDE_PACKAGE_MANAGER=pnpm     # Override package manager (npm, pnpm, yarn, bun)
CF_HOOK_PROFILE=standard        # Hook profile (minimal, standard, strict)
CF_DISABLED_HOOKS=cost-tracker  # Comma-separated hook names to disable
```

---

## 🧪 Testing

```bash
npm test            # Validate agents, commands, rules, skills, hooks
npm run coverage    # Coverage report (80%+ required)
npm run lint        # Lint everything
npm run harness:audit  # Audit harness configuration
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork  branch (`git checkout -b feat/my-feature`)  follow formats  `npm test`  PR

**Formats:**
- **Agents**: Markdown with YAML frontmatter (`name`, `description`, `tools`, `model`)
- **Skills**: Markdown with sections (When to Use, How It Works, Examples)
- **Commands**: Markdown with `description` frontmatter
- **Rules**: Markdown in `rules/<language>/`

File naming: **lowercase with hyphens** — `python-reviewer.md`, `tdd-workflow.md`

---

## 🏷️ GitHub Topics

When you create this repo on GitHub, add these topics for discoverability:

`claude-code` · `claude-code-agents` · `ai-dev-workflow` · `claude-code-setup` · `codex-cli` · `cursor-ai` · `github-copilot` · `opencode` · `claude-flow` · `ai-agents` · `mcp-server` · `developer-tools` · `tdd` · `code-review` · `multi-agent` · `agent-orchestration`

---

## 📊 Stats

| Metric | Count |
|--------|-------|
| Specialized Agents | 25 |
| Workflow Skills | 108 |
| Slash Commands | 57 |
| Language Rule Sets | 9 |
| Supported Platforms | 5 |
| MCP Server Configs | 6+ |

---

## 📜 License

[MIT](LICENSE) — use it, modify it, share it.

---

<div align="center">

**The leverage point where all your AI coding tools actually work together.**

[ Back to Top](#claude-fulcrum)

</div>