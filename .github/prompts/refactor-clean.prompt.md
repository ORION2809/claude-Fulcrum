---
description: "Safely identify and remove dead code using analysis tools, with test verification at every step."
mode: "agent"
---

# Refactor Clean

Safely identify and remove dead code with test verification at every deletion.

## Step 1: Detect Dead Code

| Tool | Language | Command |
|------|----------|---------|
| knip | JS/TS | `npx knip` |
| depcheck | Node.js | `npx depcheck` |
| ts-prune | TypeScript | `npx ts-prune` |
| vulture | Python | `vulture src/` |
| deadcode | Go | `deadcode ./...` |
| cargo-udeps | Rust | `cargo +nightly udeps` |

## Step 2: Categorize by Safety Tier

| Tier | Examples | Action |
|------|----------|--------|
| **SAFE** | Unused utilities, test helpers, internal functions | Delete with confidence |
| **CAUTION** | Components, API routes, middleware | Verify no dynamic imports first |
| **DANGER** | Config files, entry points, type definitions | Investigate before touching |

## Step 3: Safe Deletion Loop

For each SAFE item:
1. Run full test suite — establish baseline (all green)
2. Delete the dead code
3. Re-run test suite — verify nothing broke
4. If tests fail — immediately revert and skip
5. If tests pass — move to next item

## Step 4: CAUTION Items
Before deleting, search for:
- Dynamic imports: `import()`, `require()`, `__import__`
- String references in configs or route tables
- Public package API exports

{{{ input }}}
