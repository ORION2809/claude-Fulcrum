'use strict';

/**
 * Platform-specific skill deployers.
 *
 * Each deployer knows how to place skills into the correct location and format
 * for a given platform (Claude, Cursor, Codex, OpenCode, Copilot, Antigravity).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function countFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  let count = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dirPath, entry.name));
    } else if (entry.isFile()) {
      count += 1;
    }
  }

  return count;
}

// --- Claude deployer ---
// Skills go to: ~/.claude/skills/<skill-id>/
function deploySkillClaude(skill, options) {
  const homeDir = options.homeDir || os.homedir();
  const destRoot = path.join(homeDir, '.claude', 'skills');
  const destDir = path.join(destRoot, skill.id);
  copyRecursive(skill.absolutePath, destDir);

  return {
    platform: 'claude',
    skillId: skill.id,
    destination: destDir,
    fileCount: countFiles(destDir),
  };
}

// --- Cursor deployer ---
// Skills go to: <projectRoot>/.cursor/skills/<skill-id>/
function deploySkillCursor(skill, options) {
  const projectRoot = options.projectRoot || process.cwd();
  const destRoot = path.join(projectRoot, '.cursor', 'skills');
  const destDir = path.join(destRoot, skill.id);
  copyRecursive(skill.absolutePath, destDir);

  return {
    platform: 'cursor',
    skillId: skill.id,
    destination: destDir,
    fileCount: countFiles(destDir),
  };
}

// --- Codex deployer ---
// Skills go to: ~/.codex/skills/<skill-id>/
function deploySkillCodex(skill, options) {
  const homeDir = options.homeDir || os.homedir();
  const destRoot = path.join(homeDir, '.codex', 'skills');
  const destDir = path.join(destRoot, skill.id);
  copyRecursive(skill.absolutePath, destDir);

  return {
    platform: 'codex',
    skillId: skill.id,
    destination: destDir,
    fileCount: countFiles(destDir),
  };
}

// --- OpenCode deployer ---
// Skills go to: ~/.opencode/skills/<skill-id>/
function deploySkillOpenCode(skill, options) {
  const homeDir = options.homeDir || os.homedir();
  const destRoot = path.join(homeDir, '.opencode', 'skills');
  const destDir = path.join(destRoot, skill.id);
  copyRecursive(skill.absolutePath, destDir);

  return {
    platform: 'opencode',
    skillId: skill.id,
    destination: destDir,
    fileCount: countFiles(destDir),
  };
}

// --- Antigravity deployer ---
// Skills go to: <projectRoot>/.agent/skills/<skill-id>/
function deploySkillAntigravity(skill, options) {
  const projectRoot = options.projectRoot || process.cwd();
  const destRoot = path.join(projectRoot, '.agent', 'skills');
  const destDir = path.join(destRoot, skill.id);
  copyRecursive(skill.absolutePath, destDir);

  return {
    platform: 'antigravity',
    skillId: skill.id,
    destination: destDir,
    fileCount: countFiles(destDir),
  };
}

// --- Copilot deployer ---
// Skills go to: <projectRoot>/.claude/skills/<skill-id>/
// Copilot coding agent can read Claude-format skills directly from .claude/skills.
// Optional .github scaffold is still copied for prompts, agents, and instruction files.
function deploySkillCopilot(skill, options) {
  const projectRoot = options.projectRoot || process.cwd();
  const sourceRoot = options.sourceRoot;
  const destRoot = path.join(projectRoot, '.claude', 'skills');
  const destDir = path.join(destRoot, skill.id);
  copyRecursive(skill.absolutePath, destDir);

  const result = {
    platform: 'copilot',
    skillId: skill.id,
    destination: destDir,
    fileCount: countFiles(destDir),
    extras: [],
  };

  if (sourceRoot && options.includeCopilotScaffold) {
    const githubSrc = path.join(sourceRoot, '.github');
    const githubDest = path.join(projectRoot, '.github');

    const copilotInstructionsSrc = path.join(githubSrc, 'copilot-instructions.md');
    const copilotInstructionsDest = path.join(githubDest, 'copilot-instructions.md');
    if (fs.existsSync(copilotInstructionsSrc) && !fs.existsSync(copilotInstructionsDest)) {
      ensureDir(githubDest);
      fs.copyFileSync(copilotInstructionsSrc, copilotInstructionsDest);
      result.extras.push('copilot-instructions.md');
    }

    const instructionsSrc = path.join(githubSrc, 'instructions');
    const instructionsDest = path.join(githubDest, 'instructions');
    if (fs.existsSync(instructionsSrc) && !fs.existsSync(instructionsDest)) {
      copyRecursive(instructionsSrc, instructionsDest);
      result.extras.push('instructions/');
    }

    const agentsSrc = path.join(githubSrc, 'agents');
    const agentsDest = path.join(githubDest, 'agents');
    if (fs.existsSync(agentsSrc) && !fs.existsSync(agentsDest)) {
      copyRecursive(agentsSrc, agentsDest);
      result.extras.push('agents/');
    }

    const promptsSrc = path.join(githubSrc, 'prompts');
    const promptsDest = path.join(githubDest, 'prompts');
    if (fs.existsSync(promptsSrc) && !fs.existsSync(promptsDest)) {
      copyRecursive(promptsSrc, promptsDest);
      result.extras.push('prompts/');
    }
  }

  return result;
}

const DEPLOYERS = Object.freeze({
  claude: deploySkillClaude,
  cursor: deploySkillCursor,
  codex: deploySkillCodex,
  opencode: deploySkillOpenCode,
  antigravity: deploySkillAntigravity,
  copilot: deploySkillCopilot,
});

function getDeployer(platform) {
  const deployer = DEPLOYERS[platform];
  if (!deployer) {
    throw new Error(`Unknown platform: ${platform}. Supported: ${Object.keys(DEPLOYERS).join(', ')}`);
  }
  return deployer;
}

function deploySkill(skill, platform, options) {
  const deployer = getDeployer(platform);
  return deployer(skill, options);
}

function deploySkills(skills, platform, options) {
  return skills.map(skill => deploySkill(skill, platform, options));
}

module.exports = {
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
};
