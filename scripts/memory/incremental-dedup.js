#!/usr/bin/env node
'use strict';

/**
 * Phase 2.4 - Incremental Dedup and Reindexing
 * Source: memsearch
 *
 * Composite content hashes, skip unchanged chunks,
 * delete stale chunks when source changes,
 * per-workspace collection isolation.
 */

const crypto = require('crypto');

function computeContentHash(source, lineRange, content, embeddingModel) {
  const input = [
    String(source || ''),
    String(lineRange || ''),
    String(content || ''),
    String(embeddingModel || 'default'),
  ].join('::');

  return crypto.createHash('sha256').update(input).digest('hex');
}

function computeChunkId(hash) {
  return `chunk-${hash.slice(0, 16)}`;
}

function findDuplicates(existingChunks, newChunks) {
  const existingHashes = new Set(existingChunks.map(c => c.contentHash));
  const duplicates = [];
  const unique = [];

  for (const chunk of newChunks) {
    if (existingHashes.has(chunk.contentHash)) {
      duplicates.push(chunk);
    } else {
      unique.push(chunk);
    }
  }

  return { duplicates, unique };
}

function findStaleChunks(existingChunks, currentSourceHashes) {
  const currentSet = new Set(currentSourceHashes);
  return existingChunks.filter(chunk => !currentSet.has(chunk.contentHash));
}

function createChunkRecord(source, lineRange, content, embeddingModel) {
  const contentHash = computeContentHash(source, lineRange, content, embeddingModel);
  return {
    id: computeChunkId(contentHash),
    source,
    lineRange,
    content,
    contentHash,
    embeddingModel: embeddingModel || 'default',
    createdAt: new Date().toISOString(),
  };
}

function planIncrementalUpdate(existingChunks, newChunks) {
  const { duplicates, unique: toInsert } = findDuplicates(existingChunks, newChunks);
  const newHashes = new Set(newChunks.map(c => c.contentHash));
  const toDelete = existingChunks.filter(c => !newHashes.has(c.contentHash));

  return {
    toInsert,
    toDelete,
    skipped: duplicates,
    stats: {
      existingCount: existingChunks.length,
      newCount: newChunks.length,
      insertCount: toInsert.length,
      deleteCount: toDelete.length,
      skippedCount: duplicates.length,
      churnRate: existingChunks.length > 0
        ? Math.round(((toInsert.length + toDelete.length) / existingChunks.length) * 100) / 100
        : toInsert.length > 0 ? 1 : 0,
    },
  };
}

function buildWorkspaceCollectionId(workspaceRoot) {
  const normalized = String(workspaceRoot || '')
    .replace(/\\/g, '/')
    .replace(/\/+$/, '')
    .toLowerCase();
  const hash = crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 12);
  return `ws-${hash}`;
}

module.exports = {
  computeContentHash,
  computeChunkId,
  findDuplicates,
  findStaleChunks,
  createChunkRecord,
  planIncrementalUpdate,
  buildWorkspaceCollectionId,
};
