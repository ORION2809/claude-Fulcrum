/**
 * Tests for scripts/hooks/quality-gate.js
 *
 * Run with: node tests/hooks/quality-gate.test.js
 */

'use strict';

const assert = require('assert');
const path = require('path');
const os = require('os');
const fs = require('fs');

const qualityGate = require('../../scripts/hooks/quality-gate');

async function test(name, fn) {
  try {
    await fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (err) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

async function run() {
  let passed = 0;
  let failed = 0;

  console.log('\nQuality Gate Hook Tests');
  console.log('========================\n');

  console.log('run() pass-through behavior:');

  if (await test('returns original input for valid JSON with file_path', async () => {
    const input = JSON.stringify({ tool_input: { file_path: '/tmp/nonexistent-file.js' } });
    const result = await qualityGate.run(input);
    assert.strictEqual(result, input, 'Should return original input unchanged');
  })) passed++; else failed++;

  if (await test('returns original input for valid JSON without file_path', async () => {
    const input = JSON.stringify({ tool_input: { command: 'ls' } });
    const result = await qualityGate.run(input);
    assert.strictEqual(result, input, 'Should return original input unchanged');
  })) passed++; else failed++;

  if (await test('returns original input for invalid JSON (no crash)', async () => {
    const input = 'this is not json at all {{{';
    const result = await qualityGate.run(input);
    assert.strictEqual(result, input, 'Should return original input unchanged');
  })) passed++; else failed++;

  console.log('\nFile path extraction:');

  if (await test('extracts file_path from tool_input payloads', async () => {
    const filePath = qualityGate.extractFilePath({ tool_input: { file_path: 'src/index.js' } });
    assert.strictEqual(filePath, 'src/index.js');
  })) passed++; else failed++;

  if (await test('extracts path from toolInput payloads', async () => {
    const filePath = qualityGate.extractFilePath({ toolInput: { path: 'src/index.js' } });
    assert.strictEqual(filePath, 'src/index.js');
  })) passed++; else failed++;

  console.log('\nRuntime telemetry integration:');

  if (await test('writes persona-aware telemetry for a real file in a temp repo', async () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-quality-gate-'));
    const filePath = path.join(repoRoot, 'auth-route.js');
    const telemetryPath = path.join(repoRoot, '.claude', 'ecc', 'quality', 'quality-loop.jsonl');
    const governancePath = path.join(repoRoot, '.claude', 'ecc', 'governance', 'events.jsonl');

    fs.writeFileSync(filePath, [
      "const SECRET = 'sk-1234567890abcdef';",
      'async function login(req, res) {',
      "  const sql = `SELECT * FROM users WHERE id = ${req.query.id}`;",
      '  console.log(SECRET, sql);',
      '  return res.json({ ok: true });',
      '}',
      '',
    ].join('\n'), 'utf8');

    const originalCwd = process.cwd();
    try {
      process.chdir(repoRoot);
      const input = JSON.stringify({
        session_id: 'sess-quality',
        attempt_id: 'attempt-quality',
        tool_input: { file_path: filePath },
      });

      const result = await qualityGate.run(input);
      assert.strictEqual(result, input, 'Should return original input unchanged');
      assert.ok(fs.existsSync(telemetryPath), 'Telemetry log should exist');

      const entries = fs.readFileSync(telemetryPath, 'utf8')
        .trim()
        .split('\n')
        .filter(Boolean)
        .map(line => JSON.parse(line));

      const finalEntry = entries.filter(entry => entry.timestamp && Object.prototype.hasOwnProperty.call(entry, 'persona')).slice(-1)[0];
      assert.ok(finalEntry, 'Should emit final quality telemetry entry');
      assert.strictEqual(finalEntry.persona, 'security');
      assert.ok(Array.isArray(finalEntry.validatorNames), 'Validator names should be captured');
      assert.ok(finalEntry.validatorNames.includes('SecurityPolicy'));
      assert.ok(finalEntry.auditDecision, 'Audit decision should be recorded');
      assert.ok(finalEntry.selfReviewVerdict, 'Self-review verdict should be recorded');
      assert.ok(finalEntry.validators.critical >= 1, 'Security issues should produce critical findings');

      assert.ok(fs.existsSync(governancePath), 'Governance log should exist when findings are severe');
      const governanceEntries = fs.readFileSync(governancePath, 'utf8')
        .trim()
        .split('\n')
        .filter(Boolean)
        .map(line => JSON.parse(line));
      assert.ok(governanceEntries.some(entry => entry.eventType === 'quality_gate_runtime'));
    } finally {
      process.chdir(originalCwd);
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
