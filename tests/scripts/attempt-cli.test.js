'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'attempt-cli.js');
const ECC_SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'ecc.js');

function run(args, options = {}) {
  try {
    const stdout = execFileSync('node', [SCRIPT, ...args], {
      cwd: options.cwd || process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ...options.env,
      },
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

function runTests() {
  console.log('\n=== Testing attempt-cli.js ===\n');

  let passed = 0;
  let failed = 0;

  if (test('create makes an isolated attempt with worktree, state-store record, and artifacts', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-attempt-create-'));
    const repoRoot = setupRepo(tempRoot);
    const dbPath = path.join(tempRoot, 'state.db');
    const worktreeRoot = path.join(tempRoot, 'worktrees');
    fs.mkdirSync(worktreeRoot, { recursive: true });

    try {
      const result = run(['create', 'feature spike', '--db', dbPath, '--worktree-root', worktreeRoot, '--group-id', 'group-auth', '--agent', 'codex', '--objective', 'Implement auth flow', '--json'], {
        cwd: repoRoot,
      });
      assert.strictEqual(result.code, 0, result.stderr);

      const payload = JSON.parse(result.stdout);
      assert.ok(payload.attempt.id.startsWith('attempt-feature-spike-'));
      assert.ok(payload.attempt.branchName.startsWith('attempt/feature-spike-'));
      assert.ok(fs.existsSync(payload.attempt.worktreePath), 'worktree should exist');
      assert.ok(fs.existsSync(payload.attemptFile), 'attempt artifact should exist');
      assert.ok(fs.existsSync(payload.statusFile), 'status artifact should exist');
      assert.ok(fs.existsSync(payload.queueFile), 'queue file should exist');
      assert.ok(fs.existsSync(payload.logFile), 'log file should exist');
      assert.strictEqual(payload.attempt.metadata.groupId, 'group-auth');
      assert.strictEqual(payload.attempt.metadata.agentName, 'codex');
      assert.strictEqual(payload.attempt.metadata.objective, 'Implement auth flow');
      assert.strictEqual(payload.attempt.metadata.logFile, payload.logFile);

      const status = run(['status', '--db', dbPath, '--json'], { cwd: repoRoot });
      assert.strictEqual(status.code, 0, status.stderr);
      const statusPayload = JSON.parse(status.stdout);
      assert.strictEqual(statusPayload.totalCount, 1);
      assert.strictEqual(statusPayload.recent[0].id, payload.attempt.id);
      assert.strictEqual(statusPayload.recent[0].worktreeExists, true);
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  if (test('rehydrate recreates a deleted worktree for an existing attempt', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-attempt-rehydrate-'));
    const repoRoot = setupRepo(tempRoot);
    const dbPath = path.join(tempRoot, 'state.db');
    const worktreeRoot = path.join(tempRoot, 'worktrees');
    fs.mkdirSync(worktreeRoot, { recursive: true });

    try {
      const created = run(['create', 'bugfix lane', '--db', dbPath, '--worktree-root', worktreeRoot, '--json'], {
        cwd: repoRoot,
      });
      assert.strictEqual(created.code, 0, created.stderr);
      const createdPayload = JSON.parse(created.stdout);

      fs.rmSync(createdPayload.attempt.worktreePath, { recursive: true, force: true });
      assert.ok(!fs.existsSync(createdPayload.attempt.worktreePath), 'worktree should be deleted before rehydrate');

      const rehydrated = run(['rehydrate', createdPayload.attempt.id, '--db', dbPath, '--json'], {
        cwd: repoRoot,
      });
      assert.strictEqual(rehydrated.code, 0, rehydrated.stderr);
      const rehydratedPayload = JSON.parse(rehydrated.stdout);
      assert.strictEqual(rehydratedPayload.rehydrated, true);
      assert.ok(fs.existsSync(rehydratedPayload.attempt.worktreePath), 'rehydrated worktree should exist');
      assert.ok(fs.existsSync(path.join(rehydratedPayload.attempt.worktreePath, '.git')), 'rehydrated worktree should be a git worktree');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  if (test('ecc CLI exposes the attempt command', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-attempt-help-'));
    const repoRoot = setupRepo(tempRoot);

    try {
      const result = execFileSync('node', [ECC_SCRIPT, 'help', 'attempt'], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 10000,
      });
      assert.ok(result.includes('create <name>') || result.includes('Create an isolated attempt'));
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  if (test('ecc top-level help lists the attempt command', () => {
    const result = execFileSync('node', [ECC_SCRIPT], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 10000,
    });
    assert.ok(result.includes('attempt'));
  })) passed++; else failed++;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
