#!/usr/bin/env node
/**
 * Session Memory Init Hook (SessionStart)
 *
 * On session start, retrieves recent relevant memories from the SQLite control
 * plane using the search-orchestrator. Writes a context summary to stderr so
 * the agent has prior session awareness.
 *
 * Implements the memsearch pattern: warm session starts with memory injection.
 */
'use strict';

const path = require('path');
const { searchMemory } = require('../memory/search-orchestrator');
const { createStateStore } = require('../lib/state-store');
const { getRepoRoot } = require('../lib/fulcrum-control');

const MAX_STDIN = 1024 * 1024;
const MAX_CONTEXT_NOTES = 5;
const MAX_CONTEXT_CHARS = 1500;

function buildProjectContext() {
  const repoRoot = getRepoRoot();
  return {
    project: path.basename(repoRoot),
    cwd: repoRoot,
  };
}

function formatContextSummary(notes) {
  if (!notes || notes.length === 0) {
    return '';
  }

  const lines = ['[Session Memory] Prior context loaded:'];
  let totalChars = 0;

  for (const note of notes.slice(0, MAX_CONTEXT_NOTES)) {
    const summary = note.summary || note.content || '';
    const line = `  - ${summary.slice(0, 200)}`;
    if (totalChars + line.length > MAX_CONTEXT_CHARS) {
      break;
    }
    lines.push(line);
    totalChars += line.length;
  }

  return lines.join('\n');
}

async function run(rawInput) {
  try {
    const projectContext = buildProjectContext();
    const store = await createStateStore({ homeDir: process.env.HOME });

    try {
      const recentNotes = store.listRecentMemoryNotes({ limit: MAX_CONTEXT_NOTES });

      if (recentNotes.length > 0) {
        const contextSummary = formatContextSummary(recentNotes);
        if (contextSummary) {
          process.stderr.write(`${contextSummary}\n`);
        }
      }

      // Also try semantic search for project-specific memories
      const result = await searchMemory(projectContext.project, {
        limit: 3,
        mode: 'expand',
      });

      if (result && result.entries && result.entries.length > 0) {
        const projectNotes = result.entries
          .filter(entry => !recentNotes.some(note => note.id === entry.id));
        if (projectNotes.length > 0) {
          const projectSummary = formatContextSummary(projectNotes);
          if (projectSummary) {
            process.stderr.write(`${projectSummary.replace('Prior context', 'Project context')}\n`);
          }
        }
      }
    } finally {
      store.close();
    }
  } catch (error) {
    process.stderr.write(`[session-memory-init] ${error.message}\n`);
  }

  return rawInput;
}

if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    if (raw.length < MAX_STDIN) {
      raw += chunk.slice(0, MAX_STDIN - raw.length);
    }
  });
  process.stdin.on('end', () => {
    run(raw)
      .then(result => process.stdout.write(result))
      .catch(error => {
        process.stderr.write(`[session-memory-init] ${error.message}\n`);
        process.stdout.write(raw);
      });
  });
}

module.exports = { run };
