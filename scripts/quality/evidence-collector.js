'use strict';

function collectEvidence(input = {}) {
  return {
    meaningfulFileChanges: Number(input.meaningfulFileChanges || 0),
    testsRun: Boolean(input.testsRun),
    testsTotal: Number(input.testsTotal || 0),
    testsFailed: Number(input.testsFailed || 0),
    coverage: Number(input.coverage || 0),
    errors: Number(input.errors || 0),
    buildBroken: Boolean(input.buildBroken),
    securityCriticalCount: Number(input.securityCriticalCount || 0),
    threshold: Number(input.threshold || 70),
  };
}

module.exports = {
  collectEvidence,
};
