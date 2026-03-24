#!/usr/bin/env node
/**
 * Session End Markdown Export Hook (SessionEnd)
 *
 * Exports session observations and memory notes to a dated markdown file
 * in ~/.claude/sessions/. Implements the memsearch retrieval pattern:
 * permanent human-readable session archives.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { createStateStore } = require('../lib/state-store');
const { getRepoRoot } = require('../lib/fulcrum-control');

const MAX_STDIN = 1024 * 1024;

function getSessionsDir() {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return path.join(home, '.claude', 'sessions');
}

function getDateString() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function formatObservation(obs) {
  const time = obs.createdAt ? new Date(obs.createdAt).toLocaleTimeString() : '';
  const title = obs.title || obs.sourceEvent || 'observation';
  const summary = obs.summary || '';
  return `- **${title}** (${time}): ${summary}`;
}

function formatMemoryNote(note) {
  const category = note.category || 'note';
  const content = (note.summary || note.content || '').slice(0, 300);
  const tags = (note.tags || []).join(', ');
  return `- [${category}] ${content}${tags ? ` _(${tags})_` : ''}`;
}

function buildMarkdownExport(sessionId, observations, notes, projectName) {
  const date = getDateString();
  const lines = [
    `# Session Export: ${date}`,
    '',
    `**Project:** ${projectName}`,
    `**Session:** ${sessionId || 'unknown'}`,
    `**Exported:** ${new Date().toISOString()}`,
    '',
  ];

  if (observations.length > 0) {
    lines.push('## Observations', '');
    for (const obs of observations) {
      lines.push(formatObservation(obs));
    }
    lines.push('');
  }

  if (notes.length > 0) {
    lines.push('## Memory Notes', '');
    for (const note of notes) {
      lines.push(formatMemoryNote(note));
    }
    lines.push('');
  }

  if (observations.length === 0 && notes.length === 0) {
    lines.push('_No observations or notes recorded in this session._', '');
  }

  return lines.join('\n');
}

async function run(rawInput) {
  try {
    const input = JSON.parse(rawInput || '{}');
    const sessionId = input.session_id || input.sessionId || process.env.CLAUDE_SESSION_ID || null;
    const projectName = path.basename(getRepoRoot());

    const store = await createStateStore({ homeDir: process.env.HOME });

    try {
      const observations = sessionId
        ? store.listObservationsBySession(sessionId, { limit: 50 })
        : store.listRecentMemoryNotes({ limit: 20 }).map(note => ({
          title: note.category,
          summary: note.summary || note.content,
          createdAt: note.createdAt,
          sourceEvent: 'memory_note',
        }));

      const notes = store.listRecentMemoryNotes({
        limit: 30,
        sessionId,
      });

      if (observations.length === 0 && notes.length === 0) {
        return rawInput;
      }

      const markdown = buildMarkdownExport(sessionId, observations, notes, projectName);

      const sessionsDir = getSessionsDir();
      fs.mkdirSync(sessionsDir, { recursive: true });

      const date = getDateString();
      const shortId = sessionId ? sessionId.slice(-8) : `${Date.now()}`;
      const exportPath = path.join(sessionsDir, `${date}-${shortId}-export.md`);

      fs.writeFileSync(exportPath, markdown, 'utf8');
      process.stderr.write(`[session-end-markdown] Exported to ${exportPath}\n`);
    } finally {
      store.close();
    }
  } catch (error) {
    process.stderr.write(`[session-end-markdown] ${error.message}\n`);
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
        process.stderr.write(`[session-end-markdown] ${error.message}\n`);
        process.stdout.write(raw);
      });
  });
}

module.exports = { run, buildMarkdownExport };
