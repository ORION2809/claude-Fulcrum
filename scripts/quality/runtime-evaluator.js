'use strict';

const fs = require('fs');
const path = require('path');

const { routePersona } = require('../lib/persona-router');
const { getPersonaFromEnv, loadPersonaProfile } = require('../lib/persona-runtime');
const { appendGovernanceEvent } = require('../lib/governance-log');
const { loadControlPlane, getRepoRoot, getGovernanceDir } = require('../lib/fulcrum-control');
const { collectEvidence } = require('./evidence-collector');
const { runQualityLoop } = require('./loop');
const { runAllValidators } = require('./policy-validators');
const { runCrossModelAudit } = require('./cross-model-auditor');
const {
  createChecklistResult,
  evaluateChecklist,
  detectHallucinations,
  computeWeightedConfidence,
  buildSelfReviewReport,
} = require('./self-review');

function countMatches(content, pattern) {
  const matches = String(content || '').match(pattern);
  return matches ? matches.length : 0;
}

function computeMaxNestingDepth(content) {
  const lines = String(content || '').split('\n');
  let depth = 0;
  let maxDepth = 0;

  for (const line of lines) {
    const opens = countMatches(line, /\{/g);
    const closes = countMatches(line, /\}/g);
    depth += opens;
    maxDepth = Math.max(maxDepth, depth);
    depth = Math.max(0, depth - closes);
  }

  return maxDepth;
}

function extractFunctions(content) {
  const lines = String(content || '').split('\n');
  const functions = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/(?:function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)|(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*\(([^)]*)\)\s*=>)/);
    if (!match) {
      continue;
    }

    const name = match[1] || match[3] || `anonymous_${index + 1}`;
    const params = (match[2] || match[4] || '')
      .split(',')
      .map(part => part.trim())
      .filter(Boolean);

    let braceDepth = countMatches(line, /\{/g) - countMatches(line, /\}/g);
    let lineCount = 1;
    let maxDepth = Math.max(0, braceDepth);
    let cyclomatic = 1 + countMatches(line, /\b(if|for|while|case|catch)\b|&&|\|\||\?/g);

    let cursor = index + 1;
    while (cursor < lines.length && braceDepth > 0) {
      const nextLine = lines[cursor];
      braceDepth += countMatches(nextLine, /\{/g);
      maxDepth = Math.max(maxDepth, braceDepth);
      cyclomatic += countMatches(nextLine, /\b(if|for|while|case|catch)\b|&&|\|\||\?/g);
      braceDepth -= countMatches(nextLine, /\}/g);
      lineCount += 1;
      cursor += 1;
    }

    functions.push({
      name,
      line: index + 1,
      lineCount,
      nestingDepth: maxDepth,
      cyclomaticComplexity: cyclomatic,
      cognitiveComplexity: cyclomatic + Math.max(0, maxDepth - 1),
      paramCount: params.length,
    });
  }

  return functions;
}

function extractClasses(content) {
  const classMatches = [...String(content || '').matchAll(/class\s+([A-Za-z0-9_$]+)/g)];
  return classMatches.map(match => ({
    name: match[1],
    line: String(content || '').slice(0, match.index).split('\n').length,
    publicMethodCount: countMatches(String(content || ''), /^\s*(?!constructor\b)([A-Za-z0-9_$]+)\s*\([^)]*\)\s*\{/gm),
    methodCount: countMatches(String(content || ''), /^\s*(?!constructor\b)([A-Za-z0-9_$]+)\s*\([^)]*\)\s*\{/gm),
    isInterface: false,
    isAbstract: false,
    hasNotImplementedError: false,
  }));
}

function detectIoCalls(content) {
  const calls = [];
  const patterns = [
    { category: 'file_io', regex: /\b(readFile|writeFile|readFileSync|writeFileSync|mkdir|unlink|copyFile)\b/g },
    { category: 'network', regex: /\b(fetch|axios|got|http\.request|https\.request)\b/g },
    { category: 'subprocess', regex: /\b(exec|execSync|spawn|spawnSync|fork)\b/g },
    { category: 'side_effects', regex: /\b(console\.(?:log|warn|error)|process\.exit)\b/g },
    { category: 'database', regex: /\b(query|execute|commit|rollback)\b/g },
  ];

  for (const item of patterns) {
    const matches = String(content || '').match(item.regex) || [];
    for (const match of matches) {
      calls.push({ category: item.category, call: match });
    }
  }

  return calls;
}

function derivePersona(filePath, content) {
  // Check session persona file first (set by --persona-* flags in user prompts)
  try {
    const personaPath = path.join(getGovernanceDir(), 'active-persona.json');
    if (fs.existsSync(personaPath)) {
      const sessionPersona = JSON.parse(fs.readFileSync(personaPath, 'utf8'));
      if (sessionPersona.activePersona) {
        return {
          activePersona: sessionPersona.activePersona,
          personaStack: (sessionPersona.personaStack || []).map(name => ({ name, score: 1 })),
          routed: {},
          profile: loadPersonaProfile(sessionPersona.activePersona),
          source: sessionPersona.source || 'session_file',
        };
      }
    }
  } catch {
    // Fall through to env and auto-routing
  }

  const envPersona = getPersonaFromEnv();
  if (envPersona.activePersona) {
    return {
      activePersona: envPersona.activePersona,
      personaStack: envPersona.personaStack || [],
      routed: envPersona.route || {},
      profile: envPersona.personaProfile || loadPersonaProfile(envPersona.activePersona),
      source: 'env',
    };
  }

  const routed = routePersona({
    task: `review ${path.basename(filePath || '')} ${String(content || '').slice(0, 300)}`,
    category: inferCategory(filePath, content),
    riskLevel: inferRiskLevel(content),
  });

  return {
    activePersona: routed.primary,
    personaStack: routed.stack,
    routed,
    profile: loadPersonaProfile(routed.primary),
    source: 'auto',
  };
}

function inferCategory(filePath, content) {
  const lowerPath = String(filePath || '').toLowerCase();
  const lower = String(content || '').toLowerCase();

  if (/\b(auth|security|token|secret|crypto|password)\b/.test(lower)) {
    return 'security';
  }
  if (/test|spec/.test(lowerPath)) {
    return 'testing';
  }
  if (/\b(fix|error|bug|crash|throw)\b/.test(lower)) {
    return 'bug';
  }
  if (/\b(class|interface|architecture|schema|migration)\b/.test(lower)) {
    return 'design';
  }
  return 'implementation';
}

function inferRiskLevel(content) {
  const lower = String(content || '').toLowerCase();
  if (/\b(secret|token|password|auth|crypto|sql|exec|spawn)\b/.test(lower)) {
    return 'high';
  }
  return 'medium';
}

function validatorsForPersona(persona) {
  const mapping = {
    security: ['SecurityPolicy', 'Purity', 'LetItCrash', 'KISS'],
    architect: ['KISS', 'SOLID', 'Purity', 'ContextBudgetPolicy'],
    reviewer: ['KISS', 'Purity', 'SOLID', 'LetItCrash', 'SecurityPolicy', 'ContextBudgetPolicy'],
    tester: ['KISS', 'LetItCrash', 'ContextBudgetPolicy'],
    debugger: ['KISS', 'LetItCrash', 'SecurityPolicy'],
    planner: ['ContextBudgetPolicy', 'SOLID'],
    documenter: ['ContextBudgetPolicy'],
    implementer: ['KISS', 'Purity', 'SOLID'],
  };
  return mapping[persona] || ['KISS', 'Purity', 'SOLID'];
}

function buildStaticEvidence(filePath, beforeContent, afterContent, personaInfo, rawInput = '') {
  const currentContent = afterContent || beforeContent || '';
  const lineCount = currentContent.split('\n').length;
  const functions = extractFunctions(currentContent);
  const classes = extractClasses(currentContent);
  const ioCalls = detectIoCalls(currentContent);
  const maxFunctionLength = functions.reduce((max, fn) => Math.max(max, fn.lineCount || 0), 0);
  const maxNestingDepth = Math.max(
    computeMaxNestingDepth(currentContent),
    functions.reduce((max, fn) => Math.max(max, fn.nestingDepth || 0), 0)
  );
  const broadCatchPatterns = countMatches(currentContent, /\bcatch\s*\([^)]*\)\s*\{/g);
  const bareCatchBlocks = countMatches(currentContent, /\bcatch\s*\{/g);
  const emptyCatchBlocks = countMatches(currentContent, /\bcatch\s*(?:\([^)]*\))?\s*\{\s*\}/g);
  const hardcodedSecrets = countMatches(currentContent, /\b(sk-[A-Za-z0-9_-]{8,}|Bearer\s+[A-Za-z0-9._-]{8,}|api[_-]?key\s*[:=]\s*['"][^'"]+['"])\b/g);
  const sqlInjectionRisk = countMatches(currentContent, /\b(SELECT|INSERT|UPDATE|DELETE)[\s\S]{0,80}\$\{/gi);
  const insecureCrypto = countMatches(currentContent, /\b(md5|sha1)\b/gi);
  const missingAuthCheck = /\b(app\.(get|post|put|delete)|router\.(get|post|put|delete))\b/.test(currentContent)
    && !/\b(auth|authorize|middleware|requireAuth|checkAuth)\b/.test(currentContent)
    ? 1
    : 0;
  const responsibilities = [];
  if (/\b(fetch|axios|query|execute|sql)\b/.test(currentContent)) responsibilities.push('io');
  if (/\b(class|interface|schema|migration)\b/.test(currentContent)) responsibilities.push('structure');
  if (/\b(render|jsx|tsx|html|template)\b/.test(currentContent)) responsibilities.push('ui');
  if (/\b(auth|token|secret|permission)\b/.test(currentContent)) responsibilities.push('security');

  return {
    files: [
      {
        path: filePath,
        lineCount,
        functions,
        classes,
        ioCalls,
        maxFunctionLength,
        maxNestingDepth,
        globalMutations: countMatches(currentContent, /\b(globalThis|window|global)\.[A-Za-z0-9_$]+\s*=/g),
        sideEffectsInPureFunctions: countMatches(currentContent, /\breturn\b[\s\S]{0,80}\b(console\.|fetch|query|exec|spawn)\b/g),
        directServiceInstantiations: countMatches(currentContent, /\bnew\s+[A-Z][A-Za-z0-9_$]*Service\s*\(/g),
        responsibilities,
        hasGodClass: classes.some(cls => (cls.publicMethodCount || 0) > 8),
        broadCatchPatterns,
        bareCatchBlocks,
        emptyCatchBlocks,
        maxTryNestingDepth: countMatches(currentContent, /\btry\s*\{/g),
        missingErrorHandling: /\basync\b/.test(currentContent) && !/\btry\s*\{|\.catch\s*\(/.test(currentContent) ? 1 : 0,
        hardcodedSecrets,
        unsanitizedInputs: countMatches(currentContent, /\b(req\.(body|query|params)|input)\b[\s\S]{0,80}\b(exec|query|innerHTML)\b/g),
        sqlInjectionRisk,
        insecureCrypto,
        missingAuthCheck,
      }
    ],
    contextBudget: {
      utilization: Math.min(1, String(rawInput || '').length / 60000),
      pendingQueueSize: 0,
    },
    persona: personaInfo.activePersona,
  };
}

function buildLoopEvidence(validatorSummary, auditResult, threshold) {
  return collectEvidence({
    meaningfulFileChanges: 1,
    testsRun: false,
    testsTotal: 0,
    testsFailed: 0,
    coverage: 0,
    errors: validatorSummary.high + validatorSummary.critical,
    buildBroken: false,
    securityCriticalCount: validatorSummary.critical + (auditResult.summary?.critical || 0),
    threshold,
  });
}

function buildChecklist(validatorResults, loopResult, auditResult) {
  const findings = validatorResults.findings || [];
  const highOrCritical = findings.filter(item => item.severity === 'high' || item.severity === 'critical');
  const securityIssues = findings.filter(item => item.validator === 'SecurityPolicy' && (item.severity === 'high' || item.severity === 'critical'));

  return evaluateChecklist([
    createChecklistResult('req_match', highOrCritical.length === 0, highOrCritical[0]?.message || 'Validators clean'),
    createChecklistResult('tests_pass', true, 'Write-time gate does not execute full test suite'),
    createChecklistResult('build_clean', true, 'No build breakage detected in write-time gate'),
    createChecklistResult('no_regressions', (auditResult.summary?.critical || 0) === 0, auditResult.reason || 'No critical audit findings'),
    createChecklistResult('edge_cases', findings.filter(item => item.severity === 'medium').length === 0, findings.filter(item => item.severity === 'medium').map(item => item.message).join('; ') || 'No medium findings'),
    createChecklistResult('error_handling', !findings.some(item => item.validator === 'LetItCrash' && (item.severity === 'high' || item.severity === 'critical')), 'Error-handling policy evaluated'),
    createChecklistResult('input_validation', securityIssues.length === 0, securityIssues.map(item => item.message).join('; ') || 'Security policy evaluated'),
    createChecklistResult('no_secrets', !findings.some(item => item.message.toLowerCase().includes('secret')), 'Secret scan completed'),
    createChecklistResult('code_readable', !findings.some(item => item.validator === 'KISS' && item.severity === 'high'), 'KISS policy evaluated'),
    createChecklistResult('no_dead_code', true, 'No dead-code detector in write-time path'),
    createChecklistResult('docs_updated', true, 'Docs not required for write-time validation'),
    createChecklistResult('rollback_safe', loopResult.terminationReason !== 'ERROR', `Termination: ${loopResult.terminationReason}`),
  ]);
}

async function evaluateRuntimeQuality(input) {
  const {
    filePath,
    beforeContent = '',
    afterContent = '',
    rawInput = '',
    sessionId = null,
    attemptId = null,
    repoRoot = getRepoRoot(),
  } = input;

  const controlPlane = loadControlPlane(repoRoot);
  const personaInfo = derivePersona(filePath, afterContent || beforeContent);
  const validatorNames = personaInfo.profile?.quality?.requiredValidators || validatorsForPersona(personaInfo.activePersona);
  const threshold = Number(controlPlane.qualityLoop?.threshold || 70);

  const beforeStatic = buildStaticEvidence(filePath, beforeContent, beforeContent, personaInfo, rawInput);
  const beforeValidators = runAllValidators(beforeStatic, { validators: validatorNames });

  const afterStatic = buildStaticEvidence(filePath, beforeContent, afterContent, personaInfo, rawInput);
  const validatorResults = runAllValidators(afterStatic, { validators: validatorNames });

  const loopIterations = [
    buildLoopEvidence(beforeValidators.summary, { summary: { critical: 0 } }, threshold),
    buildLoopEvidence(validatorResults.summary, { summary: { critical: 0 } }, threshold),
  ];
  const loopResult = runQualityLoop(loopIterations, {
    threshold,
    maxIterations: Number(controlPlane.qualityLoop?.maxIterations || 5),
    baseDir: repoRoot,
  });

  const auditResult = await runCrossModelAudit({
    files: [{
      path: filePath,
      action: 'modified',
      linesChanged: Math.max(1, Math.abs(afterContent.split('\n').length - beforeContent.split('\n').length)),
      content: afterContent,
    }],
    qualityScore: Math.max(0, Math.min(1, (loopResult.iterations.slice(-1)[0]?.score || 0) / 100)),
    testSummary: null,
  }, validatorResults.findings, {
    boundary: 'post_tool_use',
    sessionId,
    attemptId,
    repoRoot,
    reviewerModel: personaInfo.activePersona === 'security' ? 'security-reviewer' : 'self',
  });

  const checklist = buildChecklist(validatorResults, loopResult, auditResult);
  const hallucinationCheck = detectHallucinations({
    testsPassed: false,
    testOutput: '',
    status: auditResult.decision === 'block' ? 'incomplete' : 'complete',
    evidence: true,
    codeChanges: afterContent ? '+' : '',
    filesModified: [filePath],
    diffAvailable: true,
    description: `${personaInfo.activePersona} quality review for ${path.basename(filePath || '')}`,
    errors: validatorResults.findings.filter(item => item.severity === 'critical').map(item => item.message),
    warnings: validatorResults.findings.filter(item => item.severity === 'high').map(item => item.message),
  });

  const confidence = computeWeightedConfidence({
    noDuplicates: true,
    architectureCompliance: !validatorResults.findings.some(item => item.validator === 'SOLID' && item.severity === 'high'),
    docsVerified: true,
    ossImplementations: true,
    rootCauseIdentified: auditResult.findings.length > 0 || validatorResults.findings.length > 0,
  });

  const selfReview = buildSelfReviewReport(checklist, {
    requirementMatch: checklist.criticalFailures.length === 0,
    testsBuildStatus: 'not_run_in_write_time_gate',
    edgeCaseCoverage: validatorResults.summary.medium === 0 ? 'clean' : 'needs_follow_up',
    rollbackRecommended: auditResult.decision === 'block',
    followUpItems: validatorResults.findings
      .filter(item => item.severity === 'high' || item.severity === 'critical')
      .map(item => item.message)
      .slice(0, 5),
    hallucinationCheck,
    confidence,
  });

  const result = {
    persona: personaInfo,
    validators: validatorResults,
    loop: loopResult,
    audit: auditResult,
    selfReview,
    checklist,
  };

  if (
    validatorResults.summary.critical > 0
    || auditResult.decision === 'block'
    || selfReview.verdict === 'block'
  ) {
    await appendGovernanceEvent({
      eventType: 'quality_gate_runtime',
      decision: auditResult.decision === 'block' ? 'block' : 'warn',
      reason: auditResult.reason,
      sessionId,
      attemptId,
      artifactRef: {
        type: 'quality_gate',
        filePath,
      },
      payload: {
        persona: personaInfo.activePersona,
        validators: validatorResults.summary,
        loopTermination: loopResult.terminationReason,
        selfReviewVerdict: selfReview.verdict,
      },
    }, { repoRoot });
  }

  return result;
}

module.exports = {
  buildStaticEvidence,
  evaluateRuntimeQuality,
  inferCategory,
  inferRiskLevel,
  validatorsForPersona,
  derivePersona,
  extractFunctions,
  extractClasses,
};
