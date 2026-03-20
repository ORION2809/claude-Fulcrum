'use strict';

const assert = require('assert');

const {
  AUDIT_DECISION,
  CONFIDENCE_RATING,
  HALLUCINATION_PATTERNS,
  buildAuditRequest,
  selfAudit,
  sourceVerification,
  adversarialReview,
  evaluateAuditFindings,
} = require('../../scripts/quality/cross-model-auditor');

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

console.log('\nCross-Model Auditor Tests');
console.log('=========================\n');

let passed = 0;
let failed = 0;

if (test('AUDIT_DECISION is frozen with expected values', () => {
  assert.ok(Object.isFrozen(AUDIT_DECISION));
  assert.strictEqual(AUDIT_DECISION.PASS, 'pass');
  assert.strictEqual(AUDIT_DECISION.WARN, 'warn');
  assert.strictEqual(AUDIT_DECISION.BLOCK, 'block');
})) passed += 1; else failed += 1;

if (test('buildAuditRequest creates valid request', () => {
  const req = buildAuditRequest({
    files: [{ path: 'a.js', action: 'modified', linesChanged: 10, content: 'code' }],
    testSummary: '5 passed',
    qualityScore: 0.85,
  }, { boundary: 'merge', sessionId: 'sess-1' });
  assert.ok(req.requestId.startsWith('audit-'));
  assert.ok(req.timestamp);
  assert.strictEqual(req.boundary, 'merge');
  assert.strictEqual(req.files.length, 1);
  assert.strictEqual(req.files[0].path, 'a.js');
  assert.strictEqual(req.testSummary, '5 passed');
  assert.strictEqual(req.qualityScore, 0.85);
  assert.strictEqual(req.sessionId, 'sess-1');
})) passed += 1; else failed += 1;

if (test('buildAuditRequest defaults boundary to stop', () => {
  const req = buildAuditRequest({ files: [] });
  assert.strictEqual(req.boundary, 'stop');
})) passed += 1; else failed += 1;

if (test('buildAuditRequest truncates content to 2000 chars', () => {
  const longContent = 'x'.repeat(5000);
  const req = buildAuditRequest({ files: [{ path: 'big.js', content: longContent }] });
  assert.ok(req.files[0].contentSnippet.length <= 2000);
})) passed += 1; else failed += 1;

if (test('evaluateAuditFindings returns PASS for no findings', () => {
  const result = evaluateAuditFindings([]);
  assert.strictEqual(result.decision, AUDIT_DECISION.PASS);
  assert.ok(result.reason.includes('No critical'));
})) passed += 1; else failed += 1;

if (test('evaluateAuditFindings returns BLOCK for critical findings', () => {
  const findings = [{ severity: 'critical', message: 'SQL injection' }];
  const result = evaluateAuditFindings(findings);
  assert.strictEqual(result.decision, AUDIT_DECISION.BLOCK);
  assert.ok(result.summary.critical === 1);
})) passed += 1; else failed += 1;

if (test('evaluateAuditFindings returns WARN for high findings', () => {
  const findings = [{ severity: 'high', message: 'XSS risk' }];
  const result = evaluateAuditFindings(findings);
  assert.strictEqual(result.decision, AUDIT_DECISION.WARN);
})) passed += 1; else failed += 1;

if (test('evaluateAuditFindings returns WARN for 3+ high findings', () => {
  const findings = [
    { severity: 'high', message: 'issue 1' },
    { severity: 'high', message: 'issue 2' },
    { severity: 'high', message: 'issue 3' },
  ];
  const result = evaluateAuditFindings(findings);
  assert.strictEqual(result.decision, AUDIT_DECISION.WARN);
  assert.ok(result.summary.high === 3);
})) passed += 1; else failed += 1;

if (test('evaluateAuditFindings PASS for only medium findings', () => {
  const findings = [{ severity: 'medium', message: 'minor issue' }];
  const result = evaluateAuditFindings(findings);
  assert.strictEqual(result.decision, AUDIT_DECISION.PASS);
})) passed += 1; else failed += 1;

if (test('evaluateAuditFindings summary counts are correct', () => {
  const findings = [
    { severity: 'critical', message: 'a' },
    { severity: 'high', message: 'b' },
    { severity: 'medium', message: 'c' },
    { severity: 'medium', message: 'd' },
  ];
  const result = evaluateAuditFindings(findings);
  assert.strictEqual(result.summary.critical, 1);
  assert.strictEqual(result.summary.high, 1);
  assert.strictEqual(result.summary.medium, 2);
  assert.strictEqual(result.summary.total, 4);
})) passed += 1; else failed += 1;

// NEW: Tests for 3-layer verification pipeline (doublecheck)
if (test('CONFIDENCE_RATING has 5 levels', () => {
  assert.ok(Object.isFrozen(CONFIDENCE_RATING));
  assert.strictEqual(CONFIDENCE_RATING.VERIFIED, 'verified');
  assert.strictEqual(CONFIDENCE_RATING.PLAUSIBLE, 'plausible');
  assert.strictEqual(CONFIDENCE_RATING.UNVERIFIED, 'unverified');
  assert.strictEqual(CONFIDENCE_RATING.DISPUTED, 'disputed');
  assert.strictEqual(CONFIDENCE_RATING.FABRICATION_RISK, 'fabrication_risk');
})) passed += 1; else failed += 1;

if (test('HALLUCINATION_PATTERNS has 7 patterns', () => {
  assert.ok(Object.isFrozen(HALLUCINATION_PATTERNS));
  assert.strictEqual(HALLUCINATION_PATTERNS.length, 7);
  const ids = HALLUCINATION_PATTERNS.map(p => p.id);
  assert.ok(ids.includes('fabricated_refs'));
  assert.ok(ids.includes('temporal_confusion'));
  assert.ok(ids.includes('overgeneralization'));
})) passed += 1; else failed += 1;

if (test('selfAudit detects large changes without test summary', () => {
  const request = buildAuditRequest({
    files: [{ path: 'big.js', linesChanged: 200, content: 'code' }],
  });
  const findings = selfAudit(request);
  const highFindings = findings.filter(f => f.severity === 'high');
  assert.ok(highFindings.length > 0, 'Should flag large change without tests');
})) passed += 1; else failed += 1;

if (test('selfAudit detects TODO markers in content', () => {
  const request = buildAuditRequest({
    files: [{ path: 'todo.js', linesChanged: 10, content: '// TODO fix this\n// FIXME later' }],
  });
  const findings = selfAudit(request);
  const todoFindings = findings.filter(f => f.pattern === 'missing_qualifiers');
  assert.ok(todoFindings.length > 0, 'Should detect TODO/FIXME markers');
})) passed += 1; else failed += 1;

if (test('sourceVerification detects test failures', () => {
  const request = buildAuditRequest({
    files: [],
    testSummary: { passed: 10, failures: 3, skipped: 0 },
  });
  const findings = sourceVerification(request);
  const critical = findings.filter(f => f.severity === 'critical');
  assert.ok(critical.length > 0, 'Test failures should be critical');
})) passed += 1; else failed += 1;

if (test('sourceVerification detects low quality score', () => {
  const request = buildAuditRequest({
    files: [],
    qualityScore: 0.4,
  });
  const findings = sourceVerification(request);
  const critical = findings.filter(f => f.severity === 'critical');
  assert.ok(critical.length > 0, 'Quality < 0.5 should be critical');
})) passed += 1; else failed += 1;

if (test('adversarialReview detects deprecated references', () => {
  const request = buildAuditRequest({
    files: [{ path: 'old.js', linesChanged: 5, content: 'use deprecated API here' }],
  });
  const findings = adversarialReview(request);
  const temporal = findings.filter(f => f.pattern === 'temporal_confusion');
  assert.ok(temporal.length > 0, 'Should detect deprecated references');
})) passed += 1; else failed += 1;

if (test('evaluateAuditFindings escalates disputed confidence', () => {
  const findings = [
    { severity: 'medium', message: 'test', confidence: CONFIDENCE_RATING.DISPUTED },
  ];
  const result = evaluateAuditFindings(findings);
  assert.strictEqual(result.decision, AUDIT_DECISION.WARN);
  assert.ok(result.reason.includes('disputed'));
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
