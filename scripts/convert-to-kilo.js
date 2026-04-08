#!/usr/bin/env node

/**
 * convert-to-kilo.js
 *
 * Converts Claude Fulcrum agents, rules, and skills into Kilo Code format.
 *
 * Usage: node scripts/convert-to-kilo.js
 *
 * This script:
 * 1. Converts agents/*.md → .kilo/agents/*.md (subagent format)
 * 2. Copies rules/common/*.md → .kilocode/rules/*.md
 * 3. Copies rules/{lang}/*.md → .kilocode/rules-code/{lang}-*.md
 * 4. Converts skills/ → .kilocode/skills/ (adapts SKILL.md frontmatter)
 * 5. Generates .kilocodemodes (primary custom modes YAML)
 * 6. Generates kilo.json (project config)
 */

const { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync, copyFileSync } = require("fs");
const { join, basename, extname } = require("path");

const ROOT = join(__dirname, "..");

// ─── Helpers ────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const raw = match[1];
  const body = match[2];
  const meta = {};

  for (const line of raw.split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim();
      // Parse YAML arrays like ["Read", "Write"]
      if (val.startsWith("[") && val.endsWith("]")) {
        try {
          val = JSON.parse(val.replace(/'/g, '"'));
        } catch {
          // keep as string
        }
      }
      // Strip surrounding quotes
      if (typeof val === "string" && /^["'].*["']$/.test(val)) {
        val = val.slice(1, -1);
      }
      meta[kv[1]] = val;
    }
  }

  return { meta, body };
}

// Map Claude Fulcrum model names to provider/model identifiers
function mapModel(model) {
  const m = (model || "").toLowerCase();
  if (m.includes("opus")) return "anthropic/claude-opus-4-20250514";
  if (m.includes("haiku")) return "anthropic/claude-haiku-4-20250514";
  return "anthropic/claude-sonnet-4-20250514"; // default
}

// Derive Kilo permission object from Claude tools array
function derivePermissions(tools) {
  if (!Array.isArray(tools)) return {};

  const hasWrite = tools.some((t) => /^(Write|Edit)$/i.test(t));
  const hasBash = tools.some((t) => /^Bash$/i.test(t));
  const hasMcp = tools.some((t) => /mcp/i.test(t));

  const perm = {};

  if (!hasWrite) perm.edit = "deny";
  if (!hasBash) perm.bash = "deny";
  else if (!hasWrite) {
    // Read-only agent that can run bash: restrict to read commands
    perm.bash = {
      "*": "ask",
      "git diff*": "allow",
      "git log*": "allow",
      "git status": "allow",
      "grep *": "allow",
      "find *": "allow",
      "cat *": "allow",
    };
  }
  if (hasMcp) perm.mcp = "allow";

  return perm;
}

// ─── 1. Convert Agents ─────────────────────────────────────────────────────

function convertAgents() {
  const srcDir = join(ROOT, "agents");
  const destDir = join(ROOT, ".kilo", "agents");
  ensureDir(destDir);

  const files = readdirSync(srcDir).filter((f) => f.endsWith(".md"));
  let count = 0;

  for (const file of files) {
    const content = readFileSync(join(srcDir, file), "utf-8");
    const { meta, body } = parseFrontmatter(content);

    const description = meta.description || `Specialist agent: ${meta.name || basename(file, ".md")}`;
    const model = mapModel(meta.model);
    const permissions = derivePermissions(meta.tools);

    // Build Kilo-format frontmatter
    const lines = [];
    lines.push("---");
    lines.push(`description: ${description}`);
    lines.push("mode: subagent");
    lines.push(`model: ${model}`);

    if (Object.keys(permissions).length > 0) {
      lines.push("permission:");
      for (const [key, val] of Object.entries(permissions)) {
        if (typeof val === "string") {
          lines.push(`  ${key}: ${val}`);
        } else if (typeof val === "object") {
          lines.push(`  ${key}:`);
          for (const [cmd, perm] of Object.entries(val)) {
            lines.push(`    "${cmd}": ${perm}`);
          }
        }
      }
    }

    lines.push("---");
    lines.push("");

    const kiloContent = lines.join("\n") + body;
    writeFileSync(join(destDir, file), kiloContent, "utf-8");
    count++;
  }

  console.log(`✓ Converted ${count} agents → .kilo/agents/`);
}

// ─── 2. Convert Common Rules ────────────────────────────────────────────────

function convertCommonRules() {
  const srcDir = join(ROOT, "rules", "common");
  const destDir = join(ROOT, ".kilocode", "rules");
  ensureDir(destDir);

  if (!existsSync(srcDir)) {
    console.log("⚠ No rules/common/ directory found, skipping common rules");
    return;
  }

  const files = readdirSync(srcDir).filter((f) => f.endsWith(".md"));
  let count = 0;

  for (const file of files) {
    copyFileSync(join(srcDir, file), join(destDir, file));
    count++;
  }

  console.log(`✓ Copied ${count} common rules → .kilocode/rules/`);
}

// ─── 3. Convert Language-Specific Rules ─────────────────────────────────────

function convertLanguageRules() {
  const srcDir = join(ROOT, "rules");
  const destDir = join(ROOT, ".kilocode", "rules-code");
  ensureDir(destDir);

  if (!existsSync(srcDir)) {
    console.log("⚠ No rules/ directory found, skipping language rules");
    return;
  }

  const languages = readdirSync(srcDir).filter((d) => {
    const p = join(srcDir, d);
    return statSync(p).isDirectory() && d !== "common";
  });

  let count = 0;

  for (const lang of languages) {
    const langDir = join(srcDir, lang);
    const files = readdirSync(langDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const destName = `${lang}-${file}`;
      copyFileSync(join(langDir, file), join(destDir, destName));
      count++;
    }
  }

  console.log(`✓ Copied ${count} language rules → .kilocode/rules-code/`);
}

// ─── 4. Convert Skills ─────────────────────────────────────────────────────

function convertSkills() {
  const srcDir = join(ROOT, "skills");
  const destDir = join(ROOT, ".kilocode", "skills");
  ensureDir(destDir);

  if (!existsSync(srcDir)) {
    console.log("⚠ No skills/ directory found, skipping skills");
    return;
  }

  const skillDirs = readdirSync(srcDir).filter((d) => {
    const p = join(srcDir, d);
    return statSync(p).isDirectory();
  });

  let count = 0;

  for (const skill of skillDirs) {
    const srcSkillDir = join(srcDir, skill);
    const srcSkillFile = join(srcSkillDir, "SKILL.md");

    if (!existsSync(srcSkillFile)) continue;

    const destSkillDir = join(destDir, skill);
    ensureDir(destSkillDir);

    const content = readFileSync(srcSkillFile, "utf-8");
    const { meta, body } = parseFrontmatter(content);

    // Ensure name matches directory (Kilo requirement)
    const name = skill;
    const description = meta.description || `Skill for ${skill}`;

    // Rebuild with compliant frontmatter
    const lines = [];
    lines.push("---");
    lines.push(`name: ${name}`);
    lines.push(`description: ${description}`);

    // Preserve optional fields
    if (meta.license) lines.push(`license: ${meta.license}`);
    if (meta.metadata) lines.push(`metadata: ${meta.metadata}`);

    lines.push("---");
    lines.push("");

    const kiloContent = lines.join("\n") + body;
    writeFileSync(join(destSkillDir, "SKILL.md"), kiloContent, "utf-8");

    // Copy supporting files (scripts/, references/, assets/)
    const supportDirs = readdirSync(srcSkillDir).filter((item) => {
      const p = join(srcSkillDir, item);
      return statSync(p).isDirectory();
    });

    for (const dir of supportDirs) {
      const srcSub = join(srcSkillDir, dir);
      const destSub = join(destSkillDir, dir);
      ensureDir(destSub);

      const subFiles = readdirSync(srcSub);
      for (const sf of subFiles) {
        const sp = join(srcSub, sf);
        if (statSync(sp).isFile()) {
          copyFileSync(sp, join(destSub, sf));
        }
      }
    }

    count++;
  }

  console.log(`✓ Converted ${count} skills → .kilocode/skills/`);
}

// ─── 5. Convert Commands → Workflows ────────────────────────────────────────

function convertWorkflows() {
  const srcDir = join(ROOT, "commands");
  const destDir = join(ROOT, ".kilocode", "workflows");
  ensureDir(destDir);

  if (!existsSync(srcDir)) {
    console.log("⚠ No commands/ directory found, skipping workflows");
    return;
  }

  const files = readdirSync(srcDir).filter((f) => f.endsWith(".md"));
  let count = 0;

  for (const file of files) {
    copyFileSync(join(srcDir, file), join(destDir, file));
    count++;
  }

  console.log(`✓ Converted ${count} commands → .kilocode/workflows/`);
}

// ─── 6. Generate .kilocodeignore ────────────────────────────────────────────

function generateKilocodeignore() {
  const content = `# Kilo Code Ignore File
# Patterns here prevent Kilo Code from reading/writing these files

# ─── Secrets & Credentials ──────────────────────────────
.env
.env.*
!.env.example
**/*.pem
**/*.key
**/secrets/
**/credentials.json

# ─── Build & Output ─────────────────────────────────────
dist/
build/
out/
coverage/
.next/
.nuxt/
*.tsbuildinfo

# ─── Dependencies ───────────────────────────────────────
node_modules/
vendor/
.pnpm-store/
__pycache__/
*.pyc
target/

# ─── IDE & System ───────────────────────────────────────
.DS_Store
Thumbs.db
*.swp
*.swo

# ─── Test Artifacts & Logs ──────────────────────────────
*.log
test-output.txt
test-run-output.txt
ci-test-output.txt
latest-test-output.txt
full-test.txt
output.txt
testout.txt
oc-*.txt
qg-*.txt
sd-test.txt
si-test.txt
sr-test.txt
ci-*.txt

# ─── Large/Binary Files ─────────────────────────────────
**/*.sqlite
**/*.db
**/*.wasm
`;

  writeFileSync(join(ROOT, ".kilocodeignore"), content, "utf-8");
  console.log("✓ Generated .kilocodeignore");
}

// ─── 7. Generate Mode-Specific Rule Directories ─────────────────────────────

function generateModeRules() {
  // Kilo Code uses .kilo/rules-{mode-slug}/ for mode-specific rules
  // Map each mode to relevant source material

  const modeRules = {
    architect: {
      files: ["patterns.md", "performance.md"],
      extra: `# Architect Mode Rules

## Design Principles
- Always document trade-offs (Pros/Cons/Alternatives/Decision)
- Prefer composition over inheritance
- Design for horizontal scalability
- Use Repository pattern for data access
- Consistent API response envelope format
- Immutability: always create new objects, never mutate
- High cohesion, low coupling between modules

## Architecture Review Checklist
- Current state analysis complete
- Non-functional requirements documented (perf, security, scale)
- Data flow and integration points mapped
- Component responsibilities clearly defined
- API contracts specified
`,
    },
    planner: {
      files: ["development-workflow.md"],
      extra: `# Planner Mode Rules

## Planning Requirements
- ALWAYS wait for user confirmation before implementing
- Break complex features into phases with dependencies
- Include risk assessment for each phase
- Estimate complexity (low/medium/high) per step
- Identify reusable patterns from existing codebase

## Plan Output Format
1. Overview (2-3 sentences)
2. Requirements list
3. Architecture changes (file paths + descriptions)
4. Step-by-step breakdown with dependencies
5. Risks and mitigations
`,
    },
    tdd: {
      files: ["testing.md"],
      extra: `# TDD Mode Rules

## Mandatory Workflow
1. Write test FIRST (RED) — must fail
2. Run test — verify failure
3. Write minimal implementation (GREEN)
4. Run test — verify pass
5. Refactor (IMPROVE) — tests stay green
6. Verify 80%+ coverage

## Required Edge Cases
- Null/undefined input
- Empty arrays/strings
- Invalid types
- Boundary values (min/max)
- Error paths (network, DB failures)
- Race conditions
- Large data sets (10k+ items)
- Special characters (Unicode, emojis, SQL injection chars)
`,
    },
    "security-review": {
      files: ["security.md"],
      extra: `# Security Review Mode Rules

## Mandatory Checks Before Any Commit
- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated and sanitized
- [ ] SQL injection prevention (parameterized queries only)
- [ ] XSS prevention (output escaped, CSP configured)
- [ ] CSRF protection enabled on state-changing endpoints
- [ ] Authentication on all protected routes
- [ ] Rate limiting on public endpoints
- [ ] Error messages don't leak internal details

## Critical Patterns to Flag
| Pattern | Severity |
|---------|----------|
| Hardcoded secrets | CRITICAL |
| Shell commands with user input | CRITICAL |
| String-concatenated SQL | CRITICAL |
| innerHTML with user data | HIGH |
| fetch(userProvidedUrl) | HIGH |
| Plaintext password comparison | CRITICAL |
| No auth on route | CRITICAL |
| No rate limiting | HIGH |
`,
    },
    "code-review": {
      files: ["coding-style.md"],
      extra: `# Code Review Mode Rules

## Confidence-Based Filtering
- Report only if >80% confident it's a real issue
- Skip stylistic preferences unless they violate project conventions
- Consolidate similar issues into one finding
- Prioritize: Security > Correctness > Performance > Style

## Review Checklist Priority
1. **CRITICAL** — Security vulnerabilities, data loss risks
2. **HIGH** — Logic bugs, missing error handling, race conditions
3. **MEDIUM** — Performance issues, missing tests, code complexity
4. **LOW** — Naming, formatting, minor style issues

## Process
1. Run git diff to see all changes
2. Read full files for context (not just changed lines)
3. Check imports, dependencies, and call sites
4. Apply checklist top-down by severity
`,
    },
    "docs-writer": {
      files: [],
      extra: `# Documentation Mode Rules

## Documentation Standards
- Use clear, concise language
- Include code examples for complex concepts
- Keep README in sync with actual project structure
- Update API docs when endpoints change
- Maintain CHANGELOG for user-facing changes

## File Restrictions
This mode can ONLY edit documentation files:
- Markdown (.md, .mdx)
- Plain text (.txt)
- reStructuredText (.rst)

## Codemap Updates
When project structure changes:
1. Update directory tree in README
2. Update architecture diagrams
3. Sync API reference documentation
4. Verify all internal links work
`,
    },
    database: {
      files: [],
      extra: `# Database Mode Rules

## Schema Design
- Use proper normalization (3NF minimum)
- Always define primary keys and foreign keys
- Add indexes for frequently queried columns
- Use appropriate data types (don't store numbers as text)
- Add constraints (NOT NULL, UNIQUE, CHECK) at database level

## Query Optimization
- Always use EXPLAIN ANALYZE for complex queries
- Prefer JOINs over subqueries when possible
- Use parameterized queries ALWAYS (never string concatenation)
- Add pagination for list endpoints
- Use connection pooling (PgBouncer/HikariCP)

## Migration Safety
- Never drop columns in production without deprecation period
- Always make migrations reversible
- Test migrations on a copy of production data
- Use transactions for multi-step migrations
- Verify no data loss after each migration

## Security
- Enable Row Level Security (RLS) policies
- Use least-privilege database roles
- Audit all DDL changes
- Encrypt sensitive columns at rest
`,
    },
  };

  let count = 0;
  const commonDir = join(ROOT, "rules", "common");

  for (const [mode, config] of Object.entries(modeRules)) {
    const ruleDir = join(ROOT, ".kilo", `rules-${mode}`);
    ensureDir(ruleDir);

    // Copy relevant common rules
    for (const file of config.files) {
      const src = join(commonDir, file);
      if (existsSync(src)) {
        copyFileSync(src, join(ruleDir, file));
      }
    }

    // Write mode-specific extra rules
    if (config.extra) {
      writeFileSync(join(ruleDir, `${mode}-rules.md`), config.extra, "utf-8");
    }

    count++;
  }

  console.log(`✓ Generated ${count} mode-specific rule directories → .kilo/rules-{mode}/`);
}

// ─── 8. Generate .kilocodemodes ─────────────────────────────────────────────

function generateModes() {
  const modesYaml = `# Claude Fulcrum Custom Modes for Kilo Code
# These modes map the primary agent roles from Claude Fulcrum

customModes:
  # ─── Architect Mode ──────────────────────────────────────
  - slug: architect
    name: "\uD83C\uDFD7\uFE0F Architect"
    description: System design, scalability analysis, and architectural decisions
    roleDefinition: >-
      You are a senior software architect specializing in scalable, maintainable
      system design. You analyze requirements, evaluate trade-offs, recommend
      patterns, identify scalability bottlenecks, and plan for future growth.
      You design system architecture for new features and ensure consistency
      across the codebase.
    whenToUse: >-
      Use when planning new features, refactoring large systems, making
      architectural decisions, designing APIs, or evaluating technology choices.
    customInstructions: |-
      Follow these principles:
      - Modularity & Separation of Concerns (SRP, high cohesion, low coupling)
      - Horizontal scalability, stateless design, caching strategies
      - Repository pattern for data access
      - Consistent API response envelope format
      - Document trade-offs for every design decision (Pros/Cons/Alternatives/Decision)
      - Immutability: always create new objects, never mutate
    groups:
      - read
      - browser
      - mcp

  # ─── Planner Mode ────────────────────────────────────────
  - slug: planner
    name: "\uD83D\uDCCB Planner"
    description: Implementation planning for complex features and refactoring
    roleDefinition: >-
      You are an expert planning specialist focused on creating comprehensive,
      actionable implementation plans. You analyze requirements, break down
      complex features into manageable steps, identify dependencies and risks,
      and suggest optimal implementation order.
    whenToUse: >-
      Use for complex feature requests, architectural changes, multi-file
      refactoring, or any task that benefits from structured planning before
      coding.
    customInstructions: |-
      Planning process:
      1. Requirements Analysis — understand fully, clarify, list assumptions
      2. Architecture Review — analyze existing structure, identify patterns
      3. Step Breakdown — specific actions, file paths, dependencies, complexity, risks
      4. Implementation Order — prioritize by dependencies, group related changes
      Output format: Implementation Plan with Overview, Requirements, Architecture Changes, Steps, Risks
    groups:
      - read
      - browser
      - mcp

  # ─── TDD Mode ────────────────────────────────────────────
  - slug: tdd
    name: "\uD83E\uDDEA TDD Guide"
    description: Test-driven development with write-tests-first methodology
    roleDefinition: >-
      You are a Test-Driven Development specialist who ensures all code is
      developed test-first with comprehensive coverage. You enforce the
      Red-Green-Refactor cycle and ensure 80%+ test coverage across unit,
      integration, and E2E tests.
    whenToUse: >-
      Use when writing new features, fixing bugs, refactoring code, or any task
      that requires tests. Always write tests before implementation.
    customInstructions: |-
      TDD Workflow (MANDATORY):
      1. Write test first (RED) — describe expected behavior
      2. Run test — verify it FAILS
      3. Write minimal implementation (GREEN)
      4. Run test — verify it PASSES
      5. Refactor (IMPROVE) — tests must stay green
      6. Verify coverage (80%+)

      Edge cases to ALWAYS test: null/undefined, empty arrays/strings, invalid types,
      boundary values, error paths, race conditions, large data, special characters.
    groups:
      - read
      - edit
      - command
      - mcp

  # ─── Security Review Mode ────────────────────────────────
  - slug: security-review
    name: "\uD83D\uDD12 Security Reviewer"
    description: Security vulnerability detection and OWASP Top 10 analysis
    roleDefinition: >-
      You are an expert security specialist focused on identifying and
      remediating vulnerabilities in web applications. You detect OWASP Top 10
      issues, find hardcoded secrets, verify input validation, check
      authentication/authorization, and enforce secure coding patterns.
    whenToUse: >-
      Use after writing code that handles user input, authentication, API
      endpoints, sensitive data, payments, or file uploads.
    customInstructions: |-
      OWASP Top 10 checklist:
      1. Injection — parameterized queries, sanitized input
      2. Broken Auth — passwords hashed, JWT validated, sessions secure
      3. Sensitive Data — HTTPS enforced, secrets in env vars, PII encrypted
      4. XXE — XML parsers configured securely
      5. Broken Access — auth on every route, CORS configured
      6. Misconfiguration — no default creds, debug off in prod
      7. XSS — output escaped, CSP set
      8. Insecure Deserialization — safe deserialization
      9. Known Vulnerabilities — dependencies up to date
      10. Insufficient Logging — security events logged

      Flag immediately: hardcoded secrets, shell commands with user input,
      string-concatenated SQL, innerHTML with user input, no auth on routes.
    groups:
      - read
      - browser
      - command
      - mcp

  # ─── Code Review Mode ────────────────────────────────────
  - slug: code-review
    name: "\uD83D\uDD0D Code Reviewer"
    description: Code quality, security, and maintainability review
    roleDefinition: >-
      You are a senior code reviewer ensuring high standards of code quality
      and security. You analyze diffs, understand context, apply review
      checklists, and report findings with confidence-based filtering.
    whenToUse: >-
      Use immediately after writing or modifying code. Apply for all code
      changes before committing.
    customInstructions: |-
      Review process:
      1. Gather context — check git diff, understand scope
      2. Read surrounding code — don't review in isolation
      3. Apply checklist — Security (CRITICAL), Correctness (HIGH), Performance (MEDIUM), Style (LOW)
      4. Report findings — only >80% confidence issues

      Confidence-based filtering:
      - Report if >80% confident it's real
      - Skip stylistic preferences unless project conventions violated
      - Consolidate similar issues
      - Prioritize bugs, security, data loss risks
    groups:
      - read
      - command
      - mcp

  # ─── Documentation Mode ──────────────────────────────────
  - slug: docs-writer
    name: "\uD83D\uDCDD Documentation"
    description: Documentation writing, codemap maintenance, and README updates
    roleDefinition: >-
      You are a documentation specialist focused on maintaining accurate,
      comprehensive project documentation. You update codemaps, generate API
      references, and keep README and guides in sync with the codebase.
    whenToUse: >-
      Use for writing documentation, updating READMEs, generating API docs,
      maintaining codemaps, or any documentation task.
    customInstructions: |-
      Focus on:
      - Clear explanations with proper structure
      - Code examples where helpful
      - Keep docs in sync with actual code
      - Update architectural diagrams when structure changes
    groups:
      - read
      - - edit
        - fileRegex: \\.(md|mdx|txt|rst)$
          description: Documentation files only
      - command
      - mcp

  # ─── Database Mode ───────────────────────────────────────
  - slug: database
    name: "\uD83D\uDDC3\uFE0F Database"
    description: PostgreSQL schema design, query optimization, and migrations
    roleDefinition: >-
      You are a PostgreSQL database specialist focused on query optimization,
      schema design, security hardening, and performance tuning. You apply
      Supabase best practices and ensure data integrity.
    whenToUse: >-
      Use when writing SQL, creating migrations, designing schemas, optimizing
      queries, or troubleshooting database performance issues.
    customInstructions: |-
      Focus on:
      - Proper indexing strategies
      - Query optimization (EXPLAIN ANALYZE)
      - Schema normalization
      - Row-level security policies
      - Migration safety (no data loss)
      - Connection pooling best practices
    groups:
      - read
      - edit
      - command
      - mcp
`;

  writeFileSync(join(ROOT, ".kilocodemodes"), modesYaml, "utf-8");
  console.log("✓ Generated .kilocodemodes with 7 custom modes");
}

// ─── 6. Generate kilo.json ──────────────────────────────────────────────────

function generateKiloJson() {
  const config = {
    $schema: "https://app.kilo.ai/config.json",

    // Global project settings
    preferredLanguage: "en",

    // Agent overrides and custom agents
    agent: {
      // Override built-in explore agent for faster model
      explore: {
        model: "anthropic/claude-haiku-4-20250514",
      },

      // Key custom subagents (supplement the .kilo/agents/ markdown files)
      orchestrator: {
        mode: "primary",
        description: "Orchestrates complex multi-step workflows by delegating to specialized subagents",
        permission: {
          task: {
            "*": "allow",
          },
        },
      },
    },
  };

  writeFileSync(join(ROOT, "kilo.json"), JSON.stringify(config, null, 2) + "\n", "utf-8");
  console.log("✓ Generated kilo.json project config");
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  Claude Fulcrum → Kilo Code Converter        ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  convertAgents();
  convertCommonRules();
  convertLanguageRules();
  convertSkills();
  convertWorkflows();
  generateModeRules();
  generateKilocodeignore();
  generateModes();
  generateKiloJson();

  console.log("");
  console.log("═══ Integration Complete ═══");
  console.log("");
  console.log("Generated structure:");
  console.log("  .kilo/agents/          ← 26 subagents");
  console.log("  .kilo/rules-{mode}/    ← 7 mode-specific rule directories");
  console.log("  .kilocode/rules/       ← Common project rules");
  console.log("  .kilocode/rules-code/  ← Language-specific rules (code mode)");
  console.log("  .kilocode/skills/      ← 122+ portable skills");
  console.log("  .kilocode/workflows/   ← 66 workflow commands");
  console.log("  .kilocodemodes         ← 7 primary custom modes");
  console.log("  .kilocodeignore        ← File exclusion patterns");
  console.log("  kilo.json              ← Project configuration");
  console.log("");
  console.log("Next steps:");
  console.log("  1. Reload VS Code to load Kilo Code configuration");
  console.log("  2. Open Kilo Code panel → verify modes appear");
  console.log("  3. Test: @code-reviewer, @security-reviewer, @planner");
  console.log("  4. Switch modes: Architect, TDD, Security Review");
  console.log("  5. Try workflows: /tdd, /plan, /code-review, /build-fix");
}

main();
