#!/usr/bin/env node

const { spawnSync } = require('child_process');

function main() {
  const result = spawnSync('code-review-graph', ['update'], {
    stdio: 'ignore',
    windowsHide: true,
  });

  if (result.error && result.error.code !== 'ENOENT') {
    process.stderr.write(`[PostToolUse] code-review-graph update failed: ${result.error.message}\n`);
  }

  process.exit(0);
}

main();
