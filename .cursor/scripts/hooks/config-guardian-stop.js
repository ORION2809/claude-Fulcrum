#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { appendGovernanceEvent } = require('../lib/governance-log');
const { getGitModifiedFiles } = require('../lib/utils');
const { hashValue, loadControlPlane } = require('../lib/fulcrum-control');

async function main() {
  const controlPlane = loadControlPlane();
  const protectedPaths = controlPlane.protectedPaths || [];
  const changedFiles = getGitModifiedFiles();

  for (const filePath of changedFiles) {
    const normalized = filePath.replace(/\\/g, '/');
    const protectedMatch = protectedPaths.find(pattern => normalized.includes(pattern.replace(/\*/g, '')));
    if (!protectedMatch) {
      continue;
    }

    const absolutePath = path.join(process.cwd(), filePath);
    const contentHash = fs.existsSync(absolutePath) ? hashValue(fs.readFileSync(absolutePath, 'utf8')) : null;
    await appendGovernanceEvent({
      sessionId: process.env.CLAUDE_SESSION_ID || null,
      attemptId: process.env.ECC_ATTEMPT_ID || null,
      eventType: 'protected-config-diff-detected',
      decision: 'review-required',
      reason: `protected file changed at stop hook: ${filePath}`,
      artifactRef: {
        filePath,
        contentHash,
      },
    });
  }
}

if (require.main === module) {
  main().catch(error => {
    process.stderr.write(`[config-guardian-stop] ${error.message}\n`);
    process.exit(0);
  });
}
