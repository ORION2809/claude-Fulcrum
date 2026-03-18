# GitHub Copilot Integration Ã¢â‚¬â€ Implementation Documentation

This document provides a comprehensive breakdown of the GitHub Copilot customization system implemented for the **Claude Fulcrum (Claude Fulcrum)** project. It covers every file created, the design rationale, how each feature works, and how to use them in VS Code.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture & File Structure](#2-architecture--file-structure)
3. [Global Instructions (`copilot-instructions.md`)](#3-global-instructions)
4. [Language-Scoped Instructions (7 files)](#4-language-scoped-instructions)
5. [Reusable Prompts (30 files)](#5-reusable-prompts)
6. [Custom Agents (11 files)](#6-custom-agents)
7. [MCP Server Configuration (14 servers)](#7-mcp-server-configuration)
8. [VS Code Settings](#8-vs-code-settings)
9. [How to Use Each Feature](#9-how-to-use-each-feature)
10. [Feature Mapping: ECC Ã¢â€ â€™ Copilot](#10-feature-mapping-ecc--copilot)
11. [Troubleshooting](#11-troubleshooting)
12. [File Inventory](#12-complete-file-inventory)

---

## 1. Overview

### What Was Built

A complete GitHub Copilot customization layer that brings the Claude Fulcrum toolkit's principles, workflows, and specialized agents into VS Code's Copilot Chat. The implementation consists of **49 files** across 4 categories:

| Category | Count | Location | Purpose |
|----------|-------|----------|---------|
| Global Instructions | 1 | `.github/copilot-instructions.md` | Always-active project context for every Copilot interaction |
| Language Instructions | 7 | `.github/instructions/*.instructions.md` | Auto-activate when editing files of that language |
| Reusable Prompts | 30 | `.github/prompts/*.prompt.md` | On-demand workflow templates invoked with `#` in chat |
| Custom Agents | 11 | `.github/agents/*.agent.md` | Specialized AI personas with restricted tool access |
| VS Code Settings | 1 | `.vscode/settings.json` | Enables features + configures 14 MCP servers |

### Design Philosophy

The implementation mirrors ECC's existing agent/skill/rule architecture but uses VS Code Copilot's native customization formats:

- **ECC `agents/*.md`** Ã¢â€ â€™ **Copilot `.github/agents/*.agent.md`** (YAML frontmatter with `tools` array)
- **ECC `commands/*.md`** Ã¢â€ â€™ **Copilot `.github/prompts/*.prompt.md`** (YAML frontmatter with `{{{ input }}}` variable)
- **ECC `rules/*.md`** Ã¢â€ â€™ **Copilot `.github/instructions/*.instructions.md`** (YAML frontmatter with `applyTo` glob)
- **ECC `AGENTS.md` / `CLAUDE.md`** Ã¢â€ â€™ **Copilot `.github/copilot-instructions.md`** (global context)
- **ECC `mcp-configs/*.json`** Ã¢â€ â€™ **Copilot `.vscode/settings.json` `mcp.servers`** (MCP tool access)

---

## 2. Architecture & File Structure

```
.github/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ copilot-instructions.md          Ã¢â€ Â Global instructions (always active)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ instructions/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ typescript.instructions.md   Ã¢â€ Â Auto-applies to *.ts, *.tsx, *.js, *.jsx
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ python.instructions.md       Ã¢â€ Â Auto-applies to *.py, *.pyi
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ golang.instructions.md       Ã¢â€ Â Auto-applies to *.go, go.mod, go.sum
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ rust.instructions.md         Ã¢â€ Â Auto-applies to *.rs, Cargo.toml
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ kotlin.instructions.md       Ã¢â€ Â Auto-applies to *.kt, *.kts
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ cpp.instructions.md          Ã¢â€ Â Auto-applies to *.cpp, *.hpp, *.h, CMakeLists.txt
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ java.instructions.md         Ã¢â€ Â Auto-applies to *.java
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ prompts/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ plan.prompt.md               Ã¢â€ Â Core workflow prompts (15)
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ tdd.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ code-review.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ build-fix.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ verify.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ e2e.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ refactor-clean.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ docs-lookup.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ security-review.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ learn.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ architect.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ test-coverage.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ update-docs.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ quality-gate.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ prompt-optimize.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ go-review.prompt.md          Ã¢â€ Â Language-specific reviews (6)
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ python-review.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ rust-review.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ kotlin-review.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ cpp-review.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ java-review.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ go-build.prompt.md           Ã¢â€ Â Language-specific build fixes (5)
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ rust-build.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ kotlin-build.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ cpp-build.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ java-build.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ go-test.prompt.md            Ã¢â€ Â Language-specific testing (4)
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ rust-test.prompt.md
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ kotlin-test.prompt.md
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ cpp-test.prompt.md
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ agents/
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ planner.agent.md             Ã¢â€ Â Read-only planning
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ code-reviewer.agent.md       Ã¢â€ Â Security & quality review
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ tdd-guide.agent.md           Ã¢â€ Â Test-driven development
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ security-reviewer.agent.md   Ã¢â€ Â OWASP Top 10 audit
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ architect.agent.md           Ã¢â€ Â System design
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ build-error-resolver.agent.md Ã¢â€ Â Minimal-diff build fixes
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ refactor-cleaner.agent.md    Ã¢â€ Â Dead code cleanup
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ e2e-runner.agent.md          Ã¢â€ Â Playwright E2E testing
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ doc-updater.agent.md         Ã¢â€ Â Documentation sync
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ database-reviewer.agent.md   Ã¢â€ Â PostgreSQL specialist
    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ docs-lookup.agent.md         Ã¢â€ Â Library docs lookup

.vscode/
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ settings.json                    Ã¢â€ Â Copilot settings + 14 MCP servers
```

---

## 3. Global Instructions

**File:** `.github/copilot-instructions.md` (172 lines)

This file is **automatically loaded into every Copilot Chat interaction** when the workspace is open. It serves as the project's "system prompt" for Copilot.

### What It Contains

| Section | Purpose |
|---------|---------|
| Core Principles | 5 guiding rules: Agent-First, Test-Driven, Security-First, Immutability, Plan-Before-Execute |
| Coding Style | Immutability mandate, file organization (200-400 lines, 800 max), error handling, input validation |
| Security Guidelines | Pre-commit checklist (secrets, injection, XSS, CSRF, auth, rate limiting) |
| Testing Requirements | 80%+ coverage mandate, TDD workflow (RED Ã¢â€ â€™ GREEN Ã¢â€ â€™ REFACTOR) |
| Development Workflow | Plan Ã¢â€ â€™ TDD Ã¢â€ â€™ Review Ã¢â€ â€™ Commit cycle |
| Architecture Patterns | API response envelope format, Repository pattern |
| Agent Orchestration | When to use which agent (planner, code-reviewer, tdd-guide, etc.) |
| Prompt Catalog | Complete list of all 30 prompts with descriptions, organized by category |
| Agent Catalog | Complete list of all 11 agents with descriptions |
| Instruction Catalog | Complete list of all 7 language instruction files |
| Project Structure | Directory layout of the Claude Fulcrum project |

### How It Works

Copilot reads this file automatically when `github.copilot.chat.codeGeneration.useInstructionFiles` is `true` in settings. No user action required Ã¢â‚¬â€ every Copilot response in this workspace is informed by these instructions.

---

## 4. Language-Scoped Instructions

**Location:** `.github/instructions/` (7 files)

These files **auto-activate based on the file type being edited**. When you open a `.py` file and ask Copilot a question, the Python instructions are automatically included in context.

### File Format

```yaml
---
applyTo: "**/*.py,**/*.pyi"
---
# Python Instructions
- Rule 1
- Rule 2
```

The `applyTo` field uses glob patterns. Multiple patterns are comma-separated.

### Language Coverage

| File | Glob Pattern | Key Rules |
|------|-------------|-----------|
| `typescript.instructions.md` | `**/*.ts,**/*.tsx,**/*.js,**/*.jsx` | Strict TS, const over let, no var, interface over type, ESM imports, async/await, readonly, `import type` |
| `python.instructions.md` | `**/*.py,**/*.pyi` | PEP 8, type hints on all functions, dataclasses/Pydantic, pathlib over os.path, f-strings, context managers, pytest |
| `golang.instructions.md` | `**/*.go,**/go.mod,**/go.sum` | gofmt, explicit error handling, errors.Is/As, context.Context first param, table-driven tests, composition over inheritance |
| `rust.instructions.md` | `**/*.rs,**/Cargo.toml` | Clippy clean, Result over panic!, thiserror/anyhow, &str over String params, derive macros, iterators over loops |
| `kotlin.instructions.md` | `**/*.kt,**/*.kts` | val over var, data classes, sealed classes, coroutines for async, Flow for reactive, scope functions, no `!!` |
| `cpp.instructions.md` | `**/*.cpp,**/*.hpp,**/*.cc,**/*.hh,**/*.cxx,**/*.h,**/CMakeLists.txt` | C++ Core Guidelines, smart pointers, string_view, RAII, constexpr, std::optional, ranges, no raw new/delete |
| `java.instructions.md` | `**/*.java` | Java 17+ records, Optional (no null returns), var for locals, Stream API, final for immutability, @Override always, Spring Boot layers |

### How It Works

When you edit a TypeScript file and type a question in Copilot Chat, VS Code detects the file extension, matches it against the `applyTo` globs, and injects the matching instruction file(s) into the prompt context. This happens transparently Ã¢â‚¬â€ no user action needed.

---

## 5. Reusable Prompts

**Location:** `.github/prompts/` (30 files)

Prompts are on-demand workflow templates. They define a structured task that Copilot executes when invoked.

### File Format

```yaml
---
description: "Short description shown in the UI picker"
mode: "agent"
---

# Prompt Title

Instructions for the AI...

{{{ input }}}
```

- **`description`**: Shown in the Copilot prompt picker dropdown
- **`mode: "agent"`**: Runs in agent mode (can use tools, search files, run commands)
- **`{{{ input }}}`**: Placeholder replaced with the user's message when invoked

### Complete Prompt Catalog

#### Core Workflow Prompts (15)

| Prompt | Description | What It Does |
|--------|-------------|--------------|
| `plan` | Implementation planning with risk assessment | Restates requirements, identifies risks, breaks into phases with complexity ratings, maps dependencies, waits for confirmation before coding |
| `tdd` | Test-driven development (Red-Green-Refactor) | Analyzes feature, writes failing test first, implements minimal code to pass, refactors, verifies 80%+ coverage |
| `code-review` | Security and quality review | Reviews uncommitted changes for security vulnerabilities, code quality issues, performance problems; rates issues as CRITICAL/HIGH/MEDIUM/LOW |
| `build-fix` | Fix build/type errors incrementally | Runs build command, parses errors, fixes ONE error at a time, re-runs build, repeats until clean |
| `verify` | Full verification loop (build, types, lint, tests) | Runs complete verification: build Ã¢â€ â€™ type-check Ã¢â€ â€™ lint Ã¢â€ â€™ test suite; reports pass/fail for each stage |
| `e2e` | End-to-end Playwright testing | Generates Page Object Model tests, configures Playwright, runs across browsers, captures screenshots/videos on failure |
| `refactor-clean` | Dead code detection and safe removal | Runs analysis tools (knip, depcheck, ts-prune), categorizes findings by risk tier, removes safely with test verification |
| `docs-lookup` | Current library documentation via Context7 | Uses Context7 MCP to fetch up-to-date library docs instead of relying on training data; returns examples |
| `security-review` | OWASP Top 10 security audit | Scans for hardcoded secrets, SQL injection, XSS, CSRF, auth issues, SSRF, insecure crypto; provides fix recommendations |
| `learn` | Extract reusable patterns from session | Analyzes the current session to identify reusable patterns, useful commands, and debugging insights; saves as skill files |
| `architect` | System design with trade-off analysis | Gathers requirements, analyzes current state, proposes 2-3 design options with trade-offs (scalability, complexity, cost) |
| `test-coverage` | Analyze coverage gaps and generate missing tests | Runs coverage report, identifies uncovered branches/functions, generates targeted tests for gaps |
| `update-docs` | Sync documentation with codebase | Reads source files, compares with existing docs, updates README, API references, and guides to match current code |
| `quality-gate` | Run format, lint, and type checks | Runs formatter Ã¢â€ â€™ linter Ã¢â€ â€™ type-checker pipeline; fixes auto-fixable issues; reports remaining manual fixes |
| `prompt-optimize` | Optimize prompts for maximum effectiveness | Analyzes a prompt for clarity, specificity, and structure; rewrites for better AI comprehension and output quality |

#### Language-Specific Review Prompts (6)

| Prompt | Language | Focus Areas |
|--------|----------|-------------|
| `go-review` | Go | Idiomatic patterns, error handling with `errors.Is`/`As`, goroutine safety, context propagation, interface compliance |
| `python-review` | Python | PEP 8 compliance, type hint coverage, Pythonic idioms, security (no eval/exec), import organization |
| `rust-review` | Rust | Ownership/borrowing correctness, unsafe usage audit, clippy compliance, error handling with `?`, lifetime annotations |
| `kotlin-review` | Kotlin | Coroutine structured concurrency, null safety (no `!!`), Compose best practices, sealed class usage |
| `cpp-review` | C++ | Memory safety (no raw pointers), RAII compliance, modern C++ idioms (C++17/20), const correctness, move semantics |
| `java-review` | Java | Spring Boot layer separation, JPA best practices, Optional usage, Stream API, security annotations, records usage |

#### Language-Specific Build Fix Prompts (5)

| Prompt | Language | What It Fixes |
|--------|----------|---------------|
| `go-build` | Go | `go build` errors, `go vet` warnings, module resolution issues |
| `rust-build` | Rust | `cargo build` errors, borrow checker issues, lifetime errors, Cargo.toml dependency problems |
| `kotlin-build` | Kotlin | Kotlin compiler errors, Gradle build failures, dependency resolution, KSP/KAPT issues |
| `cpp-build` | C++ | CMake configuration errors, compilation errors, linker issues, template instantiation failures |
| `java-build` | Java | Maven/Gradle build errors, Java compiler errors, dependency conflicts, Spring Boot startup failures |

#### Language-Specific Test Prompts (4)

| Prompt | Language | Test Patterns |
|--------|----------|---------------|
| `go-test` | Go | Table-driven tests, subtests with `t.Run()`, benchmarks, `testify` assertions, mock generation |
| `rust-test` | Rust | Unit tests in `#[cfg(test)]` modules, integration tests in `tests/`, doc tests, property-based with `proptest` |
| `kotlin-test` | Kotlin | Kotest spec styles, MockK mocking, coroutine test dispatchers, Kover coverage |
| `cpp-test` | C++ | GoogleTest `TEST`/`TEST_F`/`TEST_P`, CTest integration, parameterized tests, sanitizer configs |

### How to Invoke Prompts

In Copilot Chat, type `#` followed by the prompt name:
```
#plan Create a user authentication system with OAuth2
#tdd Add rate limiting to the API endpoints
#code-review
#go-review
```

The prompt's instructions are combined with your message and sent to Copilot in agent mode.

---

## 6. Custom Agents

**Location:** `.github/agents/` (11 files)

Agents are specialized AI personas with restricted tool access. Each agent has a focused role and can only use the tools listed in its `tools` array.

### File Format

```yaml
---
description: "Agent description shown in the UI"
mode: "agent"
tools: ["tool1", "tool2", "tool3"]
---

# Agent Name

System prompt defining the agent's behavior...
```

The `tools` array is critical Ã¢â‚¬â€ it restricts what the agent can do. A read-only agent like `planner` cannot modify files.

### Complete Agent Catalog

#### 1. Planner Agent (`planner.agent.md`)
- **Purpose:** Create step-by-step implementation plans before any code is written
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`
- **Key Behavior:** Read-only Ã¢â‚¬â€ NEVER writes code, only produces plans. Reads existing code to understand patterns, breaks work into phases, identifies risks, estimates complexity, and waits for user confirmation.

#### 2. Code Reviewer Agent (`code-reviewer.agent.md`)
- **Purpose:** Review code for security vulnerabilities, quality issues, and best practices
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`, `get_errors`
- **Key Behavior:** Reviews uncommitted changes. Rates issues as CRITICAL/HIGH/MEDIUM/LOW. Checks for security vulnerabilities, error handling, naming quality, test coverage. Can run linters and type-checkers via terminal.

#### 3. TDD Guide Agent (`tdd-guide.agent.md`)
- **Purpose:** Enforce test-driven development with Red-Green-Refactor cycle
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`, `replace_string_in_file`, `create_file`, `get_errors`
- **Key Behavior:** Writes failing test FIRST, then implements minimal code to pass, then refactors. Verifies 80%+ coverage. Can create test files and modify source files.

#### 4. Security Reviewer Agent (`security-reviewer.agent.md`)
- **Purpose:** Detect OWASP Top 10 vulnerabilities and security issues
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`, `get_errors`
- **Key Behavior:** Scans for hardcoded secrets, SQL injection, XSS, CSRF, broken auth, SSRF, insecure crypto. Provides specific fix recommendations. Can run security scanning tools.

#### 5. Architect Agent (`architect.agent.md`)
- **Purpose:** System design, scalability analysis, and technical decision-making
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`
- **Key Behavior:** Read-only Ã¢â‚¬â€ analyzes current architecture, gathers requirements, proposes 2-3 design options with trade-off analysis (scalability, complexity, maintainability, cost). Does not modify code.

#### 6. Build Error Resolver Agent (`build-error-resolver.agent.md`)
- **Purpose:** Fix build and type errors with minimal changes
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`, `replace_string_in_file`, `create_file`
- **Key Behavior:** Detects build system, runs build, parses errors, fixes ONE error at a time with minimal diff. Re-runs build to verify. No architectural changes Ã¢â‚¬â€ only fixes errors.

#### 7. Refactor Cleaner Agent (`refactor-cleaner.agent.md`)
- **Purpose:** Dead code detection, cleanup, and consolidation
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`, `replace_string_in_file`
- **Key Behavior:** Runs analysis tools to find unused exports/imports/dependencies, categorizes by safety tier (safe/moderate/risky), removes dead code with test verification at each step.

#### 8. E2E Runner Agent (`e2e-runner.agent.md`)
- **Purpose:** Generate and run end-to-end Playwright tests
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`, `replace_string_in_file`, `create_file`
- **Key Behavior:** Creates Page Object Model test structure, writes tests for critical user flows, runs across browsers, captures screenshots/videos/traces on failure, quarantines flaky tests.

#### 9. Doc Updater Agent (`doc-updater.agent.md`)
- **Purpose:** Synchronize documentation with codebase
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`, `replace_string_in_file`, `create_file`
- **Key Behavior:** Reads source files as source-of-truth, generates/updates README, API references, and architecture docs. Identifies stale documentation and updates it.

#### 10. Database Reviewer Agent (`database-reviewer.agent.md`)
- **Purpose:** PostgreSQL/Supabase query optimization, schema design, and security review
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`
- **Key Behavior:** Reviews SQL queries for performance (missing indexes, N+1 queries, full table scans), validates schema design (normalization, constraints, naming), checks security (parameterized queries, RLS policies).

#### 11. Docs Lookup Agent (`docs-lookup.agent.md`)
- **Purpose:** Fetch current library/framework documentation
- **Tools:** `read_file`, `grep_search`, `file_search`, `semantic_search`, `list_dir`, `run_in_terminal`
- **Key Behavior:** Uses Context7 MCP or runs documentation commands to fetch up-to-date library docs. Returns accurate answers with code examples instead of relying on potentially outdated training data.

### How to Invoke Agents

In Copilot Chat, use `@` followed by the agent name:
```
@planner Design a notification system
@code-reviewer Review my recent changes
@tdd-guide Add a caching layer
@security-reviewer Audit the auth module
```

---

## 7. MCP Server Configuration

**Location:** `.vscode/settings.json` under `mcp.servers`

14 MCP (Model Context Protocol) servers are configured, giving Copilot access to external tools and services.

### Server Inventory

#### Stdio Servers (Local Process)

| Server | Package | Purpose |
|--------|---------|---------|
| `memory` | `@modelcontextprotocol/server-memory` | Persistent memory storage across conversations |
| `sequential-thinking` | `@modelcontextprotocol/server-sequential-thinking` | Step-by-step reasoning for complex problems |
| `context7` | `@upstash/context7-mcp@latest` | Up-to-date library/framework documentation |
| `playwright` | `@playwright/mcp` | Browser automation for testing (Chrome) |
| `magic-ui` | `@magicuidesign/mcp@latest` | UI component design patterns |
| `token-optimizer` | `token-optimizer-mcp` | Token usage optimization |
| `firecrawl` | `firecrawl-mcp` | Web scraping and crawling (requires API key) |
| `fal-ai` | `fal-ai-mcp-server` | AI media generation Ã¢â‚¬â€ images, video, audio (requires API key) |

#### HTTP Servers (Remote)

| Server | URL | Purpose |
|--------|-----|---------|
| `vercel` | `https://mcp.vercel.com` | Vercel deployment and project management |
| `cloudflare-docs` | `https://docs.mcp.cloudflare.com/mcp` | Cloudflare documentation search |
| `cloudflare-workers-builds` | `https://builds.mcp.cloudflare.com/mcp` | Cloudflare Workers build management |
| `cloudflare-workers-bindings` | `https://bindings.mcp.cloudflare.com/mcp` | Cloudflare Workers bindings configuration |
| `cloudflare-observability` | `https://observability.mcp.cloudflare.com/mcp` | Cloudflare analytics and observability |
| `clickhouse` | `https://mcp.clickhouse.cloud/mcp` | ClickHouse database operations |

### How MCP Servers Work

When Copilot runs in agent mode, it can call tools provided by these MCP servers. For example:
- The **context7** server lets Copilot fetch live library documentation
- The **playwright** server lets Copilot control a browser for E2E testing
- The **firecrawl** server lets Copilot scrape web pages for research

MCP servers appear in the **"Configure Tools"** dropdown in Copilot Chat, where they can be individually enabled/disabled.

---

## 8. VS Code Settings

**File:** `.vscode/settings.json`

Two critical settings enable the Copilot customization system:

```json
{
  "chat.promptFiles": true,
  "github.copilot.chat.codeGeneration.useInstructionFiles": true
}
```

| Setting | Purpose |
|---------|---------|
| `chat.promptFiles` | Enables `.github/prompts/*.prompt.md` files to appear in the `#` prompt picker |
| `github.copilot.chat.codeGeneration.useInstructionFiles` | Enables `.github/instructions/*.instructions.md` to auto-activate by file type, and `.github/copilot-instructions.md` to load globally |

### Git Safety

The `.vscode/` directory is listed in `.gitignore`, which protects API keys (firecrawl, fal-ai) in `settings.json` from being committed to version control.

---

## 9. How to Use Each Feature

### Automatic Features (No Action Required)

| Feature | Trigger | What Happens |
|---------|---------|--------------|
| Global Instructions | Open workspace + use Copilot Chat | Copilot reads `.github/copilot-instructions.md` and applies coding style, security, testing, and architecture rules to every response |
| Language Instructions | Edit a file of a supported language | Copilot auto-injects the matching instruction file. E.g., editing `main.py` activates `python.instructions.md` |
| MCP Servers | Use Copilot in agent mode | Copilot can call tools from configured MCP servers (memory, context7, playwright, etc.) |

### On-Demand Features

| Feature | How to Invoke | Example |
|---------|---------------|---------|
| Prompts | Type `#prompt-name` in Copilot Chat | `#plan Build a REST API for user management` |
| Agents | Type `@agent-name` in Copilot Chat | `@planner Design a caching layer` |
| MCP Tools | Copilot calls them automatically in agent mode, or toggle in "Configure Tools" | Copilot fetches React docs via context7 when you ask about hooks |

### Recommended Workflows

#### Start a New Feature
```
@planner Implement OAuth2 authentication with Google
```
Then after plan approval:
```
#tdd Implement Phase 1 of the OAuth2 plan
```

#### Fix a Build
```
#build-fix
```
Or for a specific language:
```
#go-build
#rust-build
```

#### Pre-Commit Review
```
@code-reviewer Review my changes
@security-reviewer Audit auth module
```

#### Explore a Library
```
#docs-lookup How to use Prisma migrations in Next.js
```

---

## 10. Feature Mapping: ECC Ã¢â€ â€™ Copilot

This table shows how each ECC component was translated to the Copilot customization format.

| ECC Component | ECC Format | Copilot Equivalent | Copilot Format |
|---------------|-----------|---------------------|----------------|
| `AGENTS.md` / `CLAUDE.md` | Root markdown | `.github/copilot-instructions.md` | Markdown (auto-loaded) |
| `rules/common/*.md` | Rule files | `.github/copilot-instructions.md` | Merged into global instructions |
| `rules/typescript/*.md` | Language rules | `.github/instructions/typescript.instructions.md` | YAML `applyTo` + rules |
| `rules/python/*.md` | Language rules | `.github/instructions/python.instructions.md` | YAML `applyTo` + rules |
| `rules/golang/*.md` | Language rules | `.github/instructions/golang.instructions.md` | YAML `applyTo` + rules |
| `rules/rust/*.md` | Language rules | `.github/instructions/rust.instructions.md` | YAML `applyTo` + rules |
| `rules/kotlin/*.md` | Language rules | `.github/instructions/kotlin.instructions.md` | YAML `applyTo` + rules |
| `rules/cpp/*.md` | Language rules | `.github/instructions/cpp.instructions.md` | YAML `applyTo` + rules |
| `commands/plan.md` | Slash command | `.github/prompts/plan.prompt.md` | YAML frontmatter + `{{{ input }}}` |
| `commands/tdd.md` | Slash command | `.github/prompts/tdd.prompt.md` | YAML frontmatter + `{{{ input }}}` |
| `agents/planner.md` | Agent def | `.github/agents/planner.agent.md` | YAML `tools` array + instructions |
| `agents/code-reviewer.md` | Agent def | `.github/agents/code-reviewer.agent.md` | YAML `tools` array + instructions |
| `mcp-configs/*.json` | JSON configs | `.vscode/settings.json` Ã¢â€ â€™ `mcp.servers` | VS Code settings format |

### Key Format Differences

| Aspect | ECC (Claude Code) | Copilot |
|--------|-------------------|---------|
| Invocation | `/command` or agent delegation | `#prompt` or `@agent` |
| Tool restriction | YAML `tools` in frontmatter | YAML `tools` array in `.agent.md` |
| File activation | Manual via commands | Automatic via `applyTo` globs |
| MCP config | `~/.claude.json` | `.vscode/settings.json` |
| Global context | `CLAUDE.md` + `AGENTS.md` | `.github/copilot-instructions.md` |

---

## 11. Troubleshooting

### Prompts Not Appearing in `#` Picker

1. Verify `"chat.promptFiles": true` in `.vscode/settings.json`
2. Ensure files are in `.github/prompts/` with `.prompt.md` extension
3. Verify YAML frontmatter has `description` and `mode: "agent"`
4. Reload VS Code window: `Ctrl+Shift+P` Ã¢â€ â€™ "Developer: Reload Window"

### Agents Not Appearing in `@` Picker

1. Ensure files are in `.github/agents/` with `.agent.md` extension
2. Verify YAML frontmatter has `description`, `mode: "agent"`, and `tools` array
3. Check VS Code version supports custom agents (VS Code 1.99+)
4. Check GitHub Copilot extension is up to date

### Language Instructions Not Auto-Applying

1. Verify `"github.copilot.chat.codeGeneration.useInstructionFiles": true`
2. Check `applyTo` glob matches the file you're editing
3. Ensure there are no syntax errors in the YAML frontmatter

### MCP Servers Not Showing

1. Verify `mcp.servers` is in `.vscode/settings.json` (not user settings)
2. Check that `npx` is available (Node.js installed)
3. For HTTP servers, ensure network connectivity
4. Check Copilot Chat Ã¢â€ â€™ "Configure Tools" dropdown
5. Some MCP servers require VS Code 1.99+ with Copilot agent mode

### General Requirements

- **VS Code**: Version 1.99 or later recommended
- **GitHub Copilot Extension**: Latest version with agent mode support
- **Node.js**: Required for stdio MCP servers (runs `npx`)
- **API Keys**: firecrawl and fal-ai servers require their respective API keys in settings

---

## 12. Complete File Inventory

### Summary

| Type | Count | Pattern |
|------|-------|---------|
| Global Instructions | 1 | `.github/copilot-instructions.md` |
| Language Instructions | 7 | `.github/instructions/*.instructions.md` |
| Reusable Prompts | 30 | `.github/prompts/*.prompt.md` |
| Custom Agents | 11 | `.github/agents/*.agent.md` |
| VS Code Settings | 1 | `.vscode/settings.json` |
| **Total** | **50** | |

### All Files

```
.github/copilot-instructions.md
.github/instructions/typescript.instructions.md
.github/instructions/python.instructions.md
.github/instructions/golang.instructions.md
.github/instructions/rust.instructions.md
.github/instructions/kotlin.instructions.md
.github/instructions/cpp.instructions.md
.github/instructions/java.instructions.md
.github/prompts/plan.prompt.md
.github/prompts/tdd.prompt.md
.github/prompts/code-review.prompt.md
.github/prompts/build-fix.prompt.md
.github/prompts/verify.prompt.md
.github/prompts/e2e.prompt.md
.github/prompts/refactor-clean.prompt.md
.github/prompts/docs-lookup.prompt.md
.github/prompts/security-review.prompt.md
.github/prompts/learn.prompt.md
.github/prompts/architect.prompt.md
.github/prompts/test-coverage.prompt.md
.github/prompts/update-docs.prompt.md
.github/prompts/quality-gate.prompt.md
.github/prompts/prompt-optimize.prompt.md
.github/prompts/go-review.prompt.md
.github/prompts/python-review.prompt.md
.github/prompts/rust-review.prompt.md
.github/prompts/kotlin-review.prompt.md
.github/prompts/cpp-review.prompt.md
.github/prompts/java-review.prompt.md
.github/prompts/go-build.prompt.md
.github/prompts/rust-build.prompt.md
.github/prompts/kotlin-build.prompt.md
.github/prompts/cpp-build.prompt.md
.github/prompts/java-build.prompt.md
.github/prompts/go-test.prompt.md
.github/prompts/rust-test.prompt.md
.github/prompts/kotlin-test.prompt.md
.github/prompts/cpp-test.prompt.md
.github/agents/planner.agent.md
.github/agents/code-reviewer.agent.md
.github/agents/tdd-guide.agent.md
.github/agents/security-reviewer.agent.md
.github/agents/architect.agent.md
.github/agents/build-error-resolver.agent.md
.github/agents/refactor-cleaner.agent.md
.github/agents/e2e-runner.agent.md
.github/agents/doc-updater.agent.md
.github/agents/database-reviewer.agent.md
.github/agents/docs-lookup.agent.md
.vscode/settings.json
```
