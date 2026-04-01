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

// --- Crush deployer ---
// Skills go to: <projectRoot>/.crush/skills/<skill-id>/
// Crush (successor to OpenCode) uses NVIDIA NIM models with project-scoped skills.
function deploySkillCrush(skill, options) {
  const projectRoot = options.projectRoot || process.cwd();
  const destRoot = path.join(projectRoot, '.crush', 'skills');
  const destDir = path.join(destRoot, skill.id);
  copyRecursive(skill.absolutePath, destDir);

  return {
    platform: 'crush',
    skillId: skill.id,
    destination: destDir,
    fileCount: countFiles(destDir),
  };
}

const DEPLOYERS = Object.freeze({
  claude: deploySkillClaude,
  cursor: deploySkillCursor,
  codex: deploySkillCodex,
  opencode: deploySkillOpenCode,
  antigravity: deploySkillAntigravity,
  copilot: deploySkillCopilot,
  crush: deploySkillCrush,
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

// --- Scaffold: copy full platform dot-directories ---
// Mapping of dot-directory names to their scope and destination.
const SCAFFOLD_DIRS = [
  // Project-scoped — copied to projectRoot
  { dir: '.github', scope: 'project' },
  { dir: '.cursor', scope: 'project' },
  { dir: '.agents', scope: 'project' },
  { dir: '.claude', scope: 'project' },
  { dir: '.claude-plugin', scope: 'project' },
  { dir: '.kilo', scope: 'project' },
  { dir: '.kilocode', scope: 'project' },
  { dir: '.orchestration', scope: 'project' },
  // Home-scoped — copied to homeDir
  { dir: '.codex', scope: 'home' },
  { dir: '.crush', scope: 'project' },
  { dir: '.opencode', scope: 'home' },
];

// Individual files to scaffold to project root.
const SCAFFOLD_FILES = [
  '.mcp.json',       // Claude Code project-level MCP servers (code-review-graph, etc.)
  '.claude.json',    // Claude Code project hooks + MCP config
  'AGENTS.md',       // Agent routing instructions
  'CLAUDE.md',       // Claude Code project instructions
];

/**
 * Copy all platform dot-directories from the package source to the
 * project root (project-scoped) or home directory (home-scoped).
 * Also copies individual scaffold files to the project root.
 *
 * Uses merge-copy: existing files are overwritten, but existing
 * directories are preserved and merged into (not deleted).
 *
 * @param {object} options
 * @param {string} options.sourceRoot  — package root containing dot-dirs
 * @param {string} options.projectRoot — target project folder
 * @param {string} options.homeDir     — user home directory
 * @param {boolean} [options.dryRun]
 * @returns {{ copied: string[], skipped: string[], fileCount: number }}
 */
function scaffoldPlatformDirs(options) {
  const { sourceRoot, projectRoot, homeDir, dryRun } = options;
  const result = { copied: [], skipped: [], fileCount: 0 };

  for (const entry of SCAFFOLD_DIRS) {
    const src = path.join(sourceRoot, entry.dir);
    if (!fs.existsSync(src)) {
      result.skipped.push(entry.dir);
      continue;
    }

    const dest = entry.scope === 'home'
      ? path.join(homeDir, entry.dir)
      : path.join(projectRoot, entry.dir);

    if (!dryRun) {
      copyRecursive(src, dest);
    }

    const count = dryRun ? countFiles(src) : countFiles(dest);
    result.copied.push(entry.dir);
    result.fileCount += count;
  }

  // Copy individual scaffold files to project root
  for (const fileName of SCAFFOLD_FILES) {
    const src = path.join(sourceRoot, fileName);
    if (!fs.existsSync(src)) {
      result.skipped.push(fileName);
      continue;
    }

    const dest = path.join(projectRoot, fileName);
    if (!dryRun) {
      fs.copyFileSync(src, dest);
    }
    result.copied.push(fileName);
    result.fileCount += 1;
  }

  return result;
}

module.exports = {
  DEPLOYERS,
  SCAFFOLD_DIRS,
  SCAFFOLD_FILES,
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
  scaffoldPlatformDirs,
};
