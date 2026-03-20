'use strict';

const assert = require('assert');

const {
  EDGE_TYPES,
  createMemoryLink,
  buildAdjacencyIndex,
  selectSeeds,
  expandNeighbors,
  graphLinkedRetrieval,
  DEFAULT_SEED_BUDGET,
  DEFAULT_NEIGHBOR_FANOUT,
  DEFAULT_MAX_DEPTH,
} = require('../../scripts/memory/graph-retrieval');

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

console.log('\nGraph-Linked Retrieval Tests');
console.log('============================\n');

let passed = 0;
let failed = 0;

if (test('EDGE_TYPES are frozen and complete', () => {
  assert.ok(Object.isFrozen(EDGE_TYPES));
  assert.strictEqual(EDGE_TYPES.PREVENTS, 'prevents');
  assert.strictEqual(EDGE_TYPES.RELATED_TO, 'related_to');
  assert.strictEqual(EDGE_TYPES.EVOLVED_FROM, 'evolved_from');
  assert.strictEqual(EDGE_TYPES.DEPENDS_ON, 'depends_on');
  assert.strictEqual(EDGE_TYPES.CONFLICTS_WITH, 'conflicts_with');
})) passed += 1; else failed += 1;

if (test('createMemoryLink creates valid link', () => {
  const link = createMemoryLink('a', 'b', 'related_to', { weight: 0.8, reason: 'test' });
  assert.strictEqual(link.sourceId, 'a');
  assert.strictEqual(link.targetId, 'b');
  assert.strictEqual(link.edgeType, 'related_to');
  assert.strictEqual(link.weight, 0.8);
  assert.strictEqual(link.reason, 'test');
  assert.ok(link.createdAt);
})) passed += 1; else failed += 1;

if (test('createMemoryLink rejects invalid edge type', () => {
  assert.throws(() => createMemoryLink('a', 'b', 'invalid_type'));
})) passed += 1; else failed += 1;

if (test('createMemoryLink defaults weight to 1.0', () => {
  const link = createMemoryLink('a', 'b', 'depends_on');
  assert.strictEqual(link.weight, 1.0);
})) passed += 1; else failed += 1;

if (test('buildAdjacencyIndex creates bidirectional mapping', () => {
  const links = [createMemoryLink('a', 'b', 'related_to')];
  const index = buildAdjacencyIndex(links);
  assert.ok(index.has('a'));
  assert.ok(index.has('b'));
  assert.strictEqual(index.get('a')[0].targetId, 'b');
  assert.strictEqual(index.get('b')[0].targetId, 'a');
})) passed += 1; else failed += 1;

if (test('buildAdjacencyIndex handles empty links', () => {
  const index = buildAdjacencyIndex([]);
  assert.strictEqual(index.size, 0);
})) passed += 1; else failed += 1;

if (test('selectSeeds returns top N by score', () => {
  const entries = [
    { id: 'c', score: 0.3 },
    { id: 'a', score: 0.9 },
    { id: 'b', score: 0.6 },
  ];
  const seeds = selectSeeds(entries, 2);
  assert.strictEqual(seeds.length, 2);
  assert.strictEqual(seeds[0].id, 'a');
  assert.strictEqual(seeds[1].id, 'b');
})) passed += 1; else failed += 1;

if (test('selectSeeds uses DEFAULT_SEED_BUDGET when budget is invalid', () => {
  const entries = Array.from({ length: 10 }, (_, i) => ({ id: `n${i}`, score: i }));
  const seeds = selectSeeds(entries, -1);
  assert.strictEqual(seeds.length, DEFAULT_SEED_BUDGET);
})) passed += 1; else failed += 1;

if (test('expandNeighbors finds reachable nodes', () => {
  const links = [
    createMemoryLink('a', 'b', 'related_to'),
    createMemoryLink('b', 'c', 'depends_on'),
  ];
  const index = buildAdjacencyIndex(links);
  const neighbors = expandNeighbors(['a'], index, { fanout: 3, maxDepth: 2 });
  assert.ok(neighbors.length > 0);
  assert.ok(neighbors.some(n => n.id === 'b'));
})) passed += 1; else failed += 1;

if (test('expandNeighbors respects maxDepth', () => {
  const links = [
    createMemoryLink('a', 'b', 'related_to'),
    createMemoryLink('b', 'c', 'related_to'),
    createMemoryLink('c', 'd', 'related_to'),
  ];
  const index = buildAdjacencyIndex(links);
  const neighbors = expandNeighbors(['a'], index, { fanout: 3, maxDepth: 1 });
  assert.ok(neighbors.every(n => n.depth <= 1));
  assert.ok(!neighbors.some(n => n.id === 'c'));
})) passed += 1; else failed += 1;

if (test('expandNeighbors respects edgeFilter', () => {
  const links = [
    createMemoryLink('a', 'b', 'related_to'),
    createMemoryLink('a', 'c', 'prevents'),
  ];
  const index = buildAdjacencyIndex(links);
  const neighbors = expandNeighbors(['a'], index, {
    fanout: 3,
    maxDepth: 1,
    edgeFilter: ['prevents'],
  });
  assert.strictEqual(neighbors.length, 1);
  assert.strictEqual(neighbors[0].id, 'c');
})) passed += 1; else failed += 1;

if (test('graphLinkedRetrieval returns seeds + neighbors', () => {
  const entries = [
    { id: 'a', score: 0.9 },
    { id: 'b', score: 0.7 },
    { id: 'c', score: 0.1 },
  ];
  const links = [createMemoryLink('a', 'c', 'related_to')];
  const result = graphLinkedRetrieval(entries, links, { seedBudget: 2 });
  assert.ok(result.seeds.length <= 2);
  assert.ok(result.allIds.includes('a'));
  assert.ok(result.stats.seedCount > 0);
})) passed += 1; else failed += 1;

if (test('graphLinkedRetrieval with no links returns seeds only', () => {
  const entries = [{ id: 'a', score: 0.9 }];
  const result = graphLinkedRetrieval(entries, []);
  assert.strictEqual(result.neighbors.length, 0);
  assert.strictEqual(result.stats.neighborCount, 0);
})) passed += 1; else failed += 1;

if (test('DEFAULT constants are valid', () => {
  assert.ok(DEFAULT_SEED_BUDGET > 0);
  assert.ok(DEFAULT_NEIGHBOR_FANOUT > 0);
  assert.ok(DEFAULT_MAX_DEPTH > 0);
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
