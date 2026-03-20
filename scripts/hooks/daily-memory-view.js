#!/usr/bin/env node
'use strict';

const { rebuildViews } = require('../memory/rebuild-views');

async function main() {
  await rebuildViews();
}

if (require.main === module) {
  main().catch(error => {
    process.stderr.write(`[daily-memory-view] ${error.message}\n`);
    process.exit(1);
  });
}
