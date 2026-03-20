#!/usr/bin/env node
'use strict';

/**
 * Phase 6.4 - Agent Handoff Contracts
 * Source: awesome-claude-code-toolkit
 *
 * Defines per-role contracts (inputs, outputs, allowed mutations,
 * verification artifact) and a workflow execution ledger with
 * dependencies, success criteria, and status tracking.
 */

// --- Contract Schema ---

const CONTRACT_STATUSES = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
});

const VERIFICATION_METHODS = Object.freeze({
  TEST_PASS: 'test_pass',
  BUILD_SUCCESS: 'build_success',
  LINT_CLEAN: 'lint_clean',
  MANUAL_REVIEW: 'manual_review',
  COVERAGE_THRESHOLD: 'coverage_threshold',
  NONE: 'none',
});

// --- Per-Role Contract Definitions ---

function createContract(role, spec) {
  return Object.freeze({
    role,
    inputs: Object.freeze(spec.inputs || []),
    outputs: Object.freeze(spec.outputs || []),
    allowedMutations: Object.freeze(spec.allowedMutations || []),
    verificationArtifact: spec.verificationArtifact || null,
    verificationMethod: spec.verificationMethod || VERIFICATION_METHODS.NONE,
    preconditions: Object.freeze(spec.preconditions || []),
    postconditions: Object.freeze(spec.postconditions || []),
  });
}

const DEFAULT_CONTRACTS = Object.freeze({
  planner: createContract('planner', {
    inputs: ['task_description', 'codebase_context'],
    outputs: ['implementation_plan', 'risk_assessment', 'phase_breakdown'],
    allowedMutations: ['docs/', 'plans/'],
    verificationArtifact: 'implementation_plan',
    verificationMethod: VERIFICATION_METHODS.MANUAL_REVIEW,
    preconditions: ['task_description is non-empty'],
    postconditions: ['plan has at least one phase'],
  }),
  implementer: createContract('implementer', {
    inputs: ['implementation_plan', 'target_files'],
    outputs: ['modified_files', 'test_files'],
    allowedMutations: ['src/', 'lib/', 'scripts/', 'tests/'],
    verificationArtifact: 'modified_files',
    verificationMethod: VERIFICATION_METHODS.BUILD_SUCCESS,
    preconditions: ['implementation_plan exists'],
    postconditions: ['all modified files compile', 'no new lint errors'],
  }),
  tester: createContract('tester', {
    inputs: ['modified_files', 'implementation_plan'],
    outputs: ['test_results', 'coverage_report'],
    allowedMutations: ['tests/', '__tests__/', '*.test.*', '*.spec.*'],
    verificationArtifact: 'test_results',
    verificationMethod: VERIFICATION_METHODS.COVERAGE_THRESHOLD,
    preconditions: ['modified_files exist'],
    postconditions: ['coverage >= 80%', 'all tests pass'],
  }),
  reviewer: createContract('reviewer', {
    inputs: ['modified_files', 'test_results'],
    outputs: ['review_findings', 'approval_status'],
    allowedMutations: [],
    verificationArtifact: 'review_findings',
    verificationMethod: VERIFICATION_METHODS.NONE,
    preconditions: ['modified_files list is non-empty'],
    postconditions: ['all CRITICAL findings addressed'],
  }),
  'security-reviewer': createContract('security-reviewer', {
    inputs: ['modified_files', 'review_findings'],
    outputs: ['security_findings', 'security_approval'],
    allowedMutations: [],
    verificationArtifact: 'security_findings',
    verificationMethod: VERIFICATION_METHODS.NONE,
    preconditions: ['modified_files list is non-empty'],
    postconditions: ['no CRITICAL vulnerabilities'],
  }),
});

// --- Contract Validation ---

function validateHandoff(fromRole, toRole, artifacts, contracts = DEFAULT_CONTRACTS) {
  const fromContract = contracts[fromRole];
  const toContract = contracts[toRole];

  if (!fromContract) {
    return { valid: false, errors: [`no contract defined for source role: ${fromRole}`] };
  }
  if (!toContract) {
    return { valid: false, errors: [`no contract defined for target role: ${toRole}`] };
  }

  const errors = [];

  // Check that fromRole's outputs satisfy toRole's inputs
  const provided = new Set(Object.keys(artifacts || {}));
  for (const required of toContract.inputs) {
    if (!provided.has(required)) {
      errors.push(`missing required input for ${toRole}: ${required}`);
    }
  }

  // Check fromRole postconditions are met (simplified string match)
  for (const postcondition of fromContract.postconditions) {
    if (artifacts._postconditionsFailed?.includes(postcondition)) {
      errors.push(`postcondition not met by ${fromRole}: ${postcondition}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    fromRole,
    toRole,
    providedArtifacts: [...provided],
    requiredInputs: [...toContract.inputs],
  };
}

// --- Workflow Execution Ledger ---

function createLedger(workflowName) {
  return {
    workflowName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps: [],
    status: CONTRACT_STATUSES.PENDING,
  };
}

function addStep(ledger, step) {
  const newStep = {
    id: `step-${ledger.steps.length + 1}`,
    role: step.role,
    description: step.description || '',
    dependencies: Object.freeze(step.dependencies || []),
    successCriteria: Object.freeze(step.successCriteria || []),
    outputs: step.outputs || {},
    verificationMethod: step.verificationMethod || VERIFICATION_METHODS.NONE,
    status: CONTRACT_STATUSES.PENDING,
    startedAt: null,
    completedAt: null,
    error: null,
  };

  return {
    ...ledger,
    steps: [...ledger.steps, newStep],
    updatedAt: new Date().toISOString(),
  };
}

function startStep(ledger, stepId) {
  return {
    ...ledger,
    steps: ledger.steps.map(s =>
      s.id === stepId
        ? { ...s, status: CONTRACT_STATUSES.IN_PROGRESS, startedAt: new Date().toISOString() }
        : s
    ),
    status: CONTRACT_STATUSES.IN_PROGRESS,
    updatedAt: new Date().toISOString(),
  };
}

function completeStep(ledger, stepId, outputs = {}) {
  const updatedSteps = ledger.steps.map(s =>
    s.id === stepId
      ? { ...s, status: CONTRACT_STATUSES.COMPLETED, outputs, completedAt: new Date().toISOString() }
      : s
  );

  const allComplete = updatedSteps.every(
    s => s.status === CONTRACT_STATUSES.COMPLETED || s.status === CONTRACT_STATUSES.SKIPPED
  );

  return {
    ...ledger,
    steps: updatedSteps,
    status: allComplete ? CONTRACT_STATUSES.COMPLETED : ledger.status,
    updatedAt: new Date().toISOString(),
  };
}

function failStep(ledger, stepId, error) {
  return {
    ...ledger,
    steps: ledger.steps.map(s =>
      s.id === stepId
        ? { ...s, status: CONTRACT_STATUSES.FAILED, error, completedAt: new Date().toISOString() }
        : s
    ),
    status: CONTRACT_STATUSES.FAILED,
    updatedAt: new Date().toISOString(),
  };
}

function canStartStep(ledger, stepId) {
  const step = ledger.steps.find(s => s.id === stepId);
  if (!step) return { canStart: false, reason: `step ${stepId} not found` };
  if (step.status !== CONTRACT_STATUSES.PENDING) {
    return { canStart: false, reason: `step is ${step.status}, not pending` };
  }

  for (const depId of step.dependencies) {
    const dep = ledger.steps.find(s => s.id === depId);
    if (!dep) return { canStart: false, reason: `dependency ${depId} not found` };
    if (dep.status !== CONTRACT_STATUSES.COMPLETED) {
      return { canStart: false, reason: `dependency ${depId} is ${dep.status}, not completed` };
    }
  }

  return { canStart: true, reason: null };
}

function getLedgerSummary(ledger) {
  const counts = {};
  for (const s of ledger.steps) {
    counts[s.status] = (counts[s.status] || 0) + 1;
  }

  return {
    workflowName: ledger.workflowName,
    status: ledger.status,
    totalSteps: ledger.steps.length,
    statusCounts: counts,
    createdAt: ledger.createdAt,
    updatedAt: ledger.updatedAt,
  };
}

module.exports = {
  CONTRACT_STATUSES,
  VERIFICATION_METHODS,
  DEFAULT_CONTRACTS,
  createContract,
  validateHandoff,
  createLedger,
  addStep,
  startStep,
  completeStep,
  failStep,
  canStartStep,
  getLedgerSummary,
};
