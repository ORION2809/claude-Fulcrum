#!/usr/bin/env node
'use strict';

/**
 * Phase 3.3 - Time-Aware Traversal
 * Source: A-MEM (agentic_memory/memory_system.py)
 *
 * BFS on recent memories first, DFS on deep chains second.
 * Configurable decay windows by query type.
 */

const DEFAULT_DECAY_WINDOWS = Object.freeze({
  recent: { maxAgeMs: 60 * 60 * 1000, weight: 1.0 },        // 1 hour
  today: { maxAgeMs: 24 * 60 * 60 * 1000, weight: 0.7 },    // 24 hours
  week: { maxAgeMs: 7 * 24 * 60 * 60 * 1000, weight: 0.4 }, // 7 days
  older: { maxAgeMs: Infinity, weight: 0.1 },
});

const QUERY_DECAY_PROFILES = Object.freeze({
  debugging: {
    recent: { maxAgeMs: 2 * 60 * 60 * 1000, weight: 1.0 },
    today: { maxAgeMs: 24 * 60 * 60 * 1000, weight: 0.8 },
    week: { maxAgeMs: 7 * 24 * 60 * 60 * 1000, weight: 0.3 },
    older: { maxAgeMs: Infinity, weight: 0.05 },
  },
  architecture: {
    recent: { maxAgeMs: 24 * 60 * 60 * 1000, weight: 0.6 },
    today: { maxAgeMs: 7 * 24 * 60 * 60 * 1000, weight: 0.8 },
    week: { maxAgeMs: 30 * 24 * 60 * 60 * 1000, weight: 1.0 },
    older: { maxAgeMs: Infinity, weight: 0.5 },
  },
  pattern: {
    recent: { maxAgeMs: 7 * 24 * 60 * 60 * 1000, weight: 0.7 },
    today: { maxAgeMs: 30 * 24 * 60 * 60 * 1000, weight: 0.9 },
    week: { maxAgeMs: 90 * 24 * 60 * 60 * 1000, weight: 1.0 },
    older: { maxAgeMs: Infinity, weight: 0.6 },
  },
});

function computeTimeDecay(createdAt, queryType, now) {
  const nowMs = now ? new Date(now).getTime() : Date.now();
  const createdMs = new Date(createdAt).getTime();

  if (!Number.isFinite(createdMs)) {
    return 0.1;
  }

  const ageMs = Math.max(0, nowMs - createdMs);
  const profile = QUERY_DECAY_PROFILES[queryType] || DEFAULT_DECAY_WINDOWS;
  const windows = Object.values(profile);

  for (const window of windows.sort((a, b) => a.maxAgeMs - b.maxAgeMs)) {
    if (ageMs <= window.maxAgeMs) {
      return window.weight;
    }
  }

  return 0.1;
}

function partitionByRecency(entries, now) {
  const nowMs = now ? new Date(now).getTime() : Date.now();
  const buckets = { recent: [], today: [], week: [], older: [] };

  for (const entry of entries) {
    const createdMs = new Date(entry.createdAt || 0).getTime();
    const ageMs = Math.max(0, nowMs - createdMs);

    if (ageMs <= 60 * 60 * 1000) {
      buckets.recent.push(entry);
    } else if (ageMs <= 24 * 60 * 60 * 1000) {
      buckets.today.push(entry);
    } else if (ageMs <= 7 * 24 * 60 * 60 * 1000) {
      buckets.week.push(entry);
    } else {
      buckets.older.push(entry);
    }
  }

  return buckets;
}

function bfsRecentFirst(entries, adjacencyIndex, options = {}) {
  const maxResults = options.maxResults || 20;
  const queryType = options.queryType || 'debugging';
  const now = options.now || new Date().toISOString();

  const buckets = partitionByRecency(entries, now);
  const results = [];
  const visited = new Set();

  const orderedEntries = [
    ...buckets.recent,
    ...buckets.today,
    ...buckets.week,
    ...buckets.older,
  ];

  for (const entry of orderedEntries) {
    if (results.length >= maxResults) break;
    if (visited.has(entry.id)) continue;

    visited.add(entry.id);
    const decay = computeTimeDecay(entry.createdAt, queryType, now);

    results.push({
      ...entry,
      timeDecay: decay,
      adjustedScore: (entry.score || 0) * decay,
      traversalMethod: 'bfs_recent',
    });
  }

  return results;
}

function dfsDeepChains(entries, adjacencyIndex, options = {}) {
  const maxResults = options.maxResults || 10;
  const maxChainDepth = options.maxChainDepth || 5;
  const startIds = options.startIds || [];
  const queryType = options.queryType || 'architecture';
  const now = options.now || new Date().toISOString();

  const entryMap = new Map(entries.map(e => [e.id, e]));
  const visited = new Set();
  const chains = [];

  function dfs(nodeId, chain, depth) {
    if (depth > maxChainDepth || visited.has(nodeId)) return;
    if (chains.length >= maxResults) return;

    visited.add(nodeId);
    const entry = entryMap.get(nodeId);
    if (!entry) return;

    const decay = computeTimeDecay(entry.createdAt, queryType, now);
    const current = {
      ...entry,
      timeDecay: decay,
      adjustedScore: (entry.score || 0) * decay,
      chainDepth: depth,
      traversalMethod: 'dfs_deep',
    };

    const currentChain = [...chain, current];

    const neighbors = adjacencyIndex ? (adjacencyIndex.get(nodeId) || []) : [];
    const depthEdges = neighbors.filter(e =>
      e.edgeType === 'evolved_from' || e.edgeType === 'depends_on'
    );

    if (depthEdges.length === 0 || depth >= maxChainDepth) {
      chains.push(currentChain);
      return;
    }

    for (const edge of depthEdges.sort((a, b) => b.weight - a.weight)) {
      dfs(edge.targetId, currentChain, depth + 1);
    }
  }

  for (const startId of startIds) {
    dfs(startId, [], 0);
  }

  const flatResults = [];
  const seen = new Set();
  for (const chain of chains) {
    for (const node of chain) {
      if (!seen.has(node.id)) {
        seen.add(node.id);
        flatResults.push(node);
      }
    }
  }

  return flatResults.slice(0, maxResults);
}

function timeAwareRetrieval(entries, adjacencyIndex, options = {}) {
  const queryType = options.queryType || 'debugging';
  const bfsBudget = options.bfsBudget || 15;
  const dfsBudget = options.dfsBudget || 10;
  const now = options.now || new Date().toISOString();

  const bfsResults = bfsRecentFirst(entries, adjacencyIndex, {
    maxResults: bfsBudget,
    queryType,
    now,
  });

  const seedIds = bfsResults.slice(0, 3).map(r => r.id);
  const dfsResults = dfsDeepChains(entries, adjacencyIndex, {
    maxResults: dfsBudget,
    startIds: seedIds,
    queryType,
    now,
  });

  const combined = new Map();
  for (const result of [...bfsResults, ...dfsResults]) {
    const existing = combined.get(result.id);
    if (!existing || result.adjustedScore > existing.adjustedScore) {
      combined.set(result.id, result);
    }
  }

  const all = Array.from(combined.values())
    .sort((a, b) => b.adjustedScore - a.adjustedScore);

  return {
    results: all,
    bfsCount: bfsResults.length,
    dfsCount: dfsResults.length,
    totalCount: all.length,
    queryType,
  };
}

module.exports = {
  computeTimeDecay,
  partitionByRecency,
  bfsRecentFirst,
  dfsDeepChains,
  timeAwareRetrieval,
  DEFAULT_DECAY_WINDOWS,
  QUERY_DECAY_PROFILES,
};
