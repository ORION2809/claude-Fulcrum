#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const { createStateStore } = require('./lib/state-store');
const { appendGovernanceEvent } = require('./lib/governance-log');
const { getPlatformName, hashValue } = require('./lib/fulcrum-control');
const { slugify } = require('./lib/tmux-worktree-orchestrator');

function showHelp(exitCode = 0) {
  console.log(`
Usage: node scripts/attempt-cli.js <command> [args...]

Commands:
  create <name>         Create an isolated attempt with its own branch/worktree
  status                Show recent attempts and worktree health
  rehydrate <attempt>   Recreate a missing worktree for an existing attempt

Options:
  --db <path>           Override SQLite state store path
  --json                Emit machine-readable JSON
  --limit <n>           Limit recent attempts for status (default: 10)
  --base-ref <ref>      Base git ref for create (default: HEAD)
  --worktree-root <p>   Parent directory for new worktrees
  --session-id <id>     Reuse an existing session id for create
  --parent-attempt <id> Parent attempt id for branching experiments
  --group-id <id>       Associate the attempt with an attempt group
  --agent <name>        Record the target agent/tool for this attempt
  --objective <text>    Override the generated attempt objective
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
    limit: 10,
    baseRef: 'HEAD',
    worktreeRoot: null,
    sessionId: null,
    parentAttemptId: null,
    groupId: null,
    agentName: null,
    objective: null,
  };

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--db') {
      parsed.dbPath = args[index + 1] || null;
      index += 1;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--limit') {
      parsed.limit = Number(args[index + 1] || 10);
      index += 1;
    } else if (arg === '--base-ref') {
      parsed.baseRef = args[index + 1] || 'HEAD';
      index += 1;
    } else if (arg === '--worktree-root') {
      parsed.worktreeRoot = args[index + 1] || null;
      index += 1;
    } else if (arg === '--session-id') {
      parsed.sessionId = args[index + 1] || null;
      index += 1;
    } else if (arg === '--parent-attempt') {
      parsed.parentAttemptId = args[index + 1] || null;
      index += 1;
    } else if (arg === '--group-id') {
      parsed.groupId = args[index + 1] || null;
      index += 1;
    } else if (arg === '--agent') {
      parsed.agentName = args[index + 1] || null;
      index += 1;
    } else if (arg === '--objective') {
      parsed.objective = args[index + 1] || null;
      index += 1;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      parsed.positional.push(arg);
    }
  }

  return parsed;
}

function runGit(repoRoot, args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function gitCommandSucceeds(repoRoot, args) {
  const result = spawnSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return result.status === 0;
}

function ensureGitRepo(repoRoot) {
  const inside = runGit(repoRoot, ['rev-parse', '--is-inside-work-tree']);
  if (inside !== 'true') {
    throw new Error('Current directory is not a git worktree');
  }
}

function buildAttemptIdentifiers(repoRoot, name, timestamp) {
  const slug = slugify(name, 'attempt');
  const suffix = hashValue(`${repoRoot}:${slug}:${timestamp}`).slice(0, 8);
  return {
    slug,
    suffix,
    attemptId: `attempt-${slug}-${suffix}`,
    sessionId: `session-${slug}-${suffix}`,
    branchName: `attempt/${slug}-${suffix}`,
  };
}

function ensureParentDir(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

function writeAttemptArtifacts(artifactPaths, payload) {
  ensureParentDir(artifactPaths.attemptFile);
  fs.writeFileSync(artifactPaths.attemptFile, [
    `# Attempt: ${payload.name}`,
    '',
    `- Attempt: \`${payload.attemptId}\``,
    `- Session: \`${payload.sessionId}\``,
    `- Branch: \`${payload.branchName}\``,
    `- Worktree: \`${payload.worktreePath}\``,
    `- Base ref: \`${payload.baseRef}\``,
    `- Status: \`${payload.status}\``,
    payload.groupId ? `- Group: \`${payload.groupId}\`` : null,
    payload.agentName ? `- Agent: \`${payload.agentName}\`` : null,
    payload.parentAttemptId ? `- Parent attempt: \`${payload.parentAttemptId}\`` : null,
    '',
    '## Objective',
    payload.objective,
    '',
    '## Telemetry',
    `- Status file: \`${artifactPaths.statusFile}\``,
    `- Queue file: \`${artifactPaths.queueFile}\``,
    `- Log file: \`${artifactPaths.logFile}\``,
  ].filter(Boolean).join('\n') + '\n', 'utf8');

  fs.writeFileSync(artifactPaths.statusFile, [
    `# Status: ${payload.name}`,
    '',
    `- State: ${payload.status}`,
    `- Updated: ${payload.updatedAt}`,
    `- Attempt: \`${payload.attemptId}\``,
    `- Branch: \`${payload.branchName}\``,
    `- Worktree: \`${payload.worktreePath}\``,
  ].join('\n') + '\n', 'utf8');

  fs.writeFileSync(artifactPaths.queueFile, '[]\n', 'utf8');
  fs.writeFileSync(artifactPaths.logFile, '', 'utf8');
}

function buildArtifactPaths(repoRoot, attemptId) {
  const coordinationDir = path.join(repoRoot, '.orchestration', 'attempts', attemptId);
  return {
    coordinationDir,
    attemptFile: path.join(coordinationDir, 'attempt.md'),
    statusFile: path.join(coordinationDir, 'status.md'),
    queueFile: path.join(coordinationDir, 'queue.json'),
    logFile: path.join(coordinationDir, 'attempt.log'),
  };
}

function cleanupCreatedAttempt(repoRoot, worktreePath, branchName, coordinationDir) {
  try {
    if (gitCommandSucceeds(repoRoot, ['worktree', 'list', '--porcelain'])) {
      spawnSync('git', ['worktree', 'remove', '--force', worktreePath], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      spawnSync('git', ['worktree', 'prune', '--expire', 'now'], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    }
  } catch (_error) {
    // Best-effort rollback.
  }

  if (fs.existsSync(worktreePath)) {
    fs.rmSync(worktreePath, { recursive: true, force: true });
  }

  if (gitCommandSucceeds(repoRoot, ['show-ref', '--verify', '--quiet', `refs/heads/${branchName}`])) {
    spawnSync('git', ['branch', '-D', branchName], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  if (coordinationDir && fs.existsSync(coordinationDir)) {
    fs.rmSync(coordinationDir, { recursive: true, force: true });
  }
}

async function createAttempt(options) {
  const repoRoot = path.resolve(options.repoRoot || process.cwd());
  ensureGitRepo(repoRoot);

  const timestamp = new Date().toISOString();
  const name = options.positional[0];
  if (!name) {
    throw new Error('create requires an attempt name');
  }

  const ids = buildAttemptIdentifiers(repoRoot, name, timestamp);
  const attemptId = ids.attemptId;
  const sessionId = options.sessionId || ids.sessionId;
  const branchName = ids.branchName;
  const repoName = path.basename(repoRoot);
  const worktreeRoot = path.resolve(options.worktreeRoot || path.dirname(repoRoot));
  const worktreePath = path.join(worktreeRoot, `${repoName}-${ids.slug}-${ids.suffix}`);
  const artifactPaths = buildArtifactPaths(repoRoot, attemptId);

  if (fs.existsSync(worktreePath)) {
    throw new Error(`Worktree path already exists: ${worktreePath}`);
  }
  if (gitCommandSucceeds(repoRoot, ['show-ref', '--verify', '--quiet', `refs/heads/${branchName}`])) {
    throw new Error(`Branch already exists: ${branchName}`);
  }

  runGit(repoRoot, ['worktree', 'add', '-b', branchName, worktreePath, options.baseRef]);

  let store = null;
  try {
    store = await createStateStore({
      dbPath: options.dbPath,
      homeDir: process.env.HOME,
    });

    const snapshot = {
      sourceTarget: {
        type: 'attempt-cli',
        name,
      },
      workers: [
        {
          id: attemptId,
          label: name,
          state: 'ready',
          branch: branchName,
          worktree: worktreePath,
        }
      ],
      coordinationDir: artifactPaths.coordinationDir,
    };

    store.upsertSession({
      id: sessionId,
      adapterId: 'attempt-cli',
      harness: getPlatformName(),
      state: 'active',
      repoRoot,
      startedAt: timestamp,
      endedAt: null,
      snapshot,
    });

    const attempt = store.upsertAttempt({
      id: attemptId,
      sessionId,
      parentAttemptId: options.parentAttemptId,
      branchName,
      worktreePath,
      status: 'ready',
      metadata: {
        name,
        objective: options.objective || `Fresh isolated attempt for ${name}`,
        baseRef: options.baseRef,
        repoRoot,
        coordinationDir: artifactPaths.coordinationDir,
        queueFile: artifactPaths.queueFile,
        statusFile: artifactPaths.statusFile,
        logFile: artifactPaths.logFile,
        platform: getPlatformName(),
        groupId: options.groupId,
        agentName: options.agentName,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    writeAttemptArtifacts(artifactPaths, {
      name,
      attemptId,
      sessionId,
      branchName,
      worktreePath,
      baseRef: options.baseRef,
      status: 'ready',
      objective: options.objective || `Fresh isolated attempt for ${name}`,
      parentAttemptId: options.parentAttemptId,
      groupId: options.groupId,
      agentName: options.agentName,
      updatedAt: timestamp,
    });

    await appendGovernanceEvent({
      eventType: 'attempt_create',
      decision: 'created',
      reason: `Created isolated attempt ${attemptId}`,
      sessionId,
      attemptId,
      artifactRef: {
        type: 'attempt',
        path: artifactPaths.attemptFile,
      },
      payload: {
        branchName,
        worktreePath,
        baseRef: options.baseRef,
        groupId: options.groupId,
        agentName: options.agentName,
      },
    }, {
      repoRoot,
      dbPath: options.dbPath,
    });

    return {
      attempt,
      sessionId,
      coordinationDir: artifactPaths.coordinationDir,
      attemptFile: artifactPaths.attemptFile,
      statusFile: artifactPaths.statusFile,
      queueFile: artifactPaths.queueFile,
      logFile: artifactPaths.logFile,
    };
  } catch (error) {
    cleanupCreatedAttempt(repoRoot, worktreePath, branchName, artifactPaths.coordinationDir);
    throw error;
  } finally {
    if (store) {
      store.close();
    }
  }
}

function collectAttemptStatus(store, options = {}) {
  const status = store.getStatus({
    activeLimit: options.limit,
    recentSkillRunLimit: 5,
    pendingLimit: 5,
  });

  return {
    totalCount: status.attempts.totalCount,
    activeCount: status.attempts.activeCount,
    recent: status.attempts.recent.map(attempt => ({
      ...attempt,
      worktreeExists: fs.existsSync(attempt.worktreePath),
      coordinationDir: attempt.metadata?.coordinationDir || null,
      coordinationExists: attempt.metadata?.coordinationDir
        ? fs.existsSync(attempt.metadata.coordinationDir)
        : false,
    })),
  };
}

function findAttemptById(store, attemptId, options = {}) {
  const recentSessions = store.listRecentSessions({ limit: options.limit || 200 }).sessions;
  for (const session of recentSessions) {
    const detail = store.getSessionDetail(session.id);
    const found = (detail.attempts || []).find(attempt => attempt.id === attemptId);
    if (found) {
      return {
        session: detail.session,
        attempt: found,
      };
    }
  }
  return null;
}

async function rehydrateAttempt(options) {
  const attemptId = options.positional[0];
  if (!attemptId) {
    throw new Error('rehydrate requires an attempt id');
  }

  let store = null;
  try {
    store = await createStateStore({
      dbPath: options.dbPath,
      homeDir: process.env.HOME,
    });

    const found = findAttemptById(store, attemptId, { limit: Math.max(options.limit || 10, 200) });
    if (!found) {
      throw new Error(`Attempt not found: ${attemptId}`);
    }

    const repoRoot = found.session.repoRoot || found.attempt.metadata?.repoRoot || process.cwd();
    ensureGitRepo(repoRoot);

    if (fs.existsSync(found.attempt.worktreePath)) {
      return {
        attempt: found.attempt,
        rehydrated: false,
        reason: 'Worktree already exists',
      };
    }

    runGit(repoRoot, ['worktree', 'prune', '--expire', 'now']);
    runGit(repoRoot, ['worktree', 'add', found.attempt.worktreePath, found.attempt.branchName]);

    const updatedAt = new Date().toISOString();
    const updated = store.upsertAttempt({
      ...found.attempt,
      status: 'rehydrated',
      metadata: {
        ...(found.attempt.metadata || {}),
        lastRehydratedAt: updatedAt,
      },
      updatedAt,
    });

    const statusFile = updated.metadata?.statusFile;
    if (statusFile) {
      ensureParentDir(statusFile);
      fs.writeFileSync(statusFile, [
        `# Status: ${updated.metadata?.name || updated.id}`,
        '',
        '- State: rehydrated',
        `- Updated: ${updatedAt}`,
        `- Attempt: \`${updated.id}\``,
        `- Branch: \`${updated.branchName}\``,
        `- Worktree: \`${updated.worktreePath}\``,
      ].join('\n') + '\n', 'utf8');
    }

    await appendGovernanceEvent({
      eventType: 'attempt_rehydrate',
      decision: 'recreated',
      reason: `Rehydrated missing worktree for ${updated.id}`,
      sessionId: updated.sessionId,
      attemptId: updated.id,
      artifactRef: {
        type: 'attempt',
        path: updated.metadata?.statusFile || null,
      },
      payload: {
        branchName: updated.branchName,
        worktreePath: updated.worktreePath,
      },
    }, {
      repoRoot,
      dbPath: options.dbPath,
    });

    return {
      attempt: updated,
      rehydrated: true,
    };
  } finally {
    if (store) {
      store.close();
    }
  }
}

function printCreateResult(payload) {
  console.log(`Attempt: ${payload.attempt.id}`);
  console.log(`Session: ${payload.sessionId}`);
  console.log(`Branch: ${payload.attempt.branchName}`);
  console.log(`Worktree: ${payload.attempt.worktreePath}`);
  console.log(`Coordination: ${payload.coordinationDir}`);
}

function printStatusResult(payload) {
  console.log(`Attempts: ${payload.totalCount}`);
  console.log(`Active: ${payload.activeCount}`);
  if (payload.recent.length === 0) {
    console.log('Recent attempts: none');
    return;
  }

  console.log('Recent attempts:');
  for (const attempt of payload.recent) {
    console.log(`- ${attempt.id} ${attempt.status}`);
    console.log(`  Branch: ${attempt.branchName}`);
    console.log(`  Worktree: ${attempt.worktreePath}`);
    console.log(`  Worktree exists: ${attempt.worktreeExists ? 'yes' : 'no'}`);
  }
}

function printRehydrateResult(payload) {
  console.log(`Attempt: ${payload.attempt.id}`);
  console.log(`Branch: ${payload.attempt.branchName}`);
  console.log(`Worktree: ${payload.attempt.worktreePath}`);
  console.log(`Rehydrated: ${payload.rehydrated ? 'yes' : 'no'}`);
  if (payload.reason) {
    console.log(`Reason: ${payload.reason}`);
  }
}

async function main() {
  const options = parseArgs(process.argv);
  if (options.help) {
    showHelp(0);
  }

  if (!['create', 'status', 'rehydrate'].includes(options.command)) {
    throw new Error(`Unknown command: ${options.command}`);
  }

  let store = null;
  if (options.command === 'create') {
    const created = await createAttempt(options);
    if (options.json) {
      console.log(JSON.stringify(created, null, 2));
    } else {
      printCreateResult(created);
    }
    return;
  }

  if (options.command === 'status') {
    store = await createStateStore({
      dbPath: options.dbPath,
      homeDir: process.env.HOME,
    });
    const payload = collectAttemptStatus(store, { limit: options.limit || 10 });
    if (options.json) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      printStatusResult(payload);
    }
    return;
  }

  const rehydrated = await rehydrateAttempt(options);
  if (options.json) {
    console.log(JSON.stringify(rehydrated, null, 2));
  } else {
    printRehydrateResult(rehydrated);
  }

  if (store) {
    store.close();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  buildArtifactPaths,
  buildAttemptIdentifiers,
  collectAttemptStatus,
  createAttempt,
  findAttemptById,
  parseArgs,
  rehydrateAttempt,
};
