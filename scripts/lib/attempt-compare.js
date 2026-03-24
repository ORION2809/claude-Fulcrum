#!/usr/bin/env node
/**
 * Attempt Compare — Multi-agent parallel comparison via tmux-worktree-orchestrator
 *
 * Takes a task description and spawns multiple workers (implementer, reviewer, tester)
 * using isolated git worktrees and tmux panes. After completion, diffs outputs and
 * generates a comparison report.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {
  buildOrchestrationPlan,
  materializePlan,
  executePlan,
} = require('./tmux-worktree-orchestrator');
const { createStableId, ensureControlPlaneDirs, getRepoRoot } = require('./fulcrum-control');

const DEFAULT_WORKERS = 3;
const DEFAULT_PERSONAS = ['implementer', 'reviewer', 'tester'];

function parseCompareArgs(args = []) {
  const result = {
    task: '',
    workers: DEFAULT_WORKERS,
    personas: [...DEFAULT_PERSONAS],
  };

  const remaining = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--workers' && args[i + 1]) {
      result.workers = Math.max(1, Math.min(6, Number(args[i + 1]) || DEFAULT_WORKERS));
      i += 1;
    } else {
      remaining.push(args[i]);
    }
  }

  result.task = remaining.join(' ').trim();
  // Adjust personas array to match worker count
  while (result.personas.length < result.workers) {
    result.personas.push(`worker-${result.personas.length + 1}`);
  }
  result.personas = result.personas.slice(0, result.workers);

  return result;
}

function buildCompareWorkers(task, personas) {
  return personas.map((persona, index) => ({
    id: `compare-${persona}-${index}`,
    persona,
    task,
    branchSuffix: `compare/${persona}`,
  }));
}

function collectWorkerOutputs(plan, repoRoot) {
  const outputs = [];

  for (const worker of plan.workers || []) {
    const coordDir = worker.coordinationDir || path.join(repoRoot, '.orchestration', worker.id);
    const statusPath = path.join(coordDir, 'status.md');
    const logPath = path.join(coordDir, 'log');

    const status = fs.existsSync(statusPath) ? fs.readFileSync(statusPath, 'utf8') : '';
    const log = fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').slice(-2000) : '';

    outputs.push({
      workerId: worker.id,
      persona: worker.persona || worker.id,
      worktreePath: worker.worktreePath || '',
      status,
      log,
    });
  }

  return outputs;
}

function buildComparisonReport(task, outputs, timestamp) {
  const lines = [
    `# Attempt Compare Report`,
    '',
    `**Task:** ${task}`,
    `**Generated:** ${timestamp}`,
    `**Workers:** ${outputs.length}`,
    '',
    '---',
    '',
  ];

  for (const output of outputs) {
    lines.push(`## Worker: ${output.persona}`);
    lines.push('');
    lines.push(`**Worktree:** ${output.worktreePath}`);
    lines.push('');

    if (output.status) {
      lines.push('### Status');
      lines.push('```');
      lines.push(output.status.slice(0, 1000));
      lines.push('```');
      lines.push('');
    }

    if (output.log) {
      lines.push('### Log (tail)');
      lines.push('```');
      lines.push(output.log.slice(-800));
      lines.push('```');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  lines.push('## Summary');
  lines.push('');
  lines.push(`${outputs.length} workers executed the same task with different personas.`);
  lines.push('Review the outputs above to compare approaches.');
  lines.push('');

  return lines.join('\n');
}

async function runCompare(task, options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();
  const workers = options.workers || DEFAULT_WORKERS;
  const personas = options.personas || DEFAULT_PERSONAS.slice(0, workers);

  ensureControlPlaneDirs(repoRoot);

  const compareId = createStableId('compare', `${task}:${Date.now()}`);
  const workerSpecs = buildCompareWorkers(task, personas);

  const plan = buildOrchestrationPlan({
    taskDescription: task,
    workers: workerSpecs,
    repoRoot,
    sessionName: `compare-${compareId.slice(-8)}`,
  });

  const materialized = await materializePlan(plan, { repoRoot });
  const executed = await executePlan(materialized, { repoRoot });

  const outputs = collectWorkerOutputs(executed, repoRoot);
  const timestamp = new Date().toISOString();
  const report = buildComparisonReport(task, outputs, timestamp);

  const reportDir = path.join(repoRoot, '.orchestration', 'compare-reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `${compareId}.md`);
  fs.writeFileSync(reportPath, report, 'utf8');

  return {
    compareId,
    reportPath,
    workers: outputs.length,
    report,
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const parsed = parseCompareArgs(args);

  if (!parsed.task) {
    process.stderr.write('Usage: attempt-compare <task> [--workers <n>]\n');
    process.exit(1);
  }

  runCompare(parsed.task, {
    workers: parsed.workers,
    personas: parsed.personas,
  })
    .then(result => {
      process.stdout.write(`Compare complete: ${result.reportPath}\n`);
    })
    .catch(error => {
      process.stderr.write(`[attempt-compare] ${error.message}\n`);
      process.exit(1);
    });
}

module.exports = {
  buildCompareWorkers,
  buildComparisonReport,
  collectWorkerOutputs,
  parseCompareArgs,
  runCompare,
};
