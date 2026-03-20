#!/usr/bin/env node
'use strict';

const assert = require('assert');

const {
  PERSONAS,
  RISK_LEVELS,
  EXPERTISE_LEVELS,
  COMMAND_FLOWS,
  scorePersona,
  routePersona,
  selectCommandFlow,
  getAvailablePersonas,
} = require('../../scripts/lib/persona-router');

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

console.log('\nPersona Router Tests (Phase 6.2)');
console.log('================================\n');

let passed = 0;
let failed = 0;

// --- Constants ---

if (test('PERSONAS has 8 personas', () => {
  assert.strictEqual(Object.keys(PERSONAS).length, 8);
  assert.ok(Object.isFrozen(PERSONAS));
})) passed += 1; else failed += 1;

if (test('RISK_LEVELS has 4 levels', () => {
  assert.strictEqual(RISK_LEVELS.critical, 4);
  assert.strictEqual(RISK_LEVELS.low, 1);
})) passed += 1; else failed += 1;

if (test('EXPERTISE_LEVELS has 3 levels', () => {
  assert.strictEqual(EXPERTISE_LEVELS.expert, 3);
  assert.strictEqual(EXPERTISE_LEVELS.beginner, 1);
})) passed += 1; else failed += 1;

if (test('COMMAND_FLOWS has expected workflows', () => {
  assert.ok(COMMAND_FLOWS['feature-implementation']);
  assert.ok(COMMAND_FLOWS['bug-fix']);
  assert.ok(COMMAND_FLOWS['security-audit']);
  assert.ok(Array.isArray(COMMAND_FLOWS['feature-implementation']));
})) passed += 1; else failed += 1;

// --- scorePersona ---

if (test('scorePersona returns high score for keyword match', () => {
  const result = scorePersona(PERSONAS.security, {
    task: 'check for security vulnerabilities and injection attacks',
  });
  assert.ok(result.score > 0.3, `score ${result.score} expected > 0.3`);
  assert.strictEqual(result.persona, 'security');
  assert.ok(result.signals.length > 0);
})) passed += 1; else failed += 1;

if (test('scorePersona category matching boosts score', () => {
  const withCategory = scorePersona(PERSONAS.debugger, {
    task: 'fix an issue',
    category: 'bug',
  });
  const withoutCategory = scorePersona(PERSONAS.debugger, {
    task: 'fix an issue',
  });
  assert.ok(withCategory.score > withoutCategory.score);
})) passed += 1; else failed += 1;

if (test('scorePersona risk alignment works', () => {
  const result = scorePersona(PERSONAS.security, {
    task: 'audit auth module',
    riskLevel: 'critical',
  });
  assert.ok(result.signals.some(s => s.includes('risk-aligned')));
})) passed += 1; else failed += 1;

if (test('scorePersona expertise matching works', () => {
  const result = scorePersona(PERSONAS.architect, {
    task: 'design the system architecture',
    expertiseLevel: 'expert',
  });
  assert.ok(result.signals.some(s => s.includes('expertise-matched')));
})) passed += 1; else failed += 1;

// --- routePersona ---

if (test('routePersona routes security task to security persona', () => {
  const result = routePersona({
    task: 'Review security vulnerabilities in auth module',
    category: 'security',
    riskLevel: 'high',
  });
  assert.strictEqual(result.primary, 'security');
  assert.ok(result.confidence > 0.3);
  assert.ok(result.stack.length > 0);
  assert.ok(Array.isArray(result.commandFlow));
})) passed += 1; else failed += 1;

if (test('routePersona routes bug fix to debugger', () => {
  const result = routePersona({
    task: 'fix crashed error in the login module',
    category: 'bug',
  });
  assert.strictEqual(result.primary, 'debugger');
})) passed += 1; else failed += 1;

if (test('routePersona routes architecture task to architect', () => {
  const result = routePersona({
    task: 'design the system architecture and scalability plan',
    category: 'design',
  });
  assert.strictEqual(result.primary, 'architect');
})) passed += 1; else failed += 1;

if (test('routePersona routes testing task to tester', () => {
  const result = routePersona({
    task: 'write unit tests and integration tests for the API',
    category: 'testing',
  });
  assert.strictEqual(result.primary, 'tester');
})) passed += 1; else failed += 1;

if (test('routePersona includes persona stack with top 3', () => {
  const result = routePersona({ task: 'implement a new feature and test it' });
  assert.ok(result.stack.length >= 1);
  assert.ok(result.stack.length <= 3);
  assert.ok(typeof result.stack[0].name === 'string');
  assert.ok(typeof result.stack[0].score === 'number');
})) passed += 1; else failed += 1;

if (test('routePersona defaults riskLevel and expertiseLevel', () => {
  const result = routePersona({ task: 'do something' });
  assert.strictEqual(result.riskLevel, 'medium');
  assert.strictEqual(result.expertiseLevel, 'intermediate');
})) passed += 1; else failed += 1;

// --- selectCommandFlow ---

if (test('selectCommandFlow returns bug-fix for bug category', () => {
  const flow = selectCommandFlow('debugger', { category: 'bug' });
  assert.deepStrictEqual(flow, COMMAND_FLOWS['bug-fix']);
})) passed += 1; else failed += 1;

if (test('selectCommandFlow returns security-audit for security category', () => {
  const flow = selectCommandFlow('security', { category: 'security' });
  assert.deepStrictEqual(flow, COMMAND_FLOWS['security-audit']);
})) passed += 1; else failed += 1;

if (test('selectCommandFlow returns persona-based flow when no category', () => {
  const flow = selectCommandFlow('tester', {});
  assert.deepStrictEqual(flow, COMMAND_FLOWS['testing']);
})) passed += 1; else failed += 1;

// --- getAvailablePersonas ---

if (test('getAvailablePersonas lists all 8 personas', () => {
  const personas = getAvailablePersonas();
  assert.strictEqual(personas.length, 8);
  assert.ok(personas.includes('architect'));
  assert.ok(personas.includes('security'));
  assert.ok(personas.includes('implementer'));
  assert.ok(personas.includes('debugger'));
})) passed += 1; else failed += 1;

// --- Summary ---

console.log(`\n${passed} passed, ${failed} failed`);
console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exitCode = 1;
