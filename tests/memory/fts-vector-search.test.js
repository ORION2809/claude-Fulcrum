'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStateStore } = require('../../scripts/lib/state-store');
const { simpleEmbed, cosineSimilarity } = require('../../scripts/utils/embeddings');

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

console.log('\nFTS5 + Vector Search Tests');
console.log('==========================\n');

let passed = 0;
let failed = 0;

async function main() {

  // --- FTS5 Search Tests ---

  if (await asyncTest('migration 4 applies and creates FTS5 virtual tables', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-fts5-'));
    const store = await createStateStore({ homeDir });
    try {
      const migrations = store.getAppliedMigrations();
      const v4 = migrations.find(m => m.version === 4);
      assert.ok(v4, 'Migration 4 should be applied');
      assert.strictEqual(v4.name, '004_fts5_vector_search');
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('searchObservationsFTS returns matching observations', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-fts5-'));
    const store = await createStateStore({ homeDir });
    try {
      store.upsertSession({
        id: 'sess-fts',
        adapterId: 'local',
        harness: 'test',
        state: 'active',
        repoRoot: process.cwd(),
        startedAt: '2026-01-01T00:00:00.000Z',
        endedAt: null,
        snapshot: { workers: [] },
      });
      store.insertObservation({
        id: 'obs-fts-1',
        sessionId: 'sess-fts',
        attemptId: null,
        sourceEvent: 'post_tool_use',
        title: 'Database migration performance',
        summary: 'Optimized SQLite query execution with FTS5 indexing.',
        contentHash: 'hash-fts-obs-1',
        anchorRef: null,
        tags: ['database', 'performance'],
        metadata: {},
        createdAt: '2026-01-01T00:01:00.000Z',
        lastAccessedAt: null,
      });
      store.insertObservation({
        id: 'obs-fts-2',
        sessionId: 'sess-fts',
        attemptId: null,
        sourceEvent: 'post_tool_use',
        title: 'React component refactoring',
        summary: 'Simplified component tree for better rendering performance.',
        contentHash: 'hash-fts-obs-2',
        anchorRef: null,
        tags: ['react', 'frontend'],
        metadata: {},
        createdAt: '2026-01-01T00:02:00.000Z',
        lastAccessedAt: null,
      });

      const results = store.searchObservationsFTS('database migration', { limit: 10 });
      assert.ok(results.length >= 1, `Expected at least 1 result, got ${results.length}`);
      assert.strictEqual(results[0].id, 'obs-fts-1');
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('searchMemoryNotesFTS returns matching notes', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-fts5-'));
    const store = await createStateStore({ homeDir });
    try {
      store.insertMemoryNote({
        id: 'note-fts-1',
        sessionId: null,
        attemptId: null,
        category: 'architecture-decision',
        content: 'Adopted event driven architecture with message queues for async processing.',
        summary: 'Event driven architecture adoption.',
        tags: ['architecture'],
        keywords: ['event-driven', 'message-queue'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-01-01T00:01:00.000Z',
        accessedAt: null,
      });
      store.insertMemoryNote({
        id: 'note-fts-2',
        sessionId: null,
        attemptId: null,
        category: 'testing-pattern',
        content: 'Use table-driven tests for comprehensive input coverage.',
        summary: 'Table-driven testing pattern.',
        tags: ['testing'],
        keywords: ['table-driven', 'coverage'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-01-01T00:02:00.000Z',
        accessedAt: null,
      });

      const results = store.searchMemoryNotesFTS('event driven architecture', { limit: 10 });
      assert.ok(results.length >= 1, `Expected at least 1 result, got ${results.length}`);
      assert.strictEqual(results[0].id, 'note-fts-1');
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('FTS5 search returns empty for non-matching query', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-fts5-'));
    const store = await createStateStore({ homeDir });
    try {
      store.insertObservation({
        id: 'obs-fts-nomatch',
        sessionId: null,
        attemptId: null,
        sourceEvent: 'post_tool_use',
        title: 'Python debugging session',
        summary: 'Fixed import cycle in data pipeline.',
        contentHash: 'hash-fts-nomatch',
        anchorRef: null,
        tags: ['python'],
        metadata: {},
        createdAt: '2026-01-01T00:01:00.000Z',
        lastAccessedAt: null,
      });

      const results = store.searchObservationsFTS('kubernetes deployment', { limit: 10 });
      assert.strictEqual(results.length, 0);
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('FTS5 search handles empty query gracefully', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-fts5-'));
    const store = await createStateStore({ homeDir });
    try {
      const results = store.searchObservationsFTS('', { limit: 10 });
      assert.strictEqual(results.length, 0);
      const noteResults = store.searchMemoryNotesFTS('', { limit: 10 });
      assert.strictEqual(noteResults.length, 0);
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('FTS5 search handles special characters gracefully', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-fts5-'));
    const store = await createStateStore({ homeDir });
    try {
      const results = store.searchObservationsFTS('AND OR NOT *:!@#$%', { limit: 10 });
      assert.ok(Array.isArray(results));
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  // --- Embedding Storage Tests ---

  if (await asyncTest('upsertEmbedding stores and getEmbedding retrieves a vector', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-emb-'));
    const store = await createStateStore({ homeDir });
    try {
      const vector = simpleEmbed('test embedding storage');
      store.upsertEmbedding({
        id: 'emb-test-1',
        sourceTable: 'observations',
        sourceId: 'obs-emb-1',
        model: 'simple-hash',
        dimensions: 384,
        vector,
        createdAt: '2026-01-01T00:00:00.000Z',
      });

      const retrieved = store.getEmbedding('observations', 'obs-emb-1');
      assert.ok(retrieved, 'Should retrieve the stored embedding');
      assert.strictEqual(retrieved.sourceId, 'obs-emb-1');
      assert.strictEqual(retrieved.dimensions, 384);
      assert.strictEqual(retrieved.vector.length, 384);
      const similarity = cosineSimilarity(vector, retrieved.vector);
      assert.ok(Math.abs(similarity - 1.0) < 1e-6, 'Retrieved vector should match stored vector');
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('upsertEmbedding updates existing embedding on conflict', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-emb-'));
    const store = await createStateStore({ homeDir });
    try {
      const v1 = simpleEmbed('first version');
      store.upsertEmbedding({
        id: 'emb-upsert-1',
        sourceTable: 'memory_notes',
        sourceId: 'note-upsert-1',
        model: 'simple-hash',
        dimensions: 384,
        vector: v1,
      });

      const v2 = simpleEmbed('second updated version');
      store.upsertEmbedding({
        id: 'emb-upsert-2',
        sourceTable: 'memory_notes',
        sourceId: 'note-upsert-1',
        model: 'simple-hash',
        dimensions: 384,
        vector: v2,
      });

      const retrieved = store.getEmbedding('memory_notes', 'note-upsert-1');
      assert.ok(retrieved);
      const sim = cosineSimilarity(v2, retrieved.vector);
      assert.ok(Math.abs(sim - 1.0) < 1e-6, 'Should have the updated vector');
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('getEmbedding returns null for non-existent embedding', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-emb-'));
    const store = await createStateStore({ homeDir });
    try {
      const result = store.getEmbedding('observations', 'nonexistent-id');
      assert.strictEqual(result, null);
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  // --- Vector Similarity Search Tests ---

  if (await asyncTest('findSimilarByVector returns similar entries ranked by cosine similarity', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-vec-'));
    const store = await createStateStore({ homeDir });
    try {
      const texts = [
        'database query optimization with SQLite',
        'machine learning model training pipeline',
        'SQLite full text search indexing performance',
        'React component lifecycle management',
      ];

      for (let i = 0; i < texts.length; i++) {
        const vector = simpleEmbed(texts[i]);
        store.upsertEmbedding({
          id: `emb-sim-${i}`,
          sourceTable: 'observations',
          sourceId: `obs-sim-${i}`,
          model: 'simple-hash',
          dimensions: 384,
          vector,
        });
      }

      const queryVector = simpleEmbed('SQLite database search optimization');
      const results = store.findSimilarByVector(queryVector, 'observations', { limit: 4 });

      assert.ok(results.length > 0, 'Should return similarity results');
      // The top result should be one of the SQLite/database entries
      const topIds = results.slice(0, 2).map(r => r.sourceId);
      assert.ok(
        topIds.includes('obs-sim-0') || topIds.includes('obs-sim-2'),
        `Top results should include SQLite/database entries, got: ${topIds.join(', ')}`
      );
      // Verify results are sorted by similarity descending
      for (let i = 1; i < results.length; i++) {
        assert.ok(
          results[i - 1].similarity >= results[i].similarity,
          'Results should be sorted by similarity descending'
        );
      }
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('findSimilarByVector respects minSimilarity threshold', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-vec-'));
    const store = await createStateStore({ homeDir });
    try {
      store.upsertEmbedding({
        id: 'emb-thresh-1',
        sourceTable: 'observations',
        sourceId: 'obs-thresh-1',
        model: 'simple-hash',
        dimensions: 384,
        vector: simpleEmbed('completely unrelated topic about cooking recipes'),
      });

      const queryVector = simpleEmbed('quantum physics particle acceleration');
      const results = store.findSimilarByVector(queryVector, 'observations', {
        limit: 10,
        minSimilarity: 0.9,
      });

      // Very different topics should not meet a high threshold
      assert.strictEqual(results.length, 0, 'Should filter out low-similarity results');
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('findSimilarByVector returns empty for non-existent table entries', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-vec-'));
    const store = await createStateStore({ homeDir });
    try {
      const queryVector = simpleEmbed('any query');
      const results = store.findSimilarByVector(queryVector, 'observations', { limit: 10 });
      assert.strictEqual(results.length, 0);
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  // --- computeAndStoreEmbedding Tests ---

  if (await asyncTest('computeAndStoreEmbedding auto-generates and stores embedding', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-cas-'));
    const store = await createStateStore({ homeDir });
    try {
      const result = store.computeAndStoreEmbedding('observations', 'obs-auto-1', 'Automated embedding for testing');
      assert.ok(result);
      assert.strictEqual(result.sourceTable, 'observations');
      assert.strictEqual(result.sourceId, 'obs-auto-1');
      assert.strictEqual(result.model, 'simple-hash');
      assert.strictEqual(result.dimensions, 384);
      assert.ok(Array.isArray(result.vector));
      assert.strictEqual(result.vector.length, 384);

      // Verify it's retrievable
      const retrieved = store.getEmbedding('observations', 'obs-auto-1');
      assert.ok(retrieved);
      assert.strictEqual(retrieved.sourceId, 'obs-auto-1');
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  // --- Integration: FTS5 + Vector in searchMemory ---

  if (await asyncTest('searchMemory uses FTS5 and vector scores for hybrid ranking', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-hybrid-'));
    const store = await createStateStore({ homeDir });
    const dbPath = store.dbPath;
    try {
      store.upsertSession({
        id: 'sess-hybrid',
        adapterId: 'local',
        harness: 'test',
        state: 'active',
        repoRoot: process.cwd(),
        startedAt: '2026-01-01T00:00:00.000Z',
        endedAt: null,
        snapshot: { workers: [] },
      });

      // Insert observations with embeddings
      const obsData = [
        { id: 'obs-h-1', title: 'SQLite FTS5 integration', summary: 'Implemented full-text search with FTS5 virtual tables.' },
        { id: 'obs-h-2', title: 'React component cleanup', summary: 'Removed unused props and simplified render logic.' },
        { id: 'obs-h-3', title: 'Vector similarity search', summary: 'Added cosine similarity scoring for embeddings.' },
      ];

      for (const obs of obsData) {
        store.insertObservation({
          id: obs.id,
          sessionId: 'sess-hybrid',
          attemptId: null,
          sourceEvent: 'post_tool_use',
          title: obs.title,
          summary: obs.summary,
          contentHash: `hash-${obs.id}`,
          anchorRef: null,
          tags: [],
          metadata: {},
          createdAt: '2026-01-01T00:01:00.000Z',
          lastAccessedAt: null,
        });
        store.computeAndStoreEmbedding('observations', obs.id, `${obs.title} ${obs.summary}`);
      }

      store.close();

      // Now search using searchMemory which should use FTS5 + vector
      const { searchMemory } = require('../../scripts/memory/search-orchestrator');
      const results = await searchMemory('FTS5 full text search', {
        dbPath,
        mode: 'search',
        limit: 5,
      });

      assert.ok(results, 'searchMemory should return results');
      assert.ok(results.results.length > 0, 'Should find relevant results');
      // The FTS5/SQLite related observation should rank highest
      const topResultId = results.results[0].id;
      assert.ok(
        topResultId === 'obs-h-1' || topResultId === 'obs-h-3',
        `Top result should be FTS5 or vector-related, got: ${topResultId}`
      );
    } finally {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('searchMemory degrades gracefully without embeddings', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-degrade-'));
    const store = await createStateStore({ homeDir });
    const dbPath = store.dbPath;
    try {
      store.insertObservation({
        id: 'obs-degrade-1',
        sessionId: null,
        attemptId: null,
        sourceEvent: 'post_tool_use',
        title: 'Graceful degradation test',
        summary: 'Search should work without stored embeddings.',
        contentHash: 'hash-degrade-1',
        anchorRef: null,
        tags: ['testing'],
        metadata: {},
        createdAt: '2026-01-01T00:01:00.000Z',
        lastAccessedAt: null,
      });
      store.close();

      const { searchMemory } = require('../../scripts/memory/search-orchestrator');
      const results = await searchMemory('graceful degradation', {
        dbPath,
        mode: 'search',
        limit: 5,
      });

      assert.ok(results, 'Should still return results');
      assert.ok(results.results.length > 0, 'Lexical search should still find results');
    } finally {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  // --- FTS5 Trigger Sync Tests ---

  if (await asyncTest('FTS5 index stays in sync after observation updates', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-fts-sync-'));
    const store = await createStateStore({ homeDir });
    try {
      store.insertObservation({
        id: 'obs-sync-1',
        sessionId: null,
        attemptId: null,
        sourceEvent: 'post_tool_use',
        title: 'Original title about Kubernetes',
        summary: 'Deployed microservices to Kubernetes cluster.',
        contentHash: 'hash-sync-1',
        anchorRef: null,
        tags: ['kubernetes'],
        metadata: {},
        createdAt: '2026-01-01T00:01:00.000Z',
        lastAccessedAt: null,
      });

      // FTS should find the original
      const before = store.searchObservationsFTS('kubernetes', { limit: 10 });
      assert.ok(before.length >= 1, 'Should find Kubernetes observation');

      // Upsert with updated content (same id triggers UPDATE)
      store.insertObservation({
        id: 'obs-sync-1',
        sessionId: null,
        attemptId: null,
        sourceEvent: 'post_tool_use',
        title: 'Updated title about Docker',
        summary: 'Migrated from Kubernetes to Docker Swarm.',
        contentHash: 'hash-sync-1-updated',
        anchorRef: null,
        tags: ['docker'],
        metadata: {},
        createdAt: '2026-01-01T00:02:00.000Z',
        lastAccessedAt: null,
      });

      // FTS should now find Docker
      const after = store.searchObservationsFTS('docker', { limit: 10 });
      assert.ok(after.length >= 1, 'Should find updated Docker observation');
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  console.log(`\n  ${passed} passing, ${failed} failing\n`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(`Fatal: ${error.message}`);
  process.exitCode = 1;
});
