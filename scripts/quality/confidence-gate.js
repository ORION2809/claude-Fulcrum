'use strict';

function splitList(value) {
  if (Array.isArray(value)) {
    return value
      .map(entry => String(entry || '').trim())
      .filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);
}

function normalizeConfidenceInput(input = {}) {
  return {
    task: String(input.task || input.summary || '').trim(),
    files: splitList(input.files),
    priorMistakes: splitList(input.priorMistakes || input.prior_mistakes),
    knownUnknowns: splitList(input.knownUnknowns || input.known_unknowns),
    evidence: splitList(input.evidence),
    threshold: Number.isFinite(Number(input.threshold)) ? Number(input.threshold) : 0.7,
  };
}

function clampScore(value) {
  return Math.max(0, Math.min(1, Number(value || 0)));
}

function toStatus(score) {
  if (score >= 0.8) {
    return 'pass';
  }
  if (score >= 0.6) {
    return 'warning';
  }
  return 'fail';
}

function scoreRequirementClarity(task, files) {
  const words = task.split(/\s+/).filter(Boolean);
  const hasVerb = /\b(add|build|fix|implement|integrate|refactor|route|score|search|track|update|write)\b/i.test(task);
  const hasScopeAnchor = files.length > 0 || /\b(test|hook|script|command|schema|memory|quality|session|worktree|retrieval)\b/i.test(task);
  let score = 0.2;

  if (words.length >= 6) {
    score += 0.25;
  }
  if (words.length >= 12) {
    score += 0.15;
  }
  if (hasVerb) {
    score += 0.2;
  }
  if (hasScopeAnchor) {
    score += 0.2;
  }

  return clampScore(score);
}

function scorePriorMistakeDetection(task, priorMistakes) {
  const retryLikeTask = /\b(again|bug|fix|regression|retry)\b/i.test(task);
  if (priorMistakes.length >= 2) {
    return 0.95;
  }
  if (priorMistakes.length === 1) {
    return 0.8;
  }
  if (retryLikeTask) {
    return 0.35;
  }
  return 0.6;
}

function scoreContextReadiness(files, knownUnknowns, evidence) {
  let score = 0.2;

  if (files.length >= 1) {
    score += 0.35;
  }
  if (files.length >= 2) {
    score += 0.15;
  }
  if (evidence.length >= 1) {
    score += 0.2;
  }
  if (knownUnknowns.length >= 1) {
    score -= 0.2;
  }

  return clampScore(score);
}

function createReflectionLog(input) {
  const requirementScore = scoreRequirementClarity(input.task, input.files);
  const priorMistakeScore = scorePriorMistakeDetection(input.task, input.priorMistakes);
  const contextReadinessScore = scoreContextReadiness(input.files, input.knownUnknowns, input.evidence);

  return [
    {
      dimension: 'requirement_clarity',
      status: toStatus(requirementScore),
      score: requirementScore,
      note: input.task
        ? `Task has ${input.task.split(/\s+/).filter(Boolean).length} words and ${input.files.length} scoped file anchors.`
        : 'Task summary is missing.',
    },
    {
      dimension: 'prior_mistake_detection',
      status: toStatus(priorMistakeScore),
      score: priorMistakeScore,
      note: input.priorMistakes.length > 0
        ? `Captured ${input.priorMistakes.length} prior mistake signals.`
        : 'No prior mistake signals were captured.',
    },
    {
      dimension: 'context_readiness',
      status: toStatus(contextReadinessScore),
      score: contextReadinessScore,
      note: `Context includes ${input.files.length} scoped files, ${input.evidence.length} evidence items, and ${input.knownUnknowns.length} known unknowns.`,
    },
  ];
}

function buildBlockers(reflectionLog) {
  return reflectionLog
    .filter(entry => entry.status === 'fail')
    .map(entry => {
      if (entry.dimension === 'requirement_clarity') {
        return 'Requirement clarity is too low to execute safely.';
      }
      if (entry.dimension === 'prior_mistake_detection') {
        return 'Prior mistakes are not captured, so the task may repeat known failures.';
      }
      return 'Context readiness is too low to execute safely.';
    });
}

function buildRecommendations(input, reflectionLog) {
  const recommendations = [];

  for (const entry of reflectionLog) {
    if (entry.dimension === 'requirement_clarity' && entry.status !== 'pass') {
      recommendations.push('Add a more specific task summary with concrete outcomes and target files.');
    }
    if (entry.dimension === 'prior_mistake_detection' && entry.status !== 'pass') {
      recommendations.push('Document the last failure mode or known regression before starting implementation.');
    }
    if (entry.dimension === 'context_readiness' && entry.status !== 'pass') {
      recommendations.push('Attach the specific files, research notes, or acceptance criteria needed for execution.');
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('Proceed, but keep the reflection log with the task so later retries have explicit context.');
  }

  if (input.knownUnknowns.length > 0) {
    recommendations.push(`Resolve known unknowns explicitly: ${input.knownUnknowns.join('; ')}`);
  }

  return recommendations;
}

function evaluateConfidence(input = {}) {
  const normalized = normalizeConfidenceInput(input);
  const reflectionLog = createReflectionLog(normalized);
  const weightedScore = (
    (reflectionLog[0].score * 0.4)
    + (reflectionLog[1].score * 0.3)
    + (reflectionLog[2].score * 0.3)
  );
  const score = Number(weightedScore.toFixed(2));
  const blockers = buildBlockers(reflectionLog);
  const recommendations = buildRecommendations(normalized, reflectionLog);
  const proceed = score >= normalized.threshold && blockers.length === 0;

  return {
    score,
    blockers,
    recommendations,
    reflectionLog: reflectionLog.map(entry => ({
      dimension: entry.dimension,
      status: entry.status,
      note: entry.note,
      score: entry.score,
    })),
    proceed,
    threshold: normalized.threshold,
  };
}

function main() {
  const task = process.argv.slice(2).join(' ').trim();
  const result = evaluateConfidence({ task });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) {
  main();
}

module.exports = {
  evaluateConfidence,
  normalizeConfidenceInput,
};
