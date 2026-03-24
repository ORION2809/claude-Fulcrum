const assert = require('assert');

const { compressObservation } = require('../../scripts/hooks/compress-observation');

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

let passed = 0;
let failed = 0;

console.log('\nCompress Observation Tests\n');

if (test('summarizes structured tool payloads without raw JSON scaffolding', () => {
  const summary = compressObservation(JSON.stringify({
    toolName: 'Bash',
    toolInput: { command: 'npm test', path: 'src/auth.ts' },
    toolResponse: 'Implemented memory retrieval boundary.\nUpdated session-start hook.\n[redacted:Bear]',
  }, null, 2));

  assert.ok(summary.startsWith('Bash:'));
  assert.ok(summary.includes('npm test'));
  assert.ok(summary.includes('src/auth.ts'));
  assert.ok(summary.includes('Implemented memory retrieval boundary.'));
  assert.ok(summary.includes('Updated session-start hook.'));
  assert.ok(!summary.includes('"toolName"'));
  assert.ok(!summary.includes('{ |'));
})) passed += 1; else failed += 1;

if (test('prioritizes meaningful error and action lines over boilerplate', () => {
  const summary = compressObservation([
    '{',
    '  "toolName": "Edit",',
    '  "toolResponse": "ok"',
    '}',
    'warning: config mismatch detected',
    'updated memory query builder',
    'null',
  ].join('\n'));

  assert.ok(summary.includes('warning: config mismatch detected'));
  assert.ok(summary.includes('updated memory query builder'));
  assert.ok(!summary.includes('"toolName"'));
  assert.ok(!summary.includes('null'));
})) passed += 1; else failed += 1;

if (test('respects maxChars while preserving a readable summary', () => {
  const summary = compressObservation('Implemented the retrieval integration for session start and verified orchestration artifact generation end to end.', {
    maxChars: 60,
  });

  assert.ok(summary.length <= 60);
  assert.ok(summary.endsWith('...') || summary.length < 60);
})) passed += 1; else failed += 1;

if (test('extracts semantic fields from nested structured payloads', () => {
  const summary = compressObservation(JSON.stringify({
    toolName: 'Search',
    toolInput: {
      query: 'memory retrieval bug',
      filters: {
        path: 'scripts/memory/search-orchestrator.js',
      },
    },
    toolResponse: 'status: resolved\nsummary: updated graph traversal weights',
  }));

  assert.ok(summary.startsWith('Search:'));
  assert.ok(summary.includes('memory retrieval bug'));
  assert.ok(summary.includes('scripts/memory/search-orchestrator.js'));
  assert.ok(summary.includes('resolved'));
  assert.ok(summary.includes('updated graph traversal weights'));
})) passed += 1; else failed += 1;

console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
