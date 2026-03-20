#!/usr/bin/env node
'use strict';

const fs = require('fs');

const { appendGovernanceEvent } = require('../lib/governance-log');
const {
  ensureControlPlaneDirs,
  getRepoHookTrustPath,
  hashValue,
} = require('../lib/fulcrum-control');

function currentTrustSnapshot() {
  const files = [
    'hooks/hooks.json',
    'config/hook-control-plane.json',
  ].filter(filePath => fs.existsSync(filePath));

  return files.reduce((result, filePath) => ({
    ...result,
    [filePath]: hashValue(fs.readFileSync(filePath, 'utf8')),
  }), {});
}

async function main() {
  ensureControlPlaneDirs();
  const trustPath = getRepoHookTrustPath();
  const nextSnapshot = currentTrustSnapshot();
  const previousSnapshot = fs.existsSync(trustPath)
    ? JSON.parse(fs.readFileSync(trustPath, 'utf8'))
    : {};

  const changedFiles = Object.keys(nextSnapshot).filter(filePath => previousSnapshot[filePath] !== nextSnapshot[filePath]);
  if (changedFiles.length > 0) {
    await appendGovernanceEvent({
      sessionId: process.env.CLAUDE_SESSION_ID || null,
      attemptId: process.env.ECC_ATTEMPT_ID || null,
      eventType: 'repo-hook-trust-changed',
      decision: 'reapproval-required',
      reason: `tracked hook assets changed: ${changedFiles.join(', ')}`,
      artifactRef: {
        changedFiles,
      },
    });
  }

  fs.writeFileSync(trustPath, JSON.stringify(nextSnapshot, null, 2), 'utf8');
}

if (require.main === module) {
  main().catch(error => {
    process.stderr.write(`[repo-hook-trust] ${error.message}\n`);
    process.exit(0);
  });
}
