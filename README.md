<div align="center">

<br>

# ⚡ CLAUDE FULCRUM

### The Operating System for AI-Powered Development

<br>

**25 Agents** · **112 Skills** · **62 Commands** · **9 Language Rulesets** · **1,500+ Tests** · **5 Platforms**

One harness. Every AI coding tool. Unified memory. Swarm orchestration.

<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-1536%20Passing-00C853?style=for-the-badge&logo=vitest&logoColor=white)](#-test-suite)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

[![Claude Code](https://img.shields.io/badge/Claude_Code-Ready-6C47FF?style=flat-square&logo=anthropic&logoColor=white)](#-supported-platforms)
[![Codex CLI](https://img.shields.io/badge/Codex_CLI-Ready-000000?style=flat-square&logo=openai&logoColor=white)](#-supported-platforms)
[![Cursor](https://img.shields.io/badge/Cursor-Ready-00D4AA?style=flat-square&logo=cursor&logoColor=white)](#-supported-platforms)
[![GitHub Copilot](https://img.shields.io/badge/Copilot-Ready-000000?style=flat-square&logo=github&logoColor=white)](#-supported-platforms)
[![OpenCode](https://img.shields.io/badge/OpenCode-Ready-333333?style=flat-square)](#-supported-platforms)

<br>

[**Quick Start**](#-quick-start) · [**Architecture**](#-system-architecture) · [**Features**](#-core-systems) · [**Agents**](#-agent-catalog) · [**Guides**](#-guides) · [**Contributing**](#-contributing)

---

</div>

> **What is this?** Claude Fulcrum is a production-grade agent harness that unifies **Claude Code, Codex CLI, Cursor, GitHub Copilot, and OpenCode** into a single development environment — with shared vector memory, swarm orchestration, knowledge graphs, and 25 specialized AI agents that activate automatically based on what you're doing.

<br>

## Why Fulcrum?

Most AI coding setups are **one tool, one config, one context window.**

Fulcrum is different. It gives every AI tool you use the same memory, the same agents, and the same quality standards — then coordinates them like a team.

```
You write code in Cursor  →  Fulcrum's agents review it automatically
You plan a feature in Claude Code  →  Codex workers execute the plan in parallel
Copilot suggests a completion  →  It already knows your team's patterns from memory
A build fails in any tool  →  The build-error-resolver agent fixes it
```

**The result:** Your AI tools stop being isolated autocomplete engines and start functioning as a coordinated engineering team.

---

## 🚀 Quick Start

```bash
git clone https://github.com/ORION2809/claude-Fulcrum.git
cd claude-Fulcrum
npm install
```

**Install for your stack:**

```bash
# Unix / macOS
./install.sh typescript    # or: python, golang, kotlin, cpp, perl, php, swift

# Windows
.\install.ps1 typescript
```

**Verify everything works:**

```bash
npm test    # 1,536 tests — should all pass
```

<details>
<summary><b>Other installation methods</b></summary>

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

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLAUDE FULCRUM                                │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ 25 Agents│  │112 Skills│  │62 Commands│  │ 9 Language Rules │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬──────────┘   │
│       │              │             │                 │              │
│  ┌────▼──────────────▼─────────────▼─────────────────▼──────────┐  │
│  │              Orchestration Engine                             │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │  │
│  │  │ Swarm Coord  │  │ Task Router  │  │ Quality Enforcer    │ │  │
│  │  │ (claude-flow)│  │              │  │ (lint+test+review)  │ │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────────┘ │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                             │                                      │
│  ┌──────────────────────────▼───────────────────────────────────┐  │
│  │                    Memory Layer                               │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐ │  │
│  │  │ SQLite +   │  │ Vector Search│  │ Knowledge Graph      │ │  │
│  │  │ FTS5 Index │  │ (Embeddings) │  │ (Entity Extraction)  │ │  │
│  │  └────────────┘  └──────────────┘  └──────────────────────┘ │  │
│  │  4-Signal Hybrid Ranking: Lexical + Recency + Structure +   │  │
│  │  Vector Similarity via Reciprocal Rank Fusion               │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                             │                                      │
│  ┌──────────────────────────▼───────────────────────────────────┐  │
│  │                  Platform Adapters                            │  │
│  │  ┌───────────┐ ┌─────────┐ ┌──────┐ ┌───────┐ ┌──────────┐ │  │
│  │  │Claude Code│ │Codex CLI│ │Cursor│ │Copilot│ │ OpenCode │ │  │
│  │  └───────────┘ └─────────┘ └──────┘ └───────┘ └──────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Every platform reads from and writes to the same shared context:**

| Platform | Role | Reads | Writes |
|----------|------|-------|--------|
| **Claude Code** | Deep workflows — TDD, planning, security | Everything | Patterns → memory |
| **Codex CLI** | Fast parallel execution | Plans, tasks | Results, code |
| **Cursor** | Visual IDE integration | Agents, skills | Code changes |
| **GitHub Copilot** | Inline completions + chat | Standards, patterns | — |
| **OpenCode** | Open-source alternative | Full agent/skill library | Code, docs |

> Full guide: [docs/CROSS_PLATFORM_INTEGRATION.md](docs/CROSS_PLATFORM_INTEGRATION.md)

---

## 🧠 Core Systems

### 1. Hybrid Memory Engine

Not just a database — a **4-signal neural search system** that gets smarter over time.

| Signal | How It Works |
|--------|-------------|
| **Lexical** | FTS5 full-text search with porter stemming + unicode tokenization (LIKE fallback for portability) |
| **Recency** | Time-weighted scoring — recent observations rank higher |
| **Structure** | Category and entity-type boosting from the knowledge graph |
| **Vector** | Cosine similarity on 384-dimensional embeddings via Reciprocal Rank Fusion |

The memory layer automatically:
- Stores embeddings on every observation and memory note write
- Extracts entities and relationships into a knowledge graph
- Applies progressive disclosure — shows summaries first, details on demand
- Gracefully degrades if FTS5 isn't available (uses LIKE search)

### 2. Knowledge Graph

Automatic entity extraction and relationship mapping across your entire development history:

- **Entities**: Files, functions, classes, packages, APIs, people, decisions
- **Relationships**: `depends-on`, `implements`, `tested-by`, `authored-by`, `decided-in`
- **Queries**: Find all files that depend on a module, trace decisions to implementations
- **Auto-sync**: Hooks extract entities from every session interaction

### 3. Quality Enforcement Loop

Every code change passes through an automated quality pipeline:

```
Code Written → Lint Check → Type Check → Test Suite → Coverage Gate → Security Scan
       ↑                                                                    │
       └────────────────── Fix & Retry (automatic) ◄───────────────────────┘
```

- **80%+ coverage** enforced on all changes
- **OWASP Top 10** security scanning
- **Language-specific linting** via 9 rule sets
- **Auto-fix** — agents attempt to resolve failures before reporting

### 4. Swarm Orchestration

Multi-agent coordination via [claude-flow](https://www.npmjs.com/package/claude-flow):

```bash
npx claude-flow@alpha swarm start --topology hierarchical    # coordinated swarm
npx claude-flow@alpha mcp start                              # MCP server
npx claude-flow@alpha memory store --key "k" --value "v"     # shared vector memory
```

| Topology | Use Case |
|----------|----------|
| **Hierarchical** | Planner → multiple worker agents |
| **Mesh** | Peer-to-peer collaboration |
| **Ring** | Sequential pipeline processing |
| **Star** | Central coordinator with specialists |

60+ agent types · HNSW vector memory · Raft/BFT consensus · self-learning loops

### 5. Session Lifecycle

Sessions persist across restarts with full context recovery:

- **Auto-save**: State, observations, and memory notes saved on every hook event
- **Resume**: `/resume-session` restores full context from the last session
- **Privacy gate**: Configurable filtering before anything is persisted
- **Config protection**: Critical files are backed up before any modification

---

## 🤖 Agent Catalog

25 specialized agents that activate **automatically** based on context — no manual invocation needed.

### Development Agents

| Agent | Specialty | Activates When |
|-------|----------|----------------|
| `planner` | Implementation planning & task breakdown | Complex features, multi-file changes |
| `architect` | System design & scalability analysis | Architectural decisions, new systems |
| `tdd-guide` | Test-driven development (RED→GREEN→REFACTOR) | New features, bug fixes |
| `code-reviewer` | Code quality, maintainability, patterns | After any code modification |
| `security-reviewer` | OWASP Top 10, secrets, injection | Before commits, auth code |
| `build-error-resolver` | Build/type error resolution | Any build failure |
| `e2e-runner` | End-to-end Playwright testing | Critical user flows |
| `refactor-cleaner` | Dead code removal & consolidation | Code maintenance |
| `doc-updater` | Documentation & codemap generation | Doc updates |

### Language Reviewers

| Agent | Languages/Frameworks |
|-------|---------------------|
| `python-reviewer` | Python, Django, FastAPI, Flask |
| `go-reviewer` | Go, standard library patterns |
| `kotlin-reviewer` | Kotlin, Android, KMP, Compose, Ktor |
| `java-reviewer` | Java, Spring Boot, JPA |
| `rust-reviewer` | Rust, ownership, lifetimes, async |
| `cpp-reviewer` | C++20, memory safety, RAII |

### Build Resolvers

| Agent | Fixes |
|-------|-------|
| `build-error-resolver` | TypeScript/JavaScript build errors |
| `go-build-resolver` | Go compilation, vet, linter issues |
| `kotlin-build-resolver` | Kotlin/Gradle build failures |
| `java-build-resolver` | Java/Maven/Gradle errors |
| `rust-build-resolver` | Cargo build, borrow checker issues |
| `cpp-build-resolver` | CMake, compilation, linker errors |

### Specialized Agents

| Agent | Purpose |
|-------|---------|
| `database-reviewer` | PostgreSQL/Supabase schema & query optimization |
| `chief-of-staff` | Multi-channel communication triage (email, Slack, LINE) |
| `loop-operator` | Autonomous agent loop monitoring & intervention |
| `harness-optimizer` | Harness configuration tuning (cost, reliability) |
| `docs-lookup` | Live documentation lookup via Context7 MCP |

---

## 📚 112 Workflow Skills

Skills are **deep domain knowledge** that agents draw from. They activate contextually — you never need to invoke them manually.

<details>
<summary><b>Languages & Frameworks (50+)</b></summary>

| Skill | Domain |
|-------|--------|
| `coding-standards` | Universal TypeScript/React/Node patterns |
| `python-patterns` | PEP 8, type hints, Pythonic idioms |
| `golang-patterns` | Idiomatic Go, concurrency, error handling |
| `kotlin-patterns` | Coroutines, null safety, DSL builders |
| `rust-patterns` | Ownership, traits, error handling, async |
| `cpp-coding-standards` | C++ Core Guidelines, modern C++ |
| `perl-patterns` | Modern Perl 5.36+, Moose |
| `java-coding-standards` | Spring Boot, immutability, streams |
| `django-patterns` | DRF, ORM, signals, middleware |
| `laravel-patterns` | Eloquent, queues, events, caching |
| `springboot-patterns` | Layered services, JPA, async |
| `kotlin-ktor-patterns` | Routing DSL, Koin DI, WebSockets |
| `kotlin-exposed-patterns` | Exposed ORM, HikariCP, Flyway |
| `compose-multiplatform-patterns` | State, navigation, theming |
| `android-clean-architecture` | Modules, UseCases, Repositories |
| `frontend-patterns` | React, Next.js, state management |
| `backend-patterns` | API design, database optimization |
| `nextjs-turbopack` | Incremental bundling, FS caching |
| `bun-runtime` | Bun vs Node, migration, Vercel |
| `swiftui-patterns` | SwiftUI, actor persistence, concurrency |
| *...and 30+ more* | |

</details>

<details>
<summary><b>Testing & Quality (20+)</b></summary>

| Skill | Domain |
|-------|--------|
| `tdd-workflow` | Red-Green-Refactor with 80%+ coverage |
| `e2e-testing` | Playwright, Page Object Model, CI/CD |
| `ai-regression-testing` | Sandbox-mode API testing, AI blind spots |
| `python-testing` | pytest, fixtures, mocking, parametrize |
| `golang-testing` | Table-driven, subtests, fuzzing |
| `kotlin-testing` | Kotest, MockK, property-based |
| `rust-testing` | Unit, integration, async, property-based |
| `cpp-testing` | GoogleTest, CTest, sanitizers |
| `perl-testing` | Test2::V0, prove, Devel::Cover |
| `django-tdd` | pytest-django, factory_boy |
| `laravel-tdd` | PHPUnit, Pest, factories |
| `springboot-tdd` | JUnit 5, Mockito, Testcontainers |
| `verification-loop` | Comprehensive verification system |
| `quality-loop` | Iterative quality improvement |
| *...and more* | |

</details>

<details>
<summary><b>AI & Automation (15+)</b></summary>

| Skill | Domain |
|-------|--------|
| `claude-api` | Messages API, streaming, tool use, vision |
| `continuous-learning` | Auto-extract patterns from sessions |
| `continuous-learning-v2` | Instinct-based with confidence scoring |
| `eval-harness` | Eval-driven development (EDD) |
| `autonomous-loops` | Safe loop execution patterns |
| `dmux-workflows` | Multi-agent tmux orchestration |
| `mcp-server-patterns` | Build MCP servers with TypeScript SDK |
| `strategic-compact` | Context preservation through phases |
| `iterative-retrieval` | Progressive context refinement |
| `prompt-optimizer` | Prompt engineering patterns |
| `deep-research` | Multi-source research with citations |
| `exa-search` | Neural search via Exa MCP |
| `documentation-lookup` | Live docs via Context7 MCP |
| *...and more* | |

</details>

<details>
<summary><b>Security & DevOps (10+)</b></summary>

| Skill | Domain |
|-------|--------|
| `security-review` | OWASP Top 10, auth, input validation |
| `security-scan` | Automated vulnerability scanning |
| `django-security` | Django-specific security patterns |
| `laravel-security` | Laravel security best practices |
| `springboot-security` | Spring Security, JWT, CORS |
| `docker-patterns` | Container best practices |
| `deployment-patterns` | CI/CD, blue-green, canary |
| `database-migrations` | Schema migration strategies |
| `postgres-patterns` | PostgreSQL optimization |
| *...and more* | |

</details>

<details>
<summary><b>Business & Content (10+)</b></summary>

| Skill | Domain |
|-------|--------|
| `content-engine` | Multi-platform content systems |
| `article-writing` | Long-form content with voice consistency |
| `market-research` | Competitive analysis, market sizing |
| `investor-materials` | Pitch decks, financial models |
| `investor-outreach` | Cold emails, follow-ups |
| `crosspost` | Multi-platform distribution |
| `video-editing` | AI-assisted video workflows |
| `frontend-slides` | HTML presentations from scratch |
| `fal-ai-media` | Image, video, audio generation |
| `x-api` | X/Twitter API integration |

</details>

---

## ⌨️ 62 Slash Commands

<details>
<summary><b>Full command reference</b></summary>

### Planning & Architecture
```
/plan                — Implementation planning with phases
/multi-plan          — Multi-task parallel planning
/orchestrate         — Agent swarm orchestration
/devfleet            — Full development fleet deployment
/projects            — Multi-project management
```

### Development
```
/tdd                 — Test-driven development cycle
/build-fix           — Fix build errors automatically
/code-review         — Comprehensive quality review
/refactor-clean      — Dead code removal
/quality-loop        — Iterative quality improvement
/quality-gate        — Enforce quality standards
/quality-override    — Override quality gates (with reason)
```

### Testing
```
/e2e                 — E2E test generation & execution
/test-coverage       — Coverage analysis & gaps
/verify              — Full verification loop
/confidence-check    — Confidence scoring
```

### Language-Specific
```
/python-review       — Python code review
/go-review           — Go code review
/go-build            — Fix Go build errors
/go-test             — Go test generation
/kotlin-review       — Kotlin code review
/kotlin-build        — Fix Kotlin build errors
/kotlin-test         — Kotlin test generation
/rust-review         — Rust code review
/rust-build          — Fix Rust build errors
/rust-test           — Rust test generation
/cpp-review          — C++ code review
/cpp-build           — Fix C++ build errors
/cpp-test            — C++ test generation
/gradle-build        — Fix Gradle build errors
```

### Sessions & Memory
```
/save-session        — Save current session state
/resume-session      — Restore from last session
/sessions            — List all sessions
/memory-search       — Search persistent memory
/learn               — Extract patterns from session
/learn-eval          — Evaluate learned patterns
```

### Skills & Agents
```
/skill-create        — Generate skills from git history
/skill-health        — Check skill health
/evolve              — Evolve skills and agents
/promote             — Promote instinct to skill
/instinct-status     — View instinct confidence scores
/instinct-export     — Export instincts
/instinct-import     — Import instincts
```

### Orchestration & Ops
```
/loop-start          — Start autonomous agent loop
/loop-status         — Monitor loop progress
/multi-execute       — Parallel task execution
/multi-backend       — Backend multi-task
/multi-frontend      — Frontend multi-task
/multi-workflow      — Workflow orchestration
/harness-audit       — Audit harness configuration
/model-route         — Route to optimal model
/multi-backend       — Backend multi-agent task
```

### Documentation & Meta
```
/docs                — Generate documentation
/update-docs         — Update existing docs
/update-codemaps     — Regenerate codemaps
/eval                — Run evaluation harness
/checkpoint          — Save progress checkpoint
/aside               — Sidebar conversation
/attempt             — Try approach without committing
/claw                — NanoClaw REPL
/setup-pm            — Setup project management
/pm2                 — PM2 process management
/prompt-optimize     — Optimize prompts
```

</details>

---

## 📏 9 Language Rule Sets

Coding standards enforced automatically across every AI tool:

| Rule Set | Key Enforcements |
|----------|-----------------|
| **Common** | Immutability, error handling, input validation, security |
| **TypeScript** | Strict mode, ESM imports, React/Next.js patterns, Zod validation |
| **Python** | PEP 8, type hints, dataclasses, Pythonic idioms |
| **Go** | Standard library first, explicit error handling, table-driven tests |
| **Kotlin** | Coroutines, null safety, sealed classes, Compose state |
| **C++** | Modern C++20, RAII, smart pointers, no raw new/delete |
| **Perl** | Modern Perl 5.36+, strict/warnings, Moose/Moo |
| **PHP** | PSR-12, Laravel conventions, Composer autoloading |
| **Swift** | Swift 6.2 concurrency, protocol-oriented, actor isolation |

Each rule set covers: **coding style**, **testing requirements**, **security practices**, **hook integrations**, and **common patterns**.

---

## ⚖️ How Fulcrum Compares

| Capability | ECC | **Claude Fulcrum** |
|-----------|-----|-------------------|
| **Agents** | 21 | **25** |
| **Skills** | ~80 | **112** |
| **Commands** | ~40 | **62** |
| **Platforms** | 4 | **5** (+ full Copilot) |
| **Language Rules** | 5 | **9** |
| **Memory** | Per-platform | **Unified hybrid** (FTS5 + vector + knowledge graph) |
| **Search** | Keyword | **4-signal neural** (lexical + recency + structure + vector) |
| **Orchestration** | Commands only | **Full swarm** (claude-flow, 60+ types, consensus) |
| **Quality Loop** | Partial | **Automated** (lint, test, review, fix cycle) |
| **Knowledge Graph** | No | **Yes** (entity extraction + relationship mapping) |
| **Tests** | Some | **1,536 passing** |
| **Cross-platform Guide** | No | **Yes** |

---

## 🖥️ Supported Platforms

| Platform | Config Location | Best For |
|----------|----------------|----------|
| **Claude Code** | `~/.claude/` | Deep workflows, TDD, planning, security |
| **Codex CLI** | `~/.codex/` | Fast parallel execution, batch tasks |
| **Cursor** | `.cursor/` | Visual IDE, real-time coding |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Inline completions, chat |
| **OpenCode** | `.opencode/` | Open-source, extensible |

---

## 📖 Guides

| Guide | Description |
|-------|-------------|
| [**Cross-Platform Integration**](docs/CROSS_PLATFORM_INTEGRATION.md) | How all 5 platforms share one orchestration layer |
| [**Extreme Dev Playbook**](docs/EXTREME_DEV_PLAYBOOK.md) | Daily workflow for all platforms working together |
| [**Shortform Guide**](docs/the-shortform-guide.md) | Setup, foundations, philosophy |
| [**Longform Guide**](docs/the-longform-guide.md) | Token optimization, memory persistence, evals |
| [**Security Guide**](docs/the-security-guide.md) | Scanning, secret management, OWASP patterns |
| [**Troubleshooting**](TROUBLESHOOTING.md) | Common issues and fixes |

---

## 🗂 Project Structure

```
claude-fulcrum/
├── agents/              # 25 specialized agents
├── skills/              # 112 workflow skills
├── commands/            # 62 slash commands
├── hooks/               # Session lifecycle, pre/post tool hooks
├── rules/               # 9 language rule sets
│   ├── common/          #   Universal standards
│   ├── typescript/      #   TypeScript/React/Next.js
│   ├── python/          #   Python/Django
│   ├── golang/          #   Go
│   ├── kotlin/          #   Kotlin/Android/KMP
│   ├── cpp/             #   C++20
│   ├── perl/            #   Perl 5.36+
│   ├── php/             #   PHP/Laravel
│   └── swift/           #   Swift 6.2
├── scripts/             # 142 scripts (hooks, utils, libs)
│   ├── hooks/           #   Session lifecycle, quality gate
│   ├── lib/             #   State store, migrations, queries
│   ├── memory/          #   Search orchestrator, knowledge graph
│   └── utils/           #   Embeddings, package manager, validators
├── tests/               # 1,536 tests across 75 test files
├── orchestration/       # claude-flow swarm orchestration
├── mcp-configs/         # MCP server configurations
├── docs/                # Comprehensive guides
├── .codex/              # Codex CLI config
├── .cursor/             # Cursor config
├── .opencode/           # OpenCode config
├── .github/             # GitHub + Copilot config
├── .vscode/             # VS Code settings
├── install.sh           # Unix installer
├── install.ps1          # Windows installer
├── CLAUDE.md            # Claude Code instructions
├── AGENTS.md            # Agent routing
└── package.json         # Project manifest
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

## 🧪 Test Suite

```bash
npm test               # Run all 1,536 tests
npm run coverage       # Coverage report (80%+ required)
npm run lint           # Lint everything
npm run harness:audit  # Audit harness configuration
```

| Category | Tests |
|----------|-------|
| Agent definitions | Validated |
| Command definitions | Validated |
| Skill definitions | Validated |
| Rule set structure | Validated |
| Hook execution | Validated |
| State store & migrations | Validated |
| Memory search (FTS5 + vector) | Validated |
| Knowledge graph | Validated |
| Quality enforcement | Validated |
| Session lifecycle | Validated |
| **Total** | **1,536 passing** |

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

```bash
# Fork → branch → implement → test → PR
git checkout -b feat/my-feature
npm test                              # all 1,536 tests must pass
```

**File formats:**

| Type | Format |
|------|--------|
| **Agents** | Markdown with YAML frontmatter (`name`, `description`, `tools`, `model`) |
| **Skills** | Markdown with sections (When to Use, How It Works, Examples) |
| **Commands** | Markdown with `description` frontmatter |
| **Rules** | Markdown in `rules/<language>/` |

**Naming convention:** lowercase with hyphens — `python-reviewer.md`, `tdd-workflow.md`

---

## 🏷️ Topics

`claude-code` · `claude-code-agents` · `ai-dev-workflow` · `claude-code-setup` · `codex-cli` · `cursor-ai` · `github-copilot` · `opencode` · `claude-flow` · `ai-agents` · `mcp-server` · `developer-tools` · `tdd` · `code-review` · `multi-agent` · `agent-orchestration` · `vector-search` · `knowledge-graph` · `swarm-intelligence`

---

## 📊 By the Numbers

| Metric | Count |
|--------|------:|
| Specialized Agents | **25** |
| Workflow Skills | **112** |
| Slash Commands | **62** |
| Language Rule Sets | **9** |
| Supported Platforms | **5** |
| Utility Scripts | **142** |
| Test Cases | **1,536** |
| Search Signals | **4** |

---

## 📜 License

[MIT](LICENSE) — use it, fork it, ship it.

---

<div align="center">

<br>

**Claude Fulcrum** — *where every AI coding tool becomes part of the same team.*

<br>

**[⬆ Back to Top](#-claude-fulcrum)**

</div>