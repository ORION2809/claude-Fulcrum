# Claude Fulcrum v3.1 - Implementation Plan

> Upgrade scope: integrate learnings from 10 open-source repos into Claude Fulcrum
> Goal: turn Fulcrum into a cross-platform, memory-backed, quality-enforced AI development platform
> Revised with: targeted critiques, multi-agent repo research, and Claude Flow/Codex/Cursor/Copilot interoperability constraints

---

## Executive Summary

This version upgrades the original plan in four important ways:

1. Memory is now SQLite-first and cross-platform by design.
   The default backend is `better-sqlite3` + `sqlite-vss` + FTS5, not ChromaDB/Milvus. External vector stores remain optional adapters, not baseline dependencies.

2. The quality loop is now specified as an actual control plane.
   Oscillation, stagnation, score caps, rollback, audit logs, and emergency bypasses are defined before implementation.

3. Hooks and governance are now treated as architecture, not scripts.
   The plan adds a provider-neutral event bus, repo hook trust, config precedence, append-only governance logs, and a hook control plane that works across Claude Code, Codex CLI, Cursor, Copilot, and Claude Flow.

4. Parallel execution is now based on attempts, sessions, and isolated worktrees.
   An attempt is a fresh execution environment; a session is a conversation thread within an attempt. This avoids conflating retries, resets, and fresh branch-based experiments.

This plan integrates the best features from 10 repos across 6 layers:

| Layer | Source Repos | Key Upgrades |
|-------|--------------|--------------|
| Memory lifecycle | claude-mem, memsearch, A-MEM | lifecycle hooks, crash-safe queue, forked retrieval, graph expansion |
| Governance and hooks | Plankton, agent-of-empires, awesome-copilot | config protection, hook trust, append-only audit logs, event adapters |
| Quality enforcement | Tony363-SuperClaude, SuperClaude Framework, toolkit | deterministic scoring, loop control, self-review, telemetry |
| Parallel execution | vibe-kanban, agent-of-empires | attempts vs sessions, worktree isolation, retries/resets, queueing |
| Agent architecture | Tony363-SuperClaude, SuperClaude Framework, toolkit | tiered agents, persona routing, PM meta-layer, handoff contracts |
| Distribution and packaging | awesome-copilot, toolkit | shared manifests, cross-platform packaging, community format alignment |

---

## Current Status Snapshot

The repo is no longer at the draft-only stage. A meaningful subset of the control-plane work is already live, and the remaining work should now be executed as a phased program instead of a one-shot migration.

### Implemented or materially integrated

- Phase 1.1 memory lifecycle hooks:
  [session-lifecycle.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/session-lifecycle.js),
  [compress-observation.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/compress-observation.js),
  [privacy-gate.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/utils/privacy-gate.js),
  [tag-stripping.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/utils/tag-stripping.js)
- Phase 1.2 config protection and hook governance:
  [protect-configs.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/protect-configs.js),
  [config-guardian-stop.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/config-guardian-stop.js),
  [repo-hook-trust.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/repo-hook-trust.js),
  [hook-control-plane.json](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/config/hook-control-plane.json)
- Phase 1.4 privacy gate:
  reusable sanitization and tag stripping are active in the lifecycle path
- Phase 1.5 canonical memory records and derived views:
  [rebuild-views.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/memory/rebuild-views.js),
  [daily-memory-view.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/daily-memory-view.js)
- Phase 4.2 deterministic scoring and part of 4.1 loop control:
  [scorer.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/quality/scorer.js),
  [loop.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/quality/loop.js),
  [telemetry-writer.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/quality/telemetry-writer.js)
- Phase 5.1 attempt/session/worktree foundations:
  [tmux-worktree-orchestrator.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/lib/tmux-worktree-orchestrator.js),
  [orchestration-session.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/lib/orchestration-session.js)

### Newly closed in this pass

- Phase 1.3 now has executable deterministic behavior, not just docs:
  [confidence-gate.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/quality/confidence-gate.js)
- Phase 2.1 moved closer to the memsearch/claude-mem model:
  [search-orchestrator.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/memory/search-orchestrator.js) now supports staged retrieval modes (`search`, `expand`, `drill_in`), returns a bounded synthesized response, and expands linked memory notes instead of only raw hit lists
- Phase 2.1 retrieval primitives are now richer inside the current SQLite-first baseline:
  timeline slices and focus-entry drill-in now resolve against the state store instead of only flat recent-hit ranking
- Phase 2.1 now also has a stable retrieval envelope for the upcoming forked-worker phase:
  requests preserve scope, mode, focus entry, budget, and isolated-execution preference even though execution is still in-process today
- Phase 2.1 now has an initial isolated retrieval worker boundary:
  [retrieval-worker.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/memory/retrieval-worker.js) executes retrieval requests out-of-process when allowed, with explicit in-process fallback metadata when the environment blocks subprocess isolation
- Phase 2.1 isolated retrieval is now visible in the orchestration surface:
  retrieval runs emit `task.md`, `handoff.md`, and `status.md` under `.orchestration/memory-retrieval/<request-id>/`
- Phase 2.1 retrieval runs are now inspectable through the canonical session adapter layer:
  `memory:<request-id>` targets resolve via the `memory-retrieval` adapter and normalize into canonical session snapshots
- Phase 2.2 has an upgraded interim ranking model before FTS5/vector landing:
  [search-orchestrator.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/memory/search-orchestrator.js) now blends lexical coverage, recency, and structure signals with reciprocal-rank-style fusion instead of relying on flat token hit counts alone
- Phase 2.2B queue semantics now follow the upstream crash-safe claim-confirm shape instead of direct inline status flips:
  [queries.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/lib/state-store/queries.js) and [session-lifecycle.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/session-lifecycle.js) now mirror the claude-mem pattern of `enqueue -> claim processing -> confirm processed`, including stale-processing self-healing before reclaim
- Phase 2.1 retrieval delegation now matches the memsearch fork boundary more closely:
  [search-orchestrator.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/memory/search-orchestrator.js) keeps full retrieval detail inside the delegated run artifact and returns a summary-only parent payload, with [response.json](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/.orchestration/memory-retrieval) as the inspectable detail sink for expand/drill-in output
- Phase 3.1 has a first connected-memory behavior, not just schema:
  [session-lifecycle.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/session-lifecycle.js) now creates heuristic links between related memory notes at write time
- Session start now uses bounded memory awareness instead of directly dumping recent memory lines:
  [session-start.js](c:/Users/ShreyasSuvarna/Desktop/its_mine/claude-flows/scripts/hooks/session-start.js)

### Still materially missing

- long-lived delegated retrieval via agent/session orchestration instead of request-scoped worker execution
- SQLite FTS5 and vector-backed hybrid retrieval
- ONNX embedding provider
- time-aware graph traversal, neighbor-first expansion beyond one hop, and consolidation passes
- policy validators, cross-model auditor, and self-review persona runtime
- TUI/dashboard telemetry and richer queue/retry/reset operator flows
- persona router, ranked agent selection, handoff contracts, and shared manifest generation

### Next execution order

1. Finish Phase 2 memory retrieval foundations:
   long-lived delegated retrieval and stronger hybrid ranking/indexing
2. Finish the rest of Phase 4 quality enforcement:
   policy validators, self-review, and optional external auditor
3. Expand Phase 5 operator control:
   queueing, retry/reset, and richer status telemetry

---

## Architectural Principles

1. SQLite-first local baseline.
   Fulcrum must work after install without requiring Docker, Python sidecars, or remote vector services.

2. Derived indexes, canonical records.
   SQLite records are canonical. Vector indexes, timeline views, markdown views, and graph caches are rebuildable derivatives.

3. Progressive disclosure over raw replay.
   Retrieval should move through search -> expand -> drill-in, with transcript recall as the most expensive fallback.

4. One internal event model, many platform adapters.
   Claude Code hooks, Codex CLI checkpoints, Cursor rules, Copilot instructions, and Claude Flow workers should all map into the same internal lifecycle events.

5. Attempts are isolated; sessions are lightweight.
   Retries within an attempt should preserve state. New attempts should get fresh branches, worktrees, and context.

6. Quality gates must be debuggable and escapable.
   Every block needs a reason, an audit trail, and a documented emergency bypass.

---

## Cross-Platform Contract

Fulcrum will operate across five execution surfaces:

| Platform | Role | Integration Model |
|----------|------|-------------------|
| Claude Code | primary deep agent runtime | native hooks + local scripts |
| Codex CLI | implementation/reviewer runtime | shared MCP + event adapter + repo rule pack |
| Cursor | IDE runtime | mirrored rules + MCP integration + shared memory |
| GitHub Copilot | project instruction consumer | generated instruction bundle + packaging manifest |
| Claude Flow | orchestration plane | shared memory, routing, governance, swarm orchestration |

### Internal Event Bus

All platforms normalize into these internal events:

- `session_start`
- `user_prompt_submit`
- `pre_tool_use`
- `post_tool_use`
- `pre_compact`
- `summary_checkpoint`
- `stop`
- `session_end`
- `error_occurred`

This is the backbone for memory capture, governance logs, quality gates, and orchestration telemetry.

---

## Phase 1: Immediate Wins (Weeks 1-3)

### 1.1 Session Memory Lifecycle Hooks
**Source**: claude-mem, memsearch  
**Value**: 5-10x memory efficiency without polluting live context  
**Complexity**: Medium

**What to build**:
- Replace the single PostToolUse hook with a lifecycle pipeline:
  - `UserPromptSubmit`: strip/store sanitized prompts
  - `PostToolUse`: enqueue sanitized observations
  - `SummaryCheckpoint`: create structured session checkpoints
  - `SessionEnd`: mark completion without blocking active workers
- Compression remains Haiku-tier by default, but only after privacy filtering
- Tool payloads are truncated before summarization
- Full transcript bodies are never stored by default

**Implementation**:
```text
user_prompt_submit -> sanitize prompt -> pending_messages
post_tool_use -> sanitize/truncate tool result -> pending_messages
summary_checkpoint -> write structured summary + anchors
session_end -> finalize session + flush queue state
```

**Files to create/modify**:
- `scripts/hooks/session-lifecycle.js`
- `scripts/hooks/compress-observation.js`
- `plugin/hooks/hooks.json`
- `skills/memory-compression/SKILL.md`

### 1.2 Config Protection and Hook Governance
**Source**: Plankton, agent-of-empires, Claude Flow guidance  
**Value**: Prevent agents from weakening their own enforcement layer  
**Complexity**: Medium

**What to build**:
- Protect `Edit|Write|NotebookEdit`, not just `Write`
- Protect linter configs, hook configs, and Fulcrum runtime configs:
  - `.eslintrc*`, `.prettierrc*`, `biome.json`, `.ruff.toml`, `tsconfig.json`
  - `.claude/settings*.json`
  - `.claude/hooks/*`
  - Fulcrum config manifests and policy bundles
- Use a two-layer approval model:
  - real-time block at `pre_tool_use`
  - stop-time diff audit with content-hash approval
- Add repo hook trust:
  - hash hook commands and policy bundles
  - re-approval required when a protected command changes
- Add explicit config precedence:
  - `global -> profile -> repo`
  - repo overrides limited to an approved subset

**Additional requirement**:
- Before implementing custom quality enforcement, evaluate whether `@claude-flow/guidance` can supply typed policy bundles and enforcement gates for part of this layer.

**Files to create/modify**:
- `scripts/hooks/protect-configs.js`
- `scripts/hooks/config-guardian-stop.js`
- `scripts/hooks/repo-hook-trust.js`
- `config/hook-control-plane.json`
- `plugin/hooks/hooks.json`

### 1.3 Confidence Gate with Triple Reflection
**Source**: SuperClaude Framework  
**Value**: Prevent wrong-direction work before execution starts  
**Complexity**: Low

**What to build**:
- Keep the original weighted confidence check
- Add a second layer called `triple_reflection`:
  1. requirement clarity
  2. prior-mistake detection
  3. context readiness
- Output:
  - score
  - blockers
  - recommendations
  - reflection log
- Default proceed threshold: `0.7`

**Files to create/modify**:
- `skills/confidence-check/SKILL.md`
- `commands/confidence-check.md`
- `schemas/confidence-gate.schema.json`

### 1.4 Privacy Gate and Tag Processing
**Source**: claude-mem  
**Value**: Edge filtering of PII, secrets, and recursive memory injection  
**Complexity**: Low

**What to build**:
- Strip `<private>...</private>` tags
- Strip memory-recursion tags such as `<claude-mem-context>`
- Cap tag counts to avoid pathological inputs
- If content becomes empty after stripping, skip storage entirely
- Make this a reusable privacy gate, not just a utility

**Files to create/modify**:
- `scripts/utils/tag-stripping.js`
- `scripts/utils/privacy-gate.js`
- integrate into `session-lifecycle.js`

### 1.5 Canonical Memory Records with Derived Markdown Views
**Source**: claude-mem, memsearch  
**Value**: machine-reliable storage plus human-inspectable memory files  
**Complexity**: Medium

**What to build**:
- Canonical store lives in SQLite, not markdown
- Generate optional daily markdown views under `.claude/memory/YYYY-MM-DD.md`
- Markdown is derived and rebuildable
- Store transcript anchors, not full transcript bodies
- Use async stop-time summarization and SHA-256 dedup

**Files to create/modify**:
- `scripts/hooks/daily-memory-view.js`
- `scripts/memory/rebuild-views.js`
- `plugin/hooks/hooks.json`

---

## Phase 2: Memory Layer Upgrade (Weeks 4-7)

### 2.1 Forked Retrieval with Progressive Disclosure
**Source**: memsearch, claude-mem  
**Value**: memory search stays bounded and does not pollute the main context  
**Complexity**: High

**What to build**:
- A retrieval delegation path with explicit triggers:
  - `SessionStart`: inject recent-memory awareness
  - `UserPromptSubmit`: emit cheap "memory available" hint
  - skill or orchestrator invocation: run forked recall only on demand
- Retrieval pipeline:
  1. `search`: candidate memory chunks
  2. `expand`: related chunks, timelines, graph neighbors
  3. `drill_in`: transcript/context anchors only when required
- Parent context receives curated synthesis, not raw dumps

**Hard limits**:
- capture only the last turn by default
- return max 500 tokens to main context by default
- transcript bodies are L3 fallback only

**Files to create/modify**:
- `skills/memory-recall/SKILL.md`
- `commands/memory-search.md`
- `scripts/memory/search-orchestrator.js`

### 2.2 Hybrid Search Backend (SQLite-First)
**Source**: memsearch, claude-mem, critique update  
**Value**: zero-infra default hybrid search with good semantic recall  
**Complexity**: High

**What to build**:
- SQLite metadata store with `better-sqlite3`
- SQLite FTS5 for keyword/BM25 search
- `sqlite-vss` for local vector ANN search
- Reciprocal Rank Fusion for hybrid ranking
- Composite chunk IDs:
  - `sha256(source + line_range + content + embedding_model)`

**Default architecture**:
```text
Canonical Store
|- SQLite tables: observations, relationships, sessions, pending_messages, governance_events
|- FTS5 virtual tables: keyword search
|- sqlite-vss index: semantic search
`- Derived markdown views and graph caches
```

**Optional adapters, not defaults**:
- ChromaDB
- Milvus
- Claude Flow AgentDB / HNSW sync

These are only added when scale or deployment constraints justify them.

**Dependencies**:
- `better-sqlite3`
- `sqlite-vss`

#### 2.2A Context Window Budget Tracking
**Source**: critique update, Claude Flow Context Autopilot prior art  

Add proactive context tracking:
- `UserPromptSubmit` counts estimated active-context tokens
- thresholds:
  - 70% -> warning event
  - 85% -> aggressive compression and retrieval narrowing
- budget telemetry is written to governance logs and orchestration telemetry

#### 2.2B Crash-Safe Queue and Cross-Platform Sync
**Source**: claude-mem, Claude Flow cross-platform docs  

Define the ingest contract:
- `pending -> processing -> processed | failed`
- atomic claim/store/confirm
- stale-processing recovery
- content-hash dedup on write

Define the shared namespace contract:
- `working/<platform>/<session_id>`
- `shared/patterns`
- `shared/results`
- `shared/collaboration`
- `shared/governance`

Cross-platform rule:
- SQLite is canonical on disk
- AgentDB/HNSW namespaces are synchronized caches for collaborative recall
- Cursor/Copilot/Codex must read and write through the same namespace rules

### 2.3 ONNX Local Embeddings
**Source**: memsearch  
**Value**: local semantic recall without API dependency  
**Complexity**: Medium

**What to build**:
- ONNX embedding provider for local inference
- fallback to remote embeddings only when local provider unavailable
- lazy-load model on first demand

**Files to create/modify**:
- `scripts/utils/embeddings.js`
- `scripts/utils/onnx-provider.js`

### 2.4 Incremental Dedup and Reindexing
**Source**: memsearch  
**Value**: avoid unnecessary embedding churn and stale indexes  
**Complexity**: Low

**What to build**:
- composite content hashes
- skip unchanged chunks
- delete stale chunks when source changes
- per-workspace collection isolation

---

## Phase 3: Knowledge Graph (Weeks 8-11)

### 3.1 MemoryNote Data Model
**Source**: A-MEM  
**Value**: typed, linkable, evolving memory objects  
**Complexity**: High

**What to build**:
- `MemoryNote` schema with:
  - core content
  - keywords
  - tags
  - category
  - links
  - evolution history
  - retrieval metadata
  - created/accessed timestamps

### 3.2 Graph-Linked Retrieval
**Source**: A-MEM  
**Value**: semantic seed retrieval can expand into related operational memory  
**Complexity**: Very High

**What to build**:
- two-stage retrieval:
  1. semantic seed selection
  2. graph neighbor expansion
- separate budgets for seed count and neighbor fan-out
- typed edges:
  - `prevents`
  - `related_to`
  - `evolved_from`
  - `depends_on`
  - `conflicts_with`

### 3.3 Time-Aware Traversal
**Source**: A-MEM  
**Value**: prefer recent, relevant knowledge before deep chain exploration  
**Complexity**: Medium

**What to build**:
- BFS on recent memories first
- DFS on deep chains second
- configurable decay windows by query type

### 3.4 Memory Evolution and Consolidation
**Source**: A-MEM  
**Value**: memories become better structured over time instead of accumulating forever  
**Complexity**: Medium

**What to build**:
- background maintenance pass after ingestion
- update links, tags, and summaries over time
- support branchable memory clones for isolated attempts
- support consolidation hooks for compaction and stale-memory downsampling

---

## Phase 4: Quality Enforcement (Weeks 12-16)

### 4.1 Agentic Quality Loop
**Source**: Tony363-SuperClaude, SuperClaude Framework, critique update  
**Value**: automatic quality enforcement without manual review commands  
**Complexity**: Very High

**What to build**:
- typed loop contract:
  - `LoopConfig`
  - `IterationResult`
  - `LoopResult`
  - `TerminationReason`
- termination reasons:
  - `QUALITY_MET`
  - `MAX_ITERATIONS`
  - `TIMEOUT`
  - `OSCILLATION`
  - `STAGNATION`
  - `USER_CANCELLED`
  - `ERROR`

**Loop flow**:
1. execute task
2. collect normalized evidence
3. score deterministically
4. compare against threshold and hard caps
5. generate bounded improvement instructions
6. stop or iterate

**Oscillation and stagnation rules**:
```javascript
const isImproving = (scores) =>
  scores.length < 2 ? true : scores[scores.length - 1] > scores[scores.length - 2]

const isOscillating = (scores) => {
  if (scores.length < 4) return false
  const recent = scores.slice(-4)
  const variance = Math.max(...recent) - Math.min(...recent)
  return variance < 5 && !isImproving(scores)
}

const isStagnating = (scores, minDelta = 2) => {
  if (scores.length < 3) return false
  const lastThree = scores.slice(-3)
  return lastThree.every((s, i) =>
    i === 0 || Math.abs(s - lastThree[i - 1]) < minDelta
  )
}
```

**Operational safeguards**:
- hard cap: 5 iterations
- timeout: 5 minutes by default
- write score progression to JSONL audit log
- emergency bypass: `GC_SKIP_QUALITY_LOOP=true`
- manual override command: `/quality-override`

**Research gate before implementation**:
- review whether `@claude-flow/guidance` enforcement gates should supply part of this control loop before building Fulcrum-native duplication

### 4.2 Deterministic Quality Scoring
**Source**: Tony363-SuperClaude `quality.py`  
**Value**: objective scoring without LLM self-grading  
**Complexity**: Medium

**Scoring dimensions**:
| Dimension | Weight | Measurement |
|-----------|--------|-------------|
| Code changes | 30% | meaningful file modifications |
| Tests run | 25% | test suite executed |
| Tests pass | 25% | pass rate |
| Coverage | 10% | coverage threshold |
| No errors | 10% | build/test execution free of hard errors |

**Add score bands**:
- `poor`
- `needs_work`
- `acceptable`
- `good`
- `excellent`

**Add hard caps before threshold comparison**:
- security-critical issue cap: 30
- majority tests failing cap: 40
- build broken cap: 45

**Pass rule**:
- `score >= threshold`
- and no hard-cap violation

### 4.3 Quality Policy Validators
**Source**: Fulcrum-native design informed by Tony363 and toolkit  
**Value**: keep execution scoring separate from architecture-policy checks  
**Complexity**: Medium

**Validators**:
- `KISS`
- `Purity`
- `SOLID`
- `LetItCrash`
- `SecurityPolicy`
- `ContextBudgetPolicy`

These are separate from execution scoring and should produce structured findings, not directly overwrite the execution score.

### 4.4 Cross-Model Auditor
**Source**: awesome-claude-code-toolkit  
**Value**: independent review reduces self-review bias  
**Complexity**: Medium

**What to build**:
- optional cross-model review at stop/merge boundary
- configurable reviewer models
- block only on critical findings
- write append-only governance event instead of raw conversation capture

### 4.5 Self-Check Protocol and Self-Review Persona
**Source**: SuperClaude Framework  
**Value**: dedicated verification step before task completion  
**Complexity**: Low

**What to build**:
- a protocol checklist
- a dedicated `self-review` persona/agent
- required outputs:
  - requirement match
  - tests/build status
  - edge-case coverage
  - rollback/follow-up recommendation

---

## Phase 5: Parallel Execution and Session Management (Weeks 17-20)

### 5.1 Attempts, Sessions, and Worktree Isolation
**Source**: vibe-kanban, agent-of-empires  
**Value**: clean separation between fresh executions and ongoing conversations  
**Complexity**: High

**Definitions**:
- `Attempt`: fresh execution environment with branch, worktree, context lineage, and queue
- `Session`: conversation thread inside an attempt sharing files but not chat history

**What to build**:
- per-attempt worktree directories
- branch naming convention
- cold-start rehydration if worktree deleted
- rollback for partially created worktrees
- orphan cleanup on startup
- archive vs delete semantics
- parent/group hierarchy for multi-agent runs

### 5.2 Multi-Agent Attempt Pattern
**Source**: vibe-kanban, agent-of-empires  
**Value**: compare parallel implementations without shared-state corruption  
**Complexity**: Medium

**What to build**:
- `/attempt` creates isolated attempts, not just sessions
- each attempt gets:
  - fresh branch
  - isolated worktree
  - own memory fork
  - own queue and telemetry
- present side-by-side diffs and quality summaries before merge

### 5.3 TUI and Status Telemetry
**Source**: agent-of-empires, Tony363  
**Value**: observability for active parallel runs  
**Complexity**: High

**What to build**:
- dashboard for running attempts/sessions
- hook-managed status telemetry:
  - `running`
  - `waiting`
  - `idle`
  - `blocked`
  - `failed`
- JSONL event stream:
  - `iteration_start`
  - `score_update`
  - `subagent_spawn`
  - `subagent_complete`
  - `attempt_complete`

### 5.4 Write-Time Enforcement Pipeline
**Source**: Plankton  
**Value**: quality checks happen continuously rather than at the very end  
**Complexity**: Medium

**What to build**:
- explicit four-step pipeline:
  1. auto-format
  2. collect structured violations
  3. route fixes by severity/complexity tier
  4. rerun verification
- config-driven routing:
  - violation-code patterns
  - per-tier tool permissions
  - per-tier timeouts
  - package-manager policy
- fail-open if hook infrastructure itself breaks, but always emit governance event

### 5.5 Queueing, Retry, and Reset
**Source**: vibe-kanban  
**Value**: operators can recover without creating ad hoc manual processes  
**Complexity**: Medium

**What to build**:
- queue follow-up actions while an attempt is still running
- two recovery modes:
  - `retry`: replay from checkpoint within current attempt
  - `reset`: discard selected process and later processes, optionally reset git state

---

## Phase 6: Agent Architecture Upgrade (Weeks 21-24)

### 6.1 Tiered Agent Architecture with Ranked Selection
**Source**: Tony363-SuperClaude  
**Value**: structured composition instead of flat role lists  
**Complexity**: Very High

**What to build**:
- tiers:
  - core agents
  - traits
  - extensions
- selector returns:
  - top-N ranked candidates
  - confidence
  - scoring breakdown
  - matched criteria
  - fallback agent
- add conflict/tension detection for incompatible traits
- add delegation depth limits and circular-delegation prevention

### 6.2 Persona Routing, Not Just Flags
**Source**: SuperClaude Framework  
**Value**: behavior shifts automatically based on task category and expertise level  
**Complexity**: Medium

**What to build**:
- keep persona flags
- add persona router using:
  - task keywords
  - issue category
  - expertise level
  - risk level
- route into persona stacks and command flows

### 6.3 PM Meta-Layer and Reflexion
**Source**: SuperClaude Framework  
**Value**: session governance above specialist execution  
**Complexity**: Medium

**What to build**:
- PM persona responsibilities:
  - restore context
  - run PDCA cycle
  - checkpoint decisions
  - convert failures into patterns
- classify errors:
  - input
  - logic
  - API
  - config
  - environment
- store fix patterns in shared memory

### 6.4 Agent Handoff Contracts
**Source**: awesome-claude-code-toolkit  
**Value**: multi-agent orchestration becomes testable and reviewable  
**Complexity**: Medium

**What to build**:
- define per-role contracts:
  - inputs
  - outputs
  - allowed mutations
  - verification artifact
- add workflow execution ledger with:
  - dependencies
  - success criteria
  - outputs
  - verification method
  - status

---

## Phase 7: Community, Distribution, and Packaging (Weeks 25-28)

### 7.1 Awesome-Copilot Alignment and Event Adapter Packaging
**Source**: awesome-copilot  
**Value**: shared behavior across Claude, Codex, Cursor, and Copilot  
**Complexity**: Medium

**What to build**:
- provider-neutral hook/event adapter layer
- append-only governance log schema
- dual-scope memory contract:
  - user/global
  - workspace/local
- generate Copilot-compatible instruction bundles from Fulcrum source manifests

### 7.2 SkillKit and Agent Packs
**Source**: awesome-claude-code-toolkit  
**Value**: reusable agent bundles and marketplace discovery  
**Complexity**: Medium

**What to build**:
- per-project agent-pack structure
- specialist-agent schema
- workflow bundles:
  - implementation
  - review
  - workflow-optimization
- skill discovery and install commands

### 7.3 Hook Script Library and Regression Gates
**Source**: toolkit, Plankton  
**Value**: battle-tested hooks plus regression confidence for enforcement code  
**Complexity**: Low

**What to build**:
- portable hook library
- hook regression suite
- runtime-parity checks across supported platforms

### 7.4 Shared Manifest and Build Pipeline
**Source**: awesome-copilot, toolkit  
**Value**: one source of truth for agents, hooks, memory rules, and policy bundles  
**Complexity**: Medium

**What to build**:
- a shared manifest defining:
  - agents
  - commands
  - memory namespaces
  - governance event schema
  - policy bundles
- generators that emit platform-specific packaging:
  - Claude Code
  - Codex CLI
  - Cursor
  - Copilot

---

## Integration Architecture

### Core Subsystems

```text
Fulcrum Core
|- Event Adapter Layer
|  |- Claude Code hook adapter
|  |- Codex CLI checkpoint adapter
|  |- Cursor/Copilot instruction adapter
|  `- Claude Flow worker adapter
|- Governance Layer
|  |- repo hook trust
|  |- policy bundle enforcement
|  `- append-only governance logs
|- Memory Layer
|  |- SQLite canonical store
|  |- FTS5 keyword search
|  |- sqlite-vss semantic index
|  |- graph expansion
|  `- AgentDB namespace sync
|- Quality Layer
|  |- evidence collector
|  |- deterministic scorer
|  |- policy validators
|  `- cross-model audit
`- Execution Layer
   |- attempts
   |- sessions
   |- worktrees
   |- queues
   `- dashboards
```

### New Directory Structure

```text
claude-fulcrum/
|- scripts/
|  |- hooks/
|  |  |- session-lifecycle.js
|  |  |- protect-configs.js
|  |  |- config-guardian-stop.js
|  |  |- repo-hook-trust.js
|  |  |- write-time-enforce.js
|  |  `- cross-model-audit.js
|  |- memory/
|  |  |- search-orchestrator.js
|  |  `- rebuild-views.js
|  |- quality/
|  |  |- scorer.js
|  |  |- evidence-collector.js
|  |  `- telemetry-writer.js
|  `- utils/
|     |- tag-stripping.js
|     |- privacy-gate.js
|     |- embeddings.js
|     `- onnx-provider.js
|- config/
|  |- hook-control-plane.json
|  |- policy-bundles/
|  `- manifests/
|- schemas/
|  |- confidence-gate.schema.json
|  |- governance-event.schema.json
|  |- memory-note.schema.json
|  `- quality-loop.schema.json
|- skills/
|  |- confidence-check/
|  |- memory-compression/
|  |- memory-recall/
|  `- quality-loop/
|- commands/
|  |- confidence-check.md
|  |- memory-search.md
|  |- quality-loop.md
|  |- quality-override.md
|  `- attempt.md
`- agents/
   |- traits/
   |- extensions/
   |- packs/
   `- contracts/
```

### Shared Memory Contract

| Namespace | Purpose | Writers | Readers |
|-----------|---------|---------|---------|
| `working/<platform>/<session_id>` | ephemeral active context | current runtime | current runtime |
| `shared/patterns` | durable learned patterns | all validated runtimes | all runtimes |
| `shared/results` | task outcomes and evidence | orchestrators, reviewers | all runtimes |
| `shared/collaboration` | cross-agent exchange | all participating agents | all participating agents |
| `shared/governance` | audit events and policy decisions | hook/governance layer | operators, dashboards |

### Governance Event Schema

Every governance event should be append-only JSONL and minimal:

- `event_id`
- `timestamp`
- `platform`
- `repo`
- `attempt_id`
- `session_id`
- `event_type`
- `decision`
- `reason`
- `policy_bundle_hash`
- `artifact_ref`

Do not log full prompts by default.

---

## Priority Matrix

| Priority | Phase | Feature | Source | Value | Effort |
|----------|-------|---------|--------|-------|--------|
| P0 | 1.1 | Session memory lifecycle hooks | claude-mem + memsearch | CRITICAL | 1-2 weeks |
| P0 | 1.2 | Config protection and hook governance | Plankton + AoE + guidance review | CRITICAL | 1 week |
| P0 | 1.3 | Confidence gate with triple reflection | SuperClaude | HIGH | 3-5 days |
| P0 | 1.4 | Privacy gate | claude-mem | HIGH | 2 days |
| P0 | 1.5 | Canonical records + derived markdown views | claude-mem + memsearch | HIGH | 4-5 days |
| P1 | 2.1 | Progressive forked retrieval | memsearch + claude-mem | CRITICAL | 1-2 weeks |
| P1 | 2.2 | SQLite-first hybrid search backend | critique + memsearch | CRITICAL | 2-3 weeks |
| P1 | 2.2A | Context window budget tracking | critique + Claude Flow prior art | HIGH | 3 days |
| P1 | 2.2B | Crash-safe queue + namespace sync | claude-mem + Claude Flow | HIGH | 1 week |
| P1 | 2.3 | ONNX local embeddings | memsearch | MEDIUM | 1 week |
| P2 | 3.1 | MemoryNote data model | A-MEM | CRITICAL | 1-2 weeks |
| P2 | 3.2 | Graph-linked retrieval | A-MEM | CRITICAL | 3-4 weeks |
| P2 | 3.3 | Time-aware traversal | A-MEM | HIGH | 1 week |
| P2 | 3.4 | Memory consolidation | A-MEM | HIGH | 1 week |
| P3 | 4.1 | Quality loop orchestrator | Tony363 | CRITICAL | 3-4 weeks |
| P3 | 4.2 | Deterministic scorer with caps | Tony363 | HIGH | 1-2 weeks |
| P3 | 4.3 | Policy validators | Fulcrum-native | HIGH | 1-2 weeks |
| P3 | 4.4 | Cross-model audit | toolkit | MEDIUM | 1 week |
| P3 | 4.5 | Self-review persona | SuperClaude | HIGH | 3 days |
| P4 | 5.1 | Attempts/sessions/worktrees | vibe-kanban + AoE | HIGH | 2-3 weeks |
| P4 | 5.4 | Write-time enforcement pipeline | Plankton | HIGH | 1-2 weeks |
| P4 | 5.5 | Queueing/retry/reset | vibe-kanban | HIGH | 1 week |
| P5 | 6.1 | Tiered agents + ranked selection | Tony363 | HIGH | 4-6 weeks |
| P5 | 6.2 | Persona router | SuperClaude | MEDIUM | 1-2 weeks |
| P5 | 6.4 | Handoff contracts + workflow ledger | toolkit | HIGH | 1-2 weeks |
| P6 | 7.1 | Event adapter packaging | awesome-copilot | MEDIUM | 1 week |
| P6 | 7.4 | Shared manifest/build pipeline | awesome-copilot + toolkit | MEDIUM | 2 weeks |

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Search backend requires hidden infrastructure | Default to `better-sqlite3` + `sqlite-vss` + FTS5. Treat ChromaDB/Milvus as optional adapters only. |
| Compression adds latency to every event | Queue observations asynchronously. Skip trivial payloads. Cache compression where safe. |
| Privacy gate strips too aggressively | Log skip reasons, store only metadata when content is fully private, keep audit counters. |
| Quality loop blocks valid work | Add hard audit log, `/quality-override`, and `GC_SKIP_QUALITY_LOOP=true`. |
| Quality loop retries forever | Hard cap at 5 iterations. Apply explicit oscillation/stagnation detection. Timeout at 5 minutes. |
| Cross-platform memory diverges | Make SQLite canonical, AgentDB synchronized cache only, and enforce namespace contract across platforms. |
| Worktree recovery becomes fragile | Rehydrate missing worktrees, use creation locks, rollback partial failures, clean orphans at startup. |
| Hook trust becomes noisy | Hash commands and policy bundles, require re-approval only when protected content changes. |
| Governance logging captures too much data | Use minimal append-only JSONL with references, not raw prompt dumps. |

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Install friction | vector search needs external infra in draft plan | local default works after install | clean setup on a fresh machine |
| Memory efficiency | raw outputs or oversized summaries | 10:1 compression ratio | storage delta before/after lifecycle hooks |
| Context pressure | reactive only | warn at 70%, compress at 85% | context occupancy telemetry |
| Retrieval pollution | fixed summaries | staged recall with bounded parent payload | token delta after memory retrieval |
| Cross-platform sync | unspecified | shared namespace contract active across 5 platforms | namespace write/read parity |
| Quality loop reliability | underspecified | explicit caps, telemetry, override path | false-negative override rate |
| Governance coverage | script-level only | trust + policy + append-only audit | protected-change audit coverage |
| Agent routing accuracy | manual delegation | top-N ranked candidates with fallback | user override rate |

---

## Repo Reference URLs

| Repo | URL | Key Tech |
|------|-----|----------|
| claude-mem | https://github.com/thedotmack/claude-mem | TypeScript, SQLite, hook lifecycle |
| memsearch | https://github.com/zilliztech/memsearch | Python, retrieval delegation, ONNX |
| A-MEM | https://github.com/agiresearch/A-mem | Python, graph-linked memory |
| SuperClaude Framework | https://github.com/SuperClaude-Org/SuperClaude_Framework | personas, PM agent, confidence/self-check |
| Tony363-SuperClaude | https://github.com/Tony363/SuperClaude | deterministic scoring, loop orchestration |
| vibe-kanban | https://github.com/BloopAI/vibe-kanban | attempts, worktrees, workspace orchestration |
| awesome-copilot | https://github.com/github/awesome-copilot | community formats, event-aligned packaging |
| awesome-claude-code-toolkit | https://github.com/rohitg00/awesome-claude-code-toolkit | hook library, agent packs, workflow ledger |
| Plankton | https://github.com/alexfazio/plankton | config protection, write-time enforcement |
| agent-of-empires | https://github.com/njbrake/agent-of-empires | hook trust, sandbox/worktree orchestration |

---

*Revised from multi-agent review of all 10 repos in `C:\Users\ShreyasSuvarna\Desktop\its_mine\upgrade-research\`*  
*Target project: `C:\Users\ShreyasSuvarna\Desktop\its_mine\claude-flows\`*
