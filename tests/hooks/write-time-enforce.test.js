'use strict';

const assert = require('assert');

const {
  TIERS,
  FIX_COMPLEXITY,
  MODEL_TIERS,
  SONNET_CODE_PATTERNS,
  OPUS_CODE_PATTERNS,
  VOLUME_THRESHOLD,
  DEFAULT_TIER_CONFIG,
  detectFileLanguage,
  classifyViolationComplexity,
  selectModelTier,
  hashFile,
  parseViolations,
} = require('../../scripts/hooks/write-time-enforce');

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

console.log('\nWrite-Time Enforce Tests');
console.log('========================\n');

let passed = 0;
let failed = 0;

if (test('TIERS is frozen with expected values', () => {
  assert.ok(Object.isFrozen(TIERS));
  assert.strictEqual(TIERS.FORMAT, 'format');
  assert.strictEqual(TIERS.LINT, 'lint');
  assert.strictEqual(TIERS.FIX, 'fix');
  assert.strictEqual(TIERS.VERIFY, 'verify');
})) passed += 1; else failed += 1;

if (test('FIX_COMPLEXITY is frozen with expected values', () => {
  assert.ok(Object.isFrozen(FIX_COMPLEXITY));
  assert.strictEqual(FIX_COMPLEXITY.AUTO, 'auto');
  assert.strictEqual(FIX_COMPLEXITY.SIMPLE, 'simple');
  assert.strictEqual(FIX_COMPLEXITY.MODERATE, 'moderate');
  assert.strictEqual(FIX_COMPLEXITY.COMPLEX, 'complex');
})) passed += 1; else failed += 1;

if (test('detectFileLanguage identifies JavaScript files', () => {
  assert.strictEqual(detectFileLanguage('app.js'), 'js');
  assert.strictEqual(detectFileLanguage('comp.jsx'), 'js');
  assert.strictEqual(detectFileLanguage('index.mjs'), 'js');
  assert.strictEqual(detectFileLanguage('config.cjs'), 'js');
})) passed += 1; else failed += 1;

if (test('detectFileLanguage identifies TypeScript files', () => {
  assert.strictEqual(detectFileLanguage('app.ts'), 'ts');
  assert.strictEqual(detectFileLanguage('comp.tsx'), 'ts');
})) passed += 1; else failed += 1;

if (test('detectFileLanguage identifies Python files', () => {
  assert.strictEqual(detectFileLanguage('main.py'), 'py');
  assert.strictEqual(detectFileLanguage('types.pyi'), 'py');
})) passed += 1; else failed += 1;

if (test('detectFileLanguage identifies shell files', () => {
  assert.strictEqual(detectFileLanguage('setup.sh'), 'sh');
  assert.strictEqual(detectFileLanguage('init.bash'), 'sh');
})) passed += 1; else failed += 1;

if (test('detectFileLanguage returns null for unknown extensions', () => {
  assert.strictEqual(detectFileLanguage('readme.md'), null);
  assert.strictEqual(detectFileLanguage('styles.css'), null);
  assert.strictEqual(detectFileLanguage('data.json'), null);
})) passed += 1; else failed += 1;

if (test('detectFileLanguage identifies Go, Rust, Kotlin, Java', () => {
  assert.strictEqual(detectFileLanguage('main.go'), 'go');
  assert.strictEqual(detectFileLanguage('lib.rs'), 'rs');
  assert.strictEqual(detectFileLanguage('App.kt'), 'kt');
  assert.strictEqual(detectFileLanguage('Main.java'), 'java');
})) passed += 1; else failed += 1;

if (test('classifyViolationComplexity routes F-codes to auto', () => {
  assert.strictEqual(classifyViolationComplexity('F401'), 'auto');
  assert.strictEqual(classifyViolationComplexity('W291'), 'auto');
  assert.strictEqual(classifyViolationComplexity('E501'), 'auto');
})) passed += 1; else failed += 1;

if (test('classifyViolationComplexity routes I-codes to simple', () => {
  assert.strictEqual(classifyViolationComplexity('I001'), 'simple');
})) passed += 1; else failed += 1;

if (test('classifyViolationComplexity routes C901 to moderate', () => {
  assert.strictEqual(classifyViolationComplexity('C901'), 'moderate');
})) passed += 1; else failed += 1;

if (test('classifyViolationComplexity defaults to simple for unknown', () => {
  assert.strictEqual(classifyViolationComplexity('UNKNOWN999'), 'simple');
})) passed += 1; else failed += 1;

if (test('parseViolations parses standard lint output format', () => {
  const output = 'src/app.js:10:5: E501 Line too long\nsrc/utils.js:20:1: W291 Trailing whitespace';
  const violations = parseViolations(output);
  assert.strictEqual(violations.length, 2);
  assert.strictEqual(violations[0].file, 'src/app.js');
  assert.strictEqual(violations[0].line, 10);
  assert.strictEqual(violations[0].column, 5);
  assert.strictEqual(violations[0].code, 'E501');
  assert.ok(violations[0].message.includes('Line too long'));
  assert.ok(violations[0].complexity);
})) passed += 1; else failed += 1;

if (test('parseViolations returns empty for non-matching output', () => {
  const violations = parseViolations('All good, no issues found\n');
  assert.strictEqual(violations.length, 0);
})) passed += 1; else failed += 1;

if (test('parseViolations handles empty input', () => {
  const violations = parseViolations('');
  assert.strictEqual(violations.length, 0);
})) passed += 1; else failed += 1;

if (test('DEFAULT_TIER_CONFIG has all expected tiers', () => {
  assert.ok(DEFAULT_TIER_CONFIG.format);
  assert.ok(DEFAULT_TIER_CONFIG.lint);
  assert.ok(DEFAULT_TIER_CONFIG.fix);
  assert.ok(DEFAULT_TIER_CONFIG.verify);
})) passed += 1; else failed += 1;

if (test('DEFAULT_TIER_CONFIG format has tools for js and py', () => {
  assert.ok(DEFAULT_TIER_CONFIG.format.tools.js.length > 0);
  assert.ok(DEFAULT_TIER_CONFIG.format.tools.py.length > 0);
})) passed += 1; else failed += 1;

// NEW: Tests for model tier routing (plankton)
if (test('MODEL_TIERS has haiku, sonnet, opus', () => {
  assert.ok(Object.isFrozen(MODEL_TIERS));
  assert.strictEqual(MODEL_TIERS.HAIKU.model, 'haiku');
  assert.strictEqual(MODEL_TIERS.SONNET.model, 'sonnet');
  assert.strictEqual(MODEL_TIERS.OPUS.model, 'opus');
})) passed += 1; else failed += 1;

if (test('MODEL_TIERS opus has higher maxTurns than haiku', () => {
  assert.ok(MODEL_TIERS.OPUS.maxTurns > MODEL_TIERS.HAIKU.maxTurns);
})) passed += 1; else failed += 1;

if (test('selectModelTier returns haiku for simple codes', () => {
  const violations = [{ code: 'E001' }, { code: 'W123' }];
  const tier = selectModelTier(violations);
  assert.strictEqual(tier.model, 'haiku');
})) passed += 1; else failed += 1;

if (test('selectModelTier returns sonnet for C901', () => {
  const violations = [{ code: 'C901' }];
  const tier = selectModelTier(violations);
  assert.strictEqual(tier.model, 'sonnet');
})) passed += 1; else failed += 1;

if (test('selectModelTier returns opus for type-assertion', () => {
  const violations = [{ code: 'type-assertion' }];
  const tier = selectModelTier(violations);
  assert.strictEqual(tier.model, 'opus');
})) passed += 1; else failed += 1;

if (test('selectModelTier escalates to opus for high volume', () => {
  const violations = Array.from({ length: VOLUME_THRESHOLD + 1 }, (_, i) => ({ code: `E${i}` }));
  const tier = selectModelTier(violations);
  assert.strictEqual(tier.model, 'opus');
})) passed += 1; else failed += 1;

if (test('SONNET_CODE_PATTERNS matches expected codes', () => {
  assert.ok(SONNET_CODE_PATTERNS.test('C901'));
  assert.ok(SONNET_CODE_PATTERNS.test('PLR0123'));
  assert.ok(!SONNET_CODE_PATTERNS.test('E001'));
})) passed += 1; else failed += 1;

if (test('OPUS_CODE_PATTERNS matches expected codes', () => {
  assert.ok(OPUS_CODE_PATTERNS.test('unresolved-attribute'));
  assert.ok(OPUS_CODE_PATTERNS.test('type-assertion'));
  assert.ok(!OPUS_CODE_PATTERNS.test('C901'));
})) passed += 1; else failed += 1;

if (test('hashFile returns null for non-existent file', () => {
  const hash = hashFile('/tmp/definitely-does-not-exist-12345.txt');
  assert.strictEqual(hash, null);
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
