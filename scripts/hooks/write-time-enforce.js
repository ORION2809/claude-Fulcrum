#!/usr/bin/env node
'use strict';

/**
 * Phase 5.4 - Write-Time Enforcement Pipeline
 * Source: Plankton (.claude/hooks/ - multi_linter.sh, enforce_package_managers.sh)
 *
 * Explicit four-step pipeline:
 * 1. Auto-format
 * 2. Collect structured violations
 * 3. Delegate fixes via subprocess (model-tier routing from plankton)
 * 4. Re-verify (hash comparison + re-lint)
 *
 * Config-driven routing with per-tier tool permissions, timeouts, and package-manager policy.
 * Fail-open if hook infrastructure breaks, but always emit governance event.
 *
 * Phase 3 subprocess delegation requires explicit opt-in via control plane:
 *   { "writeTimePipeline": { "delegateEnabled": true } }
 */

const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const { appendGovernanceEvent } = require('../lib/governance-log');
const { loadControlPlane, getRepoRoot } = require('../lib/fulcrum-control');

const TIERS = Object.freeze({
  FORMAT: 'format',
  LINT: 'lint',
  FIX: 'fix',
  VERIFY: 'verify',
});

const FIX_COMPLEXITY = Object.freeze({
  AUTO: 'auto',
  SIMPLE: 'simple',
  MODERATE: 'moderate',
  COMPLEX: 'complex',
});

/**
 * Source: plankton multi_linter.sh — model tier routing.
 * Haiku for simple lint codes, Sonnet for moderate, Opus for complex/high-volume.
 */
const MODEL_TIERS = Object.freeze({
  HAIKU: {
    model: 'haiku',
    maxTurns: 10,
    timeout: 120000,
    tools: ['Edit', 'Read'],
  },
  SONNET: {
    model: 'sonnet',
    maxTurns: 10,
    timeout: 300000,
    tools: ['Edit', 'Read'],
  },
  OPUS: {
    model: 'opus',
    maxTurns: 15,
    timeout: 600000,
    tools: ['Edit', 'Read', 'Write'],
  },
});

/** Source: plankton — code patterns that trigger sonnet-level fixes */
const SONNET_CODE_PATTERNS = /C901|PLR\d+|PYD\d+|FAST\d+|ASYNC\d+|unresolved-import|MD\d+|D\d+/;

/** Source: plankton — code patterns that trigger opus-level fixes */
const OPUS_CODE_PATTERNS = /unresolved-attribute|type-assertion/;

/** Source: plankton — volume threshold triggers opus automatically */
const VOLUME_THRESHOLD = 5;
const CLAUDE_CLI_CANDIDATES = Object.freeze(
  process.platform === 'win32'
    ? ['claude.exe', 'claude.cmd', 'claude']
    : ['claude']
);
const MAX_STDIN = 1024 * 1024;

const DEFAULT_TIER_CONFIG = {
  format: {
    timeout: 10000,
    failOpen: true,
    tools: {
      js: ['prettier', 'biome format'],
      ts: ['prettier', 'biome format'],
      py: ['ruff format'],
      sh: ['shfmt'],
      yaml: ['prettier --write', 'yamlfmt'],
      yml: ['prettier --write', 'yamlfmt'],
      json: ['prettier --write'],
      toml: ['taplo format'],
      md: ['prettier --write'],
      markdown: ['prettier --write'],
      dockerfile: ['prettier --write'],
      css: ['prettier --write'],
      html: ['prettier --write'],
    },
  },
  lint: {
    timeout: 30000,
    failOpen: true,
    tools: {
      js: ['biome check', 'eslint'],
      ts: ['biome check', 'eslint'],
      py: ['ruff check'],
      sh: ['shellcheck'],
      yaml: ['yamllint'],
      yml: ['yamllint'],
      json: ['jsonlint'],
      toml: ['taplo lint'],
      md: ['markdownlint-cli2'],
      markdown: ['markdownlint-cli2'],
      dockerfile: ['hadolint'],
      css: ['stylelint'],
      html: ['htmlhint'],
    },
  },
  fix: {
    timeout: 60000,
    failOpen: true,
    complexityRouting: {
      auto: { patterns: ['F[0-9]+', 'W[0-9]+', 'E[0-9]+'], maxTurns: 5, timeout: 30000 },
      simple: { patterns: ['RUF[0-9]+', 'I[0-9]+'], maxTurns: 10, timeout: 60000 },
      moderate: { patterns: ['C901', 'PLR[0-9]+', 'D[0-9]+'], maxTurns: 10, timeout: 120000 },
      complex: { patterns: ['unresolved-attribute', 'type-assertion'], maxTurns: 15, timeout: 300000 },
    },
  },
  verify: {
    timeout: 30000,
    failOpen: false,
  },
};

function detectFileLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath).toLowerCase();
  const langMap = {
    '.js': 'js', '.jsx': 'js', '.mjs': 'js', '.cjs': 'js',
    '.ts': 'ts', '.tsx': 'ts', '.mts': 'ts', '.cts': 'ts',
    '.py': 'py', '.pyi': 'py',
    '.sh': 'sh', '.bash': 'sh',
    '.go': 'go',
    '.rs': 'rs',
    '.kt': 'kt', '.kts': 'kt',
    '.java': 'java',
    '.yml': 'yaml', '.yaml': 'yaml',
    '.json': 'json',
    '.toml': 'toml',
    '.md': 'md', '.markdown': 'markdown',
    '.css': 'css',
    '.html': 'html', '.htm': 'html',
  };

  if (baseName === 'dockerfile' || baseName === 'containerfile' || baseName.endsWith('.dockerfile')) {
    return 'dockerfile';
  }

  return langMap[ext] || null;
}

function findAvailableTool(toolCandidates) {
  for (const tool of toolCandidates) {
    const command = tool.split(' ')[0];
    const result = spawnSync(
      process.platform === 'win32' ? 'where' : 'which',
      [command],
      { encoding: 'utf8', timeout: 5000 }
    );
    if (result.status === 0) {
      return tool;
    }
  }
  return null;
}

function classifyViolationComplexity(violationCode) {
  const routing = DEFAULT_TIER_CONFIG.fix.complexityRouting;

  for (const [complexity, config] of Object.entries(routing)) {
    for (const pattern of config.patterns) {
      if (new RegExp(pattern).test(violationCode)) {
        return complexity;
      }
    }
  }

  return FIX_COMPLEXITY.SIMPLE;
}

function runTool(tool, filePath, options = {}) {
  const timeout = options.timeout || 30000;
  const args = tool.split(' ').slice(1);
  const command = tool.split(' ')[0];

  try {
    const result = spawnSync(command, [...args, filePath], {
      encoding: 'utf8',
      timeout,
      cwd: options.cwd || process.cwd(),
    });

    return {
      tool,
      exitCode: result.status,
      stdout: (result.stdout || '').slice(0, 10000),
      stderr: (result.stderr || '').slice(0, 5000),
      success: result.status === 0,
      timedOut: result.error?.code === 'ETIMEDOUT',
    };
  } catch (err) {
    return {
      tool,
      exitCode: -1,
      stdout: '',
      stderr: err.message,
      success: false,
      timedOut: false,
    };
  }
}

function parseViolations(lintOutput) {
  const violations = [];
  const seen = new Set();

  function pushViolation(rawViolation) {
    if (!rawViolation || !rawViolation.file || !rawViolation.code) {
      return;
    }

    const line = Number.isFinite(Number(rawViolation.line)) ? Number(rawViolation.line) : null;
    const column = Number.isFinite(Number(rawViolation.column)) ? Number(rawViolation.column) : null;
    const message = String(rawViolation.message || '').trim();
    const key = [rawViolation.file, line || '', column || '', rawViolation.code, message].join('::');
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    violations.push({
      file: String(rawViolation.file),
      line,
      column,
      code: String(rawViolation.code),
      message,
      complexity: classifyViolationComplexity(String(rawViolation.code)),
    });
  }

  function extractFromStructuredValue(value, inherited = {}) {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        extractFromStructuredValue(item, inherited);
      }
      return;
    }

    if (typeof value !== 'object') {
      return;
    }

    const file = value.file || value.path || value.filename || value.source || value.filePath || inherited.file;

    if (Array.isArray(value.violations)) {
      for (const violation of value.violations) {
        extractFromStructuredValue(violation, inherited);
      }
    }

    if (Array.isArray(value.results)) {
      for (const result of value.results) {
        extractFromStructuredValue(result, inherited);
      }
    }

    if (Array.isArray(value.diagnostics)) {
      for (const diagnostic of value.diagnostics) {
        extractFromStructuredValue(diagnostic, {
          ...inherited,
          file: inherited.file || file,
        });
      }
    }

    if (Array.isArray(value.messages)) {
      for (const message of value.messages) {
        extractFromStructuredValue(
          { ...message, file: value.file || value.path || value.filename || message.file },
          { ...inherited, file: inherited.file || file }
        );
      }
    }

    const code = value.code || value.ruleId || value.rule || value.id || value.severity;
    const message = value.message || value.description || value.msg || value.text || value.reason;
    const line = value.line || value.row || value.lineno || (value.location && value.location.line) || (value.loc && value.loc.line);
    const column = value.column || value.col || value.colno || (value.location && value.location.column) || (value.loc && value.loc.column);

    if (file && code) {
      pushViolation({
        file,
        code,
        message: message || '',
        line,
        column,
      });
    }
  }

  try {
    const trimmed = String(lintOutput || '').trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      extractFromStructuredValue(JSON.parse(trimmed));
    }
  } catch {
    // Fall back to line-based parsing below.
  }

  const lines = String(lintOutput || '').split('\n').filter(Boolean);

  for (const line of lines) {
    const match = line.match(/^(.+):(\d+):(\d+):\s*(\w+)\s*(.*)$/);
    if (match) {
      pushViolation({
        file: match[1],
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10),
        code: match[4],
        message: match[5],
      });
    }
  }

  return violations;
}

/**
 * Source: plankton multi_linter.sh — select model tier based on violation codes.
 * Checks for opus-level codes first, then sonnet, then defaults to haiku.
 * Volume threshold (>5 violations) auto-escalates to opus.
 */
function selectModelTier(violations) {
  const codes = violations.map(v => v.code);
  const hasOpusCodes = codes.some(c => OPUS_CODE_PATTERNS.test(c));
  const hasSonnetCodes = codes.some(c => SONNET_CODE_PATTERNS.test(c));

  if (hasOpusCodes || violations.length > VOLUME_THRESHOLD) {
    return MODEL_TIERS.OPUS;
  }
  if (hasSonnetCodes) {
    return MODEL_TIERS.SONNET;
  }
  return MODEL_TIERS.HAIKU;
}

/**
 * Source: plankton — cksum for before/after hash comparison.
 * Uses crypto hash instead of cksum for cross-platform compatibility.
 */
function hashFile(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch {
    return null;
  }
}

function resolveClaudeCommand(options = {}) {
  if (options.claudeCommand) {
    return options.claudeCommand;
  }

  const commandFinder = options.commandFinder || findAvailableTool;
  return commandFinder(CLAUDE_CLI_CANDIDATES);
}

/**
 * Source: plankton multi_linter.sh Phase 3 — subprocess delegation.
 * Spawns `claude -p` with violation context, model routing, and tool permissions.
 *
 * Security: Requires explicit opt-in via control plane. Uses --settings to
 * disable hooks in subprocess (prevents infinite recursion). Disallows
 * dangerous tools per tier.
 */
function delegateFixToSubprocess(filePath, violations, tier, options = {}) {
  const repoRoot = options.repoRoot || process.cwd();
  const spawnSyncImpl = options.spawnSyncImpl || spawnSync;
  const claudeCmd = resolveClaudeCommand({
    claudeCommand: options.claudeCommand,
    commandFinder: options.commandFinder,
  });
  if (!claudeCmd) {
    return { delegated: false, reason: 'claude CLI not found', failOpen: true };
  }

  // Source: plankton — build violation JSON for prompt
  const violationsJson = JSON.stringify(
    violations.map(v => ({ line: v.line, column: v.column, code: v.code, message: v.message }))
  );

  const prompt = [
    `Fix these lint violations in ${path.basename(filePath)}:`,
    violationsJson,
    'Fix each violation. Do not add unrelated changes.',
    'Do not remove existing functionality.',
  ].join('\n');

  // Source: plankton — hash before subprocess
  const hashBefore = hashFile(filePath);

  // Build subprocess settings path (disables hooks to prevent recursion)
  const settingsPath = path.join(repoRoot, '.claude', 'subprocess-settings.json');

  // Source: plankton — build command args
  const args = ['-p', prompt, '--max-turns', String(tier.maxTurns), '--model', tier.model];

  // Add settings file if it exists (disableAllHooks: true)
  if (fs.existsSync(settingsPath)) {
    args.push('--settings', settingsPath);
  }

  // Source: plankton — disallowed tools based on tier
  const allTools = ['Bash', 'Edit', 'Read', 'Write', 'MultiEdit'];
  const disallowed = allTools.filter(t => !tier.tools.includes(t));
  if (disallowed.length > 0) {
    args.push('--disallowedTools', disallowed.join(','));
  }

  args.push(filePath);

  try {
    const result = spawnSyncImpl(claudeCmd, args, {
      encoding: 'utf8',
      timeout: tier.timeout,
      cwd: repoRoot,
      env: { ...process.env, CLAUDECODE: undefined }, // Source: plankton — env -u CLAUDECODE
    });

    const hashAfter = hashFile(filePath);
    const fileModified = hashBefore !== hashAfter;

    return {
      delegated: true,
      model: tier.model,
      maxTurns: tier.maxTurns,
      exitCode: result.status,
      fileModified,
      hashBefore,
      hashAfter,
      timedOut: result.error?.code === 'ETIMEDOUT',
      failOpen: result.status !== 0,
    };
  } catch (err) {
    return {
      delegated: true,
      model: tier.model,
      exitCode: -1,
      fileModified: false,
      error: err.message,
      failOpen: true,
    };
  }
}

function shouldFailOpenForDelegation(delegateResult, options = {}) {
  if (!delegateResult) {
    return true;
  }

  if (delegateResult.failOpen) {
    return true;
  }

  if (options.delegateEnabled && delegateResult.delegated === false) {
    return true;
  }

  return false;
}

async function runWriteTimePipeline(filePath, options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();
  const controlPlane = loadControlPlane(repoRoot);
  const tierConfig = controlPlane.writeTimePipeline || DEFAULT_TIER_CONFIG;
  const delegateEnabled = controlPlane.writeTimePipeline?.delegateEnabled === true;
  const lang = detectFileLanguage(filePath);

  if (!lang) {
    return { skipped: true, reason: `Unsupported file type: ${path.extname(filePath)}` };
  }

  const pipelineResult = {
    filePath,
    language: lang,
    steps: [],
    violations: [],
    success: true,
    failOpen: false,
    startedAt: new Date().toISOString(),
  };

  // Step 1: Auto-format (Phase 1 from plankton)
  const formatTools = (tierConfig.format?.tools || DEFAULT_TIER_CONFIG.format.tools)[lang] || [];
  const formatTool = findAvailableTool(formatTools);

  if (formatTool) {
    const formatResult = runTool(formatTool, filePath, {
      timeout: tierConfig.format?.timeout || 10000,
      cwd: repoRoot,
    });
    pipelineResult.steps.push({ tier: TIERS.FORMAT, ...formatResult });
  }

  // Step 2: Collect violations (Phase 2 from plankton)
  const lintTools = (tierConfig.lint?.tools || DEFAULT_TIER_CONFIG.lint.tools)[lang] || [];
  const lintTool = findAvailableTool(lintTools);

  if (lintTool) {
    const lintResult = runTool(lintTool, filePath, {
      timeout: tierConfig.lint?.timeout || 30000,
      cwd: repoRoot,
    });
    pipelineResult.steps.push({ tier: TIERS.LINT, ...lintResult });

    if (!lintResult.success) {
      const violations = parseViolations(lintResult.stdout + '\n' + lintResult.stderr);
      pipelineResult.violations = violations;
    }
  }

  // Step 3: Delegate fixes via subprocess (Phase 3 from plankton)
  if (pipelineResult.violations.length > 0) {
    const grouped = {};
    for (const v of pipelineResult.violations) {
      const c = v.complexity;
      if (!grouped[c]) grouped[c] = [];
      grouped[c].push(v);
    }

    pipelineResult.fixRouting = Object.entries(grouped).map(([complexity, violations]) => ({
      complexity,
      count: violations.length,
      codes: [...new Set(violations.map(v => v.code))],
    }));

    // Source: plankton Phase 3 — delegate to subprocess if enabled
    if (delegateEnabled || options.delegateEnabled) {
      const tier = selectModelTier(pipelineResult.violations);
      const delegateResult = delegateFixToSubprocess(filePath, pipelineResult.violations, tier, {
        repoRoot,
        spawnSyncImpl: options.spawnSyncImpl,
        commandFinder: options.commandFinder,
        claudeCommand: options.claudeCommand,
      });
      pipelineResult.steps.push({ tier: TIERS.FIX, ...delegateResult });
      pipelineResult.delegation = delegateResult;
      pipelineResult.failOpen = shouldFailOpenForDelegation(delegateResult, { delegateEnabled: true });
      if (delegateResult.delegated === false && delegateResult.failOpen) {
        pipelineResult.delegation = {
          ...delegateResult,
          delegated: false,
          failOpen: true,
        };
      }
    }
  }

  // Step 4: Re-verify (Phase 3 verify from plankton — re-lint after fixes)
  if (formatTool || lintTool) {
    const verifyTool = lintTool || formatTool;
    const verifyResult = runTool(verifyTool, filePath, {
      timeout: tierConfig.verify?.timeout || 30000,
      cwd: repoRoot,
    });
    pipelineResult.steps.push({ tier: TIERS.VERIFY, ...verifyResult });

    // Source: plankton — re-parse remaining violations after fix
    if (!verifyResult.success) {
      const remaining = parseViolations(verifyResult.stdout + '\n' + verifyResult.stderr);
      pipelineResult.remainingViolations = remaining;
      pipelineResult.success = remaining.length === 0;
    } else {
      pipelineResult.remainingViolations = [];
      pipelineResult.success = true;
    }
  }

  pipelineResult.completedAt = new Date().toISOString();

  // Emit governance event
  try {
    await appendGovernanceEvent({
      eventType: 'write_time_enforcement',
      decision: pipelineResult.success ? 'pass' : 'violations_found',
      reason: pipelineResult.success
        ? 'All checks passed'
        : `${(pipelineResult.remainingViolations || pipelineResult.violations).length} violation(s) remain`,
      artifactRef: { type: 'write_time_pipeline', filePath },
      payload: {
        language: lang,
        violationCount: pipelineResult.violations.length,
        remainingCount: (pipelineResult.remainingViolations || []).length,
        delegated: !!pipelineResult.delegation,
        delegationModel: pipelineResult.delegation?.model || null,
        steps: pipelineResult.steps.length,
        success: pipelineResult.success,
      },
    }, { repoRoot });
  } catch {
    // Fail open: pipeline continues even if governance logging fails
  }

  return pipelineResult;
}

function extractFilePathFromHookInput(input) {
  return input?.tool_input?.file_path
    || input?.tool_input?.path
    || input?.tool_input?.target_file
    || input?.file_path
    || null;
}

async function run(rawInput) {
  try {
    const input = JSON.parse(rawInput || '{}');
    const filePath = extractFilePathFromHookInput(input);
    if (!filePath) {
      return rawInput;
    }

    await runWriteTimePipeline(filePath, {
      repoRoot: process.cwd(),
    });
  } catch {
    // Fail open for hook execution.
  }

  return rawInput;
}

if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    if (raw.length < MAX_STDIN) {
      raw += chunk.slice(0, MAX_STDIN - raw.length);
    }
  });
  process.stdin.on('end', () => {
    run(raw)
      .then(output => {
        process.stdout.write(output);
        process.exit(0);
      })
      .catch(() => {
        process.stdout.write(raw);
        process.exit(0);
      });
  });
}

module.exports = {
  TIERS,
  FIX_COMPLEXITY,
  MODEL_TIERS,
  SONNET_CODE_PATTERNS,
  OPUS_CODE_PATTERNS,
  VOLUME_THRESHOLD,
  DEFAULT_TIER_CONFIG,
  CLAUDE_CLI_CANDIDATES,
  detectFileLanguage,
  findAvailableTool,
  classifyViolationComplexity,
  selectModelTier,
  hashFile,
  resolveClaudeCommand,
  delegateFixToSubprocess,
  shouldFailOpenForDelegation,
  parseViolations,
  runWriteTimePipeline,
  extractFilePathFromHookInput,
  run,
};
