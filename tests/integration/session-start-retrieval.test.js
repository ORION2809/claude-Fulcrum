const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const { createStateStore } = require('../../scripts/lib/state-store');

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

console.log('\nSession-Start Retrieval Integration Tests\n');

let passed = 0;
let failed = 0;

async function main() {
  if (await asyncTest('session-start uses retrieval execution and writes retrieval artifacts when memory exists', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-session-start-'));
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-session-cwd-'));
    const scriptPath = path.join(process.cwd(), 'scripts', 'hooks', 'session-start.js');
    const store = await createStateStore({ homeDir });

    try {
      store.insertMemoryNote({
        id: 'note-session-start',
        sessionId: 'session-start',
        attemptId: null,
        category: 'memory-recall',
        content: 'Isolated retrieval should be active during session start for memory recall.',
        summary: 'Session start retrieval memory summary.',
        tags: ['memory', 'session-start'],
        keywords: ['isolated', 'retrieval', 'session', 'memory'],
        links: [],
        retrievalMetadata: {},
        evolutionHistory: [],
        createdAt: '2026-03-18T00:00:02.000Z',
        accessedAt: '2026-03-18T00:00:02.000Z',
      });

      const result = spawnSync('node', [scriptPath], {
        cwd: workDir,
        env: {
          ...process.env,
          HOME: homeDir,
        },
        encoding: 'utf8',
      });

      assert.strictEqual(result.status, 0);
      assert.ok(result.stdout.includes('Memory available:'));

      const retrievalRoot = path.join(workDir, '.orchestration', 'memory-retrieval');
      assert.ok(fs.existsSync(retrievalRoot));
      const retrievalRuns = fs.readdirSync(retrievalRoot);
      assert.ok(retrievalRuns.length >= 1);
      const firstRunDir = path.join(retrievalRoot, retrievalRuns[0]);
      assert.ok(fs.existsSync(path.join(firstRunDir, 'response.json')));
      assert.ok(fs.existsSync(path.join(firstRunDir, 'status.md')));
    } finally {
      store.close();
      fs.rmSync(homeDir, { recursive: true, force: true });
      fs.rmSync(workDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
