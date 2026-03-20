#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { appendGovernanceEvent } = require('../lib/governance-log');
const { loadControlPlane } = require('../lib/fulcrum-control');

const MAX_STDIN = 1024 * 1024;

function matchesPattern(filePath, pattern) {
  const normalizedPath = String(filePath || '').replace(/\\/g, '/');
  const normalizedPattern = String(pattern || '').replace(/\\/g, '/');
  if (normalizedPattern.endsWith('*')) {
    return normalizedPath.startsWith(normalizedPattern.slice(0, -1));
  }
  return normalizedPath === normalizedPattern || normalizedPath.endsWith(`/${normalizedPattern}`);
}

async function handleProtection(rawInput) {
  const input = JSON.parse(rawInput || '{}');
  const filePath = input.tool_input?.file_path || input.tool_input?.path || '';
  const repoRoot = process.cwd();
  const controlPlane = loadControlPlane(repoRoot);
  const protectedPaths = controlPlane.protectedPaths || [];
  const isProtected = protectedPaths.some(pattern => matchesPattern(filePath, pattern));

  if (!isProtected || process.env.ECC_ALLOW_PROTECTED_CONFIG_EDIT === 'true') {
    process.stdout.write(rawInput);
    return;
  }

  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);
  const exists = fs.existsSync(absolutePath);
  await appendGovernanceEvent({
    sessionId: input.session_id || process.env.CLAUDE_SESSION_ID || null,
    attemptId: input.attempt_id || process.env.ECC_ATTEMPT_ID || null,
    eventType: 'protected-config-edit-blocked',
    decision: 'blocked',
    reason: `protected config edit attempted for ${filePath}`,
    artifactRef: {
      filePath,
      exists,
    },
  });

  process.stderr.write(`[protect-configs] blocked protected config edit: ${filePath}\n`);
  process.exit(2);
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
    handleProtection(raw).catch(error => {
      process.stderr.write(`[protect-configs] ${error.message}\n`);
      process.stdout.write(raw);
      process.exit(0);
    });
  });
}

module.exports = {
  matchesPattern,
};
