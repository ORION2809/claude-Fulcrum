/**
 * Tests for scripts/lib/skill-deployers.js
 *
 * Run with: node tests/lib/skill-deployers.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

const {
  DEPLOYERS,
  copyRecursive,
  countFiles,
  deploySkill,
  deploySkillAntigravity,
  deploySkillClaude,
  deploySkillCodex,
  deploySkillCopilot,
  deploySkillCursor,
  deploySkillOpenCode,
  deploySkills,
  ensureDir,
  getDeployer,
} = require('../../scripts/lib/skill-deployers');

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

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'skill-deploy-test-'));
}

function createFakeSkillDir(tmpDir, skillId) {
  const skillDir = path.join(tmpDir, 'skills', skillId);
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), `# ${skillId}\nA fake skill.\n`);
  fs.writeFileSync(path.join(skillDir, 'helper.js'), `// helper for ${skillId}\n`);

  const subDir = path.join(skillDir, 'examples');
  fs.mkdirSync(subDir);
  fs.writeFileSync(path.join(subDir, 'example.md'), `Example for ${skillId}\n`);

  return {
    id: skillId,
    path: `skills/${skillId}`,
    absolutePath: skillDir,
    hasSkillFile: true,
    description: 'A fake skill.',
  };
}

function createFakeCopilotScaffold(sourceRoot) {
  const githubDir = path.join(sourceRoot, '.github');
  fs.mkdirSync(githubDir, { recursive: true });
  fs.writeFileSync(path.join(githubDir, 'copilot-instructions.md'), '# Copilot\n');

  const instructionsDir = path.join(githubDir, 'instructions');
  fs.mkdirSync(instructionsDir);
  fs.writeFileSync(path.join(instructionsDir, 'base.md'), 'instructions\n');

  const agentsDir = path.join(githubDir, 'agents');
  fs.mkdirSync(agentsDir);
  fs.writeFileSync(path.join(agentsDir, 'planner.md'), 'planner\n');

  const promptsDir = path.join(githubDir, 'prompts');
  fs.mkdirSync(promptsDir);
  fs.writeFileSync(path.join(promptsDir, 'default.md'), 'prompt\n');
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function runTests() {
  console.log('\n=== Testing skill-deployers.js ===\n');

  let passed = 0;
  let failed = 0;

  // --- Utility functions ---
  console.log('Utilities:');

  if (test('ensureDir creates nested directory', () => {
    const tmpDir = createTempDir();
    try {
      const deep = path.join(tmpDir, 'a', 'b', 'c');
      assert.ok(!fs.existsSync(deep));
      ensureDir(deep);
      assert.ok(fs.existsSync(deep));
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('ensureDir is idempotent', () => {
    const tmpDir = createTempDir();
    try {
      const dir = path.join(tmpDir, 'exists');
      fs.mkdirSync(dir);
      ensureDir(dir); // should not throw
      assert.ok(fs.existsSync(dir));
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('copyRecursive copies files and subdirectories', () => {
    const tmpDir = createTempDir();
    try {
      const src = path.join(tmpDir, 'src');
      const dest = path.join(tmpDir, 'dest');
      fs.mkdirSync(src);
      fs.writeFileSync(path.join(src, 'a.txt'), 'hello');
      const sub = path.join(src, 'sub');
      fs.mkdirSync(sub);
      fs.writeFileSync(path.join(sub, 'b.txt'), 'world');

      copyRecursive(src, dest);

      assert.ok(fs.existsSync(path.join(dest, 'a.txt')));
      assert.ok(fs.existsSync(path.join(dest, 'sub', 'b.txt')));
      assert.strictEqual(fs.readFileSync(path.join(dest, 'a.txt'), 'utf8'), 'hello');
      assert.strictEqual(fs.readFileSync(path.join(dest, 'sub', 'b.txt'), 'utf8'), 'world');
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('countFiles counts all files recursively', () => {
    const tmpDir = createTempDir();
    try {
      createFakeSkillDir(tmpDir, 'test-skill');
      const count = countFiles(path.join(tmpDir, 'skills', 'test-skill'));
      assert.strictEqual(count, 3); // SKILL.md, helper.js, examples/example.md
    } finally {
      cleanup(tmpDir);
    }
  })) passed++; else failed++;

  if (test('countFiles returns 0 for nonexistent dir', () => {
    assert.strictEqual(countFiles('/nonexistent/path'), 0);
  })) passed++; else failed++;

  // --- DEPLOYERS registry ---
  console.log('\nDEPLOYERS registry:');

  if (test('DEPLOYERS has entries for all 6 platforms', () => {
    const platforms = ['claude', 'cursor', 'codex', 'opencode', 'antigravity', 'copilot'];
    for (const p of platforms) {
      assert.strictEqual(typeof DEPLOYERS[p], 'function', `Missing deployer for ${p}`);
    }
  })) passed++; else failed++;

  if (test('DEPLOYERS is frozen', () => {
    assert.ok(Object.isFrozen(DEPLOYERS));
  })) passed++; else failed++;

  if (test('getDeployer returns function for valid platform', () => {
    const deployer = getDeployer('claude');
    assert.strictEqual(typeof deployer, 'function');
  })) passed++; else failed++;

  if (test('getDeployer throws for unknown platform', () => {
    assert.throws(() => getDeployer('unknown'), /Unknown platform/);
  })) passed++; else failed++;

  // --- Claude deployer ---
  console.log('\nClaude deployer:');

  if (test('deploys skill to ~/.claude/skills/<id>/', () => {
    const sourceDir = createTempDir();
    const homeDir = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'my-skill');
      const result = deploySkillClaude(skill, { homeDir });

      assert.strictEqual(result.platform, 'claude');
      assert.strictEqual(result.skillId, 'my-skill');
      assert.ok(result.destination.includes(path.join('.claude', 'skills', 'my-skill')));
      assert.strictEqual(result.fileCount, 3);
      assert.ok(fs.existsSync(path.join(result.destination, 'SKILL.md')));
    } finally {
      cleanup(sourceDir);
      cleanup(homeDir);
    }
  })) passed++; else failed++;

  // --- Cursor deployer ---
  console.log('\nCursor deployer:');

  if (test('deploys skill to <projectRoot>/.cursor/skills/<id>/', () => {
    const sourceDir = createTempDir();
    const projectRoot = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'cursor-skill');
      const result = deploySkillCursor(skill, { projectRoot });

      assert.strictEqual(result.platform, 'cursor');
      assert.strictEqual(result.skillId, 'cursor-skill');
      assert.ok(result.destination.includes(path.join('.cursor', 'skills', 'cursor-skill')));
      assert.ok(fs.existsSync(path.join(result.destination, 'helper.js')));
    } finally {
      cleanup(sourceDir);
      cleanup(projectRoot);
    }
  })) passed++; else failed++;

  // --- Codex deployer ---
  console.log('\nCodex deployer:');

  if (test('deploys skill to ~/.codex/skills/<id>/', () => {
    const sourceDir = createTempDir();
    const homeDir = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'codex-skill');
      const result = deploySkillCodex(skill, { homeDir });

      assert.strictEqual(result.platform, 'codex');
      assert.ok(result.destination.includes(path.join('.codex', 'skills', 'codex-skill')));
      assert.strictEqual(result.fileCount, 3);
    } finally {
      cleanup(sourceDir);
      cleanup(homeDir);
    }
  })) passed++; else failed++;

  // --- OpenCode deployer ---
  console.log('\nOpenCode deployer:');

  if (test('deploys skill to ~/.opencode/skills/<id>/', () => {
    const sourceDir = createTempDir();
    const homeDir = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'oc-skill');
      const result = deploySkillOpenCode(skill, { homeDir });

      assert.strictEqual(result.platform, 'opencode');
      assert.ok(result.destination.includes(path.join('.opencode', 'skills', 'oc-skill')));
    } finally {
      cleanup(sourceDir);
      cleanup(homeDir);
    }
  })) passed++; else failed++;

  // --- Antigravity deployer ---
  console.log('\nAntigravity deployer:');

  if (test('deploys skill to <projectRoot>/.agent/skills/<id>/', () => {
    const sourceDir = createTempDir();
    const projectRoot = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'ag-skill');
      const result = deploySkillAntigravity(skill, { projectRoot });

      assert.strictEqual(result.platform, 'antigravity');
      assert.ok(result.destination.includes(path.join('.agent', 'skills', 'ag-skill')));
    } finally {
      cleanup(sourceDir);
      cleanup(projectRoot);
    }
  })) passed++; else failed++;

  // --- Copilot deployer ---
  console.log('\nCopilot deployer:');

  if (test('deploys skill to <projectRoot>/.agents/skills/<id>/', () => {
    const sourceDir = createTempDir();
    const projectRoot = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'cop-skill');
      const result = deploySkillCopilot(skill, { projectRoot });

      assert.strictEqual(result.platform, 'copilot');
      assert.ok(result.destination.includes(path.join('.agents', 'skills', 'cop-skill')));
      assert.strictEqual(result.fileCount, 3);
    } finally {
      cleanup(sourceDir);
      cleanup(projectRoot);
    }
  })) passed++; else failed++;

  if (test('copies .github scaffold when includeCopilotScaffold is true', () => {
    const sourceDir = createTempDir();
    const projectRoot = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'cop-scaffold');
      createFakeCopilotScaffold(sourceDir);

      const result = deploySkillCopilot(skill, {
        projectRoot,
        sourceRoot: sourceDir,
        includeCopilotScaffold: true,
      });

      assert.ok(result.extras.includes('copilot-instructions.md'));
      assert.ok(result.extras.includes('instructions/'));
      assert.ok(result.extras.includes('agents/'));
      assert.ok(result.extras.includes('prompts/'));
      assert.ok(fs.existsSync(path.join(projectRoot, '.github', 'copilot-instructions.md')));
      assert.ok(fs.existsSync(path.join(projectRoot, '.github', 'instructions', 'base.md')));
    } finally {
      cleanup(sourceDir);
      cleanup(projectRoot);
    }
  })) passed++; else failed++;

  if (test('skips scaffold if already present at destination', () => {
    const sourceDir = createTempDir();
    const projectRoot = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'cop-existing');
      createFakeCopilotScaffold(sourceDir);

      // Pre-create one scaffold file
      const githubDest = path.join(projectRoot, '.github');
      fs.mkdirSync(githubDest, { recursive: true });
      fs.writeFileSync(path.join(githubDest, 'copilot-instructions.md'), '# Existing\n');

      const result = deploySkillCopilot(skill, {
        projectRoot,
        sourceRoot: sourceDir,
        includeCopilotScaffold: true,
      });

      // copilot-instructions.md should NOT be overwritten
      assert.ok(!result.extras.includes('copilot-instructions.md'));
      const content = fs.readFileSync(path.join(githubDest, 'copilot-instructions.md'), 'utf8');
      assert.strictEqual(content, '# Existing\n');
    } finally {
      cleanup(sourceDir);
      cleanup(projectRoot);
    }
  })) passed++; else failed++;

  // --- deploySkill (generic) ---
  console.log('\ndeploySkill (generic):');

  if (test('dispatches to correct platform deployer', () => {
    const sourceDir = createTempDir();
    const homeDir = createTempDir();
    try {
      const skill = createFakeSkillDir(sourceDir, 'gen-skill');
      const result = deploySkill(skill, 'claude', { homeDir });
      assert.strictEqual(result.platform, 'claude');
      assert.strictEqual(result.skillId, 'gen-skill');
    } finally {
      cleanup(sourceDir);
      cleanup(homeDir);
    }
  })) passed++; else failed++;

  if (test('throws for unknown platform', () => {
    assert.throws(
      () => deploySkill({ id: 'x', absolutePath: '/tmp' }, 'nonexistent', {}),
      /Unknown platform/
    );
  })) passed++; else failed++;

  // --- deploySkills (bulk) ---
  console.log('\ndeploySkills (bulk):');

  if (test('deploys multiple skills to one platform', () => {
    const sourceDir = createTempDir();
    const homeDir = createTempDir();
    try {
      const skill1 = createFakeSkillDir(sourceDir, 'bulk-a');
      const skill2 = createFakeSkillDir(sourceDir, 'bulk-b');
      const results = deploySkills([skill1, skill2], 'codex', { homeDir });
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].skillId, 'bulk-a');
      assert.strictEqual(results[1].skillId, 'bulk-b');
    } finally {
      cleanup(sourceDir);
      cleanup(homeDir);
    }
  })) passed++; else failed++;

  // Summary
  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
