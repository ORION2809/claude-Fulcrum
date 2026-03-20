#!/usr/bin/env node
'use strict';

/**
 * Phase 4.3 - Quality Policy Validators
 * Source: Tony363-SuperClaude (Orchestrator/quality.py)
 *
 * Architecture-policy validators separate from execution scoring.
 * KISS, Purity, SOLID, LetItCrash, SecurityPolicy, ContextBudgetPolicy
 * Produce structured findings, not raw score overrides.
 */

const SEVERITY = Object.freeze({
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
});

/**
 * Source: Tony363-SuperClaude validate_kiss.py - KISSThresholds
 */
const KISS_THRESHOLDS = Object.freeze({
  maxComplexity: 10,
  warningComplexity: 7,
  maxFunctionLines: 50,
  maxNestingDepth: 4,
  maxParameters: 5,
  maxCognitiveComplexity: 15,
});

/**
 * Source: Tony363-SuperClaude validate_solid.py - SOLIDThresholds
 */
const SOLID_THRESHOLDS = Object.freeze({
  maxFileLines: 300,
  maxClassPublicMethods: 5,
  maxInterfaceMethods: 7,
  maxInstanceofChain: 2,
});

/**
 * Source: Tony363-SuperClaude validate_purity.py - core vs shell path patterns
 */
const CORE_PATH_PATTERNS = Object.freeze([
  '/domain/', '/models/', '/services/', '/logic/', '/core/',
  '/business/', '/utils/', '/helpers/',
]);
const SHELL_PATH_PATTERNS = Object.freeze([
  '/handlers/', '/views/', '/routes/', '/api/', '/cli/',
  '/adapters/', '/controllers/', '/endpoints/', '/scripts/',
  '/tests/', '/examples/', '/benchmarks/', '/archive/',
]);

/**
 * Source: Tony363-SuperClaude validate_purity.py - IO_CALL_PATTERNS
 */
const IO_CALL_PATTERNS = Object.freeze({
  file_io: ['open', 'readFile', 'writeFile', 'readFileSync', 'writeFileSync',
    'mkdir', 'rmdir', 'unlink', 'rename', 'copyFile'],
  network: ['fetch', 'http.request', 'https.request', 'axios',
    'got', 'request', 'socket.connect'],
  database: ['execute', 'query', 'cursor', 'commit', 'rollback', 'flush'],
  subprocess: ['exec', 'execSync', 'spawn', 'spawnSync', 'fork'],
  side_effects: ['console.log', 'console.warn', 'console.error', 'process.exit'],
});

function createFinding(validatorName, severity, message, metadata = {}) {
  return {
    validator: validatorName,
    severity,
    message,
    file: metadata.file || null,
    line: metadata.line || null,
    suggestion: metadata.suggestion || null,
    timestamp: new Date().toISOString(),
  };
}

function validateKISS(evidence = {}) {
  const findings = [];
  const files = evidence.files || [];
  const thresholds = { ...KISS_THRESHOLDS, ...(evidence.kissThresholds || {}) };

  for (const file of files) {
    const functions = file.functions || [];

    for (const fn of functions) {
      // Source: Tony363 ComplexityVisitor — cyclomatic complexity
      if ((fn.cyclomaticComplexity || 0) > thresholds.maxComplexity) {
        findings.push(createFinding('KISS', SEVERITY.HIGH,
          `Function "${fn.name}" cyclomatic complexity ${fn.cyclomaticComplexity} exceeds ${thresholds.maxComplexity}`,
          { file: file.path, line: fn.line, suggestion: 'Break into smaller functions, reduce branching' }
        ));
      } else if ((fn.cyclomaticComplexity || 0) > thresholds.warningComplexity) {
        findings.push(createFinding('KISS', SEVERITY.MEDIUM,
          `Function "${fn.name}" cyclomatic complexity ${fn.cyclomaticComplexity} approaching limit (warning: ${thresholds.warningComplexity})`,
          { file: file.path, line: fn.line, suggestion: 'Consider simplifying branching logic' }
        ));
      }

      // Source: Tony363 — function length
      if ((fn.lineCount || 0) > thresholds.maxFunctionLines) {
        findings.push(createFinding('KISS', SEVERITY.MEDIUM,
          `Function "${fn.name}" is ${fn.lineCount} lines (max: ${thresholds.maxFunctionLines})`,
          { file: file.path, line: fn.line, suggestion: 'Break into smaller functions with single responsibilities' }
        ));
      }

      // Source: Tony363 — nesting depth
      if ((fn.nestingDepth || 0) > thresholds.maxNestingDepth) {
        findings.push(createFinding('KISS', SEVERITY.HIGH,
          `Function "${fn.name}" nesting depth ${fn.nestingDepth} exceeds ${thresholds.maxNestingDepth}`,
          { file: file.path, line: fn.line, suggestion: 'Use early returns, guard clauses, or extract functions' }
        ));
      }

      // Source: Tony363 — parameter count
      if ((fn.paramCount || 0) > thresholds.maxParameters) {
        findings.push(createFinding('KISS', SEVERITY.MEDIUM,
          `Function "${fn.name}" has ${fn.paramCount} parameters (max: ${thresholds.maxParameters})`,
          { file: file.path, line: fn.line, suggestion: 'Use an options object or refactor to reduce parameters' }
        ));
      }

      // Source: Tony363 — cognitive complexity
      if ((fn.cognitiveComplexity || 0) > thresholds.maxCognitiveComplexity) {
        findings.push(createFinding('KISS', SEVERITY.HIGH,
          `Function "${fn.name}" cognitive complexity ${fn.cognitiveComplexity} exceeds ${thresholds.maxCognitiveComplexity}`,
          { file: file.path, line: fn.line, suggestion: 'Reduce logical branching, extract sub-functions' }
        ));
      }
    }

    // File-level checks (secondary — Fulcrum addition)
    if ((file.maxNestingDepth || 0) > thresholds.maxNestingDepth) {
      findings.push(createFinding('KISS', SEVERITY.HIGH,
        `File nesting depth ${file.maxNestingDepth} exceeds ${thresholds.maxNestingDepth} levels`,
        { file: file.path, suggestion: 'Use early returns, guard clauses, or extract functions' }
      ));
    }

    if ((file.maxFunctionLength || 0) > thresholds.maxFunctionLines) {
      findings.push(createFinding('KISS', SEVERITY.MEDIUM,
        `Longest function is ${file.maxFunctionLength} lines (max: ${thresholds.maxFunctionLines})`,
        { file: file.path, suggestion: 'Break into smaller functions with single responsibilities' }
      ));
    }
  }

  return {
    validator: 'KISS',
    passed: findings.filter(f => f.severity === SEVERITY.CRITICAL || f.severity === SEVERITY.HIGH).length === 0,
    findings,
  };
}

/**
 * Source: Tony363-SuperClaude validate_purity.py
 * Functional Core, Imperative Shell pattern.
 * Core paths must be pure; shell paths may have side effects.
 */
function classifyFilePath(filePath) {
  const normalizedPath = (filePath || '').replace(/\\/g, '/');
  for (const pattern of CORE_PATH_PATTERNS) {
    if (normalizedPath.includes(pattern)) return 'core';
  }
  for (const pattern of SHELL_PATH_PATTERNS) {
    if (normalizedPath.includes(pattern)) return 'shell';
  }
  return 'unknown';
}

function validatePurity(evidence = {}) {
  const findings = [];
  const files = evidence.files || [];

  for (const file of files) {
    const context = classifyFilePath(file.path);
    const severity = context === 'core' ? SEVERITY.HIGH : SEVERITY.LOW;

    if (file.globalMutations > 0) {
      findings.push(createFinding('Purity', severity,
        `${file.globalMutations} global/shared state mutations detected (${context} context)`,
        { file: file.path, suggestion: 'Return new objects instead of mutating. Use immutable patterns.' }
      ));
    }

    if (file.sideEffectsInPureFunctions > 0) {
      findings.push(createFinding('Purity',
        context === 'core' ? SEVERITY.HIGH : SEVERITY.INFO,
        `${file.sideEffectsInPureFunctions} functions with I/O side effects (${context} context)`,
        { file: file.path, suggestion: 'Separate pure computation from I/O operations' }
      ));
    }

    // Source: Tony363 IO_CALL_PATTERNS — detect specific I/O calls in core paths
    const ioCalls = file.ioCalls || [];
    if (context === 'core' && ioCalls.length > 0) {
      const categories = [...new Set(ioCalls.map(c => c.category))];
      findings.push(createFinding('Purity', SEVERITY.HIGH,
        `Core module contains direct I/O calls: ${categories.join(', ')}`,
        { file: file.path, suggestion: 'Move I/O to shell/adapter layer, inject dependencies for core' }
      ));
    }
  }

  return {
    validator: 'Purity',
    passed: findings.filter(f => f.severity === SEVERITY.CRITICAL || f.severity === SEVERITY.HIGH).length === 0,
    findings,
  };
}

/**
 * Source: Tony363-SuperClaude validate_solid.py - CombinedSOLIDVisitor
 * All 5 SOLID principles checked against thresholds.
 */
function validateSOLID(evidence = {}) {
  const findings = [];
  const files = evidence.files || [];
  const thresholds = { ...SOLID_THRESHOLDS, ...(evidence.solidThresholds || {}) };

  for (const file of files) {
    // SRP: file line count — Tony363 maxFileLines=300
    if ((file.lineCount || 0) > thresholds.maxFileLines) {
      findings.push(createFinding('SOLID', SEVERITY.MEDIUM,
        `File has ${file.lineCount} lines (SRP: max ${thresholds.maxFileLines})`,
        { file: file.path, suggestion: 'Split by responsibility into separate modules' }
      ));
    }

    const classes = file.classes || [];
    for (const cls of classes) {
      // SRP: class public methods — Tony363 maxClassPublicMethods=5
      if ((cls.publicMethodCount || 0) > thresholds.maxClassPublicMethods) {
        findings.push(createFinding('SOLID', SEVERITY.MEDIUM,
          `Class "${cls.name}" has ${cls.publicMethodCount} public methods (ISP/SRP: max ${thresholds.maxClassPublicMethods})`,
          { file: file.path, line: cls.line, suggestion: 'Break into smaller, focused classes using composition' }
        ));
      }

      // ISP: interface/protocol method count — Tony363 maxInterfaceMethods=7
      if (cls.isInterface && (cls.methodCount || 0) > thresholds.maxInterfaceMethods) {
        findings.push(createFinding('SOLID', SEVERITY.MEDIUM,
          `Interface "${cls.name}" has ${cls.methodCount} methods (ISP: max ${thresholds.maxInterfaceMethods})`,
          { file: file.path, line: cls.line, suggestion: 'Split into smaller, client-specific interfaces' }
        ));
      }

      // LSP: NotImplementedError in concrete class — Tony363 error severity
      if (cls.hasNotImplementedError && !cls.isAbstract) {
        findings.push(createFinding('SOLID', SEVERITY.HIGH,
          `Class "${cls.name}" has raise NotImplementedError in non-abstract methods (LSP violation)`,
          { file: file.path, line: cls.line, suggestion: 'Make class abstract or implement the method' }
        ));
      }
    }

    // OCP: instanceof cascade — Tony363 maxInstanceofChain=2
    if ((file.maxInstanceofChain || 0) > thresholds.maxInstanceofChain) {
      findings.push(createFinding('SOLID', SEVERITY.MEDIUM,
        `instanceof/typeof cascade of ${file.maxInstanceofChain} in a single function (OCP: max ${thresholds.maxInstanceofChain})`,
        { file: file.path, suggestion: 'Use polymorphism or strategy pattern instead of type checking' }
      ));
    }

    // DIP: direct instantiation of service classes in core paths — Tony363
    const context = classifyFilePath(file.path);
    if (context === 'core' && (file.directServiceInstantiations || 0) > 0) {
      findings.push(createFinding('SOLID', SEVERITY.MEDIUM,
        `Core module directly instantiates ${file.directServiceInstantiations} service class(es) (DIP violation)`,
        { file: file.path, suggestion: 'Inject dependencies instead of constructing services directly' }
      ));
    }

    // Backward compat: existing checks
    if ((file.responsibilities || []).length > 3) {
      findings.push(createFinding('SOLID', SEVERITY.MEDIUM,
        `File has ${file.responsibilities.length} distinct responsibilities (SRP violation)`,
        { file: file.path, suggestion: 'Split by responsibility into separate modules' }
      ));
    }

    if (file.hasGodClass) {
      findings.push(createFinding('SOLID', SEVERITY.HIGH,
        'God class detected: class handles too many concerns',
        { file: file.path, suggestion: 'Break into smaller, focused classes using composition' }
      ));
    }
  }

  return {
    validator: 'SOLID',
    passed: findings.filter(f => f.severity === SEVERITY.CRITICAL || f.severity === SEVERITY.HIGH).length === 0,
    findings,
  };
}

/**
 * Source: Tony363-SuperClaude validate_crash.py
 * Severity distinction: bare except = CRITICAL, broad except = WARNING,
 * except-pass = CRITICAL, nested try depth > 2 = WARNING
 */
function validateLetItCrash(evidence = {}) {
  const findings = [];
  const files = evidence.files || [];
  const maxNestedTry = evidence.maxNestedTry || 2;

  for (const file of files) {
    // Source: Tony363 bare_except → error (CRITICAL in our mapping)
    if ((file.bareCatchBlocks || 0) > 0) {
      findings.push(createFinding('LetItCrash', SEVERITY.CRITICAL,
        `${file.bareCatchBlocks} bare catch block(s) — catches all errors including system exits`,
        { file: file.path, suggestion: 'Catch specific error types. Bare catch swallows KeyboardInterrupt/SystemExit.' }
      ));
    }

    // Source: Tony363 except_pass → error (CRITICAL)
    if ((file.emptyCatchBlocks || 0) > 0) {
      findings.push(createFinding('LetItCrash', SEVERITY.CRITICAL,
        `${file.emptyCatchBlocks} empty catch block(s) silently swallow errors`,
        { file: file.path, suggestion: 'Log errors or re-throw. Never swallow exceptions silently.' }
      ));
    }

    // Source: Tony363 exception_swallowed → warning (broad Exception without re-raise)
    if ((file.broadCatchPatterns || 0) > 0) {
      const context = classifyFilePath(file.path);
      findings.push(createFinding('LetItCrash',
        context === 'core' ? SEVERITY.HIGH : SEVERITY.MEDIUM,
        `${file.broadCatchPatterns} overly broad catch clause(s) without re-raise (${context} context)`,
        { file: file.path, suggestion: 'Catch specific error types or re-throw after logging' }
      ));
    }

    // Source: Tony363 nested_try_except → warning
    if ((file.maxTryNestingDepth || 0) > maxNestedTry) {
      findings.push(createFinding('LetItCrash', SEVERITY.MEDIUM,
        `Try/catch nesting depth ${file.maxTryNestingDepth} exceeds ${maxNestedTry}`,
        { file: file.path, suggestion: 'Flatten error handling — extract try blocks into helper functions' }
      ));
    }

    if ((file.missingErrorHandling || 0) > 0) {
      findings.push(createFinding('LetItCrash', SEVERITY.LOW,
        `${file.missingErrorHandling} async operations without error handling`,
        { file: file.path, suggestion: 'Add try/catch or .catch() to async operations' }
      ));
    }
  }

  return {
    validator: 'LetItCrash',
    passed: findings.filter(f => f.severity === SEVERITY.CRITICAL || f.severity === SEVERITY.HIGH).length === 0,
    findings,
  };
}

function validateSecurityPolicy(evidence = {}) {
  const findings = [];
  const files = evidence.files || [];

  for (const file of files) {
    if (file.hardcodedSecrets > 0) {
      findings.push(createFinding('SecurityPolicy', SEVERITY.CRITICAL,
        `${file.hardcodedSecrets} hardcoded secrets detected`,
        { file: file.path, suggestion: 'Use environment variables or a secrets manager' }
      ));
    }

    if (file.unsanitizedInputs > 0) {
      findings.push(createFinding('SecurityPolicy', SEVERITY.CRITICAL,
        `${file.unsanitizedInputs} unsanitized user inputs used in queries/commands`,
        { file: file.path, suggestion: 'Validate and sanitize all user inputs at boundaries' }
      ));
    }

    if (file.sqlInjectionRisk > 0) {
      findings.push(createFinding('SecurityPolicy', SEVERITY.CRITICAL,
        `${file.sqlInjectionRisk} potential SQL injection vectors`,
        { file: file.path, suggestion: 'Use parameterized queries, never string concatenation' }
      ));
    }

    if (file.insecureCrypto > 0) {
      findings.push(createFinding('SecurityPolicy', SEVERITY.HIGH,
        `${file.insecureCrypto} uses of weak cryptographic algorithms`,
        { file: file.path, suggestion: 'Use SHA-256+ for hashing, AES-256 for encryption' }
      ));
    }

    if (file.missingAuthCheck > 0) {
      findings.push(createFinding('SecurityPolicy', SEVERITY.HIGH,
        `${file.missingAuthCheck} endpoints without authentication checks`,
        { file: file.path, suggestion: 'Add auth middleware to all protected routes' }
      ));
    }
  }

  return {
    validator: 'SecurityPolicy',
    passed: findings.filter(f => f.severity === SEVERITY.CRITICAL).length === 0,
    findings,
  };
}

function validateContextBudgetPolicy(evidence = {}) {
  const findings = [];
  const budget = evidence.contextBudget || {};

  if (budget.utilization > 0.85) {
    findings.push(createFinding('ContextBudgetPolicy', SEVERITY.HIGH,
      `Context utilization at ${Math.round(budget.utilization * 100)}% (critical threshold: 85%)`,
      { suggestion: 'Trigger compaction, reduce retrieval depth, checkpoint session' }
    ));
  } else if (budget.utilization > 0.70) {
    findings.push(createFinding('ContextBudgetPolicy', SEVERITY.MEDIUM,
      `Context utilization at ${Math.round(budget.utilization * 100)}% (warning threshold: 70%)`,
      { suggestion: 'Reduce retrieval expansion, prefer summaries' }
    ));
  }

  if (budget.pendingQueueSize > 100) {
    findings.push(createFinding('ContextBudgetPolicy', SEVERITY.MEDIUM,
      `${budget.pendingQueueSize} pending observations in queue`,
      { suggestion: 'Process or batch-compress pending observations' }
    ));
  }

  return {
    validator: 'ContextBudgetPolicy',
    passed: findings.filter(f => f.severity === SEVERITY.CRITICAL || f.severity === SEVERITY.HIGH).length === 0,
    findings,
  };
}

const ALL_VALIDATORS = {
  KISS: validateKISS,
  Purity: validatePurity,
  SOLID: validateSOLID,
  LetItCrash: validateLetItCrash,
  SecurityPolicy: validateSecurityPolicy,
  ContextBudgetPolicy: validateContextBudgetPolicy,
};

function runAllValidators(evidence = {}, options = {}) {
  const enabledValidators = options.validators
    ? options.validators.filter(name => ALL_VALIDATORS[name])
    : Object.keys(ALL_VALIDATORS);

  const results = [];
  let allPassed = true;

  for (const name of enabledValidators) {
    const result = ALL_VALIDATORS[name](evidence);
    results.push(result);
    if (!result.passed) {
      allPassed = false;
    }
  }

  const allFindings = results.flatMap(r => r.findings);
  const criticalCount = allFindings.filter(f => f.severity === SEVERITY.CRITICAL).length;
  const highCount = allFindings.filter(f => f.severity === SEVERITY.HIGH).length;
  const mediumCount = allFindings.filter(f => f.severity === SEVERITY.MEDIUM).length;

  return {
    passed: allPassed,
    validators: results,
    summary: {
      totalFindings: allFindings.length,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: allFindings.filter(f => f.severity === SEVERITY.LOW).length,
      info: allFindings.filter(f => f.severity === SEVERITY.INFO).length,
    },
    findings: allFindings,
  };
}

module.exports = {
  SEVERITY,
  KISS_THRESHOLDS,
  SOLID_THRESHOLDS,
  CORE_PATH_PATTERNS,
  SHELL_PATH_PATTERNS,
  IO_CALL_PATTERNS,
  createFinding,
  classifyFilePath,
  validateKISS,
  validatePurity,
  validateSOLID,
  validateLetItCrash,
  validateSecurityPolicy,
  validateContextBudgetPolicy,
  runAllValidators,
  ALL_VALIDATORS,
};
