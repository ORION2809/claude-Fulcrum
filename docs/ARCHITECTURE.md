# Claude Fulcrum — Complete Architecture Reference

> **Version 3.1** · Last updated by agent swarm deep-dive

This document provides a complete technical reference for every subsystem in Claude Fulcrum — the production-grade AI agent harness that unifies Claude Code, Codex CLI, Cursor, GitHub Copilot, and OpenCode into a single orchestrated development environment.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Agent System](#2-agent-system)
3. [Skills System](#3-skills-system)
4. [Commands System](#4-commands-system)
5. [Memory Layer](#5-memory-layer)
6. [Quality Enforcement](#6-quality-enforcement)
7. [Hook System](#7-hook-system)
8. [Orchestration Engine](#8-orchestration-engine)
9. [Install System](#9-install-system)
10. [Session Lifecycle](#10-session-lifecycle)
11. [Language Rule Sets](#11-language-rule-sets)
12. [Platform Adapters](#12-platform-adapters)
13. [Scripts & Utilities](#13-scripts--utilities)
14. [Schemas & Validation](#14-schemas--validation)
15. [CI & Testing](#15-ci--testing)
16. [Configuration Reference](#16-configuration-reference)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLAUDE FULCRUM v3.1                           │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │25 Agents │  │112 Skills│  │62 Commands│  │ 9 Rules  │  │33 Hooks │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │             │              │              │      │
│  ┌────▼──────────────▼─────────────▼──────────────▼──────────────▼───┐ │
│  │                    Orchestration Engine                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐│ │
│  │  │ Swarm Coord  │  │ Task Router  │  │ Quality Enforcer         ││ │
│  │  │ (claude-flow)│  │ (3-tier)     │  │ (lint+test+review+fix)   ││ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘│ │
│  └───────────────────────────┬───────────────────────────────────────┘ │
│                              │                                         │
│  ┌───────────────────────────▼───────────────────────────────────────┐ │
│  │                       Memory Layer                                │ │
│  │  ┌────────────┐  ┌──────────────┐  ┌────────────────────────────┐│ │
│  │  │ SQLite +   │  │ Vector Search│  │ Knowledge Graph            ││ │
│  │  │ FTS5 Index │  │ (384-dim)    │  │ (Entity→Relationship)      ││ │
│  │  └────────────┘  └──────────────┘  └────────────────────────────┘│ │
│  │  4-Signal Hybrid Ranking via Reciprocal Rank Fusion              │ │
│  └───────────────────────────┬───────────────────────────────────────┘ │
│                              │                                         │
│  ┌───────────────────────────▼───────────────────────────────────────┐ │
│  │                     Platform Adapters                             │ │
│  │  ┌───────────┐ ┌─────────┐ ┌──────┐ ┌───────┐ ┌──────────┐     │ │
│  │  │Claude Code│ │Codex CLI│ │Cursor│ │Copilot│ │ OpenCode │     │ │
│  │  └───────────┘ └─────────┘ └──────┘ └───────┘ └──────────┘     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Quantitative Summary

| Component | Count | Description |
|-----------|------:|-------------|
| Agents | 25 | Specialized AI agents (planning, review, build, language, ops) |
| Skills | 112 | Domain knowledge modules (languages, testing, security, content) |
| Commands | 62 | Slash-activated workflows |
| Language Rules | 9 | Common + 8 language-specific rulesets |
| Hooks | 33 | Lifecycle automations across 7 phases |
| Scripts | 142 | Utilities, CI validators, session management |
| Tests | 1,536 | Full test suite (80%+ coverage required) |
| Platforms | 5 | Claude Code, Codex CLI, Cursor, Copilot, OpenCode |
| Schemas | 13 | JSON Schema validation for all data structures |

---

## 2. Agent System

### 2.1 Architecture

Agents are Markdown files with YAML frontmatter defining their capabilities:

```yaml
---
name: agent-name
description: What this agent does and when to activate
tools: [Read, Write, Edit, Bash, Grep, Glob]
model: opus | sonnet | haiku
---
```

Agents activate **automatically** based on context — no manual invocation required.

### 2.2 Agent Catalog (25 Total)

#### Planning & Architecture (2)

| Agent | Model | Purpose |
|-------|-------|---------|
| **planner** | Opus | Step-by-step implementation plans with risk analysis and dependency mapping. Activates for complex features, multi-file changes, refactoring. |
| **architect** | Opus | System design, scalability analysis, technology selection. Activates for architectural decisions and new system planning. |

#### Code Review & Quality (7)

| Agent | Model | Purpose |
|-------|-------|---------|
| **code-reviewer** | Sonnet | Code quality, security, maintainability. Runs `git diff` analysis. **Activates after every code modification.** |
| **security-reviewer** | Sonnet | OWASP Top 10, secrets detection, injection, SSRF, unsafe crypto. Activates for auth code, APIs, user input handling. |
| **database-reviewer** | Sonnet | PostgreSQL/Supabase schema design, query optimization, indexing. |
| **doc-updater** | Haiku | Documentation and codemap generation. Runs `/update-codemaps` and `/update-docs`. |
| **docs-lookup** | Sonnet | Live documentation lookup via Context7 MCP. Fetches current library docs instead of using training data. |
| **e2e-runner** | Sonnet | Playwright E2E testing with Page Object Model. Captures screenshots, videos, traces on failure. |
| **refactor-cleaner** | Sonnet | Dead code cleanup via knip, depcheck, ts-prune. Categorizes by safety tier. |

#### Test-Driven Development (1)

| Agent | Model | Purpose |
|-------|-------|---------|
| **tdd-guide** | Sonnet | Enforces write-tests-first methodology (RED → GREEN → REFACTOR). Ensures 80%+ coverage. |

#### Language Reviewers (6)

| Agent | Language | Key Expertise |
|-------|----------|---------------|
| **python-reviewer** | Python | PEP 8, type hints, Pythonic idioms, security |
| **go-reviewer** | Go | Idiomatic Go, concurrency, error handling |
| **kotlin-reviewer** | Kotlin/Android/KMP | Coroutine safety, Compose, clean architecture |
| **java-reviewer** | Java/Spring Boot | Layered architecture, JPA, concurrency |
| **rust-reviewer** | Rust | Ownership, lifetimes, unsafe usage, async |
| **cpp-reviewer** | C++ | Memory safety, modern C++ idioms, RAII |

#### Build Resolvers (6)

| Agent | Fixes |
|-------|-------|
| **build-error-resolver** | TypeScript/JavaScript build and type errors |
| **go-build-resolver** | Go compilation, `go vet`, linter issues |
| **kotlin-build-resolver** | Kotlin/Gradle build failures |
| **java-build-resolver** | Java/Maven/Gradle dependency errors |
| **rust-build-resolver** | Cargo build, borrow checker issues |
| **cpp-build-resolver** | CMake, compilation, linker, template errors |

#### Operations (3)

| Agent | Model | Purpose |
|-------|-------|---------|
| **chief-of-staff** | Opus | Communication triage across email, Slack, LINE, Messenger. 4-tier classification (skip → info → meeting → action). |
| **loop-operator** | Sonnet | Autonomous agent loop monitoring. Detects stalls, manages intervention. |
| **harness-optimizer** | Sonnet | Configuration tuning for reliability, cost, and throughput. |

### 2.3 Activation Strategy

```
Complex feature request    → planner (auto)
Code just modified         → code-reviewer (auto)
Bug fix or new feature     → tdd-guide (auto)
Architectural decision     → architect (auto)
Security-sensitive code    → security-reviewer (auto)
Build failure              → [lang]-build-resolver (auto)
Language-specific code     → [lang]-reviewer (auto)
```

---

## 3. Skills System

### 3.1 Architecture

Skills are deep domain knowledge modules in Markdown. Each contains:
- **When to Use** — activation triggers
- **How It Works** — core concepts and patterns
- **Examples** — implementation samples
- **Best Practices** — dos and don'ts

### 3.2 Skill Categories (112 Total)

#### Core Development (12)
`tdd-workflow` · `frontend-patterns` · `backend-patterns` · `api-design` · `coding-standards` · `security-review` · `e2e-testing` · `verification-loop` · `ai-regression-testing` · `continuous-learning` · `continuous-learning-v2` · `strategic-compact`

#### Language-Specific Patterns (24)
- **C++** (4): `cpp-coding-standards` · `cpp-testing` + 2 more
- **Go** (2): `golang-patterns` · `golang-testing`
- **Java/Spring Boot** (4): `java-coding-standards` · `springboot-patterns` · `springboot-tdd` · `springboot-verification`
- **Kotlin** (6): `kotlin-patterns` · `kotlin-testing` · `kotlin-coroutines-flows` · `kotlin-exposed-patterns` · `kotlin-ktor-patterns` · `compose-multiplatform-patterns`
- **Python** (3): `python-patterns` · `python-testing` · `django-patterns`
- **PHP/Laravel** (3): `laravel-patterns` · `laravel-tdd` · `laravel-verification`
- **Perl** (2): `perl-patterns` · `perl-testing`
- **Rust** (2): `rust-patterns` · `rust-testing`

#### Framework & Library (13)
`nextjs-turbopack` · `bun-runtime` · `mcp-server-patterns` · `claude-api` · `django-patterns` · `django-tdd` · `django-verification` · `springboot-patterns` · `kotlin-ktor-patterns` · `kotlin-exposed-patterns` · `laravel-patterns` · `laravel-tdd` · `android-clean-architecture`

#### Content & Communication (8)
`article-writing` · `content-engine` · `crosspost` · `investor-materials` · `investor-outreach` · `video-editing` · `frontend-slides` · `fal-ai-media`

#### Research & Discovery (4)
`deep-research` · `market-research` · `exa-search` · `documentation-lookup`

#### AI & Automation (10+)
`claude-api` · `continuous-learning` · `continuous-learning-v2` · `eval-harness` · `dmux-workflows` · `mcp-server-patterns` · `strategic-compact` · `iterative-retrieval` · `prompt-optimizer` · `x-api`

#### Security & DevOps (10+)
`security-review` · `docker-patterns` · `deployment-patterns` · `database-migrations` · `postgres-patterns` · `django-verification` · `laravel-verification` · `springboot-verification`

---

## 4. Commands System

### 4.1 Architecture

Commands are Markdown files with `description` frontmatter. They are invoked via `/command-name` and delegate to specialized agents.

### 4.2 Command Catalog (62 Total)

#### Planning & Architecture (5)
`/plan` · `/multi-plan` · `/orchestrate` · `/devfleet` · `/projects`

#### Development (7)
`/tdd` · `/build-fix` · `/code-review` · `/refactor-clean` · `/quality-loop` · `/quality-gate` · `/quality-override`

#### Testing & Verification (5)
`/e2e` · `/test-coverage` · `/verify` · `/confidence-check` · `/eval`

#### Language-Specific (14)
`/python-review` · `/go-review` · `/go-build` · `/go-test` · `/kotlin-review` · `/kotlin-build` · `/kotlin-test` · `/rust-review` · `/rust-build` · `/rust-test` · `/cpp-review` · `/cpp-build` · `/cpp-test` · `/gradle-build`

#### Sessions & Memory (7)
`/save-session` · `/resume-session` · `/sessions` · `/memory-search` · `/learn` · `/learn-eval` · `/checkpoint`

#### Skills & Learning (7)
`/skill-create` · `/skill-health` · `/evolve` · `/promote` · `/instinct-status` · `/instinct-export` · `/instinct-import`

#### Orchestration & Ops (9)
`/loop-start` · `/loop-status` · `/multi-execute` · `/multi-backend` · `/multi-frontend` · `/multi-workflow` · `/harness-audit` · `/model-route` · `/pm2`

#### Documentation & Utilities (8)
`/docs` · `/update-docs` · `/update-codemaps` · `/prompt-optimize` · `/setup-pm` · `/aside` · `/attempt` · `/claw`

---

## 5. Memory Layer

### 5.1 State Store

**Implementation:** sql.js (WASM-based SQLite) with 4 schema migrations.

**Core Tables:**

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `sessions` | Session tracking | id, started_at, ended_at, summary, context_json |
| `observations` | Development observations | session_id, content, category, embedding, created_at |
| `memory_notes` | Persistent memory | content, tags, category, embedding, importance |
| `governance_events` | Audit trail | event_type, policy_name, decision, evidence_json |
| `entities` | Knowledge graph nodes | name, type, metadata |
| `relationships` | Knowledge graph edges | source_id, target_id, relationship_type |
| `embeddings` | Vector storage | entity_id, vector, model_name |

**API Surface:** 50+ methods covering CRUD, search, aggregation, and graph operations.

### 5.2 Embedding System

- **Primary:** ONNX Runtime with `Xenova/all-MiniLM-L6-v2` (384-dimensional vectors)
- **Fallback:** Deterministic hash-based embeddings when ONNX is unavailable
- **Similarity:** Cosine similarity for vector matching
- **Auto-embed:** Vectors computed on every observation and memory note write

### 5.3 4-Signal Hybrid Search

Every memory query combines four ranking signals via **Reciprocal Rank Fusion (RRF)**:

| Signal | Method | Weight |
|--------|--------|--------|
| **Lexical** | FTS5 full-text search with porter stemming (LIKE fallback if FTS5 unavailable) | High |
| **Recency** | Exponential time-decay scoring | Medium |
| **Structure** | Category and entity-type boosting from the knowledge graph | Medium |
| **Vector** | Cosine similarity on 384-dim embeddings | High |

**Search Pipeline:**
```
Query → Parallel signal execution → Per-signal ranking → RRF fusion → Top-K results
```

### 5.4 Knowledge Graph

Automatic entity extraction and relationship mapping:

- **Entity Types:** file, function, class, package, API, person, decision, config, test, error, pattern, architecture
- **Relationship Types:** `depends-on` · `implements` · `tested-by` · `authored-by` · `decided-in`
- **Traversal:** BFS + DFS with time-aware decay (recent relationships weighted higher)
- **Queries:** Multi-hop reasoning — "find all files depending on module X that were modified this week"

### 5.5 Memory Evolution

- **Incremental dedup:** Merges semantically similar memory notes to prevent bloat
- **Time-aware traversal:** Recent observations score higher in graph walks
- **Progressive disclosure:** Shows summaries first, expands detail on demand
- **Graceful degradation:** Falls back to LIKE search when FTS5 is unavailable

---

## 6. Quality Enforcement

### 6.1 Quality Loop

```
Code Written → Lint → Type Check → Tests → Coverage Gate → Security Scan
       ↑                                                         │
       └─────────── Automatic Fix & Retry (max 5 iterations) ◄──┘
```

**Termination conditions:** `QUALITY_MET` · `OSCILLATION` · `STAGNATION` · `MAX_ITERATIONS` · `ERROR`

### 6.2 Deterministic Scorer (`scorer.js`)

Computes a 0-100 quality score from 5 weighted components:

| Component | Max Points | Description |
|-----------|-----------|-------------|
| Code changes present | 30 | Non-trivial code was written |
| Tests run | 25 | Test suite was executed |
| Test pass rate | 25 | Percentage of tests passing |
| Coverage | 10 | Meets 80%+ threshold |
| No errors | 10 | Clean lint and type check |

**Hard caps:** Security violation → max 30 · 50%+ test failures → max 40 · Build broken → max 45

**Score bands:** Poor (<40) · Needs Work (40-59) · Acceptable (60-74) · Good (75-89) · Excellent (≥90)

**Trend detection:** `isImproving` · `isOscillating` · `isStagnating`

### 6.3 Confidence Gate (`confidence-gate.js`)

Multi-factor confidence scoring before proceeding:

| Dimension | Weight | Measures |
|-----------|--------|----------|
| Requirement clarity | 40% | How well the task is specified |
| Prior mistake detection | 30% | Whether similar errors occurred before |
| Context readiness | 30% | Sufficient codebase context loaded |

**Thresholds:** Blocker < 0.6 · Proceed ≥ 0.7

### 6.4 Cross-Model Auditor (`cross-model-auditor.js`)

3-layer verification pipeline to catch hallucinations:

| Layer | Method |
|-------|--------|
| Self-Audit | Model reviews its own output for 7 hallucination patterns |
| Source Verification | Cross-references claims against actual code/files |
| Adversarial Review | Optional external model endpoint for independent check |

### 6.5 Policy Validators (`policy-validators.js`)

| Policy | Enforcements |
|--------|-------------|
| **KISS** | Cyclomatic complexity ≤ 10 · Functions ≤ 50 lines · Nesting ≤ 4 levels · Parameters ≤ 5 |
| **Purity** | Functional core / imperative shell pattern |
| **SOLID** | Files ≤ 300 lines · Public methods ≤ 5 per class |

### 6.6 Self-Review (`self-review.js`)

12-item checklist + 7 hallucination red flags:

**Checklist:** Tests exist · Tests pass · No lint errors · No type errors · Coverage ≥ 80% · No hardcoded secrets · Error handling present · Input validation · No deep nesting · Functions are small · Files are focused · Changes are minimal

**Verdict:** `proceed` · `proceed_with_caution` · `block`

### 6.7 Privacy Gate (`privacy-gate.js`)

Strips sensitive data before persistence:
- `ECC:SECRET` tagged content
- OpenAI API keys · GitHub tokens · AWS keys · Bearer tokens
- Pattern-based detection with configurable rules

---

## 7. Hook System

### 7.1 Architecture

33 hooks across 7 lifecycle phases. All hooks are async with timeouts and `continueOnError: true` — they never block the user.

### 7.2 Hook Phases

| Phase | When | Count |
|-------|------|-------|
| **PreToolUse** | Before tool execution | 8 |
| **PostToolUse** | After tool execution | 8 |
| **PreCompact** | Before context compaction | 2 |
| **SessionStart** | Session initialization | 3 |
| **UserPromptSubmit** | User sends a prompt | 1 |
| **Stop** | Session ends | 4 |
| **SessionEnd** | Session teardown | 2 |

### 7.3 Notable Hooks

| Hook | Phase | Purpose |
|------|-------|---------|
| `session-lifecycle.js` | SessionStart/End | 4 lifecycle events, sanitization, observation + memory note creation |
| `quality-gate.js` | PostToolUse | Runs quality enforcement loop after code edits |
| `post-edit-format.js` | PostToolUse | Auto-formats code after edits |
| `post-edit-typecheck.js` | PostToolUse | Runs type checking after edits |
| `protect-configs.js` | PreToolUse | Prevents modification of critical config files |
| `config-guardian-stop.js` | Stop | Validates config integrity at session end |
| `cost-tracker.js` | Stop | Logs session cost metrics |
| `context-budget.js` | PreCompact | Warns at 70% context, recommends compaction at 85% |
| `privacy-gate.js` | PreToolUse | Strips secrets before persistence |
| `repo-hook-trust.js` | PreToolUse | Validates hook source integrity |

### 7.4 Configuration

**Flag system:** `minimal` · `standard` · `strict` modes via `CF_HOOK_PROFILE`

**Protected paths:**
```
.eslintrc*, .prettierrc, biome.json, tsconfig.json
.claude/settings.json, .claude/hooks/*
hooks/hooks.json, config/hook-control-plane.json
```

---

## 8. Orchestration Engine

### 8.1 claude-flow Integration

Multi-agent swarm coordination via `npx claude-flow@alpha`:

```bash
npx claude-flow@alpha swarm start --topology hierarchical
npx claude-flow@alpha mcp start
npx claude-flow@alpha memory store --key "k" --value "v"
```

### 8.2 Topologies

| Topology | Pattern | Use Case |
|----------|---------|----------|
| **Hierarchical** | Leader → worker agents | Planner distributes tasks to workers |
| **Mesh** | Peer-to-peer | Collaborative problem solving |
| **Ring** | Sequential pipeline | Multi-stage processing |
| **Star** | Central coordinator | One coordinator + multiple specialists |

### 8.3 3-Tier Model Routing

| Tier | Handler | Latency | Cost | Use Case |
|------|---------|---------|------|----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture |

### 8.4 Shared State

- **Vector memory:** HNSW search index for cross-agent context
- **Session state:** Persisted in SQLite, accessible by all agents
- **Consensus:** Raft/BFT for distributed state agreement
- **Concurrency:** Parallel agent spawning via MCP tools

---

## 9. Install System

### 9.1 Architecture

5 target adapters with 3 operation strategies and dependency-aware resolution.

### 9.2 Targets

| Target | Location | Pattern |
|--------|----------|---------|
| **claude-home** | `~/.claude/` | Home directory installation |
| **cursor-project** | `.cursor/` | Project-scoped |
| **antigravity-project** | `.antigravity/` | Project-scoped |
| **codex-home** | `~/.codex/` | Home directory |
| **opencode-home** | `~/.opencode/` | Home directory |

### 9.3 Profiles

| Profile | Modules | Use Case |
|---------|---------|----------|
| **core** | 6 | Essential agents + rules |
| **developer** | 9 | Core + testing + docs |
| **security** | 7 | Core + security scanning |
| **research** | 9 | Core + research skills |
| **full** | 19 | Everything |

### 9.4 Operation Strategies

1. **preserve-relative-path** — Maintains directory structure during copy
2. **flatten-copy** — Flattens into target directory
3. **sync-root-children** — Syncs specific children of root

### 9.5 Dependency Resolution

DFS-based topological sort ensures modules install in correct order. Each module declares its dependencies and the resolver builds the install graph.

---

## 10. Session Lifecycle

### 10.1 Lifecycle Events

```
SessionStart → UserPromptSubmit → [PreToolUse → Tool → PostToolUse]* → Stop → SessionEnd
```

### 10.2 Session Adapter

**Canonical schema:** `ecc.session.v1`

5 session adapters for different contexts:
- **canonical-session.js** — Unified session schema, validates context
- **claude-history.js** — Claude conversation history format
- **dmux-tmux.js** — Multi-pane tmux orchestration
- **memory-retrieval.js** — Memory-backed session recovery
- **registry.js** — Adapter registry and routing

### 10.3 Session Persistence

- **Auto-save:** State saved on every hook event
- **Resume:** `/resume-session` restores full context
- **Privacy gate:** Filters sensitive data before persistence
- **Config protection:** Critical files backed up before modification

---

## 11. Language Rule Sets

### 11.1 Structure

Each language ruleset includes 5 files:

| File | Content |
|------|---------|
| `coding-style.md` | Idioms, naming, structure, immutability |
| `testing.md` | Framework-specific testing patterns |
| `security.md` | Language-specific security practices |
| `patterns.md` | Design patterns and common solutions |
| `hooks.md` | Tooling integrations (linters, formatters) |

### 11.2 Supported Languages (9 Rulesets)

| Ruleset | Key Enforcements |
|---------|-----------------|
| **Common** | Immutability, error handling, input validation, 80%+ coverage |
| **TypeScript** | Strict mode, ESM imports, React/Next.js patterns, Zod validation |
| **Python** | PEP 8, type hints, dataclasses, Pythonic idioms |
| **Go** | Standard library first, explicit error handling, table-driven tests |
| **Kotlin** | Coroutines, null safety, sealed classes, Compose state |
| **C++** | Modern C++20, RAII, smart pointers, no raw `new`/`delete` |
| **Perl** | Modern Perl 5.36+, strict/warnings, Moose/Moo |
| **PHP** | PSR-12, Laravel conventions, Composer autoloading |
| **Swift** | Swift 6.2 concurrency, protocol-oriented, actor isolation |

### 11.3 Auto-Application

Rules apply automatically based on file extension:
- `*.ts`, `*.tsx`, `*.js`, `*.jsx` → TypeScript rules
- `*.py` → Python rules
- `*.go` → Go rules
- `*.kt`, `*.kts` → Kotlin rules
- `*.cpp`, `*.hpp`, `*.h` → C++ rules
- `*.swift` → Swift rules
- `*.php` → PHP rules
- `*.pl`, `*.pm` → Perl rules

---

## 12. Platform Adapters

### 12.1 Platform Matrix

| Platform | Config Location | Agents | Skills | Rules | Role |
|----------|----------------|--------|--------|-------|------|
| **Claude Code** | `~/.claude/` | Full 25 | Full 112 | Full 9 | Deep workflows, TDD, planning |
| **Codex CLI** | `~/.codex/` | Core | Core | Core | Fast parallel execution |
| **Cursor** | `.cursor/` | 11 | via rules | Full 9 | Visual IDE integration |
| **GitHub Copilot** | `.github/` | 11 | via instructions | 7 | Inline completions + chat |
| **OpenCode** | `~/.opencode/` | Core | Core | Core | Open-source alternative |

### 12.2 Copilot-Specific Config

- **11 agents** in `.github/agents/`
- **30 prompt templates** in `.github/prompts/`
- **7 language instructions** in `.github/instructions/`
- **Main instructions** in `.github/copilot-instructions.md`

### 12.3 Shared Context

All platforms read from and write to the same memory layer:

| Platform | Reads | Writes |
|----------|-------|--------|
| Claude Code | Everything | Patterns → memory |
| Codex CLI | Plans, tasks | Results, code |
| Cursor | Agents, skills | Code changes |
| Copilot | Standards, patterns | — |
| OpenCode | Full library | Code, docs |

---

## 13. Scripts & Utilities

### 13.1 Core Libraries (`scripts/lib/`)

| Module | Purpose |
|--------|---------|
| `control-plane.js` | Governance logging, SHA256 hashing, token estimation |
| `fulcrum-control.js` | Platform detection (Windows/Mac/Linux), path resolution |
| `persona-router.js` | Routes tasks to specialized personas (coder, architect, debugger, reviewer, tester) |
| `tmux-worktree-orchestrator.js` | Git + tmux multi-agent orchestration |

### 13.2 Quality Modules (`scripts/lib/quality/`)

| Module | Purpose |
|--------|---------|
| `scorer.js` | Deterministic 0-100 quality scoring |
| `confidence-gate.js` | Multi-factor proceed/block decision |
| `cross-model-auditor.js` | 3-layer hallucination detection |
| `policy-validators.js` | KISS, Purity, SOLID enforcement |
| `evidence-collector.js` | Standardizes evidence inputs |
| `self-review.js` | 12-item checklist + 7 hallucination flags |
| `loop.js` | Quality loop execution (max 5 iterations) |
| `telemetry-writer.js` | Quality metrics persistence |

### 13.3 Skill Evolution (`scripts/lib/skill-evolution/`)

| Module | Purpose |
|--------|---------|
| `dashboard.js` | Sparklines, progress bars, metrics visualization |
| `health.js` | Success rate, failure patterns, degradation detection |
| `tracker.js` | Session-by-session usage tracking |
| `versioning.js` | Skill version history |
| `provenance.js` | Skill origin and lineage tracking |

### 13.4 Memory Modules (`scripts/lib/memory/`)

| Module | Purpose |
|--------|---------|
| `search-orchestrator.js` | 4-signal hybrid search, RRF fusion |
| `graph-retrieval.js` | Knowledge graph with multi-hop reasoning |
| `time-aware-traversal.js` | Temporal pattern detection, BFS + DFS |
| `incremental-dedup.js` | Semantic deduplication |
| `memory-evolution.js` | Memory note lifecycle management |
| `rebuild-views.js` | Materialized view reconstruction |
| `retrieval-worker.js` | Parallel retrieval execution |

### 13.5 CI Validators (`scripts/ci/`)

| Script | Validates |
|--------|----------|
| `validate-agents.js` | YAML frontmatter, model tiers |
| `validate-skills.js` | SKILL.md structure |
| `validate-commands.js` | Command definitions |
| `validate-rules.js` | Rule file structure |
| `validate-hooks.js` | Hook definitions |
| `validate-install-manifests.js` | Dependency graph integrity |
| `validate-no-personal-paths.js` | No hardcoded personal paths |
| `catalog.js` | Generates searchable indexes |

### 13.6 Action Queue & Governance

| Module | Purpose |
|--------|---------|
| `action-queue.js` | 6-status async task queue (QUEUED → IN_PROGRESS → COMPLETED/FAILED → KILLED/SKIPPED). Dependency-aware claiming with retry and reset plans. |
| `governance-log.js` | JSONL + SQLite dual storage. Event normalization. Policy decision audit trail. |

---

## 14. Schemas & Validation

13 JSON Schema files in `schemas/`:

| Schema | Purpose |
|--------|---------|
| `state-store.schema.json` | SQLite table definitions |
| `quality-loop.schema.json` | Quality scoring rules |
| `confidence-gate.schema.json` | Confidence thresholds |
| `hooks.schema.json` | Hook matchers and timeouts |
| `governance-event.schema.json` | Event logging format |
| `install-*.schema.json` (6) | Installation profiles, modules, state, manifests |
| `plugin.schema.json` | Plugin system definitions |
| `package-manager.schema.json` | Package manager detection |
| `memory-note.schema.json` | Memory note structure |

All data structures are validated via Ajv at runtime.

---

## 15. CI & Testing

### 15.1 Test Suite

**1,536 tests** across 76 test files in 8 categories:

| Category | Files | Coverage |
|----------|-------|----------|
| `lib/` | 26 | Core libraries (install, session, state, quality) |
| `hooks/` | 16 | Hook handlers, lifecycle, quality gates |
| `scripts/` | 17 | CLI tools, installation, diagnostics |
| `memory/` | 7 | Graph retrieval, dedup, evolution, search |
| `quality/` | 5 | Confidence scoring, model auditing |
| `agents/` | 4 | Agent selector, handoff contracts |
| `ci/` | 1 | CI validator tests |
| `integration/` | 1 | Full pipeline integration |

### 15.2 CI Validators

8 validators run on every commit to enforce structural integrity:
- Agent YAML frontmatter correctness
- Skill SKILL.md section requirements
- Command description presence
- Hook timeout and flag consistency
- Install manifest dependency graph
- No hardcoded personal paths

### 15.3 Running Tests

```bash
node tests/run-all.js    # All 1,536 tests
npm run coverage         # Coverage report (80%+ required)
npm run lint             # ESLint + formatting
npm run harness:audit    # Harness health check
```

---

## 16. Configuration Reference

### 16.1 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CLAUDE_PACKAGE_MANAGER` | auto-detected | Override: npm, pnpm, yarn, bun |
| `CF_HOOK_PROFILE` | standard | Hook strictness: minimal, standard, strict |
| `CF_DISABLED_HOOKS` | — | Comma-separated hook names to disable |

### 16.2 Hook Control Plane (`config/hook-control-plane.json`)

```json
{
  "version": "3.1.0",
  "protectedPaths": [".eslintrc*", "tsconfig.json", "hooks/hooks.json"],
  "policyBundles": {
    "configProtection": true,
    "qualityLoop": { "threshold": 70, "maxIterations": 5, "timeout": "5m" },
    "memoryLifecycle": true
  },
  "contextBudget": { "warning": 0.70, "aggressive": 0.85 }
}
```

### 16.3 MCP Servers (`mcp-configs/`)

| Server | Purpose |
|--------|---------|
| claude-flow | Multi-agent swarm orchestration |
| memory | Persistent memory across sessions |
| sequential-thinking | Step-by-step reasoning |
| context7 | Library documentation lookup |
| playwright | Browser automation & E2E testing |
| firecrawl | Web scraping & research |
| supabase | Database operations |
| github | Repository management |

---

## Appendix: Data Flow

```
User Request
    │
    ▼
Matched Command (/plan, /tdd, /code-review, ...)
    │
    ▼
Activates Specialized Agent (planner, tdd-guide, code-reviewer, ...)
    │
    ▼
Agent loads relevant Skills (coding-standards, tdd-workflow, api-design, ...)
    │
    ▼
Language-specific Rules auto-apply based on file type
    │
    ▼
PreToolUse Hooks fire (privacy gate, config protection, security)
    │
    ▼
Tool Execution (read, write, edit, bash, grep)
    │
    ▼
PostToolUse Hooks fire (format, typecheck, quality gate)
    │
    ▼
Quality Loop evaluates (score, confidence, policy compliance)
    │
    ▼
Results persisted to Memory Layer (observations, entities, embeddings)
    │
    ▼
Stop Hooks fire (session save, cost tracking, config guardian)
```
