'use strict';

const assert = require('assert');

const {
  SEVERITY,
  createFinding,
  validateKISS,
  validatePurity,
  validateSOLID,
  validateLetItCrash,
  validateSecurityPolicy,
  validateContextBudgetPolicy,
  runAllValidators,
  ALL_VALIDATORS,
  KISS_THRESHOLDS,
  SOLID_THRESHOLDS,
  CORE_PATH_PATTERNS,
  SHELL_PATH_PATTERNS,
  IO_CALL_PATTERNS,
  classifyFilePath,
} = require('../../scripts/quality/policy-validators');

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

console.log('\nPolicy Validators Tests');
console.log('=======================\n');

let passed = 0;
let failed = 0;

if (test('SEVERITY is frozen with expected values', () => {
  assert.ok(Object.isFrozen(SEVERITY));
  assert.strictEqual(SEVERITY.CRITICAL, 'critical');
  assert.strictEqual(SEVERITY.HIGH, 'high');
  assert.strictEqual(SEVERITY.MEDIUM, 'medium');
  assert.strictEqual(SEVERITY.LOW, 'low');
  assert.strictEqual(SEVERITY.INFO, 'info');
})) passed += 1; else failed += 1;

if (test('createFinding produces valid finding object', () => {
  const f = createFinding('TestValidator', SEVERITY.HIGH, 'test message', { file: 'a.js', line: 10 });
  assert.strictEqual(f.validator, 'TestValidator');
  assert.strictEqual(f.severity, 'high');
  assert.strictEqual(f.message, 'test message');
  assert.strictEqual(f.file, 'a.js');
  assert.strictEqual(f.line, 10);
  assert.ok(f.timestamp);
})) passed += 1; else failed += 1;

if (test('validateKISS passes for small files', () => {
  const evidence = { files: [{ path: 'a.js', lineCount: 100, functionCount: 5, maxNestingDepth: 2, maxFunctionLength: 30 }] };
  const result = validateKISS(evidence);
  assert.strictEqual(result.validator, 'KISS');
  assert.strictEqual(result.passed, true);
  assert.strictEqual(result.findings.length, 0);
})) passed += 1; else failed += 1;

if (test('validateKISS flags large files', () => {
  const evidence = { files: [{ path: 'big.js', lineCount: 800, functionCount: 25, maxNestingDepth: 6, maxFunctionLength: 100 }] };
  const result = validateKISS(evidence);
  assert.ok(result.findings.length > 0);
})) passed += 1; else failed += 1;

if (test('validateKISS fails for deep nesting (HIGH severity)', () => {
  const evidence = { files: [{ path: 'deep.js', maxNestingDepth: 5 }] };
  const result = validateKISS(evidence);
  assert.strictEqual(result.passed, false);
  assert.ok(result.findings.some(f => f.severity === SEVERITY.HIGH));
})) passed += 1; else failed += 1;

if (test('validatePurity passes for clean files', () => {
  const result = validatePurity({ files: [{ path: 'pure.js', globalMutations: 0 }] });
  assert.strictEqual(result.passed, true);
})) passed += 1; else failed += 1;

if (test('validatePurity flags global mutations', () => {
  const result = validatePurity({ files: [{ path: 'src/domain/mut.js', globalMutations: 3 }] });
  assert.strictEqual(result.passed, false);
  assert.ok(result.findings.some(f => f.severity === SEVERITY.HIGH));
})) passed += 1; else failed += 1;

if (test('validateSOLID flags god classes', () => {
  const result = validateSOLID({ files: [{ path: 'god.js', hasGodClass: true }] });
  assert.strictEqual(result.passed, false);
})) passed += 1; else failed += 1;

if (test('validateSOLID flags too many responsibilities', () => {
  const result = validateSOLID({ files: [{ path: 'srp.js', responsibilities: ['a', 'b', 'c', 'd'] }] });
  assert.ok(result.findings.length > 0);
})) passed += 1; else failed += 1;

if (test('validateLetItCrash flags empty catch blocks', () => {
  const result = validateLetItCrash({ files: [{ path: 'catch.js', emptyCatchBlocks: 2 }] });
  assert.strictEqual(result.passed, false);
  assert.ok(result.findings.some(f => f.severity === SEVERITY.CRITICAL));
})) passed += 1; else failed += 1;

if (test('validateLetItCrash passes for clean error handling', () => {
  const result = validateLetItCrash({ files: [{ path: 'ok.js', emptyCatchBlocks: 0, broadCatchPatterns: 0, missingErrorHandling: 0 }] });
  assert.strictEqual(result.passed, true);
})) passed += 1; else failed += 1;

if (test('validateSecurityPolicy flags hardcoded secrets as CRITICAL', () => {
  const result = validateSecurityPolicy({ files: [{ path: 'sec.js', hardcodedSecrets: 1 }] });
  assert.strictEqual(result.passed, false);
  assert.ok(result.findings.some(f => f.severity === SEVERITY.CRITICAL));
})) passed += 1; else failed += 1;

if (test('validateSecurityPolicy flags SQL injection as CRITICAL', () => {
  const result = validateSecurityPolicy({ files: [{ path: 'db.js', sqlInjectionRisk: 1 }] });
  assert.strictEqual(result.passed, false);
})) passed += 1; else failed += 1;

if (test('validateContextBudgetPolicy warns at 70% utilization', () => {
  const result = validateContextBudgetPolicy({ contextBudget: { utilization: 0.75 } });
  assert.strictEqual(result.passed, true); // MEDIUM is not HIGH
  assert.ok(result.findings.length > 0);
})) passed += 1; else failed += 1;

if (test('validateContextBudgetPolicy fails at 85% utilization', () => {
  const result = validateContextBudgetPolicy({ contextBudget: { utilization: 0.90 } });
  assert.strictEqual(result.passed, false);
})) passed += 1; else failed += 1;

if (test('runAllValidators runs all 6 validators', () => {
  const result = runAllValidators({ files: [], contextBudget: {} });
  assert.strictEqual(result.validators.length, 6);
  assert.ok('summary' in result);
  assert.ok('findings' in result);
})) passed += 1; else failed += 1;

if (test('runAllValidators can filter by validator names', () => {
  const result = runAllValidators({ files: [] }, { validators: ['KISS', 'Purity'] });
  assert.strictEqual(result.validators.length, 2);
})) passed += 1; else failed += 1;

if (test('runAllValidators summary counts are correct', () => {
  const evidence = {
    files: [{ path: 'bad.js', hardcodedSecrets: 1, emptyCatchBlocks: 1 }],
    contextBudget: {},
  };
  const result = runAllValidators(evidence);
  assert.ok(result.summary.critical >= 1);
  assert.ok(result.summary.totalFindings >= 2);
  assert.strictEqual(result.passed, false);
})) passed += 1; else failed += 1;

if (test('ALL_VALIDATORS has all expected keys', () => {
  assert.ok(ALL_VALIDATORS.KISS);
  assert.ok(ALL_VALIDATORS.Purity);
  assert.ok(ALL_VALIDATORS.SOLID);
  assert.ok(ALL_VALIDATORS.LetItCrash);
  assert.ok(ALL_VALIDATORS.SecurityPolicy);
  assert.ok(ALL_VALIDATORS.ContextBudgetPolicy);
})) passed += 1; else failed += 1;

// NEW: Tests for Tony363-ported thresholds and classifiers
if (test('KISS_THRESHOLDS has correct maxComplexity from Tony363', () => {
  assert.strictEqual(KISS_THRESHOLDS.maxComplexity, 10);
  assert.strictEqual(KISS_THRESHOLDS.warningComplexity, 7);
  assert.strictEqual(KISS_THRESHOLDS.maxFunctionLines, 50);
  assert.strictEqual(KISS_THRESHOLDS.maxNestingDepth, 4);
  assert.strictEqual(KISS_THRESHOLDS.maxParameters, 5);
  assert.strictEqual(KISS_THRESHOLDS.maxCognitiveComplexity, 15);
})) passed += 1; else failed += 1;

if (test('SOLID_THRESHOLDS has correct values from Tony363', () => {
  assert.strictEqual(SOLID_THRESHOLDS.maxFileLines, 300);
  assert.strictEqual(SOLID_THRESHOLDS.maxClassPublicMethods, 5);
  assert.strictEqual(SOLID_THRESHOLDS.maxInterfaceMethods, 7);
  assert.strictEqual(SOLID_THRESHOLDS.maxInstanceofChain, 2);
})) passed += 1; else failed += 1;

if (test('classifyFilePath identifies core paths', () => {
  assert.strictEqual(classifyFilePath('src/utils/helper.js'), 'core');
  assert.strictEqual(classifyFilePath('src/domain/model.py'), 'core');
})) passed += 1; else failed += 1;

if (test('classifyFilePath identifies shell paths', () => {
  assert.strictEqual(classifyFilePath('src/api/routes.js'), 'shell');
  assert.strictEqual(classifyFilePath('src/tests/unit/test_foo.py'), 'shell');
  assert.strictEqual(classifyFilePath('src/cli/main.js'), 'shell');
})) passed += 1; else failed += 1;

if (test('classifyFilePath returns unknown for unmatched paths', () => {
  assert.strictEqual(classifyFilePath('README.md'), 'unknown');
})) passed += 1; else failed += 1;

if (test('CORE_PATH_PATTERNS is a frozen array of strings', () => {
  assert.ok(Array.isArray(CORE_PATH_PATTERNS));
  assert.ok(CORE_PATH_PATTERNS.length > 0);
  assert.strictEqual(typeof CORE_PATH_PATTERNS[0], 'string');
  assert.ok(Object.isFrozen(CORE_PATH_PATTERNS));
})) passed += 1; else failed += 1;

if (test('IO_CALL_PATTERNS has expected categories', () => {
  assert.ok(IO_CALL_PATTERNS.file_io);
  assert.ok(IO_CALL_PATTERNS.network);
  assert.ok(IO_CALL_PATTERNS.database);
  assert.ok(IO_CALL_PATTERNS.subprocess);
  assert.ok(IO_CALL_PATTERNS.side_effects);
})) passed += 1; else failed += 1;

if (test('validateKISS checks per-function metrics', () => {
  const evidence = {
    files: [{
      path: 'src/lib/complex.js',
      functions: [
        { name: 'bigFn', cyclomaticComplexity: 15, lineCount: 80, nestingDepth: 5, paramCount: 7 },
      ],
    }],
  };
  const result = validateKISS(evidence);
  // Should flag complexity > 10, lines > 50, nesting > 4, params > 5
  assert.ok(result.findings.length >= 3);
})) passed += 1; else failed += 1;

if (test('validatePurity distinguishes core vs shell severity', () => {
  const coreResult = validatePurity({
    files: [{ path: 'src/core/model.js', globalMutations: 1, ioCalls: [{ category: 'file_io' }] }],
  });
  const shellResult = validatePurity({
    files: [{ path: 'src/api/handler.js', globalMutations: 1 }],
  });
  // Core I/O should be HIGH severity (passed=false), shell should be LOW (passed=true)
  assert.strictEqual(coreResult.passed, false);
  assert.ok(coreResult.findings.some(f => f.severity === SEVERITY.HIGH));
  assert.strictEqual(shellResult.passed, true);
})) passed += 1; else failed += 1;

if (test('validateLetItCrash flags bare catch as CRITICAL', () => {
  const result = validateLetItCrash({
    files: [{ path: 'src/lib/handler.js', bareCatchBlocks: 1, emptyCatchBlocks: 0 }],
  });
  const critical = result.findings.find(f => f.severity === SEVERITY.CRITICAL);
  assert.ok(critical, 'Bare catch should be CRITICAL');
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
