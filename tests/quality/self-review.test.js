'use strict';

const assert = require('assert');

const {
  CHECKLIST_ITEMS,
  createChecklistResult,
  evaluateChecklist,
  generateSelfReviewPrompt,
  buildSelfReviewReport,
  HALLUCINATION_RED_FLAGS,
  CONFIDENCE_WEIGHTS,
  CONFIDENCE_THRESHOLDS,
  detectHallucinations,
  computeWeightedConfidence,
} = require('../../scripts/quality/self-review');

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

console.log('\nSelf-Review Tests');
console.log('=================\n');

let passed = 0;
let failed = 0;

if (test('CHECKLIST_ITEMS has 12 items', () => {
  assert.strictEqual(CHECKLIST_ITEMS.length, 12);
  assert.ok(Object.isFrozen(CHECKLIST_ITEMS));
})) passed += 1; else failed += 1;

if (test('CHECKLIST_ITEMS covers all categories', () => {
  const categories = new Set(CHECKLIST_ITEMS.map(i => i.category));
  assert.ok(categories.has('correctness'));
  assert.ok(categories.has('robustness'));
  assert.ok(categories.has('security'));
  assert.ok(categories.has('quality'));
  assert.ok(categories.has('operations'));
})) passed += 1; else failed += 1;

if (test('createChecklistResult returns valid result', () => {
  const result = createChecklistResult('req_match', true, 'All requirements met');
  assert.strictEqual(result.id, 'req_match');
  assert.strictEqual(result.passed, true);
  assert.strictEqual(result.evidence, 'All requirements met');
  assert.strictEqual(result.category, 'correctness');
})) passed += 1; else failed += 1;

if (test('createChecklistResult throws for unknown item', () => {
  assert.throws(() => createChecklistResult('nonexistent', true, 'test'));
})) passed += 1; else failed += 1;

if (test('evaluateChecklist marks unset items as failed', () => {
  const result = evaluateChecklist([]);
  assert.strictEqual(result.failedCount, 12);
  assert.strictEqual(result.passedCount, 0);
  assert.strictEqual(result.allPassed, false);
})) passed += 1; else failed += 1;

if (test('evaluateChecklist calculates passRate correctly', () => {
  const results = CHECKLIST_ITEMS.map(item =>
    createChecklistResult(item.id, true, 'ok')
  );
  const evaluated = evaluateChecklist(results);
  assert.strictEqual(evaluated.passRate, 100);
  assert.strictEqual(evaluated.allPassed, true);
})) passed += 1; else failed += 1;

if (test('evaluateChecklist identifies critical failures', () => {
  const results = [
    createChecklistResult('req_match', false, 'mismatch'),
    createChecklistResult('input_validation', false, 'missing'),
  ];
  const evaluated = evaluateChecklist(results);
  assert.ok(evaluated.criticalFailures.length > 0);
  assert.ok(evaluated.criticalFailures.some(f =>
    f.category === 'correctness' || f.category === 'security'
  ));
})) passed += 1; else failed += 1;

if (test('evaluateChecklist byCategory aggregates correctly', () => {
  const results = CHECKLIST_ITEMS.map(item =>
    createChecklistResult(item.id, item.category === 'correctness', 'test')
  );
  const evaluated = evaluateChecklist(results);
  assert.ok(evaluated.byCategory.correctness.passed > 0);
  assert.ok(evaluated.byCategory.robustness.failed > 0);
})) passed += 1; else failed += 1;

if (test('generateSelfReviewPrompt includes persona and checklist', () => {
  const results = [createChecklistResult('req_match', true, 'ok')];
  const checklist = evaluateChecklist(results);
  const prompt = generateSelfReviewPrompt(checklist, { taskDescription: 'fix bug' });
  assert.strictEqual(prompt.role, 'self-review');
  assert.ok(prompt.persona.includes('Senior engineer'));
  assert.strictEqual(prompt.context.taskDescription, 'fix bug');
  assert.ok(prompt.checklist.passRate >= 0);
  assert.ok(prompt.requiredOutputs.length > 0);
})) passed += 1; else failed += 1;

if (test('buildSelfReviewReport returns proceed when all pass', () => {
  const results = CHECKLIST_ITEMS.map(item =>
    createChecklistResult(item.id, true, 'ok')
  );
  const checklist = evaluateChecklist(results);
  const report = buildSelfReviewReport(checklist, { requirementMatch: true, testsBuildStatus: 'pass' });
  assert.strictEqual(report.verdict, 'proceed');
  assert.ok(report.timestamp);
})) passed += 1; else failed += 1;

if (test('buildSelfReviewReport returns block for critical failures', () => {
  const results = [createChecklistResult('req_match', false, 'mismatch')];
  const checklist = evaluateChecklist(results);
  const report = buildSelfReviewReport(checklist);
  assert.strictEqual(report.verdict, 'block');
})) passed += 1; else failed += 1;

if (test('buildSelfReviewReport returns proceed_with_caution for rollback recommended', () => {
  const results = CHECKLIST_ITEMS.map(item =>
    createChecklistResult(item.id, true, 'ok')
  );
  const checklist = evaluateChecklist(results);
  const report = buildSelfReviewReport(checklist, { rollbackRecommended: true });
  assert.strictEqual(report.verdict, 'proceed_with_caution');
})) passed += 1; else failed += 1;

// NEW: Tests for hallucination detection and weighted confidence (SuperClaude)
if (test('HALLUCINATION_RED_FLAGS has 7 flags', () => {
  assert.strictEqual(HALLUCINATION_RED_FLAGS.length, 7);
  const ids = HALLUCINATION_RED_FLAGS.map(f => f.id);
  assert.ok(ids.includes('tests_no_output'));
  assert.ok(ids.includes('complete_no_evidence'));
  assert.ok(ids.includes('no_diff_evidence'));
})) passed += 1; else failed += 1;

if (test('CONFIDENCE_WEIGHTS sum to 1.0', () => {
  const sum = Object.values(CONFIDENCE_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1.0) < 1e-6, `Weights sum to ${sum}, expected 1.0`);
})) passed += 1; else failed += 1;

if (test('CONFIDENCE_THRESHOLDS has high and medium', () => {
  assert.strictEqual(CONFIDENCE_THRESHOLDS.high, 0.9);
  assert.strictEqual(CONFIDENCE_THRESHOLDS.medium, 0.7);
})) passed += 1; else failed += 1;

if (test('detectHallucinations returns flags for suspicious impl', () => {
  const impl = {
    testsPassed: true,
    testOutput: '',
    status: 'complete',
    errors: ['some error'],
    warnings: ['some warning'],
    filesModified: ['a.js'],
    diffAvailable: false,
    description: 'I think this probably might work',
  };
  const result = detectHallucinations(impl);
  assert.ok(result.detected.length > 0, 'Should detect at least one red flag');
  const flagIds = result.detected.map(f => f.flag);
  assert.ok(flagIds.includes('tests_no_output'));
  assert.ok(flagIds.includes('complete_no_evidence') || flagIds.includes('ignored_errors'));
})) passed += 1; else failed += 1;

if (test('detectHallucinations returns empty for clean impl', () => {
  const impl = {
    testsPassed: true,
    testOutput: 'All 5 tests passed',
    status: 'complete',
    evidence: true,
    codeChanges: '+ const x = 1;',
    description: 'Added constant',
  };
  const result = detectHallucinations(impl);
  assert.strictEqual(result.detected.length, 0);
})) passed += 1; else failed += 1;

if (test('computeWeightedConfidence returns high for all passing', () => {
  const checks = {
    noDuplicates: true,
    architectureCompliance: true,
    docsVerified: true,
    ossImplementations: true,
    rootCauseIdentified: true,
  };
  const result = computeWeightedConfidence(checks);
  assert.strictEqual(result.score, 1.0);
  assert.strictEqual(result.level, 'high');
})) passed += 1; else failed += 1;

if (test('computeWeightedConfidence returns low for all failing', () => {
  const checks = {
    noDuplicates: false,
    architectureCompliance: false,
    docsVerified: false,
    ossImplementations: false,
    rootCauseIdentified: false,
  };
  const result = computeWeightedConfidence(checks);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.level, 'low');
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
