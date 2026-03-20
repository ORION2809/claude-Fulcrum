'use strict';

const assert = require('assert');

const {
  computeContentHash,
  computeChunkId,
  findDuplicates,
  findStaleChunks,
  createChunkRecord,
  planIncrementalUpdate,
  buildWorkspaceCollectionId,
} = require('../../scripts/memory/incremental-dedup');

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

console.log('\nIncremental Dedup Tests');
console.log('======================\n');

let passed = 0;
let failed = 0;

if (test('computeContentHash is deterministic', () => {
  const h1 = computeContentHash('file.js', '1-10', 'hello', 'default');
  const h2 = computeContentHash('file.js', '1-10', 'hello', 'default');
  assert.strictEqual(h1, h2);
})) passed += 1; else failed += 1;

if (test('computeContentHash differs for different content', () => {
  const h1 = computeContentHash('file.js', '1-10', 'hello', 'default');
  const h2 = computeContentHash('file.js', '1-10', 'world', 'default');
  assert.notStrictEqual(h1, h2);
})) passed += 1; else failed += 1;

if (test('computeChunkId returns prefixed short hash', () => {
  const hash = computeContentHash('file.js', '1-10', 'hello', 'default');
  const id = computeChunkId(hash);
  assert.ok(id.startsWith('chunk-'));
  assert.strictEqual(id.length, 22); // 'chunk-' + 16 hex chars
})) passed += 1; else failed += 1;

if (test('findDuplicates separates known and new chunks', () => {
  const existing = [{ contentHash: 'aaa' }, { contentHash: 'bbb' }];
  const incoming = [
    { contentHash: 'aaa' },
    { contentHash: 'ccc' },
  ];
  const { duplicates, unique } = findDuplicates(existing, incoming);
  assert.strictEqual(duplicates.length, 1);
  assert.strictEqual(unique.length, 1);
  assert.strictEqual(unique[0].contentHash, 'ccc');
})) passed += 1; else failed += 1;

if (test('findStaleChunks identifies chunks no longer in source', () => {
  const existing = [
    { contentHash: 'aaa' },
    { contentHash: 'bbb' },
    { contentHash: 'ccc' },
  ];
  const stale = findStaleChunks(existing, ['aaa', 'ccc']);
  assert.strictEqual(stale.length, 1);
  assert.strictEqual(stale[0].contentHash, 'bbb');
})) passed += 1; else failed += 1;

if (test('createChunkRecord produces valid record', () => {
  const record = createChunkRecord('file.js', '1-10', 'hello world', 'default');
  assert.ok(record.id.startsWith('chunk-'));
  assert.strictEqual(record.source, 'file.js');
  assert.strictEqual(record.content, 'hello world');
  assert.ok(record.contentHash);
  assert.ok(record.createdAt);
})) passed += 1; else failed += 1;

if (test('planIncrementalUpdate calculates insert/delete/skip correctly', () => {
  const existing = [
    { contentHash: 'aaa' },
    { contentHash: 'bbb' },
  ];
  const newChunks = [
    { contentHash: 'bbb' },
    { contentHash: 'ccc' },
  ];
  const plan = planIncrementalUpdate(existing, newChunks);
  assert.strictEqual(plan.toInsert.length, 1);
  assert.strictEqual(plan.toDelete.length, 1);
  assert.strictEqual(plan.skipped.length, 1);
  assert.strictEqual(plan.stats.churnRate, 1);
})) passed += 1; else failed += 1;

if (test('buildWorkspaceCollectionId is deterministic and stable', () => {
  const id1 = buildWorkspaceCollectionId('/home/user/project');
  const id2 = buildWorkspaceCollectionId('/home/user/project');
  assert.strictEqual(id1, id2);
  assert.ok(id1.startsWith('ws-'));
})) passed += 1; else failed += 1;

if (test('buildWorkspaceCollectionId normalizes path separators', () => {
  const id1 = buildWorkspaceCollectionId('C:\\Users\\proj');
  const id2 = buildWorkspaceCollectionId('C:/Users/proj');
  assert.strictEqual(id1, id2);
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
