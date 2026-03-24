#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const { createStateStore } = require('./lib/state-store');
const { createStableId } = require('./lib/fulcrum-control');
const { ensureDir } = require('./lib/utils');
const { createAttempt } = require('./attempt-cli');
const { loadBoard, saveBoard, createTask, upsertTask, attachAttempt, addFeedback } = require('./lib/parallel-board');

function showHelp(exitCode = 0) {
  console.log(`
Usage: node scripts/attempt-group-cli.js <command> [args...]

Commands:
  create <name>                    Create same-task isolated attempts for multiple agents
  compare <group-id>               Compare diffs for all attempts in a group
  feedback <group-id> <attempt> <message>
  retry <group-id> <attempt> <message>

Options:
  --db <path>                      Override SQLite state store path
  --json                           Emit machine-readable JSON
  --agents <csv>                   Agent/tool labels for create (default: claude,codex,gemini)
  --task <text>                    Shared task/objective for create
  --task-id <id>                   Attach attempts to an existing board task
  --base-ref <ref>                 Base git ref for create/compare (default: HEAD)
  --worktree-root <path>           Parent directory for worktrees
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  const parsed = {
    command: args[0],
    positional: [],
    dbPath: null,
    json: false,
    agents: ['claude', 'codex', 'gemini'],
    task: null,
    taskId: null,
    baseRef: 'HEAD',
    worktreeRoot: null,
  };

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--db') {
      parsed.dbPath = args[index + 1] || null;
      index += 1;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--agents') {
      parsed.agents = String(args[index + 1] || '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
      index += 1;
    } else if (arg === '--task') {
      parsed.task = args[index + 1] || null;
      index += 1;
    } else if (arg === '--task-id') {
      parsed.taskId = args[index + 1] || null;
      index += 1;
    } else if (arg === '--base-ref') {
      parsed.baseRef = args[index + 1] || 'HEAD';
      index += 1;
    } else if (arg === '--worktree-root') {
      parsed.worktreeRoot = args[index + 1] || null;
      index += 1;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      parsed.positional.push(arg);
    }
  }

  return parsed;
}

function getGroupDir(repoRoot, groupId) {
  return path.join(repoRoot, '.orchestration', 'attempt-groups', groupId);
}

function getGroupArtifactPaths(repoRoot, groupId) {
  const groupDir = getGroupDir(repoRoot, groupId);
  return {
    groupDir,
    manifestPath: path.join(groupDir, 'group.json'),
    comparisonJsonPath: path.join(groupDir, 'comparison.json'),
    comparisonMdPath: path.join(groupDir, 'comparison.md'),
    feedbackPath: path.join(groupDir, 'feedback.jsonl'),
  };
}

function writeGroupManifest(repoRoot, manifest) {
  const paths = getGroupArtifactPaths(repoRoot, manifest.groupId);
  ensureDir(paths.groupDir);
  fs.writeFileSync(paths.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return paths;
}

function readGroupManifest(repoRoot, groupId) {
  const paths = getGroupArtifactPaths(repoRoot, groupId);
  if (!fs.existsSync(paths.manifestPath)) {
    throw new Error(`Attempt group not found: ${groupId}`);
  }
  return JSON.parse(fs.readFileSync(paths.manifestPath, 'utf8'));
}

function createGroupId(name, task) {
  return createStableId('attempt-group', `${Date.now()}:${name}:${task || ''}`);
}

function updateBoardForGroup(repoRoot, options, taskId, attempts) {
  let board = loadBoard(repoRoot);
  let resolvedTaskId = taskId;

  if (!resolvedTaskId) {
    const task = createTask({
      title: options.positional.join(' '),
      description: options.task || '',
      objective: options.task || options.positional.join(' '),
      preferredAgents: options.agents,
      metadata: {
        createdBy: 'attempt-group-cli',
      },
    });
    board = upsertTask(board, task);
    resolvedTaskId = task.id;
  }

  for (const attempt of attempts) {
    board = attachAttempt(board, resolvedTaskId, {
      attemptId: attempt.id,
      agentName: attempt.metadata?.agentName || null,
      groupId: attempt.metadata?.groupId || null,
      attachedAt: new Date().toISOString(),
    });
  }

  saveBoard(board, repoRoot);
  return resolvedTaskId;
}

async function createAttemptGroup(options) {
  const repoRoot = path.resolve(options.repoRoot || process.cwd());
  const name = options.positional.join(' ').trim();
  if (!name) {
    throw new Error('create requires a group name');
  }

  const task = options.task || `Run parallel implementations for ${name}`;
  const groupId = createGroupId(name, task);
  const createdAttempts = [];

  for (const agentName of options.agents) {
    const created = await createAttempt({
      ...options,
      repoRoot,
      positional: [`${name}-${agentName}`],
      groupId,
      agentName,
      objective: task,
    });
    createdAttempts.push(created.attempt);
  }

  const taskId = updateBoardForGroup(repoRoot, options, options.taskId, createdAttempts);
  const manifest = {
    groupId,
    name,
    task,
    taskId,
    agents: options.agents,
    attempts: createdAttempts.map(attempt => ({
      id: attempt.id,
      branchName: attempt.branchName,
      worktreePath: attempt.worktreePath,
      agentName: attempt.metadata?.agentName || null,
    })),
    createdAt: new Date().toISOString(),
  };
  const paths = writeGroupManifest(repoRoot, manifest);

  return {
    ...manifest,
    manifestPath: paths.manifestPath,
  };
}

function findAttemptsByGroup(store, groupId) {
  const sessions = store.listRecentSessions({ limit: 500 }).sessions;
  const attempts = [];

  for (const session of sessions) {
    const detail = store.getSessionDetail(session.id);
    for (const attempt of detail.attempts || []) {
      if (attempt.metadata?.groupId === groupId) {
        attempts.push(attempt);
      }
    }
  }

  return attempts;
}

function runGit(repoRoot, args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function parseNumstat(output) {
  return output
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [insertions, deletions, filePath] = line.split('\t');
      return {
        filePath,
        insertions: insertions === '-' ? 0 : Number(insertions || 0),
        deletions: deletions === '-' ? 0 : Number(deletions || 0),
      };
    });
}

function summarizeAttemptDiff(repoRoot, baseRef, attempt) {
  const numstat = parseNumstat(runGit(repoRoot, ['diff', '--numstat', `${baseRef}...${attempt.branchName}`]));
  const files = numstat.map(entry => entry.filePath);
  return {
    attemptId: attempt.id,
    agentName: attempt.metadata?.agentName || null,
    branchName: attempt.branchName,
    worktreePath: attempt.worktreePath,
    fileCount: files.length,
    insertions: numstat.reduce((sum, entry) => sum + entry.insertions, 0),
    deletions: numstat.reduce((sum, entry) => sum + entry.deletions, 0),
    files,
    numstat,
  };
}

function buildPairwiseComparisons(summaries) {
  const pairs = [];
  for (let index = 0; index < summaries.length; index += 1) {
    for (let inner = index + 1; inner < summaries.length; inner += 1) {
      const left = summaries[index];
      const right = summaries[inner];
      const leftFiles = new Set(left.files);
      const rightFiles = new Set(right.files);
      const sharedFiles = left.files.filter(filePath => rightFiles.has(filePath));
      const leftOnly = left.files.filter(filePath => !rightFiles.has(filePath));
      const rightOnly = right.files.filter(filePath => !leftFiles.has(filePath));
      pairs.push({
        attempts: [left.attemptId, right.attemptId],
        agents: [left.agentName, right.agentName],
        sharedFiles,
        leftOnly,
        rightOnly,
      });
    }
  }
  return pairs;
}

function writeComparisonArtifacts(repoRoot, groupId, comparison) {
  const paths = getGroupArtifactPaths(repoRoot, groupId);
  ensureDir(paths.groupDir);
  fs.writeFileSync(paths.comparisonJsonPath, `${JSON.stringify(comparison, null, 2)}\n`, 'utf8');
  const markdown = [
    `# Attempt Group Comparison: ${groupId}`,
    '',
    `- Base ref: \`${comparison.baseRef}\``,
    `- Attempts: ${comparison.attempts.length}`,
    '',
    '## Per Attempt',
    ...comparison.attempts.flatMap(item => [
      `### ${item.attemptId} (${item.agentName || 'unknown'})`,
      `- Branch: \`${item.branchName}\``,
      `- Worktree: \`${item.worktreePath}\``,
      `- Files changed: ${item.fileCount}`,
      `- Insertions: ${item.insertions}`,
      `- Deletions: ${item.deletions}`,
      item.files.length > 0 ? `- Files: ${item.files.join(', ')}` : '- Files: none',
      '',
    ]),
    '## Pairwise Overlap',
    ...comparison.pairs.flatMap(pair => [
      `### ${pair.attempts.join(' vs ')}`,
      `- Shared files: ${pair.sharedFiles.join(', ') || 'none'}`,
      `- Left only: ${pair.leftOnly.join(', ') || 'none'}`,
      `- Right only: ${pair.rightOnly.join(', ') || 'none'}`,
      '',
    ]),
  ].join('\n');
  fs.writeFileSync(paths.comparisonMdPath, `${markdown}\n`, 'utf8');
  return paths;
}

async function compareAttemptGroup(options) {
  const groupId = options.positional[0];
  if (!groupId) {
    throw new Error('compare requires a group id');
  }

  const store = await createStateStore({
    dbPath: options.dbPath,
    homeDir: process.env.HOME,
  });

  try {
    const attempts = findAttemptsByGroup(store, groupId);
    if (attempts.length === 0) {
      throw new Error(`No attempts found for group: ${groupId}`);
    }

    const repoRoot = path.resolve(options.repoRoot || attempts[0].metadata?.repoRoot || process.cwd());
    const summaries = attempts.map(attempt => summarizeAttemptDiff(repoRoot, options.baseRef, attempt));
    const comparison = {
      groupId,
      baseRef: options.baseRef,
      attempts: summaries,
      pairs: buildPairwiseComparisons(summaries),
      comparedAt: new Date().toISOString(),
    };
    const paths = writeComparisonArtifacts(repoRoot, groupId, comparison);
    return {
      ...comparison,
      comparisonJsonPath: paths.comparisonJsonPath,
      comparisonMdPath: paths.comparisonMdPath,
    };
  } finally {
    store.close();
  }
}

function appendGroupFeedback(repoRoot, groupId, feedback) {
  const paths = getGroupArtifactPaths(repoRoot, groupId);
  ensureDir(paths.groupDir);
  fs.appendFileSync(paths.feedbackPath, `${JSON.stringify({
    ...feedback,
    createdAt: new Date().toISOString(),
  })}\n`, 'utf8');
  return paths.feedbackPath;
}

async function addGroupFeedback(options) {
  const [groupId, attemptId, ...messageParts] = options.positional;
  if (!groupId || !attemptId || messageParts.length === 0) {
    throw new Error('feedback requires <group-id> <attempt-id> <message>');
  }

  const repoRoot = path.resolve(options.repoRoot || process.cwd());
  const message = messageParts.join(' ');
  const feedbackPath = appendGroupFeedback(repoRoot, groupId, { attemptId, message });

  const board = loadBoard(repoRoot);
  const task = board.tasks.find(entry =>
    entry.attempts.some(attempt => attempt.attemptId === attemptId && attempt.groupId === groupId)
  );
  if (task) {
    const nextBoard = addFeedback(board, task.id, { attemptId, message, groupId });
    saveBoard(nextBoard, repoRoot);
  }

  return { groupId, attemptId, message, feedbackPath };
}

function buildRetryObjective(task, message, sourceAttempt) {
  const agentName = sourceAttempt.metadata?.agentName || 'unknown-agent';
  return [
    task,
    '',
    'Retry Guidance',
    `- Source attempt: ${sourceAttempt.id}`,
    `- Source agent: ${agentName}`,
    `- Requested revision: ${message}`,
  ].join('\n');
}

async function retryAttemptGroup(options) {
  const [groupId, attemptId, ...messageParts] = options.positional;
  if (!groupId || !attemptId || messageParts.length === 0) {
    throw new Error('retry requires <group-id> <attempt-id> <message>');
  }

  const repoRoot = path.resolve(options.repoRoot || process.cwd());
  const manifest = readGroupManifest(repoRoot, groupId);
  const message = messageParts.join(' ');

  const store = await createStateStore({
    dbPath: options.dbPath,
    homeDir: process.env.HOME,
  });

  try {
    const attempts = findAttemptsByGroup(store, groupId);
    const sourceAttempt = attempts.find(attempt => attempt.id === attemptId);
    if (!sourceAttempt) {
      throw new Error(`Attempt not found in group ${groupId}: ${attemptId}`);
    }

    const agentName = sourceAttempt.metadata?.agentName || manifest.attempts.find(attempt => attempt.id === attemptId)?.agentName || 'retry';
    const existingRetries = manifest.attempts.filter(attempt =>
      attempt.retryOf === attemptId && attempt.agentName === agentName
    ).length;
    const retryName = `${manifest.name}-${agentName}-retry-${existingRetries + 1}`;

    const created = await createAttempt({
      ...options,
      repoRoot,
      positional: [retryName],
      baseRef: sourceAttempt.branchName || options.baseRef || 'HEAD',
      worktreeRoot: options.worktreeRoot || path.dirname(sourceAttempt.worktreePath),
      groupId,
      agentName,
      parentAttemptId: sourceAttempt.id,
      objective: buildRetryObjective(manifest.task, message, sourceAttempt),
    });

    const nextAttemptEntry = {
      id: created.attempt.id,
      branchName: created.attempt.branchName,
      worktreePath: created.attempt.worktreePath,
      agentName,
      retryOf: sourceAttempt.id,
      retryReason: message,
    };
    const nextManifest = {
      ...manifest,
      attempts: [...manifest.attempts, nextAttemptEntry],
      updatedAt: new Date().toISOString(),
    };
    writeGroupManifest(repoRoot, nextManifest);

    let board = loadBoard(repoRoot);
    const task = board.tasks.find(entry => entry.id === manifest.taskId);
    if (task) {
      board = addFeedback(board, task.id, {
        attemptId: sourceAttempt.id,
        message,
        groupId,
        kind: 'retry-request',
      });
      board = attachAttempt(board, task.id, {
        attemptId: created.attempt.id,
        agentName,
        groupId,
        retryOf: sourceAttempt.id,
        attachedAt: new Date().toISOString(),
      });
      saveBoard(board, repoRoot);
    }

    const feedbackPath = appendGroupFeedback(repoRoot, groupId, {
      attemptId: sourceAttempt.id,
      message,
      kind: 'retry-request',
      retryAttemptId: created.attempt.id,
    });

    return {
      groupId,
      sourceAttemptId: sourceAttempt.id,
      retryAttempt: created.attempt,
      feedbackPath,
      manifestPath: getGroupArtifactPaths(repoRoot, groupId).manifestPath,
    };
  } finally {
    store.close();
  }
}

function printCreate(payload) {
  console.log(`Group: ${payload.groupId}`);
  console.log(`Task: ${payload.task}`);
  console.log(`Board task: ${payload.taskId}`);
  console.log(`Attempts: ${payload.attempts.length}`);
}

function printCompare(payload) {
  console.log(`Group: ${payload.groupId}`);
  console.log(`Attempts compared: ${payload.attempts.length}`);
  console.log(`Comparison JSON: ${payload.comparisonJsonPath}`);
  console.log(`Comparison Markdown: ${payload.comparisonMdPath}`);
}

function printFeedback(payload) {
  console.log(`Feedback stored for ${payload.attemptId} in ${payload.groupId}`);
  console.log(`Path: ${payload.feedbackPath}`);
}

function printRetry(payload) {
  console.log(`Retry created for ${payload.sourceAttemptId} in ${payload.groupId}`);
  console.log(`New attempt: ${payload.retryAttempt.id}`);
  console.log(`Branch: ${payload.retryAttempt.branchName}`);
  console.log(`Worktree: ${payload.retryAttempt.worktreePath}`);
}

async function main() {
  const options = parseArgs(process.argv);
  if (options.help) {
    showHelp(0);
  }

  let payload;
  if (options.command === 'create') {
    payload = await createAttemptGroup(options);
    if (options.json) console.log(JSON.stringify(payload, null, 2)); else printCreate(payload);
    return;
  }

  if (options.command === 'compare') {
    payload = await compareAttemptGroup(options);
    if (options.json) console.log(JSON.stringify(payload, null, 2)); else printCompare(payload);
    return;
  }

  if (options.command === 'feedback') {
    payload = await addGroupFeedback(options);
    if (options.json) console.log(JSON.stringify(payload, null, 2)); else printFeedback(payload);
    return;
  }

  if (options.command === 'retry') {
    payload = await retryAttemptGroup(options);
    if (options.json) console.log(JSON.stringify(payload, null, 2)); else printRetry(payload);
    return;
  }

  throw new Error(`Unknown command: ${options.command}`);
}

if (require.main === module) {
  main().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  addGroupFeedback,
  buildPairwiseComparisons,
  compareAttemptGroup,
  createAttemptGroup,
  findAttemptsByGroup,
  getGroupArtifactPaths,
  parseArgs,
  readGroupManifest,
  retryAttemptGroup,
  summarizeAttemptDiff,
};
