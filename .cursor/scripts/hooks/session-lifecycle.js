#!/usr/bin/env node
'use strict';

const { createStateStore } = require('../lib/state-store');
const { appendGovernanceEvent } = require('../lib/governance-log');
const {
  createStableId,
  ensureControlPlaneDirs,
  getPlatformName,
  hashValue,
  loadControlPlane,
} = require('../lib/fulcrum-control');
const { sanitizeForMemory } = require('../utils/privacy-gate');
const { compressObservation } = require('./compress-observation');
const { rebuildViews } = require('../memory/rebuild-views');

const MAX_STDIN = 1024 * 1024;

function parseRawInput(rawInput) {
  try {
    return JSON.parse(rawInput || '{}');
  } catch {
    return {};
  }
}

function resolveEventName(input, explicitEventName) {
  return explicitEventName
    || input.hook_event_name
    || input.event
    || process.argv[2]
    || process.env.ECC_LIFECYCLE_EVENT
    || 'post_tool_use';
}

function resolveSessionContext(input) {
  return {
    sessionId: input.session_id || input.sessionId || process.env.CLAUDE_SESSION_ID || null,
    attemptId: input.attempt_id || input.attemptId || process.env.ECC_ATTEMPT_ID || null,
    transcriptPath: input.transcript_path || input.transcriptPath || null,
  };
}

function extractPayload(input, eventName) {
  if (eventName === 'user_prompt_submit') {
    return input.prompt || input.user_prompt || input.message || input.text || '';
  }

  if (eventName === 'post_tool_use') {
    return {
      toolName: input.tool_name || input.toolName || null,
      toolInput: input.tool_input || input.toolInput || null,
      toolResponse: input.tool_response || input.toolResponse || '',
    };
  }

  if (eventName === 'summary_checkpoint') {
    return input.summary || input.checkpoint || input.message || '';
  }

  if (eventName === 'session_end') {
    return {
      transcriptPath: input.transcript_path || null,
      summary: input.summary || 'Session ended',
    };
  }

  return input;
}

function estimateTokenUsage(content) {
  return Math.ceil(String(content || '').length / 4);
}

function createObservationRecord(eventName, sessionContext, sanitizedPayload, sourcePayload) {
  const timestamp = new Date().toISOString();
  const serialized = typeof sanitizedPayload === 'string'
    ? sanitizedPayload
    : JSON.stringify(sanitizedPayload, null, 2);
  const contentHash = hashValue(`${eventName}:${sessionContext.sessionId || ''}:${serialized}`);

  return {
    id: createStableId('obs', `${contentHash}:${timestamp}`),
    sessionId: sessionContext.sessionId,
    attemptId: sessionContext.attemptId,
    sourceEvent: eventName,
    title: `${eventName.replace(/_/g, ' ')} ${String(sessionContext.sessionId || '').slice(-8)}`.trim(),
    summary: compressObservation(serialized),
    contentHash,
    anchorRef: sessionContext.transcriptPath || sourcePayload?.transcriptPath || null,
    tags: [eventName, getPlatformName()],
    metadata: {
      tokenEstimate: estimateTokenUsage(serialized),
      rawType: typeof sourcePayload,
    },
    createdAt: timestamp,
    lastAccessedAt: timestamp,
  };
}

function buildPendingMessageRecord(eventName, sessionContext, sanitized, sourcePayload) {
  const serializedPayload = typeof sourcePayload === 'string' ? sourcePayload : JSON.stringify(sourcePayload);
  const messageHash = hashValue(`${eventName}:${sessionContext.sessionId || ''}:${serializedPayload}`);
  return {
    id: createStableId('msg', `${messageHash}:${eventName}`),
    sessionId: sessionContext.sessionId,
    attemptId: sessionContext.attemptId,
    sourceEvent: eventName,
    payload: sanitized.content,
    contentHash: messageHash,
    status: 'pending',
    error: null,
    claimedAt: null,
    processedAt: null,
    createdAt: new Date().toISOString(),
  };
}

function createMemoryNoteRecord(eventName, sessionContext, sanitizedPayload, observation) {
  const timestamp = new Date().toISOString();
  const keywords = [...new Set(String(sanitizedPayload || '')
    .split(/\s+/)
    .map(value => value.trim().toLowerCase())
    .filter(value => value && value.length >= 3)
    .slice(0, 12))];

  return {
    id: createStableId('note', `${observation.contentHash}:${eventName}`),
    sessionId: sessionContext.sessionId,
    attemptId: sessionContext.attemptId,
    category: eventName === 'summary_checkpoint' ? 'checkpoint' : 'observation',
    content: String(sanitizedPayload || ''),
    summary: observation.summary,
    tags: [...new Set([eventName, getPlatformName(), observation.title ? 'titled' : null].filter(Boolean))],
    keywords,
    links: observation.anchorRef ? [observation.anchorRef] : [],
    retrievalMetadata: {
      sourceEvent: eventName,
      contentHash: observation.contentHash,
      tokenEstimate: estimateTokenUsage(sanitizedPayload),
    },
    evolutionHistory: [
      {
        action: 'created',
        timestamp,
        sourceEvent: eventName,
      },
    ],
    createdAt: timestamp,
    accessedAt: timestamp,
  };
}

function buildCandidateMemoryLinks(options = {}) {
  const note = options.note || {};
  const recentNotes = Array.isArray(options.recentNotes) ? options.recentNotes : [];
  const maxLinks = Number.isFinite(Number(options.maxLinks)) ? Number(options.maxLinks) : 3;
  const currentKeywords = new Set(Array.isArray(note.keywords) ? note.keywords : []);
  const currentTags = new Set(Array.isArray(note.tags) ? note.tags : []);

  return recentNotes
    .filter(candidate => candidate && candidate.id && candidate.id !== note.id)
    .map(candidate => {
      const candidateKeywords = new Set(Array.isArray(candidate.keywords) ? candidate.keywords : []);
      const candidateTags = new Set(Array.isArray(candidate.tags) ? candidate.tags : []);
      const keywordOverlap = [...currentKeywords].filter(value => candidateKeywords.has(value));
      const tagOverlap = [...currentTags].filter(value => candidateTags.has(value));
      const sameSessionBoost = note.sessionId && candidate.sessionId && note.sessionId === candidate.sessionId ? 0.1 : 0;
      const weight = Math.min(
        0.95,
        Number((((keywordOverlap.length * 0.25) + (tagOverlap.length * 0.2) + sameSessionBoost)).toFixed(2))
      );

      return {
        candidate,
        keywordOverlap,
        tagOverlap,
        weight,
      };
    })
    .filter(entry => entry.weight >= 0.45)
    .sort((left, right) => right.weight - left.weight)
    .slice(0, maxLinks)
    .map(entry => ({
      id: createStableId('link', `${note.id}:${entry.candidate.id}:related_to`),
      fromNoteId: note.id,
      toNoteId: entry.candidate.id,
      linkType: 'related_to',
      weight: entry.weight,
      metadata: {
        keywordOverlap: entry.keywordOverlap,
        tagOverlap: entry.tagOverlap,
      },
      createdAt: new Date().toISOString(),
    }));
}

async function persistLifecycleEvent(rawInput, explicitEventName) {
  const input = parseRawInput(rawInput);
  const eventName = resolveEventName(input, explicitEventName);
  const sessionContext = resolveSessionContext(input);
  const sourcePayload = extractPayload(input, eventName);
  const sanitized = sanitizeForMemory(sourcePayload);
  const controlPlane = loadControlPlane();

  ensureControlPlaneDirs();

  const store = await createStateStore({
    homeDir: process.env.HOME,
  });

  try {
    if (sessionContext.sessionId) {
      store.upsertSession({
        id: sessionContext.sessionId,
        adapterId: getPlatformName(),
        harness: getPlatformName(),
        state: eventName === 'session_end' ? 'completed' : 'active',
        repoRoot: process.cwd(),
        startedAt: input.started_at || input.startedAt || new Date().toISOString(),
        endedAt: eventName === 'session_end' ? new Date().toISOString() : null,
        snapshot: {
          schemaVersion: 'ecc.session.v2',
          lastEvent: eventName,
          workers: [],
          eventInputKeys: Object.keys(input),
        },
      });
    }

    if (sessionContext.sessionId && sessionContext.attemptId) {
      store.upsertAttempt({
        id: sessionContext.attemptId,
        sessionId: sessionContext.sessionId,
        parentAttemptId: input.parent_attempt_id || null,
        branchName: input.branch_name || `attempt/${String(sessionContext.attemptId).slice(-8)}`,
        worktreePath: input.worktree_path || process.cwd(),
        status: input.attempt_status || (eventName === 'session_end' ? 'completed' : 'running'),
        metadata: {
          platform: getPlatformName(),
          sourceEvent: eventName,
        },
        createdAt: input.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    if (!sanitized.skipStorage) {
      const pendingMessage = buildPendingMessageRecord(eventName, sessionContext, sanitized, sourcePayload);
      store.upsertPendingMessage(pendingMessage);
      // Adapt claude-mem's claim-confirm flow to the local synchronous hook path:
      // persist first, claim explicitly, only mark processed after storage succeeds.
      const claimedMessage = store.claimPendingMessage(pendingMessage.id, {
        claimedAt: new Date().toISOString(),
        staleAfterMs: 60 * 1000,
      });

      if (claimedMessage) {
        try {
          const observation = createObservationRecord(eventName, sessionContext, sanitized.content, sourcePayload);
          const existing = store.getObservationByContentHash(observation.contentHash);
          if (!existing) {
            store.insertObservation(observation);

            // Compute and store embedding for vector search
            try {
              const observationText = `${observation.title} ${observation.summary}`;
              store.computeAndStoreEmbedding('observations', observation.id, observationText);
            } catch (_embError) {
              // Embedding computation is best-effort; never block the write path
            }

            const memoryNote = createMemoryNoteRecord(eventName, sessionContext, sanitized.content, observation);
            store.insertMemoryNote(memoryNote);

            // Compute and store embedding for vector search
            try {
              const noteText = `${memoryNote.category} ${memoryNote.content} ${memoryNote.summary || ''}`;
              store.computeAndStoreEmbedding('memory_notes', memoryNote.id, noteText);
            } catch (_embError) {
              // Embedding computation is best-effort; never block the write path
            }

            const candidateLinks = buildCandidateMemoryLinks({
              note: memoryNote,
              recentNotes: store
                .listRecentMemoryNotes({ limit: 25 })
                .filter(candidate => candidate.id !== memoryNote.id),
            });

            for (const link of candidateLinks) {
              const existingLinks = store.listMemoryLinksByNote(link.toNoteId);
              const duplicate = existingLinks.some(existingLink => {
                return (
                  (existingLink.fromNoteId === link.fromNoteId && existingLink.toNoteId === link.toNoteId)
                  || (existingLink.fromNoteId === link.toNoteId && existingLink.toNoteId === link.fromNoteId)
                );
              });

              if (!duplicate) {
                store.insertMemoryLink(link);
              }
            }
          }

          store.confirmPendingMessageProcessed(claimedMessage.id, {
            claimedAt: claimedMessage.claimedAt,
            processedAt: new Date().toISOString(),
          });
        } catch (error) {
          store.markPendingMessageFailed(claimedMessage.id, {
            claimedAt: claimedMessage.claimedAt,
            processedAt: new Date().toISOString(),
            error: error.message,
          });
          throw error;
        }
      }
    }

    const tokenEstimate = estimateTokenUsage(sanitized.content);
    if (tokenEstimate >= 1) {
      if (tokenEstimate >= Math.round((controlPlane.contextBudget?.aggressiveThreshold || 0.85) * 1000)) {
        await appendGovernanceEvent({
          sessionId: sessionContext.sessionId,
          attemptId: sessionContext.attemptId,
          eventType: 'context-budget-aggressive-compression',
          decision: 'narrow-retrieval',
          reason: `estimated token budget ${tokenEstimate}`,
          artifactRef: {
            eventName,
          },
        });
      } else if (tokenEstimate >= Math.round((controlPlane.contextBudget?.warningThreshold || 0.7) * 1000)) {
        await appendGovernanceEvent({
          sessionId: sessionContext.sessionId,
          attemptId: sessionContext.attemptId,
          eventType: 'context-budget-warning',
          decision: 'warn',
          reason: `estimated token budget ${tokenEstimate}`,
          artifactRef: {
            eventName,
          },
        });
      }
    }

    if (eventName === 'session_end' || eventName === 'summary_checkpoint') {
      await rebuildViews();
    }
  } finally {
    store.close();
  }
}

async function run(rawInput, explicitEventName) {
  try {
    await persistLifecycleEvent(rawInput, explicitEventName);
  } catch (error) {
    process.stderr.write(`[session-lifecycle] ${error.message}\n`);
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
    persistLifecycleEvent(raw)
      .then(() => process.stdout.write(raw))
      .catch(error => {
        process.stderr.write(`[session-lifecycle] ${error.message}\n`);
        process.stdout.write(raw);
        process.exit(0);
      });
  });
}

module.exports = {
  buildCandidateMemoryLinks,
  estimateTokenUsage,
  extractPayload,
  parseRawInput,
  persistLifecycleEvent,
  resolveEventName,
  resolveSessionContext,
  run,
};
