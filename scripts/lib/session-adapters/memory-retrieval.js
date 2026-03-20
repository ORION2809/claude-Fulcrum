'use strict';

const fs = require('fs');
const path = require('path');

const { buildSessionSnapshot } = require('../orchestration-session');
const { normalizeArtifactSessionSnapshot, persistCanonicalSnapshot } = require('./canonical-session');

function isMemoryRetrievalTarget(target, cwd) {
  if (typeof target !== 'string' || target.length === 0) {
    return false;
  }

  if (target.startsWith('memory:')) {
    return true;
  }

  const absoluteTarget = path.resolve(cwd, target);
  return fs.existsSync(absoluteTarget)
    && fs.statSync(absoluteTarget).isDirectory()
    && path.basename(path.dirname(absoluteTarget)) === 'memory-retrieval';
}

function resolveMemoryRetrievalTarget(target, cwd) {
  if (target.startsWith('memory:')) {
    const requestId = target.slice('memory:'.length).trim();
    if (!requestId) {
      throw new Error('memory retrieval targets require a request id');
    }

    return {
      sessionName: requestId,
      coordinationDir: path.join(cwd, '.orchestration', 'memory-retrieval', requestId),
      repoRoot: cwd,
      sourceTarget: {
        type: 'memory-retrieval',
        value: requestId
      }
    };
  }

  const absoluteTarget = path.resolve(cwd, target);
  return {
    sessionName: path.basename(absoluteTarget),
    coordinationDir: absoluteTarget,
    repoRoot: cwd,
    sourceTarget: {
      type: 'memory-retrieval',
      value: absoluteTarget
    }
  };
}

function collectMemoryRetrievalSnapshot(target, cwd = process.cwd()) {
  const resolved = resolveMemoryRetrievalTarget(target, cwd);
  return {
    ...buildSessionSnapshot({
      sessionName: resolved.sessionName,
      coordinationDir: resolved.coordinationDir,
      panes: []
    }),
    repoRoot: resolved.repoRoot,
    targetType: 'memory-retrieval',
    sourceTarget: resolved.sourceTarget
  };
}

function createMemoryRetrievalAdapter(options = {}) {
  const collectMemoryRetrievalSnapshotImpl = options.collectMemoryRetrievalSnapshotImpl || collectMemoryRetrievalSnapshot;
  const persistCanonicalSnapshotImpl = options.persistCanonicalSnapshotImpl || persistCanonicalSnapshot;

  return {
    id: 'memory-retrieval',
    description: 'Inspect isolated memory-retrieval coordination artifacts',
    targetTypes: ['memory-retrieval'],
    canOpen(target, context = {}) {
      if (context.adapterId && context.adapterId !== 'memory-retrieval') {
        return false;
      }

      if (context.adapterId === 'memory-retrieval') {
        return true;
      }

      const cwd = context.cwd || process.cwd();
      return isMemoryRetrievalTarget(target, cwd);
    },
    open(target, context = {}) {
      const cwd = context.cwd || process.cwd();

      return {
        adapterId: 'memory-retrieval',
        getSnapshot() {
          const snapshot = collectMemoryRetrievalSnapshotImpl(target, cwd);
          const canonicalSnapshot = normalizeArtifactSessionSnapshot(snapshot, snapshot.sourceTarget, {
            adapterId: 'memory-retrieval',
            sessionKind: 'retrieval'
          });

          persistCanonicalSnapshotImpl(canonicalSnapshot, {
            loadStateStoreImpl: options.loadStateStoreImpl,
            persist: context.persistSnapshots !== false && options.persistSnapshots !== false,
            recordingDir: context.recordingDir || options.recordingDir,
            stateStore: options.stateStore
          });

          return canonicalSnapshot;
        }
      };
    }
  };
}

module.exports = {
  collectMemoryRetrievalSnapshot,
  createMemoryRetrievalAdapter,
  isMemoryRetrievalTarget,
  resolveMemoryRetrievalTarget
};
