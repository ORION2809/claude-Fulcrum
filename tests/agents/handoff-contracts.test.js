#!/usr/bin/env node
'use strict';

const assert = require('assert');

const {
  CONTRACT_STATUSES,
  VERIFICATION_METHODS,
  DEFAULT_CONTRACTS,
  createContract,
  validateHandoff,
  createLedger,
  addStep,
  startStep,
  completeStep,
  failStep,
  canStartStep,
  getLedgerSummary,
} = require('../../scripts/lib/handoff-contracts');

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

console.log('\nHandoff Contracts Tests (Phase 6.4)');
console.log('====================================\n');

let passed = 0;
let failed = 0;

// --- Constants ---

if (test('CONTRACT_STATUSES has 5 statuses', () => {
  assert.strictEqual(Object.keys(CONTRACT_STATUSES).length, 5);
  assert.strictEqual(CONTRACT_STATUSES.PENDING, 'pending');
  assert.strictEqual(CONTRACT_STATUSES.IN_PROGRESS, 'in_progress');
  assert.strictEqual(CONTRACT_STATUSES.COMPLETED, 'completed');
  assert.strictEqual(CONTRACT_STATUSES.FAILED, 'failed');
  assert.strictEqual(CONTRACT_STATUSES.SKIPPED, 'skipped');
})) passed += 1; else failed += 1;

if (test('VERIFICATION_METHODS has 6 methods', () => {
  assert.strictEqual(Object.keys(VERIFICATION_METHODS).length, 6);
  assert.ok(VERIFICATION_METHODS.TEST_PASS);
  assert.ok(VERIFICATION_METHODS.BUILD_SUCCESS);
  assert.strictEqual(VERIFICATION_METHODS.NONE, 'none');
})) passed += 1; else failed += 1;

if (test('DEFAULT_CONTRACTS has 5 role contracts', () => {
  assert.ok(DEFAULT_CONTRACTS.planner);
  assert.ok(DEFAULT_CONTRACTS.implementer);
  assert.ok(DEFAULT_CONTRACTS.tester);
  assert.ok(DEFAULT_CONTRACTS.reviewer);
  assert.ok(DEFAULT_CONTRACTS['security-reviewer']);
})) passed += 1; else failed += 1;

// --- createContract ---

if (test('createContract returns frozen immutable contract', () => {
  const c = createContract('custom', {
    inputs: ['a', 'b'],
    outputs: ['c'],
    allowedMutations: ['src/'],
    verificationMethod: 'test_pass',
  });
  assert.strictEqual(c.role, 'custom');
  assert.deepStrictEqual([...c.inputs], ['a', 'b']);
  assert.deepStrictEqual([...c.outputs], ['c']);
  assert.ok(Object.isFrozen(c));
  assert.ok(Object.isFrozen(c.inputs));
})) passed += 1; else failed += 1;

if (test('createContract defaults empty arrays', () => {
  const c = createContract('minimal', {});
  assert.deepStrictEqual([...c.inputs], []);
  assert.deepStrictEqual([...c.outputs], []);
  assert.deepStrictEqual([...c.allowedMutations], []);
  assert.strictEqual(c.verificationMethod, 'none');
})) passed += 1; else failed += 1;

// --- DEFAULT_CONTRACTS details ---

if (test('planner contract has correct inputs/outputs', () => {
  const c = DEFAULT_CONTRACTS.planner;
  assert.ok(c.inputs.includes('task_description'));
  assert.ok(c.outputs.includes('implementation_plan'));
  assert.strictEqual(c.verificationMethod, 'manual_review');
})) passed += 1; else failed += 1;

if (test('tester contract requires 80% coverage postcondition', () => {
  const c = DEFAULT_CONTRACTS.tester;
  assert.ok(c.postconditions.some(p => p.includes('coverage')));
  assert.strictEqual(c.verificationMethod, 'coverage_threshold');
})) passed += 1; else failed += 1;

if (test('reviewer contract has empty allowedMutations', () => {
  const c = DEFAULT_CONTRACTS.reviewer;
  assert.strictEqual(c.allowedMutations.length, 0);
})) passed += 1; else failed += 1;

// --- validateHandoff ---

if (test('validateHandoff succeeds with all required artifacts', () => {
  const result = validateHandoff('planner', 'implementer', {
    implementation_plan: { phases: [] },
    target_files: ['a.js'],
  });
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.errors.length, 0);
})) passed += 1; else failed += 1;

if (test('validateHandoff fails when missing required inputs', () => {
  const result = validateHandoff('planner', 'implementer', {
    // implementation_plan missing
    target_files: ['a.js'],
  });
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('implementation_plan')));
})) passed += 1; else failed += 1;

if (test('validateHandoff fails for unknown source role', () => {
  const result = validateHandoff('unknown-role', 'implementer', {});
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors[0].includes('no contract'));
})) passed += 1; else failed += 1;

if (test('validateHandoff fails for unknown target role', () => {
  const result = validateHandoff('planner', 'unknown-role', {});
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors[0].includes('no contract'));
})) passed += 1; else failed += 1;

if (test('validateHandoff detects postcondition failures', () => {
  const result = validateHandoff('planner', 'implementer', {
    implementation_plan: {},
    target_files: [],
    _postconditionsFailed: ['plan has at least one phase'],
  });
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('postcondition')));
})) passed += 1; else failed += 1;

// --- Ledger Operations ---

if (test('createLedger creates empty pending ledger', () => {
  const ledger = createLedger('feature-workflow');
  assert.strictEqual(ledger.workflowName, 'feature-workflow');
  assert.strictEqual(ledger.status, 'pending');
  assert.strictEqual(ledger.steps.length, 0);
})) passed += 1; else failed += 1;

if (test('addStep adds a step with correct defaults', () => {
  const ledger = createLedger('wf');
  const updated = addStep(ledger, { role: 'planner', description: 'Create plan' });
  assert.strictEqual(updated.steps.length, 1);
  assert.strictEqual(updated.steps[0].id, 'step-1');
  assert.strictEqual(updated.steps[0].role, 'planner');
  assert.strictEqual(updated.steps[0].status, 'pending');
  assert.strictEqual(updated.steps[0].startedAt, null);
  // Original not mutated
  assert.strictEqual(ledger.steps.length, 0);
})) passed += 1; else failed += 1;

if (test('startStep sets IN_PROGRESS and startedAt', () => {
  let ledger = createLedger('wf');
  ledger = addStep(ledger, { role: 'planner' });
  ledger = startStep(ledger, 'step-1');
  assert.strictEqual(ledger.steps[0].status, 'in_progress');
  assert.ok(ledger.steps[0].startedAt !== null);
  assert.strictEqual(ledger.status, 'in_progress');
})) passed += 1; else failed += 1;

if (test('completeStep sets COMPLETED with outputs', () => {
  let ledger = createLedger('wf');
  ledger = addStep(ledger, { role: 'planner' });
  ledger = startStep(ledger, 'step-1');
  ledger = completeStep(ledger, 'step-1', { plan: 'done' });
  assert.strictEqual(ledger.steps[0].status, 'completed');
  assert.deepStrictEqual(ledger.steps[0].outputs, { plan: 'done' });
  assert.ok(ledger.steps[0].completedAt !== null);
})) passed += 1; else failed += 1;

if (test('completeStep marks ledger COMPLETED when all steps done', () => {
  let ledger = createLedger('wf');
  ledger = addStep(ledger, { role: 'a' });
  ledger = addStep(ledger, { role: 'b' });
  ledger = completeStep(ledger, 'step-1');
  assert.notStrictEqual(ledger.status, 'completed');
  ledger = completeStep(ledger, 'step-2');
  assert.strictEqual(ledger.status, 'completed');
})) passed += 1; else failed += 1;

if (test('failStep sets FAILED with error', () => {
  let ledger = createLedger('wf');
  ledger = addStep(ledger, { role: 'tester' });
  ledger = failStep(ledger, 'step-1', 'tests failed');
  assert.strictEqual(ledger.steps[0].status, 'failed');
  assert.strictEqual(ledger.steps[0].error, 'tests failed');
  assert.strictEqual(ledger.status, 'failed');
})) passed += 1; else failed += 1;

// --- canStartStep ---

if (test('canStartStep returns true when dependencies met', () => {
  let ledger = createLedger('wf');
  ledger = addStep(ledger, { role: 'planner' });
  ledger = addStep(ledger, { role: 'implementer', dependencies: ['step-1'] });
  ledger = completeStep(ledger, 'step-1');
  const { canStart } = canStartStep(ledger, 'step-2');
  assert.strictEqual(canStart, true);
})) passed += 1; else failed += 1;

if (test('canStartStep blocks on incomplete dependency', () => {
  let ledger = createLedger('wf');
  ledger = addStep(ledger, { role: 'planner' });
  ledger = addStep(ledger, { role: 'implementer', dependencies: ['step-1'] });
  const { canStart, reason } = canStartStep(ledger, 'step-2');
  assert.strictEqual(canStart, false);
  assert.ok(reason.includes('step-1'));
})) passed += 1; else failed += 1;

if (test('canStartStep fails for already-started step', () => {
  let ledger = createLedger('wf');
  ledger = addStep(ledger, { role: 'a' });
  ledger = startStep(ledger, 'step-1');
  const { canStart } = canStartStep(ledger, 'step-1');
  assert.strictEqual(canStart, false);
})) passed += 1; else failed += 1;

if (test('canStartStep fails for non-existent step', () => {
  const ledger = createLedger('wf');
  const { canStart } = canStartStep(ledger, 'step-999');
  assert.strictEqual(canStart, false);
})) passed += 1; else failed += 1;

// --- getLedgerSummary ---

if (test('getLedgerSummary returns correct counts', () => {
  let ledger = createLedger('wf');
  ledger = addStep(ledger, { role: 'a' });
  ledger = addStep(ledger, { role: 'b' });
  ledger = addStep(ledger, { role: 'c' });
  ledger = completeStep(ledger, 'step-1');
  ledger = startStep(ledger, 'step-2');
  const summary = getLedgerSummary(ledger);
  assert.strictEqual(summary.totalSteps, 3);
  assert.strictEqual(summary.statusCounts.completed, 1);
  assert.strictEqual(summary.statusCounts.in_progress, 1);
  assert.strictEqual(summary.statusCounts.pending, 1);
})) passed += 1; else failed += 1;

// --- Immutability ---

if (test('ledger operations are immutable', () => {
  const ledger = createLedger('wf');
  const updated = addStep(ledger, { role: 'a' });
  assert.notStrictEqual(ledger, updated);
  assert.strictEqual(ledger.steps.length, 0);
  assert.strictEqual(updated.steps.length, 1);

  const started = startStep(updated, 'step-1');
  assert.notStrictEqual(updated, started);
  assert.strictEqual(updated.steps[0].status, 'pending');
  assert.strictEqual(started.steps[0].status, 'in_progress');
})) passed += 1; else failed += 1;

// --- Summary ---

console.log(`\n${passed} passed, ${failed} failed`);
console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exitCode = 1;
