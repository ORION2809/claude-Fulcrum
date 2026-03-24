'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStateStore } = require('../../scripts/lib/state-store');
const {
  buildRetrievalArtifacts,
  buildRetrievalCoordinationDir,
  buildRetrievalRequest,
  buildAwarenessHint,
  buildSessionStartRetrievalQuery,
  buildParentContextPayload,
  buildSynthesis,
  computeHybridScore,
  computeReciprocalRankFusion,
  executeRetrievalRequest,
  expandLinkedEntries,
  formatRetrievalResponse,
  getRetrievalWorkerScriptPath,
  normalizeQueryTerms,
  rankEntries,
  scoreEntry,
  searchMemory,
} = require('../../scripts/memory/search-orchestrator');

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

console.log('\nMemory Search Tests');
console.log('===================\n');

let passed = 0;
let failed = 0;

if (test('scores entries using title, summary, keywords, and tags', () => {
  const score = scoreEntry(['memory', 'governance'], {
    title: 'Memory checkpoint',
    summary: 'Added governance enforcement',
    keywords: ['memory', 'quality'],
    tags: ['checkpoint'],
  });

  assert.ok(score >= 3);
})) passed += 1; else failed += 1;

if (test('returns zero score for non-matching entries', () => {
  const score = scoreEntry(['vector'], {
    title: 'Session checkpoint',
    summary: 'Updated governance events',
    keywords: ['memory'],
    tags: ['checkpoint'],
  });

  assert.strictEqual(score, 0);
})) passed += 1; else failed += 1;

if (test('hybrid scoring rewards lexical matches plus recency and graph hints', () => {
  const score = computeHybridScore(['memory', 'budget'], {
    title: 'Memory budget retrieval',
    summary: 'Bound retrieval payload and expand linked notes.',
    keywords: ['memory', 'timeline'],
    tags: ['budget'],
    relationship: 'related_to',
    createdAt: '2026-03-18T00:00:00.000Z',
  }, {
    now: '2026-03-18T00:10:00.000Z',
  });

  assert.ok(score > 4);
})) passed += 1; else failed += 1;

if (test('reciprocal rank fusion rewards entries that rank well across signals', () => {
  const scores = computeReciprocalRankFusion([
    [{ id: 'note-a' }, { id: 'note-b' }],
    [{ id: 'note-a' }, { id: 'note-c' }],
    [{ id: 'note-b' }, { id: 'note-a' }],
  ]);

  assert.ok(scores.get('note-a') > scores.get('note-b'));
  assert.ok(scores.get('note-b') > scores.get('note-c'));
})) passed += 1; else failed += 1;

if (test('ranked retrieval prefers stronger lexical coverage over freshness alone', () => {
  const ranked = rankEntries([
    {
      kind: 'note',
      id: 'note-lexical',
      title: 'Memory budget retrieval',
      summary: 'Bound retrieval payload and narrow parent context.',
      keywords: ['memory', 'budget', 'retrieval'],
      tags: ['memory'],
      relationship: 'seed',
      createdAt: '2026-03-10T00:00:00.000Z',
    },
    {
      kind: 'note',
      id: 'note-recent',
      title: 'Recent checkpoint',
      summary: 'Memory work progressed today.',
      keywords: ['checkpoint'],
      tags: ['recent'],
      relationship: 'seed',
      createdAt: '2026-03-18T00:09:00.000Z',
    },
  ], normalizeQueryTerms('memory budget'), {
    now: '2026-03-18T00:10:00.000Z',
  });

  assert.strictEqual(ranked[0].id, 'note-lexical');
  assert.ok(ranked[0].score > ranked[1].score);
})) passed += 1; else failed += 1;

if (test('expands linked notes without duplicating the seed entries', () => {
  const expanded = expandLinkedEntries({
    entries: [
      { kind: 'note', id: 'note-a', title: 'Retrieval budget', summary: 'Bound parent payload', score: 5 },
    ],
    noteIndex: new Map([
      ['note-a', { kind: 'note', id: 'note-a', title: 'Retrieval budget', summary: 'Bound parent payload' }],
      ['note-b', { kind: 'note', id: 'note-b', title: 'Context warnings', summary: 'Warn at 70 percent budget' }],
    ]),
    linksByNoteId: new Map([
      ['note-a', [{ fromNoteId: 'note-a', toNoteId: 'note-b', linkType: 'related_to', weight: 0.9 }]],
    ]),
    maxNeighbors: 2,
  });

  assert.strictEqual(expanded.length, 2);
  assert.strictEqual(expanded[1].id, 'note-b');
  assert.strictEqual(expanded[1].relationship, 'related_to');
  assert.ok(expanded[1].score < expanded[0].score);
})) passed += 1; else failed += 1;

if (test('builds a bounded synthesized response for parent context', () => {
  const synthesis = buildSynthesis('memory budget', [
    {
      kind: 'note',
      id: 'note-a',
      title: 'Retrieval budget',
      summary: 'Bound parent payload to 500 tokens.',
      score: 6,
      relationship: 'seed',
    },
    {
      kind: 'note',
      id: 'note-b',
      title: 'Context warning',
      summary: 'Emit a warning near 70 percent context usage.',
      score: 4,
      relationship: 'related_to',
    },
  ], { parentTokenBudget: 40 });

  assert.strictEqual(synthesis.query, 'memory budget');
  assert.strictEqual(synthesis.results.length, 2);
  assert.ok(synthesis.summary.includes('Retrieval budget'));
  assert.ok(synthesis.summary.length <= 160);
  assert.ok(synthesis.budget.estimatedTokens <= 40);
})) passed += 1; else failed += 1;

if (test('builds a summary-only parent payload from detailed retrieval output', () => {
  const parentPayload = buildParentContextPayload({
    query: 'memory budget',
    mode: 'expand',
    summary: 'Retrieval budget: Bound parent payload. | Context warning: Emit warning.',
    budget: {
      parentTokenBudget: 40,
      estimatedTokens: 18,
    },
    results: [
      {
        kind: 'note',
        id: 'note-a',
        title: 'Retrieval budget',
        summary: 'Bound parent payload.',
        relationship: 'seed',
        sessionId: 'session-a',
        attemptId: 'attempt-a',
      },
      {
        kind: 'note',
        id: 'note-b',
        title: 'Context warning',
        summary: 'Emit warning.',
        relationship: 'related_to',
        sessionId: 'session-a',
        attemptId: 'attempt-a',
      },
    ],
    details: [{ id: 'note-a' }],
    timeline: [{ id: 'note-a' }],
  });

  assert.strictEqual(parentPayload.query, 'memory budget');
  assert.strictEqual(parentPayload.sources.length, 2);
  assert.strictEqual(parentPayload.sources[0].id, 'note-a');
  assert.strictEqual(parentPayload.detailCount, 2);
  assert.strictEqual(parentPayload.details, undefined);
  assert.strictEqual(parentPayload.timeline, undefined);
})) passed += 1; else failed += 1;

if (test('formats search-stage retrieval without expanding neighbors', () => {
  const response = formatRetrievalResponse('memory budget', [
    {
      kind: 'note',
      id: 'note-a',
      title: 'Retrieval budget',
      summary: 'Bound parent payload to 500 tokens.',
      score: 6,
      relationship: 'seed',
    },
    {
      kind: 'note',
      id: 'note-b',
      title: 'Linked budget warning',
      summary: 'Warn near context threshold.',
      score: 5,
      relationship: 'related_to',
    },
  ], { mode: 'search', parentTokenBudget: 40 });

  assert.strictEqual(response.mode, 'search');
  assert.strictEqual(response.results.length, 1);
  assert.strictEqual(response.results[0].id, 'note-a');
})) passed += 1; else failed += 1;

async function verifyGraphExpansionInSearchMemory() {
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-search-memory-'));
  const store = await createStateStore({ homeDir });

  try {
    store.insertMemoryNote({
      id: 'note-seed',
      sessionId: 'session-graph',
      attemptId: null,
      category: 'auth-debug',
      content: 'Refresh token bug in auth flow',
      summary: 'Debugged refresh token failure in auth flow.',
      tags: ['auth', 'debug'],
      keywords: ['refresh', 'token', 'auth', 'bug'],
      links: [],
      retrievalMetadata: {},
      evolutionHistory: [],
      createdAt: '2026-03-24T11:50:00.000Z',
      accessedAt: '2026-03-24T11:50:00.000Z',
    });
    store.insertMemoryNote({
      id: 'note-neighbor',
      sessionId: 'session-graph',
      attemptId: null,
      category: 'auth-architecture',
      content: 'Rotation settings captured in a later review.',
      summary: 'Follow-up note about rotation settings.',
      tags: ['ops', 'architecture'],
      keywords: ['rotation', 'settings', 'review'],
      links: [],
      retrievalMetadata: {},
      evolutionHistory: [],
      createdAt: '2026-03-20T11:50:00.000Z',
      accessedAt: '2026-03-20T11:50:00.000Z',
    });
    store.insertMemoryLink({
      id: 'link-seed-neighbor',
      fromNoteId: 'note-seed',
      toNoteId: 'note-neighbor',
      linkType: 'depends_on',
      weight: 0.95,
      metadata: { reason: 'Refresh flow depends on rotation settings.' },
      createdAt: '2026-03-24T11:55:00.000Z',
    });

    const response = await searchMemory('auth refresh dependency', {
      dbPath: store.dbPath,
      mode: 'expand',
      limit: 1,
      maxNeighbors: 2,
      now: '2026-03-24T12:00:00.000Z',
    });

    assert.ok(response.results.some(entry => entry.id === 'note-seed'));
    assert.ok(response.results.some(entry => entry.id === 'note-neighbor'));
    const neighbor = response.results.find(entry => entry.id === 'note-neighbor');
    assert.strictEqual(neighbor.relationship, 'depends_on');
  } finally {
    store.close();
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

async function verifyBoundedSearchModeInSearchMemory() {
  const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-search-mode-'));
  const store = await createStateStore({ homeDir });

  try {
    store.insertMemoryNote({
      id: 'note-seed',
      sessionId: 'session-search',
      attemptId: null,
      category: 'memory-recall',
      content: 'Retrieval budget for memory search',
      summary: 'Bound retrieval payload in parent context.',
      tags: ['memory'],
      keywords: ['retrieval', 'budget', 'memory'],
      links: [],
      retrievalMetadata: {},
      evolutionHistory: [],
      createdAt: '2026-03-24T11:58:00.000Z',
      accessedAt: '2026-03-24T11:58:00.000Z',
    });
    store.insertMemoryNote({
      id: 'note-neighbor',
      sessionId: 'session-search',
      attemptId: null,
      category: 'memory-graph',
      content: 'Linked note for graph expansion',
      summary: 'Neighbor note should stay out of search-only parent payload.',
      tags: ['graph'],
      keywords: ['expansion', 'neighbor'],
      links: [],
      retrievalMetadata: {},
      evolutionHistory: [],
      createdAt: '2026-03-24T11:40:00.000Z',
      accessedAt: '2026-03-24T11:40:00.000Z',
    });
    store.insertMemoryLink({
      id: 'link-search-mode',
      fromNoteId: 'note-seed',
      toNoteId: 'note-neighbor',
      linkType: 'related_to',
      weight: 0.9,
      metadata: {},
      createdAt: '2026-03-24T11:59:00.000Z',
    });

    const response = await searchMemory('retrieval budget memory', {
      dbPath: store.dbPath,
      mode: 'search',
      limit: 1,
      maxNeighbors: 2,
      now: '2026-03-24T12:00:00.000Z',
    });

    assert.ok(response.results.some(entry => entry.id === 'note-seed'));
    assert.ok(response.results.every(entry => (entry.relationship || 'seed') === 'seed'));
  } finally {
    store.close();
    fs.rmSync(homeDir, { recursive: true, force: true });
  }
}

if (test('builds a compact awareness hint for session start', () => {
  const hint = buildAwarenessHint([
    {
      kind: 'note',
      id: 'note-a',
      title: 'Retrieval budget',
      summary: 'Bound parent payload to 500 tokens.',
      score: 4,
      relationship: 'seed',
    },
    {
      kind: 'observation',
      id: 'obs-a',
      title: 'Memory graph',
      summary: 'Link related notes when keywords overlap.',
      score: 3,
      relationship: 'seed',
    },
  ], { parentTokenBudget: 30 });

  assert.ok(hint.startsWith('Memory available: '));
  assert.ok(hint.includes('Retrieval budget'));
  assert.ok(hint.length <= 120);
})) passed += 1; else failed += 1;

if (test('builds a bounded retrieval query for session-start memory recall', () => {
  const query = buildSessionStartRetrievalQuery([
    {
      kind: 'note',
      id: 'note-a',
      title: 'memory-recall',
      summary: 'Bound retrieval payload for TypeScript memory search.',
      keywords: ['retrieval', 'payload', 'memory'],
    },
    {
      kind: 'observation',
      id: 'obs-a',
      title: 'search orchestrator',
      summary: 'Use isolated worker execution when available.',
      keywords: [],
    },
  ], {
    languages: ['TypeScript'],
    frameworks: ['Node.js'],
  }, {
    maxTerms: 6,
  });

  assert.ok(query.includes('retrieval'));
  assert.ok(query.includes('typescript'));
  assert.ok(query.split(/\s+/).length <= 6);
})) passed += 1; else failed += 1;

if (test('builds a retrieval request envelope for future isolated workers', () => {
  const request = buildRetrievalRequest('memory timeline', {
    mode: 'drill_in',
    sessionId: 'session-memory',
    attemptId: 'attempt-memory',
    focusEntryId: 'note-memory',
    preferIsolated: true,
    parentTokenBudget: 80,
  });

  assert.strictEqual(request.query, 'memory timeline');
  assert.strictEqual(request.mode, 'drill_in');
  assert.strictEqual(request.sessionId, 'session-memory');
  assert.strictEqual(request.execution.preferIsolated, true);
  assert.strictEqual(request.budget.parentTokenBudget, 80);
})) passed += 1; else failed += 1;

if (test('resolves a retrieval worker script path inside scripts/memory', () => {
  const workerPath = getRetrievalWorkerScriptPath();
  assert.ok(workerPath.endsWith(path.join('scripts', 'memory', 'retrieval-worker.js')));
})) passed += 1; else failed += 1;

if (test('builds orchestration-style retrieval artifact files', () => {
  const request = buildRetrievalRequest('memory budget', {
    sessionId: 'session-memory',
    preferIsolated: true,
  });
  const coordinationDir = buildRetrievalCoordinationDir(request, {
    coordinationRoot: path.join(process.cwd(), '.orchestration'),
  });
  const artifacts = buildRetrievalArtifacts(request, coordinationDir);

  assert.ok(artifacts.dir.endsWith(path.join('memory-retrieval', request.id)));
  assert.ok(artifacts.files.some(file => file.path.endsWith(path.join(request.id, 'task.md'))));
  assert.ok(artifacts.files.some(file => file.path.endsWith(path.join(request.id, 'handoff.md'))));
  assert.ok(artifacts.files.some(file => file.path.endsWith(path.join(request.id, 'status.md'))));
})) passed += 1; else failed += 1;

async function main() {
  if (await asyncTest('searchMemory expands graph-linked notes in expand mode', verifyGraphExpansionInSearchMemory)) passed += 1; else failed += 1;

  if (await asyncTest('searchMemory keeps parent search mode bounded to seed entries', verifyBoundedSearchModeInSearchMemory)) passed += 1; else failed += 1;

  if (await asyncTest('supports timeline and drill-in retrieval against the state store', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-memory-search-'));
    const store = await createStateStore({ homeDir });
    const dbPath = store.dbPath;

    try {
      store.upsertSession({
        id: 'session-memory',
        adapterId: 'local',
        harness: 'local',
        state: 'active',
        repoRoot: process.cwd(),
        startedAt: '2026-03-18T00:00:00.000Z',
        endedAt: null,
        snapshot: { workers: [] },
      });
      store.upsertAttempt({
        id: 'attempt-memory',
        sessionId: 'session-memory',
        parentAttemptId: null,
        branchName: 'attempt/memory',
        worktreePath: process.cwd(),
        status: 'running',
        metadata: {},
        createdAt: '2026-03-18T00:00:00.000Z',
        updatedAt: '2026-03-18T00:00:00.000Z',
      });
      store.insertObservation({
        id: 'obs-memory',
        sessionId: 'session-memory',
        attemptId: 'attempt-memory',
        sourceEvent: 'post_tool_use',
        title: 'Memory retrieval observation',
        summary: 'Added bounded retrieval summary and drill-in contract.',
        contentHash: 'hash-obs-memory',
        anchorRef: '/tmp/transcript.md#obs-memory',
        tags: ['memory', 'retrieval'],
        metadata: {},
        createdAt: '2026-03-18T00:00:01.000Z',
        lastAccessedAt: '2026-03-18T00:00:01.000Z',
      });
      store.insertMemoryNote({
        id: 'note-memory',
        sessionId: 'session-memory',
        attemptId: 'attempt-memory',
        category: 'memory-recall',
        content: 'Bound parent payload and support timeline drill-in.',
        summary: 'Bound parent payload and support timeline drill-in.',
        tags: ['memory', 'timeline'],
        keywords: ['memory', 'timeline', 'drill-in'],
        links: ['/tmp/transcript.md#note-memory'],
        retrievalMetadata: { contentHash: 'hash-note-memory' },
        evolutionHistory: [],
        createdAt: '2026-03-18T00:00:02.000Z',
        accessedAt: '2026-03-18T00:00:02.000Z',
      });

      const timeline = await searchMemory('memory timeline', {
        dbPath,
        mode: 'timeline',
        sessionId: 'session-memory',
        limit: 5,
      });
      const drillIn = await searchMemory('memory timeline', {
        dbPath,
        mode: 'drill_in',
        focusEntryId: 'note-memory',
        sessionId: 'session-memory',
        limit: 5,
      });

      assert.strictEqual(timeline.mode, 'timeline');
      assert.ok(timeline.timeline.length >= 2);
      assert.strictEqual(drillIn.mode, 'drill_in');
      assert.strictEqual(drillIn.focus.id, 'note-memory');
      assert.ok(drillIn.timeline.some(entry => entry.id === 'obs-memory'));
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('surfaces graph-linked and time-aware notes during expand retrieval', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-memory-graph-'));
    const store = await createStateStore({ homeDir });
    const dbPath = store.dbPath;

    try {
      store.upsertSession({
        id: 'session-graph',
        adapterId: 'local',
        harness: 'local',
        state: 'active',
        repoRoot: process.cwd(),
        startedAt: '2026-03-18T00:00:00.000Z',
        endedAt: null,
        snapshot: { workers: [] },
      });
      store.upsertAttempt({
        id: 'attempt-graph',
        sessionId: 'session-graph',
        parentAttemptId: null,
        branchName: 'attempt/graph',
        worktreePath: process.cwd(),
        status: 'running',
        metadata: {},
        createdAt: '2026-03-18T00:00:00.000Z',
        updatedAt: '2026-03-18T00:00:00.000Z',
      });
      store.insertMemoryNote({
        id: 'note-seed',
        sessionId: 'session-graph',
        attemptId: 'attempt-graph',
        category: 'memory-recall',
        content: 'Memory budget retrieval seed.',
        summary: 'Memory budget retrieval seed.',
        tags: ['memory', 'budget'],
        keywords: ['memory', 'budget', 'retrieval'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-03-18T00:00:01.000Z',
        accessedAt: '2026-03-18T00:00:01.000Z',
      });
      store.insertMemoryNote({
        id: 'note-linked',
        sessionId: 'session-graph',
        attemptId: 'attempt-graph',
        category: 'memory-link',
        content: 'Linked operational note that should surface through graph expansion.',
        summary: 'Linked operational note.',
        tags: ['ops'],
        keywords: ['linked', 'operational'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-03-18T00:00:02.000Z',
        accessedAt: '2026-03-18T00:00:02.000Z',
      });
      store.insertMemoryNote({
        id: 'note-deep',
        sessionId: 'session-graph',
        attemptId: 'attempt-graph',
        category: 'memory-deep',
        content: 'Deep evolved note that should surface through time-aware traversal.',
        summary: 'Deep evolved note.',
        tags: ['ops'],
        keywords: ['deep', 'evolved'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-03-18T00:00:03.000Z',
        accessedAt: '2026-03-18T00:00:03.000Z',
      });
      store.insertMemoryLink({
        id: 'link-seed-linked',
        fromNoteId: 'note-seed',
        toNoteId: 'note-linked',
        linkType: 'depends_on',
        weight: 1,
        metadata: {},
        createdAt: '2026-03-18T00:00:04.000Z',
      });
      store.insertMemoryLink({
        id: 'link-linked-deep',
        fromNoteId: 'note-linked',
        toNoteId: 'note-deep',
        linkType: 'evolved_from',
        weight: 1,
        metadata: {},
        createdAt: '2026-03-18T00:00:05.000Z',
      });

      const response = await searchMemory('memory budget retrieval', {
        dbPath,
        mode: 'expand',
        sessionId: 'session-graph',
        limit: 1,
        maxNeighbors: 2,
        maxDepth: 2,
      });

      assert.ok(response.results.some(entry => entry.id === 'note-seed'));
      assert.ok(response.results.some(entry => entry.id === 'note-linked'));
      assert.ok(response.results.some(entry => entry.id === 'note-deep'));
      assert.ok(response.results.some(entry => entry.relationship === 'depends_on'));
      assert.ok(response.results.some(entry => entry.relationship === 'evolved_from'));
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('executes retrieval requests and reports in-process execution metadata', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-memory-request-'));
    const store = await createStateStore({ homeDir });

    try {
      store.upsertSession({
        id: 'session-request',
        adapterId: 'local',
        harness: 'local',
        state: 'active',
        repoRoot: process.cwd(),
        startedAt: '2026-03-18T00:00:00.000Z',
        endedAt: null,
        snapshot: { workers: [] },
      });
      store.insertMemoryNote({
        id: 'note-request',
        sessionId: 'session-request',
        attemptId: null,
        category: 'memory-recall',
        content: 'Forked retrieval should start with a stable request envelope.',
        summary: 'Stable retrieval request envelope.',
        tags: ['memory', 'fork'],
        keywords: ['retrieval', 'envelope'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-03-18T00:00:02.000Z',
        accessedAt: '2026-03-18T00:00:02.000Z',
      });

      const request = buildRetrievalRequest('retrieval envelope', {
        dbPath: store.dbPath,
        sessionId: 'session-request',
        mode: 'search',
        preferIsolated: false,
      });
      const response = await executeRetrievalRequest(request);

      assert.strictEqual(response.request.id, request.id);
      assert.strictEqual(response.execution.kind, 'in_process');
      assert.strictEqual(response.execution.preferIsolated, false);
      assert.strictEqual(response.mode, 'search');
      assert.ok(response.sources.length >= 1);
      assert.ok(response.detailRef.endsWith('response.json'));
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('supports isolated execution with graceful fallback metadata', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-memory-isolated-'));
    const store = await createStateStore({ homeDir });

    try {
      store.upsertSession({
        id: 'session-isolated',
        adapterId: 'local',
        harness: 'local',
        state: 'active',
        repoRoot: process.cwd(),
        startedAt: '2026-03-18T00:00:00.000Z',
        endedAt: null,
        snapshot: { workers: [] },
      });
      store.insertMemoryNote({
        id: 'note-isolated',
        sessionId: 'session-isolated',
        attemptId: null,
        category: 'memory-recall',
        content: 'Isolated retrieval should execute through a worker boundary when available.',
        summary: 'Isolated retrieval worker boundary.',
        tags: ['memory', 'isolated'],
        keywords: ['retrieval', 'worker'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-03-18T00:00:02.000Z',
        accessedAt: '2026-03-18T00:00:02.000Z',
      });

      const request = buildRetrievalRequest('retrieval worker', {
        dbPath: store.dbPath,
        sessionId: 'session-isolated',
        mode: 'search',
        preferIsolated: true,
      });
      const response = await executeRetrievalRequest(request, {
        allowSubprocess: true,
      });

      assert.strictEqual(response.request.id, request.id);
      assert.ok(['isolated_subprocess', 'in_process_fallback'].includes(response.execution.kind));
      assert.strictEqual(response.execution.preferIsolated, true);
      assert.ok(response.sources.length >= 1);
      assert.ok(response.detailRef.endsWith('response.json'));
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('writes orchestration-style artifacts for isolated retrieval requests', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-memory-orchestrated-'));
    const store = await createStateStore({ homeDir });

    try {
      store.upsertSession({
        id: 'session-orchestrated',
        adapterId: 'local',
        harness: 'local',
        state: 'active',
        repoRoot: process.cwd(),
        startedAt: '2026-03-18T00:00:00.000Z',
        endedAt: null,
        snapshot: { workers: [] },
      });
      store.insertMemoryNote({
        id: 'note-orchestrated',
        sessionId: 'session-orchestrated',
        attemptId: null,
        category: 'memory-recall',
        content: 'Orchestrated retrieval should produce inspectable coordination artifacts.',
        summary: 'Orchestrated retrieval artifacts.',
        tags: ['memory', 'orchestration'],
        keywords: ['retrieval', 'artifacts'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-03-18T00:00:02.000Z',
        accessedAt: '2026-03-18T00:00:02.000Z',
      });

      const request = buildRetrievalRequest('retrieval artifacts', {
        dbPath: store.dbPath,
        sessionId: 'session-orchestrated',
        mode: 'search',
        preferIsolated: true,
      });
      const coordinationRoot = path.join(homeDir, '.orchestration');
      const response = await executeRetrievalRequest(request, {
        allowSubprocess: true,
        coordinationRoot,
      });
      const coordinationDir = buildRetrievalCoordinationDir(request, { coordinationRoot });

      assert.ok(fs.existsSync(path.join(coordinationDir, 'task.md')));
      assert.ok(fs.existsSync(path.join(coordinationDir, 'status.md')));
      assert.ok(fs.existsSync(path.join(coordinationDir, 'handoff.md')));
      assert.ok(fs.existsSync(path.join(coordinationDir, 'response.json')));
      assert.ok(['isolated_subprocess', 'in_process_fallback'].includes(response.execution.kind));
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
