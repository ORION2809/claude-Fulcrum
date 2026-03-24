'use strict';

const fs = require('fs');
const path = require('path');

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeValues(baseValue, overrideValue) {
  if (Array.isArray(baseValue) && Array.isArray(overrideValue)) {
    return [...new Set([...baseValue, ...overrideValue])];
  }

  if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
    const merged = { ...baseValue };
    for (const [key, value] of Object.entries(overrideValue)) {
      merged[key] = key in merged ? mergeValues(merged[key], value) : value;
    }
    return merged;
  }

  return overrideValue;
}

function normalizeIncludeList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function resolveJsonIncludes(filePath, seen = new Set()) {
  const absolutePath = path.resolve(filePath);
  if (seen.has(absolutePath)) {
    throw new Error(`Circular @include detected: ${absolutePath}`);
  }
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Included config not found: ${absolutePath}`);
  }

  const nextSeen = new Set(seen);
  nextSeen.add(absolutePath);

  const raw = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  const includes = normalizeIncludeList(raw['@include']);
  const current = { ...raw };
  delete current['@include'];

  const inherited = includes.reduce((accumulator, includeRef) => {
    const includePath = path.resolve(path.dirname(absolutePath), includeRef);
    const included = resolveJsonIncludes(includePath, nextSeen);
    return mergeValues(accumulator, included);
  }, {});

  return mergeValues(inherited, current);
}

module.exports = {
  mergeValues,
  resolveJsonIncludes,
};
