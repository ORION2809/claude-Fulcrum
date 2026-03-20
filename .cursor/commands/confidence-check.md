# Confidence Check

Evaluate whether the current task is ready for execution using requirement clarity, prior-mistake detection, and context readiness.

## Usage

`/confidence-check [task summary]`

Runtime helper:

`node scripts/quality/confidence-gate.js "implement bounded memory recall synthesis"`

## Output

- score from `0.0` to `1.0`
- blockers
- recommendations
- triple reflection log
