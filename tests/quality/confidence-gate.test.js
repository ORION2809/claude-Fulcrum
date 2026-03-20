'use strict';

const assert = require('assert');

const {
  evaluateConfidence,
  normalizeConfidenceInput,
} = require('../../scripts/quality/confidence-gate');

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

console.log('\nConfidence Gate Tests');
console.log('=====================\n');

let passed = 0;
let failed = 0;

if (test('normalizes compact input into arrays and threshold values', () => {
  const normalized = normalizeConfidenceInput({
    task: 'Implement the retrieval budget gate',
    files: 'scripts/memory/search-orchestrator.js, tests/memory/search-orchestrator.test.js',
    priorMistakes: 'returned raw dumps, exceeded token budget',
    threshold: '0.8',
  });

  assert.deepStrictEqual(normalized.files, [
    'scripts/memory/search-orchestrator.js',
    'tests/memory/search-orchestrator.test.js',
  ]);
  assert.deepStrictEqual(normalized.priorMistakes, [
    'returned raw dumps',
    'exceeded token budget',
  ]);
  assert.strictEqual(normalized.threshold, 0.8);
})) passed += 1; else failed += 1;

if (test('blocks vague tasks with weak context and missing prior-mistake handling', () => {
  const result = evaluateConfidence({
    task: 'fix it',
    files: [],
    priorMistakes: [],
    knownUnknowns: ['missing acceptance criteria'],
  });

  assert.strictEqual(result.proceed, false);
  assert.ok(result.score < 0.7);
  assert.ok(result.blockers.length >= 1);
  assert.ok(result.reflectionLog.some(entry => entry.dimension === 'requirement_clarity' && entry.status === 'fail'));
})) passed += 1; else failed += 1;

if (test('passes clear scoped work with context and prior-mistake coverage', () => {
  const result = evaluateConfidence({
    task: 'Implement a bounded synthesized memory recall response for the search orchestrator and add regression tests for linked-note expansion.',
    files: [
      'scripts/memory/search-orchestrator.js',
      'tests/memory/search-orchestrator.test.js',
    ],
    priorMistakes: [
      'returned raw search results directly to parent context',
      'did not cap response size',
    ],
    evidence: [
      'upgrade_plan phase 2.1 retrieved',
      'research notes from memsearch and claude-mem reviewed',
    ],
    threshold: 0.7,
  });

  assert.strictEqual(result.proceed, true);
  assert.ok(result.score >= 0.7);
  assert.strictEqual(result.reflectionLog.length, 3);
  assert.ok(result.recommendations.length >= 1);
})) passed += 1; else failed += 1;

console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
