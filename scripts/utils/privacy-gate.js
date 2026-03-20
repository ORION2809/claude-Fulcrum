'use strict';

const { stripTaggedContent } = require('./tag-stripping');

const SECRET_PATTERNS = [
  /\bsk-[a-zA-Z0-9_-]{10,}\b/g,
  /\bghp_[a-zA-Z0-9]{20,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\bBearer\s+[A-Za-z0-9._-]{12,}\b/g,
];

function normalizeInput(input) {
  if (typeof input === 'string') {
    return input;
  }

  if (input === null || input === undefined) {
    return '';
  }

  try {
    return JSON.stringify(input, null, 2);
  } catch {
    return String(input);
  }
}

function sanitizeForMemory(input, options = {}) {
  const raw = normalizeInput(input);
  const stripped = stripTaggedContent(raw, options);

  let sanitized = stripped.content;
  const redactionReasons = [...stripped.removedTags];

  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, match => {
      redactionReasons.push('secret');
      return `[redacted:${match.slice(0, 4)}]`;
    });
  }

  sanitized = sanitized
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    content: sanitized,
    isEmpty: sanitized.length === 0,
    skipStorage: sanitized.length === 0,
    strippedTagCount: stripped.strippedTagCount,
    redactionReasons,
  };
}

module.exports = {
  sanitizeForMemory,
};
