'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'orchestrate-worktrees.js');

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

console.log('\nOrchestrate Worktrees Tests');
console.log('===========================\n');

let passed = 0;
let failed = 0;

if (test('write-only auto-engages the board manifest and task creation', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-orchestrate-write-only-'));
  const repoRoot = setupRepo(tempRoot);
  const planPath = path.join(tempRoot, 'plan.json');

  try {
    fs.writeFileSync(planPath, JSON.stringify({
      repoRoot,
      sessionName: 'Auth Workflow',
      task: 'Implement auth flow',
      launcherCommand: 'echo run',
      workers: [
        { name: 'claude', task: 'Implement flow with Claude' },
        { name: 'codex', task: 'Implement flow with Codex' }
      ]
    }, null, 2));

    const result = run([planPath, '--write-only'], { cwd: repoRoot });
    assert.strictEqual(result.code, 0, result.stderr);
    assert.ok(result.stdout.includes('Parallel manifest:'));
    assert.ok(result.stdout.includes('Board task:'));

    const boardPath = path.join(repoRoot, '.orchestration', 'board', 'tasks.json');
    const manifestPath = path.join(repoRoot, '.orchestration', 'attempt-groups', 'attempt-group-auth-workflow', 'group.json');
    assert.ok(fs.existsSync(boardPath));
    assert.ok(fs.existsSync(manifestPath));

    const board = JSON.parse(fs.readFileSync(boardPath, 'utf8'));
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.strictEqual(board.tasks.length, 1);
    assert.strictEqual(board.tasks[0].attempts.length, 2);
    assert.strictEqual(board.tasks[0].metadata.attemptGroupId, 'attempt-group-auth-workflow');
    assert.strictEqual(manifest.groupId, 'attempt-group-auth-workflow');
    assert.strictEqual(manifest.attempts.length, 2);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

if (test('dry-run preview stays non-mutating while surfacing attempt-group metadata', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-orchestrate-dry-run-'));
  const repoRoot = setupRepo(tempRoot);
  const planPath = path.join(tempRoot, 'plan.json');

  try {
    fs.writeFileSync(planPath, JSON.stringify({
      repoRoot,
      sessionName: 'Docs Workflow',
      task: 'Update docs',
      launcherCommand: 'echo run',
      workers: [
        { name: 'docs', task: 'Refresh docs' }
      ]
    }, null, 2));

    const result = run([planPath], { cwd: repoRoot });
    assert.strictEqual(result.code, 0, result.stderr);
    const payload = JSON.parse(result.stdout);
    assert.strictEqual(payload.attemptGroupId, 'attempt-group-docs-workflow');
    assert.ok(payload.manifestPath.endsWith(path.join('.orchestration', 'attempt-groups', 'attempt-group-docs-workflow', 'group.json')));
    assert.ok(!fs.existsSync(path.join(repoRoot, '.orchestration', 'board', 'tasks.json')));
    assert.ok(!fs.existsSync(path.join(repoRoot, '.orchestration', 'attempt-groups', 'attempt-group-docs-workflow', 'group.json')));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
