#!/usr/bin/env node
'use strict';

/**
 * Phase 3.2 - Graph-Linked Retrieval
 * Source: A-MEM (agentic_memory/memory_system.py)
 *
 * Two-stage retrieval:
 * 1. Semantic seed selection
 * 2. Graph neighbor expansion
 *
 * Typed edges: prevents, related_to, evolved_from, depends_on, conflicts_with
 * Separate budgets for seed count and neighbor fan-out.
 */

const EDGE_TYPES = Object.freeze({
  PREVENTS: 'prevents',
  RELATED_TO: 'related_to',
  EVOLVED_FROM: 'evolved_from',
  DEPENDS_ON: 'depends_on',
  CONFLICTS_WITH: 'conflicts_with',
});

const DEFAULT_SEED_BUDGET = 5;
const DEFAULT_NEIGHBOR_FANOUT = 3;
const DEFAULT_MAX_DEPTH = 2;

function createMemoryLink(sourceId, targetId, edgeType, metadata = {}) {
  if (!Object.values(EDGE_TYPES).includes(edgeType)) {
    throw new Error(`Invalid edge type: ${edgeType}. Must be one of: ${Object.values(EDGE_TYPES).join(', ')}`);
  }

  return {
    sourceId: String(sourceId),
    targetId: String(targetId),
    edgeType,
    weight: Number.isFinite(metadata.weight) ? metadata.weight : 1.0,
    reason: metadata.reason || '',
    createdAt: metadata.createdAt || new Date().toISOString(),
  };
}

function buildAdjacencyIndex(links) {
  const index = new Map();

  for (const link of links) {
    if (!index.has(link.sourceId)) {
      index.set(link.sourceId, []);
    }
    index.get(link.sourceId).push({
      targetId: link.targetId,
      edgeType: link.edgeType,
      weight: link.weight,
    });

    if (!index.has(link.targetId)) {
      index.set(link.targetId, []);
    }
    index.get(link.targetId).push({
      targetId: link.sourceId,
      edgeType: link.edgeType,
      weight: link.weight,
    });
  }

  return index;
}

function selectSeeds(scoredEntries, budget) {
  const effectiveBudget = Number.isFinite(budget) && budget > 0
    ? budget
    : DEFAULT_SEED_BUDGET;

  return scoredEntries
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, effectiveBudget);
}

function expandNeighbors(seedIds, adjacencyIndex, options = {}) {
  const fanout = options.fanout || DEFAULT_NEIGHBOR_FANOUT;
  const maxDepth = options.maxDepth || DEFAULT_MAX_DEPTH;
  const edgeFilter = options.edgeFilter || null;

  const visited = new Set(seedIds);
  const neighbors = [];
  let frontier = [...seedIds];
  let depth = 0;

  while (frontier.length > 0 && depth < maxDepth) {
    const nextFrontier = [];
    depth += 1;

    for (const nodeId of frontier) {
      const edges = adjacencyIndex.get(nodeId) || [];
      const filteredEdges = edgeFilter
        ? edges.filter(e => edgeFilter.includes(e.edgeType))
        : edges;

      const sortedEdges = filteredEdges
        .filter(e => !visited.has(e.targetId))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, fanout);

      for (const edge of sortedEdges) {
        if (!visited.has(edge.targetId)) {
          visited.add(edge.targetId);
          neighbors.push({
            id: edge.targetId,
            reachedFrom: nodeId,
            edgeType: edge.edgeType,
            weight: edge.weight,
            depth,
            isNeighbor: true,
          });
          nextFrontier.push(edge.targetId);
        }
      }
    }

    frontier = nextFrontier;
  }

  return neighbors;
}

function graphLinkedRetrieval(scoredEntries, links, options = {}) {
  const seedBudget = options.seedBudget || DEFAULT_SEED_BUDGET;
  const neighborFanout = options.neighborFanout || DEFAULT_NEIGHBOR_FANOUT;
  const maxDepth = options.maxDepth || DEFAULT_MAX_DEPTH;
  const edgeFilter = options.edgeFilter || null;

  const seeds = selectSeeds(scoredEntries, seedBudget);
  const seedIds = seeds.map(s => s.id);

  if (links.length === 0) {
    return {
      seeds,
      neighbors: [],
      allIds: seedIds,
      stats: {
        seedCount: seeds.length,
        neighborCount: 0,
        totalCount: seeds.length,
        maxDepthReached: 0,
      },
    };
  }

  const adjacencyIndex = buildAdjacencyIndex(links);
  const neighbors = expandNeighbors(seedIds, adjacencyIndex, {
    fanout: neighborFanout,
    maxDepth,
    edgeFilter,
  });

  const allIds = [...seedIds, ...neighbors.map(n => n.id)];
  const maxDepthReached = neighbors.length > 0
    ? Math.max(...neighbors.map(n => n.depth))
    : 0;

  return {
    seeds,
    neighbors,
    allIds,
    stats: {
      seedCount: seeds.length,
      neighborCount: neighbors.length,
      totalCount: allIds.length,
      maxDepthReached,
    },
  };
}

module.exports = {
  EDGE_TYPES,
  createMemoryLink,
  buildAdjacencyIndex,
  selectSeeds,
  expandNeighbors,
  graphLinkedRetrieval,
  DEFAULT_SEED_BUDGET,
  DEFAULT_NEIGHBOR_FANOUT,
  DEFAULT_MAX_DEPTH,
};
