'use strict';

const INITIAL_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  adapter_id TEXT NOT NULL,
  harness TEXT NOT NULL,
  state TEXT NOT NULL,
  repo_root TEXT,
  started_at TEXT,
  ended_at TEXT,
  snapshot TEXT NOT NULL CHECK (json_valid(snapshot))
);

CREATE INDEX IF NOT EXISTS idx_sessions_state_started_at
  ON sessions (state, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at
  ON sessions (started_at DESC);

CREATE TABLE IF NOT EXISTS skill_runs (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  skill_version TEXT NOT NULL,
  session_id TEXT NOT NULL,
  task_description TEXT NOT NULL,
  outcome TEXT NOT NULL,
  failure_reason TEXT,
  tokens_used INTEGER,
  duration_ms INTEGER,
  user_feedback TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skill_runs_session_id_created_at
  ON skill_runs (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_runs_created_at
  ON skill_runs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_skill_runs_outcome_created_at
  ON skill_runs (outcome, created_at DESC);

CREATE TABLE IF NOT EXISTS skill_versions (
  skill_id TEXT NOT NULL,
  version TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  amendment_reason TEXT,
  promoted_at TEXT,
  rolled_back_at TEXT,
  PRIMARY KEY (skill_id, version)
);

CREATE INDEX IF NOT EXISTS idx_skill_versions_promoted_at
  ON skill_versions (promoted_at DESC);

CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  alternatives TEXT NOT NULL CHECK (json_valid(alternatives)),
  supersedes TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE,
  FOREIGN KEY (supersedes) REFERENCES decisions (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_decisions_session_id_created_at
  ON decisions (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_status_created_at
  ON decisions (status, created_at DESC);

CREATE TABLE IF NOT EXISTS install_state (
  target_id TEXT NOT NULL,
  target_root TEXT NOT NULL,
  profile TEXT,
  modules TEXT NOT NULL CHECK (json_valid(modules)),
  operations TEXT NOT NULL CHECK (json_valid(operations)),
  installed_at TEXT NOT NULL,
  source_version TEXT,
  PRIMARY KEY (target_id, target_root)
);

CREATE INDEX IF NOT EXISTS idx_install_state_installed_at
  ON install_state (installed_at DESC);

CREATE TABLE IF NOT EXISTS governance_events (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  resolved_at TEXT,
  resolution TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_governance_events_resolved_at_created_at
  ON governance_events (resolved_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_governance_events_session_id_created_at
  ON governance_events (session_id, created_at DESC);
`;

const ATTEMPT_MEMORY_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  parent_attempt_id TEXT,
  branch_name TEXT NOT NULL,
  worktree_path TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata TEXT NOT NULL CHECK (json_valid(metadata)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE,
  FOREIGN KEY (parent_attempt_id) REFERENCES attempts (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_attempts_session_id_created_at
  ON attempts (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_status_updated_at
  ON attempts (status, updated_at DESC);

CREATE TABLE IF NOT EXISTS pending_messages (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  attempt_id TEXT,
  source_event TEXT NOT NULL,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  content_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  claimed_at TEXT,
  processed_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE SET NULL,
  FOREIGN KEY (attempt_id) REFERENCES attempts (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pending_messages_status_created_at
  ON pending_messages (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pending_messages_attempt_id_created_at
  ON pending_messages (attempt_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_messages_content_hash
  ON pending_messages (content_hash);

CREATE TABLE IF NOT EXISTS observations (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  attempt_id TEXT,
  source_event TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  anchor_ref TEXT,
  tags TEXT NOT NULL CHECK (json_valid(tags)),
  metadata TEXT NOT NULL CHECK (json_valid(metadata)),
  created_at TEXT NOT NULL,
  last_accessed_at TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE SET NULL,
  FOREIGN KEY (attempt_id) REFERENCES attempts (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_observations_session_id_created_at
  ON observations (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_observations_attempt_id_created_at
  ON observations (attempt_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_observations_content_hash
  ON observations (content_hash);
`;

const MIGRATIONS = [
  {
    version: 1,
    name: '001_initial_state_store',
    sql: INITIAL_SCHEMA_SQL,
  },
  {
    version: 2,
    name: '002_attempt_memory_control_plane',
    sql: ATTEMPT_MEMORY_SCHEMA_SQL,
  },
  {
    version: 3,
    name: '003_memory_notes_quality_runs',
    sql: `
CREATE TABLE IF NOT EXISTS memory_notes (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  attempt_id TEXT,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT NOT NULL CHECK (json_valid(tags)),
  keywords TEXT NOT NULL CHECK (json_valid(keywords)),
  links TEXT NOT NULL CHECK (json_valid(links)),
  retrieval_metadata TEXT NOT NULL CHECK (json_valid(retrieval_metadata)),
  evolution_history TEXT NOT NULL CHECK (json_valid(evolution_history)),
  created_at TEXT NOT NULL,
  accessed_at TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE SET NULL,
  FOREIGN KEY (attempt_id) REFERENCES attempts (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_memory_notes_session_id_created_at
  ON memory_notes (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_notes_attempt_id_created_at
  ON memory_notes (attempt_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_notes_category_accessed_at
  ON memory_notes (category, accessed_at DESC);

CREATE TABLE IF NOT EXISTS memory_links (
  id TEXT PRIMARY KEY,
  from_note_id TEXT NOT NULL,
  to_note_id TEXT NOT NULL,
  link_type TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 1,
  metadata TEXT NOT NULL CHECK (json_valid(metadata)),
  created_at TEXT NOT NULL,
  FOREIGN KEY (from_note_id) REFERENCES memory_notes (id) ON DELETE CASCADE,
  FOREIGN KEY (to_note_id) REFERENCES memory_notes (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_memory_links_from_note
  ON memory_links (from_note_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_links_to_note
  ON memory_links (to_note_id, created_at DESC);

CREATE TABLE IF NOT EXISTS quality_runs (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  attempt_id TEXT,
  iteration INTEGER NOT NULL,
  score INTEGER NOT NULL,
  band TEXT NOT NULL,
  threshold INTEGER NOT NULL,
  passed INTEGER NOT NULL CHECK (passed IN (0, 1)),
  termination_reason TEXT NOT NULL,
  evidence TEXT NOT NULL CHECK (json_valid(evidence)),
  findings TEXT NOT NULL CHECK (json_valid(findings)),
  created_at TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE SET NULL,
  FOREIGN KEY (attempt_id) REFERENCES attempts (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_quality_runs_session_id_iteration
  ON quality_runs (session_id, iteration DESC);
CREATE INDEX IF NOT EXISTS idx_quality_runs_attempt_id_iteration
  ON quality_runs (attempt_id, iteration DESC);
`
  },
  {
    version: 4,
    name: '004_fts5_vector_search',
    sql: `
-- Embedding storage table for vector similarity search.
-- Vectors are stored as JSON arrays since sql.js does not support native vector extensions.
-- The embeddings module (scripts/utils/embeddings.js) computes vectors in JS and
-- cosineSimilarity is computed in JS after fetching candidate rows.
CREATE TABLE IF NOT EXISTS embeddings (
  id TEXT PRIMARY KEY,
  source_table TEXT NOT NULL,
  source_id TEXT NOT NULL,
  model TEXT NOT NULL,
  dimensions INTEGER NOT NULL,
  vector TEXT NOT NULL CHECK (json_valid(vector)),
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_embeddings_source
  ON embeddings (source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_model
  ON embeddings (model);
`,
    // FTS5 setup is attempted separately after the core migration.
    // If the SQLite build includes FTS5 it will be enabled; otherwise
    // the system falls back to LIKE-based search + vector similarity.
    fts5Sql: `
CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
  title,
  summary,
  content=observations,
  content_rowid=rowid,
  tokenize='porter unicode61'
);

INSERT OR IGNORE INTO observations_fts(rowid, title, summary)
  SELECT rowid, title, summary FROM observations;

CREATE TRIGGER IF NOT EXISTS observations_fts_insert AFTER INSERT ON observations BEGIN
  INSERT INTO observations_fts(rowid, title, summary) VALUES (new.rowid, new.title, new.summary);
END;

CREATE TRIGGER IF NOT EXISTS observations_fts_delete BEFORE DELETE ON observations BEGIN
  INSERT INTO observations_fts(observations_fts, rowid, title, summary) VALUES ('delete', old.rowid, old.title, old.summary);
END;

CREATE TRIGGER IF NOT EXISTS observations_fts_update AFTER UPDATE ON observations BEGIN
  INSERT INTO observations_fts(observations_fts, rowid, title, summary) VALUES ('delete', old.rowid, old.title, old.summary);
  INSERT INTO observations_fts(rowid, title, summary) VALUES (new.rowid, new.title, new.summary);
END;

CREATE VIRTUAL TABLE IF NOT EXISTS memory_notes_fts USING fts5(
  category,
  content,
  summary,
  content=memory_notes,
  content_rowid=rowid,
  tokenize='porter unicode61'
);

INSERT OR IGNORE INTO memory_notes_fts(rowid, category, content, summary)
  SELECT rowid, category, content, COALESCE(summary, '') FROM memory_notes;

CREATE TRIGGER IF NOT EXISTS memory_notes_fts_insert AFTER INSERT ON memory_notes BEGIN
  INSERT INTO memory_notes_fts(rowid, category, content, summary) VALUES (new.rowid, new.category, new.content, COALESCE(new.summary, ''));
END;

CREATE TRIGGER IF NOT EXISTS memory_notes_fts_delete BEFORE DELETE ON memory_notes BEGIN
  INSERT INTO memory_notes_fts(memory_notes_fts, rowid, category, content, summary) VALUES ('delete', old.rowid, old.category, old.content, COALESCE(old.summary, ''));
END;

CREATE TRIGGER IF NOT EXISTS memory_notes_fts_update AFTER UPDATE ON memory_notes BEGIN
  INSERT INTO memory_notes_fts(memory_notes_fts, rowid, category, content, summary) VALUES ('delete', old.rowid, old.category, old.content, COALESCE(old.summary, ''));
  INSERT INTO memory_notes_fts(rowid, category, content, summary) VALUES (new.rowid, new.category, new.content, COALESCE(new.summary, ''));
END;
`
  }
];

function ensureMigrationTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
}

function getAppliedMigrations(db) {
  ensureMigrationTable(db);
  return db
    .prepare(`
      SELECT version, name, applied_at
      FROM schema_migrations
      ORDER BY version ASC
    `)
    .all()
    .map(row => ({
      version: row.version,
      name: row.name,
      appliedAt: row.applied_at,
    }));
}

function applyMigrations(db) {
  ensureMigrationTable(db);

  const appliedVersions = new Set(
    db.prepare('SELECT version FROM schema_migrations').all().map(row => row.version)
  );
  const insertMigration = db.prepare(`
    INSERT INTO schema_migrations (version, name, applied_at)
    VALUES (@version, @name, @applied_at)
  `);

  let fts5Available = false;

  const applyPending = db.transaction(() => {
    for (const migration of MIGRATIONS) {
      if (appliedVersions.has(migration.version)) {
        continue;
      }

      db.exec(migration.sql);
      insertMigration.run({
        version: migration.version,
        name: migration.name,
        applied_at: new Date().toISOString(),
      });
    }
  });

  applyPending();

  // Apply FTS5 extensions outside the transaction — FTS5 may not be compiled
  // into the sql.js WASM build so we attempt it best-effort.
  for (const migration of MIGRATIONS) {
    if (migration.fts5Sql) {
      try {
        db.exec(migration.fts5Sql);
        fts5Available = true;
      } catch (_fts5Error) {
        // FTS5 module not available in this SQLite build — graceful fallback.
        // The search layer uses LIKE-based queries + vector similarity instead.
        fts5Available = false;
      }
    }
  }

  return { migrations: getAppliedMigrations(db), fts5Available };
}

module.exports = {
  MIGRATIONS,
  applyMigrations,
  getAppliedMigrations,
};
