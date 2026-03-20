#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { createStateStore } = require('../lib/state-store');
const { ensureDir } = require('../lib/utils');
const { getMemoryViewDir, getRepoRoot } = require('../lib/fulcrum-control');

function groupByDate(entries, dateField) {
  return entries.reduce((result, entry) => {
    const date = String(entry[dateField] || '').slice(0, 10);
    const nextGroup = result[date] || [];
    return {
      ...result,
      [date]: [...nextGroup, entry],
    };
  }, {});
}

function renderDayView(date, observations, notes = []) {
  const lines = [
    `# Memory View ${date}`,
    '',
    `Generated from canonical SQLite records. Observations: ${observations.length}. Notes: ${notes.length}.`,
    '',
  ];

  for (const observation of observations) {
    lines.push(`## ${observation.title}`);
    lines.push('');
    lines.push(`- Event: ${observation.sourceEvent}`);
    lines.push(`- Session: ${observation.sessionId || '(none)'}`);
    lines.push(`- Attempt: ${observation.attemptId || '(none)'}`);
    lines.push(`- Anchor: ${observation.anchorRef || '(none)'}`);
    lines.push(`- Tags: ${(observation.tags || []).join(', ') || '(none)'}`);
    lines.push('');
    lines.push(observation.summary);
    lines.push('');
  }

  if (notes.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('# Notes');
    lines.push('');

    for (const note of notes) {
      lines.push(`## ${note.category}: ${note.id}`);
      lines.push('');
      lines.push(`- Session: ${note.sessionId || '(none)'}`);
      lines.push(`- Attempt: ${note.attemptId || '(none)'}`);
      lines.push(`- Keywords: ${(note.keywords || []).join(', ') || '(none)'}`);
      lines.push(`- Tags: ${(note.tags || []).join(', ') || '(none)'}`);
      lines.push('');
      if (note.summary) {
        lines.push(note.summary);
        lines.push('');
      }
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

async function rebuildViews(options = {}) {
  const repoRoot = options.repoRoot || getRepoRoot();
  const viewDir = getMemoryViewDir(repoRoot);
  ensureDir(viewDir);

  const store = await createStateStore({
    dbPath: options.dbPath,
    homeDir: process.env.HOME,
  });

  try {
    const observations = store.listRecentObservations({ limit: 1000 });
    const notes = store.listRecentMemoryNotes({ limit: 1000 });
    const groupedObservations = groupByDate(observations, 'createdAt');
    const groupedNotes = groupByDate(notes, 'createdAt');
    const dates = [...new Set([...Object.keys(groupedObservations), ...Object.keys(groupedNotes)])];

    for (const date of dates) {
      if (!date || date.length !== 10) {
        continue;
      }
      const filePath = path.join(viewDir, `${date}.md`);
      fs.writeFileSync(
        filePath,
        renderDayView(date, groupedObservations[date] || [], groupedNotes[date] || []),
        'utf8'
      );
    }
    return dates.length;
  } finally {
    store.close();
  }
}

if (require.main === module) {
  rebuildViews()
    .then(count => {
      process.stdout.write(`Rebuilt ${count} memory view(s)\n`);
    })
    .catch(error => {
      process.stderr.write(`[rebuild-views] ${error.message}\n`);
      process.exit(1);
    });
}

module.exports = {
  rebuildViews,
  renderDayView,
};
