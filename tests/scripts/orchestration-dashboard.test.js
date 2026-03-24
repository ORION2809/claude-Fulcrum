'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'orchestration-dashboard.js');
const {
  collectAttemptGroups,
  findRelatedTask,
  readLogTail,
  renderDashboard,
} = require('../../scripts/orchestration-dashboard');

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

function runCli(args = [], options = {}) {
  try {
    const stdout = execFileSync('node', [SCRIPT, ...args], {
      cwd: options.cwd || process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 10000,
    });
    return { code: 0, stdout, stderr: '' };
  } catch (error) {
    return {
      code: error.status || 1,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    };
  }
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildSnapshot(repoRoot) {
  return {
    sessionName: 'workflow-visual-proof',
    coordinationDir: path.join(repoRoot, '.claude', 'orchestration', 'workflow-visual-proof'),
    sessionActive: true,
    paneCount: 2,
    workerCount: 2,
    workerStates: { running: 1, done: 1 },
    repoRoot,
    panes: [],
    workers: [
      {
        workerSlug: 'claude',
        status: {
          state: 'running',
          branch: 'orchestrator-workflow-visual-proof-claude',
          attemptGroup: 'attempt-group-workflow-visual-proof',
          attemptId: 'attempt-workflow-visual-proof-claude',
        },
        task: {
          attemptGroup: 'attempt-group-workflow-visual-proof',
          attemptId: 'attempt-workflow-visual-proof-claude',
        },
        pane: {
          windowIndex: 0,
          paneIndex: 1,
          currentCommand: 'claude',
          dead: false,
        },
      },
      {
        workerSlug: 'codex',
        status: {
          state: 'done',
          branch: 'orchestrator-workflow-visual-proof-codex',
          attemptGroup: 'attempt-group-workflow-visual-proof',
          attemptId: 'attempt-workflow-visual-proof-codex',
        },
        task: {
          attemptGroup: 'attempt-group-workflow-visual-proof',
          attemptId: 'attempt-workflow-visual-proof-codex',
        },
        pane: {
          windowIndex: 0,
          paneIndex: 2,
          currentCommand: 'codex',
          dead: false,
        },
      }
    ],
  };
}

console.log('\n=== Testing orchestration-dashboard.js ===\n');

let passed = 0;
let failed = 0;

if (test('collectAttemptGroups returns unique attempt-group ids', () => {
  const groups = collectAttemptGroups([
    { status: { attemptGroup: 'group-a' }, task: {} },
    { status: { attemptGroup: 'group-a' }, task: { attemptGroup: 'group-b' } },
  ]);
  assert.deepStrictEqual(groups.sort(), ['group-a', 'group-b']);
})) passed += 1; else failed += 1;

if (test('findRelatedTask selects board task linked to attempt group', () => {
  const task = findRelatedTask({
    tasks: [
      { id: 'task-1', metadata: { attemptGroupId: 'group-a' } },
      { id: 'task-2', metadata: { attemptGroupId: 'group-b' } },
    ]
  }, ['group-b']);
  assert.strictEqual(task.id, 'task-2');
})) passed += 1; else failed += 1;

if (test('readLogTail returns trailing non-empty lines from attempt log', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-dashboard-log-'));
  try {
    writeFile(
      path.join(repoRoot, '.orchestration', 'attempts', 'attempt-alpha', 'attempt.log'),
      'line one\n\nline two\nline three\n'
    );
    assert.deepStrictEqual(readLogTail(repoRoot, 'attempt-alpha', 2), ['line two', 'line three']);
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

if (test('renderDashboard includes session summary, workers, and task details', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-dashboard-render-'));
  try {
    writeFile(
      path.join(repoRoot, '.orchestration', 'attempts', 'attempt-workflow-visual-proof-claude', 'attempt.log'),
      'planning\ncoding\n'
    );
    writeFile(
      path.join(repoRoot, '.orchestration', 'board', 'tasks.json'),
      `${JSON.stringify({
        version: 1,
        updatedAt: new Date().toISOString(),
        tasks: [{
          id: 'task-demo',
          title: 'Auth Workflow',
          objective: 'Implement auth flow',
          status: 'running',
          preferredAgents: ['claude', 'codex'],
          attempts: [{ attemptId: 'attempt-workflow-visual-proof-claude' }],
          feedback: [{ message: 'Check token refresh edge cases.' }],
          metadata: { attemptGroupId: 'attempt-group-workflow-visual-proof' }
        }]
      }, null, 2)}\n`
    );

    const output = renderDashboard(buildSnapshot(repoRoot));
    assert.match(output, /ECC Orchestration Dashboard/);
    assert.match(output, /Auth Workflow/);
    assert.match(output, /claude/);
    assert.match(output, /coding/);
    assert.match(output, /Check token refresh edge cases\./);
    assert.match(output, /tmux attach -t workflow-visual-proof/);
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

if (test('CLI renders dashboard for a plan-backed orchestration snapshot', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-dashboard-cli-'));
  try {
    const planPath = path.join(repoRoot, 'workflow.json');
    const coordinationDir = path.join(repoRoot, '.claude', 'orchestration', 'workflow-visual-proof', 'claude');
    writeFile(planPath, JSON.stringify({
      sessionName: 'workflow-visual-proof',
      repoRoot,
      coordinationRoot: path.join(repoRoot, '.claude', 'orchestration')
    }, null, 2));
    writeFile(path.join(coordinationDir, 'status.md'), [
      '# Status: claude',
      '',
      '- State: running',
      '- Attempt group: `attempt-group-workflow-visual-proof`',
      '- Attempt: `attempt-workflow-visual-proof-claude`',
      '- Branch: `orchestrator-workflow-visual-proof-claude`',
      `- Worktree: \`${path.join(repoRoot, 'worker-claude')}\``
    ].join('\n'));
    writeFile(path.join(coordinationDir, 'task.md'), [
      '# Worker Task: claude',
      '',
      '- Attempt group: `attempt-group-workflow-visual-proof`',
      '- Attempt: `attempt-workflow-visual-proof-claude`',
      '',
      '## Objective',
      'Implement auth flow'
    ].join('\n'));
    writeFile(path.join(coordinationDir, 'handoff.md'), '# Handoff: claude\n');
    writeFile(
      path.join(repoRoot, '.orchestration', 'attempts', 'attempt-workflow-visual-proof-claude', 'attempt.log'),
      'booting worker\n'
    );

    const result = runCli([planPath], { cwd: repoRoot });
    assert.strictEqual(result.code, 0, result.stderr);
    assert.match(result.stdout, /workflow-visual-proof/);
    assert.match(result.stdout, /booting worker/);
    assert.match(result.stdout, /No linked board task found/);
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
process.exitCode = failed > 0 ? 1 : 0;
