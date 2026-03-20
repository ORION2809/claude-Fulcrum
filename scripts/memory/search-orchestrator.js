'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const { createStateStore } = require('../lib/state-store');
const { createStableId, loadControlPlane } = require('../lib/fulcrum-control');
const { simpleEmbed, cosineSimilarity } = require('../utils/embeddings');

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function normalizeQueryTerms(query) {
  return [...new Set(normalizeText(query).split(/\s+/).filter(Boolean))];
}

function normalizeMode(value) {
  const mode = String(value || 'expand').toLowerCase();
  return ['search', 'expand', 'timeline', 'drill_in'].includes(mode) ? mode : 'expand';
}

function scoreEntry(queryTerms, entry) {
  const haystacks = [
    entry.title,
    entry.summary,
    entry.content,
    ...(entry.keywords || []),
    ...(entry.tags || []),
  ]
    .filter(Boolean)
    .map(normalizeText);

  return queryTerms.reduce((score, term) => {
    return score + haystacks.reduce((termScore, haystack) => {
      if (haystack.includes(term)) {
        return termScore + 1;
      }
      return termScore;
    }, 0);
  }, 0);
}

function computeRecencyBonus(createdAt, now) {
  if (!createdAt) {
    return 0;
  }

  const createdTime = new Date(createdAt).getTime();
  const nowTime = new Date(now || Date.now()).getTime();
  if (!Number.isFinite(createdTime) || !Number.isFinite(nowTime)) {
    return 0;
  }

  const ageMinutes = Math.max(0, (nowTime - createdTime) / 60000);
  if (ageMinutes <= 60) {
    return 1;
  }
  if (ageMinutes <= 60 * 24) {
    return 0.5;
  }
  if (ageMinutes <= 60 * 24 * 7) {
    return 0.2;
  }
  return 0;
}

function computeHybridScore(queryTerms, entry, options = {}) {
  const lexicalScore = scoreEntry(queryTerms, entry);
  const titleText = normalizeText(entry.title);
  const summaryText = normalizeText(entry.summary);
  const contentText = normalizeText(entry.content);
  const exactPhrase = normalizeText(queryTerms.join(' '));
  const matchedTerms = queryTerms.filter(term => {
    return [
      titleText,
      summaryText,
      contentText,
      ...((entry.keywords || []).map(normalizeText)),
      ...((entry.tags || []).map(normalizeText)),
    ].some(haystack => haystack.includes(term));
  });
  const coverageBonus = queryTerms.length > 0
    ? Number(((matchedTerms.length / queryTerms.length) * 2).toFixed(2))
    : 0;
  const recencyBonus = computeRecencyBonus(entry.createdAt, options.now);
  const relationshipBonus = entry.relationship && entry.relationship !== 'seed' ? 0.5 : 0;
  const titleExactBonus = queryTerms.some(term => titleText.includes(term)) ? 0.5 : 0;
  const exactPhraseBonus = exactPhrase && (
    titleText.includes(exactPhrase)
    || summaryText.includes(exactPhrase)
    || contentText.includes(exactPhrase)
  ) ? 0.75 : 0;
  const keywordBonus = Math.min(1, (entry.keywords || []).length * 0.1);
  const titleCoverageBonus = queryTerms.length > 0
    ? Number((((queryTerms.filter(term => titleText.includes(term)).length) / queryTerms.length) * 1.5).toFixed(2))
    : 0;

  return Number((
    lexicalScore
    + coverageBonus
    + recencyBonus
    + relationshipBonus
    + titleExactBonus
    + exactPhraseBonus
    + keywordBonus
    + titleCoverageBonus
  ).toFixed(2));
}

function computeReciprocalRankFusion(rankings, options = {}) {
  const rankConstant = Number.isFinite(Number(options.rankConstant))
    ? Number(options.rankConstant)
    : 60;
  const scoreById = new Map();

  for (const ranking of Array.isArray(rankings) ? rankings : []) {
    for (let index = 0; index < ranking.length; index += 1) {
      const entry = ranking[index];
      if (!entry || !entry.id) {
        continue;
      }

      const nextScore = (scoreById.get(entry.id) || 0) + (1 / (rankConstant + index + 1));
      scoreById.set(entry.id, Number(nextScore.toFixed(6)));
    }
  }

  return scoreById;
}

function rankEntries(entries, queryTerms, options = {}) {
  const candidates = Array.isArray(entries) ? entries : [];
  if (candidates.length === 0) {
    return [];
  }

  const vectorScores = options.vectorScores instanceof Map ? options.vectorScores : new Map();

  const enriched = candidates.map(entry => {
    const lexicalScore = computeHybridScore(queryTerms, entry, options);
    const titleMatchCount = queryTerms.filter(term => normalizeText(entry.title).includes(term)).length;
    const keywordMatchCount = queryTerms.filter(term => {
      return (entry.keywords || []).some(keyword => normalizeText(keyword).includes(term));
    }).length;
    const tagMatchCount = queryTerms.filter(term => {
      return (entry.tags || []).some(tag => normalizeText(tag).includes(term));
    }).length;
    const structureScore = Number((
      titleMatchCount * 1.5
      + keywordMatchCount
      + tagMatchCount * 0.5
      + (entry.relationship && entry.relationship !== 'seed' ? 1 : 0)
    ).toFixed(2));
    const recencyScore = computeRecencyBonus(entry.createdAt, options.now);
    const vectorScore = vectorScores.get(entry.id) || 0;

    return {
      ...entry,
      lexicalScore,
      structureScore,
      recencyScore,
      vectorScore,
    };
  });

  const lexicalRanking = [...enriched]
    .sort((left, right) => {
      return (
        right.lexicalScore - left.lexicalScore
        || right.structureScore - left.structureScore
        || String(right.createdAt || '').localeCompare(String(left.createdAt || ''))
      );
    });
  const recencyRanking = [...enriched]
    .sort((left, right) => {
      return (
        right.recencyScore - left.recencyScore
        || right.lexicalScore - left.lexicalScore
        || String(right.createdAt || '').localeCompare(String(left.createdAt || ''))
      );
    });
  const structureRanking = [...enriched]
    .sort((left, right) => {
      return (
        right.structureScore - left.structureScore
        || right.lexicalScore - left.lexicalScore
        || String(right.createdAt || '').localeCompare(String(left.createdAt || ''))
      );
    });

  const rankings = [lexicalRanking, recencyRanking, structureRanking];

  // Add vector ranking as 4th signal when vector scores are available
  if (vectorScores.size > 0) {
    const vectorRanking = [...enriched]
      .filter(entry => entry.vectorScore > 0)
      .sort((left, right) => {
        return (
          right.vectorScore - left.vectorScore
          || right.lexicalScore - left.lexicalScore
          || String(right.createdAt || '').localeCompare(String(left.createdAt || ''))
        );
      });
    rankings.push(vectorRanking);
  }

  const fusionScores = computeReciprocalRankFusion(rankings, options);

  return enriched
    .map(entry => ({
      ...entry,
      score: Number((
        entry.lexicalScore
        + entry.vectorScore * 3
        + (fusionScores.get(entry.id) || 0) * 100
      ).toFixed(2)),
    }))
    .sort((left, right) => {
      return (
        right.score - left.score
        || right.lexicalScore - left.lexicalScore
        || right.vectorScore - left.vectorScore
        || right.structureScore - left.structureScore
        || String(right.createdAt || '').localeCompare(String(left.createdAt || ''))
      );
    });
}

function buildRetrievalRequest(query, options = {}) {
  const mode = normalizeMode(options.mode);
  const parentTokenBudget = Number.isFinite(Number(options.parentTokenBudget))
    ? Number(options.parentTokenBudget)
    : Number(loadControlPlane().memory?.parentTokenBudget || 500);

  return {
    id: createStableId('retrieval', `${query}:${mode}:${options.sessionId || ''}:${options.attemptId || ''}:${options.focusEntryId || ''}`),
    query: String(query || '').trim(),
    mode,
    sessionId: options.sessionId || null,
    attemptId: options.attemptId || null,
    focusEntryId: options.focusEntryId || null,
    dbPath: options.dbPath || null,
    maxNeighbors: Number.isFinite(Number(options.maxNeighbors)) ? Number(options.maxNeighbors) : 2,
    limit: Number.isFinite(Number(options.limit)) ? Number(options.limit) : 5,
    budget: {
      parentTokenBudget,
    },
    execution: {
      preferIsolated: Boolean(options.preferIsolated || (options.execution && options.execution.preferIsolated)),
      allowSubprocess: options.allowSubprocess !== false,
      kind: 'retrieval_request',
    },
    createdAt: new Date().toISOString(),
  };
}

function getRetrievalWorkerScriptPath() {
  return path.join(__dirname, 'retrieval-worker.js');
}

function buildRetrievalCoordinationDir(request, options = {}) {
  const baseRoot = path.resolve(options.coordinationRoot || path.join(process.cwd(), '.orchestration'));
  return path.join(baseRoot, 'memory-retrieval', request.id);
}

function buildRetrievalArtifacts(request, coordinationDir) {
  return {
    dir: coordinationDir,
    files: [
      {
        path: path.join(coordinationDir, 'task.md'),
        content: [
          '# Retrieval Task',
          '',
          `- Request: \`${request.id}\``,
          `- Mode: \`${request.mode}\``,
          `- Session: \`${request.sessionId || 'none'}\``,
          `- Attempt: \`${request.attemptId || 'none'}\``,
          `- Focus entry: \`${request.focusEntryId || 'none'}\``,
          `- Prefer isolated: \`${request.execution.preferIsolated}\``,
          '',
          '## Objective',
          request.query,
        ].join('\n')
      },
      {
        path: path.join(coordinationDir, 'status.md'),
        content: [
          '# Retrieval Status',
          '',
          '- State: queued',
          `- Request: \`${request.id}\``,
          `- Mode: \`${request.mode}\``,
        ].join('\n')
      },
      {
        path: path.join(coordinationDir, 'handoff.md'),
        content: [
          '# Retrieval Handoff',
          '',
          '## Summary',
          '- Pending',
          '',
          '## Validation',
          '- Pending',
        ].join('\n')
      }
    ]
  };
}

function materializeRetrievalArtifacts(request, options = {}) {
  const coordinationDir = buildRetrievalCoordinationDir(request, options);
  const artifacts = buildRetrievalArtifacts(request, coordinationDir);
  fs.mkdirSync(artifacts.dir, { recursive: true });
  for (const file of artifacts.files) {
    fs.writeFileSync(file.path, `${file.content}\n`, 'utf8');
  }
  return coordinationDir;
}

function updateRetrievalStatus(coordinationDir, fields) {
  const statusPath = path.join(coordinationDir, 'status.md');
  const lines = ['# Retrieval Status', ''];
  for (const [label, value] of Object.entries(fields)) {
    lines.push(`- ${label}: \`${value}\``);
  }
  fs.writeFileSync(statusPath, `${lines.join('\n')}\n`, 'utf8');
}

function writeRetrievalHandoff(coordinationDir, response, execution) {
  const handoffPath = path.join(coordinationDir, 'handoff.md');
  const summary = response.summary || 'No summary generated.';
  const lines = [
    '# Retrieval Handoff',
    '',
    '## Summary',
    `- ${summary}`,
    '',
    '## Validation',
    `- Execution kind: ${execution.kind}`,
    `- Result count: ${Array.isArray(response.results) ? response.results.length : 0}`,
  ];
  fs.writeFileSync(handoffPath, `${lines.join('\n')}\n`, 'utf8');
}

function writeRetrievalDetails(coordinationDir, response) {
  const detailsPath = path.join(coordinationDir, 'response.json');
  fs.writeFileSync(detailsPath, `${JSON.stringify(response, null, 2)}\n`, 'utf8');
  return detailsPath;
}

function expandLinkedEntries(options = {}) {
  const entries = Array.isArray(options.entries) ? options.entries.map(entry => ({ ...entry })) : [];
  const noteIndex = options.noteIndex instanceof Map ? options.noteIndex : new Map();
  const linksByNoteId = options.linksByNoteId instanceof Map ? options.linksByNoteId : new Map();
  const maxNeighbors = Number.isFinite(Number(options.maxNeighbors)) ? Number(options.maxNeighbors) : 2;
  const seenIds = new Set(entries.map(entry => entry.id));
  const expanded = [...entries];

  for (const entry of entries) {
    if (entry.kind !== 'note') {
      continue;
    }

    const links = linksByNoteId.get(entry.id) || [];
    for (const link of links.slice(0, maxNeighbors)) {
      const neighborId = link.fromNoteId === entry.id ? link.toNoteId : link.fromNoteId;
      if (!neighborId || seenIds.has(neighborId) || !noteIndex.has(neighborId)) {
        continue;
      }

      const neighbor = noteIndex.get(neighborId);
      seenIds.add(neighborId);
      expanded.push({
        ...neighbor,
        score: Math.max(1, (entry.score || 1) - 1),
        relationship: link.linkType || 'related_to',
        via: entry.id,
      });
    }
  }

  return expanded;
}

function buildSynthesis(query, entries, options = {}) {
  const parentTokenBudget = Number.isFinite(Number(options.parentTokenBudget))
    ? Number(options.parentTokenBudget)
    : Number(loadControlPlane().memory?.parentTokenBudget || 500);
  const orderedEntries = Array.isArray(entries) ? entries : [];
  const resultLines = [];

  for (const entry of orderedEntries) {
    const relationship = entry.relationship && entry.relationship !== 'seed'
      ? ` (${entry.relationship})`
      : '';
    resultLines.push(`${entry.title}: ${entry.summary}${relationship}`);
  }

  let summary = resultLines.join(' | ');
  const maxCharacters = Math.max(80, parentTokenBudget * 4);
  if (summary.length > maxCharacters) {
    summary = `${summary.slice(0, Math.max(0, maxCharacters - 3))}...`;
  }

  return {
    query,
    summary,
    budget: {
      parentTokenBudget,
      estimatedTokens: Math.max(1, Math.ceil(summary.length / 4)),
    },
    results: orderedEntries.map(entry => ({
      kind: entry.kind,
      id: entry.id,
      title: entry.title,
      summary: entry.summary,
      score: entry.score,
      relationship: entry.relationship || 'seed',
      sessionId: entry.sessionId,
      attemptId: entry.attemptId,
    })),
  };
}

function buildAwarenessHint(entries, options = {}) {
  const synthesized = buildSynthesis(
    'session-start-memory',
    Array.isArray(entries) ? entries.slice(0, 2) : [],
    options
  );
  if (!synthesized.summary) {
    return '';
  }

  const hint = `Memory available: ${synthesized.summary}`;
  return hint.length > 120 ? `${hint.slice(0, 117)}...` : hint;
}

function formatRetrievalResponse(query, entries, options = {}) {
  const mode = normalizeMode(options.mode);
  const safeEntries = Array.isArray(entries) ? entries : [];
  const selectedEntries = mode === 'search'
    ? safeEntries.filter(entry => (entry.relationship || 'seed') === 'seed')
    : safeEntries;
  const synthesis = buildSynthesis(query, selectedEntries, options);

  if (mode === 'drill_in') {
    return {
      ...synthesis,
      mode,
      details: selectedEntries.map(entry => ({
        kind: entry.kind,
        id: entry.id,
        title: entry.title,
        summary: entry.summary,
        relationship: entry.relationship || 'seed',
        anchorRef: entry.anchorRef || null,
        keywords: entry.keywords || [],
        tags: entry.tags || [],
      })),
    };
  }

  return {
    ...synthesis,
    mode,
  };
}

function formatTimelineResponse(query, entries, options = {}) {
  const mode = normalizeMode(options.mode);
  const timeline = Array.isArray(entries) ? entries : [];
  const synthesis = buildSynthesis(query, timeline, options);

  return {
    ...synthesis,
    mode,
    timeline: timeline.map(entry => ({
      kind: entry.kind,
      id: entry.id,
      title: entry.title,
      summary: entry.summary,
      sessionId: entry.sessionId,
      attemptId: entry.attemptId,
      createdAt: entry.createdAt || null,
      anchorRef: entry.anchorRef || null,
    })),
  };
}

function buildParentContextPayload(response, options = {}) {
  const safeResponse = response || {};
  const safeResults = Array.isArray(safeResponse.results) ? safeResponse.results : [];
  const maxSources = Number.isFinite(Number(options.maxSources)) ? Number(options.maxSources) : 3;
  const sources = safeResults.slice(0, maxSources).map(result => ({
    id: result.id,
    title: result.title,
    relationship: result.relationship || 'seed',
    sessionId: result.sessionId || null,
    attemptId: result.attemptId || null,
  }));

  return {
    query: safeResponse.query || '',
    mode: safeResponse.mode || options.mode || 'search',
    summary: safeResponse.summary || '',
    budget: safeResponse.budget || null,
    sources,
    detailCount: safeResults.length,
    transcriptFallbackRequired: safeResponse.mode === 'drill_in',
  };
}

function resolveFocusEntry(store, focusEntryId) {
  if (!focusEntryId) {
    return null;
  }

  return store.getMemoryNoteById(focusEntryId) || store.getObservationById(focusEntryId);
}

async function searchMemory(query, options = {}) {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 5;
  const mode = normalizeMode(options.mode);
  const queryTerms = normalizeQueryTerms(query);
  if (queryTerms.length === 0) {
    return buildSynthesis(query, [], options);
  }

  const store = await createStateStore({
    dbPath: options.dbPath,
    homeDir: process.env.HOME,
  });

  try {
    if (mode === 'timeline') {
      return formatTimelineResponse(query, store.listMemoryTimeline({
        sessionId: options.sessionId,
        attemptId: options.attemptId,
        limit,
      }), options);
    }

    const observations = (
      options.attemptId
        ? store.listObservationsByAttempt(options.attemptId, { limit: 200 })
        : options.sessionId
          ? store.listObservationsBySession(options.sessionId, { limit: 200 })
          : store.listRecentObservations({ limit: 200 })
    ).map(entry => ({
      kind: 'observation',
      id: entry.id,
      title: entry.title,
      summary: entry.summary,
      tags: entry.tags,
      anchorRef: entry.anchorRef,
      sessionId: entry.sessionId,
      attemptId: entry.attemptId,
      createdAt: entry.createdAt,
      relationship: 'seed',
    }));
    const notes = (
      options.attemptId
        ? store.listMemoryNotesByAttempt(options.attemptId, { limit: 200 })
        : options.sessionId
          ? store.getSessionDetail(options.sessionId).memoryNotes.slice(0, 200)
          : store.listRecentMemoryNotes({ limit: 200 })
    ).map(entry => ({
      kind: 'note',
      id: entry.id,
      title: entry.category,
      content: entry.content,
      summary: entry.summary,
      tags: entry.tags,
      keywords: entry.keywords,
      anchorRef: Array.isArray(entry.links) && entry.links.length > 0 ? entry.links[0] : null,
      sessionId: entry.sessionId,
      attemptId: entry.attemptId,
      createdAt: entry.createdAt,
      relationship: 'seed',
    }));

    // FTS5 pre-filtering: use FTS5 to find the most relevant candidates first,
    // then merge with the full scan results to ensure no matches are missed.
    const ftsQuery = queryTerms.join(' ');
    let ftsObservationIds = new Set();
    let ftsNoteIds = new Set();
    try {
      const ftsObservations = store.searchObservationsFTS(ftsQuery, { limit: 50 });
      ftsObservationIds = new Set(ftsObservations.map(o => o.id));
      const ftsNotes = store.searchMemoryNotesFTS(ftsQuery, { limit: 50 });
      ftsNoteIds = new Set(ftsNotes.map(n => n.id));
    } catch (_ftsError) {
      // FTS5 may not be available (e.g. older database without migration 4).
      // Fall through to full-scan ranking.
    }

    // Boost entries that appear in FTS5 results
    const allEntries = [...observations, ...notes].map(entry => {
      const ftsBoost = (entry.kind === 'observation' && ftsObservationIds.has(entry.id))
        || (entry.kind === 'note' && ftsNoteIds.has(entry.id))
        ? 2.0
        : 0;
      return { ...entry, ftsBoost };
    });

    // Vector similarity: compute query embedding and score against stored embeddings
    const vectorScores = new Map();
    try {
      const queryEmbedding = simpleEmbed(queryTerms.join(' '));
      const observationSimilarities = store.findSimilarByVector(queryEmbedding, 'observations', { limit: 50 });
      for (const sim of observationSimilarities) {
        vectorScores.set(sim.sourceId, sim.similarity);
      }
      const noteSimilarities = store.findSimilarByVector(queryEmbedding, 'memory_notes', { limit: 50 });
      for (const sim of noteSimilarities) {
        vectorScores.set(sim.sourceId, sim.similarity);
      }
    } catch (_vectorError) {
      // Vector search may fail if embeddings table doesn't exist yet.
      // Fall through to lexical-only ranking.
    }

    const noteIndex = new Map(notes.map(entry => [entry.id, entry]));
    const linksByNoteId = new Map(
      notes.map(entry => [entry.id, store.listMemoryLinksByNote(entry.id)])
    );

    const scoredEntries = rankEntries(allEntries, queryTerms, { ...options, vectorScores })
      .filter(entry => entry.score > 0)
      .slice(0, limit);
    const expandedEntries = expandLinkedEntries({
      entries: scoredEntries,
      noteIndex,
      linksByNoteId,
      maxNeighbors: options.maxNeighbors,
    });
    const formattedResponse = formatRetrievalResponse(
      query,
      expandedEntries
        .sort((left, right) => right.score - left.score)
        .slice(0, limit + 2),
      { ...options, mode }
    );

    if (mode === 'drill_in') {
      const focus = resolveFocusEntry(store, options.focusEntryId) || formattedResponse.results[0] || null;
      const timeline = store.listMemoryTimeline({
        sessionId: focus && focus.sessionId ? focus.sessionId : options.sessionId,
        attemptId: focus && focus.attemptId ? focus.attemptId : options.attemptId,
        limit: Math.max(limit, 6),
      });

      return {
        ...formattedResponse,
        focus,
        timeline: timeline.map(entry => ({
          kind: entry.kind,
          id: entry.id,
          title: entry.title,
          summary: entry.summary,
          createdAt: entry.createdAt || null,
          anchorRef: entry.anchorRef || null,
          sessionId: entry.sessionId,
          attemptId: entry.attemptId,
        })),
      };
    }

    return formattedResponse;
  } finally {
    store.close();
  }
}

async function executeRetrievalRequest(request, options = {}) {
  const mergedRequest = {
    ...request,
    ...options,
    execution: {
      ...(request.execution || {}),
      ...(options.execution || {}),
    },
  };
  const normalizedRequest = buildRetrievalRequest(mergedRequest.query, mergedRequest);
  const coordinationRoot = mergedRequest.coordinationRoot || (mergedRequest.execution && mergedRequest.execution.coordinationRoot);
  const coordinationDir = materializeRetrievalArtifacts(normalizedRequest, {
    coordinationRoot,
  });
  updateRetrievalStatus(coordinationDir, {
    State: 'running',
    Request: normalizedRequest.id,
    Mode: normalizedRequest.mode,
  });

  if (normalizedRequest.execution.preferIsolated && normalizedRequest.execution.allowSubprocess) {
    const workerResult = spawnSync(
      process.execPath,
      [getRetrievalWorkerScriptPath()],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        input: `${JSON.stringify(normalizedRequest)}\n`,
        timeout: 15000,
      }
    );

    if (workerResult.status === 0 && workerResult.stdout) {
      const parsed = JSON.parse(workerResult.stdout);
      const detailPath = writeRetrievalDetails(coordinationDir, parsed);
      const execution = {
        kind: 'isolated_subprocess',
        preferIsolated: true,
        isolatedImplemented: true,
      };
      updateRetrievalStatus(coordinationDir, {
        State: 'completed',
        Request: normalizedRequest.id,
        Mode: normalizedRequest.mode,
        Execution: execution.kind,
      });
      writeRetrievalHandoff(coordinationDir, parsed, execution);
      return {
        ...buildParentContextPayload(parsed, normalizedRequest),
        request: normalizedRequest,
        execution,
        detailRef: detailPath,
      };
    }

    const fallbackResponse = await searchMemory(normalizedRequest.query, {
      ...normalizedRequest,
      parentTokenBudget: normalizedRequest.budget.parentTokenBudget,
    });
    const detailPath = writeRetrievalDetails(coordinationDir, fallbackResponse);
    const execution = {
      kind: 'in_process_fallback',
      preferIsolated: true,
      isolatedImplemented: false,
      fallbackReason: workerResult.error ? workerResult.error.message : (workerResult.stderr || 'worker failed'),
    };
    updateRetrievalStatus(coordinationDir, {
      State: 'completed',
      Request: normalizedRequest.id,
      Mode: normalizedRequest.mode,
      Execution: execution.kind,
    });
    writeRetrievalHandoff(coordinationDir, fallbackResponse, execution);

    return {
      ...buildParentContextPayload(fallbackResponse, normalizedRequest),
      request: normalizedRequest,
      execution,
      detailRef: detailPath,
    };
  }

  const response = await searchMemory(normalizedRequest.query, {
    ...normalizedRequest,
    parentTokenBudget: normalizedRequest.budget.parentTokenBudget,
  });
  const detailPath = writeRetrievalDetails(coordinationDir, response);
  const execution = {
    kind: 'in_process',
    preferIsolated: normalizedRequest.execution.preferIsolated,
    isolatedImplemented: false,
  };
  updateRetrievalStatus(coordinationDir, {
    State: 'completed',
    Request: normalizedRequest.id,
    Mode: normalizedRequest.mode,
    Execution: execution.kind,
  });
  writeRetrievalHandoff(coordinationDir, response, execution);

  return {
    ...buildParentContextPayload(response, normalizedRequest),
    request: normalizedRequest,
    execution,
    detailRef: detailPath,
  };
}

async function main() {
  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    throw new Error('Usage: node scripts/memory/search-orchestrator.js <query>');
  }

  const results = await searchMemory(query);
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

if (require.main === module) {
  main().catch(error => {
    process.stderr.write(`[search-orchestrator] ${error.message}\n`);
    process.exit(1);
  });
}

module.exports = {
  buildRetrievalRequest,
  buildRetrievalArtifacts,
  buildRetrievalCoordinationDir,
  buildAwarenessHint,
  buildParentContextPayload,
  buildSynthesis,
  computeHybridScore,
  computeReciprocalRankFusion,
  expandLinkedEntries,
  executeRetrievalRequest,
  formatRetrievalResponse,
  formatTimelineResponse,
  getRetrievalWorkerScriptPath,
  materializeRetrievalArtifacts,
  normalizeMode,
  normalizeQueryTerms,
  rankEntries,
  resolveFocusEntry,
  scoreEntry,
  searchMemory,
  writeRetrievalDetails,
};
