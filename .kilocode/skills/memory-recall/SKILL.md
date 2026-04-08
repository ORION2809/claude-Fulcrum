---
name: memory-recall
description: Progressive memory retrieval with search, expand, and drill-in stages.
---

# Memory Recall

Use bounded retrieval:

1. Search recent observations.
2. Expand only related items when needed.
3. Drill into transcript anchors only as a last resort.

Current runtime support:

- `search`: seed-only ranked hits
- `expand`: linked-note expansion
- `timeline`: session or attempt memory slices
- `drill_in`: focus entry plus local timeline context

Current execution contract:

- build a retrieval request envelope first
- preserve `preferIsolated` in the request and route through the retrieval worker when available
- fall back to in-process execution with explicit metadata when subprocess isolation is unavailable
- write orchestration-style `task.md`, `handoff.md`, and `status.md` artifacts for isolated retrieval runs
- write the full retrieval response to `response.json` inside the retrieval artifact directory
- return synthesized output to parent context instead of raw memory dumps
- prefer fused ranking across lexical coverage, recency, and structure signals before expanding graph neighbors
