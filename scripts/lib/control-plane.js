'use strict';

const crypto = require('crypto');
const path = require('path');

const { appendFile, ensureDir, getClaudeDir } = require('./utils');

function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(item => stableSerialize(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${stableSerialize(value[key])}`);
    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex');
}

function createId(prefix, payload = {}) {
  return `${prefix}-${sha256(`${prefix}:${stableSerialize(payload)}:${Date.now()}:${Math.random()}`).slice(0, 16)}`;
}

function estimateTokenCount(value) {
  if (!value) {
    return 0;
  }

  return Math.max(1, Math.ceil(String(value).length / 4));
}

function truncateText(value, maxLength = 1200) {
  const text = String(value || '');
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
}

function getGovernanceLogPath(options = {}) {
  const baseDir = options.baseDir || path.join(getClaudeDir(), 'ecc', 'governance');
  ensureDir(baseDir);
  return path.join(baseDir, 'events.jsonl');
}

function appendJsonl(filePath, record) {
  ensureDir(path.dirname(filePath));
  appendFile(filePath, `${JSON.stringify(record)}\n`);
}

module.exports = {
  appendJsonl,
  createId,
  estimateTokenCount,
  getGovernanceLogPath,
  sha256,
  stableSerialize,
  truncateText
};
