---
description: "Analyze the blast radius of code changes using the knowledge graph. Shows all impacted files, functions, and dependency chains."
mode: "agent"
---

# Code Graph Impact Analysis

Analyze the blast radius of recent code changes using the knowledge graph.

## Steps

1. Ensure graph is current:
   ```bash
   code-review-graph update
   ```

2. Get the impact radius:
   ```bash
   code-review-graph impact
   ```

3. For each high-impact change, trace the dependency chain:
   - Direct callers of changed functions
   - Transitive dependents (2-hop neighbors)
   - Inheritance chain effects
   - Import graph impact

4. Report:
   ```markdown
   ## Impact Analysis

   ### Changed Files
   - file_path (N functions changed)

   ### Blast Radius
   - X files impacted
   - Y functions affected
   - Z test files need verification

   ### High-Risk Changes
   | Function | Direct Callers | Transitive Impact |
   |----------|---------------|-------------------|
   | name | N | M |

   ### Recommended Actions
   1. Verify these callers still work: [list]
   2. Add tests for: [list]
   3. Check these inheritors: [list]
   ```

{{{ input }}}
