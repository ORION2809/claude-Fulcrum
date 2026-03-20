'use strict';

function compressObservation(content, options = {}) {
  const text = String(content || '').trim();
  const maxLines = Number.isFinite(options.maxLines) ? options.maxLines : 8;
  const maxChars = Number.isFinite(options.maxChars) ? options.maxChars : 500;

  if (!text) {
    return '';
  }

  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const uniqueLines = [];
  const seen = new Set();

  for (const line of lines) {
    if (seen.has(line)) {
      continue;
    }
    seen.add(line);
    uniqueLines.push(line);
    if (uniqueLines.length >= maxLines) {
      break;
    }
  }

  return uniqueLines.join(' | ').slice(0, maxChars).trim();
}

module.exports = {
  compressObservation,
};
