'use strict';

const { assertValidEntity } = require('./schema');
const { simpleEmbed, cosineSimilarity } = require('../../utils/embeddings');

const ACTIVE_SESSION_STATES = ['active', 'running', 'idle'];
const SUCCESS_OUTCOMES = new Set(['success', 'succeeded', 'passed']);
const FAILURE_OUTCOMES = new Set(['failure', 'failed', 'error']);

function normalizeLimit(value, fallback) {
  if (value === undefined || value === null) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid limit: ${value}`);
  }

  return parsed;
}

function parseJsonColumn(value, fallback) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return JSON.parse(value);
}

function stringifyJson(value, label) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new Error(`Failed to serialize ${label}: ${error.message}`);
  }
}

function mapSessionRow(row) {
  const snapshot = parseJsonColumn(row.snapshot, {});
  return {
    id: row.id,
    adapterId: row.adapter_id,
    harness: row.harness,
    state: row.state,
    repoRoot: row.repo_root,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    snapshot,
    workerCount: Array.isArray(snapshot && snapshot.workers) ? snapshot.workers.length : 0,
  };
}

function mapSkillRunRow(row) {
  return {
    id: row.id,
    skillId: row.skill_id,
    skillVersion: row.skill_version,
    sessionId: row.session_id,
    taskDescription: row.task_description,
    outcome: row.outcome,
    failureReason: row.failure_reason,
    tokensUsed: row.tokens_used,
    durationMs: row.duration_ms,
    userFeedback: row.user_feedback,
    createdAt: row.created_at,
  };
}

function mapSkillVersionRow(row) {
  return {
    skillId: row.skill_id,
    version: row.version,
    contentHash: row.content_hash,
    amendmentReason: row.amendment_reason,
    promotedAt: row.promoted_at,
    rolledBackAt: row.rolled_back_at,
  };
}

function mapDecisionRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    title: row.title,
    rationale: row.rationale,
    alternatives: parseJsonColumn(row.alternatives, []),
    supersedes: row.supersedes,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapInstallStateRow(row) {
  const modules = parseJsonColumn(row.modules, []);
  const operations = parseJsonColumn(row.operations, []);
  const status = row.source_version && row.installed_at ? 'healthy' : 'warning';

  return {
    targetId: row.target_id,
    targetRoot: row.target_root,
    profile: row.profile,
    modules,
    operations,
    installedAt: row.installed_at,
    sourceVersion: row.source_version,
    moduleCount: Array.isArray(modules) ? modules.length : 0,
    operationCount: Array.isArray(operations) ? operations.length : 0,
    status,
  };
}

function mapGovernanceEventRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    eventType: row.event_type,
    payload: parseJsonColumn(row.payload, null),
    resolvedAt: row.resolved_at,
    resolution: row.resolution,
    createdAt: row.created_at,
  };
}

function mapAttemptRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    parentAttemptId: row.parent_attempt_id,
    branchName: row.branch_name,
    worktreePath: row.worktree_path,
    status: row.status,
    metadata: parseJsonColumn(row.metadata, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPendingMessageRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    attemptId: row.attempt_id,
    sourceEvent: row.source_event,
    payload: parseJsonColumn(row.payload, null),
    contentHash: row.content_hash,
    status: row.status,
    error: row.error,
    claimedAt: row.claimed_at,
    processedAt: row.processed_at,
    createdAt: row.created_at,
  };
}

function mapObservationRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    attemptId: row.attempt_id,
    sourceEvent: row.source_event,
    title: row.title,
    summary: row.summary,
    contentHash: row.content_hash,
    anchorRef: row.anchor_ref,
    tags: parseJsonColumn(row.tags, []),
    metadata: parseJsonColumn(row.metadata, {}),
    createdAt: row.created_at,
    lastAccessedAt: row.last_accessed_at,
  };
}

function mapMemoryNoteRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    attemptId: row.attempt_id,
    category: row.category,
    content: row.content,
    summary: row.summary,
    tags: parseJsonColumn(row.tags, []),
    keywords: parseJsonColumn(row.keywords, []),
    links: parseJsonColumn(row.links, []),
    retrievalMetadata: parseJsonColumn(row.retrieval_metadata, {}),
    evolutionHistory: parseJsonColumn(row.evolution_history, []),
    createdAt: row.created_at,
    accessedAt: row.accessed_at,
  };
}

function mapMemoryLinkRow(row) {
  return {
    id: row.id,
    fromNoteId: row.from_note_id,
    toNoteId: row.to_note_id,
    linkType: row.link_type,
    weight: row.weight,
    metadata: parseJsonColumn(row.metadata, {}),
    createdAt: row.created_at,
  };
}

function mapQualityRunRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    attemptId: row.attempt_id,
    iteration: row.iteration,
    score: row.score,
    band: row.band,
    threshold: row.threshold,
    passed: Boolean(row.passed),
    terminationReason: row.termination_reason,
    evidence: parseJsonColumn(row.evidence, {}),
    findings: parseJsonColumn(row.findings, []),
    createdAt: row.created_at,
  };
}

function classifyOutcome(outcome) {
  const normalized = String(outcome || '').toLowerCase();
  if (SUCCESS_OUTCOMES.has(normalized)) {
    return 'success';
  }

  if (FAILURE_OUTCOMES.has(normalized)) {
    return 'failure';
  }

  return 'unknown';
}

function toPercent(numerator, denominator) {
  if (denominator === 0) {
    return null;
  }

  return Number(((numerator / denominator) * 100).toFixed(1));
}

function summarizeSkillRuns(skillRuns) {
  const summary = {
    totalCount: skillRuns.length,
    knownCount: 0,
    successCount: 0,
    failureCount: 0,
    unknownCount: 0,
    successRate: null,
    failureRate: null,
  };

  for (const skillRun of skillRuns) {
    const classification = classifyOutcome(skillRun.outcome);
    if (classification === 'success') {
      summary.successCount += 1;
      summary.knownCount += 1;
    } else if (classification === 'failure') {
      summary.failureCount += 1;
      summary.knownCount += 1;
    } else {
      summary.unknownCount += 1;
    }
  }

  summary.successRate = toPercent(summary.successCount, summary.knownCount);
  summary.failureRate = toPercent(summary.failureCount, summary.knownCount);
  return summary;
}

function summarizeInstallHealth(installations) {
  if (installations.length === 0) {
    return {
      status: 'missing',
      totalCount: 0,
      healthyCount: 0,
      warningCount: 0,
      installations: [],
    };
  }

  const summary = installations.reduce((result, installation) => {
    if (installation.status === 'healthy') {
      result.healthyCount += 1;
    } else {
      result.warningCount += 1;
    }
    return result;
  }, {
    totalCount: installations.length,
    healthyCount: 0,
    warningCount: 0,
  });

  return {
    status: summary.warningCount > 0 ? 'warning' : 'healthy',
    ...summary,
    installations,
  };
}

function normalizeSessionInput(session) {
  return {
    id: session.id,
    adapterId: session.adapterId,
    harness: session.harness,
    state: session.state,
    repoRoot: session.repoRoot ?? null,
    startedAt: session.startedAt ?? null,
    endedAt: session.endedAt ?? null,
    snapshot: session.snapshot ?? {},
  };
}

function normalizeSkillRunInput(skillRun) {
  return {
    id: skillRun.id,
    skillId: skillRun.skillId,
    skillVersion: skillRun.skillVersion,
    sessionId: skillRun.sessionId,
    taskDescription: skillRun.taskDescription,
    outcome: skillRun.outcome,
    failureReason: skillRun.failureReason ?? null,
    tokensUsed: skillRun.tokensUsed ?? null,
    durationMs: skillRun.durationMs ?? null,
    userFeedback: skillRun.userFeedback ?? null,
    createdAt: skillRun.createdAt || new Date().toISOString(),
  };
}

function normalizeSkillVersionInput(skillVersion) {
  return {
    skillId: skillVersion.skillId,
    version: skillVersion.version,
    contentHash: skillVersion.contentHash,
    amendmentReason: skillVersion.amendmentReason ?? null,
    promotedAt: skillVersion.promotedAt ?? null,
    rolledBackAt: skillVersion.rolledBackAt ?? null,
  };
}

function normalizeDecisionInput(decision) {
  return {
    id: decision.id,
    sessionId: decision.sessionId,
    title: decision.title,
    rationale: decision.rationale,
    alternatives: decision.alternatives === undefined || decision.alternatives === null
      ? []
      : decision.alternatives,
    supersedes: decision.supersedes ?? null,
    status: decision.status,
    createdAt: decision.createdAt || new Date().toISOString(),
  };
}

function normalizeInstallStateInput(installState) {
  return {
    targetId: installState.targetId,
    targetRoot: installState.targetRoot,
    profile: installState.profile ?? null,
    modules: installState.modules === undefined || installState.modules === null
      ? []
      : installState.modules,
    operations: installState.operations === undefined || installState.operations === null
      ? []
      : installState.operations,
    installedAt: installState.installedAt || new Date().toISOString(),
    sourceVersion: installState.sourceVersion ?? null,
  };
}

function normalizeGovernanceEventInput(governanceEvent) {
  return {
    id: governanceEvent.id,
    sessionId: governanceEvent.sessionId ?? null,
    eventType: governanceEvent.eventType,
    payload: governanceEvent.payload ?? null,
    resolvedAt: governanceEvent.resolvedAt ?? null,
    resolution: governanceEvent.resolution ?? null,
    createdAt: governanceEvent.createdAt || new Date().toISOString(),
  };
}

function normalizeAttemptInput(attempt) {
  const timestamp = attempt.updatedAt || attempt.createdAt || new Date().toISOString();
  return {
    id: attempt.id,
    sessionId: attempt.sessionId,
    parentAttemptId: attempt.parentAttemptId ?? null,
    branchName: attempt.branchName,
    worktreePath: attempt.worktreePath,
    status: attempt.status,
    metadata: attempt.metadata ?? {},
    createdAt: attempt.createdAt || timestamp,
    updatedAt: timestamp,
  };
}

function normalizePendingMessageInput(message) {
  return {
    id: message.id,
    sessionId: message.sessionId ?? null,
    attemptId: message.attemptId ?? null,
    sourceEvent: message.sourceEvent,
    payload: message.payload ?? null,
    contentHash: message.contentHash,
    status: message.status || 'pending',
    error: message.error ?? null,
    claimedAt: message.claimedAt ?? null,
    processedAt: message.processedAt ?? null,
    createdAt: message.createdAt || new Date().toISOString(),
  };
}

function normalizeObservationInput(observation) {
  return {
    id: observation.id,
    sessionId: observation.sessionId ?? null,
    attemptId: observation.attemptId ?? null,
    sourceEvent: observation.sourceEvent,
    title: observation.title,
    summary: observation.summary,
    contentHash: observation.contentHash,
    anchorRef: observation.anchorRef ?? null,
    tags: observation.tags === undefined || observation.tags === null ? [] : observation.tags,
    metadata: observation.metadata ?? {},
    createdAt: observation.createdAt || new Date().toISOString(),
    lastAccessedAt: observation.lastAccessedAt ?? null,
  };
}

function normalizeMemoryNoteInput(note) {
  return {
    id: note.id,
    sessionId: note.sessionId ?? null,
    attemptId: note.attemptId ?? null,
    category: note.category,
    content: note.content,
    summary: note.summary ?? null,
    tags: note.tags === undefined || note.tags === null ? [] : note.tags,
    keywords: note.keywords === undefined || note.keywords === null ? [] : note.keywords,
    links: note.links === undefined || note.links === null ? [] : note.links,
    retrievalMetadata: note.retrievalMetadata ?? {},
    evolutionHistory: note.evolutionHistory === undefined || note.evolutionHistory === null ? [] : note.evolutionHistory,
    createdAt: note.createdAt || new Date().toISOString(),
    accessedAt: note.accessedAt ?? null,
  };
}

function normalizeMemoryLinkInput(link) {
  return {
    id: link.id,
    fromNoteId: link.fromNoteId,
    toNoteId: link.toNoteId,
    linkType: link.linkType,
    weight: Number.isFinite(Number(link.weight)) ? Number(link.weight) : 1,
    metadata: link.metadata ?? {},
    createdAt: link.createdAt || new Date().toISOString(),
  };
}

function normalizeQualityRunInput(qualityRun) {
  return {
    id: qualityRun.id,
    sessionId: qualityRun.sessionId ?? null,
    attemptId: qualityRun.attemptId ?? null,
    iteration: qualityRun.iteration,
    score: qualityRun.score,
    band: qualityRun.band,
    threshold: qualityRun.threshold,
    passed: Boolean(qualityRun.passed),
    terminationReason: qualityRun.terminationReason,
    evidence: qualityRun.evidence ?? {},
    findings: qualityRun.findings === undefined || qualityRun.findings === null ? [] : qualityRun.findings,
    createdAt: qualityRun.createdAt || new Date().toISOString(),
  };
}

function createQueryApi(db, options = {}) {
  const fts5Available = Boolean(options.fts5Available);
  const listRecentSessionsStatement = db.prepare(`
    SELECT *
    FROM sessions
    ORDER BY COALESCE(started_at, ended_at, '') DESC, id DESC
    LIMIT ?
  `);
  const countSessionsStatement = db.prepare(`
    SELECT COUNT(*) AS total_count
    FROM sessions
  `);
  const getSessionStatement = db.prepare(`
    SELECT *
    FROM sessions
    WHERE id = ?
  `);
  const getSessionSkillRunsStatement = db.prepare(`
    SELECT *
    FROM skill_runs
    WHERE session_id = ?
    ORDER BY created_at DESC, id DESC
  `);
  const getSessionDecisionsStatement = db.prepare(`
    SELECT *
    FROM decisions
    WHERE session_id = ?
    ORDER BY created_at DESC, id DESC
  `);
  const listActiveSessionsStatement = db.prepare(`
    SELECT *
    FROM sessions
    WHERE ended_at IS NULL
      AND state IN ('active', 'running', 'idle')
    ORDER BY COALESCE(started_at, ended_at, '') DESC, id DESC
    LIMIT ?
  `);
  const countActiveSessionsStatement = db.prepare(`
    SELECT COUNT(*) AS total_count
    FROM sessions
    WHERE ended_at IS NULL
      AND state IN ('active', 'running', 'idle')
  `);
  const listRecentSkillRunsStatement = db.prepare(`
    SELECT *
    FROM skill_runs
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const listInstallStateStatement = db.prepare(`
    SELECT *
    FROM install_state
    ORDER BY installed_at DESC, target_id ASC
  `);
  const countPendingGovernanceStatement = db.prepare(`
    SELECT COUNT(*) AS total_count
    FROM governance_events
    WHERE resolved_at IS NULL
  `);
  const listPendingGovernanceStatement = db.prepare(`
    SELECT *
    FROM governance_events
    WHERE resolved_at IS NULL
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const getSkillVersionStatement = db.prepare(`
    SELECT *
    FROM skill_versions
    WHERE skill_id = ? AND version = ?
  `);
  const listAttemptsBySessionStatement = db.prepare(`
    SELECT *
    FROM attempts
    WHERE session_id = ?
    ORDER BY created_at DESC, id DESC
  `);
  const getAttemptByIdStatement = db.prepare(`
    SELECT *
    FROM attempts
    WHERE id = ?
  `);
  const countAttemptsStatement = db.prepare(`
    SELECT COUNT(*) AS total_count
    FROM attempts
  `);
  const countActiveAttemptsStatement = db.prepare(`
    SELECT COUNT(*) AS total_count
    FROM attempts
    WHERE status IN ('queued', 'running', 'waiting', 'blocked')
  `);
  const listRecentAttemptsStatement = db.prepare(`
    SELECT *
    FROM attempts
    ORDER BY updated_at DESC, id DESC
    LIMIT ?
  `);
  const countPendingMessagesByStatusStatement = db.prepare(`
    SELECT status, COUNT(*) AS total_count
    FROM pending_messages
    GROUP BY status
  `);
  const listPendingMessagesStatement = db.prepare(`
    SELECT *
    FROM pending_messages
    WHERE status IN ('pending', 'processing', 'failed')
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const getPendingMessageByIdStatement = db.prepare(`
    SELECT *
    FROM pending_messages
    WHERE id = ?
  `);
  const getPendingMessageByContentHashStatement = db.prepare(`
    SELECT *
    FROM pending_messages
    WHERE content_hash = ?
  `);
  const resetStalePendingMessagesStatement = db.prepare(`
    UPDATE pending_messages
    SET status = 'pending',
        error = NULL,
        claimed_at = NULL,
        processed_at = NULL
    WHERE status = 'processing'
      AND claimed_at IS NOT NULL
      AND claimed_at < @stale_before
      AND (@session_id IS NULL OR session_id = @session_id)
      AND (@attempt_id IS NULL OR attempt_id = @attempt_id)
  `);
  const claimPendingMessageStatement = db.prepare(`
    UPDATE pending_messages
    SET status = 'processing',
        error = NULL,
        claimed_at = @claimed_at,
        processed_at = NULL
    WHERE id = @id
  `);
  const getObservationByIdStatement = db.prepare(`
    SELECT *
    FROM observations
    WHERE id = ?
  `);
  const getObservationByContentHashStatement = db.prepare(`
    SELECT *
    FROM observations
    WHERE content_hash = ?
  `);
  const getMemoryNoteByIdStatement = db.prepare(`
    SELECT *
    FROM memory_notes
    WHERE id = ?
  `);
  const listRecentObservationsStatement = db.prepare(`
    SELECT *
    FROM observations
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const listObservationsBySessionStatement = db.prepare(`
    SELECT *
    FROM observations
    WHERE session_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const listObservationsByAttemptStatement = db.prepare(`
    SELECT *
    FROM observations
    WHERE attempt_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const countObservationsStatement = db.prepare(`
    SELECT COUNT(*) AS total_count
    FROM observations
  `);
  const listMemoryNotesBySessionStatement = db.prepare(`
    SELECT *
    FROM memory_notes
    WHERE session_id = ?
    ORDER BY created_at DESC, id DESC
  `);
  const listMemoryNotesByAttemptStatement = db.prepare(`
    SELECT *
    FROM memory_notes
    WHERE attempt_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const listRecentMemoryNotesStatement = db.prepare(`
    SELECT *
    FROM memory_notes
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const countMemoryNotesStatement = db.prepare(`
    SELECT COUNT(*) AS total_count
    FROM memory_notes
  `);
  const listMemoryLinksByNoteStatement = db.prepare(`
    SELECT *
    FROM memory_links
    WHERE from_note_id = ? OR to_note_id = ?
    ORDER BY created_at DESC, id DESC
  `);
  const listQualityRunsBySessionStatement = db.prepare(`
    SELECT *
    FROM quality_runs
    WHERE session_id = ?
    ORDER BY iteration DESC, created_at DESC, id DESC
  `);
  const listRecentQualityRunsStatement = db.prepare(`
    SELECT *
    FROM quality_runs
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);
  const countQualityRunsStatement = db.prepare(`
    SELECT COUNT(*) AS total_count
    FROM quality_runs
  `);

  // --- FTS5 search statements (conditional on FTS5 module availability) ---
  let searchObservationsFTSStatement = null;
  let searchMemoryNotesFTSStatement = null;

  if (fts5Available) {
    try {
      searchObservationsFTSStatement = db.prepare(`
        SELECT o.*
        FROM observations_fts fts
        JOIN observations o ON o.rowid = fts.rowid
        WHERE observations_fts MATCH ?
        ORDER BY rank
        LIMIT ?
      `);
      searchMemoryNotesFTSStatement = db.prepare(`
        SELECT n.*
        FROM memory_notes_fts fts
        JOIN memory_notes n ON n.rowid = fts.rowid
        WHERE memory_notes_fts MATCH ?
        ORDER BY rank
        LIMIT ?
      `);
    } catch (_ftsError) {
      // FTS5 tables may not exist — fall back to LIKE
      searchObservationsFTSStatement = null;
      searchMemoryNotesFTSStatement = null;
    }
  }

  // LIKE-based fallback search statements (always available)
  const searchObservationsLikeStatement = db.prepare(`
    SELECT *
    FROM observations
    WHERE title LIKE ? OR summary LIKE ?
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);

  const searchMemoryNotesLikeStatement = db.prepare(`
    SELECT *
    FROM memory_notes
    WHERE category LIKE ? OR content LIKE ? OR summary LIKE ?
    ORDER BY created_at DESC, id DESC
    LIMIT ?
  `);

  // --- Embedding storage statements ---
  const upsertEmbeddingStatement = db.prepare(`
    INSERT INTO embeddings (id, source_table, source_id, model, dimensions, vector, created_at)
    VALUES (@id, @source_table, @source_id, @model, @dimensions, @vector, @created_at)
    ON CONFLICT(source_table, source_id) DO UPDATE SET
      id = excluded.id,
      model = excluded.model,
      dimensions = excluded.dimensions,
      vector = excluded.vector,
      created_at = excluded.created_at
  `);

  const getEmbeddingStatement = db.prepare(`
    SELECT * FROM embeddings WHERE source_table = ? AND source_id = ?
  `);

  const listEmbeddingsByTableStatement = db.prepare(`
    SELECT * FROM embeddings WHERE source_table = ? ORDER BY created_at DESC LIMIT ?
  `);

  const upsertSessionStatement = db.prepare(`
    INSERT INTO sessions (
      id,
      adapter_id,
      harness,
      state,
      repo_root,
      started_at,
      ended_at,
      snapshot
    ) VALUES (
      @id,
      @adapter_id,
      @harness,
      @state,
      @repo_root,
      @started_at,
      @ended_at,
      @snapshot
    )
    ON CONFLICT(id) DO UPDATE SET
      adapter_id = excluded.adapter_id,
      harness = excluded.harness,
      state = excluded.state,
      repo_root = excluded.repo_root,
      started_at = excluded.started_at,
      ended_at = excluded.ended_at,
      snapshot = excluded.snapshot
  `);

  const insertSkillRunStatement = db.prepare(`
    INSERT INTO skill_runs (
      id,
      skill_id,
      skill_version,
      session_id,
      task_description,
      outcome,
      failure_reason,
      tokens_used,
      duration_ms,
      user_feedback,
      created_at
    ) VALUES (
      @id,
      @skill_id,
      @skill_version,
      @session_id,
      @task_description,
      @outcome,
      @failure_reason,
      @tokens_used,
      @duration_ms,
      @user_feedback,
      @created_at
    )
    ON CONFLICT(id) DO UPDATE SET
      skill_id = excluded.skill_id,
      skill_version = excluded.skill_version,
      session_id = excluded.session_id,
      task_description = excluded.task_description,
      outcome = excluded.outcome,
      failure_reason = excluded.failure_reason,
      tokens_used = excluded.tokens_used,
      duration_ms = excluded.duration_ms,
      user_feedback = excluded.user_feedback,
      created_at = excluded.created_at
  `);

  const upsertSkillVersionStatement = db.prepare(`
    INSERT INTO skill_versions (
      skill_id,
      version,
      content_hash,
      amendment_reason,
      promoted_at,
      rolled_back_at
    ) VALUES (
      @skill_id,
      @version,
      @content_hash,
      @amendment_reason,
      @promoted_at,
      @rolled_back_at
    )
    ON CONFLICT(skill_id, version) DO UPDATE SET
      content_hash = excluded.content_hash,
      amendment_reason = excluded.amendment_reason,
      promoted_at = excluded.promoted_at,
      rolled_back_at = excluded.rolled_back_at
  `);

  const insertDecisionStatement = db.prepare(`
    INSERT INTO decisions (
      id,
      session_id,
      title,
      rationale,
      alternatives,
      supersedes,
      status,
      created_at
    ) VALUES (
      @id,
      @session_id,
      @title,
      @rationale,
      @alternatives,
      @supersedes,
      @status,
      @created_at
    )
    ON CONFLICT(id) DO UPDATE SET
      session_id = excluded.session_id,
      title = excluded.title,
      rationale = excluded.rationale,
      alternatives = excluded.alternatives,
      supersedes = excluded.supersedes,
      status = excluded.status,
      created_at = excluded.created_at
  `);

  const upsertInstallStateStatement = db.prepare(`
    INSERT INTO install_state (
      target_id,
      target_root,
      profile,
      modules,
      operations,
      installed_at,
      source_version
    ) VALUES (
      @target_id,
      @target_root,
      @profile,
      @modules,
      @operations,
      @installed_at,
      @source_version
    )
    ON CONFLICT(target_id, target_root) DO UPDATE SET
      profile = excluded.profile,
      modules = excluded.modules,
      operations = excluded.operations,
      installed_at = excluded.installed_at,
      source_version = excluded.source_version
  `);

  const insertGovernanceEventStatement = db.prepare(`
    INSERT INTO governance_events (
      id,
      session_id,
      event_type,
      payload,
      resolved_at,
      resolution,
      created_at
    ) VALUES (
      @id,
      @session_id,
      @event_type,
      @payload,
      @resolved_at,
      @resolution,
      @created_at
    )
    ON CONFLICT(id) DO UPDATE SET
      session_id = excluded.session_id,
      event_type = excluded.event_type,
      payload = excluded.payload,
      resolved_at = excluded.resolved_at,
      resolution = excluded.resolution,
      created_at = excluded.created_at
  `);
  const upsertAttemptStatement = db.prepare(`
    INSERT INTO attempts (
      id,
      session_id,
      parent_attempt_id,
      branch_name,
      worktree_path,
      status,
      metadata,
      created_at,
      updated_at
    ) VALUES (
      @id,
      @session_id,
      @parent_attempt_id,
      @branch_name,
      @worktree_path,
      @status,
      @metadata,
      @created_at,
      @updated_at
    )
    ON CONFLICT(id) DO UPDATE SET
      session_id = excluded.session_id,
      parent_attempt_id = excluded.parent_attempt_id,
      branch_name = excluded.branch_name,
      worktree_path = excluded.worktree_path,
      status = excluded.status,
      metadata = excluded.metadata,
      created_at = excluded.created_at,
      updated_at = excluded.updated_at
  `);
  const upsertPendingMessageStatement = db.prepare(`
    INSERT INTO pending_messages (
      id,
      session_id,
      attempt_id,
      source_event,
      payload,
      content_hash,
      status,
      error,
      claimed_at,
      processed_at,
      created_at
    ) VALUES (
      @id,
      @session_id,
      @attempt_id,
      @source_event,
      @payload,
      @content_hash,
      @status,
      @error,
      @claimed_at,
      @processed_at,
      @created_at
    )
    ON CONFLICT(id) DO UPDATE SET
      session_id = excluded.session_id,
      attempt_id = excluded.attempt_id,
      source_event = excluded.source_event,
      payload = excluded.payload,
      content_hash = excluded.content_hash,
      status = excluded.status,
      error = excluded.error,
      claimed_at = excluded.claimed_at,
      processed_at = excluded.processed_at,
      created_at = excluded.created_at
  `);
  const updatePendingMessageStatusStatement = db.prepare(`
    UPDATE pending_messages
    SET status = @status,
        error = @error,
        claimed_at = @claimed_at,
        processed_at = @processed_at
    WHERE id = @id
  `);
  const insertObservationStatement = db.prepare(`
    INSERT INTO observations (
      id,
      session_id,
      attempt_id,
      source_event,
      title,
      summary,
      content_hash,
      anchor_ref,
      tags,
      metadata,
      created_at,
      last_accessed_at
    ) VALUES (
      @id,
      @session_id,
      @attempt_id,
      @source_event,
      @title,
      @summary,
      @content_hash,
      @anchor_ref,
      @tags,
      @metadata,
      @created_at,
      @last_accessed_at
    )
    ON CONFLICT(id) DO UPDATE SET
      session_id = excluded.session_id,
      attempt_id = excluded.attempt_id,
      source_event = excluded.source_event,
      title = excluded.title,
      summary = excluded.summary,
      content_hash = excluded.content_hash,
      anchor_ref = excluded.anchor_ref,
      tags = excluded.tags,
      metadata = excluded.metadata,
      created_at = excluded.created_at,
      last_accessed_at = excluded.last_accessed_at
  `);
  const insertMemoryNoteStatement = db.prepare(`
    INSERT INTO memory_notes (
      id,
      session_id,
      attempt_id,
      category,
      content,
      summary,
      tags,
      keywords,
      links,
      retrieval_metadata,
      evolution_history,
      created_at,
      accessed_at
    ) VALUES (
      @id,
      @session_id,
      @attempt_id,
      @category,
      @content,
      @summary,
      @tags,
      @keywords,
      @links,
      @retrieval_metadata,
      @evolution_history,
      @created_at,
      @accessed_at
    )
    ON CONFLICT(id) DO UPDATE SET
      session_id = excluded.session_id,
      attempt_id = excluded.attempt_id,
      category = excluded.category,
      content = excluded.content,
      summary = excluded.summary,
      tags = excluded.tags,
      keywords = excluded.keywords,
      links = excluded.links,
      retrieval_metadata = excluded.retrieval_metadata,
      evolution_history = excluded.evolution_history,
      created_at = excluded.created_at,
      accessed_at = excluded.accessed_at
  `);
  const insertMemoryLinkStatement = db.prepare(`
    INSERT INTO memory_links (
      id,
      from_note_id,
      to_note_id,
      link_type,
      weight,
      metadata,
      created_at
    ) VALUES (
      @id,
      @from_note_id,
      @to_note_id,
      @link_type,
      @weight,
      @metadata,
      @created_at
    )
    ON CONFLICT(id) DO UPDATE SET
      from_note_id = excluded.from_note_id,
      to_note_id = excluded.to_note_id,
      link_type = excluded.link_type,
      weight = excluded.weight,
      metadata = excluded.metadata,
      created_at = excluded.created_at
  `);
  const insertQualityRunStatement = db.prepare(`
    INSERT INTO quality_runs (
      id,
      session_id,
      attempt_id,
      iteration,
      score,
      band,
      threshold,
      passed,
      termination_reason,
      evidence,
      findings,
      created_at
    ) VALUES (
      @id,
      @session_id,
      @attempt_id,
      @iteration,
      @score,
      @band,
      @threshold,
      @passed,
      @termination_reason,
      @evidence,
      @findings,
      @created_at
    )
    ON CONFLICT(id) DO UPDATE SET
      session_id = excluded.session_id,
      attempt_id = excluded.attempt_id,
      iteration = excluded.iteration,
      score = excluded.score,
      band = excluded.band,
      threshold = excluded.threshold,
      passed = excluded.passed,
      termination_reason = excluded.termination_reason,
      evidence = excluded.evidence,
      findings = excluded.findings,
      created_at = excluded.created_at
  `);

  function getSessionById(id) {
    const row = getSessionStatement.get(id);
    return row ? mapSessionRow(row) : null;
  }

  function listRecentSessions(options = {}) {
    const limit = normalizeLimit(options.limit, 10);
    return {
      totalCount: countSessionsStatement.get().total_count,
      sessions: listRecentSessionsStatement.all(limit).map(mapSessionRow),
    };
  }

  function getSessionDetail(id) {
    const session = getSessionById(id);
    if (!session) {
      return null;
    }

    const workers = Array.isArray(session.snapshot && session.snapshot.workers)
      ? session.snapshot.workers.map(worker => ({ ...worker }))
      : [];

    return {
      session,
      workers,
      attempts: listAttemptsBySessionStatement.all(id).map(mapAttemptRow),
      memoryNotes: listMemoryNotesBySessionStatement.all(id).map(mapMemoryNoteRow),
      qualityRuns: listQualityRunsBySessionStatement.all(id).map(mapQualityRunRow),
      skillRuns: getSessionSkillRunsStatement.all(id).map(mapSkillRunRow),
      decisions: getSessionDecisionsStatement.all(id).map(mapDecisionRow),
    };
  }

  function getMemoryStatus(options = {}) {
    const limit = normalizeLimit(options.limit, 5);
    const statusRows = countPendingMessagesByStatusStatement.all();
    const counts = statusRows.reduce((result, row) => ({
      ...result,
      [row.status]: row.total_count,
    }), {
      pending: 0,
      processing: 0,
      processed: 0,
      failed: 0,
    });

    return {
      observationsCount: countObservationsStatement.get().total_count,
      memoryNotesCount: countMemoryNotesStatement.get().total_count,
      queue: counts,
      recentPending: listPendingMessagesStatement.all(limit).map(mapPendingMessageRow),
      recentObservations: listRecentObservationsStatement.all(limit).map(mapObservationRow),
      recentNotes: listRecentMemoryNotesStatement.all(limit).map(mapMemoryNoteRow),
    };
  }

  function getQualityStatus(options = {}) {
    const limit = normalizeLimit(options.limit, 5);
    return {
      totalCount: countQualityRunsStatement.get().total_count,
      recent: listRecentQualityRunsStatement.all(limit).map(mapQualityRunRow),
    };
  }

  function getStatus(options = {}) {
    const activeLimit = normalizeLimit(options.activeLimit, 5);
    const recentSkillRunLimit = normalizeLimit(options.recentSkillRunLimit, 20);
    const pendingLimit = normalizeLimit(options.pendingLimit, 5);

    const activeSessions = listActiveSessionsStatement.all(activeLimit).map(mapSessionRow);
    const recentSkillRuns = listRecentSkillRunsStatement.all(recentSkillRunLimit).map(mapSkillRunRow);
    const installations = listInstallStateStatement.all().map(mapInstallStateRow);
    const pendingGovernanceEvents = listPendingGovernanceStatement.all(pendingLimit).map(mapGovernanceEventRow);

    return {
      generatedAt: new Date().toISOString(),
      activeSessions: {
        activeCount: countActiveSessionsStatement.get().total_count,
        sessions: activeSessions,
      },
      skillRuns: {
        windowSize: recentSkillRunLimit,
        summary: summarizeSkillRuns(recentSkillRuns),
        recent: recentSkillRuns,
      },
      installHealth: summarizeInstallHealth(installations),
      governance: {
        pendingCount: countPendingGovernanceStatement.get().total_count,
        events: pendingGovernanceEvents,
      },
      attempts: {
        totalCount: countAttemptsStatement.get().total_count,
        activeCount: countActiveAttemptsStatement.get().total_count,
        recent: listRecentAttemptsStatement.all(activeLimit).map(mapAttemptRow),
      },
      memory: getMemoryStatus({ limit: pendingLimit }),
      quality: getQualityStatus({ limit: pendingLimit }),
    };
  }

  return {
    getSessionById,
    getSessionDetail,
    getMemoryStatus,
    getQualityStatus,
    getStatus,
    insertDecision(decision) {
      const normalized = normalizeDecisionInput(decision);
      assertValidEntity('decision', normalized);
      insertDecisionStatement.run({
        id: normalized.id,
        session_id: normalized.sessionId,
        title: normalized.title,
        rationale: normalized.rationale,
        alternatives: stringifyJson(normalized.alternatives, 'decision.alternatives'),
        supersedes: normalized.supersedes,
        status: normalized.status,
        created_at: normalized.createdAt,
      });
      return normalized;
    },
    insertGovernanceEvent(governanceEvent) {
      const normalized = normalizeGovernanceEventInput(governanceEvent);
      assertValidEntity('governanceEvent', normalized);
      insertGovernanceEventStatement.run({
        id: normalized.id,
        session_id: normalized.sessionId,
        event_type: normalized.eventType,
        payload: stringifyJson(normalized.payload, 'governanceEvent.payload'),
        resolved_at: normalized.resolvedAt,
        resolution: normalized.resolution,
        created_at: normalized.createdAt,
      });
      return normalized;
    },
    insertSkillRun(skillRun) {
      const normalized = normalizeSkillRunInput(skillRun);
      assertValidEntity('skillRun', normalized);
      insertSkillRunStatement.run({
        id: normalized.id,
        skill_id: normalized.skillId,
        skill_version: normalized.skillVersion,
        session_id: normalized.sessionId,
        task_description: normalized.taskDescription,
        outcome: normalized.outcome,
        failure_reason: normalized.failureReason,
        tokens_used: normalized.tokensUsed,
        duration_ms: normalized.durationMs,
        user_feedback: normalized.userFeedback,
        created_at: normalized.createdAt,
      });
      return normalized;
    },
    listRecentObservations(options = {}) {
      const limit = normalizeLimit(options.limit, 10);
      return listRecentObservationsStatement.all(limit).map(mapObservationRow);
    },
    listObservationsBySession(sessionId, options = {}) {
      const limit = normalizeLimit(options.limit, 20);
      return listObservationsBySessionStatement.all(sessionId, limit).map(mapObservationRow);
    },
    listObservationsByAttempt(attemptId, options = {}) {
      const limit = normalizeLimit(options.limit, 20);
      return listObservationsByAttemptStatement.all(attemptId, limit).map(mapObservationRow);
    },
    listRecentMemoryNotes(options = {}) {
      const limit = normalizeLimit(options.limit, 10);
      return listRecentMemoryNotesStatement.all(limit).map(mapMemoryNoteRow);
    },
    listMemoryNotesByAttempt(attemptId, options = {}) {
      const limit = normalizeLimit(options.limit, 20);
      return listMemoryNotesByAttemptStatement.all(attemptId, limit).map(mapMemoryNoteRow);
    },
    getObservationById(id) {
      const row = getObservationByIdStatement.get(id);
      return row ? mapObservationRow(row) : null;
    },
    getObservationByContentHash(contentHash) {
      const row = getObservationByContentHashStatement.get(contentHash);
      return row ? mapObservationRow(row) : null;
    },
    getMemoryNoteById(id) {
      const row = getMemoryNoteByIdStatement.get(id);
      return row ? mapMemoryNoteRow(row) : null;
    },
    insertObservation(observation) {
      const normalized = normalizeObservationInput(observation);
      assertValidEntity('observation', normalized);
      insertObservationStatement.run({
        id: normalized.id,
        session_id: normalized.sessionId,
        attempt_id: normalized.attemptId,
        source_event: normalized.sourceEvent,
        title: normalized.title,
        summary: normalized.summary,
        content_hash: normalized.contentHash,
        anchor_ref: normalized.anchorRef,
        tags: stringifyJson(normalized.tags, 'observation.tags'),
        metadata: stringifyJson(normalized.metadata, 'observation.metadata'),
        created_at: normalized.createdAt,
        last_accessed_at: normalized.lastAccessedAt,
      });
      const row = getObservationByIdStatement.get(normalized.id);
      return row ? mapObservationRow(row) : null;
    },
    insertMemoryNote(note) {
      const normalized = normalizeMemoryNoteInput(note);
      assertValidEntity('memoryNote', normalized);
      insertMemoryNoteStatement.run({
        id: normalized.id,
        session_id: normalized.sessionId,
        attempt_id: normalized.attemptId,
        category: normalized.category,
        content: normalized.content,
        summary: normalized.summary,
        tags: stringifyJson(normalized.tags, 'memoryNote.tags'),
        keywords: stringifyJson(normalized.keywords, 'memoryNote.keywords'),
        links: stringifyJson(normalized.links, 'memoryNote.links'),
        retrieval_metadata: stringifyJson(normalized.retrievalMetadata, 'memoryNote.retrievalMetadata'),
        evolution_history: stringifyJson(normalized.evolutionHistory, 'memoryNote.evolutionHistory'),
        created_at: normalized.createdAt,
        accessed_at: normalized.accessedAt,
      });
      return normalized;
    },
    listMemoryLinksByNote(noteId) {
      return listMemoryLinksByNoteStatement.all(noteId, noteId).map(mapMemoryLinkRow);
    },
    listMemoryTimeline(options = {}) {
      const limit = normalizeLimit(options.limit, 20);
      const observations = options.attemptId
        ? listObservationsByAttemptStatement.all(options.attemptId, limit).map(mapObservationRow)
        : options.sessionId
          ? listObservationsBySessionStatement.all(options.sessionId, limit).map(mapObservationRow)
          : listRecentObservationsStatement.all(limit).map(mapObservationRow);
      const notes = options.attemptId
        ? listMemoryNotesByAttemptStatement.all(options.attemptId, limit).map(mapMemoryNoteRow)
        : options.sessionId
          ? listMemoryNotesBySessionStatement.all(options.sessionId).map(mapMemoryNoteRow).slice(0, limit)
          : listRecentMemoryNotesStatement.all(limit).map(mapMemoryNoteRow);

      return [...notes.map(note => ({
        kind: 'note',
        id: note.id,
        title: note.category,
        summary: note.summary,
        content: note.content,
        tags: note.tags,
        keywords: note.keywords,
        anchorRef: Array.isArray(note.links) && note.links.length > 0 ? note.links[0] : null,
        sessionId: note.sessionId,
        attemptId: note.attemptId,
        createdAt: note.createdAt,
      })), ...observations.map(observation => ({
        kind: 'observation',
        id: observation.id,
        title: observation.title,
        summary: observation.summary,
        tags: observation.tags,
        anchorRef: observation.anchorRef,
        sessionId: observation.sessionId,
        attemptId: observation.attemptId,
        createdAt: observation.createdAt,
      }))]
        .sort((left, right) => String(right.createdAt || '').localeCompare(String(left.createdAt || '')))
        .slice(0, limit);
    },
    insertMemoryLink(link) {
      const normalized = normalizeMemoryLinkInput(link);
      assertValidEntity('memoryLink', normalized);
      insertMemoryLinkStatement.run({
        id: normalized.id,
        from_note_id: normalized.fromNoteId,
        to_note_id: normalized.toNoteId,
        link_type: normalized.linkType,
        weight: normalized.weight,
        metadata: stringifyJson(normalized.metadata, 'memoryLink.metadata'),
        created_at: normalized.createdAt,
      });
      return normalized;
    },
    insertQualityRun(qualityRun) {
      const normalized = normalizeQualityRunInput(qualityRun);
      assertValidEntity('qualityRun', normalized);
      insertQualityRunStatement.run({
        id: normalized.id,
        session_id: normalized.sessionId,
        attempt_id: normalized.attemptId,
        iteration: normalized.iteration,
        score: normalized.score,
        band: normalized.band,
        threshold: normalized.threshold,
        passed: normalized.passed ? 1 : 0,
        termination_reason: normalized.terminationReason,
        evidence: stringifyJson(normalized.evidence, 'qualityRun.evidence'),
        findings: stringifyJson(normalized.findings, 'qualityRun.findings'),
        created_at: normalized.createdAt,
      });
      return normalized;
    },
    listAttemptsBySession(sessionId) {
      return listAttemptsBySessionStatement.all(sessionId).map(mapAttemptRow);
    },
    upsertAttempt(attempt) {
      const normalized = normalizeAttemptInput(attempt);
      assertValidEntity('attempt', normalized);
      upsertAttemptStatement.run({
        id: normalized.id,
        session_id: normalized.sessionId,
        parent_attempt_id: normalized.parentAttemptId,
        branch_name: normalized.branchName,
        worktree_path: normalized.worktreePath,
        status: normalized.status,
        metadata: stringifyJson(normalized.metadata, 'attempt.metadata'),
        created_at: normalized.createdAt,
        updated_at: normalized.updatedAt,
      });
      const row = getAttemptByIdStatement.get(normalized.id);
      return row ? mapAttemptRow(row) : null;
    },
    upsertPendingMessage(message) {
      const normalized = normalizePendingMessageInput(message);
      assertValidEntity('pendingMessage', normalized);
      upsertPendingMessageStatement.run({
        id: normalized.id,
        session_id: normalized.sessionId,
        attempt_id: normalized.attemptId,
        source_event: normalized.sourceEvent,
        payload: stringifyJson(normalized.payload, 'pendingMessage.payload'),
        content_hash: normalized.contentHash,
        status: normalized.status,
        error: normalized.error,
        claimed_at: normalized.claimedAt,
        processed_at: normalized.processedAt,
        created_at: normalized.createdAt,
      });
      const row = getPendingMessageByIdStatement.get(normalized.id);
      return row ? mapPendingMessageRow(row) : null;
    },
    getPendingMessageById(id) {
      const row = getPendingMessageByIdStatement.get(id);
      return row ? mapPendingMessageRow(row) : null;
    },
    getPendingMessageByContentHash(contentHash) {
      const row = getPendingMessageByContentHashStatement.get(contentHash);
      return row ? mapPendingMessageRow(row) : null;
    },
    resetStalePendingMessages(options = {}) {
      const staleAfterMs = Number.isFinite(Number(options.staleAfterMs))
        ? Number(options.staleAfterMs)
        : 5 * 60 * 1000;
      const referenceTime = new Date(options.now || Date.now()).getTime();
      if (!Number.isFinite(referenceTime)) {
        return 0;
      }

      const staleBefore = new Date(referenceTime - staleAfterMs).toISOString();
      const result = resetStalePendingMessagesStatement.run({
        stale_before: staleBefore,
        session_id: options.sessionId ?? null,
        attempt_id: options.attemptId ?? null,
      });
      return Number(result.changes || 0);
    },
    claimPendingMessage(id, options = {}) {
      const claimedAt = options.claimedAt || new Date().toISOString();
      const staleAfterMs = Number.isFinite(Number(options.staleAfterMs))
        ? Number(options.staleAfterMs)
        : 60 * 1000;
      const claimTransaction = db.transaction((messageId, transactionOptions) => {
        const existing = getPendingMessageByIdStatement.get(messageId);
        if (!existing) {
          return null;
        }

        const mapped = mapPendingMessageRow(existing);
        if (mapped.status === 'processed') {
          return null;
        }

        if (mapped.status === 'processing') {
          const claimedTime = mapped.claimedAt ? new Date(mapped.claimedAt).getTime() : NaN;
          const nextClaimTime = new Date(transactionOptions.claimedAt).getTime();
          // Mirror claude-mem's self-healing queue pattern: stale processing
          // claims are treated as recoverable and can be reclaimed inline.
          const isStale = Number.isFinite(claimedTime)
            && Number.isFinite(nextClaimTime)
            && (nextClaimTime - claimedTime) > transactionOptions.staleAfterMs;

          if (!isStale) {
            return null;
          }
        }

        claimPendingMessageStatement.run({
          id: messageId,
          claimed_at: transactionOptions.claimedAt,
        });
        const claimedRow = getPendingMessageByIdStatement.get(messageId);
        return claimedRow ? mapPendingMessageRow(claimedRow) : null;
      });

      return claimTransaction(id, {
        claimedAt,
        staleAfterMs,
      });
    },
    confirmPendingMessageProcessed(id, options = {}) {
      return this.updatePendingMessageStatus(id, {
        status: 'processed',
        error: null,
        claimedAt: options.claimedAt ?? null,
        processedAt: options.processedAt || new Date().toISOString(),
      });
    },
    markPendingMessageFailed(id, options = {}) {
      return this.updatePendingMessageStatus(id, {
        status: 'failed',
        error: options.error ?? 'processing failed',
        claimedAt: options.claimedAt ?? null,
        processedAt: options.processedAt || new Date().toISOString(),
      });
    },
    updatePendingMessageStatus(id, update) {
      const nextState = {
        id,
        status: update.status,
        error: update.error ?? null,
        claimed_at: update.claimedAt ?? null,
        processed_at: update.processedAt ?? null,
      };
      updatePendingMessageStatusStatement.run(nextState);
      const row = getPendingMessageByIdStatement.get(id);
      return row ? mapPendingMessageRow(row) : null;
    },
    listRecentSessions,
    upsertInstallState(installState) {
      const normalized = normalizeInstallStateInput(installState);
      assertValidEntity('installState', normalized);
      upsertInstallStateStatement.run({
        target_id: normalized.targetId,
        target_root: normalized.targetRoot,
        profile: normalized.profile,
        modules: stringifyJson(normalized.modules, 'installState.modules'),
        operations: stringifyJson(normalized.operations, 'installState.operations'),
        installed_at: normalized.installedAt,
        source_version: normalized.sourceVersion,
      });
      return normalized;
    },
    upsertSession(session) {
      const normalized = normalizeSessionInput(session);
      assertValidEntity('session', normalized);
      upsertSessionStatement.run({
        id: normalized.id,
        adapter_id: normalized.adapterId,
        harness: normalized.harness,
        state: normalized.state,
        repo_root: normalized.repoRoot,
        started_at: normalized.startedAt,
        ended_at: normalized.endedAt,
        snapshot: stringifyJson(normalized.snapshot, 'session.snapshot'),
      });
      return getSessionById(normalized.id);
    },
    upsertSkillVersion(skillVersion) {
      const normalized = normalizeSkillVersionInput(skillVersion);
      assertValidEntity('skillVersion', normalized);
      upsertSkillVersionStatement.run({
        skill_id: normalized.skillId,
        version: normalized.version,
        content_hash: normalized.contentHash,
        amendment_reason: normalized.amendmentReason,
        promoted_at: normalized.promotedAt,
        rolled_back_at: normalized.rolledBackAt,
      });
      const row = getSkillVersionStatement.get(normalized.skillId, normalized.version);
      return row ? mapSkillVersionRow(row) : null;
    },

    // --- FTS5 Search Methods ---

    searchObservationsFTS(query, options = {}) {
      const limit = normalizeLimit(options.limit, 20);
      const safeQuery = String(query || '').replace(/[^\w\s]/g, ' ').trim();
      if (!safeQuery) {
        return [];
      }
      // Try FTS5 first, fall back to LIKE
      if (searchObservationsFTSStatement) {
        try {
          return searchObservationsFTSStatement.all(safeQuery, limit).map(mapObservationRow);
        } catch (_error) {
          // FTS5 query syntax error — fall through to LIKE
        }
      }
      const likePattern = `%${safeQuery}%`;
      return searchObservationsLikeStatement.all(likePattern, likePattern, limit).map(mapObservationRow);
    },

    searchMemoryNotesFTS(query, options = {}) {
      const limit = normalizeLimit(options.limit, 20);
      const safeQuery = String(query || '').replace(/[^\w\s]/g, ' ').trim();
      if (!safeQuery) {
        return [];
      }
      // Try FTS5 first, fall back to LIKE
      if (searchMemoryNotesFTSStatement) {
        try {
          return searchMemoryNotesFTSStatement.all(safeQuery, limit).map(mapMemoryNoteRow);
        } catch (_error) {
          // FTS5 query syntax error — fall through to LIKE
        }
      }
      const likePattern = `%${safeQuery}%`;
      return searchMemoryNotesLikeStatement.all(likePattern, likePattern, likePattern, limit).map(mapMemoryNoteRow);
    },

    // --- Embedding Storage Methods ---

    upsertEmbedding(embedding) {
      const normalized = {
        id: embedding.id,
        sourceTable: embedding.sourceTable,
        sourceId: embedding.sourceId,
        model: embedding.model || 'simple-hash',
        dimensions: embedding.dimensions || 384,
        vector: Array.isArray(embedding.vector) ? embedding.vector : [],
        createdAt: embedding.createdAt || new Date().toISOString(),
      };
      upsertEmbeddingStatement.run({
        id: normalized.id,
        source_table: normalized.sourceTable,
        source_id: normalized.sourceId,
        model: normalized.model,
        dimensions: normalized.dimensions,
        vector: JSON.stringify(normalized.vector),
        created_at: normalized.createdAt,
      });
      return normalized;
    },

    getEmbedding(sourceTable, sourceId) {
      const row = getEmbeddingStatement.get(sourceTable, sourceId);
      if (!row) {
        return null;
      }
      return {
        id: row.id,
        sourceTable: row.source_table,
        sourceId: row.source_id,
        model: row.model,
        dimensions: row.dimensions,
        vector: parseJsonColumn(row.vector, []),
        createdAt: row.created_at,
      };
    },

    findSimilarByVector(queryVector, sourceTable, options = {}) {
      const limit = normalizeLimit(options.limit, 10);
      const minSimilarity = Number.isFinite(Number(options.minSimilarity))
        ? Number(options.minSimilarity)
        : 0.1;
      const rows = listEmbeddingsByTableStatement.all(sourceTable, 500);
      const scored = rows
        .map(row => {
          const vector = parseJsonColumn(row.vector, []);
          const similarity = cosineSimilarity(queryVector, vector);
          return {
            sourceId: row.source_id,
            similarity,
            model: row.model,
          };
        })
        .filter(entry => entry.similarity >= minSimilarity)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
      return scored;
    },

    computeAndStoreEmbedding(sourceTable, sourceId, text, options = {}) {
      const vector = simpleEmbed(text, options.dimensions || 384);
      const embeddingId = `emb_${sourceTable}_${sourceId}`;
      return this.upsertEmbedding({
        id: embeddingId,
        sourceTable,
        sourceId,
        model: 'simple-hash',
        dimensions: vector.length,
        vector,
        createdAt: new Date().toISOString(),
      });
    },
  };
}

module.exports = {
  ACTIVE_SESSION_STATES,
  FAILURE_OUTCOMES,
  SUCCESS_OUTCOMES,
  createQueryApi,
};
