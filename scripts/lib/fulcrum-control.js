'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { ensureDir } = require('./utils');

function getRepoRoot() {
  return process.cwd();
}

function getControlPlanePath(repoRoot = getRepoRoot()) {
  return path.join(repoRoot, 'config', 'hook-control-plane.json');
}

function loadControlPlane(repoRoot = getRepoRoot()) {
  const controlPlanePath = getControlPlanePath(repoRoot);
  if (!fs.existsSync(controlPlanePath)) {
    return {
      protectedPaths: [],
      governance: {
        logDir: '.claude/ecc/governance',
      },
      memory: {
        viewDir: '.claude/memory',
        parentTokenBudget: 500,
      },
      qualityLoop: {
        threshold: 70,
        maxIterations: 5,
        timeoutMs: 300000,
      },
    };
  }

  return JSON.parse(fs.readFileSync(controlPlanePath, 'utf8'));
}

function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function createStableId(prefix, value) {
  return `${prefix}-${hashValue(value).slice(0, 16)}`;
}

function getGovernanceDir(repoRoot = getRepoRoot()) {
  const controlPlane = loadControlPlane(repoRoot);
  return path.join(repoRoot, controlPlane.governance?.logDir || '.claude/ecc/governance');
}

function getGovernanceLogPath(repoRoot = getRepoRoot()) {
  return path.join(getGovernanceDir(repoRoot), 'events.jsonl');
}

function getRepoHookTrustPath(repoRoot = getRepoRoot()) {
  return path.join(getGovernanceDir(repoRoot), 'repo-hook-trust.json');
}

function getMemoryViewDir(repoRoot = getRepoRoot()) {
  const controlPlane = loadControlPlane(repoRoot);
  return path.join(repoRoot, controlPlane.memory?.viewDir || '.claude/memory');
}

function ensureControlPlaneDirs(repoRoot = getRepoRoot()) {
  ensureDir(getGovernanceDir(repoRoot));
  ensureDir(getMemoryViewDir(repoRoot));
}

function getPlatformName() {
  if (process.env.CLAUDE_PLUGIN_ROOT) {
    return 'claude-code';
  }
  if (process.env.CODEX_SANDBOX_NETWORK_DISABLED !== undefined) {
    return 'codex-cli';
  }
  return 'local';
}

module.exports = {
  createStableId,
  ensureControlPlaneDirs,
  getControlPlanePath,
  getGovernanceDir,
  getGovernanceLogPath,
  getMemoryViewDir,
  getPlatformName,
  getRepoHookTrustPath,
  getRepoRoot,
  hashValue,
  loadControlPlane,
};
