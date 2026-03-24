'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  TASK_STATUS,
  createTask,
  loadBoard,
  saveBoard,
  attachAttempt,
  addFeedback,
} = require('../../scripts/lib/parallel-board');

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

console.log('\nParallel Board Tests');
console.log('====================\n');

let passed = 0;
let failed = 0;

if (test('createTask builds a todo task with preferred agents', () => {
  const task = createTask({
    title: 'Auth spike',
    preferredAgents: ['claude', 'codex'],
  });
  assert.strictEqual(task.status, TASK_STATUS.TODO);
  assert.deepStrictEqual(task.preferredAgents, ['claude', 'codex']);
  assert.ok(Array.isArray(task.attempts));
})) passed += 1; else failed += 1;

if (test('attachAttempt links an attempt and moves task to running', () => {
  const board = { version: 1, tasks: [createTask({ id: 'task-1', title: 'Auth spike' })] };
  const updated = attachAttempt(board, 'task-1', {
    attemptId: 'attempt-1',
    groupId: 'group-1',
    agentName: 'codex',
  });
  assert.strictEqual(updated.tasks[0].status, TASK_STATUS.RUNNING);
  assert.strictEqual(updated.tasks[0].attempts[0].attemptId, 'attempt-1');
})) passed += 1; else failed += 1;

if (test('addFeedback records feedback and moves task to review', () => {
  const board = {
    version: 1,
    tasks: [createTask({
      id: 'task-1',
      title: 'Auth spike',
      attempts: [{ attemptId: 'attempt-1' }],
    })],
  };
  const updated = addFeedback(board, 'task-1', {
    attemptId: 'attempt-1',
    message: 'Prefer the cleaner diff',
  });
  assert.strictEqual(updated.tasks[0].status, TASK_STATUS.REVIEW);
  assert.strictEqual(updated.tasks[0].feedback.length, 1);
})) passed += 1; else failed += 1;

if (test('saveBoard and loadBoard persist tasks', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-board-'));
  try {
    const board = {
      version: 1,
      tasks: [createTask({ id: 'task-1', title: 'Persisted task' })],
    };
    saveBoard(board, repoRoot);
    const loaded = loadBoard(repoRoot);
    assert.strictEqual(loaded.tasks.length, 1);
    assert.strictEqual(loaded.tasks[0].title, 'Persisted task');
    assert.ok(fs.existsSync(path.join(repoRoot, '.orchestration', 'board', 'tasks.json')));
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
