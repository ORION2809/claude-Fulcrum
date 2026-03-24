'use strict';

const fs = require('fs');
const path = require('path');

const SKILL_ENTRY_FILE = 'SKILL.md';

const PLATFORM_TARGETS = Object.freeze([
  'claude',
  'cursor',
  'antigravity',
  'codex',
  'opencode',
  'copilot',
]);

function getSourceRoot() {
  return path.join(__dirname, '../..');
}

function discoverSkills(sourceRoot) {
  const skillsDir = path.join(sourceRoot, 'skills');
  if (!fs.existsSync(skillsDir)) {
    return [];
  }

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillPath = path.join(skillsDir, entry.name);
    const skillFile = path.join(skillPath, SKILL_ENTRY_FILE);
    const hasSkillFile = fs.existsSync(skillFile);

    skills.push({
      id: entry.name,
      path: `skills/${entry.name}`,
      absolutePath: skillPath,
      hasSkillFile,
      description: hasSkillFile ? extractDescription(skillFile) : null,
    });
  }

  return skills.sort((a, b) => a.id.localeCompare(b.id));
}

function extractDescription(skillFilePath) {
  try {
    const content = fs.readFileSync(skillFilePath, 'utf8');
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
        return trimmed.slice(0, 200);
      }
    }

    return null;
  } catch (_error) {
    return null;
  }
}

function loadModuleSkillMapping(sourceRoot) {
  const manifestPath = path.join(sourceRoot, 'manifests', 'install-modules.json');
  if (!fs.existsSync(manifestPath)) {
    return new Map();
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const mapping = new Map();

  for (const module of manifest.modules) {
    if (module.kind !== 'skills') {
      continue;
    }

    const modulePaths = Array.isArray(module.paths) ? module.paths : [];

    for (const modulePath of modulePaths) {
      const resolved = path.join(sourceRoot, modulePath);
      if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
        const subDirs = fs.readdirSync(resolved, { withFileTypes: true })
          .filter(e => e.isDirectory())
          .map(e => e.name);

        for (const skillId of subDirs) {
          mapping.set(skillId, {
            moduleId: module.id,
            targets: module.targets || [],
            dependencies: module.dependencies || [],
          });
        }
      }
    }
  }

  return mapping;
}

function buildSkillRegistry(sourceRoot) {
  const root = sourceRoot || getSourceRoot();
  const skills = discoverSkills(root);
  const moduleMapping = loadModuleSkillMapping(root);

  return skills.map(skill => {
    const moduleInfo = moduleMapping.get(skill.id) || null;
    return {
      ...skill,
      moduleId: moduleInfo ? moduleInfo.moduleId : null,
      supportedTargets: moduleInfo ? moduleInfo.targets : PLATFORM_TARGETS.filter(t => t !== 'copilot'),
      dependencies: moduleInfo ? moduleInfo.dependencies : [],
    };
  });
}

function findSkillsByIds(registry, skillIds) {
  const idSet = new Set(skillIds);
  return registry.filter(skill => idSet.has(skill.id));
}

function findSkillsByModule(registry, moduleId) {
  return registry.filter(skill => skill.moduleId === moduleId);
}

function listSkillIds(sourceRoot) {
  return discoverSkills(sourceRoot || getSourceRoot()).map(s => s.id);
}

function validateSkillIds(registry, requestedIds) {
  const knownIds = new Set(registry.map(s => s.id));
  const valid = [];
  const invalid = [];

  for (const id of requestedIds) {
    if (knownIds.has(id)) {
      valid.push(id);
    } else {
      invalid.push(id);
    }
  }

  return { valid, invalid };
}

module.exports = {
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
};
