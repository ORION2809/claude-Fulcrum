#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const {
  buildOrchestrationPlan,
  executePlan,
  materializePlan
} = require('./lib/tmux-worktree-orchestrator');
const {
  createTask,
  loadBoard,
  saveBoard,
  upsertTask,
  attachAttempt,
} = require('./lib/parallel-board');
const { ensureDir } = require('./lib/utils');
const { getGroupArtifactPaths } = require('./attempt-group-cli');

function usage() {
  console.log([
    'Usage:',
    '  node scripts/orchestrate-worktrees.js <plan.json> [--execute]',
    '  node scripts/orchestrate-worktrees.js <plan.json> [--write-only]',
    '',
    'Placeholders supported in launcherCommand:',
    '  {worker_name} {worker_slug} {session_name} {repo_root}',
    '  {worktree_path} {branch_name} {task_file} {handoff_file} {status_file}',
    '',
    'Without flags the script prints a dry-run plan only.'
  ].join('\n'));
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const planPath = args.find(arg => !arg.startsWith('--'));
  return {
    execute: args.includes('--execute'),
    planPath,
    writeOnly: args.includes('--write-only')
  };
}

function loadPlanConfig(planPath) {
  const absolutePath = path.resolve(planPath);
  const raw = fs.readFileSync(absolutePath, 'utf8');
  const config = JSON.parse(raw);
  config.repoRoot = config.repoRoot || process.cwd();
  return { absolutePath, config };
}

function deriveTaskTitle(config, plan) {
  return String(config.title || config.sessionName || plan.sessionName || 'Parallel Orchestration').trim();
}

function deriveTaskObjective(config, plan) {
  if (typeof config.task === 'string' && config.task.trim().length > 0) {
    return config.task.trim();
  }

  if (typeof config.objective === 'string' && config.objective.trim().length > 0) {
    return config.objective.trim();
  }

  return plan.workerPlans.map(worker => `${worker.workerName}: ${worker.task}`).join(' | ');
}

function buildGroupManifest(config, plan, taskId) {
  return {
    groupId: plan.attemptGroupId,
    name: deriveTaskTitle(config, plan),
    task: deriveTaskObjective(config, plan),
    taskId,
    agents: plan.workerPlans.map(worker => worker.workerSlug),
    attempts: plan.workerPlans.map(worker => ({
      id: worker.attemptId,
      branchName: worker.branchName,
      worktreePath: worker.worktreePath,
      agentName: worker.workerName,
    })),
    createdAt: new Date().toISOString(),
  };
}

function syncParallelControlPlane(config, plan) {
  const repoRoot = path.resolve(plan.repoRoot);
  const existingBoard = loadBoard(repoRoot);
  const existingTask = existingBoard.tasks.find(task =>
    task.metadata?.attemptGroupId === plan.attemptGroupId
  );

  let board = existingBoard;
  const task = existingTask || createTask({
    title: deriveTaskTitle(config, plan),
    description: deriveTaskObjective(config, plan),
    objective: deriveTaskObjective(config, plan),
    preferredAgents: plan.workerPlans.map(worker => worker.workerSlug),
    metadata: {
      createdBy: 'orchestrate-worktrees',
      attemptGroupId: plan.attemptGroupId,
      sessionName: plan.sessionName,
    },
  });

  board = upsertTask(board, task);
  for (const worker of plan.workerPlans) {
    board = attachAttempt(board, task.id, {
      attemptId: worker.attemptId,
      agentName: worker.workerName,
      groupId: plan.attemptGroupId,
      attachedAt: new Date().toISOString(),
    });
  }
  saveBoard(board, repoRoot);

  const manifest = buildGroupManifest(config, plan, task.id);
  const artifactPaths = getGroupArtifactPaths(repoRoot, plan.attemptGroupId);
  ensureDir(artifactPaths.groupDir);
  fs.writeFileSync(artifactPaths.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return {
    taskId: task.id,
    manifestPath: artifactPaths.manifestPath,
  };
}

function printDryRun(plan, absolutePath) {
  const artifactPaths = getGroupArtifactPaths(plan.repoRoot, plan.attemptGroupId);
  const preview = {
    planFile: absolutePath,
    sessionName: plan.sessionName,
    repoRoot: plan.repoRoot,
    coordinationDir: plan.coordinationDir,
    attemptGroupId: plan.attemptGroupId,
    manifestPath: artifactPaths.manifestPath,
    workers: plan.workerPlans.map(worker => ({
      workerName: worker.workerName,
      attemptId: worker.attemptId,
      branchName: worker.branchName,
      worktreePath: worker.worktreePath,
      seedPaths: worker.seedPaths,
      taskFilePath: worker.taskFilePath,
      handoffFilePath: worker.handoffFilePath,
      launchCommand: worker.launchCommand
    })),
    commands: [
      ...plan.workerPlans.map(worker => worker.gitCommand),
      ...plan.tmuxCommands.map(command => [command.cmd, ...command.args].join(' '))
    ]
  };

  console.log(JSON.stringify(preview, null, 2));
}

function main() {
  const { execute, planPath, writeOnly } = parseArgs(process.argv);

  if (!planPath) {
    usage();
    process.exit(1);
  }

  const { absolutePath, config } = loadPlanConfig(planPath);
  const plan = buildOrchestrationPlan(config);

  if (writeOnly) {
    const controlPlane = syncParallelControlPlane(config, plan);
    materializePlan(plan);
    console.log(`Wrote orchestration files to ${plan.coordinationDir}`);
    console.log(`Parallel manifest: ${controlPlane.manifestPath}`);
    console.log(`Board task: ${controlPlane.taskId}`);
    return;
  }

  if (!execute) {
    printDryRun(plan, absolutePath);
    return;
  }

  const controlPlane = syncParallelControlPlane(config, plan);
  const result = executePlan(plan);
  console.log([
    `Started tmux session '${result.sessionName}' with ${result.workerCount} worker panes.`,
    `Coordination files: ${result.coordinationDir}`,
    `Parallel manifest: ${controlPlane.manifestPath}`,
    `Board task: ${controlPlane.taskId}`,
    `Attach with: tmux attach -t ${result.sessionName}`
  ].join('\n'));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`[orchestrate-worktrees] ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  buildGroupManifest,
  deriveTaskObjective,
  deriveTaskTitle,
  main,
  syncParallelControlPlane,
};
