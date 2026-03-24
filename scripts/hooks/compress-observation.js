'use strict';

const PRIORITY_PATTERNS = [
  /\b(error|failed|failure|exception|warning|blocked|timeout)\b/i,
  /\b(fixed|resolved|implemented|added|updated|removed|created|deleted)\b/i,
  /\b(memory|retrieval|search|session|hook|privacy|redacted|summary)\b/i,
];

const NOISE_PATTERNS = [
  /^[{}[\],]+$/,
  /^"(?:toolName|toolInput|toolResponse)"\s*:?$/i,
  /^null[,]?$/i,
];

const SEMANTIC_FIELD_LABELS = Object.freeze({
  command: 'command',
  cmd: 'command',
  path: 'path',
  file: 'file',
  filepath: 'file',
  query: 'query',
  status: 'status',
  result: 'result',
  error: 'error',
  warning: 'warning',
  summary: 'summary',
  action: 'action',
  outcome: 'outcome',
  mode: 'mode',
});

function truncate(value, maxChars) {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxChars - 3)).trim()}...`;
}

function normalizeLine(line) {
  return String(line || '')
    .replace(/^\s*["']?/, '')
    .replace(/["']?\s*,?\s*$/, '')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isNoiseLine(line) {
  const normalized = normalizeLine(line);
  if (!normalized) {
    return true;
  }

  return NOISE_PATTERNS.some(pattern => pattern.test(normalized));
}

function scoreLine(line) {
  const normalized = normalizeLine(line);
  let score = 0;

  for (let index = 0; index < PRIORITY_PATTERNS.length; index += 1) {
    if (PRIORITY_PATTERNS[index].test(normalized)) {
      score += (PRIORITY_PATTERNS.length - index) * 5;
    }
  }

  if (normalized.length >= 20 && normalized.length <= 120) {
    score += 2;
  }

  if (/[.:]/.test(normalized)) {
    score += 1;
  }

  return score;
}

function uniqueOrderedLines(lines) {
  const unique = [];
  const seen = new Set();

  for (const line of lines) {
    const normalized = normalizeLine(line);
    if (!normalized || seen.has(normalized.toLowerCase())) {
      continue;
    }

    seen.add(normalized.toLowerCase());
    unique.push(normalized);
  }

  return unique;
}

function isSimpleScalar(value) {
  return ['string', 'number', 'boolean'].includes(typeof value);
}

function normalizeScalar(value) {
  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }
  return normalizeLine(String(value));
}

function extractCandidateLines(text) {
  return uniqueOrderedLines(
    String(text || '')
      .split('\n')
      .map(normalizeLine)
      .filter(line => !isNoiseLine(line))
  );
}

function summarizeObjectFields(value, options = {}, state = {}) {
  const maxFragments = Number.isFinite(options.maxFragments) ? options.maxFragments : 5;
  const maxDepth = Number.isFinite(options.maxDepth) ? options.maxDepth : 2;
  const fragments = Array.isArray(state.fragments) ? state.fragments : [];
  const seen = state.seen instanceof Set ? state.seen : new Set();

  function addFragment(fragment) {
    const normalized = normalizeLine(fragment);
    if (!normalized) {
      return;
    }
    const dedupeKey = normalized.toLowerCase();
    if (seen.has(dedupeKey) || fragments.length >= maxFragments) {
      return;
    }
    seen.add(dedupeKey);
    fragments.push(normalized);
  }

  function visit(node, depth) {
    if (fragments.length >= maxFragments || node === null || node === undefined) {
      return;
    }

    if (isSimpleScalar(node)) {
      addFragment(normalizeScalar(node));
      return;
    }

    if (Array.isArray(node)) {
      for (const item of node) {
        visit(item, depth + 1);
        if (fragments.length >= maxFragments) {
          break;
        }
      }
      return;
    }

    if (typeof node !== 'object' || depth > maxDepth) {
      return;
    }

    for (const [key, rawValue] of Object.entries(node)) {
      if (fragments.length >= maxFragments) {
        break;
      }

      const label = SEMANTIC_FIELD_LABELS[String(key || '').toLowerCase()];
      const value = rawValue;

      if (label && isSimpleScalar(value)) {
        addFragment(`${label}: ${normalizeScalar(value)}`);
        continue;
      }

      if (label && Array.isArray(value)) {
        const compact = value
          .filter(isSimpleScalar)
          .map(normalizeScalar)
          .filter(Boolean)
          .slice(0, 3)
          .join(', ');
        if (compact) {
          addFragment(`${label}: ${compact}`);
          continue;
        }
      }

      if (typeof value === 'string') {
        const summary = summarizeText(value, {
          maxLines: 2,
          maxChars: Number.isFinite(options.maxChars) ? Math.min(options.maxChars, 100) : 100,
        });
        if (summary) {
          addFragment(summary);
        }
        continue;
      }

      if (typeof value === 'object') {
        visit(value, depth + 1);
      }
    }
  }

  visit(value, 0);
  return fragments;
}

function summarizeText(text, options = {}) {
  const maxLines = Number.isFinite(options.maxLines) ? options.maxLines : 4;
  const maxChars = Number.isFinite(options.maxChars) ? options.maxChars : 220;
  const candidates = extractCandidateLines(text);

  if (candidates.length === 0) {
    return '';
  }

  const ranked = [...candidates]
    .map((line, index) => ({
      line,
      index,
      score: scoreLine(line),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, maxLines)
    .sort((left, right) => left.index - right.index)
    .map(entry => entry.line);

  return truncate(ranked.join(' | '), maxChars);
}

function summarizeStructuredPayload(payload, options = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return '';
  }

  const maxChars = Number.isFinite(options.maxChars) ? options.maxChars : 220;
  const parts = [];

  if (payload.toolName) {
    parts.push(normalizeLine(payload.toolName));
  }

  const semanticFragments = summarizeObjectFields(
    payload.toolInput || payload.input || payload.arguments || payload,
    options
  ).filter(fragment => {
    return !/^summary:/i.test(fragment) && !/^result:/i.test(fragment);
  });
  if (semanticFragments.length > 0) {
    const semanticPrefix = semanticFragments
      .map(fragment => fragment.replace(/^(command|file|path|query|action|mode):\s*/i, ''))
      .join(', ');
    if (semanticPrefix) {
      parts.push(semanticPrefix);
    }
  }

  const responseSummary = summarizeText(payload.toolResponse || payload.output || payload.content || '', options);
  if (responseSummary) {
    parts.push(responseSummary);
  }

  const semanticSummary = summarizeObjectFields(payload, options)
    .filter(fragment => {
      return !semanticFragments.includes(fragment) && !normalizeLine(responseSummary).includes(normalizeLine(fragment));
    })
    .slice(0, 2);
  if (semanticSummary.length > 0 && !responseSummary) {
    parts.push(semanticSummary.join(' | '));
  }

  if (!responseSummary && payload.toolInput && typeof payload.toolInput === 'object') {
    const keys = Object.keys(payload.toolInput).slice(0, 3);
    if (keys.length > 0) {
      parts.push(`input: ${keys.join(', ')}`);
    }
  }

  if (parts.length === 0) {
    return summarizeText(JSON.stringify(payload, null, 2), options);
  }

  const [head, ...tail] = uniqueOrderedLines(parts);
  const summary = tail.length > 0
    ? `${head}: ${tail.join(' | ')}`
    : head;
  return truncate(summary, maxChars);
}

function compressObservation(content, options = {}) {
  const text = String(content || '').trim();
  const maxChars = Number.isFinite(options.maxChars) ? options.maxChars : 220;

  if (!text) {
    return '';
  }

  try {
    const parsed = JSON.parse(text);
    const structured = summarizeStructuredPayload(parsed, options);
    if (structured) {
      return truncate(structured, maxChars);
    }
  } catch {
    // Fall back to line-based summarization for plain text payloads.
  }

  return summarizeText(text, options);
}

module.exports = {
  compressObservation,
};
