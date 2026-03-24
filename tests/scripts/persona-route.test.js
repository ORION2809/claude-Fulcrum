'use strict';

const assert = require('assert');
const path = require('path');
const { execFileSync } = require('child_process');

const ECC_SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'ecc.js');
const PERSONA_ROUTE_SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'persona-route.js');

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

console.log('\nPersona Route Script Tests');
console.log('==========================\n');

let passed = 0;
let failed = 0;

if (test('persona-route CLI emits JSON with explicit persona', () => {
  const output = execFileSync('node', [PERSONA_ROUTE_SCRIPT, 'review auth flow', '--persona-security', '--json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 10000,
  });
  const payload = JSON.parse(output);
  assert.strictEqual(payload.activePersona, 'security');
  assert.ok(Array.isArray(payload.personaStack));
  assert.strictEqual(payload.personaProfile.mode, 'defensive');
})) passed += 1; else failed += 1;

if (test('ecc forwards persona flags to subcommands as inherited state', () => {
  const output = execFileSync('node', [ECC_SCRIPT, 'persona-route', 'design auth schema', '--persona-architect', '--json'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 10000,
  });
  const payload = JSON.parse(output);
  assert.strictEqual(payload.activePersona, 'architect');
  assert.deepStrictEqual(payload.explicitPersonas, ['architect']);
  assert.ok(payload.sanitizedArgs.includes('design auth schema'));
  assert.strictEqual(payload.personaProfile.mode, 'systems');
})) passed += 1; else failed += 1;

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed > 0 ? 1 : 0;
