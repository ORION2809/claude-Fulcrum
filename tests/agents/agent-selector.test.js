#!/usr/bin/env node
'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

const {
  AGENT_TIERS,
  TIER_PRIORITY,
  SELECTION_WEIGHTS,
  MIN_CONFIDENCE,
  HIGH_CONFIDENCE,
  DEFAULT_AGENT,
  TRAIT_CONFLICTS,
  TRAIT_TENSIONS,
  parseFrontmatter,
  parseListField,
  createRegistry,
  discoverAgents,
  parseAgentFile,
  calculateScore,
  processTraits,
  selectAgent,
  getAgentSuggestions,
} = require('../../scripts/lib/agent-selector');

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

console.log('\nAgent Selector Tests (Phase 6.1)');
console.log('================================\n');

let passed = 0;
let failed = 0;

// --- Constants ---

if (test('AGENT_TIERS has core, trait, extension', () => {
  assert.strictEqual(AGENT_TIERS.CORE, 'core');
  assert.strictEqual(AGENT_TIERS.TRAIT, 'trait');
  assert.strictEqual(AGENT_TIERS.EXTENSION, 'extension');
  assert.ok(Object.isFrozen(AGENT_TIERS));
})) passed += 1; else failed += 1;

if (test('TIER_PRIORITY core=1 trait=0 extension=2', () => {
  assert.strictEqual(TIER_PRIORITY[AGENT_TIERS.CORE], 1);
  assert.strictEqual(TIER_PRIORITY[AGENT_TIERS.TRAIT], 0);
  assert.strictEqual(TIER_PRIORITY[AGENT_TIERS.EXTENSION], 2);
})) passed += 1; else failed += 1;

if (test('SELECTION_WEIGHTS sum to 1.0', () => {
  const sum = Object.values(SELECTION_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1.0) < 0.001, `sum is ${sum}`);
})) passed += 1; else failed += 1;

if (test('MIN_CONFIDENCE and HIGH_CONFIDENCE are correct', () => {
  assert.strictEqual(MIN_CONFIDENCE, 0.15);
  assert.strictEqual(HIGH_CONFIDENCE, 0.5);
})) passed += 1; else failed += 1;

if (test('DEFAULT_AGENT is general-purpose', () => {
  assert.strictEqual(DEFAULT_AGENT, 'general-purpose');
})) passed += 1; else failed += 1;

if (test('TRAIT_CONFLICTS has minimal-changes < > rapid-prototype', () => {
  assert.ok(TRAIT_CONFLICTS['minimal-changes'].has('rapid-prototype'));
  assert.ok(TRAIT_CONFLICTS['rapid-prototype'].has('minimal-changes'));
})) passed += 1; else failed += 1;

if (test('TRAIT_TENSIONS has legacy-friendly < > cloud-native', () => {
  assert.ok(TRAIT_TENSIONS['legacy-friendly'].has('cloud-native'));
  assert.ok(TRAIT_TENSIONS['cloud-native'].has('legacy-friendly'));
})) passed += 1; else failed += 1;

// --- Frontmatter Parser ---

if (test('parseFrontmatter extracts YAML fields', () => {
  const content = '---\nname: test-agent\ndescription: A test agent\ncategory: review\n---\n# Body';
  const result = parseFrontmatter(content);
  assert.strictEqual(result.name, 'test-agent');
  assert.strictEqual(result.description, 'A test agent');
  assert.strictEqual(result.category, 'review');
})) passed += 1; else failed += 1;

if (test('parseFrontmatter handles booleans and numbers', () => {
  const content = '---\nname: x\nenabled: true\npriority: 5\n---\n';
  const result = parseFrontmatter(content);
  assert.strictEqual(result.enabled, true);
  assert.strictEqual(result.priority, 5);
})) passed += 1; else failed += 1;

if (test('parseFrontmatter returns null for no frontmatter', () => {
  assert.strictEqual(parseFrontmatter('# No frontmatter'), null);
})) passed += 1; else failed += 1;

if (test('parseListField extracts list items', () => {
  const content = 'triggers:\n- review\n- security\n- build\n\nBody text';
  const items = parseListField(content, 'triggers');
  assert.deepStrictEqual(items, ['review', 'security', 'build']);
})) passed += 1; else failed += 1;

if (test('parseListField returns empty for missing field', () => {
  const items = parseListField('no such field here', 'triggers');
  assert.deepStrictEqual(items, []);
})) passed += 1; else failed += 1;

// --- calculateScore ---

if (test('calculateScore returns high score for trigger match', () => {
  const config = {
    name: 'code-reviewer',
    triggers: ['review', 'quality', 'lint'],
    category: 'review',
    filePatterns: [],
    priority: 1,
  };
  const context = { task: 'review the code for quality issues' };
  const { score, breakdown, matched } = calculateScore(context, config, null);
  assert.ok(score > 0.3, `score ${score} should be > 0.3`);
  assert.ok(breakdown.triggers > 0);
  assert.ok(matched.length > 0);
})) passed += 1; else failed += 1;

if (test('calculateScore category hint boosts score', () => {
  const config = {
    name: 'sec-agent',
    triggers: ['security'],
    category: 'security',
    filePatterns: [],
    priority: 1,
  };
  const context = { task: 'check auth' };
  const withHint = calculateScore(context, config, 'security');
  const withoutHint = calculateScore(context, config, null);
  assert.ok(withHint.score > withoutHint.score, 'hint should increase score');
})) passed += 1; else failed += 1;

if (test('calculateScore file pattern matching works', () => {
  const config = {
    name: 'test-agent',
    triggers: [],
    category: 'testing',
    filePatterns: ['*.test.js', '*.spec.ts'],
    priority: 1,
  };
  const context = { task: 'test', files: ['app.test.js'] };
  const { breakdown } = calculateScore(context, config, null);
  assert.ok(breakdown.filePatterns > 0, 'file pattern should match');
})) passed += 1; else failed += 1;

if (test('calculateScore priority bonus favors higher-priority agents', () => {
  const highPri = { name: 'a', triggers: [], category: '', filePatterns: [], priority: 0 };
  const lowPri = { name: 'b', triggers: [], category: '', filePatterns: [], priority: 3 };
  const ctx = { task: 'something' };
  const { breakdown: bhi } = calculateScore(ctx, highPri, null);
  const { breakdown: blo } = calculateScore(ctx, lowPri, null);
  assert.ok(bhi.priority > blo.priority, 'higher priority should get bigger bonus');
})) passed += 1; else failed += 1;

if (test('calculateScore with string context works', () => {
  const config = { name: 'builder', triggers: ['build'], category: 'build', filePatterns: [], priority: 1 };
  const { score } = calculateScore('please build the project', config, null);
  assert.ok(score > 0);
})) passed += 1; else failed += 1;

// --- processTraits ---

if (test('processTraits detects conflicts', () => {
  const registry = {
    traits: {
      'minimal-changes': { name: 'minimal-changes' },
      'rapid-prototype': { name: 'rapid-prototype' },
    },
  };
  const result = processTraits(['minimal-changes', 'rapid-prototype'], registry);
  assert.strictEqual(result.conflicts.length, 1);
  assert.deepStrictEqual(result.conflicts[0], ['minimal-changes', 'rapid-prototype']);
})) passed += 1; else failed += 1;

if (test('processTraits detects tensions', () => {
  const registry = {
    traits: {
      'legacy-friendly': { name: 'legacy-friendly' },
      'cloud-native': { name: 'cloud-native' },
    },
  };
  const result = processTraits(['legacy-friendly', 'cloud-native'], registry);
  assert.strictEqual(result.tensions.length, 1);
})) passed += 1; else failed += 1;

if (test('processTraits reports invalid traits', () => {
  const registry = { traits: { valid: { name: 'valid' } } };
  const result = processTraits(['valid', 'nonexistent'], registry);
  assert.deepStrictEqual(result.valid, ['valid']);
  assert.deepStrictEqual(result.invalid, ['nonexistent']);
})) passed += 1; else failed += 1;

// --- createRegistry + discoverAgents ---

if (test('createRegistry returns frozen structure', () => {
  const reg = createRegistry('/tmp/agents');
  assert.ok(Object.isFrozen(reg));
  assert.strictEqual(reg.agentsDir, '/tmp/agents');
})) passed += 1; else failed += 1;

if (test('discoverAgents reads real agents/ directory', () => {
  const agentsDir = path.resolve(__dirname, '../../agents');
  if (!fs.existsSync(agentsDir)) {
    console.log('    (skipped: agents/ dir not found)');
    passed += 1; // skip gracefully
    return;
  }
  const reg = createRegistry(agentsDir);
  const populated = discoverAgents(reg);
  assert.ok(Object.keys(populated.agents).length > 0, 'should discover agents');
})) passed += 1; else failed += 1;

// --- parseAgentFile ---

if (test('parseAgentFile parses a markdown agent file', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-test-'));
  const agentFile = path.join(tmpDir, 'test-agent.md');
  fs.writeFileSync(agentFile, '---\nname: test-agent\ndescription: Test agent for testing\ncategory: testing\n---\n\n# Test Agent\n\ntriggers:\n- test\n- spec\n');
  const config = parseAgentFile(agentFile, AGENT_TIERS.CORE);
  assert.strictEqual(config.name, 'test-agent');
  assert.strictEqual(config.tier, 'core');
  assert.ok(config.triggers.includes('test'));
  fs.rmSync(tmpDir, { recursive: true });
})) passed += 1; else failed += 1;

if (test('parseAgentFile returns null for invalid file', () => {
  const result = parseAgentFile('/nonexistent/file.md', AGENT_TIERS.CORE);
  assert.strictEqual(result, null);
})) passed += 1; else failed += 1;

// --- selectAgent ---

if (test('selectAgent returns best match from registry', () => {
  const reg = {
    agents: {
      'code-reviewer': { name: 'code-reviewer', triggers: ['review', 'quality'], category: 'review', filePatterns: [], priority: 1, filePath: '/agents/code-reviewer.md' },
      'tdd-guide': { name: 'tdd-guide', triggers: ['test', 'tdd', 'coverage'], category: 'testing', filePatterns: ['*.test.js'], priority: 1, filePath: '/agents/tdd-guide.md' },
    },
    traits: {},
    agentsDir: '/agents',
  };
  const result = selectAgent(reg, { task: 'review the code quality' });
  assert.strictEqual(result.agentName, 'code-reviewer');
  assert.ok(result.confidence > 0);
  assert.ok(Array.isArray(result.alternatives));
})) passed += 1; else failed += 1;

if (test('selectAgent falls back to default when no match', () => {
  const reg = { agents: {}, traits: {}, agentsDir: '/agents' };
  const result = selectAgent(reg, { task: 'something totally unrelated abcxyz' });
  assert.strictEqual(result.agentName, DEFAULT_AGENT);
})) passed += 1; else failed += 1;

if (test('selectAgent excludes agents', () => {
  const reg = {
    agents: {
      'code-reviewer': { name: 'code-reviewer', triggers: ['review'], category: 'review', filePatterns: [], priority: 1, filePath: '' },
    },
    traits: {},
    agentsDir: '/agents',
  };
  const result = selectAgent(reg, { task: 'review' }, { excludeAgents: ['code-reviewer'] });
  assert.strictEqual(result.agentName, DEFAULT_AGENT);
})) passed += 1; else failed += 1;

if (test('selectAgent includes trait paths and conflicts', () => {
  const reg = {
    agents: {
      'code-reviewer': { name: 'code-reviewer', triggers: ['review'], category: 'review', filePatterns: [], priority: 1, filePath: '' },
    },
    traits: {
      'minimal-changes': { name: 'minimal-changes', filePath: '/traits/minimal-changes.md' },
      'rapid-prototype': { name: 'rapid-prototype', filePath: '/traits/rapid-prototype.md' },
    },
    agentsDir: '/agents',
  };
  const result = selectAgent(reg, { task: 'review' }, { traits: ['minimal-changes', 'rapid-prototype'] });
  assert.strictEqual(result.conflicts.length, 1);
  assert.strictEqual(result.traitPaths.length, 2);
})) passed += 1; else failed += 1;

// --- getAgentSuggestions ---

if (test('getAgentSuggestions returns top-N list', () => {
  const reg = {
    agents: {
      a: { name: 'a', triggers: ['review'], category: 'review', filePatterns: [], priority: 1, filePath: '' },
      b: { name: 'b', triggers: ['test'], category: 'testing', filePatterns: [], priority: 1, filePath: '' },
      c: { name: 'c', triggers: ['build'], category: 'build', filePatterns: [], priority: 1, filePath: '' },
    },
    traits: {},
    agentsDir: '/agents',
  };
  const suggestions = getAgentSuggestions(reg, { task: 'review and test' }, 3);
  assert.ok(suggestions.length <= 3);
  assert.ok(suggestions[0].name);
  assert.ok(typeof suggestions[0].confidence === 'number');
})) passed += 1; else failed += 1;

// --- Summary ---

console.log(`\n${passed} passed, ${failed} failed`);
console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exitCode = 1;
