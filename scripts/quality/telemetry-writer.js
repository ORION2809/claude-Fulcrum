'use strict';

const fs = require('fs');
const path = require('path');

const { ensureDir } = require('../lib/utils');

function writeQualityTelemetry(entry, repoRoot = process.cwd()) {
  const dirPath = path.join(repoRoot, '.claude', 'ecc', 'quality');
  ensureDir(dirPath);
  const logPath = path.join(dirPath, 'quality-loop.jsonl');
  fs.appendFileSync(logPath, `${JSON.stringify(entry)}\n`, 'utf8');
  return logPath;
}

module.exports = {
  writeQualityTelemetry,
};
