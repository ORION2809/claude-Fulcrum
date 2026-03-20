'use strict';

const fs = require('fs');
const path = require('path');

const { createStateStore } = require('./state-store');
const {
  createStableId,
  ensureControlPlaneDirs,
  getGovernanceLogPath,
  getPlatformName,
  getRepoRoot,
  hashValue,
  loadControlPlane,
} = require('./fulcrum-control');

function normalizeGovernanceEvent(event, repoRoot = getRepoRoot()) {
  const controlPlane = loadControlPlane(repoRoot);
  const timestamp = event.timestamp || new Date().toISOString();
  const serializedArtifactRef = event.artifactRef ? JSON.stringify(event.artifactRef) : '';

  return {
    eventId: event.eventId || createStableId('gov', `${timestamp}:${event.eventType}:${event.sessionId || ''}:${serializedArtifactRef}`),
    timestamp,
    platform: event.platform || getPlatformName(),
    repo: event.repo || path.basename(repoRoot),
    attemptId: event.attemptId || null,
    sessionId: event.sessionId || null,
    eventType: event.eventType,
    decision: event.decision || 'recorded',
    reason: event.reason || '',
    policyBundleHash: event.policyBundleHash || hashValue(JSON.stringify(controlPlane.policyBundles || {})),
    artifactRef: event.artifactRef || null,
    payload: event.payload || null,
  };
}

async function appendGovernanceEvent(event, options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();
  const normalized = normalizeGovernanceEvent(event, repoRoot);
  ensureControlPlaneDirs(repoRoot);

  const logPath = getGovernanceLogPath(repoRoot);
  fs.appendFileSync(logPath, `${JSON.stringify(normalized)}\n`, 'utf8');

  const store = await createStateStore({
    dbPath: options.dbPath,
    homeDir: process.env.HOME,
  });

  try {
    store.insertGovernanceEvent({
      id: normalized.eventId,
      sessionId: normalized.sessionId,
      eventType: normalized.eventType,
      payload: {
        decision: normalized.decision,
        reason: normalized.reason,
        platform: normalized.platform,
        repo: normalized.repo,
        attemptId: normalized.attemptId,
        policyBundleHash: normalized.policyBundleHash,
        artifactRef: normalized.artifactRef,
        payload: normalized.payload,
      },
      resolvedAt: null,
      resolution: null,
      createdAt: normalized.timestamp,
    });
  } finally {
    store.close();
  }

  return normalized;
}

module.exports = {
  appendGovernanceEvent,
  normalizeGovernanceEvent,
};
