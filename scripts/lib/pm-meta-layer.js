#!/usr/bin/env node
'use strict';

/**
 * Phase 6.3 - PM Meta-Layer and Reflexion
 * Source: SuperClaude Framework (reflexion.py)
 *
 * PM persona that manages session governance above specialist execution:
 *  - Restores context from prior sessions
 *  - Runs PDCA (Plan-Do-Check-Act) cycles
 *  - Classifies errors and stores fix patterns
 *  - Checkpoint decisions with reasoning
 *
 * ReflexionPattern: error learning with JSONL persistence and
 * signature matching (70% word overlap threshold).
 */

const fs = require('fs');
const path = require('path');

// --- Error Classification (Source: IMPLEMENTATION_PLAN §6.3) ---

const ERROR_TYPES = Object.freeze({
  INPUT: 'input',
  LOGIC: 'logic',
  API: 'api',
  CONFIG: 'config',
  ENVIRONMENT: 'environment',
});

const ERROR_CLASSIFIERS = Object.freeze([
  { type: ERROR_TYPES.INPUT, patterns: ['invalid', 'missing param', 'validation', 'undefined is not', 'null reference', 'type error', 'NaN'] },
  { type: ERROR_TYPES.API, patterns: ['fetch', 'timeout', 'ECONNREFUSED', '401', '403', '404', '500', 'rate limit', 'network'] },
  { type: ERROR_TYPES.CONFIG, patterns: ['config', 'env', 'ENOENT', 'permission denied', 'not found', 'missing key'] },
  { type: ERROR_TYPES.ENVIRONMENT, patterns: ['ENOMEM', 'disk', 'spawn', 'killed', 'SIGTERM', 'out of memory', 'segfault'] },
  { type: ERROR_TYPES.LOGIC, patterns: ['assertion', 'expect', 'infinite loop', 'stack overflow', 'deadlock', 'race condition'] },
]);

// --- PDCA Cycle ---

const PDCA_PHASES = Object.freeze({
  PLAN: 'plan',
  DO: 'do',
  CHECK: 'check',
  ACT: 'act',
});

function createPDCACycle(goal, context = {}) {
  return {
    id: `pdca-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    goal,
    phase: PDCA_PHASES.PLAN,
    context,
    steps: [],
    checkpoints: [],
    startedAt: new Date().toISOString(),
    completedAt: null,
  };
}

function advancePDCA(cycle, result) {
  const phaseOrder = [PDCA_PHASES.PLAN, PDCA_PHASES.DO, PDCA_PHASES.CHECK, PDCA_PHASES.ACT];
  const currentIdx = phaseOrder.indexOf(cycle.phase);

  const step = {
    phase: cycle.phase,
    result,
    timestamp: new Date().toISOString(),
  };

  const nextIdx = currentIdx + 1;
  const isComplete = nextIdx >= phaseOrder.length;

  return {
    ...cycle,
    phase: isComplete ? PDCA_PHASES.ACT : phaseOrder[nextIdx],
    steps: [...cycle.steps, step],
    completedAt: isComplete ? new Date().toISOString() : null,
  };
}

// --- Error Classification ---

function classifyError(errorMessage) {
  const lower = (errorMessage || '').toLowerCase();

  for (const classifier of ERROR_CLASSIFIERS) {
    for (const pattern of classifier.patterns) {
      if (lower.includes(pattern.toLowerCase())) {
        return {
          type: classifier.type,
          matchedPattern: pattern,
          original: errorMessage,
        };
      }
    }
  }

  return {
    type: ERROR_TYPES.LOGIC,
    matchedPattern: null,
    original: errorMessage,
  };
}

// --- Reflexion Pattern (Source: SuperClaude reflexion.py) ---

const WORD_OVERLAP_THRESHOLD = 0.7;

function createReflexionStore(storePath) {
  return {
    storePath,
    entries: loadEntries(storePath),
  };
}

function loadEntries(storePath) {
  if (!fs.existsSync(storePath)) return [];

  try {
    const content = fs.readFileSync(storePath, 'utf8').trim();
    if (!content) return [];
    return content.split('\n').map(line => JSON.parse(line));
  } catch {
    return [];
  }
}

function persistEntry(store, entry) {
  const dir = path.dirname(store.storePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.appendFileSync(store.storePath, JSON.stringify(entry) + '\n', 'utf8');

  return {
    ...store,
    entries: [...store.entries, entry],
  };
}

function computeWordOverlap(sig1, sig2) {
  const words1 = new Set(sig1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(sig2.toLowerCase().split(/\s+/).filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  let overlap = 0;
  for (const w of words1) {
    if (words2.has(w)) overlap++;
  }

  return overlap / Math.max(words1.size, words2.size);
}

function createErrorSignature(error) {
  const msg = (error.message || error.original || String(error)).toLowerCase();
  return msg
    .replace(/[0-9]+/g, 'N')
    .replace(/['"`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findMatchingPattern(store, errorSignature) {
  for (const entry of store.entries) {
    const existingSig = entry.signature || '';
    const overlap = computeWordOverlap(errorSignature, existingSig);
    if (overlap >= WORD_OVERLAP_THRESHOLD) {
      return { entry, overlap };
    }
  }
  return null;
}

function recordMistake(store, error, fix, context = {}) {
  const signature = createErrorSignature(error);
  const classification = classifyError(error.message || error.original || String(error));

  const entry = {
    signature,
    errorType: classification.type,
    error: error.message || error.original || String(error),
    fix,
    context: {
      file: context.file || null,
      phase: context.phase || null,
      agent: context.agent || null,
    },
    occurrences: 1,
    firstSeen: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  };

  const existing = findMatchingPattern(store, signature);
  if (existing) {
    const updated = {
      ...existing.entry,
      occurrences: (existing.entry.occurrences || 1) + 1,
      lastSeen: new Date().toISOString(),
      fix: fix || existing.entry.fix,
    };
    return { store, entry: updated, isNew: false };
  }

  const updatedStore = persistEntry(store, entry);
  return { store: updatedStore, entry, isNew: true };
}

function suggestFix(store, error) {
  const signature = createErrorSignature(error);
  const match = findMatchingPattern(store, signature);

  if (match) {
    return {
      found: true,
      fix: match.entry.fix,
      confidence: match.overlap,
      occurrences: match.entry.occurrences || 1,
      errorType: match.entry.errorType,
    };
  }

  return { found: false, fix: null, confidence: 0, occurrences: 0, errorType: null };
}

// --- PM Context Checkpoint ---

function createCheckpoint(sessionId, data) {
  return {
    sessionId,
    timestamp: new Date().toISOString(),
    phase: data.phase || 'unknown',
    decision: data.decision || '',
    reasoning: data.reasoning || '',
    filesModified: data.filesModified || [],
    testsStatus: data.testsStatus || null,
    nextSteps: data.nextSteps || [],
  };
}

function restoreContext(checkpoints) {
  if (!checkpoints || checkpoints.length === 0) {
    return { lastPhase: null, lastDecision: null, filesModified: [], nextSteps: [] };
  }

  const latest = checkpoints[checkpoints.length - 1];
  const allFiles = new Set();
  for (const cp of checkpoints) {
    for (const f of cp.filesModified || []) {
      allFiles.add(f);
    }
  }

  return {
    lastPhase: latest.phase,
    lastDecision: latest.decision,
    reasoning: latest.reasoning,
    filesModified: [...allFiles],
    nextSteps: latest.nextSteps || [],
    totalCheckpoints: checkpoints.length,
  };
}

module.exports = {
  ERROR_TYPES,
  ERROR_CLASSIFIERS,
  PDCA_PHASES,
  WORD_OVERLAP_THRESHOLD,
  createPDCACycle,
  advancePDCA,
  classifyError,
  createReflexionStore,
  loadEntries,
  persistEntry,
  computeWordOverlap,
  createErrorSignature,
  findMatchingPattern,
  recordMistake,
  suggestFix,
  createCheckpoint,
  restoreContext,
};
