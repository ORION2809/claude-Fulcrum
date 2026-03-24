# Attempt

Create, inspect, or compare isolated attempts that bind branch, worktree, memory fork, and telemetry together.

## Usage

`/attempt create <name>` — Create a new isolated attempt with its own branch, worktree, and memory fork.
`/attempt status` — Show status of the current or all active attempts.
`/attempt compare <task>` — Run the same task in parallel across multiple workers (implementer, reviewer, tester) using tmux worktrees, then diff their outputs and generate a comparison report.
`/attempt compare <task> --workers <n>` — Specify the number of parallel workers (default: 3).

## Compare Mode

The `/attempt compare` subcommand leverages the tmux-worktree-orchestrator to:

1. **Plan** — Build an orchestration plan with N workers, each assigned the same task but with different personas (implementer, reviewer, tester).
2. **Execute** — Materialize git worktrees, spawn tmux panes, and run each worker in isolation.
3. **Diff** — After all workers complete, collect their outputs and generate a side-by-side comparison.
4. **Report** — Write a comparison report to `.orchestration/compare-reports/`.

### Example

```
/attempt compare "implement rate limiting for the /api/users endpoint"
```

This creates 3 parallel workers, each approaching the task from a different angle, then produces a unified comparison report showing differing approaches, test coverage, and quality scores.
