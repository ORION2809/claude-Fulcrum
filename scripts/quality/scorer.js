'use strict';

function isImproving(scores) {
  return scores.length < 2 ? true : scores[scores.length - 1] > scores[scores.length - 2];
}

function isOscillating(scores) {
  if (scores.length < 4) {
    return false;
  }

  const recent = scores.slice(-4);
  const variance = Math.max(...recent) - Math.min(...recent);
  return variance < 5 && !isImproving(scores);
}

function isStagnating(scores, minDelta = 2) {
  if (scores.length < 3) {
    return false;
  }

  const lastThree = scores.slice(-3);
  return lastThree.every((score, index) => index === 0 || Math.abs(score - lastThree[index - 1]) < minDelta);
}

function scoreBand(score) {
  if (score < 40) return 'poor';
  if (score < 60) return 'needs_work';
  if (score < 75) return 'acceptable';
  if (score < 90) return 'good';
  return 'excellent';
}

function computeDeterministicScore(evidence) {
  const codeChanges = evidence.meaningfulFileChanges > 0 ? 30 : 0;
  const testsRun = evidence.testsRun ? 25 : 0;
  const testsPass = evidence.testsRun && evidence.testsFailed === 0
    ? 25
    : evidence.testsRun && evidence.testsTotal > 0
      ? Math.max(0, Math.round(25 * ((evidence.testsTotal - evidence.testsFailed) / evidence.testsTotal)))
      : 0;
  const coverage = evidence.coverage >= 80 ? 10 : Math.max(0, Math.round((evidence.coverage || 0) / 8));
  const noErrors = evidence.errors === 0 ? 10 : 0;

  const hardCaps = [];
  if (evidence.securityCriticalCount > 0) {
    hardCaps.push({ reason: 'security-critical issue cap', cap: 30 });
  }
  if (evidence.testsRun && evidence.testsTotal > 0 && evidence.testsFailed > evidence.testsTotal / 2) {
    hardCaps.push({ reason: 'majority tests failing cap', cap: 40 });
  }
  if (evidence.buildBroken) {
    hardCaps.push({ reason: 'build broken cap', cap: 45 });
  }

  const rawScore = codeChanges + testsRun + testsPass + coverage + noErrors;
  const cap = hardCaps.reduce((lowest, item) => Math.min(lowest, item.cap), 100);
  const score = Math.min(rawScore, cap);
  const hardCapApplied = hardCaps.length > 0 ? cap : undefined;

  return {
    score,
    rawScore,
    band: scoreBand(score),
    hardCapApplied,
    hardCaps,
    passed: score >= (evidence.threshold || 70) && hardCaps.length === 0,
  };
}

function normalizeEvidence(evidence = {}, options = {}) {
  const threshold = Number.isFinite(Number(options.threshold))
    ? Number(options.threshold)
    : Number.isFinite(Number(evidence.threshold))
      ? Number(evidence.threshold)
      : 70;

  if ('meaningfulFileChanges' in evidence || 'testsTotal' in evidence || 'securityCriticalCount' in evidence) {
    return {
      meaningfulFileChanges: evidence.meaningfulFileChanges || 0,
      testsRun: Boolean(evidence.testsRun),
      testsTotal: evidence.testsTotal || 0,
      testsFailed: evidence.testsFailed || 0,
      coverage: evidence.coverage || 0,
      errors: evidence.errors || 0,
      buildBroken: Boolean(evidence.buildBroken),
      securityCriticalCount: evidence.securityCriticalCount || 0,
      threshold,
    };
  }

  const codeChangesValue = Number(evidence.codeChangesRate ?? evidence.codeChanges ?? 0);
  const testsRun = Boolean(evidence.testsRun || evidence.testsRunRate || evidence.testsPass || evidence.testsPassRate);
  const testsPassRate = evidence.testsPassRate !== undefined
    ? Number(evidence.testsPassRate)
    : evidence.testsPass !== undefined
      ? Number(evidence.testsPass)
      : undefined;
  const testsFailed = evidence.testsFailed !== undefined
    ? Number(evidence.testsFailed)
    : testsPassRate !== undefined && testsRun
      ? Math.max(0, Math.round((1 - Math.max(0, Math.min(1, testsPassRate))) * 100))
      : 0;
  const testsPassed = evidence.testsPassed !== undefined
    ? Number(evidence.testsPassed)
    : testsPassRate !== undefined && testsRun
      ? Math.max(0, Math.round(Math.max(0, Math.min(1, testsPassRate)) * 100))
      : 0;
  const testsTotal = evidence.testsTotal || (testsRun ? Math.max(1, testsPassed + testsFailed) : 0);
  const coverage = evidence.coverageRate !== undefined
    ? Math.round(Number(evidence.coverageRate) * 100)
    : evidence.coverage !== undefined
      ? Math.round(Number(evidence.coverage) * (Number(evidence.coverage) <= 1 ? 100 : 1))
      : 0;

  return {
    meaningfulFileChanges: codeChangesValue >= 1 ? Math.round(codeChangesValue) : 0,
    testsRun,
    testsTotal,
    testsFailed,
    coverage,
    errors: evidence.hasErrors ? 1 : 0,
    buildBroken: Boolean(evidence.buildBroken),
    securityCriticalCount: evidence.securityCritical ? 1 : 0,
    threshold,
  };
}

function scoreEvidence(evidence = {}, options = {}) {
  return computeDeterministicScore(normalizeEvidence(evidence, options));
}

module.exports = {
  computeDeterministicScore,
  isImproving,
  isOscillating,
  isStagnating,
  normalizeEvidence,
  scoreEvidence,
  scoreBand,
};
