'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const { createParallelBoardServer } = require('../../scripts/parallel-board-server');
const ATTEMPT_SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'attempt-cli.js');
const ECC_SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'ecc.js');

function runAttempt(args, options = {}) {
  try {
    const stdout = execFileSync('node', [ATTEMPT_SCRIPT, ...args], {
      cwd: options.cwd || process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 30000,
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

function setupRepo(tempRoot) {
  const repoRoot = path.join(tempRoot, 'repo');
  fs.mkdirSync(repoRoot, { recursive: true });
  execFileSync('git', ['init'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'ECC Test'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'ecc-test@example.com'], { cwd: repoRoot, stdio: 'ignore' });
  fs.writeFileSync(path.join(repoRoot, 'README.md'), '# temp repo\n', 'utf8');
  execFileSync('git', ['add', 'README.md'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'init'], { cwd: repoRoot, stdio: 'ignore' });
  return repoRoot;
}

async function readUntil(readable, pattern) {
  let buffer = '';
  const reader = readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += Buffer.from(value).toString('utf8');
    if (buffer.includes(pattern)) {
      return buffer;
    }
  }
  return buffer;
}

function test(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`  \u2713 ${name}`);
      return true;
    })
    .catch(error => {
      console.log(`  \u2717 ${name}`);
      console.log(`    Error: ${error.message}`);
      return false;
    });
}

async function main() {
  console.log('\nParallel Board Server Tests');
  console.log('===========================\n');

  let passed = 0;
  let failed = 0;

  if (await test('server exposes health, task APIs, and SSE task events', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-board-server-tasks-'));
    const repoRoot = setupRepo(tempRoot);
    const serverController = createParallelBoardServer({ repoRoot, port: 0, host: '127.0.0.1' });

    try {
      const address = await serverController.start();
      const baseUrl = `http://127.0.0.1:${address.port}`;

      const health = await fetch(`${baseUrl}/health`);
      assert.strictEqual(health.status, 200);
      const healthPayload = await health.json();
      assert.strictEqual(healthPayload.ok, true);

      const homePage = await fetch(`${baseUrl}/`);
      assert.strictEqual(homePage.status, 200);
      const homeHtml = await homePage.text();
      assert.ok(homeHtml.includes('Parallel Execution Board'));

      const eventResponse = await fetch(`${baseUrl}/events`);
      const eventPromise = readUntil(eventResponse.body, 'event: task.created');

      const createTaskResponse = await fetch(`${baseUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Review auth approaches',
          description: 'Compare parallel implementations',
          preferredAgents: ['claude', 'codex'],
        }),
      });
      assert.strictEqual(createTaskResponse.status, 201);
      const createdTaskPayload = await createTaskResponse.json();
      assert.ok(createdTaskPayload.task.id);

      const eventText = await Promise.race([
        eventPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out waiting for SSE task event')), 5000)),
      ]);
      assert.ok(eventText.includes('event: task.created'));
      assert.ok(eventText.includes(createdTaskPayload.task.id));

      const updateStatusResponse = await fetch(`${baseUrl}/tasks/${createdTaskPayload.task.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'review' }),
      });
      assert.strictEqual(updateStatusResponse.status, 200);
      const updatedTaskPayload = await updateStatusResponse.json();
      assert.strictEqual(updatedTaskPayload.task.status, 'review');

      const listResponse = await fetch(`${baseUrl}/tasks`);
      assert.strictEqual(listResponse.status, 200);
      const listPayload = await listResponse.json();
      assert.strictEqual(listPayload.tasks.length, 1);
      assert.strictEqual(listPayload.tasks[0].status, 'review');
    } finally {
      await serverController.stop();
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await test('server appends and reads live attempt logs', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-board-server-logs-'));
    const repoRoot = setupRepo(tempRoot);
    const worktreeRoot = path.join(tempRoot, 'worktrees');
    fs.mkdirSync(worktreeRoot, { recursive: true });
    const serverController = createParallelBoardServer({ repoRoot, port: 0, host: '127.0.0.1' });

    try {
      const address = await serverController.start();
      const baseUrl = `http://127.0.0.1:${address.port}`;

      const created = runAttempt(['create', 'log spike', '--worktree-root', worktreeRoot, '--json'], {
        cwd: repoRoot,
      });
      assert.strictEqual(created.code, 0, created.stderr);
      const attempt = JSON.parse(created.stdout).attempt;

      const eventResponse = await fetch(`${baseUrl}/events`);
      const eventPromise = readUntil(eventResponse.body, 'event: attempt.log-appended');

      const appendResponse = await fetch(`${baseUrl}/attempts/${attempt.id}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'worker started build' }),
      });
      assert.strictEqual(appendResponse.status, 200);
      const appendPayload = await appendResponse.json();
      assert.ok(appendPayload.content.includes('worker started build'));

      const eventText = await Promise.race([
        eventPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out waiting for log SSE event')), 5000)),
      ]);
      assert.ok(eventText.includes('event: attempt.log-appended'));
      assert.ok(eventText.includes(attempt.id));

      const readResponse = await fetch(`${baseUrl}/attempts/${attempt.id}/log`);
      assert.strictEqual(readResponse.status, 200);
      const readPayload = await readResponse.json();
      assert.ok(readPayload.content.includes('worker started build'));
    } finally {
      await serverController.stop();
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await test('server creates, compares, and reads attempt groups', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-board-server-groups-'));
    const repoRoot = setupRepo(tempRoot);
    const worktreeRoot = path.join(tempRoot, 'worktrees');
    const dbPath = path.join(tempRoot, 'state.sqlite');
    fs.mkdirSync(worktreeRoot, { recursive: true });
    const serverController = createParallelBoardServer({ repoRoot, port: 0, host: '127.0.0.1' });

    try {
      const address = await serverController.start();
      const baseUrl = `http://127.0.0.1:${address.port}`;

      const createResponse = await fetch(`${baseUrl}/attempt-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'auth-spike',
          task: 'Implement auth flow',
          agents: ['claude', 'codex'],
          worktreeRoot,
          dbPath,
        }),
      });
      assert.strictEqual(createResponse.status, 201);
      const created = await createResponse.json();
      assert.strictEqual(created.attempts.length, 2);

      const claudeAttempt = created.attempts.find(item => item.agentName === 'claude');
      const codexAttempt = created.attempts.find(item => item.agentName === 'codex');
      fs.writeFileSync(path.join(claudeAttempt.worktreePath, 'claude.txt'), 'claude\n', 'utf8');
      execFileSync('git', ['add', 'claude.txt'], { cwd: claudeAttempt.worktreePath, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', 'claude change'], { cwd: claudeAttempt.worktreePath, stdio: 'ignore' });

      fs.writeFileSync(path.join(codexAttempt.worktreePath, 'codex.txt'), 'codex\n', 'utf8');
      execFileSync('git', ['add', 'codex.txt'], { cwd: codexAttempt.worktreePath, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', 'codex change'], { cwd: codexAttempt.worktreePath, stdio: 'ignore' });

      const compareResponse = await fetch(`${baseUrl}/attempt-groups/${created.groupId}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbPath }),
      });
      assert.strictEqual(compareResponse.status, 200);
      const comparison = await compareResponse.json();
      assert.ok(fs.existsSync(comparison.comparisonJsonPath));
      assert.ok(fs.existsSync(comparison.comparisonMdPath));

      const feedbackResponse = await fetch(`${baseUrl}/attempt-groups/${created.groupId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: claudeAttempt.id,
          message: 'Prefer this direction',
        }),
      });
      assert.strictEqual(feedbackResponse.status, 200);

      const retryResponse = await fetch(`${baseUrl}/attempt-groups/${created.groupId}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: claudeAttempt.id,
          message: 'Refine auth edge-cases',
          dbPath,
          worktreeRoot,
        }),
      });
      assert.strictEqual(retryResponse.status, 200);
      const retryPayload = await retryResponse.json();
      assert.ok(retryPayload.retryAttempt.id);

      const readResponse = await fetch(`${baseUrl}/attempt-groups/${created.groupId}`);
      assert.strictEqual(readResponse.status, 200);
      const state = await readResponse.json();
      assert.strictEqual(state.manifest.groupId, created.groupId);
      assert.ok(Array.isArray(state.feedback));
      assert.strictEqual(state.feedback.length, 2);
      assert.ok(state.comparison);
      assert.strictEqual(state.manifest.attempts.length, 3);

      const reviewResponse = await fetch(`${baseUrl}/attempt-groups/${created.groupId}/review`);
      assert.strictEqual(reviewResponse.status, 200);
      const reviewHtml = await reviewResponse.text();
      assert.ok(reviewHtml.includes(created.groupId));
      assert.ok(reviewHtml.includes('Pairwise File Overlap'));
      assert.ok(reviewHtml.includes('Spawn Retry Attempt'));
    } finally {
      await serverController.stop();
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await test('ecc CLI exposes parallel-board-server command', async () => {
    const output = execFileSync('node', [ECC_SCRIPT], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 10000,
    });
    assert.ok(output.includes('parallel-board-server'));
  })) passed += 1; else failed += 1;

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exitCode = failed > 0 ? 1 : 0;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
