#!/usr/bin/env node
'use strict';

/**
 * Phase 2.2A - Context Window Budget Tracking
 * Source: critique update, Claude Flow Context Autopilot prior art
 *
 * Proactive context tracking that warns at 70% and triggers
 * aggressive compression/retrieval narrowing at 85%.
 * Budget telemetry is written to governance logs and quality telemetry.
 */

const { appendGovernanceEvent } = require('../lib/governance-log');
const { writeQualityTelemetry } = require('../quality/telemetry-writer');
const { loadControlPlane, getRepoRoot } = require('../lib/fulcrum-control');

const DEFAULT_MAX_TOKENS = 200000;
const WARNING_THRESHOLD = 0.70;
const CRITICAL_THRESHOLD = 0.85;

function estimateTokenCount(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  return Math.ceil(text.length / 4);
}

function computeBudgetStatus(estimatedTokens, maxTokens) {
  const safeMax = Number.isFinite(maxTokens) && maxTokens > 0
    ? maxTokens
    : DEFAULT_MAX_TOKENS;

  const utilization = estimatedTokens / safeMax;

  let level = 'normal';
  if (utilization >= CRITICAL_THRESHOLD) {
    level = 'critical';
  } else if (utilization >= WARNING_THRESHOLD) {
    level = 'warning';
  }

  return {
    estimatedTokens,
    maxTokens: safeMax,
    utilization: Math.round(utilization * 10000) / 10000,
    utilizationPercent: Math.round(utilization * 100),
    level,
    warningThreshold: WARNING_THRESHOLD,
    criticalThreshold: CRITICAL_THRESHOLD,
  };
}

function buildRecommendations(status) {
  const recommendations = [];

  if (status.level === 'critical') {
    recommendations.push('Trigger aggressive compression of pending observations');
    recommendations.push('Narrow retrieval budget to summary-only mode');
    recommendations.push('Skip expand/drill_in retrieval until after compaction');
    recommendations.push('Consider session checkpoint and compaction');
  } else if (status.level === 'warning') {
    recommendations.push('Reduce retrieval expansion depth');
    recommendations.push('Prefer summary mode over full content retrieval');
    recommendations.push('Queue non-essential observations for batch processing');
  }

  return recommendations;
}

async function trackContextBudget(input = {}, options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();
  const controlPlane = loadControlPlane(repoRoot);
  const maxTokens = controlPlane.contextBudget?.maxTokens || DEFAULT_MAX_TOKENS;

  const promptTokens = estimateTokenCount(input.prompt || input.user_prompt || '');
  const toolResultTokens = estimateTokenCount(input.tool_result || '');
  const contextTokens = Number.isFinite(input.estimated_context_tokens)
    ? input.estimated_context_tokens
    : 0;

  const totalEstimated = promptTokens + toolResultTokens + contextTokens;
  const status = computeBudgetStatus(totalEstimated, maxTokens);
  const recommendations = buildRecommendations(status);

  const result = {
    ...status,
    promptTokens,
    toolResultTokens,
    contextTokens,
    recommendations,
  };

  if (status.level !== 'normal') {
    await appendGovernanceEvent({
      eventType: 'context_budget_alert',
      decision: status.level === 'critical' ? 'compress' : 'warn',
      reason: `Context at ${status.utilizationPercent}% (${status.level})`,
      sessionId: input.session_id || input.sessionId || null,
      artifactRef: { type: 'context_budget', level: status.level },
      payload: {
        utilization: status.utilization,
        estimatedTokens: totalEstimated,
        maxTokens: status.maxTokens,
      },
    }, { repoRoot });

    writeQualityTelemetry({
      event_type: 'context_budget_alert',
      level: status.level,
      utilization: status.utilization,
      estimated_tokens: totalEstimated,
      max_tokens: status.maxTokens,
    }, repoRoot);
  }

  return result;
}

module.exports = {
  estimateTokenCount,
  computeBudgetStatus,
  buildRecommendations,
  trackContextBudget,
  DEFAULT_MAX_TOKENS,
  WARNING_THRESHOLD,
  CRITICAL_THRESHOLD,
};
