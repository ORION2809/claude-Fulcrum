#!/usr/bin/env node
'use strict';

const { createStateStore } = require('./lib/state-store');

function showHelp(exitCode = 0) {
  console.log(`
Usage: node scripts/status.js [--db <path>] [--json] [--limit <n>]

Query the Claude Fulcrum SQLite state store for active sessions, recent skill runs,
install health, and pending governance events.
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    dbPath: null,
    json: false,
    help: false,
    limit: 5,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--db') {
      parsed.dbPath = args[index + 1] || null;
      index += 1;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--limit') {
      parsed.limit = args[index + 1] || null;
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function printActiveSessions(section) {
  console.log(`Active sessions: ${section.activeCount}`);
  if (section.sessions.length === 0) {
    console.log('  - none');
    return;
  }

  for (const session of section.sessions) {
    console.log(`  - ${session.id} [${session.harness}/${session.adapterId}] ${session.state}`);
    console.log(`    Repo: ${session.repoRoot || '(unknown)'}`);
    console.log(`    Started: ${session.startedAt || '(unknown)'}`);
    console.log(`    Workers: ${session.workerCount}`);
  }
}

function printSkillRuns(section) {
  const summary = section.summary;
  const successRate = summary.successRate === null ? 'n/a' : `${summary.successRate}%`;
  const failureRate = summary.failureRate === null ? 'n/a' : `${summary.failureRate}%`;

  console.log(`Skill runs (last ${section.windowSize}):`);
  console.log(`  Success: ${summary.successCount}`);
  console.log(`  Failure: ${summary.failureCount}`);
  console.log(`  Unknown: ${summary.unknownCount}`);
  console.log(`  Success rate: ${successRate}`);
  console.log(`  Failure rate: ${failureRate}`);

  if (section.recent.length === 0) {
    console.log('  Recent runs: none');
    return;
  }

  console.log('  Recent runs:');
  for (const skillRun of section.recent.slice(0, 5)) {
    console.log(`  - ${skillRun.id} ${skillRun.outcome} ${skillRun.skillId}@${skillRun.skillVersion}`);
  }
}

function printInstallHealth(section) {
  console.log(`Install health: ${section.status}`);
  console.log(`  Targets recorded: ${section.totalCount}`);
  console.log(`  Healthy: ${section.healthyCount}`);
  console.log(`  Warning: ${section.warningCount}`);

  if (section.installations.length === 0) {
    console.log('  Installations: none');
    return;
  }

  console.log('  Installations:');
  for (const installation of section.installations.slice(0, 5)) {
    console.log(`  - ${installation.targetId} ${installation.status}`);
    console.log(`    Root: ${installation.targetRoot}`);
    console.log(`    Profile: ${installation.profile || '(custom)'}`);
    console.log(`    Modules: ${installation.moduleCount}`);
    console.log(`    Source version: ${installation.sourceVersion || '(unknown)'}`);
  }
}

function printGovernance(section) {
  console.log(`Pending governance events: ${section.pendingCount}`);
  if (section.events.length === 0) {
    console.log('  - none');
    return;
  }

  for (const event of section.events) {
    console.log(`  - ${event.id} ${event.eventType}`);
    console.log(`    Session: ${event.sessionId || '(none)'}`);
    console.log(`    Created: ${event.createdAt}`);
  }
}

function printAttempts(section) {
  console.log(`Attempts: ${section.totalCount}`);
  console.log(`  Active: ${section.activeCount}`);
  if (section.recent.length === 0) {
    console.log('  Recent attempts: none');
    return;
  }

  console.log('  Recent attempts:');
  for (const attempt of section.recent.slice(0, 5)) {
    console.log(`  - ${attempt.id} ${attempt.status}`);
    console.log(`    Branch: ${attempt.branchName}`);
    console.log(`    Worktree: ${attempt.worktreePath}`);
  }
}

function printMemory(section) {
  console.log(`Memory observations: ${section.observationsCount}`);
  console.log(`  Memory notes: ${section.memoryNotesCount || 0}`);
  console.log(`  Queue pending: ${section.queue.pending || 0}`);
  console.log(`  Queue processing: ${section.queue.processing || 0}`);
  console.log(`  Queue failed: ${section.queue.failed || 0}`);
  if (section.recentObservations.length === 0) {
    console.log('  Recent observations: none');
    return;
  }

  console.log('  Recent observations:');
  for (const observation of section.recentObservations.slice(0, 5)) {
    console.log(`  - ${observation.id} ${observation.sourceEvent}`);
    console.log(`    Title: ${observation.title}`);
  }

  if (section.recentNotes && section.recentNotes.length > 0) {
    console.log('  Recent notes:');
    for (const note of section.recentNotes.slice(0, 5)) {
      console.log(`  - ${note.id} ${note.category}`);
      console.log(`    Keywords: ${(note.keywords || []).join(', ') || '(none)'}`);
    }
  }
}

function printQuality(section) {
  console.log(`Quality runs: ${section.totalCount}`);
  if (section.recent.length === 0) {
    console.log('  - none');
    return;
  }

  for (const qualityRun of section.recent.slice(0, 5)) {
    console.log(`  - ${qualityRun.id} iteration ${qualityRun.iteration}`);
    console.log(`    Score: ${qualityRun.score}/${qualityRun.threshold} (${qualityRun.band})`);
    console.log(`    Termination: ${qualityRun.terminationReason}`);
  }
}

function printHuman(payload) {
  console.log('ECC status\n');
  console.log(`Database: ${payload.dbPath}\n`);
  printActiveSessions(payload.activeSessions);
  console.log();
  printSkillRuns(payload.skillRuns);
  console.log();
  printInstallHealth(payload.installHealth);
  console.log();
  printGovernance(payload.governance);
  console.log();
  printAttempts(payload.attempts);
  console.log();
  printMemory(payload.memory);
  console.log();
  printQuality(payload.quality);
}

async function main() {
  let store = null;

  try {
    const options = parseArgs(process.argv);
    if (options.help) {
      showHelp(0);
    }

    store = await createStateStore({
      dbPath: options.dbPath,
      homeDir: process.env.HOME,
    });

    const payload = {
      dbPath: store.dbPath,
      ...store.getStatus({
        activeLimit: options.limit,
        recentSkillRunLimit: 20,
        pendingLimit: options.limit,
      }),
    };

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      printHuman(payload);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } finally {
    if (store) {
      store.close();
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  parseArgs,
};
