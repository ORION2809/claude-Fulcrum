'use strict';

const { isOscillating, isStagnating, scoreEvidence } = require('./scorer');
const { writeQualityTelemetry } = require('./telemetry-writer');

function runQualityLoop(iterations = [], options = {}) {
  const threshold = Number.isFinite(Number(options.threshold)) ? Number(options.threshold) : 70;
  const maxIterations = Number.isFinite(Number(options.maxIterations)) ? Number(options.maxIterations) : 5;
  const telemetryBaseDir = typeof options.baseDir === 'string' && options.baseDir.length > 0
    ? options.baseDir
    : process.cwd();
  const scores = [];
  const results = [];

  for (let index = 0; index < iterations.length && index < maxIterations; index += 1) {
    const evidence = iterations[index];
    const result = scoreEvidence(evidence, { threshold });
    scores.push(result.score);
    results.push({
      iteration: index + 1,
      ...result
    });
    writeQualityTelemetry({
      event_type: 'score_update',
      iteration: index + 1,
      score: result.score,
      band: result.band,
      passed: result.passed
    }, telemetryBaseDir);

    if (result.passed) {
      return {
        terminationReason: 'QUALITY_MET',
        iterations: results
      };
    }

    if (isOscillating(scores)) {
      return {
        terminationReason: 'OSCILLATION',
        iterations: results
      };
    }

    if (isStagnating(scores)) {
      return {
        terminationReason: 'STAGNATION',
        iterations: results
      };
    }
  }

  return {
    terminationReason: results.length >= maxIterations ? 'MAX_ITERATIONS' : 'ERROR',
    iterations: results
  };
}

module.exports = {
  runQualityLoop
};
