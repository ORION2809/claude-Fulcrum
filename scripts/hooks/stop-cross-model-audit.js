#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  ensureControlPlaneDirs,
  getGovernanceDir,
  getRepoRoot,
  loadControlPlane,
} = require('../lib/fulcrum-control');
const { runCrossModelAudit } = require('../quality/cross-model-auditor');

const MAX_STDIN = 1024 * 1024;

function parseRawInput(rawInput) {
  try {
    return JSON.parse(rawInput || '{}');
  } catch {
    return {};
  }
}

function parseTranscriptLines(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    return [];
  }

  return fs.readFileSync(transcriptPath, 'utf8')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function summarizeTranscript(transcriptPath, options = {}) {
  const lines = parseTranscriptLines(transcriptPath);
  const keepMessages = Number.isFinite(options.keepMessages) ? options.keepMessages : 4;
  const userMessages = lines.filter(item => item.type === 'user');
  const assistantMessages = lines.filter(item => item.type === 'assistant');
  const recent = lines
    .slice(-keepMessages)
    .map(item => `${item.type}: ${String(item.content || item.message || '').replace(/\s+/g, ' ').trim()}`)
    .filter(Boolean);

  return {
    exists: lines.length > 0,
    userCount: userMessages.length,
    assistantCount: assistantMessages.length,
    snippet: recent.join('\n').slice(0, 1800),
  };
}

function parseGitStatus(output) {
  return String(output || '')
    .split(/\r?\n/)
    .map(line => line.trimEnd())
    .filter(Boolean)
    .map(line => {
      const status = line.slice(0, 2).trim() || 'M';
      const filePath = line.slice(3).trim();
      return {
        status,
        path: filePath.includes(' -> ') ? filePath.split(' -> ').pop() : filePath,
      };
    })
    .filter(entry => entry.path);
}

function getLineDelta(repoRoot, filePath) {
  const result = spawnSync('git', ['diff', '--numstat', '--', filePath], {
    cwd: repoRoot,
    encoding: 'utf8',
    timeout: 5000,
  });

  if (result.status !== 0) {
    return 0;
  }

  const match = String(result.stdout || '').match(/(\d+|-)\s+(\d+|-)\s+/);
  if (!match) {
    return 0;
  }

  const added = match[1] === '-' ? 0 : Number(match[1]);
  const removed = match[2] === '-' ? 0 : Number(match[2]);
  return added + removed;
}

function collectChangedFiles(repoRoot, options = {}) {
  const limit = Number.isFinite(options.limit) ? options.limit : 6;
  const statusResult = spawnSync('git', ['status', '--porcelain=v1'], {
    cwd: repoRoot,
    encoding: 'utf8',
    timeout: 5000,
  });

  if (statusResult.status !== 0) {
    return [];
  }

  const changedFiles = [];
  for (const entry of parseGitStatus(statusResult.stdout)) {
    if (changedFiles.length >= limit) {
      break;
    }

    const absolutePath = path.join(repoRoot, entry.path);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      continue;
    }

    const content = fs.readFileSync(absolutePath, 'utf8');
    changedFiles.push({
      path: entry.path,
      action: entry.status,
      linesChanged: Math.max(getLineDelta(repoRoot, entry.path), 1),
      content: content.slice(0, 2000),
    });
  }

  return changedFiles;
}

function buildAuditChanges(input, options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();
  const transcriptSummary = summarizeTranscript(
    input.transcript_path || input.transcriptPath || process.env.CLAUDE_TRANSCRIPT_PATH || null
  );
  const files = collectChangedFiles(repoRoot, {
    ...options,
    limit: options.maxChangedFiles,
  });

  if (transcriptSummary.exists) {
    files.push({
      path: '[session-transcript]',
      action: 'audit',
      linesChanged: transcriptSummary.userCount + transcriptSummary.assistantCount,
      content: [
        `User messages: ${transcriptSummary.userCount}`,
        `Assistant messages: ${transcriptSummary.assistantCount}`,
        transcriptSummary.snippet,
      ].filter(Boolean).join('\n'),
    });
  }

  return {
    files,
    transcriptSummary,
  };
}

function shouldSkipAudit(changes, options = {}) {
  const minUserMessages = Number.isFinite(options.minUserMessages) ? options.minUserMessages : 1;
  return changes.files.length === 0 || changes.transcriptSummary.userCount < minUserMessages;
}

function writeAuditArtifact(result, options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();
  ensureControlPlaneDirs(repoRoot);
  const auditDir = path.join(getGovernanceDir(repoRoot), 'stop-audits');
  fs.mkdirSync(auditDir, { recursive: true });
  const artifactPath = path.join(auditDir, `${result.requestId || `stop-audit-${Date.now()}`}.json`);
  fs.writeFileSync(artifactPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  return artifactPath;
}

async function executeStopAudit(rawInput, options = {}) {
  const input = parseRawInput(rawInput);
  const repoRoot = options.repoRoot || getRepoRoot();
  const controlPlane = loadControlPlane(repoRoot);
  const stopBoundary = controlPlane.crossModelAudit?.stopBoundary || {};
  const sessionId = input.session_id || input.sessionId || process.env.CLAUDE_SESSION_ID || null;
  const attemptId = input.attempt_id || input.attemptId || process.env.ECC_ATTEMPT_ID || null;
  const changes = buildAuditChanges(input, {
    ...options,
    repoRoot,
    maxChangedFiles: Number(stopBoundary.maxChangedFiles || options.maxChangedFiles || 6),
  });

  if (shouldSkipAudit(changes, {
    ...options,
    minUserMessages: Number(stopBoundary.minUserMessages || options.minUserMessages || 3),
  })) {
    return {
      skipped: true,
      reason: 'Not enough stop-boundary evidence to audit',
      transcriptSummary: changes.transcriptSummary,
    };
  }

  const result = await runCrossModelAudit({
    files: changes.files,
    testSummary: null,
    qualityScore: null,
  }, [], {
    boundary: 'stop',
    sessionId,
    attemptId,
    repoRoot,
    reviewerModel: process.env.FULCRUM_STOP_AUDITOR_MODEL || 'self',
  });

  return {
    ...result,
    transcriptSummary: changes.transcriptSummary,
  };
}

async function run(rawInput, options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();

  try {
    const result = await executeStopAudit(rawInput, { ...options, repoRoot });
    if (!result.skipped) {
      const artifactPath = writeAuditArtifact(result, { repoRoot });
      const prefix = result.decision === 'block' ? 'BLOCKED' : result.decision;
      process.stderr.write(
        `[stop-cross-model-audit] ${prefix}: ${result.reason} (${artifactPath})\n`
      );
    }
  } catch (error) {
    process.stderr.write(`[stop-cross-model-audit] ${error.message}\n`);
  }

  return rawInput;
}

if (require.main === module) {
  let rawInput = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    if (rawInput.length < MAX_STDIN) {
      rawInput += chunk.slice(0, MAX_STDIN - rawInput.length);
    }
  });
  process.stdin.on('end', () => {
    run(rawInput)
      .then(() => process.stdout.write(rawInput))
      .catch(error => {
        process.stderr.write(`[stop-cross-model-audit] ${error.message}\n`);
        process.stdout.write(rawInput);
        process.exit(0);
      });
  });
}

module.exports = {
  buildAuditChanges,
  collectChangedFiles,
  executeStopAudit,
  parseGitStatus,
  parseRawInput,
  parseTranscriptLines,
  shouldSkipAudit,
  summarizeTranscript,
  writeAuditArtifact,
  run,
};
