#!/usr/bin/env node
/**
 * SessionStart Hook - Load previous context on new session
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs when a new Claude session starts. Loads the most recent session
 * summary into Claude's context via stdout, and reports available
 * sessions and learned skills.
 */

const {
  getSessionsDir,
  getLearnedSkillsDir,
  findFiles,
  ensureDir,
  readFile,
  log,
  output
} = require('../lib/utils');
const { getPackageManager, getSelectionPrompt } = require('../lib/package-manager');
const { listAliases } = require('../lib/session-aliases');
const { detectProjectType } = require('../lib/project-detect');
const { createStateStore } = require('../lib/state-store');
const {
  buildAwarenessHint,
  buildSessionStartRetrievalQuery,
  executeRetrievalRequest,
} = require('../memory/search-orchestrator');

function buildSessionStartAwarenessHint(retrievalSummary, fallbackEntries, options = {}) {
  const summary = String(retrievalSummary || '').trim();
  if (summary) {
    const hint = `Memory available: ${summary}`;
    return hint.length > 120 ? `${hint.slice(0, 117)}...` : hint;
  }

  return buildAwarenessHint(fallbackEntries, options);
}

async function main() {
  const sessionsDir = getSessionsDir();
  const learnedDir = getLearnedSkillsDir();

  // Ensure directories exist
  ensureDir(sessionsDir);
  ensureDir(learnedDir);

  // Check for recent session files (last 7 days)
  const recentSessions = findFiles(sessionsDir, '*-session.tmp', { maxAge: 7 });

  if (recentSessions.length > 0) {
    const latest = recentSessions[0];
    log(`[SessionStart] Found ${recentSessions.length} recent session(s)`);
    log(`[SessionStart] Latest: ${latest.path}`);

    // Read and inject the latest session content into Claude's context
    const content = readFile(latest.path);
    if (content && !content.includes('[Session context goes here]')) {
      // Only inject if the session has actual content (not the blank template)
      output(`Previous session summary:\n${content}`);
    }
  }

  // Check for learned skills
  const learnedSkills = findFiles(learnedDir, '*.md');

  if (learnedSkills.length > 0) {
    log(`[SessionStart] ${learnedSkills.length} learned skill(s) available in ${learnedDir}`);
  }

  // Check for available session aliases
  const aliases = listAliases({ limit: 5 });

  if (aliases.length > 0) {
    const aliasNames = aliases.map(a => a.name).join(', ');
    log(`[SessionStart] ${aliases.length} session alias(es) available: ${aliasNames}`);
    log(`[SessionStart] Use /sessions load <alias> to continue a previous session`);
  }

  // Detect and report package manager
  const pm = getPackageManager();
  log(`[SessionStart] Package manager: ${pm.name} (${pm.source})`);

  // If no explicit package manager config was found, show selection prompt
  if (pm.source === 'default') {
    log('[SessionStart] No package manager preference found.');
    log(getSelectionPrompt());
  }

  // Detect project type and frameworks 
  const projectInfo = detectProjectType();
  if (projectInfo.languages.length > 0 || projectInfo.frameworks.length > 0) {
    const parts = [];
    if (projectInfo.languages.length > 0) {
      parts.push(`languages: ${projectInfo.languages.join(', ')}`);
    }
    if (projectInfo.frameworks.length > 0) {
      parts.push(`frameworks: ${projectInfo.frameworks.join(', ')}`);
    }
    log(`[SessionStart] Project detected — ${parts.join('; ')}`);
    output(`Project type: ${JSON.stringify(projectInfo)}`);
  } else {
    log('[SessionStart] No specific project type detected');
  }

  const store = await createStateStore({
    homeDir: process.env.HOME,
  });

  let storeClosed = false;
  const closeStore = () => {
    if (!storeClosed) {
      store.close();
      storeClosed = true;
    }
  };

  try {
    const dbPath = store.dbPath;
    const recentNotes = store.listRecentMemoryNotes({ limit: 2 }).map(note => ({
      kind: 'note',
      id: note.id,
      title: note.category,
      summary: note.summary,
      keywords: note.keywords || [],
      relationship: 'seed',
      score: 2,
    }));
    const recentObservations = store.listRecentObservations({ limit: 2 }).map(observation => ({
      kind: 'observation',
      id: observation.id,
      title: observation.title,
      summary: observation.summary,
      relationship: 'seed',
      score: 1,
    }));
    const recentEntries = [...recentNotes, ...recentObservations];
    const retrievalQuery = buildSessionStartRetrievalQuery(recentEntries, projectInfo);
    closeStore();
    let awarenessHint = '';

    if (retrievalQuery) {
      try {
        const retrieval = await executeRetrievalRequest({
          query: retrievalQuery,
          dbPath,
          mode: 'search',
          preferIsolated: true,
          parentTokenBudget: 30,
        }, {
          allowSubprocess: true,
        });

        awarenessHint = buildSessionStartAwarenessHint(retrieval.summary, recentEntries, {
          parentTokenBudget: 30,
        });
      } catch (_retrievalError) {
        awarenessHint = '';
      }
    }

    if (!awarenessHint) {
      awarenessHint = buildAwarenessHint(recentEntries, {
        parentTokenBudget: 30,
      });
    }

    if (awarenessHint) {
      output(awarenessHint);
    }
  } finally {
    closeStore();
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[SessionStart] Error:', err.message);
  process.exit(0); // Don't block on errors
});
