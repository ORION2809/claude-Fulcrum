---
description: "Analyze a draft prompt and output an optimized version. Does NOT execute the task — produces advisory analysis only with recommended agents, skills, and workflow."
agent: "agent"
---

# Prompt Optimize

Analyze the user's prompt and output an optimized, enriched version ready to use.

## Analysis Pipeline

1. **Intent Detection** — Classify: new feature, bug fix, refactor, research, testing, review, docs, infrastructure, design
2. **Scope Assessment** — Rate complexity: TRIVIAL / LOW / MEDIUM / HIGH / EPIC
3. **Component Matching** — Map to appropriate agents, skills, and workflow patterns
4. **Missing Context Detection** — Identify gaps; if 3+ critical items missing, ask for clarification
5. **Workflow Recommendation** — Determine lifecycle position and split into multiple prompts if HIGH/EPIC

## Output

Provide:
- **Diagnosis** — Intent, scope, and recommended approach
- **Full Version** — Detailed optimized prompt with all context
- **Quick Version** — Compact version for simple execution

## Rules
- Do NOT execute the task — output analysis and optimized prompt only
- Respond in the same language as the user's input
- The optimized prompt must be complete and ready to copy-paste
- End with options for adjusting the output

{{{ input }}}
