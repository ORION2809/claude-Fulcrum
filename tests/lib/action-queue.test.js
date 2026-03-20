'use strict';

const assert = require('assert');

const {
  ACTION_STATUS,
  RECOVERY_MODE,
  createQueuedAction,
  enqueueAction,
  claimNextAction,
  completeAction,
  retryAction,
  buildRetryPlan,
  buildResetPlan,
  applyRetryPlan,
  applyResetPlan,
  getQueueStats,
  killRunningActions,
  resetGitState,
} = require('../../scripts/lib/action-queue');

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

console.log('\nAction Queue Tests');
console.log('==================\n');

let passed = 0;
let failed = 0;

if (test('ACTION_STATUS is frozen with expected values', () => {
  assert.ok(Object.isFrozen(ACTION_STATUS));
  assert.strictEqual(ACTION_STATUS.QUEUED, 'queued');
  assert.strictEqual(ACTION_STATUS.IN_PROGRESS, 'in_progress');
  assert.strictEqual(ACTION_STATUS.COMPLETED, 'completed');
  assert.strictEqual(ACTION_STATUS.FAILED, 'failed');
  assert.strictEqual(ACTION_STATUS.SKIPPED, 'skipped');
})) passed += 1; else failed += 1;

if (test('RECOVERY_MODE is frozen with expected values', () => {
  assert.ok(Object.isFrozen(RECOVERY_MODE));
  assert.strictEqual(RECOVERY_MODE.RETRY, 'retry');
  assert.strictEqual(RECOVERY_MODE.RESET, 'reset');
})) passed += 1; else failed += 1;

if (test('createQueuedAction creates valid action', () => {
  const action = createQueuedAction('run tests', { priority: 5, maxRetries: 2 });
  assert.ok(action.id);
  assert.strictEqual(action.description, 'run tests');
  assert.strictEqual(action.status, ACTION_STATUS.QUEUED);
  assert.strictEqual(action.priority, 5);
  assert.strictEqual(action.maxRetries, 2);
  assert.strictEqual(action.retryCount, 0);
  assert.ok(action.createdAt);
  assert.strictEqual(action.startedAt, null);
  assert.strictEqual(action.completedAt, null);
})) passed += 1; else failed += 1;

if (test('createQueuedAction defaults priority to 0', () => {
  const action = createQueuedAction('test');
  assert.strictEqual(action.priority, 0);
  assert.strictEqual(action.maxRetries, 3);
})) passed += 1; else failed += 1;

if (test('enqueueAction sorts by priority descending', () => {
  const a1 = createQueuedAction('low', { priority: 1 });
  const a2 = createQueuedAction('high', { priority: 10 });
  const queue = enqueueAction([a1], a2);
  assert.strictEqual(queue[0].description, 'high');
  assert.strictEqual(queue[1].description, 'low');
})) passed += 1; else failed += 1;

if (test('claimNextAction claims first available queued action', () => {
  const a1 = createQueuedAction('first', { priority: 5 });
  const a2 = createQueuedAction('second', { priority: 3 });
  const queue = [a1, a2];
  const { queue: updated, claimed } = claimNextAction(queue);
  assert.ok(claimed);
  assert.strictEqual(claimed.status, ACTION_STATUS.IN_PROGRESS);
  assert.ok(claimed.startedAt);
})) passed += 1; else failed += 1;

if (test('claimNextAction respects dependencies', () => {
  const a1 = createQueuedAction('first');
  const a2 = createQueuedAction('second', { dependsOn: [a1.id] });
  const queue = [a1, a2];
  const { claimed } = claimNextAction(queue);
  assert.strictEqual(claimed.id, a1.id);
})) passed += 1; else failed += 1;

if (test('claimNextAction returns null when no actions available', () => {
  const { claimed } = claimNextAction([]);
  assert.strictEqual(claimed, null);
})) passed += 1; else failed += 1;

if (test('completeAction marks action as completed', () => {
  const a = createQueuedAction('test');
  const queue = [{ ...a, status: ACTION_STATUS.IN_PROGRESS }];
  const updated = completeAction(queue, a.id, { success: true });
  assert.strictEqual(updated[0].status, ACTION_STATUS.COMPLETED);
  assert.ok(updated[0].completedAt);
})) passed += 1; else failed += 1;

if (test('completeAction marks failed on success=false', () => {
  const a = createQueuedAction('test');
  const queue = [{ ...a, status: ACTION_STATUS.IN_PROGRESS }];
  const updated = completeAction(queue, a.id, { success: false });
  assert.strictEqual(updated[0].status, ACTION_STATUS.FAILED);
})) passed += 1; else failed += 1;

if (test('retryAction requeues and increments retryCount', () => {
  const a = createQueuedAction('test', { maxRetries: 3 });
  const queue = [{ ...a, status: ACTION_STATUS.FAILED, retryCount: 0 }];
  const updated = retryAction(queue, a.id);
  assert.strictEqual(updated[0].status, ACTION_STATUS.QUEUED);
  assert.strictEqual(updated[0].retryCount, 1);
})) passed += 1; else failed += 1;

if (test('retryAction skips when max retries exceeded', () => {
  const a = createQueuedAction('test', { maxRetries: 2 });
  const queue = [{ ...a, status: ACTION_STATUS.FAILED, retryCount: 2 }];
  const updated = retryAction(queue, a.id);
  assert.strictEqual(updated[0].status, ACTION_STATUS.SKIPPED);
})) passed += 1; else failed += 1;

if (test('buildRetryPlan creates valid plan from checkpoint', () => {
  const a1 = createQueuedAction('step1');
  const a2 = createQueuedAction('step2');
  const queue = [
    { ...a1, status: ACTION_STATUS.COMPLETED },
    { ...a2, status: ACTION_STATUS.FAILED },
  ];
  const plan = buildRetryPlan(queue, a2.id);
  assert.strictEqual(plan.valid, true);
  assert.strictEqual(plan.mode, RECOVERY_MODE.RETRY);
  assert.ok(plan.actionsToRetry.includes(a2.id));
})) passed += 1; else failed += 1;

if (test('buildRetryPlan returns invalid for missing checkpoint', () => {
  const plan = buildRetryPlan([], 'nonexistent');
  assert.strictEqual(plan.valid, false);
})) passed += 1; else failed += 1;

if (test('buildResetPlan identifies actions to discard', () => {
  const a1 = createQueuedAction('keep');
  const a2 = createQueuedAction('discard');
  const queue = [a1, a2];
  const plan = buildResetPlan(queue, a2.id, { resetGitState: true, gitRef: 'HEAD~1' });
  assert.strictEqual(plan.valid, true);
  assert.strictEqual(plan.mode, RECOVERY_MODE.RESET);
  assert.ok(plan.actionsToDiscard.includes(a2.id));
  assert.strictEqual(plan.resetGitState, true);
  assert.strictEqual(plan.gitRef, 'HEAD~1');
})) passed += 1; else failed += 1;

if (test('buildResetPlan returns invalid for missing action', () => {
  const plan = buildResetPlan([], 'nonexistent');
  assert.strictEqual(plan.valid, false);
})) passed += 1; else failed += 1;

if (test('applyRetryPlan requeues specified actions', () => {
  const a = createQueuedAction('test');
  const queue = [{ ...a, status: ACTION_STATUS.FAILED }];
  const plan = { valid: true, actionsToRetry: [a.id] };
  const updated = applyRetryPlan(queue, plan);
  assert.strictEqual(updated[0].status, ACTION_STATUS.QUEUED);
  assert.strictEqual(updated[0].retryCount, 1);
})) passed += 1; else failed += 1;

if (test('applyRetryPlan does nothing for invalid plan', () => {
  const a = createQueuedAction('test');
  const queue = [{ ...a, status: ACTION_STATUS.FAILED }];
  const updated = applyRetryPlan(queue, { valid: false });
  assert.strictEqual(updated[0].status, ACTION_STATUS.FAILED);
})) passed += 1; else failed += 1;

if (test('applyResetPlan removes discarded actions', () => {
  const a1 = createQueuedAction('keep');
  const a2 = createQueuedAction('discard');
  const queue = [a1, a2];
  const plan = { valid: true, actionsToDiscard: [a2.id] };
  const updated = applyResetPlan(queue, plan);
  assert.strictEqual(updated.length, 2);
  assert.strictEqual(updated[0].id, a1.id);
  assert.strictEqual(updated[0].dropped, undefined);
  assert.strictEqual(updated[1].dropped, true);
  assert.strictEqual(updated[1].status, ACTION_STATUS.SKIPPED);
})) passed += 1; else failed += 1;

if (test('getQueueStats returns correct counts', () => {
  const queue = [
    { status: ACTION_STATUS.QUEUED },
    { status: ACTION_STATUS.QUEUED },
    { status: ACTION_STATUS.IN_PROGRESS },
    { status: ACTION_STATUS.COMPLETED },
    { status: ACTION_STATUS.COMPLETED },
    { status: ACTION_STATUS.COMPLETED },
    { status: ACTION_STATUS.FAILED },
    { status: ACTION_STATUS.SKIPPED },
  ];
  const stats = getQueueStats(queue);
  assert.strictEqual(stats.total, 8);
  assert.strictEqual(stats.queued, 2);
  assert.strictEqual(stats.inProgress, 1);
  assert.strictEqual(stats.completed, 3);
  assert.strictEqual(stats.failed, 1);
  assert.strictEqual(stats.skipped, 1);
})) passed += 1; else failed += 1;

// NEW: Tests for KILLED status, soft-delete, killRunningActions (vibe-kanban)
if (test('ACTION_STATUS includes KILLED', () => {
  assert.ok(ACTION_STATUS.KILLED);
  assert.strictEqual(ACTION_STATUS.KILLED, 'killed');
})) passed += 1; else failed += 1;

if (test('killRunningActions transitions IN_PROGRESS to KILLED', () => {
  const queue = [
    { id: 'a1', status: ACTION_STATUS.IN_PROGRESS },
    { id: 'a2', status: ACTION_STATUS.QUEUED },
    { id: 'a3', status: ACTION_STATUS.IN_PROGRESS },
    { id: 'a4', status: ACTION_STATUS.COMPLETED },
  ];
  const result = killRunningActions(queue);
  const killed = result.filter(a => a.status === ACTION_STATUS.KILLED);
  assert.strictEqual(killed.length, 2);
  // QUEUED and COMPLETED should be unchanged
  assert.strictEqual(result.find(a => a.id === 'a2').status, ACTION_STATUS.QUEUED);
  assert.strictEqual(result.find(a => a.id === 'a4').status, ACTION_STATUS.COMPLETED);
})) passed += 1; else failed += 1;

if (test('applyResetPlan uses soft-delete with dropped flag', () => {
  const queue = [
    { id: 'a1', status: ACTION_STATUS.IN_PROGRESS },
    { id: 'a2', status: ACTION_STATUS.QUEUED },
  ];
  const plan = { valid: true, mode: RECOVERY_MODE.RESET, actionsToDiscard: ['a1', 'a2'] };
  const result = applyResetPlan(queue, plan);
  // IN_PROGRESS should become KILLED with dropped:true
  const a1 = result.find(a => a.id === 'a1');
  assert.strictEqual(a1.status, ACTION_STATUS.KILLED);
  assert.strictEqual(a1.dropped, true);
  assert.ok(a1.droppedAt);
  // QUEUED should become SKIPPED with dropped:true
  const a2 = result.find(a => a.id === 'a2');
  assert.strictEqual(a2.status, ACTION_STATUS.SKIPPED);
  assert.strictEqual(a2.dropped, true);
})) passed += 1; else failed += 1;

if (test('getQueueStats includes killed and dropped counts', () => {
  const queue = [
    { status: ACTION_STATUS.KILLED, dropped: true },
    { status: ACTION_STATUS.KILLED, dropped: true },
    { status: ACTION_STATUS.SKIPPED, dropped: true },
    { status: ACTION_STATUS.COMPLETED },
    { status: ACTION_STATUS.IN_PROGRESS },
  ];
  const stats = getQueueStats(queue);
  assert.strictEqual(stats.killed, 2);
  assert.strictEqual(stats.dropped, 3);
  assert.strictEqual(stats.active, 2);
})) passed += 1; else failed += 1;

if (test('killRunningActions does not mutate original queue', () => {
  const queue = [
    { id: 'a1', status: ACTION_STATUS.IN_PROGRESS },
  ];
  const result = killRunningActions(queue);
  assert.strictEqual(queue[0].status, ACTION_STATUS.IN_PROGRESS);
  assert.strictEqual(result[0].status, ACTION_STATUS.KILLED);
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
