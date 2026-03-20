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

const DEFAULT_STALE_THRESHOLD_DAYS = 30;
const DEFAULT_CONSOLIDATION_BATCH = 50;
const DEFAULT_EVO_THRESHOLD = 100;

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

    if (overlap.length >= 2) {
      actions.push({
        action: EVOLUTION_ACTIONS.STRENGTHEN,
        targetId: neighbor.id,
        reason: `Shared keywords: ${overlap.join(', ')}`,
        suggestedEdgeType: 'related_to',
      });
    }

    if (neighbor.category === note.category && overlap.length >= 3) {
      actions.push({
        action: EVOLUTION_ACTIONS.UPDATE_NEIGHBOR,
        targetId: neighbor.id,
        reason: `Same category (${note.category}) with significant keyword overlap`,
        suggestedTags: [...new Set([...(neighbor.tags || []), ...(note.tags || [])])],
      });
    }
  }

  return actions;
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
  identifyMergeCandidates,
  planConsolidation,
  cloneForAttempt,
  applyEvolutionAction,
  DEFAULT_STALE_THRESHOLD_DAYS,
  DEFAULT_CONSOLIDATION_BATCH,
  DEFAULT_EVO_THRESHOLD,
};
