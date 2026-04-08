# Memory Search

Run bounded memory search against canonical SQLite observations and return a synthesized result instead of raw dumps.

## Usage

`/memory-search <query>`

Runtime helper:

`node scripts/memory/search-orchestrator.js <query>`

Current retrieval modes in the runtime helper:

- `search`: ranked seed hits only
- `expand`: seed hits plus linked-note neighbors
- `timeline`: session or attempt timeline slices
- `drill_in`: focus entry plus supporting timeline context

The runtime now also exposes a stable retrieval request/response contract and an isolated worker boundary:

- request envelope: query, mode, session/attempt scope, focus entry, token budget, execution preference
- response envelope: synthesized result plus execution metadata
- isolated execution path: `scripts/memory/retrieval-worker.js`
- orchestration artifacts: `.orchestration/memory-retrieval/<request-id>/{task,handoff,status}.md`
- inspect target: `node scripts/session-inspect.js memory:<request-id>`
- fallback behavior: when subprocess isolation is blocked, the request degrades to an in-process fallback and records that in execution metadata
- ranking behavior: fused lexical, recency, and structure signals via reciprocal-rank-style blending before neighbor expansion
- delegated-return behavior: the isolated/delegated boundary now returns summary-only parent payloads and writes full retrieval detail to `.orchestration/memory-retrieval/<request-id>/response.json`

## Notes

- parent context payload is capped
- transcript anchors are references, not transcript body dumps
- linked notes may be expanded when the seed hit has graph edges
- detailed timeline/drill-in data stays in the retrieval artifact, not the parent payload
