const assert = require('assert');

const {
  computeDeterministicScore,
  isOscillating,
  isStagnating,
  scoreBand,
} = require('../../scripts/quality/scorer');

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

console.log('\nQuality Scorer Tests\n');

if (test('computes a passing score for a healthy run', () => {
  const result = computeDeterministicScore({
    meaningfulFileChanges: 2,
    testsRun: true,
    testsTotal: 10,
    testsFailed: 0,
    coverage: 82,
    errors: 0,
    buildBroken: false,
    securityCriticalCount: 0,
    threshold: 70,
  });

  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.band, 'excellent');
  assert.strictEqual(result.passed, true);
})) passed += 1; else failed += 1;

if (test('applies hard caps when the build is broken', () => {
  const result = computeDeterministicScore({
    meaningfulFileChanges: 2,
    testsRun: true,
    testsTotal: 10,
    testsFailed: 0,
    coverage: 90,
    errors: 1,
    buildBroken: true,
    securityCriticalCount: 0,
    threshold: 70,
  });

  assert.strictEqual(result.score, 45);
  assert.strictEqual(result.passed, false);
})) passed += 1; else failed += 1;

if (test('detects oscillation and stagnation patterns', () => {
  assert.strictEqual(isOscillating([71, 70, 71, 70]), true);
  assert.strictEqual(isStagnating([70, 71, 70]), true);
  assert.strictEqual(scoreBand(74), 'acceptable');
})) passed += 1; else failed += 1;

console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
