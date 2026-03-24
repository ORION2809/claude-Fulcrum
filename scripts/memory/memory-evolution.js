#!/usr/bin/env node
'use strict';

/**
 * Phase 3.4 - Memory Evolution and Consolidation
 * Source: A-MEM (agentic_memory/memory_system.py)
 *
 * Background maintenance pass after ingestion:
 * - Update links, tags, and summaries over time
 * - Support branchable memory clones for isolated attempts
 * - Consolidation hooks for compaction and stale-memory downsampling
 */

const crypto = require('crypto');

const EVOLUTION_ACTIONS = Object.freeze({
  STRENGTHEN: 'strengthen',
  UPDATE_NEIGHBOR: 'update_neighbor',
  MERGE: 'merge',
  DOWNSAMPLE: 'downsample',
  ARCHIVE: 'archive',
});

const MEMORY_EDGE_TYPES = Object.freeze({
  RELATED_TO: 'related_to',
  EVOLVED_FROM: 'evolved_from',
  DEPENDS_ON: 'depends_on',
  PREVENTS: 'prevents',
  CONFLICTS_WITH: 'conflicts_with',
});

const DEFAULT_STALE_THRESHOLD_DAYS = 30;
const DEFAULT_CONSOLIDATION_BATCH = 50;
const DEFAULT_EVO_THRESHOLD = 100;
const DEFAULT_LINK_THRESHOLD = 0.45;

const DEPENDENCY_TERMS = new Set(['depends', 'dependency', 'requires', 'requires', 'needs', 'uses', 'imports', 'calls', 'build', 'module', 'service', 'worker', 'hook']);
const PREVENTION_TERMS = new Set(['prevent', 'prevents', 'guard', 'sanitize', 'validate', 'block', 'secure', 'fix', 'patch', 'mitigate']);
const CONFLICT_TERMS = new Set(['conflict', 'conflicts', 'instead', 'alternative', 'replace', 'replaces', 'swap', 'tradeoff', 'either-or']);
const EVOLUTION_TERMS = new Set(['evolve', 'evolved', 'evolution', 'refactor', 'iteration', 'follow-up', 'next', 'update', 'derive']);

function normalizeTerms(values) {
  const source = Array.isArray(values) ? values : [values];
  return source
    .flatMap(value => String(value || '').toLowerCase().split(/[^a-z0-9+.#_-]+/g))
    .map(value => value.trim())
    .filter(Boolean);
}

function collectSignals(note, neighbor) {
  const noteTerms = new Set([
    ...normalizeTerms(note.title),
    ...normalizeTerms(note.summary),
    ...normalizeTerms(note.content),
    ...normalizeTerms(note.keywords),
    ...normalizeTerms(note.tags),
    ...normalizeTerms(note.category ? [note.category] : []),
  ]);
  const neighborTerms = new Set([
    ...normalizeTerms(neighbor.title),
    ...normalizeTerms(neighbor.summary),
    ...normalizeTerms(neighbor.content),
    ...normalizeTerms(neighbor.keywords),
    ...normalizeTerms(neighbor.tags),
    ...normalizeTerms(neighbor.category ? [neighbor.category] : []),
  ]);

  const sharedTerms = [...noteTerms].filter(term => neighborTerms.has(term));
  const noteHas = terms => [...terms].some(term => noteTerms.has(term));
  const neighborHas = terms => [...terms].some(term => neighborTerms.has(term));

  return {
    sharedTerms,
    sharedCount: sharedTerms.length,
    noteHasDependencySignals: noteHas(DEPENDENCY_TERMS),
    neighborHasDependencySignals: neighborHas(DEPENDENCY_TERMS),
    noteHasPreventionSignals: noteHas(PREVENTION_TERMS),
    noteHasIssueSignals: noteHas(new Set(['error', 'bug', 'issue', 'failure', 'vulnerability', 'leak'])),
    neighborHasIssueSignals: neighborHas(new Set(['error', 'bug', 'issue', 'failure', 'vulnerability', 'leak'])),
    neighborHasPreventionSignals: neighborHas(PREVENTION_TERMS),
    noteHasConflictSignals: noteHas(CONFLICT_TERMS),
    neighborHasConflictSignals: neighborHas(CONFLICT_TERMS),
    noteHasEvolutionSignals: noteHas(EVOLUTION_TERMS),
    neighborHasEvolutionSignals: neighborHas(EVOLUTION_TERMS),
    sameCategory: String(note.category || '').toLowerCase() === String(neighbor.category || '').toLowerCase(),
    sameSession: Boolean(note.sessionId && neighbor.sessionId && note.sessionId === neighbor.sessionId),
  };
}

function inferMemoryEdgeType(note, neighbor) {
  const signals = collectSignals(note, neighbor);
  let edgeType = MEMORY_EDGE_TYPES.RELATED_TO;
  let confidence = 0.55;
  let reason = 'Shared context';

  if (
    signals.noteHasConflictSignals
    || signals.neighborHasConflictSignals
    || (signals.sharedCount >= 2 && (signals.noteHasConflictSignals || signals.neighborHasConflictSignals))
  ) {
    edgeType = MEMORY_EDGE_TYPES.CONFLICTS_WITH;
    confidence = 0.82;
    reason = 'Conflicting or alternative markers detected';
  } else if (
    (signals.noteHasPreventionSignals && signals.neighborHasIssueSignals)
    || (signals.neighborHasPreventionSignals && signals.noteHasIssueSignals)
  ) {
    edgeType = MEMORY_EDGE_TYPES.PREVENTS;
    confidence = 0.84;
    reason = 'Preventive markers align with issue markers';
  } else if (
    signals.noteHasDependencySignals
    || signals.neighborHasDependencySignals
    || signals.sharedTerms.some(term => DEPENDENCY_TERMS.has(term))
    || (signals.sharedCount >= 2 && (signals.sameSession || signals.sameCategory))
  ) {
    edgeType = signals.sameCategory ? MEMORY_EDGE_TYPES.EVOLVED_FROM : MEMORY_EDGE_TYPES.DEPENDS_ON;
    confidence = signals.sameCategory ? 0.8 : 0.77;
    reason = signals.sameCategory
      ? 'Same-category memory evolved from a related note'
      : 'Dependency markers indicate operational linkage';
  } else if (signals.noteHasEvolutionSignals || signals.neighborHasEvolutionSignals) {
    edgeType = MEMORY_EDGE_TYPES.EVOLVED_FROM;
    confidence = 0.73;
    reason = 'Evolution markers indicate a follow-on note';
  } else if (signals.sharedCount >= 2 && signals.sameSession) {
    edgeType = MEMORY_EDGE_TYPES.RELATED_TO;
    confidence = 0.62;
    reason = 'Shared session and overlapping terms';
  }

  return {
    edgeType,
    confidence,
    reason,
    signals,
  };
}

function isStale(note, thresholdDays) {
  const threshold = thresholdDays || DEFAULT_STALE_THRESHOLD_DAYS;
  const lastAccessed = note.lastAccessed || note.createdAt;
  if (!lastAccessed) return true;

  const ageMs = Date.now() - new Date(lastAccessed).getTime();
  const ageDays = ageMs / (24 * 60 * 60 * 1000);
  return ageDays > threshold;
}

function computeRelevanceScore(note) {
  const retrievalWeight = Math.min((note.retrievalCount || 0) / 10, 1.0);
  const linkWeight = Math.min(((note.links || []).length) / 5, 1.0);
  const recencyWeight = isStale(note, 7) ? 0.2 : 1.0;

  return (retrievalWeight * 0.4) + (linkWeight * 0.3) + (recencyWeight * 0.3);
}

function suggestEvolutionActions(note, neighbors) {
  const actions = [];

  if (!neighbors || neighbors.length === 0) {
    return actions;
  }

  const noteKeywords = new Set((note.keywords || []).map(k => k.toLowerCase()));

  for (const neighbor of neighbors) {
    const neighborKeywords = new Set((neighbor.keywords || []).map(k => k.toLowerCase()));
    const overlap = [...noteKeywords].filter(k => neighborKeywords.has(k));
    const linkInference = inferMemoryEdgeType(note, neighbor);

    if (overlap.length >= 2) {
      actions.push({
        action: EVOLUTION_ACTIONS.STRENGTHEN,
        targetId: neighbor.id,
        reason: `${linkInference.reason}: ${overlap.join(', ')}`,
        suggestedEdgeType: linkInference.edgeType,
        confidence: linkInference.confidence,
        linkMetadata: {
          sharedKeywords: overlap,
          sharedCount: overlap.length,
          ...linkInference.signals,
        },
      });
    }

    if (neighbor.category === note.category && overlap.length >= 3) {
      actions.push({
        action: EVOLUTION_ACTIONS.UPDATE_NEIGHBOR,
        targetId: neighbor.id,
        reason: `Same category (${note.category}) with significant keyword overlap`,
        suggestedTags: [...new Set([...(neighbor.tags || []), ...(note.tags || [])])],
        suggestedEdgeType: MEMORY_EDGE_TYPES.EVOLVED_FROM,
        confidence: 0.78,
      });
    }
  }

  return actions;
}

function scoreNeighborCandidate(note, neighbor) {
  const currentKeywords = new Set(Array.isArray(note.keywords) ? note.keywords : []);
  const currentTags = new Set(Array.isArray(note.tags) ? note.tags : []);
  const candidateKeywords = new Set(Array.isArray(neighbor.keywords) ? neighbor.keywords : []);
  const candidateTags = new Set(Array.isArray(neighbor.tags) ? neighbor.tags : []);
  const keywordOverlap = [...currentKeywords].filter(value => candidateKeywords.has(value));
  const tagOverlap = [...currentTags].filter(value => candidateTags.has(value));
  const sameSessionBoost = note.sessionId && neighbor.sessionId && note.sessionId === neighbor.sessionId ? 0.1 : 0;
  const linkInference = inferMemoryEdgeType(note, neighbor);
  const signalBoost = linkInference.edgeType === MEMORY_EDGE_TYPES.EVOLVED_FROM
    ? 0.15
    : linkInference.edgeType === MEMORY_EDGE_TYPES.DEPENDS_ON
      ? 0.12
      : linkInference.edgeType === MEMORY_EDGE_TYPES.PREVENTS
        ? 0.14
        : linkInference.edgeType === MEMORY_EDGE_TYPES.CONFLICTS_WITH
          ? 0.1
          : 0.05;
  const weight = Math.min(
    0.99,
    Number((((keywordOverlap.length * 0.25)
      + (tagOverlap.length * 0.2)
      + sameSessionBoost
      + signalBoost
    )).toFixed(2))
  );

  return {
    candidate: neighbor,
    keywordOverlap,
    tagOverlap,
    linkInference,
    weight,
  };
}

function buildEvolutionLinkPlan(note, neighbors, options = {}) {
  const recentNotes = Array.isArray(neighbors) ? neighbors : [];
  const linksByNoteId = options.linksByNoteId instanceof Map ? options.linksByNoteId : new Map();
  const noteIndex = new Map(recentNotes.map(entry => [entry.id, entry]));
  const maxLinks = Number.isFinite(Number(options.maxLinks)) ? Number(options.maxLinks) : 3;
  const threshold = Number.isFinite(Number(options.threshold)) ? Number(options.threshold) : DEFAULT_LINK_THRESHOLD;
  const planned = [];
  const seenTargets = new Set([note.id]);

  function pushPlan(entry) {
    if (!entry || !entry.targetId || seenTargets.has(entry.targetId) || planned.length >= maxLinks) {
      return;
    }
    seenTargets.add(entry.targetId);
    planned.push(entry);
  }

  const directCandidates = recentNotes
    .filter(candidate => candidate && candidate.id && candidate.id !== note.id)
    .map(candidate => scoreNeighborCandidate(note, candidate))
    .filter(entry => entry.weight >= threshold)
    .sort((left, right) => right.weight - left.weight);

  for (const entry of directCandidates) {
    pushPlan({
      targetId: entry.candidate.id,
      edgeType: entry.linkInference.edgeType,
      weight: entry.weight,
      confidence: entry.linkInference.confidence,
      reason: entry.linkInference.reason,
      traversalDepth: 1,
      metadata: {
        keywordOverlap: entry.keywordOverlap,
        tagOverlap: entry.tagOverlap,
        sharedTerms: entry.linkInference.signals.sharedTerms,
        sameSession: entry.linkInference.signals.sameSession,
        sameCategory: entry.linkInference.signals.sameCategory,
      },
    });
    if (planned.length >= maxLinks) {
      return planned;
    }
  }

  for (const entry of directCandidates.slice(0, Math.min(directCandidates.length, 3))) {
    const relatedLinks = Array.isArray(linksByNoteId.get(entry.candidate.id)) ? linksByNoteId.get(entry.candidate.id) : [];
    for (const relatedLink of relatedLinks) {
      if (planned.length >= maxLinks) {
        return planned;
      }

      const nextId = relatedLink.fromNoteId === entry.candidate.id
        ? relatedLink.toNoteId
        : relatedLink.fromNoteId;
      const nextNote = noteIndex.get(nextId);
      if (!nextNote || nextId === note.id || seenTargets.has(nextId)) {
        continue;
      }

      const transitive = scoreNeighborCandidate(note, nextNote);
      const propagatedWeight = Number(Math.min(
        0.95,
        ((entry.weight * 0.65) + (transitive.weight * 0.35) + 0.08)
      ).toFixed(2));

      if (propagatedWeight < threshold) {
        continue;
      }

      pushPlan({
        targetId: nextId,
        edgeType: transitive.linkInference.edgeType === MEMORY_EDGE_TYPES.RELATED_TO
          ? relatedLink.linkType || transitive.linkInference.edgeType
          : transitive.linkInference.edgeType,
        weight: propagatedWeight,
        confidence: Number(((entry.linkInference.confidence + transitive.linkInference.confidence) / 2).toFixed(2)),
        reason: `Transitively surfaced via ${entry.candidate.id}: ${transitive.linkInference.reason}`,
        traversalDepth: 2,
        via: entry.candidate.id,
        metadata: {
          keywordOverlap: transitive.keywordOverlap,
          tagOverlap: transitive.tagOverlap,
          sharedTerms: transitive.linkInference.signals.sharedTerms,
          sameSession: transitive.linkInference.signals.sameSession,
          sameCategory: transitive.linkInference.signals.sameCategory,
          transitiveVia: entry.candidate.id,
          sourceEdgeType: relatedLink.linkType || MEMORY_EDGE_TYPES.RELATED_TO,
        },
      });
    }
  }

  return planned;
}

function identifyMergeCandidates(notes) {
  const groups = new Map();

  for (const note of notes) {
    const hash = crypto
      .createHash('sha256')
      .update(String(note.category || '') + '::' + (note.keywords || []).sort().join(','))
      .digest('hex')
      .slice(0, 12);

    if (!groups.has(hash)) {
      groups.set(hash, []);
    }
    groups.get(hash).push(note);
  }

  const mergeCandidates = [];
  for (const [groupHash, groupNotes] of groups) {
    if (groupNotes.length >= 2) {
      mergeCandidates.push({
        groupHash,
        notes: groupNotes.map(n => n.id),
        category: groupNotes[0].category,
        keywords: [...new Set(groupNotes.flatMap(n => n.keywords || []))],
        action: EVOLUTION_ACTIONS.MERGE,
      });
    }
  }

  return mergeCandidates;
}

function planConsolidation(notes, options = {}) {
  const staleThreshold = options.staleThresholdDays || DEFAULT_STALE_THRESHOLD_DAYS;
  const batchSize = options.batchSize || DEFAULT_CONSOLIDATION_BATCH;

  const stale = [];
  const active = [];
  const lowRelevance = [];

  for (const note of notes) {
    const relevance = computeRelevanceScore(note);
    if (isStale(note, staleThreshold) && relevance < 0.3) {
      stale.push({ ...note, relevance, suggestedAction: EVOLUTION_ACTIONS.ARCHIVE });
    } else if (relevance < 0.2) {
      lowRelevance.push({ ...note, relevance, suggestedAction: EVOLUTION_ACTIONS.DOWNSAMPLE });
    } else {
      active.push({ ...note, relevance });
    }
  }

  const mergeCandidates = identifyMergeCandidates(active);

  return {
    toArchive: stale.slice(0, batchSize),
    toDownsample: lowRelevance.slice(0, batchSize),
    toMerge: mergeCandidates.slice(0, Math.floor(batchSize / 2)),
    activeCount: active.length,
    stats: {
      totalNotes: notes.length,
      staleCount: stale.length,
      lowRelevanceCount: lowRelevance.length,
      mergeGroupCount: mergeCandidates.length,
      activeCount: active.length,
    },
  };
}

function cloneForAttempt(notes, attemptId) {
  return notes.map(note => ({
    ...note,
    id: `${attemptId}::${note.id}`,
    sourceId: note.id,
    attemptId,
    clonedAt: new Date().toISOString(),
    evolutionHistory: [
      ...(note.evolutionHistory || []),
      {
        action: 'clone',
        attemptId,
        timestamp: new Date().toISOString(),
      },
    ],
  }));
}

function applyEvolutionAction(note, action) {
  const updated = { ...note };

  switch (action.action) {
    case EVOLUTION_ACTIONS.STRENGTHEN: {
      const existingLinks = updated.links || [];
      const alreadyLinked = existingLinks.some(l => l.targetId === action.targetId);
      if (!alreadyLinked) {
        updated.links = [
          ...existingLinks,
          {
            targetId: action.targetId,
            edgeType: action.suggestedEdgeType || 'related_to',
            reason: action.reason,
            confidence: Number.isFinite(action.confidence) ? action.confidence : null,
            metadata: action.linkMetadata || {},
            createdAt: new Date().toISOString(),
          },
        ];
      }
      break;
    }

    case EVOLUTION_ACTIONS.UPDATE_NEIGHBOR: {
      if (action.suggestedTags) {
        updated.tags = [...new Set([...(updated.tags || []), ...action.suggestedTags])];
      }
      break;
    }

    case EVOLUTION_ACTIONS.ARCHIVE: {
      updated.archived = true;
      updated.archivedAt = new Date().toISOString();
      break;
    }

    case EVOLUTION_ACTIONS.DOWNSAMPLE: {
      updated.downsampled = true;
      updated.downsampledAt = new Date().toISOString();
      break;
    }

    case EVOLUTION_ACTIONS.MERGE: {
      updated.merged = true;
      updated.mergedAt = new Date().toISOString();
      updated.mergedInto = action.primaryId || action.targetId;
      break;
    }

    default:
      break;
  }

  updated.evolutionHistory = [
    ...(updated.evolutionHistory || []),
    {
      action: action.action,
      targetId: action.targetId,
      reason: action.reason,
      edgeType: action.suggestedEdgeType || null,
      confidence: Number.isFinite(action.confidence) ? action.confidence : null,
      timestamp: new Date().toISOString(),
    },
  ];

  return updated;
}

module.exports = {
  EVOLUTION_ACTIONS,
  isStale,
  computeRelevanceScore,
  suggestEvolutionActions,
  buildEvolutionLinkPlan,
  identifyMergeCandidates,
  planConsolidation,
  cloneForAttempt,
  applyEvolutionAction,
  inferMemoryEdgeType,
  collectSignals,
  MEMORY_EDGE_TYPES,
  DEFAULT_STALE_THRESHOLD_DAYS,
  DEFAULT_CONSOLIDATION_BATCH,
  DEFAULT_EVO_THRESHOLD,
  DEFAULT_LINK_THRESHOLD,
};
