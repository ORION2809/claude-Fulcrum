'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'attempt-group-cli.js');
const ECC_SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'ecc.js');

function run(args, options = {}) {
  try {
    const stdout = execFileSync('node', [SCRIPT, ...args], {
      cwd: options.cwd || process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60000,
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

console.log('\nAttempt Group CLI Tests');
console.log('=======================\n');

let passed = 0;
let failed = 0;

if (test('create generates isolated attempts and a board task', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-attempt-group-create-'));
  const repoRoot = setupRepo(tempRoot);
  const worktreeRoot = path.join(tempRoot, 'worktrees');
  fs.mkdirSync(worktreeRoot, { recursive: true });

  try {
    const result = run(['create', 'auth spike', '--task', 'Implement auth flow', '--agents', 'claude,codex', '--worktree-root', worktreeRoot, '--json'], {
      cwd: repoRoot,
    });
    assert.strictEqual(result.code, 0, result.stderr);
    const payload = JSON.parse(result.stdout);
    assert.strictEqual(payload.attempts.length, 2);
    assert.ok(fs.existsSync(payload.manifestPath));
    const boardPath = path.join(repoRoot, '.orchestration', 'board', 'tasks.json');
    assert.ok(fs.existsSync(boardPath));
    const board = JSON.parse(fs.readFileSync(boardPath, 'utf8'));
    assert.strictEqual(board.tasks.length, 1);
    assert.strictEqual(board.tasks[0].attempts.length, 2);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

if (test('compare writes comparison artifacts for grouped attempts', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-attempt-group-compare-'));
  const repoRoot = setupRepo(tempRoot);
  const worktreeRoot = path.join(tempRoot, 'worktrees');
  fs.mkdirSync(worktreeRoot, { recursive: true });

  try {
    const created = run(['create', 'auth spike', '--task', 'Implement auth flow', '--agents', 'claude,codex', '--worktree-root', worktreeRoot, '--json'], {
      cwd: repoRoot,
    });
    const payload = JSON.parse(created.stdout);

    const claudeAttempt = payload.attempts.find(item => item.agentName === 'claude');
    const codexAttempt = payload.attempts.find(item => item.agentName === 'codex');
    fs.writeFileSync(path.join(claudeAttempt.worktreePath, 'claude.txt'), 'claude\n', 'utf8');
    execFileSync('git', ['add', 'claude.txt'], { cwd: claudeAttempt.worktreePath, stdio: 'ignore' });
    execFileSync('git', ['commit', '-m', 'claude change'], { cwd: claudeAttempt.worktreePath, stdio: 'ignore' });

    fs.writeFileSync(path.join(codexAttempt.worktreePath, 'codex.txt'), 'codex\n', 'utf8');
    execFileSync('git', ['add', 'codex.txt'], { cwd: codexAttempt.worktreePath, stdio: 'ignore' });
    execFileSync('git', ['commit', '-m', 'codex change'], { cwd: codexAttempt.worktreePath, stdio: 'ignore' });

    const compared = run(['compare', payload.groupId, '--json'], { cwd: repoRoot });
    assert.strictEqual(compared.code, 0, compared.stderr);
    const comparison = JSON.parse(compared.stdout);
    assert.strictEqual(comparison.attempts.length, 2);
    assert.ok(fs.existsSync(comparison.comparisonJsonPath));
    assert.ok(fs.existsSync(comparison.comparisonMdPath));
    assert.ok(comparison.pairs.length >= 1);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

if (test('feedback stores review notes for a grouped attempt', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-attempt-group-feedback-'));
  const repoRoot = setupRepo(tempRoot);
  const worktreeRoot = path.join(tempRoot, 'worktrees');
  fs.mkdirSync(worktreeRoot, { recursive: true });

  try {
    const created = run(['create', 'auth spike', '--task', 'Implement auth flow', '--agents', 'claude,codex', '--worktree-root', worktreeRoot, '--json'], {
      cwd: repoRoot,
    });
    const payload = JSON.parse(created.stdout);
    const attemptId = payload.attempts[0].id;

    const feedback = run(['feedback', payload.groupId, attemptId, 'Prefer', 'this', 'approach', '--json'], {
      cwd: repoRoot,
    });
    assert.strictEqual(feedback.code, 0, feedback.stderr);
    const feedbackPayload = JSON.parse(feedback.stdout);
    assert.ok(fs.existsSync(feedbackPayload.feedbackPath));

    const board = JSON.parse(fs.readFileSync(path.join(repoRoot, '.orchestration', 'board', 'tasks.json'), 'utf8'));
    assert.strictEqual(board.tasks[0].feedback.length, 1);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

if (test('retry creates a new attempt from review feedback', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-attempt-group-retry-'));
  const repoRoot = setupRepo(tempRoot);
  const worktreeRoot = path.join(tempRoot, 'worktrees');
  fs.mkdirSync(worktreeRoot, { recursive: true });

  try {
    const created = run(['create', 'auth spike', '--task', 'Implement auth flow', '--agents', 'claude,codex', '--worktree-root', worktreeRoot, '--json'], {
      cwd: repoRoot,
    });
    const payload = JSON.parse(created.stdout);
    const attemptId = payload.attempts[0].id;

    const retried = run(['retry', payload.groupId, attemptId, 'Refine', 'auth', 'edge-cases', '--json'], {
      cwd: repoRoot,
    });
    assert.strictEqual(retried.code, 0, retried.stderr);
    const retryPayload = JSON.parse(retried.stdout);
    assert.ok(retryPayload.retryAttempt.id);
    assert.strictEqual(retryPayload.sourceAttemptId, attemptId);
    assert.ok(fs.existsSync(retryPayload.manifestPath));

    const manifest = JSON.parse(fs.readFileSync(retryPayload.manifestPath, 'utf8'));
    assert.strictEqual(manifest.attempts.length, 3);
    assert.strictEqual(manifest.attempts[2].retryOf, attemptId);

    const board = JSON.parse(fs.readFileSync(path.join(repoRoot, '.orchestration', 'board', 'tasks.json'), 'utf8'));
    assert.strictEqual(board.tasks[0].attempts.length, 3);
    assert.ok(board.tasks[0].feedback.some(entry => entry.kind === 'retry-request'));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

if (test('ecc CLI exposes attempt-group and parallel-board commands', () => {
  const output = execFileSync('node', [ECC_SCRIPT], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 10000,
  });
  assert.ok(output.includes('attempt-group'));
  assert.ok(output.includes('parallel-board'));
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
