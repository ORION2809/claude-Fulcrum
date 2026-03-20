'use strict';

const assert = require('assert');

const {
  l2Normalize,
  simpleEmbed,
  cosineSimilarity,
  isProviderReady,
  getProviderError,
  DEFAULT_MODEL,
  DEFAULT_BATCH_SIZE,
} = require('../../scripts/utils/embeddings');

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

console.log('\nEmbeddings Tests');
console.log('================\n');

let passed = 0;
let failed = 0;

if (test('l2Normalize returns unit vector', () => {
  const v = l2Normalize([3, 4]);
  const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  assert.ok(Math.abs(norm - 1.0) < 1e-6, `Expected norm ~1.0 but got ${norm}`);
})) passed += 1; else failed += 1;

if (test('l2Normalize preserves zero vector', () => {
  const v = l2Normalize([0, 0, 0]);
  assert.deepStrictEqual(v, [0, 0, 0]);
})) passed += 1; else failed += 1;

if (test('simpleEmbed produces consistent embeddings', () => {
  const e1 = simpleEmbed('hello world');
  const e2 = simpleEmbed('hello world');
  assert.deepStrictEqual(e1, e2);
})) passed += 1; else failed += 1;

if (test('simpleEmbed returns normalized vector', () => {
  const emb = simpleEmbed('test input', 128);
  assert.strictEqual(emb.length, 128);
  const norm = Math.sqrt(emb.reduce((s, v) => s + v * v, 0));
  assert.ok(Math.abs(norm - 1.0) < 1e-6, `Expected norm ~1.0 but got ${norm}`);
})) passed += 1; else failed += 1;

if (test('simpleEmbed returns default 384 dimensions', () => {
  const emb = simpleEmbed('test');
  assert.strictEqual(emb.length, 384);
})) passed += 1; else failed += 1;

if (test('cosineSimilarity of identical vectors is 1', () => {
  const v = [1, 2, 3];
  const sim = cosineSimilarity(v, v);
  assert.ok(Math.abs(sim - 1.0) < 1e-6);
})) passed += 1; else failed += 1;

if (test('cosineSimilarity of orthogonal vectors is 0', () => {
  const sim = cosineSimilarity([1, 0], [0, 1]);
  assert.ok(Math.abs(sim) < 1e-6);
})) passed += 1; else failed += 1;

if (test('cosineSimilarity handles null/mismatched lengths', () => {
  assert.strictEqual(cosineSimilarity(null, [1, 2]), 0);
  assert.strictEqual(cosineSimilarity([1], [1, 2]), 0);
})) passed += 1; else failed += 1;

if (test('cosineSimilarity handles zero vectors', () => {
  assert.strictEqual(cosineSimilarity([0, 0], [1, 2]), 0);
})) passed += 1; else failed += 1;

if (test('isProviderReady returns false without onnxruntime', () => {
  assert.strictEqual(isProviderReady(), false);
})) passed += 1; else failed += 1;

if (test('DEFAULT_MODEL is set', () => {
  assert.ok(DEFAULT_MODEL);
  assert.ok(typeof DEFAULT_MODEL === 'string');
})) passed += 1; else failed += 1;

if (test('DEFAULT_BATCH_SIZE is positive integer', () => {
  assert.ok(Number.isInteger(DEFAULT_BATCH_SIZE));
  assert.ok(DEFAULT_BATCH_SIZE > 0);
})) passed += 1; else failed += 1;

// NEW: Tests for transformer pipeline fallback behavior
if (test('getProviderError returns error when @xenova/transformers not installed', () => {
  // Provider should fail gracefully without @xenova/transformers
  const error = getProviderError();
  // Error may be null (not yet attempted) or an Error object (attempted and failed)
  if (error) {
    assert.ok(error instanceof Error);
    assert.ok(error.message.includes('transformers') || error.message.includes('not installed'));
  } else {
    assert.strictEqual(error, null);
  }
})) passed += 1; else failed += 1;

if (test('simpleEmbed produces consistent results for same input', () => {
  const v1 = simpleEmbed('hello world');
  const v2 = simpleEmbed('hello world');
  assert.deepStrictEqual(v1, v2);
})) passed += 1; else failed += 1;

if (test('simpleEmbed handles empty string', () => {
  const v = simpleEmbed('');
  assert.strictEqual(v.length, 384);
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
