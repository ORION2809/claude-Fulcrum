'use strict';

const { stripTaggedContent } = require('./tag-stripping');

const SECRET_PATTERNS = [
  /\bsk-[a-zA-Z0-9_-]{10,}\b/g,
  /\bghp_[a-zA-Z0-9]{20,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\bBearer\s+[A-Za-z0-9._-]{12,}\b/g,
];

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function sanitizeText(input, options = {}) {
  const raw = String(input || '');
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
    redactionReasons,
    strippedTagCount: stripped.strippedTagCount,
  };
}

function sanitizeStructuredValue(input, options = {}, metadata = { redactionReasons: [], strippedTagCount: 0 }) {
  if (typeof input === 'string') {
    const sanitized = sanitizeText(input, options);
    metadata.redactionReasons.push(...sanitized.redactionReasons);
    metadata.strippedTagCount += sanitized.strippedTagCount;
    return sanitized.content;
  }

  if (Array.isArray(input)) {
    return input.map(value => sanitizeStructuredValue(value, options, metadata));
  }

  if (isPlainObject(input)) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => {
        return [key, sanitizeStructuredValue(value, options, metadata)];
      })
    );
  }

  return input;
}

function normalizeInput(input, options = {}) {
  if (typeof input === 'string') {
    return {
      content: input,
      redactionReasons: [],
      strippedTagCount: 0,
    };
  }

  if (input === null || input === undefined) {
    return {
      content: '',
      redactionReasons: [],
      strippedTagCount: 0,
    };
  }

  try {
    const metadata = {
      redactionReasons: [],
      strippedTagCount: 0,
    };
    const sanitized = sanitizeStructuredValue(input, options, metadata);
    return {
      content: JSON.stringify(sanitized, null, 2),
      redactionReasons: metadata.redactionReasons,
      strippedTagCount: metadata.strippedTagCount,
    };
  } catch {
    return {
      content: String(input),
      redactionReasons: [],
      strippedTagCount: 0,
    };
  }
}

function sanitizeForMemory(input, options = {}) {
  const normalized = normalizeInput(input, options);
  const sanitized = sanitizeText(normalized.content, options);
  const redactionReasons = [...normalized.redactionReasons, ...sanitized.redactionReasons];
  const strippedTagCount = normalized.strippedTagCount + sanitized.strippedTagCount;

  return {
    content: sanitized.content,
    isEmpty: sanitized.content.length === 0,
    skipStorage: sanitized.content.length === 0,
    strippedTagCount,
    redactionReasons,
  };
}

module.exports = {
  sanitizeForMemory,
};
