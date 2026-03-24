#!/usr/bin/env node
/**
 * Quality Gate Hook
 *
 * Runs lightweight quality checks after file edits.
 * - Targets one file when file_path is provided
 * - Falls back to no-op when language/tooling is unavailable
 *
 * For JS/TS files with Biome, this hook is skipped because
 * post-edit-format.js already runs `biome check --write`.
 * This hook still handles .json/.md files for Biome, and all
 * Prettier / Go / Python checks.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const { findProjectRoot, detectFormatter, resolveFormatterBin } = require('../lib/resolve-formatter');
const { evaluateRuntimeQuality } = require('../quality/runtime-evaluator');
const { writeQualityTelemetry } = require('../quality/telemetry-writer');

const MAX_STDIN = 1024 * 1024;

/**
 * Execute a command synchronously, returning the spawnSync result.
 *
 * @param {string} command - Executable path or name
 * @param {string[]} args - Arguments to pass
 * @param {string} [cwd] - Working directory (defaults to process.cwd())
 * @returns {import('child_process').SpawnSyncReturns<string>}
 */
function exec(command, args, cwd = process.cwd()) {
  return spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: process.env,
    timeout: 15000
  });
}

/**
 * Write a message to stderr for logging.
 *
 * @param {string} msg - Message to log
 */
function log(msg) {
  process.stderr.write(`${msg}\n`);
}

/**
 * Run quality-gate checks for a single file based on its extension.
 * Skips JS/TS files when Biome is configured (handled by post-edit-format).
 *
 * @param {string} filePath - Path to the edited file
 */
function maybeRunQualityGate(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return;
  }

  // Resolve to absolute path so projectRoot-relative comparisons work
  filePath = path.resolve(filePath);

  const ext = path.extname(filePath).toLowerCase();
  const fix = String(process.env.ECC_QUALITY_GATE_FIX || '').toLowerCase() === 'true';
  const strict = String(process.env.ECC_QUALITY_GATE_STRICT || '').toLowerCase() === 'true';

  if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md'].includes(ext)) {
    const projectRoot = findProjectRoot(path.dirname(filePath));
    const formatter = detectFormatter(projectRoot);

    if (formatter === 'biome') {
      // JS/TS already handled by post-edit-format via `biome check --write`
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        return;
      }

      // .json / .md — still need quality gate
      const resolved = resolveFormatterBin(projectRoot, 'biome');
      if (!resolved) return;
      const args = [...resolved.prefix, 'check', filePath];
      if (fix) args.push('--write');
      const result = exec(resolved.bin, args, projectRoot);
      if (result.status !== 0 && strict) {
        log(`[QualityGate] Biome check failed for ${filePath}`);
      }
      return;
    }

    if (formatter === 'prettier') {
      const resolved = resolveFormatterBin(projectRoot, 'prettier');
      if (!resolved) return;
      const args = [...resolved.prefix, fix ? '--write' : '--check', filePath];
      const result = exec(resolved.bin, args, projectRoot);
      if (result.status !== 0 && strict) {
        log(`[QualityGate] Prettier check failed for ${filePath}`);
      }
      return;
    }

    // No formatter configured — skip
    return;
  }

  if (ext === '.go') {
    if (fix) {
      const r = exec('gofmt', ['-w', filePath]);
      if (r.status !== 0 && strict) {
        log(`[QualityGate] gofmt failed for ${filePath}`);
      }
    } else if (strict) {
      const r = exec('gofmt', ['-l', filePath]);
      if (r.status !== 0) {
        log(`[QualityGate] gofmt failed for ${filePath}`);
      } else if (r.stdout && r.stdout.trim()) {
        log(`[QualityGate] gofmt check failed for ${filePath}`);
      }
    }
    return;
  }

  if (ext === '.py') {
    const args = ['format'];
    if (!fix) args.push('--check');
    args.push(filePath);
    const r = exec('ruff', args);
    if (r.status !== 0 && strict) {
      log(`[QualityGate] Ruff check failed for ${filePath}`);
    }
  }
}

function extractFilePath(input) {
  return String(
    input?.tool_input?.file_path
    || input?.toolInput?.file_path
    || input?.tool_input?.path
    || input?.toolInput?.path
    || ''
  );
}

function readFileIfPresent(filePath) {
  if (!filePath) {
    return '';
  }

  try {
    if (!fs.existsSync(filePath)) {
      return '';
    }
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

/**
 * Core logic — exported so run-with-flags.js can call directly.
 *
 * @param {string} rawInput - Raw JSON string from stdin
 * @returns {Promise<string>} The original input (pass-through)
 */
async function run(rawInput) {
  try {
    const input = JSON.parse(rawInput);
    const filePath = extractFilePath(input);
    const beforeContent = readFileIfPresent(filePath);
    maybeRunQualityGate(filePath);
    const afterContent = readFileIfPresent(filePath);
    const repoRoot = filePath ? findProjectRoot(path.dirname(path.resolve(filePath))) : process.cwd();
    const quality = await evaluateRuntimeQuality({
      filePath,
      beforeContent,
      afterContent,
      rawInput,
      sessionId: input.session_id || input.sessionId || null,
      attemptId: input.attempt_id || input.attemptId || null,
      repoRoot,
    });
    const latestIteration = quality.loop?.iterations?.slice(-1)[0] || null;
    writeQualityTelemetry({
      timestamp: new Date().toISOString(),
      filePath,
      score: latestIteration?.score ?? null,
      band: latestIteration?.band ?? null,
      passed: latestIteration?.passed ?? false,
      hardCaps: latestIteration?.hardCaps ?? [],
      terminationReason: quality.loop?.terminationReason || 'ERROR',
      persona: quality.persona?.activePersona || null,
      personaSource: quality.persona?.source || null,
      validators: quality.validators?.summary || null,
      validatorNames: (quality.validators?.validators || []).map(item => item.validator),
      auditDecision: quality.audit?.decision || null,
      auditSummary: quality.audit?.summary || null,
      selfReviewVerdict: quality.selfReview?.verdict || null,
      checklistPassRate: quality.checklist?.passRate || null,
    }, repoRoot);

    // Enforce quality gate: block edits with critical findings or audit block decisions.
    // Exit code 2 signals Claude hooks to reject the tool use.
    const criticalCount = quality.validators?.summary?.critical || 0;
    const auditDecision = quality.audit?.decision || 'pass';
    const selfVerdict = quality.selfReview?.verdict || 'pass';

    if (criticalCount > 0 || auditDecision === 'block' || selfVerdict === 'block') {
      const reasons = [];
      if (criticalCount > 0) reasons.push(`${criticalCount} critical validator finding(s)`);
      if (auditDecision === 'block') reasons.push(`audit decision: block`);
      if (selfVerdict === 'block') reasons.push(`self-review: block`);
      log(`[QualityGate] BLOCKED: ${reasons.join(', ')}`);
      process.exit(2);
    }
  } catch (error) {
    try {
      writeQualityTelemetry({
        timestamp: new Date().toISOString(),
        filePath: null,
        score: null,
        band: null,
        passed: false,
        hardCaps: [],
        terminationReason: 'ERROR',
        auditDecision: 'error',
        selfReviewVerdict: 'error',
        error: error.message,
      });
    } catch {
      // Ignore telemetry failures in fail-open mode.
    }
  }
  return rawInput;
}

// ── stdin entry point (backwards-compatible) ────────────────────
if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    if (raw.length < MAX_STDIN) {
      const remaining = MAX_STDIN - raw.length;
      raw += chunk.substring(0, remaining);
    }
  });

  process.stdin.on('end', () => {
    Promise.resolve(run(raw)).then(result => {
      process.stdout.write(result);
    }).catch(() => {
      process.stdout.write(raw);
    });
  });
}

module.exports = { run, extractFilePath };
