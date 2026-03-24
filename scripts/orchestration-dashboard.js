#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { collectSessionSnapshot } = require('./lib/orchestration-session');
const { loadBoard } = require('./lib/parallel-board');

function usage() {
  console.log([
    'Usage:',
    '  node scripts/orchestration-dashboard.js <session-name|plan.json> [--watch]',
    '  node scripts/orchestration-dashboard.js <session-name|plan.json> [--watch --interval 2]',
    '',
    'Examples:',
    '  node scripts/orchestration-dashboard.js workflow-visual-proof',
    '  node scripts/orchestration-dashboard.js .claude/plan/workflow-visual-proof.json',
    '  node scripts/orchestration-dashboard.js workflow-visual-proof --watch'
  ].join('\n'));
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const target = args.find(arg => !arg.startsWith('--'));
  const watch = args.includes('--watch');
  const intervalIndex = args.indexOf('--interval');
  const intervalSeconds = intervalIndex >= 0 ? Number(args[intervalIndex + 1]) : 2;

  return {
    target,
    watch,
    intervalMs: Number.isFinite(intervalSeconds) && intervalSeconds > 0 ? intervalSeconds * 1000 : 2000,
  };
}

function pad(value, width) {
  const text = String(value || '');
  if (text.length >= width) {
    return text;
  }
  return text + ' '.repeat(width - text.length);
}

function truncate(value, maxLength) {
  const text = String(value || '');
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
}

function readLogTail(repoRoot, attemptId, lineCount = 2) {
  if (!attemptId) {
    return [];
  }

  const logPath = path.join(repoRoot, '.orchestration', 'attempts', attemptId, 'attempt.log');
  if (!fs.existsSync(logPath)) {
    return [];
  }

  const lines = fs.readFileSync(logPath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return lines.slice(-lineCount);
}

function collectAttemptGroups(workers) {
  const ids = new Set();

  for (const worker of workers) {
    if (worker.status.attemptGroup) {
      ids.add(worker.status.attemptGroup);
    }
    if (worker.task.attemptGroup) {
      ids.add(worker.task.attemptGroup);
    }
  }

  return [...ids];
}

function findRelatedTask(board, attemptGroupIds) {
  return board.tasks.find(task => attemptGroupIds.includes(task.metadata?.attemptGroupId)) || null;
}

function formatWorkerState(worker) {
  if (worker.pane && worker.pane.dead) {
    return 'dead';
  }
  return worker.status.state || 'unknown';
}

function renderTaskPanel(task) {
  if (!task) {
    return [
      'Task',
      '----',
      'No linked board task found for this tmux/worktree session.',
    ].join('\n');
  }

  const preferredAgents = task.preferredAgents.length > 0
    ? task.preferredAgents.join(', ')
    : 'n/a';
  const feedback = task.feedback.slice(-3);

  return [
    'Task',
    '----',
    `Title: ${task.title}`,
    `Status: ${task.status}`,
    `Objective: ${task.objective || task.description || 'n/a'}`,
    `Preferred agents: ${preferredAgents}`,
    `Attempts: ${task.attempts.length}`,
    feedback.length > 0 ? 'Recent feedback:' : 'Recent feedback: none',
    ...feedback.map(entry => `- ${truncate(entry.message || '', 100)}`),
  ].join('\n');
}

function renderWorkersPanel(snapshot) {
  const lines = [
    'Workers',
    '-------',
    [
      pad('worker', 14),
      pad('state', 10),
      pad('pane', 8),
      pad('branch', 28),
      pad('command', 16),
      'log tail'
    ].join('  ')
  ];

  for (const worker of snapshot.workers) {
    const paneLabel = worker.pane
      ? `${worker.pane.windowIndex}.${worker.pane.paneIndex}`
      : '-';
    const logTail = readLogTail(snapshot.repoRoot, worker.status.attemptId || worker.task.attemptId)
      .join(' | ');

    lines.push([
      pad(truncate(worker.workerSlug, 14), 14),
      pad(truncate(formatWorkerState(worker), 10), 10),
      pad(truncate(paneLabel, 8), 8),
      pad(truncate(worker.status.branch || 'n/a', 28), 28),
      pad(truncate(worker.pane?.currentCommand || 'n/a', 16), 16),
      truncate(logTail || 'no log output yet', 72)
    ].join('  '));
  }

  if (snapshot.workers.length === 0) {
    lines.push('No worker coordination files found yet.');
  }

  return lines.join('\n');
}

function renderSummaryPanel(snapshot, task) {
  const workerStates = Object.entries(snapshot.workerStates)
    .map(([state, count]) => `${state}:${count}`)
    .join(', ') || 'none';

  return [
    'Session',
    '-------',
    `Name: ${snapshot.sessionName}`,
    `Active: ${snapshot.sessionActive ? 'yes' : 'no'}`,
    `Repo: ${snapshot.repoRoot}`,
    `Coordination: ${snapshot.coordinationDir}`,
    `Panes: ${snapshot.paneCount}`,
    `Workers: ${snapshot.workerCount}`,
    `Worker states: ${workerStates}`,
    `Attach: tmux attach -t ${snapshot.sessionName}`,
    task ? `Board task: ${task.id}` : 'Board task: none',
  ].join('\n');
}

function renderDashboard(snapshot) {
  const board = loadBoard(snapshot.repoRoot);
  const attemptGroupIds = collectAttemptGroups(snapshot.workers);
  const task = findRelatedTask(board, attemptGroupIds);
  const now = new Date().toISOString();

  return [
    `ECC Orchestration Dashboard  ${now}`,
    '',
    renderSummaryPanel(snapshot, task),
    '',
    renderWorkersPanel(snapshot),
    '',
    renderTaskPanel(task),
    '',
    'Hints',
    '-----',
    `Snapshot JSON: node scripts/orchestration-status.js ${snapshot.sessionName}`,
    `Parallel board: node scripts/parallel-board-cli.js list`,
  ].join('\n');
}

function renderTarget(target) {
  const snapshot = collectSessionSnapshot(target, process.cwd());
  return renderDashboard(snapshot);
}

function clearScreen() {
  process.stdout.write('\u001bc');
}

function runOnce(target) {
  process.stdout.write(`${renderTarget(target)}\n`);
}

function main() {
  const { target, watch, intervalMs } = parseArgs(process.argv);

  if (!target) {
    usage();
    process.exit(1);
  }

  if (!watch) {
    runOnce(target);
    return;
  }

  const render = () => {
    clearScreen();
    runOnce(target);
  };

  render();
  const timer = setInterval(render, intervalMs);

  const shutdown = () => {
    clearInterval(timer);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`[orchestration-dashboard] ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  collectAttemptGroups,
  findRelatedTask,
  parseArgs,
  readLogTail,
  renderDashboard,
  renderTarget,
};
