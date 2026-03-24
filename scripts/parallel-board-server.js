#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const {
  TASK_STATUS,
  createTask,
  loadBoard,
  saveBoard,
  upsertTask,
  attachAttempt,
  addFeedback,
} = require('./lib/parallel-board');
const {
  createAttemptGroup,
  compareAttemptGroup,
  addGroupFeedback,
  retryAttemptGroup,
  getGroupArtifactPaths,
} = require('./attempt-group-cli');
const { buildArtifactPaths } = require('./attempt-cli');

function showHelp(exitCode = 0) {
  console.log(`
Usage: node scripts/parallel-board-server.js [options]

Options:
  --host <host>                    Host interface (default: 127.0.0.1)
  --port <port>                    Port to bind (default: 3017, use 0 for ephemeral)

Endpoints:
  GET  /
  GET  /health
  GET  /events                      Server-Sent Events stream
  GET  /attempts/:id/log
  POST /attempts/:id/log
  GET  /tasks
  POST /tasks
  POST /tasks/:id/attach-attempt
  POST /tasks/:id/feedback
  POST /tasks/:id/status
  GET  /attempt-groups/:id
  GET  /attempt-groups/:id/review
  POST /attempt-groups
  POST /attempt-groups/:id/compare
  POST /attempt-groups/:id/feedback
  POST /attempt-groups/:id/retry
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  const parsed = {
    host: '127.0.0.1',
    port: 3017,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--host') {
      parsed.host = args[index + 1] || parsed.host;
      index += 1;
    } else if (arg === '--port') {
      parsed.port = Number(args[index + 1] || parsed.port);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function createJsonError(statusCode, message) {
  return {
    statusCode,
    payload: {
      error: message,
    },
  };
}

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function sendHtml(response, statusCode, html) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(html);
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    throw new Error('Request body must be valid JSON');
  }
}

function getTaskById(board, taskId) {
  return board.tasks.find(task => task.id === taskId) || null;
}

function loadAttemptGroupState(repoRoot, groupId) {
  const paths = getGroupArtifactPaths(repoRoot, groupId);
  const manifest = fs.existsSync(paths.manifestPath)
    ? JSON.parse(fs.readFileSync(paths.manifestPath, 'utf8'))
    : null;
  const comparison = fs.existsSync(paths.comparisonJsonPath)
    ? JSON.parse(fs.readFileSync(paths.comparisonJsonPath, 'utf8'))
    : null;
  const feedback = fs.existsSync(paths.feedbackPath)
    ? fs.readFileSync(paths.feedbackPath, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line))
    : [];

  return {
    groupId,
    manifest,
    comparison,
    feedback,
    paths,
  };
}

function readAttemptLog(repoRoot, attemptId) {
  const logFile = buildArtifactPaths(repoRoot, attemptId).logFile;
  return {
    attemptId,
    logFile,
    content: fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '',
  };
}

function appendAttemptLog(repoRoot, attemptId, message) {
  const paths = buildArtifactPaths(repoRoot, attemptId);
  fs.mkdirSync(path.dirname(paths.logFile), { recursive: true });
  const line = `[${new Date().toISOString()}] ${String(message)}\n`;
  fs.appendFileSync(paths.logFile, line, 'utf8');
  return {
    attemptId,
    logFile: paths.logFile,
    appended: line,
    content: fs.readFileSync(paths.logFile, 'utf8'),
  };
}

function createSseEvent(eventName, payload) {
  return `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderBoardPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Claude Fulcrum Parallel Board</title>
  <style>
    :root {
      --paper: #f4efe6;
      --ink: #1d2a26;
      --muted: #67766e;
      --card: #fffaf2;
      --line: #d4c6ad;
      --accent: #0d6b57;
      --accent-soft: #d9efe8;
      --warning: #8a4b14;
      --shadow: 0 12px 32px rgba(29, 42, 38, 0.10);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Georgia, "Palatino Linotype", serif;
      color: var(--ink);
      background:
        radial-gradient(circle at top left, rgba(13,107,87,0.12), transparent 28%),
        linear-gradient(180deg, #f7f1e6 0%, #efe4cf 100%);
      min-height: 100vh;
    }
    header {
      padding: 28px 24px 18px;
      border-bottom: 1px solid rgba(29, 42, 38, 0.08);
      background: rgba(255, 250, 242, 0.72);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 1;
    }
    h1 {
      margin: 0;
      font-size: clamp(1.6rem, 2vw, 2.4rem);
      letter-spacing: 0.02em;
    }
    .subhead {
      margin-top: 8px;
      color: var(--muted);
      font-size: 0.98rem;
    }
    main {
      display: grid;
      grid-template-columns: minmax(320px, 1.6fr) minmax(280px, 1fr);
      gap: 18px;
      padding: 20px 24px 28px;
    }
    .panel {
      background: rgba(255, 250, 242, 0.86);
      border: 1px solid rgba(212, 198, 173, 0.8);
      border-radius: 20px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .panel-header {
      padding: 16px 18px;
      border-bottom: 1px solid rgba(212, 198, 173, 0.8);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .panel-header h2 {
      margin: 0;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .pill {
      display: inline-flex;
      padding: 0.22rem 0.7rem;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(5, minmax(200px, 1fr));
      gap: 14px;
      padding: 18px;
      overflow-x: auto;
    }
    .column {
      background: rgba(244, 239, 230, 0.75);
      border: 1px solid rgba(212, 198, 173, 0.65);
      border-radius: 16px;
      min-height: 280px;
      padding: 12px;
    }
    .column h3 {
      margin: 0 0 12px;
      font-size: 0.88rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .task-card {
      background: var(--card);
      border: 1px solid rgba(212, 198, 173, 0.9);
      border-radius: 14px;
      padding: 12px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    }
    .task-card:hover, .task-card.is-selected {
      transform: translateY(-1px);
      border-color: rgba(13, 107, 87, 0.45);
      box-shadow: 0 8px 20px rgba(13, 107, 87, 0.08);
    }
    .task-title {
      font-weight: 700;
      line-height: 1.3;
    }
    .task-meta {
      margin-top: 8px;
      color: var(--muted);
      font-size: 0.82rem;
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }
    .sidebar {
      display: grid;
      gap: 18px;
      align-content: start;
    }
    .detail-body, .events-body {
      padding: 18px;
    }
    .detail-empty {
      color: var(--muted);
      font-style: italic;
    }
    .detail-label {
      margin: 14px 0 6px;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
    }
    .detail-list, .events-list {
      display: grid;
      gap: 8px;
    }
    .attempt-chip, .feedback-chip {
      background: rgba(13, 107, 87, 0.05);
      border: 1px solid rgba(13, 107, 87, 0.12);
      border-radius: 12px;
      padding: 10px;
      font-size: 0.88rem;
    }
    .review-link {
      display: inline-block;
      margin-top: 10px;
      color: var(--accent);
      font-weight: 700;
      text-decoration: none;
    }
    .events-list {
      max-height: 340px;
      overflow: auto;
    }
    .event-row {
      border-left: 3px solid rgba(13, 107, 87, 0.35);
      padding-left: 10px;
      color: var(--muted);
      font-size: 0.86rem;
    }
    .event-row strong {
      color: var(--ink);
      display: block;
      margin-bottom: 3px;
    }
    @media (max-width: 1080px) {
      main { grid-template-columns: 1fr; }
      .board { grid-template-columns: repeat(5, minmax(220px, 1fr)); }
    }
  </style>
</head>
<body>
  <header>
    <h1>Parallel Execution Board</h1>
    <div class="subhead">Grouped worktree attempts, live orchestration events, and review-ready diff links in one operator surface.</div>
  </header>
  <main>
    <section class="panel">
      <div class="panel-header">
        <h2>Kanban</h2>
        <span class="pill" id="taskCount">0 tasks</span>
      </div>
      <div class="board" id="board"></div>
    </section>
    <aside class="sidebar">
      <section class="panel">
        <div class="panel-header">
          <h2>Task Detail</h2>
          <span class="pill" id="detailStatus">select task</span>
        </div>
        <div class="detail-body" id="detailPanel">
          <div class="detail-empty">Pick a task to inspect attempts, feedback, and any available diff-review page.</div>
        </div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <h2>Live Events</h2>
          <span class="pill">SSE</span>
        </div>
        <div class="events-body">
          <div class="events-list" id="eventsPanel"></div>
        </div>
      </section>
    </aside>
  </main>
  <script>
    const STATUS_ORDER = ['todo', 'running', 'review', 'done', 'blocked'];
    const STATUS_LABELS = {
      todo: 'Todo',
      running: 'Running',
      review: 'Review',
      done: 'Done',
      blocked: 'Blocked'
    };

    const state = {
      tasks: [],
      selectedTaskId: null
    };

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderBoard() {
      const board = document.getElementById('board');
      const count = document.getElementById('taskCount');
      count.textContent = state.tasks.length + (state.tasks.length === 1 ? ' task' : ' tasks');

      const columns = STATUS_ORDER.map(status => {
        const tasks = state.tasks.filter(task => task.status === status);
        const cards = tasks.map(task => {
          const selected = task.id === state.selectedTaskId ? ' is-selected' : '';
          return '<article class="task-card' + selected + '" data-task-id="' + escapeHtml(task.id) + '">' +
            '<div class="task-title">' + escapeHtml(task.title) + '</div>' +
            '<div class="task-meta"><span>' + escapeHtml(task.attempts.length) + ' attempts</span><span>' + escapeHtml(task.feedback.length) + ' notes</span></div>' +
          '</article>';
        }).join('');
        return '<section class="column"><h3>' + STATUS_LABELS[status] + '</h3>' + (cards || '<div class="detail-empty">No tasks</div>') + '</section>';
      }).join('');

      board.innerHTML = columns;
      board.querySelectorAll('[data-task-id]').forEach(element => {
        element.addEventListener('click', () => {
          state.selectedTaskId = element.getAttribute('data-task-id');
          renderBoard();
          renderDetail();
        });
      });
    }

    function renderDetail() {
      const panel = document.getElementById('detailPanel');
      const statusPill = document.getElementById('detailStatus');
      const task = state.tasks.find(entry => entry.id === state.selectedTaskId);
      if (!task) {
        panel.innerHTML = '<div class="detail-empty">Pick a task to inspect attempts, feedback, and any available diff-review page.</div>';
        statusPill.textContent = 'select task';
        return;
      }

      statusPill.textContent = STATUS_LABELS[task.status] || task.status;
      const groupId = task.attempts.find(entry => entry.groupId)?.groupId || '';
      const attempts = task.attempts.length > 0
        ? '<div class="detail-list">' + task.attempts.map(entry => '<div class="attempt-chip"><strong>' + escapeHtml(entry.agentName || entry.attemptId) + '</strong><div>' + escapeHtml(entry.attemptId) + '</div><button type="button" data-log-attempt="' + escapeHtml(entry.attemptId) + '" style="margin-top:8px;border:none;background:#0d6b57;color:#fff;padding:6px 10px;border-radius:999px;cursor:pointer;">View Live Log</button></div>').join('') + '</div>'
        : '<div class="detail-empty">No attempts yet.</div>';
      const feedback = task.feedback.length > 0
        ? '<div class="detail-list">' + task.feedback.map(entry => '<div class="feedback-chip"><strong>' + escapeHtml(entry.attemptId || 'feedback') + '</strong><div>' + escapeHtml(entry.message || '') + '</div></div>').join('') + '</div>'
        : '<div class="detail-empty">No feedback yet.</div>';
      const reviewLink = groupId
        ? '<a class="review-link" href="/attempt-groups/' + encodeURIComponent(groupId) + '/review" target="_blank" rel="noreferrer">Open Diff Review</a>'
        : '';

      panel.innerHTML =
        '<div><strong>' + escapeHtml(task.title) + '</strong></div>' +
        '<div style="margin-top:8px;color:#67766e;">' + escapeHtml(task.description || task.objective || '') + '</div>' +
        '<div class="detail-label">Attempts</div>' + attempts +
        '<div class="detail-label">Live Log</div><pre id="logPanel" style="white-space:pre-wrap;background:rgba(29,42,38,0.96);color:#eaf4ef;border-radius:14px;padding:14px;min-height:140px;max-height:240px;overflow:auto;">Select an attempt log.</pre>' +
        '<div class="detail-label">Feedback</div>' + feedback +
        reviewLink;

      panel.querySelectorAll('[data-log-attempt]').forEach(element => {
        element.addEventListener('click', () => loadAttemptLog(element.getAttribute('data-log-attempt')));
      });
    }

    async function loadAttemptLog(attemptId) {
      const panel = document.getElementById('logPanel');
      if (!panel) {
        return;
      }
      panel.textContent = 'Loading log...';
      const response = await fetch('/attempts/' + encodeURIComponent(attemptId) + '/log');
      const payload = await response.json();
      panel.textContent = payload.content || '(no log output yet)';
      panel.scrollTop = panel.scrollHeight;
      panel.dataset.attemptId = attemptId;
    }

    function addEventRow(name, payload) {
      const panel = document.getElementById('eventsPanel');
      const row = document.createElement('div');
      row.className = 'event-row';
      row.innerHTML = '<strong>' + escapeHtml(name) + '</strong><div>' + escapeHtml((payload.task?.title) || (payload.groupId) || '') + '</div>';
      panel.prepend(row);
      while (panel.children.length > 20) {
        panel.removeChild(panel.lastChild);
      }
    }

    async function refreshTasks() {
      const response = await fetch('/tasks');
      const payload = await response.json();
      state.tasks = payload.tasks || [];
      if (!state.selectedTaskId && state.tasks.length > 0) {
        state.selectedTaskId = state.tasks[0].id;
      }
      if (state.selectedTaskId && !state.tasks.some(task => task.id === state.selectedTaskId)) {
        state.selectedTaskId = state.tasks[0]?.id || null;
      }
      renderBoard();
      renderDetail();
    }

    async function boot() {
      await refreshTasks();
      const events = new EventSource('/events');
      events.addEventListener('ready', event => addEventRow('ready', JSON.parse(event.data)));
      ['task.created','task.attempt-attached','task.feedback-added','task.status-updated','attempt-group.created','attempt-group.compared','attempt-group.feedback-added'].forEach(name => {
        events.addEventListener(name, async event => {
          const payload = JSON.parse(event.data);
          addEventRow(name, payload);
          await refreshTasks();
        });
      });
      events.addEventListener('attempt-group.retried', async event => {
        const payload = JSON.parse(event.data);
        addEventRow('attempt-group.retried', payload);
        await refreshTasks();
      });
      events.addEventListener('attempt.log-appended', event => {
        const payload = JSON.parse(event.data);
        addEventRow('attempt.log-appended', payload);
        const panel = document.getElementById('logPanel');
        if (panel && panel.dataset.attemptId === payload.attemptId) {
          panel.textContent = payload.content || '(no log output yet)';
          panel.scrollTop = panel.scrollHeight;
        }
      });
    }

    boot().catch(error => {
      const panel = document.getElementById('eventsPanel');
      panel.innerHTML = '<div class="event-row"><strong>ui.error</strong><div>' + escapeHtml(error.message) + '</div></div>';
    });
  </script>
</body>
</html>`;
}

function renderAttemptGroupReviewPage(state) {
  const manifest = state.manifest;
  const comparison = state.comparison;
  if (!manifest) {
    return `<!doctype html><html><body><h1>Attempt group not found</h1></body></html>`;
  }

  const attemptBlocks = comparison && Array.isArray(comparison.attempts)
    ? comparison.attempts.map(attempt => `
      <section class="attempt">
        <h3>${escapeHtml(attempt.agentName || attempt.attemptId)}</h3>
        <p><strong>Branch:</strong> <code>${escapeHtml(attempt.branchName)}</code></p>
        <p><strong>Files:</strong> ${escapeHtml(attempt.files.join(', ') || 'none')}</p>
        <p><strong>Insertions:</strong> ${escapeHtml(attempt.insertions)} | <strong>Deletions:</strong> ${escapeHtml(attempt.deletions)}</p>
        <div style="margin-top:14px;">
          <label for="retry-${escapeHtml(attempt.attemptId)}"><strong>Retry Feedback</strong></label>
          <textarea id="retry-${escapeHtml(attempt.attemptId)}" data-retry-input="${escapeHtml(attempt.attemptId)}" style="width:100%;min-height:88px;margin-top:8px;padding:10px;border-radius:12px;border:1px solid rgba(212,198,173,0.95);font:inherit;"></textarea>
          <button type="button" data-retry-attempt="${escapeHtml(attempt.attemptId)}" style="margin-top:10px;border:none;background:#0d6b57;color:#fff;padding:10px 14px;border-radius:999px;cursor:pointer;">Spawn Retry Attempt</button>
          <div data-retry-status="${escapeHtml(attempt.attemptId)}" style="margin-top:8px;color:#67766e;"></div>
        </div>
      </section>
    `).join('')
    : '<p>No comparison has been generated yet. Run compare to produce diff review artifacts.</p>';

  const pairBlocks = comparison && Array.isArray(comparison.pairs)
    ? comparison.pairs.map(pair => `
      <article class="pair">
        <h4>${escapeHtml(pair.agents.join(' vs '))}</h4>
        <p><strong>Shared:</strong> ${escapeHtml(pair.sharedFiles.join(', ') || 'none')}</p>
        <p><strong>Left Only:</strong> ${escapeHtml(pair.leftOnly.join(', ') || 'none')}</p>
        <p><strong>Right Only:</strong> ${escapeHtml(pair.rightOnly.join(', ') || 'none')}</p>
      </article>
    `).join('')
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Attempt Group Review</title>
  <style>
    body {
      margin: 0;
      font-family: Georgia, "Palatino Linotype", serif;
      color: #1d2a26;
      background: linear-gradient(180deg, #f8f2e8 0%, #efe3cf 100%);
    }
    main {
      max-width: 1080px;
      margin: 0 auto;
      padding: 28px 24px 36px;
    }
    h1, h2, h3, h4 { margin-top: 0; }
    .hero, .panel, .pair, .attempt {
      background: rgba(255, 250, 242, 0.88);
      border: 1px solid rgba(212, 198, 173, 0.85);
      border-radius: 18px;
      box-shadow: 0 10px 28px rgba(29, 42, 38, 0.08);
    }
    .hero, .panel { padding: 20px; margin-bottom: 18px; }
    .grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .attempt, .pair { padding: 16px; }
    code {
      background: rgba(13, 107, 87, 0.08);
      border-radius: 6px;
      padding: 0.1rem 0.35rem;
    }
    .muted { color: #67766e; }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <h1>${escapeHtml(manifest.name)}</h1>
      <p class="muted">${escapeHtml(manifest.task || '')}</p>
      <p><strong>Group:</strong> <code>${escapeHtml(state.groupId)}</code></p>
      <p><strong>Agents:</strong> ${escapeHtml((manifest.agents || []).join(', '))}</p>
    </section>
    <section class="panel">
      <h2>Attempt Summaries</h2>
      <div class="grid">${attemptBlocks}</div>
    </section>
    <section class="panel">
      <h2>Pairwise File Overlap</h2>
      <div class="grid">${pairBlocks || '<p>No pairwise comparison available yet.</p>'}</div>
    </section>
  </main>
  <script>
    document.querySelectorAll('[data-retry-attempt]').forEach(button => {
      button.addEventListener('click', async () => {
        const attemptId = button.getAttribute('data-retry-attempt');
        const input = document.querySelector('[data-retry-input="' + attemptId + '"]');
        const status = document.querySelector('[data-retry-status="' + attemptId + '"]');
        const message = input.value.trim();
        if (!message) {
          status.textContent = 'Enter feedback before retrying.';
          return;
        }

        status.textContent = 'Spawning retry attempt...';
        const response = await fetch('/attempt-groups/${encodeURIComponent(state.groupId)}/retry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attemptId, message })
        });
        const payload = await response.json();
        if (!response.ok) {
          status.textContent = payload.error || 'Retry failed';
          return;
        }
        status.textContent = 'Retry created: ' + payload.retryAttempt.id;
        input.value = '';
      });
    });
  </script>
</body>
</html>`;
}

function createParallelBoardServer(options = {}) {
  const repoRoot = path.resolve(options.repoRoot || process.cwd());
  const clients = new Set();

  function broadcast(eventName, payload) {
    const message = createSseEvent(eventName, {
      ...payload,
      emittedAt: new Date().toISOString(),
    });

    for (const response of [...clients]) {
      try {
        response.write(message);
      } catch (_error) {
        clients.delete(response);
      }
    }
  }

  function registerSse(request, response) {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    response.write(createSseEvent('ready', {
      ok: true,
      repoRoot,
    }));
    clients.add(response);

    const cleanup = () => {
      clients.delete(response);
      if (!response.writableEnded) {
        response.end();
      }
    };

    request.on('close', cleanup);
    response.on('close', cleanup);
  }

  async function handleCreateTask(request, response) {
    const body = await readJsonBody(request);
    const board = loadBoard(repoRoot);
    const task = createTask({
      title: body.title,
      description: body.description,
      objective: body.objective,
      preferredAgents: Array.isArray(body.preferredAgents) ? body.preferredAgents : [],
      metadata: body.metadata || {},
    });
    const nextBoard = saveBoard(upsertTask(board, task), repoRoot);
    const savedTask = getTaskById(nextBoard, task.id);
    broadcast('task.created', { task: savedTask });
    sendJson(response, 201, { task: savedTask });
  }

  async function handleAttachAttempt(request, response, taskId) {
    const body = await readJsonBody(request);
    if (!body.attemptId) {
      throw createJsonError(400, 'attemptId is required');
    }

    const board = loadBoard(repoRoot);
    const nextBoard = saveBoard(attachAttempt(board, taskId, {
      attemptId: body.attemptId,
      agentName: body.agentName || null,
      groupId: body.groupId || null,
      attachedAt: body.attachedAt || new Date().toISOString(),
    }), repoRoot);

    const task = getTaskById(nextBoard, taskId);
    broadcast('task.attempt-attached', { taskId, task });
    sendJson(response, 200, { task });
  }

  async function handleTaskFeedback(request, response, taskId) {
    const body = await readJsonBody(request);
    if (!body.attemptId || !body.message) {
      throw createJsonError(400, 'attemptId and message are required');
    }

    const board = loadBoard(repoRoot);
    const nextBoard = saveBoard(addFeedback(board, taskId, {
      attemptId: body.attemptId,
      message: body.message,
      groupId: body.groupId || null,
    }), repoRoot);

    const task = getTaskById(nextBoard, taskId);
    broadcast('task.feedback-added', { taskId, task });
    sendJson(response, 200, { task });
  }

  async function handleTaskStatus(request, response, taskId) {
    const body = await readJsonBody(request);
    if (!Object.values(TASK_STATUS).includes(body.status)) {
      throw createJsonError(400, `status must be one of: ${Object.values(TASK_STATUS).join(', ')}`);
    }

    const board = loadBoard(repoRoot);
    const task = getTaskById(board, taskId);
    if (!task) {
      throw createJsonError(404, `Task not found: ${taskId}`);
    }

    const nextBoard = saveBoard(upsertTask(board, {
      ...task,
      status: body.status,
    }), repoRoot);
    const savedTask = getTaskById(nextBoard, taskId);
    broadcast('task.status-updated', { taskId, task: savedTask });
    sendJson(response, 200, { task: savedTask });
  }

  async function handleCreateAttemptGroup(request, response) {
    const body = await readJsonBody(request);
    if (!body.name) {
      throw createJsonError(400, 'name is required');
    }

    const payload = await createAttemptGroup({
      repoRoot,
      positional: [body.name],
      task: body.task || null,
      agents: Array.isArray(body.agents) && body.agents.length > 0 ? body.agents : ['claude', 'codex', 'gemini'],
      taskId: body.taskId || null,
      baseRef: body.baseRef || 'HEAD',
      dbPath: body.dbPath || null,
      worktreeRoot: body.worktreeRoot || null,
    });

    broadcast('attempt-group.created', payload);
    sendJson(response, 201, payload);
  }

  async function handleAttemptLogRead(_request, response, attemptId) {
    sendJson(response, 200, readAttemptLog(repoRoot, attemptId));
  }

  async function handleAttemptLogAppend(request, response, attemptId) {
    const body = await readJsonBody(request);
    if (!body.message) {
      throw createJsonError(400, 'message is required');
    }
    const payload = appendAttemptLog(repoRoot, attemptId, body.message);
    broadcast('attempt.log-appended', payload);
    sendJson(response, 200, payload);
  }

  async function handleCompareAttemptGroup(request, response, groupId) {
    const body = await readJsonBody(request);
    const payload = await compareAttemptGroup({
      repoRoot,
      positional: [groupId],
      dbPath: body.dbPath || null,
      baseRef: body.baseRef || 'HEAD',
    });
    broadcast('attempt-group.compared', payload);
    sendJson(response, 200, payload);
  }

  async function handleAttemptGroupFeedback(request, response, groupId) {
    const body = await readJsonBody(request);
    if (!body.attemptId || !body.message) {
      throw createJsonError(400, 'attemptId and message are required');
    }

    const payload = await addGroupFeedback({
      repoRoot,
      positional: [groupId, body.attemptId, ...String(body.message).split(/\s+/).filter(Boolean)],
    });

    broadcast('attempt-group.feedback-added', payload);
    sendJson(response, 200, payload);
  }

  async function handleAttemptGroupRetry(request, response, groupId) {
    const body = await readJsonBody(request);
    if (!body.attemptId || !body.message) {
      throw createJsonError(400, 'attemptId and message are required');
    }

    const payload = await retryAttemptGroup({
      repoRoot,
      dbPath: body.dbPath || null,
      worktreeRoot: body.worktreeRoot || null,
      positional: [groupId, body.attemptId, ...String(body.message).split(/\s+/).filter(Boolean)],
    });

    broadcast('attempt-group.retried', payload);
    sendJson(response, 200, payload);
  }

  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host || '127.0.0.1'}`);
      const pathname = url.pathname;
      const method = request.method || 'GET';

      if (method === 'GET' && pathname === '/') {
        sendHtml(response, 200, renderBoardPage());
        return;
      }

      if (method === 'GET' && pathname === '/health') {
        sendJson(response, 200, { ok: true, repoRoot });
        return;
      }

      if (method === 'GET' && pathname === '/events') {
        registerSse(request, response);
        return;
      }

      const attemptLogMatch = pathname.match(/^\/attempts\/([^/]+)\/log$/);
      if (method === 'GET' && attemptLogMatch) {
        await handleAttemptLogRead(request, response, decodeURIComponent(attemptLogMatch[1]));
        return;
      }

      if (method === 'POST' && attemptLogMatch) {
        await handleAttemptLogAppend(request, response, decodeURIComponent(attemptLogMatch[1]));
        return;
      }

      if (method === 'GET' && pathname === '/tasks') {
        sendJson(response, 200, { tasks: loadBoard(repoRoot).tasks });
        return;
      }

      if (method === 'POST' && pathname === '/tasks') {
        await handleCreateTask(request, response);
        return;
      }

      const attachMatch = pathname.match(/^\/tasks\/([^/]+)\/attach-attempt$/);
      if (method === 'POST' && attachMatch) {
        await handleAttachAttempt(request, response, decodeURIComponent(attachMatch[1]));
        return;
      }

      const feedbackMatch = pathname.match(/^\/tasks\/([^/]+)\/feedback$/);
      if (method === 'POST' && feedbackMatch) {
        await handleTaskFeedback(request, response, decodeURIComponent(feedbackMatch[1]));
        return;
      }

      const statusMatch = pathname.match(/^\/tasks\/([^/]+)\/status$/);
      if (method === 'POST' && statusMatch) {
        await handleTaskStatus(request, response, decodeURIComponent(statusMatch[1]));
        return;
      }

      if (method === 'POST' && pathname === '/attempt-groups') {
        await handleCreateAttemptGroup(request, response);
        return;
      }

      const groupReadMatch = pathname.match(/^\/attempt-groups\/([^/]+)$/);
      if (method === 'GET' && groupReadMatch) {
        const groupId = decodeURIComponent(groupReadMatch[1]);
        const payload = loadAttemptGroupState(repoRoot, groupId);
        if (!payload.manifest) {
          sendJson(response, 404, { error: `Attempt group not found: ${groupId}` });
          return;
        }
        sendJson(response, 200, payload);
        return;
      }

      const groupReviewMatch = pathname.match(/^\/attempt-groups\/([^/]+)\/review$/);
      if (method === 'GET' && groupReviewMatch) {
        const groupId = decodeURIComponent(groupReviewMatch[1]);
        const payload = loadAttemptGroupState(repoRoot, groupId);
        if (!payload.manifest) {
          sendHtml(response, 404, renderAttemptGroupReviewPage(payload));
          return;
        }
        sendHtml(response, 200, renderAttemptGroupReviewPage(payload));
        return;
      }

      const groupCompareMatch = pathname.match(/^\/attempt-groups\/([^/]+)\/compare$/);
      if (method === 'POST' && groupCompareMatch) {
        await handleCompareAttemptGroup(request, response, decodeURIComponent(groupCompareMatch[1]));
        return;
      }

      const groupFeedbackMatch = pathname.match(/^\/attempt-groups\/([^/]+)\/feedback$/);
      if (method === 'POST' && groupFeedbackMatch) {
        await handleAttemptGroupFeedback(request, response, decodeURIComponent(groupFeedbackMatch[1]));
        return;
      }

      const groupRetryMatch = pathname.match(/^\/attempt-groups\/([^/]+)\/retry$/);
      if (method === 'POST' && groupRetryMatch) {
        await handleAttemptGroupRetry(request, response, decodeURIComponent(groupRetryMatch[1]));
        return;
      }

      sendJson(response, 404, {
        error: `Route not found: ${method} ${pathname}`,
      });
    } catch (error) {
      const failure = error && typeof error.statusCode === 'number'
        ? error
        : createJsonError(500, error.message || 'Unexpected server error');
      sendJson(response, failure.statusCode, failure.payload);
    }
  });

  return {
    repoRoot,
    server,
    broadcast,
    async start() {
      const host = options.host || '127.0.0.1';
      const port = Number.isFinite(options.port) ? options.port : 3017;
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, host, () => {
          server.off('error', reject);
          resolve();
        });
      });
      return server.address();
    },
    async stop() {
      for (const client of [...clients]) {
        try {
          client.end();
        } catch (_error) {
          // Ignore cleanup failures.
        }
      }
      clients.clear();

      if (!server.listening) {
        return;
      }

      await new Promise((resolve, reject) => {
        server.close(error => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    },
  };
}

async function main() {
  const options = parseArgs(process.argv);
  if (options.help) {
    showHelp(0);
  }

  const controller = createParallelBoardServer(options);
  const address = await controller.start();
  const host = typeof address === 'object' && address ? address.address : options.host;
  const port = typeof address === 'object' && address ? address.port : options.port;
  console.log(`Parallel board server listening on http://${host}:${port}`);
}

if (require.main === module) {
  main().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  appendAttemptLog,
  createParallelBoardServer,
  loadAttemptGroupState,
  parseArgs,
  readAttemptLog,
};
