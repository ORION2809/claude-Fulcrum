'use strict';

const assert = require('assert');

const {
  EVOLUTION_ACTIONS,
  isStale,
  computeRelevanceScore,
  suggestEvolutionActions,
  identifyMergeCandidates,
  planConsolidation,
  cloneForAttempt,
  applyEvolutionAction,
  DEFAULT_STALE_THRESHOLD_DAYS,
} = require('../../scripts/memory/memory-evolution');

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

console.log('\nMemory Evolution Tests');
console.log('=====================\n');

let passed = 0;
let failed = 0;

if (test('EVOLUTION_ACTIONS has all expected actions', () => {
  assert.ok(Object.isFrozen(EVOLUTION_ACTIONS));
  assert.strictEqual(EVOLUTION_ACTIONS.STRENGTHEN, 'strengthen');
  assert.strictEqual(EVOLUTION_ACTIONS.UPDATE_NEIGHBOR, 'update_neighbor');
  assert.strictEqual(EVOLUTION_ACTIONS.MERGE, 'merge');
  assert.strictEqual(EVOLUTION_ACTIONS.DOWNSAMPLE, 'downsample');
  assert.strictEqual(EVOLUTION_ACTIONS.ARCHIVE, 'archive');
})) passed += 1; else failed += 1;

if (test('isStale returns true for old notes', () => {
  const old = { createdAt: '2020-01-01T00:00:00Z' };
  assert.strictEqual(isStale(old, 30), true);
})) passed += 1; else failed += 1;

if (test('isStale returns false for recent notes', () => {
  const recent = { createdAt: new Date().toISOString() };
  assert.strictEqual(isStale(recent, 30), false);
})) passed += 1; else failed += 1;

if (test('isStale uses lastAccessed over createdAt', () => {
  const note = {
    createdAt: '2020-01-01T00:00:00Z',
    lastAccessed: new Date().toISOString(),
  };
  assert.strictEqual(isStale(note, 30), false);
})) passed += 1; else failed += 1;

if (test('isStale returns true when no dates are present', () => {
  assert.strictEqual(isStale({}, 30), true);
})) passed += 1; else failed += 1;

if (test('computeRelevanceScore returns value between 0 and 1', () => {
  const note = { retrievalCount: 5, links: [{}], createdAt: new Date().toISOString() };
  const score = computeRelevanceScore(note);
  assert.ok(score >= 0 && score <= 1, `Score ${score} not in [0, 1]`);
})) passed += 1; else failed += 1;

if (test('computeRelevanceScore is higher for accessed notes', () => {
  const accessed = { retrievalCount: 10, links: [{}, {}, {}], createdAt: new Date().toISOString() };
  const unaccessed = { retrievalCount: 0, links: [], createdAt: '2020-01-01T00:00:00Z' };
  assert.ok(computeRelevanceScore(accessed) > computeRelevanceScore(unaccessed));
})) passed += 1; else failed += 1;

if (test('suggestEvolutionActions finds STRENGTHEN for keyword overlap', () => {
  const note = { keywords: ['react', 'hooks', 'state'] };
  const neighbors = [{ id: 'n1', keywords: ['react', 'hooks', 'component'] }];
  const actions = suggestEvolutionActions(note, neighbors);
  assert.ok(actions.some(a => a.action === EVOLUTION_ACTIONS.STRENGTHEN));
})) passed += 1; else failed += 1;

if (test('suggestEvolutionActions returns empty for no neighbors', () => {
  const note = { keywords: ['react'] };
  assert.deepStrictEqual(suggestEvolutionActions(note, []), []);
  assert.deepStrictEqual(suggestEvolutionActions(note, null), []);
})) passed += 1; else failed += 1;

if (test('identifyMergeCandidates groups by category+keywords', () => {
  const notes = [
    { id: 'a', category: 'debug', keywords: ['react', 'hooks'] },
    { id: 'b', category: 'debug', keywords: ['react', 'hooks'] },
    { id: 'c', category: 'arch', keywords: ['system'] },
  ];
  const candidates = identifyMergeCandidates(notes);
  assert.ok(candidates.length >= 1);
  assert.ok(candidates[0].notes.length >= 2);
})) passed += 1; else failed += 1;

if (test('identifyMergeCandidates returns empty for unique notes', () => {
  const notes = [
    { id: 'a', category: 'debug', keywords: ['x'] },
    { id: 'b', category: 'arch', keywords: ['y'] },
  ];
  const candidates = identifyMergeCandidates(notes);
  assert.strictEqual(candidates.length, 0);
})) passed += 1; else failed += 1;

if (test('planConsolidation separates stale, low-relevance, and active', () => {
  const notes = [
    { id: 'stale', createdAt: '2020-01-01T00:00:00Z', retrievalCount: 0, links: [] },
    { id: 'active', createdAt: new Date().toISOString(), retrievalCount: 10, links: [{}, {}, {}] },
  ];
  const plan = planConsolidation(notes, { staleThresholdDays: 30 });
  assert.ok(plan.stats.totalNotes === 2);
  assert.ok(plan.toArchive.length >= 0);
  assert.ok(plan.stats.activeCount >= 1);
})) passed += 1; else failed += 1;

if (test('cloneForAttempt creates new ids with attemptId prefix', () => {
  const notes = [{ id: 'n1', content: 'test' }];
  const cloned = cloneForAttempt(notes, 'attempt-42');
  assert.strictEqual(cloned.length, 1);
  assert.ok(cloned[0].id.startsWith('attempt-42::'));
  assert.strictEqual(cloned[0].sourceId, 'n1');
  assert.strictEqual(cloned[0].attemptId, 'attempt-42');
  assert.ok(cloned[0].clonedAt);
})) passed += 1; else failed += 1;

if (test('cloneForAttempt preserves original note data', () => {
  const notes = [{ id: 'n1', content: 'hello', tags: ['a'] }];
  const cloned = cloneForAttempt(notes, 'att-1');
  assert.strictEqual(cloned[0].content, 'hello');
  assert.deepStrictEqual(cloned[0].tags, ['a']);
})) passed += 1; else failed += 1;

if (test('applyEvolutionAction STRENGTHEN adds link', () => {
  const note = { id: 'n1', links: [] };
  const action = {
    action: EVOLUTION_ACTIONS.STRENGTHEN,
    targetId: 'n2',
    suggestedEdgeType: 'related_to',
    reason: 'test',
  };
  const updated = applyEvolutionAction(note, action);
  assert.strictEqual(updated.links.length, 1);
  assert.strictEqual(updated.links[0].targetId, 'n2');
  assert.ok(updated.evolutionHistory.length > 0);
})) passed += 1; else failed += 1;

if (test('applyEvolutionAction STRENGTHEN does not duplicate links', () => {
  const note = {
    id: 'n1',
    links: [{ targetId: 'n2', edgeType: 'related_to' }],
  };
  const action = {
    action: EVOLUTION_ACTIONS.STRENGTHEN,
    targetId: 'n2',
    suggestedEdgeType: 'related_to',
    reason: 'test',
  };
  const updated = applyEvolutionAction(note, action);
  assert.strictEqual(updated.links.length, 1);
})) passed += 1; else failed += 1;

if (test('applyEvolutionAction ARCHIVE sets archived flag', () => {
  const note = { id: 'n1' };
  const action = { action: EVOLUTION_ACTIONS.ARCHIVE };
  const updated = applyEvolutionAction(note, action);
  assert.strictEqual(updated.archived, true);
  assert.ok(updated.archivedAt);
})) passed += 1; else failed += 1;

if (test('applyEvolutionAction UPDATE_NEIGHBOR merges tags', () => {
  const note = { id: 'n1', tags: ['a'] };
  const action = {
    action: EVOLUTION_ACTIONS.UPDATE_NEIGHBOR,
    suggestedTags: ['a', 'b', 'c'],
  };
  const updated = applyEvolutionAction(note, action);
  assert.ok(updated.tags.includes('a'));
  assert.ok(updated.tags.includes('b'));
  assert.ok(updated.tags.includes('c'));
})) passed += 1; else failed += 1;

if (test('DEFAULT_STALE_THRESHOLD_DAYS is positive', () => {
  assert.ok(DEFAULT_STALE_THRESHOLD_DAYS > 0);
})) passed += 1; else failed += 1;

// NEW: Test MERGE action (ported from vibe-kanban)
if (test('applyEvolutionAction MERGE marks note as merged', () => {
  const note = { id: 'n1', content: 'original' };
  const action = {
    action: EVOLUTION_ACTIONS.MERGE,
    primaryId: 'n2',
  };
  const updated = applyEvolutionAction(note, action);
  assert.strictEqual(updated.merged, true);
  assert.strictEqual(updated.mergedInto, 'n2');
  assert.ok(updated.mergedAt);
})) passed += 1; else failed += 1;

if (test('applyEvolutionAction MERGE uses targetId when primaryId missing', () => {
  const note = { id: 'n1', content: 'original' };
  const action = {
    action: EVOLUTION_ACTIONS.MERGE,
    targetId: 'n3',
  };
  const updated = applyEvolutionAction(note, action);
  assert.strictEqual(updated.merged, true);
  assert.strictEqual(updated.mergedInto, 'n3');
})) passed += 1; else failed += 1;

if (test('applyEvolutionAction MERGE does not mutate original note', () => {
  const note = { id: 'n1', content: 'original' };
  const action = { action: EVOLUTION_ACTIONS.MERGE, primaryId: 'n2' };
  const updated = applyEvolutionAction(note, action);
  assert.strictEqual(note.merged, undefined);
  assert.strictEqual(updated.merged, true);
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
