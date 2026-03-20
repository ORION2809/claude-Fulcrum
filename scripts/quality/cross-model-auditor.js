#!/usr/bin/env node
'use strict';

/**
 * Phase 4.4 - Cross-Model Auditor
 * Source: awesome-claude-code-toolkit (doublecheck skill)
 *
 * Three-layer verification pipeline at stop/merge boundary:
 *   Layer 1: Self-Audit — extract claims from changes, check internal consistency
 *   Layer 2: Source Verification — verify against test results, quality scores, diffs
 *   Layer 3: Adversarial Review — 7 hallucination patterns from doublecheck
 *
 * Optional external model call via FULCRUM_AUDITOR_ENDPOINT env var.
 * Blocks only on critical findings. Writes append-only governance events.
 */

const { appendGovernanceEvent } = require('../lib/governance-log');
const { loadControlPlane, getRepoRoot } = require('../lib/fulcrum-control');

const AUDIT_DECISION = Object.freeze({
  PASS: 'pass',
  WARN: 'warn',
  BLOCK: 'block',
});

/** Source: doublecheck SKILL.md — 5-level confidence rating */
const CONFIDENCE_RATING = Object.freeze({
  VERIFIED: 'verified',
  PLAUSIBLE: 'plausible',
  UNVERIFIED: 'unverified',
  DISPUTED: 'disputed',
  FABRICATION_RISK: 'fabrication_risk',
});

/** Source: doublecheck SKILL.md — 7 common hallucination patterns */
const HALLUCINATION_PATTERNS = Object.freeze([
  { id: 'fabricated_refs', label: 'Fabricated references', check: 'References to files, functions, or APIs that do not exist in the codebase' },
  { id: 'precise_without_source', label: 'Precise numbers without source', check: 'Specific metrics or percentages claimed without measurement evidence' },
  { id: 'confident_on_uncertain', label: 'Confident specificity on uncertain topics', check: 'Exact claims about behavior that requires runtime testing' },
  { id: 'wrong_attribution', label: 'Plausible-but-wrong associations', check: 'Attributing behavior to wrong module, function, or dependency' },
  { id: 'temporal_confusion', label: 'Temporal confusion', check: 'Outdated patterns presented as current, wrong version assumptions' },
  { id: 'overgeneralization', label: 'Overgeneralization', check: 'Universal claims when only applicable in specific contexts' },
  { id: 'missing_qualifiers', label: 'Missing qualifiers', check: 'Nuanced behavior presented as absolute without edge case acknowledgment' },
]);

function buildAuditRequest(changes, options = {}) {
  const files = (changes.files || []).map(f => ({
    path: f.path,
    action: f.action || 'modified',
    linesChanged: f.linesChanged || 0,
    contentSnippet: (f.content || '').slice(0, 2000),
  }));

  return {
    requestId: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    boundary: options.boundary || 'stop',
    reviewerModel: options.reviewerModel || 'self',
    files,
    testSummary: changes.testSummary || null,
    qualityScore: changes.qualityScore || null,
    sessionId: options.sessionId || null,
    attemptId: options.attemptId || null,
  };
}

/**
 * Layer 1: Self-Audit — extract claims from code changes and check consistency.
 * Source: doublecheck Layer 1 (claim extraction + internal consistency).
 */
function selfAudit(auditRequest) {
  const findings = [];
  const files = auditRequest.files || [];

  for (const file of files) {
    const snippet = file.contentSnippet || '';

    // Check: file has changes but no content evidence
    if (file.linesChanged > 0 && snippet.length === 0) {
      findings.push({
        severity: 'medium',
        pattern: 'fabricated_refs',
        message: `${file.path}: ${file.linesChanged} lines changed but no content evidence provided`,
        confidence: CONFIDENCE_RATING.UNVERIFIED,
      });
    }

    // Check: large change with no test coverage mentioned
    if (file.linesChanged > 100 && !auditRequest.testSummary) {
      findings.push({
        severity: 'high',
        pattern: 'missing_qualifiers',
        message: `${file.path}: ${file.linesChanged} lines changed with no test summary`,
        confidence: CONFIDENCE_RATING.DISPUTED,
      });
    }

    // Check: TODO/FIXME/HACK left in changed code
    const todoMatches = snippet.match(/\b(TODO|FIXME|HACK|XXX)\b/gi);
    if (todoMatches) {
      findings.push({
        severity: 'medium',
        pattern: 'missing_qualifiers',
        message: `${file.path}: contains ${todoMatches.length} unresolved marker(s): ${todoMatches.join(', ')}`,
        confidence: CONFIDENCE_RATING.PLAUSIBLE,
      });
    }
  }

  return findings;
}

/**
 * Layer 2: Source Verification — cross-check against test results and quality.
 * Source: doublecheck Layer 2 (formulate queries, evaluate sources).
 */
function sourceVerification(auditRequest) {
  const findings = [];

  // Verify test summary consistency
  if (auditRequest.testSummary) {
    const ts = auditRequest.testSummary;

    if (ts.failures > 0) {
      findings.push({
        severity: 'critical',
        pattern: 'confident_on_uncertain',
        message: `Test suite has ${ts.failures} failure(s) — changes may be incomplete`,
        confidence: CONFIDENCE_RATING.DISPUTED,
      });
    }

    if (ts.skipped > 0 && ts.skipped > ts.passed * 0.1) {
      findings.push({
        severity: 'high',
        pattern: 'overgeneralization',
        message: `${ts.skipped} tests skipped (>${Math.round(ts.skipped / (ts.passed + ts.skipped) * 100)}% skip rate)`,
        confidence: CONFIDENCE_RATING.UNVERIFIED,
      });
    }
  }

  // Verify quality score
  if (auditRequest.qualityScore !== null && auditRequest.qualityScore !== undefined) {
    if (auditRequest.qualityScore < 0.5) {
      findings.push({
        severity: 'critical',
        pattern: 'confident_on_uncertain',
        message: `Quality score ${auditRequest.qualityScore.toFixed(2)} is below minimum threshold (0.5)`,
        confidence: CONFIDENCE_RATING.VERIFIED,
      });
    } else if (auditRequest.qualityScore < 0.7) {
      findings.push({
        severity: 'high',
        pattern: 'missing_qualifiers',
        message: `Quality score ${auditRequest.qualityScore.toFixed(2)} is below recommended threshold (0.7)`,
        confidence: CONFIDENCE_RATING.VERIFIED,
      });
    }
  }

  return findings;
}

/**
 * Layer 3: Adversarial Review — apply 7 hallucination patterns.
 * Source: doublecheck Layer 3 (hallucination checklist + adversarial questions).
 */
function adversarialReview(auditRequest) {
  const findings = [];
  const files = auditRequest.files || [];
  const allContent = files.map(f => f.contentSnippet || '').join('\n');

  // Pattern: fabricated references — imports that reference non-existent paths
  const requireMatches = allContent.match(/require\(['"][^'"]+['"]\)/g) || [];
  const importMatches = allContent.match(/from\s+['"][^'"]+['"]/g) || [];
  const totalRefs = requireMatches.length + importMatches.length;
  if (totalRefs > 20) {
    findings.push({
      severity: 'medium',
      pattern: 'fabricated_refs',
      message: `${totalRefs} import/require statements — verify all paths exist`,
      confidence: CONFIDENCE_RATING.PLAUSIBLE,
    });
  }

  // Pattern: confident specificity — hardcoded magic numbers
  const magicNumbers = allContent.match(/(?<![.\w])\d{4,}(?![.\w])/g) || [];
  if (magicNumbers.length > 5) {
    findings.push({
      severity: 'medium',
      pattern: 'precise_without_source',
      message: `${magicNumbers.length} large numeric literals — verify these are intentional constants`,
      confidence: CONFIDENCE_RATING.UNVERIFIED,
    });
  }

  // Pattern: temporal confusion — deprecated API usage indicators
  const deprecatedPatterns = allContent.match(/\b(deprecated|legacy|obsolete|old_api)\b/gi) || [];
  if (deprecatedPatterns.length > 0) {
    findings.push({
      severity: 'high',
      pattern: 'temporal_confusion',
      message: `${deprecatedPatterns.length} deprecated/legacy reference(s) in changed code`,
      confidence: CONFIDENCE_RATING.PLAUSIBLE,
    });
  }

  return findings;
}

/**
 * Optional: Call external model for cross-verification.
 * Source: doublecheck concept — external source verification.
 * Uses FULCRUM_AUDITOR_ENDPOINT env var (OpenAI-compatible API).
 */
async function callExternalAuditor(auditRequest) {
  const endpoint = process.env.FULCRUM_AUDITOR_ENDPOINT;
  const apiKey = process.env.FULCRUM_AUDITOR_API_KEY;

  if (!endpoint || !apiKey) {
    return null; // External auditor not configured — skip
  }

  const prompt = [
    'You are a code review auditor. Review these changes and report findings.',
    'For each finding, respond with JSON: { severity: "critical"|"high"|"medium"|"low", message: "...", pattern: "..." }',
    'Files changed:',
    ...auditRequest.files.map(f => `- ${f.path} (${f.action}, ${f.linesChanged} lines): ${f.contentSnippet.slice(0, 500)}`),
    auditRequest.testSummary ? `Test results: ${JSON.stringify(auditRequest.testSummary)}` : '',
  ].filter(Boolean).join('\n');

  try {
    const { default: fetch } = await import('node-fetch').catch(() => ({ default: globalThis.fetch }));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: auditRequest.reviewerModel !== 'self' ? auditRequest.reviewerModel : 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 1000,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON findings from response
    const jsonMatches = content.match(/\{[^{}]*"severity"[^{}]*\}/g) || [];
    return jsonMatches.map(match => {
      try {
        const parsed = JSON.parse(match);
        return {
          severity: ['critical', 'high', 'medium', 'low'].includes(parsed.severity) ? parsed.severity : 'medium',
          message: String(parsed.message || 'External auditor finding').slice(0, 500),
          pattern: String(parsed.pattern || 'external_review').slice(0, 100),
          confidence: CONFIDENCE_RATING.VERIFIED,
          source: 'external_model',
        };
      } catch {
        return null;
      }
    }).filter(Boolean);
  } catch {
    return null; // External call failed — continue with self-verification
  }
}

function evaluateAuditFindings(findings = []) {
  const critical = findings.filter(f => f.severity === 'critical');
  const high = findings.filter(f => f.severity === 'high');
  const medium = findings.filter(f => f.severity === 'medium');

  let decision = AUDIT_DECISION.PASS;
  let reason = 'No critical findings';

  if (critical.length > 0) {
    decision = AUDIT_DECISION.BLOCK;
    reason = `${critical.length} critical finding(s): ${critical.map(f => f.message).join('; ')}`;
  } else if (high.length >= 3) {
    decision = AUDIT_DECISION.WARN;
    reason = `${high.length} high-severity findings detected`;
  } else if (high.length > 0) {
    decision = AUDIT_DECISION.WARN;
    reason = `${high.length} high-severity finding(s): review recommended`;
  }

  // Source: doublecheck auto-escalation — any DISPUTED or FABRICATION_RISK → escalate
  const disputed = findings.filter(f =>
    f.confidence === CONFIDENCE_RATING.DISPUTED || f.confidence === CONFIDENCE_RATING.FABRICATION_RISK
  );
  if (disputed.length > 0 && decision === AUDIT_DECISION.PASS) {
    decision = AUDIT_DECISION.WARN;
    reason = `${disputed.length} finding(s) with disputed/fabrication-risk confidence`;
  }

  return {
    decision,
    reason,
    summary: {
      critical: critical.length,
      high: high.length,
      medium: medium.length,
      total: findings.length,
    },
  };
}

/**
 * Run 3-layer verification pipeline + optional external model.
 * Source: doublecheck skill (Layer 1→2→3 + auto-escalation).
 */
async function runCrossModelAudit(changes, precomputedFindings = [], options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();
  const controlPlane = loadControlPlane(repoRoot);

  const enabled = controlPlane.crossModelAudit?.enabled !== false;
  if (!enabled && !options.force) {
    return {
      skipped: true,
      reason: 'Cross-model audit disabled in control plane',
    };
  }

  const auditRequest = buildAuditRequest(changes, options);

  // Three-layer verification pipeline (from doublecheck)
  const layer1 = selfAudit(auditRequest);
  const layer2 = sourceVerification(auditRequest);
  const layer3 = adversarialReview(auditRequest);

  // Optional external model call
  const externalFindings = await callExternalAuditor(auditRequest);

  const allFindings = [
    ...precomputedFindings,
    ...layer1.map(f => ({ ...f, layer: 'self_audit' })),
    ...layer2.map(f => ({ ...f, layer: 'source_verification' })),
    ...layer3.map(f => ({ ...f, layer: 'adversarial_review' })),
    ...(externalFindings || []).map(f => ({ ...f, layer: 'external_model' })),
  ];

  const evaluation = evaluateAuditFindings(allFindings);

  const result = {
    ...auditRequest,
    ...evaluation,
    findings: allFindings,
    layers: {
      selfAudit: layer1.length,
      sourceVerification: layer2.length,
      adversarialReview: layer3.length,
      externalModel: externalFindings ? externalFindings.length : null,
    },
    auditedAt: new Date().toISOString(),
  };

  await appendGovernanceEvent({
    eventType: 'cross_model_audit',
    decision: evaluation.decision,
    reason: evaluation.reason,
    sessionId: options.sessionId || null,
    attemptId: options.attemptId || null,
    artifactRef: {
      type: 'cross_model_audit',
      requestId: auditRequest.requestId,
      boundary: auditRequest.boundary,
    },
    payload: {
      reviewerModel: auditRequest.reviewerModel,
      findings: evaluation.summary,
      decision: evaluation.decision,
      layers: result.layers,
    },
  }, { repoRoot });

  return result;
}

module.exports = {
  AUDIT_DECISION,
  CONFIDENCE_RATING,
  HALLUCINATION_PATTERNS,
  buildAuditRequest,
  selfAudit,
  sourceVerification,
  adversarialReview,
  callExternalAuditor,
  evaluateAuditFindings,
  runCrossModelAudit,
};
