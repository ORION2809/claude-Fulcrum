#!/usr/bin/env node
'use strict';

/**
 * Phase 5.5 - Queueing, Retry, and Reset
 * Source: vibe-kanban
 *
 * Queue follow-up actions while an attempt is still running.
 * Two recovery modes:
 * - retry: replay from checkpoint within current attempt
 * - reset: discard selected processes, optionally reset git state
 */

const path = require('path');
const fs = require('fs');
const { appendGovernanceEvent } = require('../lib/governance-log');
const { loadControlPlane, getRepoRoot, createStableId } = require('../lib/fulcrum-control');

const ACTION_STATUS = Object.freeze({
  QUEUED: 'queued',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  KILLED: 'killed',   // Source: vibe-kanban ExecutionProcessStatus::Killed
  SKIPPED: 'skipped',
});

const RECOVERY_MODE = Object.freeze({
  RETRY: 'retry',
  RESET: 'reset',
});

function createQueuedAction(description, options = {}) {
  return {
    id: createStableId('action', `${Date.now()}-${description}`),
    description: String(description),
    status: ACTION_STATUS.QUEUED,
    priority: Number.isFinite(options.priority) ? options.priority : 0,
    attemptId: options.attemptId || null,
    sessionId: options.sessionId || null,
    dependsOn: options.dependsOn || [],
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    result: null,
    retryCount: 0,
    maxRetries: Number.isFinite(options.maxRetries) ? options.maxRetries : 3,
  };
}

function enqueueAction(queue, action) {
  const inserted = [...queue, action].sort((a, b) => b.priority - a.priority);
  return inserted;
}

function claimNextAction(queue) {
  const ready = queue.find(a =>
    a.status === ACTION_STATUS.QUEUED &&
    a.dependsOn.every(depId =>
      queue.find(q => q.id === depId && q.status === ACTION_STATUS.COMPLETED)
    )
  );

  if (!ready) {
    return { queue, claimed: null };
  }

  const updatedQueue = queue.map(a =>
    a.id === ready.id
      ? { ...a, status: ACTION_STATUS.IN_PROGRESS, startedAt: new Date().toISOString() }
      : a
  );

  return {
    queue: updatedQueue,
    claimed: { ...ready, status: ACTION_STATUS.IN_PROGRESS, startedAt: new Date().toISOString() },
  };
}

function completeAction(queue, actionId, result) {
  return queue.map(a =>
    a.id === actionId
      ? {
        ...a,
        status: result.success ? ACTION_STATUS.COMPLETED : ACTION_STATUS.FAILED,
        completedAt: new Date().toISOString(),
        result,
      }
      : a
  );
}

function retryAction(queue, actionId) {
  return queue.map(a => {
    if (a.id !== actionId) return a;
    if (a.retryCount >= a.maxRetries) {
      return { ...a, status: ACTION_STATUS.SKIPPED, result: { reason: 'Max retries exceeded' } };
    }
    return {
      ...a,
      status: ACTION_STATUS.QUEUED,
      retryCount: a.retryCount + 1,
      startedAt: null,
      completedAt: null,
      result: null,
    };
  });
}

function buildRetryPlan(queue, checkpointId) {
  const checkpoint = queue.find(a => a.id === checkpointId);
  if (!checkpoint) {
    return { valid: false, reason: 'Checkpoint action not found' };
  }

  const checkpointIndex = queue.indexOf(checkpoint);
  const toRetry = queue.slice(checkpointIndex).filter(a =>
    a.status === ACTION_STATUS.FAILED || a.status === ACTION_STATUS.IN_PROGRESS
  );

  return {
    valid: true,
    mode: RECOVERY_MODE.RETRY,
    checkpointId,
    actionsToRetry: toRetry.map(a => a.id),
    preserveState: true,
  };
}

function buildResetPlan(queue, fromActionId, options = {}) {
  const fromAction = queue.find(a => a.id === fromActionId);
  if (!fromAction) {
    return { valid: false, reason: 'Action not found' };
  }

  const fromIndex = queue.indexOf(fromAction);
  const toDiscard = queue.slice(fromIndex);

  return {
    valid: true,
    mode: RECOVERY_MODE.RESET,
    fromActionId,
    actionsToDiscard: toDiscard.map(a => a.id),
    resetGitState: Boolean(options.resetGitState),
    gitRef: options.gitRef || null,
  };
}

function applyRetryPlan(queue, plan) {
  if (!plan.valid) return queue;

  return queue.map(a =>
    plan.actionsToRetry.includes(a.id)
      ? {
        ...a,
        status: ACTION_STATUS.QUEUED,
        retryCount: a.retryCount + 1,
        startedAt: null,
        completedAt: null,
        result: null,
      }
      : a
  );
}

/**
 * Source: vibe-kanban reset_session_to_process — soft-delete pattern.
 * Marks discarded actions as KILLED (not hard-deleted), preserving audit trail.
 * Optionally resets git state to a target ref.
 */
function applyResetPlan(queue, plan) {
  if (!plan.valid) return queue;

  const discardSet = new Set(plan.actionsToDiscard || []);

  return queue.map(a => {
    if (!discardSet.has(a.id)) return a;

    // Source: vibe-kanban ExecutionProcess::drop_at_and_after — soft-delete
    return {
      ...a,
      status: a.status === ACTION_STATUS.IN_PROGRESS
        ? ACTION_STATUS.KILLED   // running → killed (vibe-kanban pattern)
        : a.status === ACTION_STATUS.COMPLETED
          ? a.status             // completed stays completed
          : ACTION_STATUS.SKIPPED,
      dropped: true,
      droppedAt: new Date().toISOString(),
      result: a.result || { reason: `Reset from ${plan.fromActionId}` },
    };
  });
}

/**
 * Source: vibe-kanban reset_session_to_process step 4 — kill running processes.
 * Transitions all IN_PROGRESS actions to KILLED.
 */
function killRunningActions(queue) {
  return queue.map(a =>
    a.status === ACTION_STATUS.IN_PROGRESS
      ? {
        ...a,
        status: ACTION_STATUS.KILLED,
        completedAt: new Date().toISOString(),
        result: { reason: 'Killed by reset operation' },
      }
      : a
  );
}

/**
 * Source: vibe-kanban reconcile_worktree_to_commit
 * Attempts git reset to target ref. Returns outcome for governance logging.
 */
function resetGitState(plan, options = {}) {
  if (!plan.resetGitState || !plan.gitRef) {
    return { performed: false, reason: 'Git reset not requested or no ref provided' };
  }

  const { execSync } = require('child_process');
  const repoRoot = options.repoRoot || process.cwd();

  try {
    // Compare current HEAD with target
    const currentHead = execSync('git rev-parse HEAD', {
      cwd: repoRoot, encoding: 'utf8', timeout: 10000,
    }).trim();

    if (currentHead === plan.gitRef) {
      return { performed: false, reason: 'Already at target ref', currentHead };
    }

    // Source: vibe-kanban reconcile_worktree_to_commit — git reset --hard
    execSync(`git reset --hard ${plan.gitRef}`, {
      cwd: repoRoot, encoding: 'utf8', timeout: 30000,
    });

    const newHead = execSync('git rev-parse HEAD', {
      cwd: repoRoot, encoding: 'utf8', timeout: 10000,
    }).trim();

    return {
      performed: true,
      previousHead: currentHead,
      newHead,
      targetRef: plan.gitRef,
    };
  } catch (err) {
    return {
      performed: false,
      reason: `Git reset failed: ${err.message}`,
      targetRef: plan.gitRef,
    };
  }
}

function getQueueStats(queue) {
  return {
    total: queue.length,
    queued: queue.filter(a => a.status === ACTION_STATUS.QUEUED).length,
    inProgress: queue.filter(a => a.status === ACTION_STATUS.IN_PROGRESS).length,
    completed: queue.filter(a => a.status === ACTION_STATUS.COMPLETED).length,
    failed: queue.filter(a => a.status === ACTION_STATUS.FAILED).length,
    killed: queue.filter(a => a.status === ACTION_STATUS.KILLED).length,
    skipped: queue.filter(a => a.status === ACTION_STATUS.SKIPPED).length,
    dropped: queue.filter(a => a.dropped).length,
    active: queue.filter(a => !a.dropped).length,
  };
}

async function logRecoveryEvent(plan, options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();

  await appendGovernanceEvent({
    eventType: `recovery_${plan.mode}`,
    decision: 'executed',
    reason: `${plan.mode} from ${plan.checkpointId || plan.fromActionId}`,
    sessionId: options.sessionId || null,
    attemptId: options.attemptId || null,
    artifactRef: {
      type: 'recovery_plan',
      mode: plan.mode,
      actionCount: (plan.actionsToRetry || plan.actionsToDiscard || []).length,
    },
  }, { repoRoot });
}

module.exports = {
  ACTION_STATUS,
  RECOVERY_MODE,
  createQueuedAction,
  enqueueAction,
  claimNextAction,
  completeAction,
  retryAction,
  buildRetryPlan,
  buildResetPlan,
  applyRetryPlan,
  applyResetPlan,
  killRunningActions,
  resetGitState,
  getQueueStats,
  logRecoveryEvent,
};
