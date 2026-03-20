#!/usr/bin/env node
'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

const {
  ERROR_TYPES,
  ERROR_CLASSIFIERS,
  PDCA_PHASES,
  WORD_OVERLAP_THRESHOLD,
  createPDCACycle,
  advancePDCA,
  classifyError,
  createReflexionStore,
  loadEntries,
  persistEntry,
  computeWordOverlap,
  createErrorSignature,
  findMatchingPattern,
  recordMistake,
  suggestFix,
  createCheckpoint,
  restoreContext,
} = require('../../scripts/lib/pm-meta-layer');

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

console.log('\nPM Meta-Layer & Reflexion Tests (Phase 6.3)');
console.log('============================================\n');

let passed = 0;
let failed = 0;

// --- Constants ---

if (test('ERROR_TYPES has 5 types', () => {
  assert.strictEqual(Object.keys(ERROR_TYPES).length, 5);
  assert.strictEqual(ERROR_TYPES.INPUT, 'input');
  assert.strictEqual(ERROR_TYPES.LOGIC, 'logic');
  assert.strictEqual(ERROR_TYPES.API, 'api');
  assert.strictEqual(ERROR_TYPES.CONFIG, 'config');
  assert.strictEqual(ERROR_TYPES.ENVIRONMENT, 'environment');
})) passed += 1; else failed += 1;

if (test('PDCA_PHASES has 4 phases', () => {
  assert.strictEqual(PDCA_PHASES.PLAN, 'plan');
  assert.strictEqual(PDCA_PHASES.DO, 'do');
  assert.strictEqual(PDCA_PHASES.CHECK, 'check');
  assert.strictEqual(PDCA_PHASES.ACT, 'act');
})) passed += 1; else failed += 1;

if (test('WORD_OVERLAP_THRESHOLD is 0.7', () => {
  assert.strictEqual(WORD_OVERLAP_THRESHOLD, 0.7);
})) passed += 1; else failed += 1;

// --- PDCA Cycle ---

if (test('createPDCACycle initializes in PLAN phase', () => {
  const cycle = createPDCACycle('fix login bug');
  assert.strictEqual(cycle.phase, 'plan');
  assert.strictEqual(cycle.goal, 'fix login bug');
  assert.ok(cycle.id.startsWith('pdca-'));
  assert.strictEqual(cycle.steps.length, 0);
  assert.strictEqual(cycle.completedAt, null);
})) passed += 1; else failed += 1;

if (test('advancePDCA progresses through phases', () => {
  let cycle = createPDCACycle('test goal');
  assert.strictEqual(cycle.phase, 'plan');

  cycle = advancePDCA(cycle, 'plan created');
  assert.strictEqual(cycle.phase, 'do');
  assert.strictEqual(cycle.steps.length, 1);

  cycle = advancePDCA(cycle, 'implementation done');
  assert.strictEqual(cycle.phase, 'check');

  cycle = advancePDCA(cycle, 'tests pass');
  assert.strictEqual(cycle.phase, 'act');
  assert.strictEqual(cycle.steps.length, 3);
})) passed += 1; else failed += 1;

if (test('advancePDCA sets completedAt after ACT', () => {
  let cycle = createPDCACycle('g');
  cycle = advancePDCA(cycle, 'a');
  cycle = advancePDCA(cycle, 'b');
  cycle = advancePDCA(cycle, 'c');
  cycle = advancePDCA(cycle, 'd');
  assert.ok(cycle.completedAt !== null);
  assert.strictEqual(cycle.steps.length, 4);
})) passed += 1; else failed += 1;

if (test('advancePDCA is immutable (does not mutate original)', () => {
  const cycle = createPDCACycle('g');
  const next = advancePDCA(cycle, 'step');
  assert.notStrictEqual(cycle, next);
  assert.strictEqual(cycle.steps.length, 0);
  assert.strictEqual(next.steps.length, 1);
})) passed += 1; else failed += 1;

// --- Error Classification ---

if (test('classifyError detects INPUT errors', () => {
  const r = classifyError('validation failed: missing param userId');
  assert.strictEqual(r.type, 'input');
})) passed += 1; else failed += 1;

if (test('classifyError detects API errors', () => {
  const r = classifyError('ECONNREFUSED when calling remote endpoint');
  assert.strictEqual(r.type, 'api');
})) passed += 1; else failed += 1;

if (test('classifyError detects CONFIG errors', () => {
  const r = classifyError('ENOENT: no such file or directory config.json');
  assert.strictEqual(r.type, 'config');
})) passed += 1; else failed += 1;

if (test('classifyError detects ENVIRONMENT errors', () => {
  const r = classifyError('ENOMEM: cannot allocate memory');
  assert.strictEqual(r.type, 'environment');
})) passed += 1; else failed += 1;

if (test('classifyError detects LOGIC errors', () => {
  const r = classifyError('assertion failed: expected 3 got 5');
  assert.strictEqual(r.type, 'logic');
})) passed += 1; else failed += 1;

if (test('classifyError defaults to LOGIC for unknown', () => {
  const r = classifyError('something completely unrecognized xyz');
  assert.strictEqual(r.type, 'logic');
})) passed += 1; else failed += 1;

// --- Reflexion: Word Overlap ---

if (test('computeWordOverlap identical strings = 1.0', () => {
  const overlap = computeWordOverlap('the quick brown fox', 'the quick brown fox');
  assert.strictEqual(overlap, 1.0);
})) passed += 1; else failed += 1;

if (test('computeWordOverlap disjoint strings = 0', () => {
  const overlap = computeWordOverlap('apple banana cherry', 'delta echo foxtrot');
  assert.strictEqual(overlap, 0);
})) passed += 1; else failed += 1;

if (test('computeWordOverlap partial match', () => {
  const overlap = computeWordOverlap('error reading file config', 'error reading file settings');
  assert.ok(overlap > 0.5, `expected > 0.5, got ${overlap}`);
  assert.ok(overlap < 1.0);
})) passed += 1; else failed += 1;

if (test('computeWordOverlap ignores short words', () => {
  const overlap = computeWordOverlap('a b c d e', 'a b c d e');
  assert.strictEqual(overlap, 0);
})) passed += 1; else failed += 1;

// --- Reflexion: Error Signature ---

if (test('createErrorSignature normalizes numbers', () => {
  const sig = createErrorSignature({ message: 'error at line 42 col 5' });
  assert.ok(!sig.includes('42'));
  assert.ok(sig.includes('N'));
})) passed += 1; else failed += 1;

if (test('createErrorSignature removes quotes', () => {
  const sig = createErrorSignature({ message: "can't parse \"config\"" });
  assert.ok(!sig.includes('"'));
  assert.ok(!sig.includes("'"));
})) passed += 1; else failed += 1;

// --- Reflexion: Store ---

if (test('createReflexionStore with non-existent file returns empty entries', () => {
  const store = createReflexionStore('/nonexistent/path/store.jsonl');
  assert.deepStrictEqual(store.entries, []);
})) passed += 1; else failed += 1;

if (test('persistEntry writes JSONL and returns updated store', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reflexion-'));
  const storePath = path.join(tmpDir, 'patterns.jsonl');
  const store = createReflexionStore(storePath);
  const entry = { signature: 'test error signature', fix: 'apply fix X' };
  const updated = persistEntry(store, entry);
  assert.strictEqual(updated.entries.length, 1);
  assert.ok(fs.existsSync(storePath));
  const content = fs.readFileSync(storePath, 'utf8').trim();
  assert.deepStrictEqual(JSON.parse(content), entry);
  fs.rmSync(tmpDir, { recursive: true });
})) passed += 1; else failed += 1;

if (test('findMatchingPattern finds matching error', () => {
  const store = {
    entries: [
      { signature: 'cannot read property name of undefined object', fix: 'add null check' },
    ],
    storePath: '/tmp/test.jsonl',
  };
  const match = findMatchingPattern(store, 'cannot read property name undefined object error');
  assert.ok(match !== null);
  assert.ok(match.overlap >= WORD_OVERLAP_THRESHOLD);
})) passed += 1; else failed += 1;

if (test('findMatchingPattern returns null for no match', () => {
  const store = {
    entries: [
      { signature: 'database connection timeout', fix: 'increase timeout' },
    ],
    storePath: '/tmp/test.jsonl',
  };
  const match = findMatchingPattern(store, 'completely different error about parsing html');
  assert.strictEqual(match, null);
})) passed += 1; else failed += 1;

// --- recordMistake ---

if (test('recordMistake adds new entry', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reflexion-'));
  const store = createReflexionStore(path.join(tmpDir, 'patterns.jsonl'));
  const { store: updated, entry, isNew } = recordMistake(store, { message: 'null reference error' }, 'check for null');
  assert.strictEqual(isNew, true);
  assert.ok(entry.signature);
  assert.strictEqual(entry.fix, 'check for null');
  assert.strictEqual(entry.errorType, 'input');
  fs.rmSync(tmpDir, { recursive: true });
})) passed += 1; else failed += 1;

if (test('recordMistake detects duplicate pattern', () => {
  const store = {
    entries: [
      { signature: 'null reference error found processing data', fix: 'add null guard', occurrences: 1 },
    ],
    storePath: '/tmp/test.jsonl',
  };
  const { entry, isNew } = recordMistake(store, { message: 'null reference error found processing data again' }, 'add null guard v2');
  assert.strictEqual(isNew, false);
  assert.strictEqual(entry.occurrences, 2);
})) passed += 1; else failed += 1;

// --- suggestFix ---

if (test('suggestFix finds a fix when pattern exists', () => {
  const store = {
    entries: [
      { signature: 'timeout connecting database server', fix: 'increase pool timeout', occurrences: 3, errorType: 'api' },
    ],
    storePath: '/tmp/test.jsonl',
  };
  const result = suggestFix(store, { message: 'timeout connecting to database server instance' });
  assert.strictEqual(result.found, true);
  assert.strictEqual(result.fix, 'increase pool timeout');
  assert.strictEqual(result.occurrences, 3);
})) passed += 1; else failed += 1;

if (test('suggestFix returns found:false when no match', () => {
  const store = { entries: [], storePath: '/tmp/test.jsonl' };
  const result = suggestFix(store, { message: 'random error' });
  assert.strictEqual(result.found, false);
  assert.strictEqual(result.fix, null);
})) passed += 1; else failed += 1;

// --- Checkpoint & Context Restore ---

if (test('createCheckpoint returns valid checkpoint', () => {
  const cp = createCheckpoint('session-123', {
    phase: 'do',
    decision: 'proceed with implementation',
    reasoning: 'all tests green',
    filesModified: ['a.js', 'b.js'],
    nextSteps: ['write docs'],
  });
  assert.strictEqual(cp.sessionId, 'session-123');
  assert.strictEqual(cp.phase, 'do');
  assert.strictEqual(cp.decision, 'proceed with implementation');
  assert.deepStrictEqual(cp.filesModified, ['a.js', 'b.js']);
})) passed += 1; else failed += 1;

if (test('restoreContext returns latest phase and cumulative files', () => {
  const checkpoints = [
    { phase: 'plan', decision: 'plan ready', filesModified: ['plan.md'], nextSteps: ['implement'] },
    { phase: 'do', decision: 'code done', filesModified: ['a.js', 'b.js'], nextSteps: ['test'] },
  ];
  const ctx = restoreContext(checkpoints);
  assert.strictEqual(ctx.lastPhase, 'do');
  assert.strictEqual(ctx.lastDecision, 'code done');
  assert.ok(ctx.filesModified.includes('plan.md'));
  assert.ok(ctx.filesModified.includes('a.js'));
  assert.deepStrictEqual(ctx.nextSteps, ['test']);
  assert.strictEqual(ctx.totalCheckpoints, 2);
})) passed += 1; else failed += 1;

if (test('restoreContext handles empty checkpoints', () => {
  const ctx = restoreContext([]);
  assert.strictEqual(ctx.lastPhase, null);
  assert.deepStrictEqual(ctx.filesModified, []);
})) passed += 1; else failed += 1;

// --- Summary ---

console.log(`\n${passed} passed, ${failed} failed`);
console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exitCode = 1;
