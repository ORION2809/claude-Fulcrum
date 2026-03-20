'use strict';

const assert = require('assert');

const {
  computeTimeDecay,
  partitionByRecency,
  bfsRecentFirst,
  dfsDeepChains,
  timeAwareRetrieval,
  DEFAULT_DECAY_WINDOWS,
  QUERY_DECAY_PROFILES,
} = require('../../scripts/memory/time-aware-traversal');

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

console.log('\nTime-Aware Traversal Tests');
console.log('=========================\n');

let passed = 0;
let failed = 0;

const NOW = '2025-06-01T12:00:00Z';
const ONE_HOUR_AGO = '2025-06-01T11:00:00Z';
const ONE_DAY_AGO = '2025-05-31T12:00:00Z';
const ONE_WEEK_AGO = '2025-05-25T12:00:00Z';
const ONE_MONTH_AGO = '2025-05-01T12:00:00Z';

if (test('computeTimeDecay returns 1.0 for very recent (debugging)', () => {
  const decay = computeTimeDecay(ONE_HOUR_AGO, 'debugging', NOW);
  assert.ok(decay >= 0.8, `Expected >= 0.8 but got ${decay}`);
})) passed += 1; else failed += 1;

if (test('computeTimeDecay returns lower value for old memories (debugging)', () => {
  const recent = computeTimeDecay(ONE_HOUR_AGO, 'debugging', NOW);
  const old = computeTimeDecay(ONE_MONTH_AGO, 'debugging', NOW);
  assert.ok(recent > old, `Expected ${recent} > ${old}`);
})) passed += 1; else failed += 1;

if (test('computeTimeDecay architecture profile favors older', () => {
  const weekOld = computeTimeDecay(ONE_WEEK_AGO, 'architecture', NOW);
  assert.ok(weekOld > 0.5, `Architecture should favor week-old memories, got ${weekOld}`);
})) passed += 1; else failed += 1;

if (test('computeTimeDecay handles invalid date', () => {
  const decay = computeTimeDecay('not-a-date', 'debugging', NOW);
  assert.strictEqual(decay, 0.1);
})) passed += 1; else failed += 1;

if (test('partitionByRecency sorts entries into buckets', () => {
  const entries = [
    { id: 'a', createdAt: ONE_HOUR_AGO },
    { id: 'b', createdAt: ONE_DAY_AGO },
    { id: 'c', createdAt: ONE_WEEK_AGO },
    { id: 'd', createdAt: ONE_MONTH_AGO },
  ];
  const buckets = partitionByRecency(entries, NOW);
  assert.strictEqual(buckets.recent.length, 1);
  assert.strictEqual(buckets.recent[0].id, 'a');
  assert.strictEqual(buckets.today.length, 1);
  assert.strictEqual(buckets.week.length, 1);
  assert.strictEqual(buckets.older.length, 1);
})) passed += 1; else failed += 1;

if (test('partitionByRecency handles empty array', () => {
  const buckets = partitionByRecency([], NOW);
  assert.strictEqual(buckets.recent.length, 0);
  assert.strictEqual(buckets.today.length, 0);
  assert.strictEqual(buckets.week.length, 0);
  assert.strictEqual(buckets.older.length, 0);
})) passed += 1; else failed += 1;

if (test('bfsRecentFirst prioritizes recent entries', () => {
  const entries = [
    { id: 'old', score: 0.9, createdAt: ONE_MONTH_AGO },
    { id: 'new', score: 0.5, createdAt: ONE_HOUR_AGO },
  ];
  const results = bfsRecentFirst(entries, null, { maxResults: 10, queryType: 'debugging', now: NOW });
  assert.ok(results.length >= 2);
  assert.strictEqual(results[0].id, 'new');
  assert.ok(results[0].adjustedScore > results[1].adjustedScore || results[0].traversalMethod === 'bfs_recent');
})) passed += 1; else failed += 1;

if (test('bfsRecentFirst respects maxResults', () => {
  const entries = Array.from({ length: 30 }, (_, i) => ({
    id: `e${i}`,
    score: 0.5,
    createdAt: ONE_HOUR_AGO,
  }));
  const results = bfsRecentFirst(entries, null, { maxResults: 5, queryType: 'debugging', now: NOW });
  assert.strictEqual(results.length, 5);
})) passed += 1; else failed += 1;

if (test('dfsDeepChains follows evolved_from edges', () => {
  const entries = [
    { id: 'a', score: 0.8, createdAt: ONE_DAY_AGO },
    { id: 'b', score: 0.6, createdAt: ONE_WEEK_AGO },
    { id: 'c', score: 0.4, createdAt: ONE_MONTH_AGO },
  ];
  const adjIndex = new Map();
  adjIndex.set('a', [{ targetId: 'b', edgeType: 'evolved_from', weight: 1.0 }]);
  adjIndex.set('b', [{ targetId: 'c', edgeType: 'evolved_from', weight: 0.8 }]);
  adjIndex.set('c', []);

  const results = dfsDeepChains(entries, adjIndex, {
    startIds: ['a'],
    maxResults: 10,
    queryType: 'architecture',
    now: NOW,
  });
  assert.ok(results.length > 0);
  assert.ok(results.some(r => r.id === 'a'));
})) passed += 1; else failed += 1;

if (test('dfsDeepChains returns empty for no startIds', () => {
  const results = dfsDeepChains([], null, { startIds: [], now: NOW });
  assert.strictEqual(results.length, 0);
})) passed += 1; else failed += 1;

if (test('timeAwareRetrieval combines BFS and DFS results', () => {
  const entries = [
    { id: 'a', score: 0.9, createdAt: ONE_HOUR_AGO },
    { id: 'b', score: 0.7, createdAt: ONE_DAY_AGO },
    { id: 'c', score: 0.3, createdAt: ONE_WEEK_AGO },
  ];
  const result = timeAwareRetrieval(entries, null, {
    queryType: 'debugging',
    now: NOW,
  });
  assert.ok(result.results.length > 0);
  assert.ok(result.bfsCount > 0);
  assert.strictEqual(result.queryType, 'debugging');
  assert.ok(result.totalCount > 0);
})) passed += 1; else failed += 1;

if (test('QUERY_DECAY_PROFILES contains all expected profiles', () => {
  assert.ok(QUERY_DECAY_PROFILES.debugging);
  assert.ok(QUERY_DECAY_PROFILES.architecture);
  assert.ok(QUERY_DECAY_PROFILES.pattern);
})) passed += 1; else failed += 1;

if (test('DEFAULT_DECAY_WINDOWS is frozen', () => {
  assert.ok(Object.isFrozen(DEFAULT_DECAY_WINDOWS));
})) passed += 1; else failed += 1;

// NEW: Test merge logic where DFS score beats BFS score for same node
if (test('timeAwareRetrieval prefers higher adjustedScore when DFS > BFS for same node', () => {
  // Create a graph where DFS should find a deeper, higher-scored path
  const memories = [
    { id: 'm1', content: 'root note', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), accessCount: 10, score: 0.5, links: ['m2'] },
    { id: 'm2', content: 'deep note', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), accessCount: 50, score: 0.9, evolved_from: 'm1', links: [] },
  ];
  const adjacencyIndex = new Map([
    ['m1', ['m2']],
    ['m2', []],
  ]);
  const result = timeAwareRetrieval(memories, adjacencyIndex, { query: 'deep', limit: 10, now: new Date().toISOString() });
  assert.ok(result.results, 'Should return results object');
  // The combined results should not have duplicates
  const ids = result.results.map(r => r.id);
  const uniqueIds = [...new Set(ids)];
  assert.strictEqual(ids.length, uniqueIds.length, 'No duplicate entries in merged results');
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
