'use strict';

const assert = require('assert');

const {
  estimateTokenCount,
  computeBudgetStatus,
  buildRecommendations,
  DEFAULT_MAX_TOKENS,
  WARNING_THRESHOLD,
  CRITICAL_THRESHOLD,
} = require('../../scripts/hooks/context-budget');

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

console.log('\nContext Budget Tracker Tests');
console.log('===========================\n');

let passed = 0;
let failed = 0;

if (test('estimateTokenCount returns 0 for empty input', () => {
  assert.strictEqual(estimateTokenCount(''), 0);
  assert.strictEqual(estimateTokenCount(null), 0);
  assert.strictEqual(estimateTokenCount(undefined), 0);
})) passed += 1; else failed += 1;

if (test('estimateTokenCount approximates ~4 chars per token', () => {
  const text = 'a'.repeat(400);
  assert.strictEqual(estimateTokenCount(text), 100);
})) passed += 1; else failed += 1;

if (test('computeBudgetStatus returns normal for low utilization', () => {
  const status = computeBudgetStatus(10000, 200000);
  assert.strictEqual(status.level, 'normal');
  assert.strictEqual(status.utilizationPercent, 5);
})) passed += 1; else failed += 1;

if (test('computeBudgetStatus returns warning at 70%+', () => {
  const status = computeBudgetStatus(145000, 200000);
  assert.strictEqual(status.level, 'warning');
})) passed += 1; else failed += 1;

if (test('computeBudgetStatus returns critical at 85%+', () => {
  const status = computeBudgetStatus(175000, 200000);
  assert.strictEqual(status.level, 'critical');
})) passed += 1; else failed += 1;

if (test('computeBudgetStatus uses default max tokens when not provided', () => {
  const status = computeBudgetStatus(10000, 0);
  assert.strictEqual(status.maxTokens, DEFAULT_MAX_TOKENS);
})) passed += 1; else failed += 1;

if (test('buildRecommendations returns empty for normal level', () => {
  const recs = buildRecommendations({ level: 'normal' });
  assert.strictEqual(recs.length, 0);
})) passed += 1; else failed += 1;

if (test('buildRecommendations returns suggestions for warning level', () => {
  const recs = buildRecommendations({ level: 'warning' });
  assert.ok(recs.length > 0);
})) passed += 1; else failed += 1;

if (test('buildRecommendations returns aggressive suggestions for critical level', () => {
  const recs = buildRecommendations({ level: 'critical' });
  assert.ok(recs.length > 2);
  assert.ok(recs.some(r => r.includes('compression')));
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
