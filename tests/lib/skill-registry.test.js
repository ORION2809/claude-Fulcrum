/**
 * Tests for scripts/lib/skill-registry.js
 *
 * Run with: node tests/lib/skill-registry.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

const {
  PLATFORM_TARGETS,
  SKILL_ENTRY_FILE,
  buildSkillRegistry,
  discoverSkills,
  extractDescription,
  findSkillsByIds,
  findSkillsByModule,
  getSourceRoot,
  listSkillIds,
  loadModuleSkillMapping,
  validateSkillIds,
} = require('../../scripts/lib/skill-registry');

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (err) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function createTempSkillsDir() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-reg-test-'));
  const skillsDir = path.join(tmpDir, 'skills');
  fs.mkdirSync(skillsDir, { recursive: true });

  // Create skill-a with SKILL.md
  const skillA = path.join(skillsDir, 'skill-a');
  fs.mkdirSync(skillA);
  fs.writeFileSync(path.join(skillA, 'SKILL.md'), '# Skill A\nThis is skill A description.\n');

  // Create skill-b with SKILL.md
  const skillB = path.join(skillsDir, 'skill-b');
  fs.mkdirSync(skillB);
  fs.writeFileSync(path.join(skillB, 'SKILL.md'), '# Skill B\n---\nSkill B does things.\n');

  // Create skill-c without SKILL.md
  const skillC = path.join(skillsDir, 'skill-c');
  fs.mkdirSync(skillC);
  fs.writeFileSync(path.join(skillC, 'readme.md'), 'No SKILL.md here');

  // Create a file (not dir) in skills/ — should be ignored
  fs.writeFileSync(path.join(skillsDir, 'not-a-skill.txt'), 'ignore me');

  return tmpDir;
}

function createTempWithManifest() {
  const tmpDir = createTempSkillsDir();
  const manifestsDir = path.join(tmpDir, 'manifests');
  fs.mkdirSync(manifestsDir, { recursive: true });

  const manifest = {
    modules: [
      {
        id: 'testing-skills',
        kind: 'skills',
        paths: ['skills'],
        targets: ['claude', 'cursor'],
        dependencies: ['rules-core'],
      },
      {
        id: 'non-skill-module',
        kind: 'rules',
        paths: ['rules'],
        targets: ['claude'],
      },
    ],
  };

  fs.writeFileSync(
    path.join(manifestsDir, 'install-modules.json'),
    JSON.stringify(manifest, null, 2)
  );

  return tmpDir;
}

function cleanup(tmpDir) {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

function runTests() {
  console.log('\n=== Testing skill-registry.js ===\n');

  let passed = 0;
  let failed = 0;

  // --- Constants ---
  console.log('Constants:');

  if (test('PLATFORM_TARGETS contains 6 platforms', () => {
    assert.strictEqual(PLATFORM_TARGETS.length, 6);
    assert.ok(PLATFORM_TARGETS.includes('claude'));
    assert.ok(PLATFORM_TARGETS.includes('cursor'));
    assert.ok(PLATFORM_TARGETS.includes('codex'));
    assert.ok(PLATFORM_TARGETS.includes('opencode'));
    assert.ok(PLATFORM_TARGETS.includes('antigravity'));
    assert.ok(PLATFORM_TARGETS.includes('copilot'));
  })) passed++; else failed++;

  if (test('PLATFORM_TARGETS is frozen', () => {
    assert.ok(Object.isFrozen(PLATFORM_TARGETS));
  })) passed++; else failed++;

  if (test('SKILL_ENTRY_FILE is SKILL.md', () => {
    assert.strictEqual(SKILL_ENTRY_FILE, 'SKILL.md');
  })) passed++; else failed++;

  // --- getSourceRoot ---
  console.log('\ngetSourceRoot:');

  if (test('returns the repo root directory', () => {
    const root = getSourceRoot();
    assert.ok(fs.existsSync(root));
    assert.ok(fs.existsSync(path.join(root, 'skills')));
  })) passed++; else failed++;

  // --- discoverSkills ---
  console.log('\ndiscoverSkills:');

  if (test('discovers skill directories with metadata', () => {
    const tmpDir = createTempSkillsDir();
    try {
      const skills = discoverSkills(tmpDir);
      assert.strictEqual(skills.length, 3);

      const ids = skills.map(s => s.id);
      assert.ok(ids.includes('skill-a'));
      assert.ok(ids.includes('skill-b'));
      assert.ok(ids.includes('skill-c'));

      const skillA = skills.find(s => s.id === 'skill-a');
      assert.ok(skillA.hasSkillFile);
      assert.strictEqual(skillA.path, 'skills/skill-a');
      assert.ok(skillA.absolutePath.endsWith(path.join('skills', 'skill-a')));

      const skillC = skills.find(s => s.id === 'skill-c');
      assert.ok(!skillC.hasSkillFile);
      assert.strictEqual(skillC.description, null);
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('returns sorted by id', () => {
    const tmpDir = createTempSkillsDir();
    try {
      const skills = discoverSkills(tmpDir);
      const ids = skills.map(s => s.id);
      assert.deepStrictEqual(ids, [...ids].sort());
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('returns empty array for missing skills dir', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-empty-'));
    try {
      const skills = discoverSkills(tmpDir);
      assert.deepStrictEqual(skills, []);
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  // --- extractDescription ---
  console.log('\nextractDescription:');

  if (test('extracts first non-heading non-frontmatter line', () => {
    const tmpDir = createTempSkillsDir();
    try {
      const desc = extractDescription(path.join(tmpDir, 'skills', 'skill-a', 'SKILL.md'));
      assert.strictEqual(desc, 'This is skill A description.');
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('skips frontmatter lines', () => {
    const tmpDir = createTempSkillsDir();
    try {
      const desc = extractDescription(path.join(tmpDir, 'skills', 'skill-b', 'SKILL.md'));
      assert.strictEqual(desc, 'Skill B does things.');
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('returns null for non-existent file', () => {
    const desc = extractDescription('/nonexistent/path/SKILL.md');
    assert.strictEqual(desc, null);
  })) passed++; else failed++;

  // --- loadModuleSkillMapping ---
  console.log('\nloadModuleSkillMapping:');

  if (test('loads mapping from manifest for skills modules', () => {
    const tmpDir = createTempWithManifest();
    try {
      const mapping = loadModuleSkillMapping(tmpDir);
      assert.ok(mapping instanceof Map);

      // skill-a, skill-b, skill-c should be mapped to testing-skills
      const skillAInfo = mapping.get('skill-a');
      assert.ok(skillAInfo);
      assert.strictEqual(skillAInfo.moduleId, 'testing-skills');
      assert.deepStrictEqual(skillAInfo.targets, ['claude', 'cursor']);
      assert.deepStrictEqual(skillAInfo.dependencies, ['rules-core']);
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('returns empty map if no manifest exists', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-nomanifest-'));
    try {
      const mapping = loadModuleSkillMapping(tmpDir);
      assert.ok(mapping instanceof Map);
      assert.strictEqual(mapping.size, 0);
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  // --- buildSkillRegistry ---
  console.log('\nbuildSkillRegistry:');

  if (test('merges discovered skills with module info', () => {
    const tmpDir = createTempWithManifest();
    try {
      const registry = buildSkillRegistry(tmpDir);
      assert.strictEqual(registry.length, 3);

      const skillA = registry.find(s => s.id === 'skill-a');
      assert.strictEqual(skillA.moduleId, 'testing-skills');
      assert.deepStrictEqual(skillA.supportedTargets, ['claude', 'cursor']);
      assert.deepStrictEqual(skillA.dependencies, ['rules-core']);
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('skills without module get default targets (all except copilot)', () => {
    const tmpDir = createTempSkillsDir();
    try {
      // No manifest — skills should get default targets
      const registry = buildSkillRegistry(tmpDir);
      const skillA = registry.find(s => s.id === 'skill-a');
      assert.strictEqual(skillA.moduleId, null);
      assert.ok(!skillA.supportedTargets.includes('copilot'));
      assert.ok(skillA.supportedTargets.includes('claude'));
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  // --- validateSkillIds ---
  console.log('\nvalidateSkillIds:');

  if (test('separates valid and invalid skill IDs', () => {
    const tmpDir = createTempSkillsDir();
    try {
      const registry = buildSkillRegistry(tmpDir);
      const result = validateSkillIds(registry, ['skill-a', 'nonexistent', 'skill-c']);
      assert.deepStrictEqual(result.valid, ['skill-a', 'skill-c']);
      assert.deepStrictEqual(result.invalid, ['nonexistent']);
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('returns all invalid for empty registry', () => {
    const result = validateSkillIds([], ['foo', 'bar']);
    assert.deepStrictEqual(result.valid, []);
    assert.deepStrictEqual(result.invalid, ['foo', 'bar']);
  })) passed++; else failed++;

  // --- findSkillsByIds ---
  console.log('\nfindSkillsByIds:');

  if (test('finds skills by IDs', () => {
    const tmpDir = createTempSkillsDir();
    try {
      const registry = buildSkillRegistry(tmpDir);
      const found = findSkillsByIds(registry, ['skill-b']);
      assert.strictEqual(found.length, 1);
      assert.strictEqual(found[0].id, 'skill-b');
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  // --- findSkillsByModule ---
  console.log('\nfindSkillsByModule:');

  if (test('finds skills by module ID', () => {
    const tmpDir = createTempWithManifest();
    try {
      const registry = buildSkillRegistry(tmpDir);
      const found = findSkillsByModule(registry, 'testing-skills');
      assert.strictEqual(found.length, 3);
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  // --- listSkillIds ---
  console.log('\nlistSkillIds:');

  if (test('lists just the IDs from real repo', () => {
    const ids = listSkillIds();
    assert.ok(Array.isArray(ids));
    assert.ok(ids.length > 0);
    for (const id of ids) {
      assert.strictEqual(typeof id, 'string');
    }
  })) passed++; else failed++;

  // Summary
  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
