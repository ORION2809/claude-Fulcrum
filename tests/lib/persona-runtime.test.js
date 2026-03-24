'use strict';

const assert = require('assert');

const {
  parsePersonaArgs,
  buildPersonaSelection,
  buildPersonaEnv,
  getPersonaFromEnv,
  loadPersonaProfile,
} = require('../../scripts/lib/persona-runtime');

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

console.log('\nPersona Runtime Tests');
console.log('=====================\n');

let passed = 0;
let failed = 0;

if (test('parsePersonaArgs strips explicit persona flags from child args', () => {
  const parsed = parsePersonaArgs(['--persona-security', 'status', '--json']);
  assert.deepStrictEqual(parsed.sanitizedArgs, ['status', '--json']);
  assert.deepStrictEqual(parsed.explicitPersonas, ['security']);
})) passed += 1; else failed += 1;

if (test('buildPersonaSelection honors explicit persona over routed persona', () => {
  const selection = buildPersonaSelection(['--persona-security', 'review', 'auth', 'flow'], 'review auth flow');
  assert.strictEqual(selection.activePersona, 'security');
  assert.ok(selection.personaStack.some(item => item.name === 'security'));
})) passed += 1; else failed += 1;

if (test('buildPersonaEnv and getPersonaFromEnv round-trip persona state', () => {
  const selection = buildPersonaSelection(['--persona-architect', 'design', 'cache'], 'design cache');
  const env = buildPersonaEnv(selection);
  const restored = getPersonaFromEnv(env);
  assert.strictEqual(restored.activePersona, 'architect');
  assert.ok(Array.isArray(restored.personaStack));
  assert.ok(restored.personaStack.length > 0);
  assert.strictEqual(restored.personaProfile.mode, 'systems');
})) passed += 1; else failed += 1;

if (test('loadPersonaProfile resolves @include composition', () => {
  const profile = loadPersonaProfile('security');
  assert.strictEqual(profile.mode, 'defensive');
  assert.strictEqual(profile.quality.requireSelfReview, true);
  assert.ok(profile.quality.requiredValidators.includes('SecurityPolicy'));
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
