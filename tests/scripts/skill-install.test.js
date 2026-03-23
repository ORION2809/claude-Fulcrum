/**
 * Tests for scripts/skill-install.js CLI argument parsing
 *
 * Run with: node tests/scripts/skill-install.test.js
 */

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'skill-install.js');
const repoRoot = path.join(__dirname, '..', '..');

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (err) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runCLI(args, options = {}) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: options.cwd || repoRoot,
    encoding: 'utf8',
    timeout: 15000,
    env: { ...process.env, ...(options.env || {}) },
  });

  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    exitCode: result.status,
  };
}

function runTests() {
  console.log('\n=== Testing skill-install.js CLI ===\n');

  let passed = 0;
  let failed = 0;

  // --- Help ---
  console.log('Help:');

  if (test('shows help with --help', () => {
    const { stdout, exitCode } = runCLI(['--help']);
    assert.strictEqual(exitCode, 0);
    assert.ok(stdout.includes('Cross-Platform Skill Installer'));
    assert.ok(stdout.includes('--all'));
    assert.ok(stdout.includes('--platform'));
  })) passed++; else failed++;

  if (test('shows help with -h', () => {
    const { stdout, exitCode } = runCLI(['-h']);
    assert.strictEqual(exitCode, 0);
    assert.ok(stdout.includes('Cross-Platform Skill Installer'));
  })) passed++; else failed++;

  // --- List ---
  console.log('\nList:');

  if (test('--list shows available skills', () => {
    const { stdout, exitCode } = runCLI(['--list']);
    assert.strictEqual(exitCode, 0);
    assert.ok(stdout.includes('Available skills'));
    // Should list at least a few known skills
    assert.ok(stdout.length > 100);
  })) passed++; else failed++;

  if (test('--list --json outputs valid JSON', () => {
    const { stdout, exitCode } = runCLI(['--list', '--json']);
    assert.strictEqual(exitCode, 0);
    const parsed = JSON.parse(stdout);
    assert.ok(Array.isArray(parsed));
    assert.ok(parsed.length > 0);
    assert.ok(parsed[0].id);
    assert.ok(parsed[0].path);
  })) passed++; else failed++;

  if (test('--list-platforms shows all platforms', () => {
    const { stdout, exitCode } = runCLI(['--list-platforms']);
    assert.strictEqual(exitCode, 0);
    assert.ok(stdout.includes('claude'));
    assert.ok(stdout.includes('cursor'));
    assert.ok(stdout.includes('codex'));
    assert.ok(stdout.includes('opencode'));
    assert.ok(stdout.includes('copilot'));
    assert.ok(stdout.includes('antigravity'));
  })) passed++; else failed++;

  // --- Validation ---
  console.log('\nValidation:');

  if (test('exits with error when no skills specified', () => {
    const { stderr, exitCode } = runCLI(['--platform', 'claude']);
    assert.strictEqual(exitCode, 1);
    assert.ok(stderr.includes('No skills specified'));
  })) passed++; else failed++;

  if (test('exits with error for unknown skill IDs', () => {
    const { stderr, exitCode } = runCLI(['--skills', 'nonexistent-skill-xyz', '--platform', 'claude']);
    assert.strictEqual(exitCode, 1);
    assert.ok(stderr.includes('Unknown skill'));
  })) passed++; else failed++;

  if (test('exits with error for unknown platform', () => {
    const { stderr, exitCode } = runCLI(['--all', '--platform', 'fake-platform']);
    assert.strictEqual(exitCode, 1);
    assert.ok(stderr.includes('Unknown platform'));
  })) passed++; else failed++;

  // --- Dry run ---
  console.log('\nDry run:');

  if (test('--dry-run --all --platform claude shows plan', () => {
    const { stdout, exitCode } = runCLI(['--dry-run', '--all', '--platform', 'claude']);
    assert.strictEqual(exitCode, 0);
    assert.ok(stdout.includes('DRY RUN'));
    assert.ok(stdout.includes('[claude]'));
    assert.ok(stdout.includes('skill(s) would be installed'));
  })) passed++; else failed++;

  if (test('--dry-run with multiple platforms', () => {
    const { stdout, exitCode } = runCLI(['--dry-run', '--all', '--platform', 'claude,cursor,codex']);
    assert.strictEqual(exitCode, 0);
    assert.ok(stdout.includes('[claude]'));
    assert.ok(stdout.includes('[cursor]'));
    assert.ok(stdout.includes('[codex]'));
  })) passed++; else failed++;

  if (test('--dry-run --all --platform all --json outputs valid JSON', () => {
    const { stdout, exitCode } = runCLI(['--dry-run', '--all', '--platform', 'all', '--json']);
    assert.strictEqual(exitCode, 0);
    // JSON starts at the first '{' — skip any text heading lines
    const jsonStart = stdout.indexOf('{');
    assert.ok(jsonStart >= 0, 'Expected JSON object in stdout');
    const parsed = JSON.parse(stdout.slice(jsonStart));
    assert.ok(parsed.platforms);
    assert.ok(parsed.totalOperations > 0);
  })) passed++; else failed++;

  // Summary
  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
