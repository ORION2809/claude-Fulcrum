'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  executeStopAudit,
  summarizeTranscript,
  writeAuditArtifact,
} = require('../../scripts/hooks/stop-cross-model-audit');

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

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

function createTranscript(dir, count = 4) {
  const transcriptPath = path.join(dir, 'transcript.jsonl');
  const lines = [];
  for (let index = 0; index < count; index += 1) {
    lines.push(JSON.stringify({ type: 'user', content: `User message ${index + 1}` }));
    lines.push(JSON.stringify({ type: 'assistant', content: `Assistant response ${index + 1}` }));
  }
  fs.writeFileSync(transcriptPath, `${lines.join('\n')}\n`, 'utf8');
  return transcriptPath;
}

let passed = 0;
let failed = 0;

async function main() {
  console.log('\nStop Cross-Model Audit Tests\n');

  if (test('summarizes transcript counts and recent messages', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stop-audit-test-'));
    try {
      const transcriptPath = createTranscript(tempDir, 3);
      const summary = summarizeTranscript(transcriptPath, { keepMessages: 2 });
      assert.strictEqual(summary.userCount, 3);
      assert.strictEqual(summary.assistantCount, 3);
      assert.ok(summary.snippet.includes('assistant: Assistant response 3'));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('executes stop audit from transcript evidence and writes artifact', async () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'stop-audit-repo-'));
    try {
      fs.mkdirSync(path.join(repoRoot, 'config'), { recursive: true });
      fs.writeFileSync(
        path.join(repoRoot, 'config', 'hook-control-plane.json'),
        JSON.stringify({
          governance: { logDir: '.claude/ecc/governance' },
          crossModelAudit: { enabled: true, stopBoundary: { minUserMessages: 3, maxChangedFiles: 4 } },
        }, null, 2),
        'utf8'
      );

      const transcriptPath = createTranscript(repoRoot, 4);
      const result = await executeStopAudit(JSON.stringify({
        transcript_path: transcriptPath,
        session_id: 'session-stop-audit',
      }), { repoRoot });

      assert.ok(!result.skipped);
      assert.strictEqual(result.boundary, 'stop');
      assert.ok(result.findings.length >= 0);
      assert.strictEqual(result.transcriptSummary.userCount, 4);

      const artifactPath = writeAuditArtifact(result, { repoRoot });
      assert.ok(fs.existsSync(artifactPath));
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      assert.strictEqual(artifact.boundary, 'stop');
      assert.strictEqual(artifact.transcriptSummary.userCount, 4);
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await asyncTest('skips stop audit when transcript is below minimum threshold', async () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'stop-audit-short-'));
    try {
      fs.mkdirSync(path.join(repoRoot, 'config'), { recursive: true });
      fs.writeFileSync(
        path.join(repoRoot, 'config', 'hook-control-plane.json'),
        JSON.stringify({
          governance: { logDir: '.claude/ecc/governance' },
          crossModelAudit: { enabled: true, stopBoundary: { minUserMessages: 5, maxChangedFiles: 4 } },
        }, null, 2),
        'utf8'
      );

      const transcriptPath = createTranscript(repoRoot, 2);
      const result = await executeStopAudit(JSON.stringify({
        transcript_path: transcriptPath,
        session_id: 'session-stop-short',
      }), { repoRoot });

      assert.strictEqual(result.skipped, true);
      assert.ok(result.reason.includes('Not enough'));
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
