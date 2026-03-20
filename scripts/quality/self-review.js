#!/usr/bin/env node
'use strict';

/**
 * Phase 4.5 - Self-Check Protocol and Self-Review Persona
 * Source: SuperClaude Framework (self_check.py, confidence.py)
 *
 * Dedicated verification step before task completion.
 * Protocol checklist + hallucination detection + weighted confidence scoring.
 * Required outputs: requirement match, tests/build status,
 * edge-case coverage, rollback/follow-up recommendation.
 */

const CHECKLIST_ITEMS = Object.freeze([
  { id: 'req_match', label: 'Requirements match', category: 'correctness' },
  { id: 'tests_pass', label: 'All tests pass', category: 'correctness' },
  { id: 'build_clean', label: 'Build is clean', category: 'correctness' },
  { id: 'no_regressions', label: 'No regressions introduced', category: 'correctness' },
  { id: 'edge_cases', label: 'Edge cases covered', category: 'robustness' },
  { id: 'error_handling', label: 'Error handling present', category: 'robustness' },
  { id: 'input_validation', label: 'Input validation at boundaries', category: 'security' },
  { id: 'no_secrets', label: 'No hardcoded secrets', category: 'security' },
  { id: 'code_readable', label: 'Code is readable and well-named', category: 'quality' },
  { id: 'no_dead_code', label: 'No dead code or debug artifacts', category: 'quality' },
  { id: 'docs_updated', label: 'Documentation updated if needed', category: 'quality' },
  { id: 'rollback_safe', label: 'Changes are safely reversible', category: 'operations' },
]);

/**
 * Source: SuperClaude Framework self_check.py - HALLUCINATION_RED_FLAGS
 * 7 red flags for detecting hallucinated completion claims.
 */
const HALLUCINATION_RED_FLAGS = Object.freeze([
  { id: 'tests_no_output', pattern: 'Claims tests pass without showing output' },
  { id: 'complete_no_evidence', pattern: 'Claims completion without evidence' },
  { id: 'complete_failing_tests', pattern: 'Claims completion despite failing tests' },
  { id: 'ignored_errors', pattern: 'Ignored errors on claimed completion' },
  { id: 'ignored_warnings', pattern: 'Ignored warnings on claimed completion' },
  { id: 'no_diff_evidence', pattern: 'File modifications claimed without diff evidence' },
  { id: 'uncertainty_language', pattern: 'Uncertainty language detected' },
]);

/**
 * Source: SuperClaude Framework self_check.py - uncertainty_words
 */
const UNCERTAINTY_WORDS = Object.freeze([
  'probably', 'maybe', 'should work', 'might work', 'i think',
  'likely works', 'seems to work', 'appears to',
]);

/**
 * Source: SuperClaude Framework confidence.py - weighted scoring
 * 5 checks summing to 1.0
 */
const CONFIDENCE_WEIGHTS = Object.freeze({
  noDuplicates: 0.25,
  architectureCompliance: 0.25,
  docsVerified: 0.20,
  ossImplementations: 0.15,
  rootCauseIdentified: 0.15,
});

const CONFIDENCE_THRESHOLDS = Object.freeze({
  high: 0.9,   // proceed with implementation
  medium: 0.7, // present alternatives
  // below 0.7 = low — STOP and request clarification
});

function createChecklistResult(itemId, passed, evidence) {
  const item = CHECKLIST_ITEMS.find(i => i.id === itemId);
  if (!item) {
    throw new Error(`Unknown checklist item: ${itemId}`);
  }

  return {
    ...item,
    passed: Boolean(passed),
    evidence: String(evidence || ''),
  };
}

function evaluateChecklist(results = []) {
  const evaluated = CHECKLIST_ITEMS.map(item => {
    const result = results.find(r => r.id === item.id);
    return result || { ...item, passed: false, evidence: 'Not evaluated' };
  });

  const passed = evaluated.filter(r => r.passed);
  const failed = evaluated.filter(r => !r.passed);
  const byCategory = {};

  for (const result of evaluated) {
    if (!byCategory[result.category]) {
      byCategory[result.category] = { passed: 0, failed: 0, items: [] };
    }
    byCategory[result.category].items.push(result);
    if (result.passed) {
      byCategory[result.category].passed += 1;
    } else {
      byCategory[result.category].failed += 1;
    }
  }

  const allPassed = failed.length === 0;
  const criticalFailed = failed.filter(f =>
    f.category === 'correctness' || f.category === 'security'
  );

  return {
    allPassed,
    passedCount: passed.length,
    failedCount: failed.length,
    totalCount: evaluated.length,
    passRate: Math.round((passed.length / evaluated.length) * 100),
    criticalFailures: criticalFailed,
    byCategory,
    items: evaluated,
  };
}

function generateSelfReviewPrompt(checklist, context = {}) {
  const failedItems = checklist.items
    .filter(i => !i.passed)
    .map(i => `- ${i.label}: ${i.evidence}`)
    .join('\n');

  const passedItems = checklist.items
    .filter(i => i.passed)
    .map(i => `- ${i.label}`)
    .join('\n');

  return {
    role: 'self-review',
    persona: 'Senior engineer performing final verification before task completion',
    context: {
      taskDescription: context.taskDescription || 'Task under review',
      filesChanged: context.filesChanged || [],
      testResults: context.testResults || null,
      qualityScore: context.qualityScore || null,
    },
    checklist: {
      passed: passedItems,
      failed: failedItems || '(none)',
      passRate: checklist.passRate,
    },
    requiredOutputs: [
      'requirement_match: Does the implementation match the original requirements?',
      'tests_build_status: Are all tests passing and build clean?',
      'edge_case_coverage: Are critical edge cases handled?',
      'rollback_recommendation: Is rollback needed or safe to proceed?',
      'follow_up_items: Any follow-up work needed?',
    ],
  };
}

function buildSelfReviewReport(checklist, review = {}) {
  const hallucinationFlags = review.hallucinationCheck
    ? review.hallucinationCheck.detected
    : [];

  return {
    timestamp: new Date().toISOString(),
    verdict: checklist.allPassed && !review.rollbackRecommended && hallucinationFlags.length === 0
      ? 'proceed'
      : checklist.criticalFailures.length > 0 || hallucinationFlags.length > 0
        ? 'block'
        : 'proceed_with_caution',
    checklist: {
      passRate: checklist.passRate,
      criticalFailures: checklist.criticalFailures.length,
      failedCount: checklist.failedCount,
    },
    review: {
      requirementMatch: review.requirementMatch || false,
      testsBuildStatus: review.testsBuildStatus || 'unknown',
      edgeCaseCoverage: review.edgeCaseCoverage || 'not assessed',
      rollbackRecommended: review.rollbackRecommended || false,
      followUpItems: review.followUpItems || [],
    },
    hallucinationFlags,
    confidence: review.confidence || null,
  };
}

/**
 * Source: SuperClaude Framework self_check.py - _detect_hallucinations
 * Detects 7 red flags for hallucinated claims.
 */
function detectHallucinations(impl = {}) {
  const detected = [];
  const description = String(impl.description || impl.summary || '').toLowerCase();

  // Red Flag 1: "Tests pass" without output
  if (impl.testsPassed && !impl.testOutput) {
    detected.push({
      flag: 'tests_no_output',
      message: 'Claims tests pass without showing output',
      severity: 'high',
    });
  }

  // Red Flag 2: "Everything works" / completion without evidence
  if (impl.status === 'complete' && !impl.evidence && !impl.codeChanges) {
    detected.push({
      flag: 'complete_no_evidence',
      message: 'Claims completion without evidence (no code changes or artifacts)',
      severity: 'high',
    });
  }

  // Red Flag 3: "Complete" with failing tests
  if (impl.status === 'complete' && impl.testsPassed === false) {
    detected.push({
      flag: 'complete_failing_tests',
      message: 'Claims completion despite failing tests',
      severity: 'critical',
    });
  }

  // Red Flag 4: ignored errors on completion
  if (impl.status === 'complete' && (impl.errors || []).length > 0) {
    detected.push({
      flag: 'ignored_errors',
      message: `Claimed completion with ${impl.errors.length} error(s) present`,
      severity: 'high',
    });
  }

  // Red Flag 5: ignored warnings on completion
  if (impl.status === 'complete' && (impl.warnings || []).length > 0) {
    detected.push({
      flag: 'ignored_warnings',
      message: `Claimed completion with ${impl.warnings.length} warning(s) present`,
      severity: 'medium',
    });
  }

  // Red Flag 6: file modifications claimed without diff
  if ((impl.filesModified || []).length > 0 && !impl.diffAvailable) {
    detected.push({
      flag: 'no_diff_evidence',
      message: 'File modifications claimed without diff evidence',
      severity: 'medium',
    });
  }

  // Red Flag 7: uncertainty language
  const foundUncertainty = UNCERTAINTY_WORDS.filter(w => description.includes(w));
  if (foundUncertainty.length > 0) {
    detected.push({
      flag: 'uncertainty_language',
      message: `Uncertainty language detected: ${foundUncertainty.join(', ')}`,
      severity: 'medium',
    });
  }

  return {
    detected,
    clean: detected.length === 0,
    criticalCount: detected.filter(d => d.severity === 'critical').length,
    highCount: detected.filter(d => d.severity === 'high').length,
  };
}

/**
 * Source: SuperClaude Framework confidence.py
 * Weighted confidence scoring with 5 checks summing to 1.0
 */
function computeWeightedConfidence(checks = {}) {
  let score = 0;
  const details = {};

  for (const [checkId, weight] of Object.entries(CONFIDENCE_WEIGHTS)) {
    const passed = Boolean(checks[checkId]);
    const contribution = passed ? weight : 0;
    score += contribution;
    details[checkId] = { passed, weight, contribution };
  }

  let level = 'low';
  let action = 'STOP and request clarification';
  if (score >= CONFIDENCE_THRESHOLDS.high) {
    level = 'high';
    action = 'Proceed with implementation';
  } else if (score >= CONFIDENCE_THRESHOLDS.medium) {
    level = 'medium';
    action = 'Present alternatives, continue investigation';
  }

  return {
    score: Math.round(score * 100) / 100,
    level,
    action,
    details,
  };
}

module.exports = {
  CHECKLIST_ITEMS,
  HALLUCINATION_RED_FLAGS,
  UNCERTAINTY_WORDS,
  CONFIDENCE_WEIGHTS,
  CONFIDENCE_THRESHOLDS,
  createChecklistResult,
  evaluateChecklist,
  generateSelfReviewPrompt,
  buildSelfReviewReport,
  detectHallucinations,
  computeWeightedConfidence,
};
