# Extreme Development Playbook

**Your complete daily workflow guide for Claude Code (Claude Fulcrum), Codex CLI, GitHub Copilot, and Claude-Flow working together.**

---

## The Big Picture: What Each Tool Does Best

```
                      YOUR DEVELOPMENT STACK
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š                                                             Ã¢â€â€š
Ã¢â€â€š  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â   You're in VS Code typing code           Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š   COPILOT    Ã¢â€â€š   Copilot autocompletes, suggests,        Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š  (inline)    Ã¢â€â€š   explains, and chat-answers in real time Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ                                            Ã¢â€â€š
Ã¢â€â€š         Ã¢â€â€š                                                   Ã¢â€â€š
Ã¢â€â€š  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â   You invoke a slash command or agent      Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š CLAUDE CODE  Ã¢â€â€š   Claude Fulcrum runs deep workflows: /plan, /tdd,   Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š   (Claude Fulcrum)      Ã¢â€â€š   /verify, /code-review, /orchestrate    Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ                                            Ã¢â€â€š
Ã¢â€â€š         Ã¢â€â€š                                                   Ã¢â€â€š
Ã¢â€â€š  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â   For multi-model or parallel tasks        Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š  CODEX CLI   Ã¢â€â€š   GPT-5.4 agents: explorer, reviewer,    Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š  (terminal)  Ã¢â€â€š   docs-researcher in read-only sandboxes  Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ                                            Ã¢â€â€š
Ã¢â€â€š         Ã¢â€â€š                                                   Ã¢â€â€š
Ã¢â€â€š  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â   Swarm orchestration + shared memory      Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š CLAUDE-FLOW  Ã¢â€â€š   Vector search, pattern learning,        Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€š  (MCP/CLI)   Ã¢â€â€š   multi-agent coordination, consensus    Ã¢â€â€š
Ã¢â€â€š  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ                                            Ã¢â€â€š
Ã¢â€â€š                                                             Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
```

### When to Reach for Each Tool

| Situation | Use This | Why |
|-----------|----------|-----|
| Writing a function, need a quick suggestion | **Copilot** (Tab) | Fastest Ã¢â‚¬â€ inline, zero friction |
| "What does this code do?" | **Copilot Chat** | Context-aware explanation in the editor |
| Planning a new feature | **Claude Code** `/plan` | Deep analysis, risk assessment, phased plan |
| Writing tests first | **Claude Code** `/tdd` | Enforces RED-GREEN-REFACTOR cycle |
| Reviewing code before commit | **Claude Code** `/code-review` | Security + quality gate with 25 checks |
| Multi-file feature implementation | **Claude Code** `/orchestrate feature` | planner Ã¢â€ â€™ tdd Ã¢â€ â€™ reviewer Ã¢â€ â€™ security pipeline |
| Need a second opinion from GPT | **Codex CLI** agents | explorer, reviewer, docs-researcher (read-only) |
| Multi-model collaboration | **Claude Code** `/multi-workflow` | Routes frontendÃ¢â€ â€™Gemini, backendÃ¢â€ â€™Codex |
| Checking library docs | **Copilot Chat** or **Context7 MCP** | Both have live doc lookup |
| Searching for past patterns | **Claude-Flow** `memory_search` | Semantic vector search across all sessions |
| Complex refactor across 5+ files | **Claude-Flow** swarm + **Claude Code** agents | CF coordinates, CC executes |
| Debugging a gnarly issue | **Claude Code** + **Codex explorer** | CC debugs, Codex traces execution paths |
| Pre-PR final check | **Claude Code** `/verify full` | Build + types + lint + tests + secrets + git |

---

## Part 1: Your Morning Startup Routine

### Step 1: Open VS Code in your project

Copilot loads `.github/copilot-instructions.md` automatically Ã¢â‚¬â€ it now knows your project conventions.

### Step 2: Start Claude Code

```bash
claude
```

Your Claude Fulcrum hooks auto-fire:
- `session-start.js` Ã¢â‚¬â€ restores previous session context
- Auto-tmux for dev servers
- Quality gates armed for every edit

### Step 3: Check what you learned last session

```bash
# In Claude Code or terminal:
npx claude-flow@alpha memory search --query "what I worked on yesterday" --namespace patterns
```

Or use the MCP tool directly in Claude Code:
```
memory_search(query="yesterday's patterns", namespace="patterns")
```

This gives you semantic search over everything you've learned across sessions Ã¢â‚¬â€ not just keyword matching.

---

## Part 2: Feature Development (The Full Cycle)

### Phase 1: Plan (Claude Code)

```
/plan Add OAuth2 login with Google and GitHub providers
```

The **planner agent** will:
- Restate requirements
- Break into phases with dependencies
- Identify risks (token storage, CSRF, redirect URIs)
- Wait for your explicit "go ahead"

**Why Claude Code and not Copilot?** This needs multi-step reasoning across your whole codebase. Copilot is great at local context; Claude Code sees the full architecture.

### Phase 2: Architecture Decision (Optional Ã¢â‚¬â€ Big Features Only)

If the planner flags architectural complexity, invoke the architect:

```
/orchestrate feature Add OAuth2 login with Google and GitHub providers
```

This runs the full pipeline:
```
planner Ã¢â€ â€™ tdd-guide Ã¢â€ â€™ code-reviewer Ã¢â€ â€™ security-reviewer
```

Each agent hands off structured context to the next. The security-reviewer specifically checks for OAuth2 pitfalls (state parameter, PKCE, token leakage).

### Phase 3: TDD (Claude Code)

```
/tdd Implement the OAuth callback handler
```

The **tdd-guide agent** enforces the cycle:
1. **RED** Ã¢â‚¬â€ Writes tests that fail (tests exist before code)
2. **GREEN** Ã¢â‚¬â€ Writes minimal code to pass
3. **REFACTOR** Ã¢â‚¬â€ Cleans up while keeping tests green
4. Checks coverage Ã¢â€°Â¥ 80%

**While Claude Code writes the implementation...**

### Phase 4: Use Copilot for the Small Stuff

While Claude Code handles the heavy architecture, switch to Copilot for:

- **Tab-completing** boilerplate (route definitions, type interfaces, imports)
- **Copilot Chat**: "Explain this OAuth token exchange flow"
- **Copilot Chat**: "Generate JSDoc for this function"
- **Copilot Chat**: "What's the difference between authorization code flow and implicit flow?"

**The mental model**: Claude Code builds the skeleton and critical logic. Copilot fills in the flesh as you type.

### Phase 5: Cross-Validate with Codex (Optional Ã¢â‚¬â€ High-Stakes Code)

For security-critical code (auth, payments, crypto), get a second opinion:

```bash
# In a separate terminal
codex -p strict
```

Then ask the Codex **reviewer agent** (runs GPT-5.4 in read-only mode):
```
Review the OAuth implementation in src/auth/ for security vulnerabilities.
Focus on: token storage, CSRF protection, redirect URI validation.
```

The Codex reviewer can't modify files Ã¢â‚¬â€ it only reads and reports. This gives you a genuinely independent review from a different model family.

### Phase 6: Review + Verify (Claude Code)

```
/code-review
```

Checks all uncommitted changes for:
- Security: hardcoded secrets, SQL injection, XSS, path traversal
- Quality: function length, nesting depth, error handling
- Best practices: mutation patterns, console.logs, missing tests

Then:

```
/verify pre-pr
```

Runs: build Ã¢â€ â€™ types Ã¢â€ â€™ lint Ã¢â€ â€™ tests Ã¢â€ â€™ secrets scan Ã¢â€ â€™ coverage Ã¢â€ â€™ git status. Blocks if anything fails.

### Phase 7: Store What You Learned (Claude-Flow)

```
/learn
```

Extracts reusable patterns from this session and saves them. Additionally, store explicit patterns in Claude-Flow's shared memory:

```bash
npx claude-flow@alpha memory store \
  --key "pattern-oauth2-implementation" \
  --value "OAuth2 with PKCE: use state param for CSRF, store tokens in httpOnly cookies not localStorage, validate redirect URIs server-side against allowlist" \
  --namespace patterns
```

Next time you (or any platform) works on auth, `memory_search` will surface this.

---

## Part 3: Bug Fixing (Fast Track)

### Simple Bug (1-2 files)

**Use Copilot Chat directly:**
```
@workspace The login button throws "Cannot read property 'token' of undefined"
when clicking after session timeout. Fix it.
```

Copilot has full workspace context and can often fix simple bugs in one shot.

### Complex Bug (multiple files, unclear root cause)

**Step 1: Research with Codex explorer**

```bash
codex
# Then:
> Trace the execution path from LoginButton.onClick through to the API call.
> Which files are involved and where could a null token occur?
```

The `explorer` agent (read-only, medium effort) traces call chains without modifying anything.

**Step 2: Fix with Claude Code**

```
/tdd Fix the null token error on session timeout Ã¢â‚¬â€ the token refresh logic
in src/auth/refresh.ts doesn't handle expired refresh tokens
```

TDD approach: write a test that reproduces the bug first, then fix.

**Step 3: Verify**

```
/verify quick
```

Quick mode: build + types only (fast feedback).

---

## Part 4: Multi-File Refactoring

### When 5+ files need coordinated changes

**Step 1: Initialize a Claude-Flow swarm**

In Claude Code, use the MCP tools:
```
swarm_init(topology="hierarchical", maxAgents=6, strategy="specialized")
```

**Step 2: Spawn specialists**

```
agent_spawn(type="architect", name="refactor-lead")
agent_spawn(type="coder", name="impl-1")
agent_spawn(type="coder", name="impl-2")
agent_spawn(type="tester", name="test-1")
agent_spawn(type="reviewer", name="review-1")
```

**Step 3: Claude Code agents do the actual work**

```
/orchestrate refactor Extract the payment logic from OrderService into
a dedicated PaymentService with its own module
```

The swarm tracks coordination while Claude Code agents execute the refactoring.

**Step 4: Use Copilot to polish**

After the heavy refactoring, use Copilot Chat to:
- "Update all imports that reference the old OrderService.processPayment path"
- "Add JSDoc to the new PaymentService public methods"
- "Generate a migration guide for this refactoring"

---

## Part 5: Daily Patterns & Shortcuts

### The 30-Second Decision Tree

```
Need to write code right now?
  Ã¢â€Å“Ã¢â€â‚¬ Yes, small/local Ã¢â€ â€™ Copilot (Tab + Chat)
  Ã¢â€Å“Ã¢â€â‚¬ Yes, complex/multi-file Ã¢â€ â€™ Claude Code (/plan then /tdd)
  Ã¢â€Å“Ã¢â€â‚¬ Need to research first Ã¢â€ â€™ Codex explorer + Context7
  Ã¢â€â€Ã¢â€â‚¬ Need to coordinate agents Ã¢â€ â€™ Claude-Flow swarm

Need a review?
  Ã¢â€Å“Ã¢â€â‚¬ Quick self-review Ã¢â€ â€™ Copilot Chat: "Review this function"
  Ã¢â€Å“Ã¢â€â‚¬ Thorough review Ã¢â€ â€™ Claude Code: /code-review
  Ã¢â€â€Ã¢â€â‚¬ Second opinion Ã¢â€ â€™ Codex reviewer agent (different model)

Something broken?
  Ã¢â€Å“Ã¢â€â‚¬ Error message is clear Ã¢â€ â€™ Copilot Chat: "Fix this error"
  Ã¢â€Å“Ã¢â€â‚¬ Root cause unknown Ã¢â€ â€™ Codex explorer to trace, then Claude Code /tdd
  Ã¢â€â€Ã¢â€â‚¬ Build won't compile Ã¢â€ â€™ Claude Code build-error-resolver agent

About to commit?
  Ã¢â€â€Ã¢â€â‚¬ Always Ã¢â€ â€™ Claude Code: /verify pre-commit
```

### Copilot Chat Power Moves

These work in VS Code right now with your setup:

| Command | What It Does |
|---------|-------------|
| `@workspace` + question | Searches entire codebase for context |
| Select code Ã¢â€ â€™ "Explain this" | Inline explanation |
| Select code Ã¢â€ â€™ "Write tests for this" | Quick test generation |
| Select code Ã¢â€ â€™ "Refactor this to use..." | Targeted refactoring |
| `@terminal` + error message | Explains terminal errors |
| `/fix` in chat | Auto-fix the selected code |
| `/tests` in chat | Generate tests for selected code |
| `/doc` in chat | Generate documentation |

### Claude Code Slash Commands (Your Full Arsenal)

| Command | When to Use |
|---------|-------------|
| `/plan` | Before any feature work Ã¢â‚¬â€ creates phased plan, waits for approval |
| `/tdd` | Writing any new code Ã¢â‚¬â€ tests first, then implementation |
| `/code-review` | Before every commit Ã¢â‚¬â€ security + quality checks |
| `/verify` | Pre-PR Ã¢â‚¬â€ full build/type/lint/test/secrets audit |
| `/orchestrate feature` | Multi-file features Ã¢â‚¬â€ full agent pipeline |
| `/orchestrate bugfix` | Complex bugs Ã¢â‚¬â€ research Ã¢â€ â€™ fix Ã¢â€ â€™ test pipeline |
| `/orchestrate refactor` | Large refactors Ã¢â‚¬â€ architect Ã¢â€ â€™ coder Ã¢â€ â€™ reviewer |
| `/orchestrate security` | Security audit Ã¢â‚¬â€ security-reviewer Ã¢â€ â€™ code-reviewer Ã¢â€ â€™ architect |
| `/multi-workflow` | Multi-model Ã¢â‚¬â€ routes to Codex/Gemini by domain |
| `/multi-plan` | Multi-model planning Ã¢â‚¬â€ dual analysis from GPT + Gemini |
| `/multi-execute` | Multi-model execution Ã¢â‚¬â€ prototype Ã¢â€ â€™ refactor Ã¢â€ â€™ audit |
| `/devfleet` | Parallel agents in isolated worktrees |
| `/learn` | Extract reusable patterns from current session |
| `/verify quick` | Fast check Ã¢â‚¬â€ build + types only |
| `/verify pre-pr` | Full check + security scan |
| `/quality-gate` | Run lint + format + type checks on changed files |

### Codex CLI Commands (Terminal)

```bash
# Start Codex with strict (read-only) profile for reviews
codex -p strict

# Start Codex with yolo profile for rapid prototyping
codex -p yolo

# Available agents (auto-threaded, max 6 concurrent)
# explorer Ã¢â‚¬â€ traces code paths, read-only
# reviewer Ã¢â‚¬â€ reviews code quality and security, read-only
# docs-researcher Ã¢â‚¬â€ verifies API behavior against docs, read-only
```

### Claude-Flow Memory Commands (from any platform)

```bash
# Search for past patterns (semantic vector search)
npx claude-flow@alpha memory search --query "how I handled pagination" --namespace patterns

# Store a pattern after solving something
npx claude-flow@alpha memory store --key "pattern-cursor-pagination" \
  --value "Use cursor-based pagination with encoded opaque cursors. Include hasNextPage in response." \
  --namespace patterns

# List all stored patterns
npx claude-flow@alpha memory list --namespace patterns
```

---

## Part 6: Advanced Ã¢â‚¬â€ Multi-Model Collaboration

### When to use /multi-workflow vs /orchestrate

| Scenario | Use | Why |
|----------|-----|-----|
| Feature needs frontend + backend | `/multi-workflow` | Routes frontend to Gemini, backend to Codex, Claude orchestrates |
| Feature is backend-only or full-stack with one model | `/orchestrate feature` | Single-model pipeline with agent handoffs |
| Need two different AI perspectives | Codex reviewer + Claude Code review | Different model families catch different bugs |
| Need isolated parallel work | `/devfleet` | Each agent gets its own git worktree |

### The Dual-Model Review Pattern

For high-stakes code (auth, payments, data deletion):

```
1. Claude Code writes the implementation (/tdd)
2. Claude Code reviews it (/code-review)
3. Codex CLI reviews it independently (codex -p strict Ã¢â€ â€™ reviewer agent)
4. You resolve any disagreements
5. Claude Code verifies (/verify pre-pr)
```

This catches blind spots that a single model family misses Ã¢â‚¬â€ Claude and GPT have different failure modes.

---

## Part 7: What Happens Automatically (Your Hooks)

You don't need to remember to trigger these Ã¢â‚¬â€ they fire automatically:

### On Every File Edit (Claude Fulcrum + Claude-Flow)

```
You edit a file
  Ã¢â€ â€™ post-edit-format.js: auto-formats (Biome/Prettier)
  Ã¢â€ â€™ post-edit-typecheck.js: runs tsc on .ts/.tsx files
  Ã¢â€ â€™ post-edit-console-warn.js: warns about console.log
  Ã¢â€ â€™ quality-gate.js: lint + type checks (async, non-blocking)
  Ã¢â€ â€™ claude-flow post-edit: learns patterns from the edit
```

### On Every Command Run

```
You run a bash command
  Ã¢â€ â€™ pre-bash-tmux-reminder.js: reminds to use tmux for long-running tasks
  Ã¢â€ â€™ pre-bash-git-push-reminder.js: reminds to review before push
  Ã¢â€ â€™ post-bash-build-complete.js: analyzes build results (async)
  Ã¢â€ â€™ post-bash-pr-created.js: logs PR URL after creation
  Ã¢â€ â€™ claude-flow post-command: tracks metrics
```

### On Session End

```
Session ends
  Ã¢â€ â€™ session-end.js: persists session state
  Ã¢â€ â€™ evaluate-session.js: extracts learnable patterns
  Ã¢â€ â€™ cost-tracker.js: logs token usage and cost
  Ã¢â€ â€™ claude-flow session-end: exports metrics to shared memory
```

### Before Context Compaction

```
Context window getting full
  Ã¢â€ â€™ suggest-compact.js: suggests strategic compaction points
  Ã¢â€ â€™ pre-compact.js: saves state before compaction
```

---

## Part 8: Cheat Sheet Ã¢â‚¬â€ Copy This to Your Desk

```
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š                 DAILY DEVELOPMENT FLOW                      Ã¢â€â€š
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¤
Ã¢â€â€š                                                            Ã¢â€â€š
Ã¢â€â€š  1. START SESSION                                          Ã¢â€â€š
Ã¢â€â€š     memory_search("yesterday's work")                      Ã¢â€â€š
Ã¢â€â€š                                                            Ã¢â€â€š
Ã¢â€â€š  2. PLAN FIRST                                             Ã¢â€â€š
Ã¢â€â€š     /plan [feature description]                            Ã¢â€â€š
Ã¢â€â€š     Wait for approval before coding                        Ã¢â€â€š
Ã¢â€â€š                                                            Ã¢â€â€š
Ã¢â€â€š  3. CODE WITH TDD                                          Ã¢â€â€š
Ã¢â€â€š     /tdd [specific component]                              Ã¢â€â€š
Ã¢â€â€š     Copilot Tab for boilerplate while coding               Ã¢â€â€š
Ã¢â€â€š                                                            Ã¢â€â€š
Ã¢â€â€š  4. REVIEW                                                 Ã¢â€â€š
Ã¢â€â€š     /code-review (Claude)                                  Ã¢â€â€š
Ã¢â€â€š     codex -p strict (GPT second opinion, high-stakes only) Ã¢â€â€š
Ã¢â€â€š                                                            Ã¢â€â€š
Ã¢â€â€š  5. VERIFY                                                 Ã¢â€â€š
Ã¢â€â€š     /verify pre-commit (quick)                             Ã¢â€â€š
Ã¢â€â€š     /verify pre-pr (full, before merge)                    Ã¢â€â€š
Ã¢â€â€š                                                            Ã¢â€â€š
Ã¢â€â€š  6. LEARN                                                  Ã¢â€â€š
Ã¢â€â€š     /learn (extract session patterns)                      Ã¢â€â€š
Ã¢â€â€š     memory_store(key, value, "patterns")                   Ã¢â€â€š
Ã¢â€â€š                                                            Ã¢â€â€š
Ã¢â€â€š  ANYTIME SHORTCUTS:                                        Ã¢â€â€š
Ã¢â€â€š     Copilot Chat Ã¢â€ â€™ quick questions, explanations, small    Ã¢â€â€š
Ã¢â€â€š     /orchestrate Ã¢â€ â€™ multi-agent pipeline for big tasks      Ã¢â€â€š
Ã¢â€â€š     /multi-workflow Ã¢â€ â€™ multi-model for frontend+backend     Ã¢â€â€š
Ã¢â€â€š     Codex explorer Ã¢â€ â€™ trace code paths without modifying    Ã¢â€â€š
Ã¢â€â€š                                                            Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
```

---

## Appendix: What Lives Where

| Config File | Controls | Location |
|-------------|----------|----------|
| `~/.claude.json` | Claude Code MCP servers (runtime) | User home |
| `~/.claude/settings.json` | Claude Fulcrum hooks (format, typecheck, quality) | User home |
| `~/.codex/config.toml` | Codex CLI MCP + agents + profiles | User home |
| `.claude.json` (project) | Claude-Flow learning hooks for this repo | Project root |
| `.codex/config.toml` (project) | Codex project-local MCP | Project root |
| `.github/copilot-instructions.md` | Copilot project context | Project root |
| `.vscode/settings.json` | VS Code + Copilot settings | Project root |
| `~/.claude/agents/*.md` | 25 Claude Code agent definitions | User home |
| `~/.claude/commands/*.md` | 55+ slash commands | User home |
| `~/.claude/skills/*/SKILL.md` | 47+ skill instruction sets | User home |
| `~/.claude/rules/*` | Language-specific coding rules (8 langs) | User home |
| `~/.codex/agents/*.toml` | Codex agent configs (explorer, reviewer, docs) | User home |
| `CLAUDE.md` | Project-level Claude Code instructions | Project root |
| `AGENTS.md` | Project-level agent guide | Project root |
