# Claude Fulcrum (Claude Fulcrum) Ã¢â‚¬â€ Detailed Project Report

---

## 1. Executive Summary

**Claude Fulcrum (Claude Fulcrum)** is an open-source, production-ready **AI agent harness performance optimization system**. It is not just a configuration pack Ã¢â‚¬â€ it is a complete framework that supercharges AI coding agents with specialized sub-agents, reusable skills, automated hooks, slash commands, security scanning, memory persistence, and cross-platform compatibility.

| Metric | Value |
|--------|-------|
| Version | 1.8.0 |
| License | MIT |
| npm Package | `claude-fulcrum` |
| Agents | 25 specialized sub-agents |
| Skills | 108+ workflow/domain knowledge modules |
| Commands | 57 slash commands |
| Hooks | 15+ trigger-based automations |
| MCP Servers | 18 pre-configured integrations |
| Rules | 9 common + per-language rule sets (8 languages) |
| Tests | 997+ internal tests passing |
| Supported Harnesses | Claude Code, Cursor, OpenCode, Codex (app + CLI) |
| Languages Covered | TypeScript, Python, Go, Kotlin, Java, Rust, C++, Perl, Swift, PHP |
| Docs Languages | English, Simplified Chinese, Traditional Chinese, Japanese, Korean |

---

## 2. What Problem Does ECC Solve?

AI coding agents like Claude Code, Cursor, Codex, and OpenCode are powerful, but out-of-the-box they lack:

1. **Specialized expertise** Ã¢â‚¬â€ A generic agent doesn't know Go build rules or Django security patterns.
2. **Workflow automation** Ã¢â‚¬â€ No built-in TDD enforcement, session persistence, or auto-learning.
3. **Context efficiency** Ã¢â‚¬â€ Token budgets are wasted on repetitive exploration without skills/codemaps.
4. **Security discipline** Ã¢â‚¬â€ No automatic secret scanning, OWASP checks, or input validation enforcement.
5. **Cross-session memory** Ã¢â‚¬â€ Sessions start from scratch with no recall of prior work.
6. **Multi-harness portability** Ã¢â‚¬â€ Configs for one tool don't work in another.

ECC solves all of these by providing a pluggable system of agents, skills, hooks, commands, and rules that work across multiple AI harnesses.

---

## 3. Core Principles

| Principle | Description |
|-----------|-------------|
| **Agent-First** | Delegate to specialized agents for domain-specific tasks |
| **Test-Driven** | Write tests before implementation; enforce 80%+ coverage |
| **Security-First** | Never compromise on security; validate all inputs; scan before commit |
| **Immutability** | Always create new objects; never mutate existing ones |
| **Plan Before Execute** | Plan complex features before writing code |

---

## 4. Architecture Overview

```
claude_code_setup/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ agents/              # 25 specialized sub-agent definitions (Markdown + YAML frontmatter)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ skills/              # 108+ skills organized as folders with SKILL.md files
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ commands/            # 57 slash commands (Markdown with frontmatter)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ hooks/               # Trigger-based automation configs (hooks.json + scripts)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ rules/               # Always-follow guidelines organized by language
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ common/          # 9 universal rules (security, testing, coding style, etc.)
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ typescript/      # TypeScript-specific rules
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ python/          # Python-specific rules
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ golang/          # Go-specific rules
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ kotlin/          # Kotlin-specific rules
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ cpp/             # C++ rules
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ perl/            # Perl rules
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ php/             # PHP rules
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ swift/           # Swift rules
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ mcp-configs/         # MCP server connection configurations
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ scripts/             # Node.js utilities (hooks, install, CLI tools, CI)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ tests/               # Test suite (997+ tests)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ schemas/             # JSON schemas for config validation
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ manifests/           # Install profiles, modules, components
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ contexts/            # Pre-built context files (dev, research, review)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ examples/            # Example CLAUDE.md files for various project types
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ plugins/             # Claude Code plugin/marketplace integration
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ docs/                # Design docs, architecture notes, translations
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ assets/              # Images for guides
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ .claude/             # Claude Code native config (homunculus, skills, package-manager)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ .claude-plugin/      # Plugin manifest (plugin.json, marketplace.json)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ .agents/             # Cross-harness agent definitions (for Cursor)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ .codex/              # OpenAI Codex CLI configuration (AGENTS.md, config.toml)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ .cursor/             # Cursor IDE hooks/rules/skills
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ .opencode/           # OpenCode plugin (TypeScript plugin, tools, prompts)
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ .github/             # GitHub Actions, issue templates, etc.
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ install.sh / .ps1    # Cross-platform installer entry points
```

---

## 5. Agents (25 Total)

Agents are specialized sub-agents defined as Markdown files with YAML frontmatter specifying name, description, allowed tools, and preferred model.

### 5.1 General-Purpose Agents

| Agent | File | Model | Purpose |
|-------|------|-------|---------|
| **planner** | `agents/planner.md` | Opus | Creates comprehensive implementation plans; breaks features into phases |
| **architect** | `agents/architect.md` | Opus | System design, scalability decisions, architectural patterns |
| **tdd-guide** | `agents/tdd-guide.md` | Sonnet | Enforces REDÃ¢â€ â€™GREENÃ¢â€ â€™REFACTOR TDD cycle |
| **code-reviewer** | `agents/code-reviewer.md` | Sonnet | Quality review with confidence-based filtering; runs git diff analysis |
| **security-reviewer** | `agents/security-reviewer.md` | Sonnet | OWASP Top 10 scanning, secret detection, dependency auditing |
| **build-error-resolver** | `agents/build-error-resolver.md` | Sonnet | Diagnoses and fixes build/type errors incrementally |
| **e2e-runner** | `agents/e2e-runner.md` | Sonnet | Generates and runs Playwright end-to-end tests |
| **refactor-cleaner** | `agents/refactor-cleaner.md` | Sonnet | Dead code cleanup, unused import removal |
| **doc-updater** | `agents/doc-updater.md` | Sonnet | Keeps documentation and codemaps current |
| **docs-lookup** | `agents/docs-lookup.md` | Ã¢â‚¬â€ | Documentation search via Context7 MCP |

### 5.2 Language-Specific Agents

| Agent | Language/Framework |
|-------|--------------------|
| **python-reviewer** | Python code review |
| **go-reviewer** / **go-build-resolver** | Go code review & build errors |
| **kotlin-reviewer** / **kotlin-build-resolver** | Kotlin/Android/KMP review & Gradle build errors |
| **java-reviewer** / **java-build-resolver** | Java/Spring Boot review & Maven/Gradle build errors |
| **rust-reviewer** / **rust-build-resolver** | Rust code review & build errors |
| **cpp-reviewer** / **cpp-build-resolver** | C++ code review & build errors |
| **database-reviewer** | PostgreSQL/Supabase schema design & query optimization |

### 5.3 Specialized Agents

| Agent | Purpose |
|-------|---------|
| **chief-of-staff** | Multi-channel communication triage (email, Slack, LINE, Messenger) |
| **loop-operator** | Autonomous loop execution; monitors stalls and intervenes |
| **harness-optimizer** | Harness configuration tuning for reliability, cost, and throughput |

### 5.4 How Agents Work

Each agent Markdown file contains:
- **YAML Frontmatter**: `name`, `description`, `tools` (allowed tool list), `model` (Opus/Sonnet)
- **System Prompt Body**: Detailed instructions, workflow steps, checklists, code examples
- Agents are invoked automatically based on task type or explicitly via slash commands

---

## 6. Skills (108+ Total)

Skills are knowledge modules stored as `skills/<skill-name>/SKILL.md`. They provide domain-specific expertise that the AI agent loads contextually.

### 6.1 Skill Categories

#### Development Workflows

| Skill | Description |
|-------|-------------|
| `tdd-workflow` | Test-driven development methodology |
| `verification-loop` | Build, test, lint, typecheck, security verification |
| `coding-standards` | Universal coding standards |
| `eval-harness` | Eval-driven development with grading |
| `continuous-learning` / `continuous-learning-v2` | Auto-extract patterns from sessions into reusable skills; instinct-based learning with confidence scoring |
| `strategic-compact` | Context window management and compaction strategy |
| `autonomous-loops` / `continuous-agent-loop` | Safe autonomous loop execution patterns |
| `prompt-optimizer` | System prompt optimization techniques |
| `search-first` | Research-first development methodology |

#### Language & Framework Patterns

| Skill | Description |
|-------|-------------|
| `python-patterns` / `python-testing` | Python best practices and testing |
| `golang-patterns` / `golang-testing` | Go patterns and testing |
| `kotlin-patterns` / `kotlin-testing` / `kotlin-coroutines-flows` / `kotlin-exposed-patterns` / `kotlin-ktor-patterns` | Full Kotlin ecosystem |
| `rust-patterns` / `rust-testing` | Rust development patterns |
| `cpp-coding-standards` / `cpp-testing` | C++ standards and testing |
| `perl-patterns` / `perl-security` / `perl-testing` | Perl development |
| `java-coding-standards` / `jpa-patterns` | Java and JPA |
| `springboot-patterns` / `springboot-security` / `springboot-tdd` / `springboot-verification` | Full Spring Boot lifecycle |
| `django-patterns` / `django-security` / `django-tdd` / `django-verification` | Full Django lifecycle |
| `laravel-patterns` / `laravel-security` / `laravel-tdd` / `laravel-verification` | Full Laravel lifecycle |
| `swiftui-patterns` / `swift-concurrency-6-2` / `swift-actor-persistence` / `swift-protocol-di-testing` | Apple/Swift ecosystem |
| `compose-multiplatform-patterns` | Kotlin Compose Multiplatform |
| `android-clean-architecture` | Android architecture |

#### Frontend & Backend

| Skill | Description |
|-------|-------------|
| `frontend-patterns` | React/Next.js patterns |
| `frontend-slides` | Zero-dependency HTML presentations with PPTX conversion |
| `backend-patterns` | API design, database, caching |
| `nextjs-turbopack` | Next.js with Turbopack |
| `api-design` | REST API design patterns |
| `liquid-glass-design` | UI design patterns |

#### Infrastructure & DevOps

| Skill | Description |
|-------|-------------|
| `docker-patterns` | Docker containerization |
| `deployment-patterns` | Deployment strategies |
| `database-migrations` | Safe migration patterns |
| `postgres-patterns` | PostgreSQL optimization |
| `clickhouse-io` | ClickHouse analytics |
| `mcp-server-patterns` | Building MCP servers |
| `bun-runtime` | Bun runtime patterns |

#### Research & Content

| Skill | Description |
|-------|-------------|
| `deep-research` | Multi-source research with Firecrawl and Exa |
| `exa-search` | Neural web search via Exa MCP |
| `article-writing` | Long-form content creation |
| `content-engine` | Platform-native social content |
| `market-research` | Source-attributed market research |
| `investor-materials` | Pitch decks, memos, financial models |
| `investor-outreach` | Personalized investor communication |
| `video-editing` / `videodb` | Video processing |
| `fal-ai-media` | AI media generation |
| `crosspost` | Cross-platform content distribution |
| `x-api` | X/Twitter API integration |

#### Security & Quality

| Skill | Description |
|-------|-------------|
| `security-review` / `security-scan` | Comprehensive security checklists; AgentShield integration |
| `plankton-code-quality` | Code quality metrics |
| `ai-regression-testing` | AI-specific regression testing |
| `skill-stocktake` | Skill inventory management |

#### Business Domain Skills

| Skill | Description |
|-------|-------------|
| `carrier-relationship-management` | Carrier/logistics relationships |
| `customs-trade-compliance` | Trade compliance |
| `energy-procurement` | Energy procurement |
| `inventory-demand-planning` | Inventory management |
| `logistics-exception-management` | Logistics exceptions |
| `production-scheduling` | Manufacturing scheduling |
| `quality-nonconformance` | Quality management |
| `returns-reverse-logistics` | Returns handling |
| `visa-doc-translate` | Visa document translation |

#### Advanced Agent Patterns

| Skill | Description |
|-------|-------------|
| `agent-harness-construction` | Building agent harness systems |
| `agentic-engineering` | Agentic software engineering patterns |
| `ai-first-engineering` | AI-first development methodology |
| `enterprise-agent-ops` | Enterprise agent operations |
| `nanoclaw-repl` | NanoClaw v2 REPL with model routing, skill hot-load, session management |
| `iterative-retrieval` | Sub-agent iterative retrieval pattern |
| `team-builder` | Team composition optimization |
| `configure-claude-fulcrum` | Interactive ECC installation wizard |
| `documentation-lookup` | Live docs via Context7 |
| `claude-api` | Anthropic Claude API patterns |
| `claude-devfleet` | DevFleet multi-agent orchestration |
| `dmux-workflows` | Multiplexed development workflows |
| `blueprint` | Project blueprint generation |
| `project-guidelines-example` | Example project guidelines |
| `cost-aware-llm-pipeline` | Token cost optimization |
| `content-hash-cache-pattern` | Content caching strategies |
| `regex-vs-llm-structured-text` | When to use regex vs LLM |
| `ralphinho-rfc-pipeline` | RFC pipeline methodology |
| `nutrient-document-processing` | Document processing |
| `data-scraper-agent` | Web scraping agent |

---

## 7. Commands (57 Total)

Commands are slash commands that users invoke directly. Each is a Markdown file with a `description` frontmatter field.

### 7.1 Core Workflow Commands

| Command | Description |
|---------|-------------|
| `/plan` | Create implementation plan; waits for user confirmation |
| `/tdd` | Enforce test-driven development (REDÃ¢â€ â€™GREENÃ¢â€ â€™REFACTOR) |
| `/e2e` | Generate and run Playwright E2E tests |
| `/code-review` | Trigger comprehensive code review |
| `/build-fix` | Fix build errors using build-error-resolver agent |
| `/verify` | Run full verification loop (build, test, lint, typecheck, security) |
| `/checkpoint` | Create a progress checkpoint |
| `/refactor-clean` | Clean dead code and unused files |

### 7.2 Learning & Sessions

| Command | Description |
|---------|-------------|
| `/learn` | Extract patterns from current session into skills |
| `/learn-eval` | Learn from evaluation results |
| `/save-session` | Save session state to file |
| `/resume-session` | Resume from a saved session |
| `/sessions` | Browse session history |
| `/evolve` | Evolve skills based on usage patterns |

### 7.3 Instinct System

| Command | Description |
|---------|-------------|
| `/instinct-import` | Import instincts from external sources |
| `/instinct-export` | Export instincts for sharing |
| `/instinct-status` | View current instinct state |

### 7.4 Language-Specific Commands

| Command | Languages |
|---------|-----------|
| `/python-review` | Python code review |
| `/go-review` / `/go-build` / `/go-test` | Go workflow |
| `/kotlin-review` / `/kotlin-build` / `/kotlin-test` | Kotlin workflow |
| `/rust-review` / `/rust-build` / `/rust-test` | Rust workflow |
| `/cpp-review` / `/cpp-build` / `/cpp-test` | C++ workflow |
| `/gradle-build` | Gradle build fix |

### 7.5 Multi-Agent Orchestration

| Command | Description |
|---------|-------------|
| `/orchestrate` | Multi-agent git worktree orchestration |
| `/multi-plan` | Plan across multiple services |
| `/multi-execute` | Execute multi-service plan |
| `/multi-backend` / `/multi-frontend` | Specialized multi-service commands |
| `/multi-workflow` | Custom multi-agent workflow |
| `/pm2` | PM2 process management |

### 7.6 Harness & Quality

| Command | Description |
|---------|-------------|
| `/harness-audit` | Audit harness configuration for issues |
| `/loop-start` / `/loop-status` | Start and monitor autonomous loops |
| `/quality-gate` | Run quality gate checks |
| `/model-route` | Model selection routing |
| `/test-coverage` | Check test coverage metrics |
| `/skill-create` | Generate skills from git history |
| `/skill-health` | Check skill integrity |

### 7.7 Documentation & Utilities

| Command | Description |
|---------|-------------|
| `/docs` | Documentation lookup via Context7 |
| `/update-docs` / `/update-codemaps` | Update docs and codemaps |
| `/setup-pm` | Configure package manager |
| `/projects` | Project management |
| `/aside` | Side conversation (doesn't affect main context) |
| `/promote` | Promote local config to shared |
| `/prompt-optimize` | Optimize prompt for token efficiency |
| `/claw` | NanoClaw REPL interface |
| `/devfleet` | DevFleet orchestration |
| `/eval` | Run evaluations |

---

## 8. Hooks (Trigger-Based Automations)

Hooks are defined in `hooks/hooks.json` and fire automatically on lifecycle events. They use Node.js scripts from `scripts/hooks/`.

### 8.1 Hook Types

| Event | When It Fires |
|-------|---------------|
| **PreToolUse** | Before any tool executes (validation, reminders) |
| **PostToolUse** | After a tool finishes (formatting, feedback) |
| **PreCompact** | Before context compaction (save state) |
| **SessionStart** | When a new session begins (load context, detect PM) |
| **Stop** | When Claude finishes responding (session summaries) |
| **Notification** | Permission requests |

### 8.2 Configured Hooks

| Hook | Trigger | Description |
|------|---------|-------------|
| Auto tmux dev server | PreToolUse (Bash) | Auto-start dev servers in tmux |
| Tmux reminder | PreToolUse (Bash) | Remind to use tmux for long commands |
| Git push reminder | PreToolUse (Bash) | Review changes before git push |
| Doc file warning | PreToolUse (Write) | Warn about non-standard doc files |
| Suggest compact | PreToolUse (Edit/Write) | Suggest compaction at logical intervals |
| Continuous learning observer | PreToolUse (*) | Capture tool observations for learning |
| InsAIts security monitor | PreToolUse (Bash/Write/Edit) | Optional AI security monitoring |
| Pre-compact state save | PreCompact (*) | Save state before compaction |
| Session start loader | SessionStart (*) | Load previous context + detect package manager |
| Stop-phase summary | Stop (*) | Persist session summaries |

### 8.3 Hook Runtime Controls

- `ECC_HOOK_PROFILE=minimal|standard|strict` Ã¢â‚¬â€ Control which hooks run
- `ECC_DISABLED_HOOKS=hook1,hook2` Ã¢â‚¬â€ Disable specific hooks without editing files
- Each hook script checks its profile compatibility before executing

---

## 9. Rules (Per-Language Guidelines)

Rules are always-loaded guidelines organized by language. They enforce coding standards, security practices, and testing requirements.

### 9.1 Common Rules (Apply to All Languages)

| Rule File | Topic |
|-----------|-------|
| `agents.md` | Agent orchestration patterns |
| `coding-style.md` | File size limits, naming, nesting depth |
| `development-workflow.md` | PlanÃ¢â€ â€™TDDÃ¢â€ â€™ReviewÃ¢â€ â€™Commit workflow |
| `git-workflow.md` | Conventional commits, PR format |
| `hooks.md` | Hook usage patterns |
| `patterns.md` | Repository pattern, API envelope format |
| `performance.md` | Context window management, build troubleshooting |
| `security.md` | OWASP compliance, secret management |
| `testing.md` | 80% coverage minimum, TDD enforcement |

### 9.2 Language-Specific Rules

Each language directory contains 5 rule files:
- `coding-style.md` Ã¢â‚¬â€ Language idioms and style
- `hooks.md` Ã¢â‚¬â€ Language-specific hook patterns
- `patterns.md` Ã¢â‚¬â€ Architectural patterns for the language
- `security.md` Ã¢â‚¬â€ Language-specific security concerns
- `testing.md` Ã¢â‚¬â€ Testing frameworks and conventions

**Supported languages**: TypeScript, Python, Go, Kotlin, C++, Perl, PHP, Swift

---

## 10. MCP Server Configurations (18 Integrations)

Pre-configured Model Context Protocol servers in `mcp-configs/mcp-servers.json`:

| Server | Purpose |
|--------|---------|
| **github** | GitHub operations (PRs, issues, repos) |
| **firecrawl** | Web scraping and crawling |
| **supabase** | Supabase database operations |
| **memory** | Persistent memory across sessions |
| **sequential-thinking** | Chain-of-thought reasoning |
| **vercel** | Vercel deployments |
| **railway** | Railway deployments |
| **cloudflare-docs** | Cloudflare documentation search |
| **cloudflare-workers-builds** | Cloudflare Workers builds |
| **cloudflare-workers-bindings** | Cloudflare Workers bindings |
| **cloudflare-observability** | Cloudflare logs/observability |
| **clickhouse** | ClickHouse analytics queries |
| **exa-web-search** | Neural web search via Exa API |
| **context7** | Live documentation lookup |
| **magic** | Magic UI components |
| **filesystem** | Local filesystem operations |
| **insaits** | AI-to-AI security monitoring (23 anomaly types, OWASP MCP Top 10) |
| **playwright** | Browser automation and testing |

---

## 11. Cross-Harness Support

ECC works across multiple AI coding tools, not just Claude Code:

| Harness | Config Location | How It Works |
|---------|----------------|--------------|
| **Claude Code** | Root `CLAUDE.md`, `agents/`, `commands/`, `hooks/`, `rules/`, `skills/` | Native plugin system |
| **Cursor IDE** | `.cursor/` | Hooks, rules, and skills adapted for Cursor |
| **OpenAI Codex** | `.codex/` + `AGENTS.md` | Codex CLI compatible; model recommendations for GPT 5.4 |
| **OpenCode** | `.opencode/` | Full TypeScript plugin with tools, prompts, commands, hooks |

The `.agents/` directory provides a cross-harness agent definition layer.

---

## 12. Installation & Distribution

### 12.1 Installation Methods

1. **Plugin Marketplace** (recommended):
   ```bash
   /plugin marketplace add ORION2809/claude-Fulcrum
   /plugin install claude-fulcrum@claude-fulcrum
   ```

2. **npm Package**:
   ```bash
   npm install -g claude-fulcrum
   ecc-install
   ```

3. **Direct Clone**:
   ```bash
   git clone https://github.com/ORION2809/claude-Fulcrum
   ```

### 12.2 Install Profiles

Defined in `manifests/install-profiles.json`, profiles let users install only what they need:

| Profile | Description |
|---------|-------------|
| **core** | Minimal baseline (commands, hooks, platform configs, quality workflows) |
| **developer** | Default engineering profile (adds frameworks, database, orchestration) |
| **security** | Security-focused setup |
| **research** | Research and content-oriented workflows |

### 12.3 Installer Architecture

- `install.sh` (Unix) / `install.ps1` (Windows) Ã¢â‚¬â€ Entry points that resolve symlinks and delegate
- `scripts/install-plan.js` Ã¢â‚¬â€ Plans what to install based on profile
- `scripts/install-apply.js` Ã¢â‚¬â€ Applies the installation
- `manifests/install-modules.json` Ã¢â‚¬â€ Defines installable module groups
- `manifests/install-components.json` Ã¢â‚¬â€ Individual component definitions
- `schemas/` Ã¢â‚¬â€ JSON schemas for validation of all config formats

---

## 13. Scripts & Utilities

The `scripts/` directory contains Node.js utilities:

| Script | Purpose |
|--------|---------|
| `ecc.js` | Main ECC CLI entry point |
| `claw.js` | NanoClaw REPL interface |
| `doctor.js` | Diagnose ECC installation issues |
| `status.js` | Show current ECC status |
| `harness-audit.js` | Audit harness configuration |
| `repair.js` | Repair broken installations |
| `sessions-cli.js` | Session management CLI |
| `session-inspect.js` | Inspect session files |
| `skills-health.js` | Check skill health/integrity |
| `skill-create-output.js` | Generate skills from git history |
| `setup-package-manager.js` | Configure package manager detection |
| `orchestrate-worktrees.js` | Git worktree multi-agent orchestration |
| `orchestration-status.js` | Check orchestration status |
| `list-installed.js` | List installed ECC components |
| `uninstall.js` | Clean uninstall ECC |
| `hooks/` | 15+ hook handler scripts |
| `lib/` | Shared utility library |
| `ci/` | CI/CD scripts |
| `codemaps/` | Codemap generation utilities |
| `codex/` | Codex-specific utilities |

---

## 14. Test Suite

Located in `tests/`, run via `node tests/run-all.js`:

| Test Area | Description |
|-----------|-------------|
| `lib/` | Utility and library tests |
| `hooks/` | Hook handler tests |
| `scripts/` | Script behavior tests |
| `integration/` | Integration tests across components |
| `ci/` | CI pipeline tests |
| `codex-config.test.js` | Codex configuration validation |
| `opencode-config.test.js` | OpenCode configuration validation |

**997+ tests passing** as of v1.8.0.

---

## 15. Guides & Documentation

| Guide | Content |
|-------|---------|
| **The Shortform Guide** (`the-shortform-guide.md`) | Setup foundations, skills, hooks, sub-agents, MCPs, plugins |
| **The Longform Guide** (`the-longform-guide.md`) | Token optimization, memory persistence, eval loops, parallelization, worktrees |
| **The Security Guide** (`the-security-guide.md`) | Attack vectors, sandboxing, prompt injection, AgentShield, transitive trust |
| **The OpenClaw Guide** (`the-openclaw-guide.md`) | OpenClaw-specific setup and usage |
| `docs/` | Architecture improvements, session adapter design, selective install specs, release notes, translations |
| `examples/` | Example `CLAUDE.md` files for Django, Go, Laravel, Rust, SaaS/Next.js projects |

---

## 16. Schemas

JSON schemas in `schemas/` validate all configuration formats:

| Schema | Validates |
|--------|-----------|
| `hooks.schema.json` | Hook configuration structure |
| `plugin.schema.json` | Plugin manifest format |
| `package-manager.schema.json` | Package manager detection config |
| `ecc-install-config.schema.json` | Installation configuration |
| `install-profiles.schema.json` | Install profile definitions |
| `install-modules.schema.json` | Module group definitions |
| `install-components.schema.json` | Individual component definitions |
| `state-store.schema.json` | State persistence format |

---

## 17. Security Model

ECC takes security seriously at every layer:

1. **AgentShield Integration** Ã¢â‚¬â€ 102 security rules, 1280+ tests, 5 scanning categories
2. **OWASP Top 10 Coverage** Ã¢â‚¬â€ Every agent and rule enforces OWASP compliance
3. **Secret Management** Ã¢â‚¬â€ Never hardcode; use environment variables; validate at startup
4. **Input Validation** Ã¢â‚¬â€ Schema-based validation at all boundaries
5. **Sandboxing Guidance** Ã¢â‚¬â€ Tool-level, path-level, container-level, VM-level isolation
6. **Transitive Injection Defense** Ã¢â‚¬â€ Warns about risks from external documentation links
7. **InsAIts MCP** Ã¢â‚¬â€ Optional AI-to-AI security monitoring with 23 anomaly types
8. **Pre-commit Hooks** Ã¢â‚¬â€ Security scanning before any git push

---

## 18. Key Concepts & Terminology

| Term | Meaning |
|------|---------|
| **Harness** | An AI coding tool (Claude Code, Cursor, Codex, OpenCode) |
| **Agent** | A specialized sub-agent with a specific role (planner, reviewer, etc.) |
| **Skill** | A knowledge module loaded contextually for domain expertise |
| **Command** | A slash command that triggers a workflow |
| **Hook** | A trigger-based automation that fires on lifecycle events |
| **Rule** | An always-loaded guideline that the agent must follow |
| **MCP** | Model Context Protocol Ã¢â‚¬â€ a standard for connecting AI agents to external services |
| **NanoClaw** | A REPL tool built into ECC for session management, model routing, and skill hot-loading |
| **Instinct** | A learned behavioral pattern with confidence scoring that evolves over time |
| **Codemap** | A structural summary of a codebase that helps the agent navigate without burning tokens |
| **Context Compaction** | Reducing the token count in the conversation while preserving important state |

---

## 19. Version History Highlights

| Version | Date | Key Features |
|---------|------|--------------|
| **1.8.0** | Mar 2026 | Harness-first release; hook reliability overhaul; NanoClaw v2; loop-operator agent; 997 tests |
| **1.7.0** | Feb 2026 | Codex app/CLI support; frontend-slides skill; 5 business/content skills; 992 tests |
| **1.6.0** | Feb 2026 | Codex CLI; AgentShield; GitHub Marketplace app; 7 new skills; 978 tests |
| **1.4.1** | Feb 2026 | Bug fix: instinct import content loss |
| **1.4.0** | Feb 2026 | Interactive install wizard; PM2; multi-language rules; Chinese translations |
| **1.3.0** | Feb 2026 | OpenCode plugin support; 3 custom tools |
| **1.2.0** | Feb 2026 | Python/Django + Java Spring Boot skills; session management; instinct learning v2 |

---

## 20. Community & Ecosystem

- **Multi-language docs**: English, Simplified Chinese, Traditional Chinese, Japanese, Korean
- Active community contribution pipeline

---

## 21. Summary

Claude Fulcrum is a **comprehensive performance optimization system for AI coding agents**. It transforms a generic AI assistant into a specialized development team by providing:

- **25 expert sub-agents** covering planning, review, security, testing, and 8+ programming languages
- **108+ skills** spanning development workflows, framework patterns, security, research, content creation, and business domains
- **57 slash commands** for instant access to any workflow
- **Automated hooks** for session persistence, security scanning, continuous learning, and context management
- **Cross-harness compatibility** so configurations work across Claude Code, Cursor, Codex, and OpenCode
- **A security-first architecture** with AgentShield, OWASP compliance, and sandboxing guidance
- **997+ tests** ensuring reliability across all components

It is the result of 10+ months of intensive daily use building real production products, and is MIT-licensed.
