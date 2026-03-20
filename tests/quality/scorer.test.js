'use strict';

const assert = require('assert');

const { isOscillating, isStagnating, scoreEvidence } = require('../../scripts/quality/scorer');
const { runQualityLoop } = require('../../scripts/quality/loop');

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

console.log('\nQuality Scorer Tests');
console.log('====================\n');

let passed = 0;
let failed = 0;

if (test('scores strong evidence as passing with a good or better band', () => {
  const result = scoreEvidence({
    codeChanges: 1,
    testsRun: 1,
    testsPass: 1,
    coverage: 0.9,
    hasErrors: false
  }, { threshold: 70 });

  assert.strictEqual(result.passed, true);
  assert.ok(['good', 'excellent'].includes(result.band));
})) passed += 1; else failed += 1;

if (test('applies hard caps for critical conditions', () => {
  const result = scoreEvidence({
    codeChanges: 1,
    testsRun: 1,
    testsPass: 1,
    coverage: 1,
    hasErrors: false,
    securityCritical: true
  }, { threshold: 20 });

  assert.strictEqual(result.score, 30);
  assert.strictEqual(result.hardCapApplied, 30);
  assert.strictEqual(result.passed, false);
})) passed += 1; else failed += 1;

if (test('detects oscillation and stagnation', () => {
  assert.strictEqual(isOscillating([61, 63, 62, 61]), true);
  assert.strictEqual(isStagnating([70, 71, 70]), true);
})) passed += 1; else failed += 1;

if (test('quality loop terminates when quality is met', () => {
  const result = runQualityLoop([
    { codeChanges: 0.5, testsRun: 0.5, testsPass: 0.5, coverage: 0.5, hasErrors: false },
    { codeChanges: 1, testsRun: 1, testsPass: 1, coverage: 1, hasErrors: false }
  ], { threshold: 70, maxIterations: 5, baseDir: require('os').tmpdir() });

  assert.strictEqual(result.terminationReason, 'QUALITY_MET');
  assert.strictEqual(result.iterations.length, 2);
})) passed += 1; else failed += 1;

console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
