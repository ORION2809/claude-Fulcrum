# Code Graph Impact

Analyze the blast radius of code changes using the knowledge graph.

1. **Update graph** — `build_or_update_graph_tool()` (incremental update)

2. **Get impact radius** — `get_impact_radius_tool()` returns:
   - Changed files and functions
   - Directly impacted callers
   - Transitively impacted files (2-hop neighbors)
   - Risk-ranked list of affected areas

3. **For each high-impact change**, trace:
   - `query_graph_tool(pattern="callers_of", target=<func>)` — Direct callers
   - `query_graph_tool(pattern="inheritors_of", target=<class>)` — Inheritance chain
   - `query_graph_tool(pattern="importers_of", target=<module>)` — Import graph
   - `query_graph_tool(pattern="tests_for", target=<func>)` — Test coverage

4. **Report**:
   ```markdown
   ## Impact Analysis

   ### Changed Files
   - file_path (N functions changed)

   ### Blast Radius
   - X files impacted, Y functions affected

   ### High-Risk Changes
   | Function | Direct Callers | Transitive Impact | Tests |
   |----------|---------------|-------------------|-------|
   | name | N | M | ✓/✗ |

   ### Recommended Actions
   1. Verify callers: [list]
   2. Add tests for: [list]
   3. Check inheritors: [list]
   ```

$ARGUMENTS
